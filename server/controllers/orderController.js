const Order = require('../models/Order');
const { reserveStock, restoreStock } = require('../utils/inventory');

const STOCK_RESTORE_STATUSES = ['cancelled', 'returned'];
const STOCK_ACTIVE_STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'paid'];

const getShippingStatusForOrderStatus = (status, currentShippingStatus) => {
  if (status === 'packed') return currentShippingStatus || 'ready';
  if (status === 'shipped') return 'in_transit';
  if (status === 'out_for_delivery') return 'out_for_delivery';
  if (status === 'delivered') return 'delivered';
  if (status === 'cancelled') return 'cancelled';
  if (status === 'returned') return 'returned';
  return currentShippingStatus || 'pending';
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res, next) => {
  try {
    const { products, items, userDetails, customer, totalPrice, total } = req.body;
    const orderItems = items || products;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    await reserveStock(orderItems);

    const order = new Order({
      items: orderItems,
      total: total ?? totalPrice,
      customer: customer || userDetails,
      paymentStatus: req.body.paymentStatus || 'pending',
      status: req.body.status || 'pending',
      shippingStatus: req.body.shippingStatus || 'pending',
      inventoryAdjusted: true
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Mock public for now)
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const nextStatus = req.body.status || order.status;
      const wasRestoredStatus = STOCK_RESTORE_STATUSES.includes(order.status);
      const isRestoredStatus = STOCK_RESTORE_STATUSES.includes(nextStatus);

      if (!isRestoredStatus && STOCK_ACTIVE_STATUSES.includes(nextStatus) && !order.inventoryAdjusted) {
        await reserveStock(order);
        order.inventoryAdjusted = true;
      }

      if (isRestoredStatus && order.inventoryAdjusted && !wasRestoredStatus) {
        await restoreStock(order);
        order.inventoryAdjusted = false;
      }

      order.status = nextStatus;
      order.shippingStatus = req.body.shippingStatus || getShippingStatusForOrderStatus(nextStatus, order.shippingStatus);
      order.courierName = req.body.courierName ?? order.courierName;
      order.trackingId = req.body.trackingId ?? order.trackingId;
      order.dispatchDate = req.body.dispatchDate || order.dispatchDate;
      order.deliveryDate = req.body.deliveryDate || order.deliveryDate;
      order.paymentStatus = req.body.paymentStatus || order.paymentStatus;

      await order.save();
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders by phone
// @route   GET /api/orders/user/:phone
exports.getOrdersByPhone = async (req, res, next) => {
  try {
    const orders = await Order.find({
      "customer.phone": req.params.phone
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};
