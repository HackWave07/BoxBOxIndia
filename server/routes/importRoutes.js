const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { importProducts } = require('../controllers/importController');

const memUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = (file.originalname.split('.').pop() || '').toLowerCase();
    if (ext === 'xlsx' || ext === 'csv') cb(null, true);
    else cb(new Error('Only .xlsx and .csv files are allowed'), false);
  },
});

router.post('/products', protect, authorizeRoles('owner'), memUpload.single('file'), importProducts);

module.exports = router;
