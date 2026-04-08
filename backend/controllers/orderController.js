// const Order = require('../models/Order');

// const createOrder = async (req, res) => {
//   try {
//     const { products, totalAmount, shippingAddress, paymentMethod } = req.body;
    
//     const order = new Order({
//       user: req.user._id,
//       products,
//       totalAmount,
//       shippingAddress,
//       paymentMethod,
//       orderStatus: 'pending'
//     });
    
//     const createdOrder = await order.save();
//     res.status(201).json(createdOrder);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user._id })
//       .populate('products.product', 'name images');
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate('user', 'name email')
//       .populate('products.product', 'name images');
    
//     if (order) {
//       res.json(order);
//     } else {
//       res.status(404).json({ message: 'Order not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({})
//       .populate('user', 'name email')
//       .populate('products.product', 'name')
//       .sort({ orderDate: -1 });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const updateOrderStatus = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
    
//     if (order) {
//       order.orderStatus = req.body.status;
      
//       if (req.body.status === 'delivered') {
//         order.deliveredAt = Date.now();
//       }
      
//       const updatedOrder = await order.save();
//       res.json(updatedOrder);
//     } else {
//       res.status(404).json({ message: 'Order not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };

const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
  try {
    const { products, totalAmount, shippingAddress, paymentMethod } = req.body;
    
    // Check stock availability before creating order
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }
    }
    
    const order = new Order({
      user: req.user._id,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      orderStatus: 'pending'
    });
    
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product', 'name images price stock')
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('products.product', 'name images price stock');
    
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('products.product', 'name price stock')
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const oldStatus = order.orderStatus;
    const newStatus = req.body.status;
    
    console.log(`Updating order ${order._id} from ${oldStatus} to ${newStatus}`);
    
    // Handle stock updates based on status change
    if (newStatus === 'confirmed' && oldStatus === 'pending') {
      // Reduce stock when order is confirmed
      for (const item of order.products) {
        const product = await Product.findById(item.product);
        if (product) {
          if (product.stock < item.quantity) {
            return res.status(400).json({ 
              message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
            });
          }
          product.stock -= item.quantity;
          await product.save();
          console.log(`Reduced stock for ${product.name}: ${product.stock} left`);
        }
      }
    } 
    else if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
      // Restore stock when order is cancelled (only if it was confirmed or shipped)
      if (oldStatus === 'confirmed' || oldStatus === 'shipped') {
        for (const item of order.products) {
          const product = await Product.findById(item.product);
          if (product) {
            product.stock += item.quantity;
            await product.save();
            console.log(`Restored stock for ${product.name}: ${product.stock} available`);
          }
        }
      }
    }
    
    order.orderStatus = newStatus;
    
    if (newStatus === 'delivered') {
      order.deliveredAt = Date.now();
    }
    
    const updatedOrder = await order.save();
    
    // Populate the updated order before sending response
    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate('user', 'name email')
      .populate('products.product', 'name price stock');
    
    res.json(populatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Only allow cancellation if order is pending or confirmed
    if (order.orderStatus !== 'pending' && order.orderStatus !== 'confirmed') {
      return res.status(400).json({ 
        message: `Cannot cancel order with status: ${order.orderStatus}` 
      });
    }
    
    console.log(`Cancelling order ${order._id} with status ${order.orderStatus}`);
    
    // Restore stock if order was confirmed
    if (order.orderStatus === 'confirmed') {
      for (const item of order.products) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
          console.log(`Restored stock for ${product.name}: ${product.stock} available`);
        }
      }
    }
    
    order.orderStatus = 'cancelled';
    const updatedOrder = await order.save();
    
    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate('user', 'name email')
      .populate('products.product', 'name price stock');
    
    res.json(populatedOrder);
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createOrder, 
  getMyOrders, 
  getOrderById, 
  getAllOrders, 
  updateOrderStatus,
  cancelOrder
};