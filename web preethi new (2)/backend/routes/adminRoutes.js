const express = require('express');
const adminController = require('../controllers/adminController');
const { protectAdmin, isAdmin } = require('../middleware/adminAuth');

const router = express.Router();

// Public routes
router.post('/request-otp', adminController.requestOTP);
router.post('/login-phone', adminController.loginWithPhone);
router.post('/verify-otp', adminController.verifyOTP);

// Protected routes
router.get('/settings', protectAdmin, isAdmin, adminController.getAdminSettings);
router.put('/settings', protectAdmin, isAdmin, adminController.updateAdminSettings);

// User Management
router.get('/users', protectAdmin, isAdmin, adminController.getAllUsers);
router.delete('/users/:userId', protectAdmin, isAdmin, adminController.deleteUser);

// Stock Management
router.get('/stock', protectAdmin, adminController.getStockManagement);
router.put('/stock/:productId', protectAdmin, isAdmin, adminController.updateStock);

// Order Management
router.get('/orders', protectAdmin, adminController.getOrderManagement);
router.put('/orders/:orderId', protectAdmin, isAdmin, adminController.updateOrderStatus);

// Discount Management
router.post('/discounts', protectAdmin, isAdmin, adminController.createDiscount);
router.get('/discounts', protectAdmin, adminController.getAllDiscounts);
router.delete('/discounts/:discountId', protectAdmin, isAdmin, adminController.deleteDiscount);

// Employee Management
router.post('/employees', protectAdmin, isAdmin, adminController.createEmployee);
router.get('/employees', protectAdmin, isAdmin, adminController.getEmployees);
router.put('/employees/:employeeId', protectAdmin, isAdmin, adminController.updateEmployeePermissions);
router.delete('/employees/:employeeId', protectAdmin, isAdmin, adminController.deleteEmployee);

module.exports = router;
