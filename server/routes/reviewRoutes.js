const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add a review
// @route   POST /api/reviews
router.post('/', protect, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const existingReview = await Review.findOne({ product: productId, user: req.user._id });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment
    });

    // Update product average rating
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(productId, {
      rating: avgRating.toFixed(1),
      reviews: reviews.length
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get featured reviews for home page
// @route   GET /api/reviews/featured
router.get('/featured', async (req, res) => {
  try {
    // Get latest 6 reviews if no featured ones are explicitly marked
    let reviews = await Review.find({ isFeatured: true })
      .populate('product', 'name brand images image')
      .limit(6);
      
    if (reviews.length === 0) {
      reviews = await Review.find()
        .populate('product', 'name brand images image')
        .sort({ createdAt: -1 })
        .limit(6);
    }
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
