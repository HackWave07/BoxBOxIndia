const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductsByRim } = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.route('/sizes').get(getProductsByRim);
router.route('/').get(getProducts).post(protect, authorizeRoles('owner'), createProduct);
router.route('/:id').get(getProductById).put(protect, authorizeRoles('owner'), updateProduct).delete(protect, authorizeRoles('owner'), deleteProduct);

module.exports = router;
