const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingDetails, subtotal, tax, total } = req.body;
    if (!shippingDetails || !shippingDetails.fullName || !shippingDetails.email || !shippingDetails.address) {
      return res.status(400).json({
        success: false,
        error: 'Please provide complete shipping details'
      });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No items in order'
      });
    }
    for (let item of items) {
      const product = await Product.findOne({ id: item.productId });
      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product ${item.name} not found`
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for ${item.name}. Available: ${product.stock}`
        });
      }
      product.stock -= item.quantity;
      await product.save();
    }
    const order = await Order.create({
      user: req.user.id,
      items: items.map(item => ({
        product: item.product,
        productId: item.productId || item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        quantity: item.quantity
      })),
      shippingDetails,
      subtotal: subtotal || total,
      tax: tax || 0,
      total,
      status: 'pending',
      paymentStatus: 'completed'
    });
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [] }
    );
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product');
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    // Make sure user is order owner or admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'fullName email')
      .populate('items.product');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Please provide order status'
      });
    }
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order status'
      });
    }
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: order
    });
  } catch (error) {
    next(error);
  }
};
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this order'
      });
    }

    // Only allow cancellation if order is pending or processing
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel order in current status'
      });
    }

    // Restore product stock
    for (let item of order.items) {
      const product = await Product.findOne({ id: item.productId });
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};
