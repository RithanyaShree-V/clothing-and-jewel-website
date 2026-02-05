const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Discount code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  percentage: {
    type: Number,
    required: [true, 'Discount percentage is required'],
    min: [0, 'Percentage must be at least 0'],
    max: [100, 'Percentage cannot exceed 100']
  },
  maxUses: {
    type: Number,
    default: null // null means unlimited
  },
  currentUses: {
    type: Number,
    default: 0
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster lookups
discountSchema.index({ code: 1 });
discountSchema.index({ expiryDate: 1 });

module.exports = mongoose.model('Discount', discountSchema);
