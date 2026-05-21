const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const { reserveStock, validateStock } = require("../utils/inventory");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, cartItems } = req.body;

    if (Array.isArray(cartItems) && cartItems.length > 0) {
      await validateStock(cartItems);
    }

    const options = {
      amount: Math.round(amount * 100), // in paise, using Math.round to avoid floating point issues
      currency: "INR",
      receipt: "receipt_order_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ error: "Payment order failed" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartItems,
      total,
      customer,
      user
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid Signature" });
    }

    const existingOrder = await Order.findOne({ paymentId: razorpay_payment_id });
    if (existingOrder) {
      return res.json({ success: true, order: existingOrder });
    }

    await reserveStock(cartItems);

    const order = new Order({
      user: user || null,
      items: cartItems,
      total,
      customer,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      signature: razorpay_signature,
      paymentStatus: "paid",
      status: "confirmed",
      shippingStatus: "pending",
      inventoryAdjusted: true
    });

    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};
