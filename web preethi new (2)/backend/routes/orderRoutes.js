const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const { protect, authorize } = require('../middleware/auth');
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');

// Validation rules
const createOrderValidation = [
  body('items')
    .isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('shippingDetails.fullName')
    .trim()
    .notEmpty().withMessage('Full name is required'),
  body('shippingDetails.email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('shippingDetails.address')
    .trim()
    .notEmpty().withMessage('Address is required'),
  body('total')
    .notEmpty().withMessage('Total is required')
    .isFloat({ min: 0 }).withMessage('Total must be a positive number')
];

const updateStatusValidation = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status')
];

// All order routes require authentication
router.use(protect);

// User routes
router.post('/', createOrderValidation, validate, createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

// Admin routes
router.get('/admin/all', authorize('admin'), getAllOrders);
router.put('/:id/status', authorize('admin'), updateStatusValidation, validate, updateOrderStatus);

module.exports = router;
