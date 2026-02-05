const mongoose = require('mongoose');

const adminOtpSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Phone number must be 10 digits']
  },
  otp: {
    type: String,
    required: true
  },
  otpExpiry: {
    type: Date,
    required: true,
    index: { expires: 0 } // Auto-delete after expiry
  },
  attempts: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdminOtp', adminOtpSchema);
