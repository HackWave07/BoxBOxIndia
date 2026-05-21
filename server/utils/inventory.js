const Product = require('../models/Product');

const getItemProductId = (item) => item?.product || item?.productId || item?._id || item?.id;

const getItemQuantity = (item) => {
  const quantity = Number(item?.quantity);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
};

const getOrderItems = (orderOrItems) => {
  if (Array.isArray(orderOrItems)) return orderOrItems;
  return orderOrItems?.items || orderOrItems?.products || [];
};

const reserveStock = async (orderOrItems) => {
  const items = getOrderItems(orderOrItems);
  const adjusted = [];

  for (const item of items) {
    const productId = getItemProductId(item);
    const quantity = getItemQuantity(item);
    if (!productId) continue;

    const product = await Product.findOneAndUpdate(
      { _id: productId, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      { new: true }
    );

    if (!product) {
      for (const reserved of adjusted) {
        await Product.findByIdAndUpdate(reserved.productId, { $inc: { stock: reserved.quantity } });
      }

      const currentProduct = await Product.findById(productId).select('name stock');
      const available = currentProduct?.stock ?? 0;
      const name = currentProduct?.name || item?.name || 'This product';
      const error = new Error(`${name} has only ${available} unit${available === 1 ? '' : 's'} available`);
      error.statusCode = 400;
      throw error;
    }

    adjusted.push({ productId, quantity });
  }
};

const restoreStock = async (orderOrItems) => {
  const items = getOrderItems(orderOrItems);

  for (const item of items) {
    const productId = getItemProductId(item);
    const quantity = getItemQuantity(item);
    if (!productId) continue;

    await Product.findByIdAndUpdate(productId, { $inc: { stock: quantity } });
  }
};

const validateStock = async (orderOrItems) => {
  const items = getOrderItems(orderOrItems);

  for (const item of items) {
    const productId = getItemProductId(item);
    const quantity = getItemQuantity(item);
    if (!productId) continue;

    const product = await Product.findById(productId).select('name stock');
    if (!product || product.stock < quantity) {
      const available = product?.stock ?? 0;
      const name = product?.name || item?.name || 'This product';
      const error = new Error(`${name} has only ${available} unit${available === 1 ? '' : 's'} available`);
      error.statusCode = 400;
      throw error;
    }
  }
};

module.exports = {
  reserveStock,
  restoreStock,
  validateStock
};
