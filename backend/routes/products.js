const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');
const { authenticateAdmin } = require('../middleware/auth');

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// Admin routes (protected)
router.post('/', 
  authenticateAdmin, 
  upload.single('image'), 
  productController.createProduct
);

router.put('/:id', 
  authenticateAdmin, 
  upload.single('image'), 
  productController.updateProduct
);

router.delete('/:id', authenticateAdmin, productController.deleteProduct);

module.exports = router;
