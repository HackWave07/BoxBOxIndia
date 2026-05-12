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
  'off-road': ['SUV/4x4', 'All-Terrain / Offroad', 'ADV & Dual Sport', 'Motocross', 'Offroad', 'Off-road', 'All Terrain'],
  'cruiser': ['Cruiser', 'Cruisers'],
  'touring': ['Sport / Touring', 'Sport Touring', 'Touring'],
  
  // Motorcycle Specific
  'adv': ['ADV & Dual Sport', 'Adventure', 'ADV'],
  'motocross': ['Motocross', 'Dirt', 'MX'],
  'vintage': ['Vintage', 'Classic'],
  
  // Car Specific
  'hatchback': ['Hatchback / Small Cars', 'Hatchback'],
  'sedan': ['Sedan / Premium', 'Sedan'],
  'suv': ['SUV / MUV', 'SUV/4x4', 'SUV'],
  'ev': ['EV / Electric', 'Electric', 'EV'],
  
  // Parts
  'brakes': ['Brakes', 'Braking'],
  'suspension': ['Suspension'],
  'chain-sprockets': ['Chain & Sprockets', 'Drivetrain', 'Chain'],
  'engine': ['Engine Upgrades', 'Engine'],
  'exhaust': ['Exhaust Systems', 'Exhaust'],
  'accessories': ['Accessories']
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
