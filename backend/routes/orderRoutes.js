// const express = require('express');
// const router = express.Router();
// const {
//   createOrder,
//   getMyOrders,
//   getOrderById,
//   getAllOrders,
//   updateOrderStatus
// } = require('../controllers/orderController');
// const { protect } = require('../middleware/authMiddleware');
// const { adminMiddleware } = require('../middleware/adminMiddleware');

// router.post('/', protect, createOrder);
// router.get('/myorders', protect, getMyOrders);
// router.get('/:id', protect, getOrderById);

// // Admin only routes
// router.get('/admin/orders', protect, adminMiddleware, getAllOrders);
// router.put('/admin/orders/:id/status', protect, adminMiddleware, updateOrderStatus);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getMyOrders, 
  getOrderById, 
  getAllOrders, 
  updateOrderStatus,
  cancelOrder 
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');


// User routes
router.route('/')
  .post(protect, createOrder)
  .get(protect, getMyOrders);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/cancel')
  .put(protect, cancelOrder);

// Admin routes
router.route('/admin/orders')
  .get(protect, adminMiddleware, getAllOrders);

router.route('/admin/orders/:id/status')
  .put(protect, adminMiddleware, updateOrderStatus);

module.exports = router;