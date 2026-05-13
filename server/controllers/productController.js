const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('relatedParts');
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Public (Mock Admin)
exports.createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public (Mock Admin)
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public (Mock Admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json({ message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch products by rim size and flatten sizes
// @route   GET /api/products/sizes
// @access  Public
exports.getProductsByRim = async (req, res, next) => {
  try {
    const rim = parseInt(req.query.rim);
    if (!rim) {
      res.status(400);
      throw new Error('Rim size is required');
    }

    const products = await Product.find({ 'sizes.rim': rim });
    
    // Flatten sizes and remove duplicates
    const allSizes = products.flatMap(p => 
      p.sizes.filter(s => s.rim === rim).map(s => ({
        ...s.toObject(),
        productName: p.name,
        brand: p.brand
      }))
    );

    // Filter duplicates by the 'size' string
    const uniqueSizes = Array.from(new Set(allSizes.map(s => s.size)))
      .map(size => allSizes.find(s => s.size === size));

    res.json(uniqueSizes);
  } catch (error) {
    next(error);
  }
};
