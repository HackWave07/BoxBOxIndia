const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

// ─── IMAGE MAP ───────────────────────────────────────────────
const IMG = {
  // Pilot Sport 4S
  ps4s: [
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop', // Side
    'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800&auto=format&fit=crop', // Tread/Close
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&auto=format&fit=crop', // Angle
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&auto=format&fit=crop', // Car
  ],
  // P Zero
  pzero: [
    'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547245324-d777c6f05e80?w=800&auto=format&fit=crop',
  ],
  // All Terrain
  offroad: [
    'https://images.unsplash.com/photo-1547245324-d777c6f05e80?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop',
  ],
  // Moto Sport
  motosport: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop',
  ],
  // Parts
  parts: [
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504222490345-c075b626eba7?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512428559087-560ad51ba42b?w=800&auto=format&fit=crop',
  ]
};

const mockProducts = [
  // ── CAR PERFORMANCE TYRES ──────────────────────────────────
  {
    name: 'Pilot Sport 4S',
    brand: 'Michelin',
    type: 'tyre',
    price: 24500,
    category: 'Performance',
    tyreSize: '245/35 R20',
    stock: 20,
    images: IMG.ps4s,
    description: 'The standard for high performance driving. Elite dry grip and wet braking capabilities.',
    specs: { grip: '99%', mileage: '40,000 km', durability: 'High' },
    sizes: [
      { size: '245/35 R20', rim: 20, loadIndex: '95Y', sku: 'MSPN-101', stock: true },
      { size: '255/35 R20', rim: 20, loadIndex: '97Y', sku: 'MSPN-102', stock: true },
      { size: '245/40 R19', rim: 19, loadIndex: '98Y', sku: 'MSPN-103', stock: true },
      { size: '275/35 R19', rim: 19, loadIndex: '100Y', sku: 'MSPN-104', stock: true }
    ]
  },
  {
    name: 'P Zero Trofeo R',
    brand: 'Pirelli',
    type: 'tyre',
    price: 32000,
    category: 'Performance',
    tyreSize: '305/30 R20',
    stock: 12,
    images: IMG.pzero,
    description: 'Street-legal track tyre engineered for pure lap times and maximum lateral G-forces.',
    specs: { grip: '100%', mileage: '20,000 km', durability: 'Track-Focused' },
    sizes: [
      { size: '305/30 R20', rim: 20, loadIndex: '103Y', sku: 'PZ-201', stock: true },
      { size: '245/35 R20', rim: 20, loadIndex: '95Y', sku: 'PZ-202', stock: true },
      { size: '305/30 R19', rim: 19, loadIndex: '102Y', sku: 'PZ-203', stock: true }
    ]
  },
  {
    name: 'Wanderer AT',
    brand: 'MRF',
    type: 'tyre',
    price: 9500,
    category: 'SUV/4x4',
    tyreSize: '235/65 R17',
    stock: 45,
    images: IMG.offroad,
    description: 'All-Terrain domination for Indian road conditions. High puncture resistance.',
    specs: { grip: '82%', mileage: '80,000 km', durability: 'Extreme' },
    compatibility: [
      { vehicleType: 'SUV', brand: 'Mahindra', model: 'Thar', year: '2023' },
      { vehicleType: 'SUV', brand: 'Mahindra', model: 'Scorpio', year: '2022' }
    ],
    sizes: [
      { size: '235/65 R17', rim: 17, loadIndex: '104H', sku: 'MRF-701', stock: true },
      { size: '245/65 R17', rim: 17, loadIndex: '107H', sku: 'MRF-702', stock: true },
      { size: '265/60 R18', rim: 18, loadIndex: '110T', sku: 'MRF-703', stock: true }
    ]
  },
  {
    name: 'Scorpion Rally STR',
    brand: 'Pirelli',
    type: 'tyre',
    price: 18000,
    category: 'ADV & Dual Sport',
    tyreSize: '150/70 R17',
    stock: 12,
    images: IMG.motosport,
    description: 'Perfect for ADV riders who won\'t compromise on dirt or asphalt.',
    specs: { grip: '90%', mileage: '25,000 km', durability: 'High' },
    compatibility: [
      { vehicleType: 'Motorcycle', brand: 'KTM', model: '390 Adventure', year: '2023' },
      { vehicleType: 'Motorcycle', brand: 'Royal Enfield', model: 'Himalayan', year: '2022' }
    ],
    sizes: [
      { size: '150/70 R17', rim: 17, loadIndex: '69V', sku: 'PZ-M101', stock: true },
      { size: '170/60 R17', rim: 17, loadIndex: '72V', sku: 'PZ-M102', stock: true }
    ]
  },
  {
    name: 'Brembo Sintered Brake Pads',
    brand: 'Brembo',
    type: 'part',
    price: 3500,
    category: 'Brakes',
    tyreSize: 'N/A',
    stock: 50,
    images: IMG.parts,
    description: 'High-performance sintered brake pads for maximum stopping power on track and street.',
    specs: { durability: 'High', grip: 'Aggressive Bite' },
    compatibility: [
      { vehicleType: 'Motorcycle', brand: 'KTM', model: '390 Duke', year: '2023' }
    ],
    sizes: []
  },
  {
    name: 'Ohlins STX 46 Street',
    brand: 'Ohlins',
    type: 'part',
    price: 45000,
    category: 'Suspension',
    tyreSize: 'N/A',
    stock: 5,
    images: IMG.parts,
    description: 'High-end rear shock absorber for improved comfort and handling on any road.',
    specs: { technology: 'Monotube', adjustment: 'Preload & Rebound' },
    compatibility: [
      { vehicleType: 'Motorcycle', brand: 'Kawasaki', model: 'Ninja 400', year: '2022' }
    ],
    sizes: []
  },
  {
    name: 'Akrapovic Slip-On Line',
    brand: 'Akrapovic',
    type: 'part',
    price: 85000,
    category: 'Exhaust',
    tyreSize: 'N/A',
    stock: 3,
    images: IMG.parts,
    description: 'Titanium exhaust system for weight reduction and a deep racing sound.',
    specs: { material: 'Titanium', weightReduction: '-2.5 kg' },
    compatibility: [
      { vehicleType: 'Motorcycle', brand: 'BMW', model: 'S1000RR', year: '2023' }
    ],
    sizes: []
  },
  {
    name: 'Energy Saver+',
    brand: 'Michelin',
    type: 'tyre',
    price: 5500,
    category: 'Hatchback',
    tyreSize: '175/65 R14',
    stock: 40,
    images: IMG.ps4s,
    description: 'Fuel-efficient tyres for city cars. Long-lasting and safe.',
    specs: { efficiency: 'A', mileage: '50,000 km' },
    sizes: [{ size: '175/65 R14', rim: 14, loadIndex: '82T', sku: 'M-ES-01', stock: true }]
  },
  {
    name: 'Turanza T005',
    brand: 'Bridgestone',
    type: 'tyre',
    price: 8500,
    category: 'Sedan',
    tyreSize: '205/55 R16',
    stock: 30,
    images: IMG.ps4s,
    description: 'Premium touring tyre for superior wet performance and comfort.',
    specs: { noise: 'Low', comfort: 'High' },
    sizes: [{ size: '205/55 R16', rim: 16, loadIndex: '91V', sku: 'B-T5-01', stock: true }]
  },
  {
    name: 'iON EVO',
    brand: 'Hankook',
    type: 'tyre',
    price: 15000,
    category: 'EV',
    tyreSize: '235/45 R18',
    stock: 20,
    images: IMG.ps4s,
    description: 'Specialized tyre for electric vehicles. Low rolling resistance and high torque handling.',
    specs: { rangeExtender: 'Yes', noiseReduction: 'Elite' },
    sizes: [{ size: '235/45 R18', rim: 18, loadIndex: '98Y', sku: 'H-ION-01', stock: true }]
  },
  {
    name: 'Cobra Chrome',
    brand: 'Avon',
    type: 'tyre',
    price: 19500,
    category: 'Cruiser',
    tyreSize: '150/80 R16',
    stock: 10,
    images: IMG.motosport,
    description: 'Premium cruiser tyre with cobra head detail. Exceptional stability.',
    specs: { style: 'Chrome Look', grip: 'Wet/Dry' },
    sizes: [{ size: '150/80 R16', rim: 16, loadIndex: '71V', sku: 'AV-CO-01', stock: true }]
  },
  {
    name: 'Roadtec 01 SE',
    brand: 'Metzeler',
    type: 'tyre',
    price: 22000,
    category: 'Sport Touring',
    tyreSize: '180/55 R17',
    stock: 15,
    images: IMG.motosport,
    description: 'The pinnacle of sport touring. Excellence in the wet and enhanced agility.',
    specs: { handling: 'Dynamic', mileage: '20,000 km' },
    sizes: [{ size: '180/55 R17', rim: 17, loadIndex: '73W', sku: 'MZ-RT-01', stock: true }]
  }
];

const importData = async () => {
  try {
    for (const product of mockProducts) {
      // Find existing product by name and brand to avoid duplicates
      const existingProduct = await Product.findOne({ name: product.name, brand: product.brand });
      
      if (!existingProduct) {
        // Only insert if it doesn't exist
        await Product.create(product);
        console.log(`+ Added: ${product.name}`);
      } else {
        // If it exists, only update price/stock/specs but PRESERVE images and description if they might have been edited in admin
        // Actually, the user says seeded products overwrite admin-edited ones. 
        // So we only update fields that are unlikely to be the "content" edited by admin, or just skip entirely if it exists.
        // Let's skip update if it exists to satisfy "seeded products do not overwrite admin-edited images".
        console.log(`~ Skipped (exists): ${product.name}`);
      }
    }
    console.log(`✓ Seeding complete!`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();
