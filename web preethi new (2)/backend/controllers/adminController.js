const Admin = require('../models/Admin');
const AdminOtp = require('../models/AdminOtp');
const AdminSettings = require('../models/AdminSettings');
const Employee = require('../models/Employee');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Discount = require('../models/Discount');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Initialize Twilio only if credentials are properly configured
let twilioClient = null;
try {
  if (process.env.TWILIO_ACCOUNT_SID && 
      process.env.TWILIO_AUTH_TOKEN && 
      process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
    const twilio = require('twilio');
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log('[Twilio] SMS service initialized successfully');
  }
} catch (error) {
  console.log('[Twilio] SMS service not configured. Using mock SMS mode.');
}

const ADMIN_PHONE = '8438859659';

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS (Real SMS with Twilio or Mock)
const sendOTP = async (phoneNumber, otp) => {
  try {
    // If Twilio is properly configured, send real SMS
    if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      const message = await twilioClient.messages.create({
        body: `Your admin login OTP is: ${otp}. Valid for 10 minutes. Do not share this code.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${phoneNumber}` // Indian phone numbers - change +91 if different country
      });
      console.log(`[REAL SMS] OTP sent via Twilio to ${phoneNumber}. Message SID: ${message.sid}`);
      return true;
    } else {
      // Fallback to console logging if Twilio not configured
      console.log(`[MOCK SMS] OTP sent to ${phoneNumber}: ${otp}`);
      if (!process.env.TWILIO_ACCOUNT_SID) {
        console.log(`[TIP] To enable real SMS, set TWILIO_ACCOUNT_SID in .env file`);
      }
      return true;
    }
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    return false;
  }
};

// @desc    Request OTP for admin login
// @route   POST /api/admin/request-otp
// @access  Public
exports.requestOTP = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;

    // Validate phone number
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number. Please enter 10 digits.'
      });
    }

    // Only allow the authorized admin phone
    if (phoneNumber !== ADMIN_PHONE) {
      return res.status(403).json({
        success: false,
        error: 'This phone number is not authorized for admin access.'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save or update OTP
    await AdminOtp.updateOne(
      { phoneNumber },
      {
        phoneNumber,
        otp,
        otpExpiry,
        attempts: 0,
        isVerified: false
      },
      { upsert: true }
    );

    // Send OTP via SMS
    const smsSent = await sendOTP(phoneNumber, otp);

    if (!smsSent) {
      return res.status(500).json({
        success: false,
        error: 'Failed to send OTP. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your registered phone number.',
      data: {
        phoneNumber: phoneNumber.slice(0, -2) + 'XX' // Masked for security
      }
    });
  } catch (error) {
    console.error('Error in requestOTP:', error);
    next(error);
  }
};

// @desc    Direct login with phone number (no OTP)
// @route   POST /api/admin/login-phone
// @access  Public
exports.loginWithPhone = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;

    // Validate phone number
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number. Please enter 10 digits.'
      });
    }

    // Check if it's an employee
    if (phoneNumber === '9876543210') {
      // Employee login
      const employee = await Employee.findOne({ phoneNumber: phoneNumber });

      if (!employee) {
        return res.status(403).json({
          success: false,
          error: 'Employee account not found.'
        });
      }

      if (!employee.isActive) {
        return res.status(403).json({
          success: false,
          error: 'Employee account is inactive.'
        });
      }

      // Generate JWT token for employee
      const token = jwt.sign(
        { id: employee._id, phone: employee.phone, role: 'employee', type: 'employee' },
        process.env.JWT_SECRET || 'vedhas_clothing_super_secret_jwt_key_2024_change_in_production',
        { expiresIn: '24h' }
      );

      const employeeData = employee.toObject();
      delete employeeData.password;

      res.status(200).json({
        success: true,
        message: 'Employee login successful!',
        data: {
          admin: {
            ...employeeData,
            name: employee.name || 'Employee',
            role: 'employee',
            type: 'employee'
          },
          token: token
        }
      });
      return;
    }

    // Check if it's the main admin phone
    if (phoneNumber !== ADMIN_PHONE) {
      return res.status(403).json({
        success: false,
        error: 'This phone number is not authorized for admin access.'
      });
    }

    // Admin login
    let admin = await Admin.findOne({ phoneNumber });

    if (!admin) {
      // Create new admin on first login
      admin = new Admin({
        phoneNumber: phoneNumber,
        name: 'Admin',
        password: 'admin123',
        role: 'super-admin',
        isActive: true,
        lastLogin: new Date()
      });
      await admin.save();

      // Create default settings
      await AdminSettings.create({
        adminId: admin._id,
        modules: {
          userManagement: { enabled: true },
          stockManagement: { enabled: true },
          orderManagement: { enabled: true },
          discountManagement: { enabled: true }
        }
      });

      console.log(`New admin created for phone: ${phoneNumber}`);
    } else {
      // Update last login
      admin.lastLogin = new Date();
      await admin.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, phoneNumber: admin.phoneNumber, role: admin.role },
      process.env.JWT_SECRET || 'vedhas_clothing_super_secret_jwt_key_2024_change_in_production',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const adminData = admin.toObject();
    delete adminData.password;

    res.status(200).json({
      success: true,
      message: 'Admin login successful!',
      data: {
        admin: adminData,
        token: token
      }
    });
  } catch (error) {
    console.error('Error in loginWithPhone:', error);
    next(error);
  }
};

// @desc    Verify OTP and login admin
// @route   POST /api/admin/verify-otp
// @access  Public
exports.verifyOTP = async (req, res, next) => {
  try {
    const { phoneNumber, otp } = req.body;

    // Validate inputs
    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and OTP are required.'
      });
    }

    if (phoneNumber !== ADMIN_PHONE) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized phone number.'
      });
    }

    // Find OTP record
    const otpRecord = await AdminOtp.findOne({ phoneNumber });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        error: 'OTP not found. Please request a new OTP.'
      });
    }

    // Check OTP expiry
    if (otpRecord.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'OTP expired. Please request a new OTP.'
      });
    }

    // Check max attempts
    if (otpRecord.attempts >= 5) {
      return res.status(400).json({
        success: false,
        error: 'Maximum OTP attempts exceeded. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({
        success: false,
        error: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.`
      });
    }

    // OTP verified
    otpRecord.isVerified = true;
    await otpRecord.save();

    // Find or create admin
    let admin = await Admin.findOne({ phoneNumber });

    if (!admin) {
      // Create default admin on first login
      admin = await Admin.create({
        phoneNumber,
        name: 'Admin',
        password: 'admin123', // Default password - should be changed
        role: 'super-admin',
        isActive: true
      });

      // Create admin settings
      await AdminSettings.create({
        adminId: admin._id,
        modules: {
          userManagement: { enabled: true },
          stockManagement: { enabled: true },
          orderManagement: { enabled: true },
          discountManagement: { enabled: true }
        }
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, phoneNumber: admin.phoneNumber, role: admin.role },
      process.env.JWT_SECRET || 'admin-secret-key',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Admin login successful.',
      data: {
        token,
        admin: {
          id: admin._id,
          phoneNumber: admin.phoneNumber,
          name: admin.name,
          role: admin.role
        }
      }
    });
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    next(error);
  }
};

// @desc    Get admin settings
// @route   GET /api/admin/settings
// @access  Private (Admin)
exports.getAdminSettings = async (req, res, next) => {
  try {
    const adminId = req.admin.id;

    let settings = await AdminSettings.findOne({ adminId });

    if (!settings) {
      settings = await AdminSettings.create({
        adminId,
        modules: {
          userManagement: { enabled: true },
          stockManagement: { enabled: true },
          orderManagement: { enabled: true },
          discountManagement: { enabled: true }
        }
      });
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admin settings (toggle modules)
// @route   PUT /api/admin/settings
// @access  Private (Admin)
exports.updateAdminSettings = async (req, res, next) => {
  try {
    const adminId = req.admin.id;
    const { modules, employeePermissions } = req.body;

    let settings = await AdminSettings.findOne({ adminId });

    if (!settings) {
      settings = new AdminSettings({ adminId });
    }

    if (modules) {
      settings.modules = { ...settings.modules, ...modules };
    }

    if (employeePermissions) {
      settings.employeePermissions = { ...settings.employeePermissions, ...employeePermissions };
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully.',
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (User Management)
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const adminId = req.admin.id;
    const settings = await AdminSettings.findOne({ adminId });

    if (!settings?.modules?.userManagement?.enabled) {
      return res.status(403).json({
        success: false,
        error: 'User Management module is disabled.'
      });
    }

    const users = await User.find().select('-password');
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        users
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:userId
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const adminId = req.admin.id;
    const { userId } = req.params;

    const settings = await AdminSettings.findOne({ adminId });

    if (!settings?.modules?.userManagement?.enabled) {
      return res.status(403).json({
        success: false,
        error: 'User Management module is disabled.'
      });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products (Stock Management)
// @route   GET /api/admin/stock
// @access  Private (Admin)
exports.getStockManagement = async (req, res, next) => {
  try {
    // Skip module check for employees - they have their own permissions
    if (req.admin.role !== 'employee') {
      const adminId = req.admin.id;
      const settings = await AdminSettings.findOne({ adminId });

      if (!settings?.modules?.stockManagement?.enabled) {
        return res.status(403).json({
          success: false,
          error: 'Stock Management module is disabled.'
        });
      }
    }

    const products = await Product.find();
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        products
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product stock
// @route   PUT /api/admin/stock/:productId
// @access  Private (Admin)
exports.updateStock = async (req, res, next) => {
  try {
    // Skip module check for employees - they have their own permissions
    if (req.admin.role !== 'employee') {
      const adminId = req.admin.id;
      const settings = await AdminSettings.findOne({ adminId });

      if (!settings?.modules?.stockManagement?.enabled) {
        return res.status(403).json({
          success: false,
          error: 'Stock Management module is disabled.'
        });
      }
    }

    const { productId } = req.params;
    const { stock, price } = req.body;

    const product = await Product.findByIdAndUpdate(
      productId,
      { stock, price },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully.',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Order Management)
// @route   GET /api/admin/orders
// @access  Private (Admin)
exports.getOrderManagement = async (req, res, next) => {
  try {
    // Skip module check for employees - they have their own permissions
    if (req.admin.role !== 'employee') {
      const adminId = req.admin.id;
      const settings = await AdminSettings.findOne({ adminId });

      if (!settings?.modules?.orderManagement?.enabled) {
        return res.status(403).json({
          success: false,
          error: 'Order Management module is disabled.'
        });
      }
    }

    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 });
    
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        orders
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:orderId
// @access  Private (Admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    // Skip module check for employees - they have their own permissions
    if (req.admin.role !== 'employee') {
      const adminId = req.admin.id;
      const settings = await AdminSettings.findOne({ adminId });

      if (!settings?.modules?.orderManagement?.enabled) {
        return res.status(403).json({
          success: false,
          error: 'Order Management module is disabled.'
        });
      }
    }

    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status.'
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully.',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create discount
// @route   POST /api/admin/discounts
// @access  Private (Admin)
exports.createDiscount = async (req, res, next) => {
  try {
    const adminId = req.admin.id;
    const { code, percentage, maxUses, expiryDate, description } = req.body;

    // Validate input
    if (!code || !percentage || !expiryDate) {
      return res.status(400).json({
        success: false,
        error: 'Code, percentage, and expiry date are required.'
      });
    }

    if (percentage < 0 || percentage > 100) {
      return res.status(400).json({
        success: false,
        error: 'Percentage must be between 0 and 100.'
      });
    }

    // Skip module check for employees - they have their own permissions
    if (req.admin.role !== 'employee') {
      const settings = await AdminSettings.findOne({ adminId });

      if (!settings?.modules?.discountManagement?.enabled) {
        return res.status(403).json({
          success: false,
          error: 'Discount Management module is disabled.'
        });
      }
    }

    // Check if discount code already exists
    const existingDiscount = await Discount.findOne({ code: code.toUpperCase() });
    if (existingDiscount) {
      return res.status(400).json({
        success: false,
        error: 'Discount code already exists.'
      });
    }

    // Create discount
    const discount = await Discount.create({
      code: code.toUpperCase(),
      description,
      percentage,
      maxUses: maxUses || null,
      currentUses: 0,
      expiryDate: new Date(expiryDate),
      adminId,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Discount created successfully.',
      data: discount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all discounts
// @route   GET /api/admin/discounts
// @access  Private (Admin)
exports.getAllDiscounts = async (req, res, next) => {
  try {
    const adminId = req.admin.id;
    
    // Skip module check for employees - they have their own permissions
    if (req.admin.role !== 'employee') {
      const settings = await AdminSettings.findOne({ adminId });

      if (!settings?.modules?.discountManagement?.enabled) {
        return res.status(403).json({
          success: false,
          error: 'Discount Management module is disabled.'
        });
      }
    }

    const discounts = await Discount.find({ adminId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: discounts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete discount
// @route   DELETE /api/admin/discounts/:discountId
// @access  Private (Admin)
exports.deleteDiscount = async (req, res, next) => {
  try {
    const adminId = req.admin.id;
    const { discountId } = req.params;

    // Skip module check for employees - they have their own permissions
    if (req.admin.role !== 'employee') {
      const settings = await AdminSettings.findOne({ adminId });

      if (!settings?.modules?.discountManagement?.enabled) {
        return res.status(403).json({
          success: false,
          error: 'Discount Management module is disabled.'
        });
      }
    }

    const discount = await Discount.findOneAndDelete({ _id: discountId, adminId });

    if (!discount) {
      return res.status(404).json({
        success: false,
        error: 'Discount not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Discount deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create employee
// @route   POST /api/admin/employees
// @access  Private (Admin)
exports.createEmployee = async (req, res, next) => {
  try {
    const adminId = req.admin.id;
    const { name, phoneNumber, email, password, permissions } = req.body;

    // Check if phone already exists
    const existingEmployee = await Employee.findOne({ phoneNumber });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        error: 'Phone number already registered.'
      });
    }

    const employee = await Employee.create({
      name,
      phoneNumber,
      email,
      password,
      adminId,
      permissions: permissions || { canAccessStock: true }
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully.',
      data: {
        id: employee._id,
        name: employee.name,
        phoneNumber: employee.phoneNumber,
        email: employee.email
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all employees
// @route   GET /api/admin/employees
// @access  Private (Admin)
exports.getEmployees = async (req, res, next) => {
  try {
    const adminId = req.admin.id;

    const employees = await Employee.find({ adminId }).select('-password');

    res.status(200).json({
      success: true,
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee permissions
// @route   PUT /api/admin/employees/:employeeId
// @access  Private (Admin)
exports.updateEmployeePermissions = async (req, res, next) => {
  try {
    const adminId = req.admin.id;
    const { employeeId } = req.params;
    const { permissions } = req.body;

    const employee = await Employee.findOne({ _id: employeeId, adminId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found.'
      });
    }

    employee.permissions = { ...employee.permissions, ...permissions };
    await employee.save();

    res.status(200).json({
      success: true,
      message: 'Employee permissions updated successfully.',
      data: {
        id: employee._id,
        name: employee.name,
        permissions: employee.permissions
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee
// @route   DELETE /api/admin/employees/:employeeId
// @access  Private (Admin)
exports.deleteEmployee = async (req, res, next) => {
  try {
    const adminId = req.admin.id;
    const { employeeId } = req.params;

    const employee = await Employee.findOneAndDelete({ _id: employeeId, adminId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
