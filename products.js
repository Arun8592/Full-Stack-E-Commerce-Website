const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, createProduct, updateProduct,
  deleteProduct, createReview, getCategories, getAdminProducts,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

router.get('/categories', getCategories);
router.get('/admin/all', protect, admin, getAdminProducts);
router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id').get(getProduct).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);
router.post('/:id/reviews', protect, createReview);

module.exports = router;
