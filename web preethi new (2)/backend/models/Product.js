const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Kurti', 'Maternity Wears', 'Sarees', 'Jewelry', 'Handbags']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  isNew: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
    default: 100,
    min: [0, 'Stock cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  suppressReservedKeysWarning: true
});

// Index for faster queries
productSchema.index({ category: 1 });
productSchema.index({ isNew: 1 });

module.exports = mongoose.model('Product', productSchema);
