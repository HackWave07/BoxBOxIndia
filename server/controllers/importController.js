const XLSX = require('xlsx');
const Product = require('../models/Product');

const normalize = (str) => String(str || '').toLowerCase().trim().replace(/\s+/g, ' ');

const makeImportKey = (name, brand, vehicleCategory, tyreSize, category) =>
  [normalize(name), normalize(brand), normalize(vehicleCategory), normalize(tyreSize), normalize(category)].join('|');

const parseBool = (val) => {
  if (typeof val === 'boolean') return val;
  const s = String(val || '').toLowerCase().trim();
  return s === 'true' || s === '1' || s === 'yes' || s === 'y';
};

const parseNum = (val) => {
  if (val === null || val === undefined || String(val).trim() === '') return null;
  const n = Number(String(val).replace(/[₹,\s]/g, ''));
  return isNaN(n) ? null : n;
};

const getCol = (row, ...keys) => {
  for (const k of keys) {
    if (row[k] !== undefined && String(row[k]).trim() !== '') return String(row[k]).trim();
  }
  return '';
};

const mapRow = (rawRow) => {
  const r = rawRow;

  const vehicleTypeRaw = normalize(getCol(r, 'Vehicle Type', 'vehicleType', 'vehicle_type'));
  let vehicleCategory = '';
  if (vehicleTypeRaw.includes('car')) vehicleCategory = 'car';
  else if (vehicleTypeRaw.includes('motorcycle') || vehicleTypeRaw.includes('bike') || vehicleTypeRaw.includes('moto')) vehicleCategory = 'motorcycle';
  else vehicleCategory = vehicleTypeRaw;

  // Collect image URLs from common column names
  const imageUrls = [];
  const imageCols = ['image1', 'image2', 'image3', 'image4', 'Image1', 'Image2', 'Image3', 'Image4'];
  for (const col of imageCols) {
    const v = r[col] ? String(r[col]).trim() : '';
    if (v && !imageUrls.includes(v)) imageUrls.push(v);
  }
  // Comma-separated imageUrls column
  const urlsCol = r['imageUrls'] || r['ImageUrls'] || r['images'] || r['Images'] || '';
  if (urlsCol) {
    String(urlsCol).split(',').map(u => u.trim()).filter(Boolean).forEach(u => {
      if (!imageUrls.includes(u)) imageUrls.push(u);
    });
  }

  const name = getCol(r, 'Product Name', 'productName', 'name', 'Name');
  const brand = getCol(r, 'Brand', 'brand');
  const category = getCol(r, 'Category', 'category');
  const tyreSize = getCol(r, 'Tyre Size', 'tyreSize', 'tyre_size') || 'N/A';
  const description = getCol(r, 'Product Description', 'productDescription', 'description', 'Description');

  const price = parseNum(getCol(r, 'Selling Price (₹)', 'Selling Price', 'sellingPrice', 'price', 'Price'));
  const mrp = parseNum(getCol(r, 'MRP (₹)', 'MRP', 'mrp'));
  const stock = parseNum(getCol(r, 'Stock', 'stock'));

  return {
    name,
    brand,
    vehicleCategory,
    category,
    tyreSize,
    price,
    mrp,
    stock: stock !== null ? Math.max(0, stock) : 0,
    description,
    featuredOnHome: parseBool(getCol(r, 'Featured', 'featured', 'featuredOnHome')),
    seoTitle: getCol(r, 'SEO Title', 'seoTitle'),
    seoDescription: getCol(r, 'SEO Description', 'seoDescription'),
    images: imageUrls,
    type: 'tyre',
    specs: {
      loadIndex: getCol(r, 'Load Index', 'loadIndex'),
      speedRating: getCol(r, 'Speed Rating', 'speedRating'),
      warranty: getCol(r, 'Warranty', 'warranty'),
      mileage: getCol(r, 'Estimated Mileage', 'estimatedMileage'),
      vehicleCompatibility: getCol(r, 'Vehicle Compatibility', 'vehicleCompatibility'),
    },
    importKey: makeImportKey(name, brand, vehicleCategory, tyreSize, category),
  };
};

const validateRow = (product) => {
  const errors = [];
  if (!product.name) errors.push('Missing: Product Name');
  if (!product.brand) errors.push('Missing: Brand');
  if (!product.category) errors.push('Missing: Category');
  if (!product.description) errors.push('Missing: Product Description');
  if (product.price === null) errors.push('Missing or invalid: Selling Price');
  else if (product.price <= 0) errors.push('Selling Price must be > 0');
  if (product.mrp !== null && product.price !== null && product.mrp < product.price) {
    errors.push('MRP cannot be less than Selling Price');
  }
  return errors;
};

exports.importProducts = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const ext = (req.file.originalname.split('.').pop() || '').toLowerCase();
    if (!['xlsx', 'csv'].includes(ext)) {
      return res.status(400).json({ error: 'Only .xlsx and .csv files are supported' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer', raw: false });
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false, defval: '' });

    if (!rows || rows.length === 0) {
      return res.status(400).json({ error: 'Spreadsheet is empty or has no data rows' });
    }

    // Load existing import keys for dedup
    const existingDocs = await Product.find({}, { importKey: 1, name: 1 }).lean();
    const existingKeys = new Set(existingDocs.map(p => p.importKey).filter(Boolean));

    const results = [];
    const seenThisRun = new Set();

    for (let i = 0; i < rows.length; i++) {
      const rowIndex = i + 2;
      const rawRow = rows[i];

      if (Object.values(rawRow).every(v => String(v).trim() === '')) continue;

      let product;
      try {
        product = mapRow(rawRow);
      } catch (err) {
        results.push({ row: rowIndex, status: 'failed', name: '', reason: `Parse error: ${err.message}` });
        continue;
      }

      const errors = validateRow(product);
      if (errors.length > 0) {
        results.push({ row: rowIndex, status: 'failed', name: product.name || '(unnamed)', reason: errors.join('; ') });
        continue;
      }

      if (existingKeys.has(product.importKey) || seenThisRun.has(product.importKey)) {
        results.push({ row: rowIndex, status: 'duplicate', name: product.name, reason: 'Already exists (matched by name + brand + category + size)' });
        continue;
      }

      seenThisRun.add(product.importKey);

      try {
        await Product.create(product);
        existingKeys.add(product.importKey);
        results.push({ row: rowIndex, status: 'imported', name: product.name });
      } catch (err) {
        results.push({ row: rowIndex, status: 'failed', name: product.name, reason: err.message });
      }
    }

    return res.json({
      total: results.length,
      imported: results.filter(r => r.status === 'imported').length,
      duplicates: results.filter(r => r.status === 'duplicate').length,
      failed: results.filter(r => r.status === 'failed').length,
      results,
    });
  } catch (err) {
    console.error('Import error:', err);
    return res.status(500).json({ error: err.message || 'Import failed' });
  }
};
