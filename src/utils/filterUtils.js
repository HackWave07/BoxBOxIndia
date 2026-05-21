/**
 * Normalizes a string for robust comparison.
 * - Converts to lowercase
 * - Trims whitespace
 * - Replaces multiple spaces with a single space
 * - Removes spaces around slashes (e.g. "SUV / 4x4" -> "suv/4x4")
 */
export const normalize = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*\/\s*/g, '/');
};

/**
 * Mapping between URL slugs and actual database category values.
 * Supports single strings or arrays for multi-field matching.
 */
export const CATEGORY_MAP = {
  // Performance Sections
  'sport': ['Performance', 'Super Sports', 'Sport / Touring', 'Performance / Sports', 'Track / Street', 'Sport'],
  'sports': ['Performance', 'Performance / Sports', 'Track / Street'],
  'super sports': ['Super Sports', 'Sport'],
  'off-road': ['SUV/4x4', 'All-Terrain / Offroad', 'ADV & Dual Sport', 'Motocross', 'Offroad', 'Off-road', 'All Terrain'],
  'all terrain': ['SUV/4x4', 'All-Terrain / Offroad', 'All Terrain'],
  'mud terrain': ['SUV/4x4', 'All-Terrain / Offroad', 'Mud Terrain'],
  'atv': ['ATV'],
  'cruiser': ['Cruiser', 'Cruisers'],
  'cruisers': ['Cruiser', 'Cruisers'],
  'touring': ['Sport / Touring', 'Sport Touring', 'Touring'],
  'sport touring': ['Sport / Touring', 'Sport Touring', 'Touring'],
  
  // Motorcycle Specific
  'adv': ['ADV & Dual Sport', 'Adventure', 'ADV'],
  'motocross': ['Motocross', 'Dirt', 'MX'],
  'vintage': ['Vintage', 'Classic'],
  
  // Car Specific
  'hatchback': ['Hatchback / Small Cars', 'Hatchback'],
  'sedan': ['Sedan / Premium', 'Sedan'],
  'suv': ['SUV / MUV', 'SUV/4x4', 'SUV'],
  'suv 4x4': ['SUV / MUV', 'SUV/4x4', 'SUV'],
  'ev': ['EV / Electric', 'Electric', 'EV'],
  
  // Parts
  'brakes': ['Brakes', 'Braking'],
  'suspension': ['Suspension'],
  'chain-sprockets': ['Chain & Sprockets', 'Drivetrain', 'Chain'],
  'engine': ['Engine Upgrades', 'Engine'],
  'exhaust': ['Exhaust Systems', 'Exhaust'],
  'accessories': ['Accessories']
};

const MOTORCYCLE_CATEGORIES = [
  'ADV & Dual Sport',
  'Adventure',
  'Cruiser',
  'Cruisers',
  'Motocross',
  'Dirt',
  'MX',
  'Scooter',
  'Sport Touring',
  'Super Sports',
  'Vintage',
  'Classic'
];

const CAR_CATEGORIES = [
  'All Terrain',
  'All-Terrain / Offroad',
  'EV',
  'EV / Electric',
  'Electric',
  'Hatchback',
  'Hatchback / Small Cars',
  'Performance',
  'Performance / Sports',
  'Sedan',
  'Sedan / Premium',
  'SUV',
  'SUV/4x4',
  'SUV / MUV',
  'Track / Street'
];

export const getProductVehicleGroups = (product) => {
  const groups = new Set();

  product?.compatibility?.forEach((item) => {
    const vehicleType = normalize(item?.vehicleType);
    if (vehicleType === 'motorcycle' || vehicleType === 'bike') groups.add('motorcycle');
    if (['car', 'suv', 'ev'].includes(vehicleType)) groups.add('car');
  });

  if (MOTORCYCLE_CATEGORIES.some(category => normalize(category) === normalize(product?.category))) {
    groups.add('motorcycle');
  }

  if (CAR_CATEGORIES.some(category => normalize(category) === normalize(product?.category))) {
    groups.add('car');
  }

  return [...groups];
};

export const matchesVehicleGroup = (product, vehicleGroup) => {
  const normalizedVehicleGroup = normalize(vehicleGroup);
  if (!normalizedVehicleGroup) return true;
  return getProductVehicleGroups(product).includes(normalizedVehicleGroup);
};

/**
 * Compares a product field value against a filter value (often from URL).
 * Handles mapping lookups and falls back to normalized direct comparison.
 */
export const matchFilter = (productValue, filterValue) => {
  if (!filterValue) return true;
  if (!productValue) return false;

  const normalizedProduct = normalize(productValue);
  const normalizedFilter = normalize(filterValue);

  // 1. Check if filterValue is a known slug in the map
  const mappedValues = CATEGORY_MAP[normalizedFilter];
  
  if (mappedValues) {
    // If it's an array, check if any mapped value matches the product value
    if (Array.isArray(mappedValues)) {
      return mappedValues.some(mv => normalize(mv) === normalizedProduct);
    }
    // If it's a single string
    return normalize(mappedValues) === normalizedProduct;
  }

  // 2. Fallback: Direct normalized comparison
  // This handles case differences like "Brakes" vs "brakes" even if not in map
  return normalizedProduct === normalizedFilter;
};
