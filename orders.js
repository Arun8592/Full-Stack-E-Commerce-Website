const express = require('express');
const router = express.Router();
const {
  createOrder, createPaymentIntent, updateOrderToPaid,
  getMyOrders, getOrderById, getAllOrders, updateOrderStatus, getDashboardStats,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.post('/create-payment-intent', protect, createPaymentIntent);
router.get('/my', protect, getMyOrders);
router.get('/admin/all', protect, admin, getAllOrders);
router.get('/admin/stats', protect, admin, getDashboardStats);
router.route('/').post(protect, createOrder);
router.route('/:id').get(protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
