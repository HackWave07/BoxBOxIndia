const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrdersByPhone, updateOrderStatus, getMyOrders } = require('../controllers/orderController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.route('/').post(createOrder).get(protect, authorizeRoles('owner'), getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/user/:phone').get(getOrdersByPhone);
router.route('/:id').put(protect, authorizeRoles('owner'), updateOrderStatus);

module.exports = router;
