// const transporter = require('../config/email');
// const EmailService = require('./emailService');

// // Send welcome email on user registration
// const sendWelcomeEmail = async (user) => {
//   try {
//     const mailOptions = {
//       from: `"Om Sai Industries" <${process.env.EMAIL_USER}>`,
//       to: user.email,
//       subject: 'Welcome to Om Sai Industries! 🎉',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <style>
//             body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
//             .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background: linear-gradient(135deg, #2563eb, #1e40af); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//             .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
//             .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
//             .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>Welcome to Om Sai Industries! 🎉</h1>
//             </div>
//             <div class="content">
//               <h2>Hello ${user.name}!</h2>
//               <p>Thank you for registering with Om Sai Industries. We're excited to have you as part of our family!</p>
//               <p>With your new account, you can:</p>
//               <ul>
//                 <li>Browse our extensive collection of quality products</li>
//                 <li>Track your orders in real-time</li>
//                 <li>Get exclusive offers and discounts</li>
//                 <li>Save your favorite items to wishlist</li>
//               </ul>
//               <div style="text-align: center;">
//                 <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" class="button">Start Shopping Now</a>
//               </div>
//               <p style="margin-top: 20px;">If you have any questions, feel free to contact our support team.</p>
//               <p>Best regards,<br><strong>Om Sai Industries Team</strong></p>
//             </div>
//             <div class="footer">
//               <p>&copy; ${new Date().getFullYear()} Om Sai Industries. All rights reserved.</p>
//               <p>This is an automated message, please do not reply.</p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     };
    
//     await transporter.sendMail(mailOptions);
//     console.log(`Welcome email sent to ${user.email}`);
//     return true;
//   } catch (error) {
//     console.error('Error sending welcome email:', error);
//     return false;
//   }
// };

// // Send order confirmation to customer
// const sendOrderConfirmation = async (order, user) => {
//   try {
//     // Calculate order summary
//     const itemsList = order.products.map(item => `
//       <tr>
//         <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.product?.name || 'Product'}</td>
//         <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
//         <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.price?.toLocaleString()}</td>
//         <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${(item.price * item.quantity).toLocaleString()}</td>
//       </tr>
//     `).join('');
    
//     const mailOptions = {
//       from: `"Om Sai Industries" <${process.env.EMAIL_USER}>`,
//       to: user.email,
//       subject: `Order Confirmation - #${order._id.toString().slice(-8)}`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <style>
//             body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
//             .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background: linear-gradient(135deg, #22c55e, #15803d); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//             .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
//             .order-details { background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; }
//             table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//             th { background: #f3f4f6; padding: 10px; text-align: left; }
//             td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
//             .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
//             .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>Order Confirmed! ✅</h1>
//               <p>Order #${order._id.toString().slice(-8)}</p>
//             </div>
//             <div class="content">
//               <h2>Hello ${user.name}!</h2>
//               <p>Thank you for your order! Your order has been successfully placed and is being processed.</p>
              
//               <div class="order-details">
//                 <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
//                 <p><strong>Payment Method:</strong> ${order.paymentMethod || 'Cash on Delivery'}</p>
//                 <p><strong>Shipping Address:</strong><br>
//                 ${order.shippingAddress?.street}, ${order.shippingAddress?.city}<br>
//                 ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}<br>
//                 ${order.shippingAddress?.country}
//                 </p>
//               </div>
              
//               <h3>Order Summary</h3>
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Product</th>
//                     <th>Quantity</th>
//                     <th>Price</th>
//                     <th>Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   ${itemsList}
//                 </tbody>
//                 <tfoot>
//                   <tr>
//                     <td colspan="3" style="text-align: right; font-weight: bold;">Total Amount:</td>
//                     <td style="font-weight: bold; color: #2563eb;">₹${order.totalAmount.toLocaleString()}</td>
//                   </tr>
//                 </tfoot>
//               </table>
              
//               <div style="text-align: center;">
//                 <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order._id}" class="button">Track Your Order</a>
//               </div>
              
//               <p style="margin-top: 20px;">We'll notify you once your order is confirmed and shipped.</p>
//               <p>Best regards,<br><strong>Om Sai Industries Team</strong></p>
//             </div>
//             <div class="footer">
//               <p>&copy; ${new Date().getFullYear()} Om Sai Industries. All rights reserved.</p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     };
    
//     await transporter.sendMail(mailOptions);
//     console.log(`Order confirmation sent to ${user.email}`);
//     return true;
//   } catch (error) {
//     console.error('Error sending order confirmation:', error);
//     return false;
//   }
// };

// // Send order status update email
// const sendOrderStatusUpdate = async (order, user, oldStatus, newStatus) => {
//   try {
//     const statusColors = {
//       pending: '#f59e0b',
//       confirmed: '#22c55e',
//       shipped: '#3b82f6',
//       delivered: '#10b981',
//       cancelled: '#ef4444'
//     };
    
//     const statusMessages = {
//       pending: 'Your order is pending confirmation.',
//       confirmed: 'Great news! Your order has been confirmed and is being prepared.',
//       shipped: 'Your order is on the way! Track your shipment.',
//       delivered: 'Your order has been delivered. Enjoy your purchase!',
//       cancelled: 'Your order has been cancelled.'
//     };
    
//     const mailOptions = {
//       from: `"Om Sai Industries" <${process.env.EMAIL_USER}>`,
//       to: user.email,
//       subject: `Order Status Update - #${order._id.toString().slice(-8)}`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <style>
//             body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
//             .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background: ${statusColors[newStatus]}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//             .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
//             .status-box { background: #f9fafb; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
//             .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>Order Status Updated! 📦</h1>
//               <p>Order #${order._id.toString().slice(-8)}</p>
//             </div>
//             <div class="content">
//               <h2>Hello ${user.name}!</h2>
//               <div class="status-box">
//                 <p style="font-size: 18px; margin: 0;">Status changed from <strong>${oldStatus}</strong> to <strong style="color: ${statusColors[newStatus]};">${newStatus}</strong></p>
//                 <p style="margin-top: 10px;">${statusMessages[newStatus]}</p>
//               </div>
              
//               <div style="text-align: center;">
//                 <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order._id}" class="button">View Order Details</a>
//               </div>
              
//               <p style="margin-top: 20px;">Thank you for shopping with us!</p>
//               <p>Best regards,<br><strong>Om Sai Industries Team</strong></p>
//             </div>
//             <div class="footer">
//               <p>&copy; ${new Date().getFullYear()} Om Sai Industries. All rights reserved.</p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     };
    
//     await transporter.sendMail(mailOptions);
//     console.log(`Status update email sent to ${user.email}`);
//     return true;
//   } catch (error) {
//     console.error('Error sending status update email:', error);
//     return false;
//   }
// };

// // Send admin notification for new order
// const sendAdminOrderNotification = async (order, user) => {
//   try {
//     const itemsList = order.products.map(item => `
//       <tr>
//         <td style="padding: 8px;">${item.product?.name || 'Product'}</td>
//         <td style="padding: 8px; text-align: center;">${item.quantity}</td>
//         <td style="padding: 8px; text-align: right;">₹${(item.price * item.quantity).toLocaleString()}</td>
//       </tr>
//     `).join('');
    
//     const mailOptions = {
//       from: `"Om Sai Industries" <${process.env.EMAIL_USER}>`,
//       to: process.env.ADMIN_EMAIL,
//       subject: `🔔 New Order Alert - #${order._id.toString().slice(-8)}`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <style>
//             body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
//             .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
//             .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
//             table { width: 100%; border-collapse: collapse; }
//             th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>New Order Received! 🎉</h1>
//             </div>
//             <div class="content">
//               <h2>Order Details</h2>
//               <p><strong>Order ID:</strong> ${order._id}</p>
//               <p><strong>Customer:</strong> ${user.name} (${user.email})</p>
//               <p><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
//               <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
//               <p><strong>Payment Method:</strong> ${order.paymentMethod || 'Cash on Delivery'}</p>
              
//               <h3>Items Ordered:</h3>
//               <table>
//                 <thead>
//                   <tr><th>Product</th><th>Qty</th><th>Total</th></tr>
//                 </thead>
//                 <tbody>
//                   ${itemsList}
//                 </tbody>
//                 <tfoot>
//                   <tr><td colspan="2"><strong>Total Amount:</strong></td><td><strong>₹${order.totalAmount.toLocaleString()}</strong></td></tr>
//                 </tfoot>
//               </table>
              
//               <h3>Shipping Address:</h3>
//               <p>
//                 ${order.shippingAddress?.street}<br>
//                 ${order.shippingAddress?.city}, ${order.shippingAddress?.state}<br>
//                 ${order.shippingAddress?.pincode}, ${order.shippingAddress?.country}
//               </p>
              
//               <div style="margin-top: 30px; text-align: center;">
//                 <a href="${process.env.ADMIN_URL || 'http://localhost:3000'}/admin/orders/${order._id}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">
//                   View in Admin Panel
//                 </a>
//               </div>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     };
    
//     await transporter.sendMail(mailOptions);
//     console.log(`Admin notification sent for order ${order._id}`);
//     return true;
//   } catch (error) {
//     console.error('Error sending admin notification:', error);
//     return false;
//   }
// };

// module.exports = {
//   sendWelcomeEmail,
//   sendOrderConfirmation,
//   sendOrderStatusUpdate,
//   sendAdminOrderNotification
// };
// orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const EmailService = require('../services/emailService'); // ✅ IMPORT THIS

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
    
    // Populate product details for email
    const populatedOrder = await Order.findById(createdOrder._id)
      .populate('products.product', 'name price');
    
    const user = await User.findById(req.user._id);
    
    // Send emails asynchronously (don't await - don't block response)
    EmailService.sendOrderConfirmation(populatedOrder, user).catch(err => console.error('Order confirmation email failed:', err));
    EmailService.sendAdminOrderNotification(populatedOrder, user).catch(err => console.error('Admin notification email failed:', err));
    
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
          
          // Send low stock alert if stock is low (less than 10)
          if (product.stock <= 10) {
            await EmailService.sendLowStockAlert(product);
          }
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
    
    // Get user details for email
    const user = await User.findById(order.user);
    
    // Get admin who made the change
    const updatedBy = req.user;
    
    // Send status update email to customer (for non-cancelled status changes)
    if (newStatus !== 'cancelled') {
      await EmailService.sendOrderStatusUpdate(updatedOrder, user, oldStatus, updatedBy);
    }
    
    // If order is cancelled, send cancellation email
    if (newStatus === 'cancelled') {
      await EmailService.sendOrderCancellation(updatedOrder, user, updatedBy);
    }
    
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

// const cancelOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
    
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }
    
//     // Only allow cancellation if order is pending or confirmed
//     if (order.orderStatus !== 'pending' && order.orderStatus !== 'confirmed') {
//       return res.status(400).json({ 
//         message: `Cannot cancel order with status: ${order.orderStatus}` 
//       });
//     }
    
//     console.log(`Cancelling order ${order._id} with status ${order.orderStatus}`);
    
//     // Restore stock if order was confirmed
//     if (order.orderStatus === 'confirmed') {
//       for (const item of order.products) {
//         const product = await Product.findById(item.product);
//         if (product) {
//           product.stock += item.quantity;
//           await product.save();
//           console.log(`Restored stock for ${product.name}: ${product.stock} available`);
//         }
//       }
//     }
    
//     order.orderStatus = 'cancelled';
//     const updatedOrder = await order.save();
    
//     // Get user details for email
//     const user = await User.findById(order.user);
    
//     // Get who cancelled (user or admin)
//     const cancelledBy = req.user;
    
//     // Send cancellation email to customer and super admin
//     await EmailService.sendOrderCancellation(updatedOrder, user, cancelledBy);
    
//     const populatedOrder = await Order.findById(updatedOrder._id)
//       .populate('user', 'name email')
//       .populate('products.product', 'name price stock');
    
//     res.json(populatedOrder);
//   } catch (error) {
//     console.error('Cancel order error:', error);
//     res.status(500).json({ message: error.message });
//   }
// };
// Update the cancelOrder function to handle admin vs user cancellation
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const isAdmin = req.user?.role === 'admin';
    const currentStatus = order.orderStatus;
    
    // Different cancellation rules for users vs admins
    if (!isAdmin) {
      // USER CANCELLATION RULES: Can only cancel if status is 'pending'
      if (currentStatus !== 'pending') {
        return res.status(400).json({ 
          message: `Order cannot be cancelled because it is already ${currentStatus}. Only pending orders can be cancelled by users.` 
        });
      }
      
      // Additional check: within 48 hours (optional)
      const orderDate = new Date(order.orderDate || order.createdAt);
      const currentDate = new Date();
      const hoursDifference = (currentDate - orderDate) / (1000 * 60 * 60);
      
      if (hoursDifference > 48) {
        return res.status(400).json({ 
          message: 'Order can only be cancelled within 48 hours of placement.' 
        });
      }
    } else {
      // ADMIN CANCELLATION RULES: Can cancel anytime except delivered
      if (currentStatus === 'delivered') {
        return res.status(400).json({ 
          message: 'Cannot cancel an order that has already been delivered.' 
        });
      }
      
      if (currentStatus === 'cancelled') {
        return res.status(400).json({ 
          message: 'Order is already cancelled.' 
        });
      }
    }
    
    console.log(`Cancelling order ${order._id} with status ${currentStatus} by ${isAdmin ? 'Admin' : 'User'}`);
    
    // Restore stock if order was confirmed or shipped (for admin cancellations)
    // For user cancellations, order is always pending, so no stock was deducted
    if (isAdmin && (currentStatus === 'confirmed' || currentStatus === 'shipped')) {
      for (const item of order.products) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
          console.log(`Restored stock for ${product.name}: ${product.stock} available`);
        }
      }
    } else if (!isAdmin && currentStatus === 'pending') {
      // User cancelling pending order - no stock to restore since stock wasn't deducted yet
      console.log('User cancelling pending order - no stock to restore');
    }
    
    order.orderStatus = 'cancelled';
    order.cancelledAt = Date.now();
    order.cancelledBy = isAdmin ? 'admin' : 'user';
    order.cancellationReason = req.body.reason || (isAdmin ? 'Cancelled by admin' : 'Cancelled by customer');
    
    const updatedOrder = await order.save();
    
    // Get user details for email
    const user = await User.findById(order.user);
    
    // Get who cancelled (user or admin)
    const cancelledBy = req.user;
    
    // Send cancellation email to customer and super admin
    await EmailService.sendOrderCancellation(updatedOrder, user, cancelledBy);
    
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