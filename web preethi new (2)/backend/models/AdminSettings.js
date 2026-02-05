const mongoose = require('mongoose');

const adminSettingsSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
    unique: true
  },
  modules: {
    userManagement: {
      enabled: { type: Boolean, default: true },
      description: { type: String, default: 'Manage users, view profiles, delete accounts' }
    },
    stockManagement: {
      enabled: { type: Boolean, default: true },
      description: { type: String, default: 'Manage product inventory and stock levels' }
    },
    orderManagement: {
      enabled: { type: Boolean, default: true },
      description: { type: String, default: 'View and manage customer orders' }
    },
    discountManagement: {
      enabled: { type: Boolean, default: true },
      description: { type: String, default: 'Create and manage discounts and offers' }
    }
  },
  employeePermissions: {
    canAccessStock: { type: Boolean, default: true },
    canAccessOrders: { type: Boolean, default: false },
    canAccessUsers: { type: Boolean, default: false },
    canAccessDiscounts: { type: Boolean, default: false }
  },
  employees: [{
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    name: String,
    phone: String,
    permissions: {
      canAccessStock: Boolean,
      canAccessOrders: Boolean,
      canAccessUsers: Boolean,
      canAccessDiscounts: Boolean
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdminSettings', adminSettingsSchema);
