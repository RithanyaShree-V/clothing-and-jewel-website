const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const { protect } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
// Validation rules
const addToCartValidation = [
  body('productId')
    .notEmpty().withMessage('Product ID is required')
    .isNumeric().withMessage('Product ID must be a number'),
  body('quantity')
    .optional()
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

const updateCartValidation = [
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];
// All cart routes require authentication
router.use(protect);
router.get('/', getCart);
router.post('/', addToCartValidation, validate, addToCart);
router.put('/:productId', updateCartValidation, validate, updateCartItem);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);
module.exports = router;
