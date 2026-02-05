const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const { protect, authorize } = require('../middleware/auth');
const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} = require('../controllers/productController');

// Validation rules
const productValidation = [
  body('id')
    .notEmpty().withMessage('Product ID is required')
    .isNumeric().withMessage('Product ID must be a number'),
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['Kurti', 'Maternity Wears', 'Sarees', 'Jewelry', 'Handbags'])
    .withMessage('Invalid category'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('image')
    .notEmpty().withMessage('Image URL is required'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
];

// Public routes
router.get('/', getAllProducts);
router.get('/categories/all', getCategories);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), productValidation, validate, createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
