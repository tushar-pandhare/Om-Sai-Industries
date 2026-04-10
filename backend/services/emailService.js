const transporter = require('../config/email');

class EmailService {
  // Send welcome email on user registration
  static async sendWelcomeEmail(user) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Welcome to Om Sai Industries!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Om Sai Industries</title>
          </head>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="background-color: #2563eb; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Welcome to Om Sai Industries!</h1>
              </div>
              <div style="padding: 30px;">
                <h2 style="color: #333333; margin-bottom: 20px;">Hello ${user.name || 'Valued Customer'},</h2>
                <p style="color: #555555; line-height: 1.5; margin-bottom: 15px;">Thank you for registering with Om Sai Industries! We're excited to have you as part of our family.</p>
                <p style="color: #555555; line-height: 1.5; margin-bottom: 20px;">You can now browse our collection of quality products, track your orders, and enjoy exclusive offers.</p>
                <div style="text-align: center; margin-top: 30px;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" style="background-color: #2563eb; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Start Shopping</a>
                </div>
              </div>
              <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #888888;">
                <p>© ${new Date().getFullYear()} Om Sai Industries. All rights reserved.</p>
                <p>Need help? Contact us at ${process.env.ADMIN_EMAIL || 'support@omsaiindustries.com'}</p>
              </div>
            </div>
          </body>
          </html>
        `
      };
      
      await transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to ${user.email}`);
      
      // Also notify super admin about new user registration
      await this.sendSuperAdminNotification('new_user', { user });
      
      return true;
    } catch (error) {
      console.error('❌ Error sending welcome email:', error.message);
      return false;
    }
  }
  
  // Send order confirmation to customer
  static async sendOrderConfirmation(order, user) {
    try {
      // Build items list HTML
      const itemsList = order.products.map(item => `
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 10px;">${item.product?.name || 'Product'}</td>
          <td style="padding: 10px; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; text-align: right;">₹${(item.price * item.quantity).toLocaleString()}</td>
        </tr>
      `).join('');
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Order Confirmation - #${order._id}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Order Confirmation - Om Sai Industries</title>
          </head>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #22c55e; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0;">Order Confirmed! 🎉</h1>
                <p style="color: #ffffff; margin-top: 10px;">Order #${order._id}</p>
              </div>
              <div style="padding: 30px;">
                <h2 style="color: #333333;">Hello ${user.name},</h2>
                <p style="color: #555555;">Your order has been placed successfully!</p>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0;">Order Summary</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                      <tr style="background-color: #e2e8f0;">
                        <th style="padding: 10px; text-align: left;">Product</th>
                        <th style="padding: 10px; text-align: center;">Qty</th>
                        <th style="padding: 10px; text-align: right;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsList}
                    </tbody>
                    <tfoot>
                      <tr style="border-top: 2px solid #cbd5e1;">
                        <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Grand Total:</td>
                        <td style="padding: 10px; text-align: right; font-weight: bold; color: #2563eb;">₹${order.totalAmount.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order._id}" style="background-color: #2563eb; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Track Your Order</a>
                </div>
              </div>
              <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #888888;">
                <p>Thank you for shopping with Om Sai Industries!</p>
              </div>
            </div>
          </body>
          </html>
        `
      };
      
      await transporter.sendMail(mailOptions);
      console.log(`✅ Order confirmation sent to ${user.email}`);
      
      // Send notification to super admin about new order
      await this.sendSuperAdminNotification('new_order', { order, user });
      
      return true;
    } catch (error) {
      console.error('❌ Error sending order confirmation:', error.message);
      return false;
    }
  }
  
  // Send order status update
  static async sendOrderStatusUpdate(order, user, oldStatus, updatedBy = null) {
    try {
      const getStatusColor = () => {
        switch(order.orderStatus) {
          case 'confirmed': return '#22c55e';
          case 'cancelled': return '#ef4444';
          case 'shipped': return '#f59e0b';
          case 'delivered': return '#10b981';
          default: return '#2563eb';
        }
      };
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Order Status Update - #${order._id}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Order Status Update - Om Sai Industries</title>
          </head>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              <div style="background-color: ${getStatusColor()}; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0;">Order Status Updated</h1>
              </div>
              <div style="padding: 30px;">
                <h2 style="color: #333333;">Hello ${user.name},</h2>
                <p style="color: #555555;">Your order <strong>#${order._id}</strong> status has been updated from <strong>${oldStatus}</strong> to <strong>${order.orderStatus}</strong>.</p>
                <div style="text-align: center; margin-top: 30px;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order._id}" style="background-color: #2563eb; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">View Order Details</a>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      };
      
      await transporter.sendMail(mailOptions);
      console.log(`✅ Status update email sent to ${user.email}`);
      
      // Send notification to super admin about status change
      await this.sendSuperAdminNotification('order_status_change', { order, user, oldStatus, updatedBy });
      
      return true;
    } catch (error) {
      console.error('❌ Error sending status update:', error.message);
      return false;
    }
  }
  
  // Send admin notification for new order
  static async sendAdminOrderNotification(order, user) {
    try {
      const itemsList = order.products.map(item => 
        `<li>${item.product?.name || 'Product'} x ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}</li>`
      ).join('');
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `🔔 New Order Alert - #${order._id}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>New Order Notification</title>
          </head>
          <body style="font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0;">New Order Received!</h1>
              </div>
              <div style="padding: 20px;">
                <p><strong>Order ID:</strong> #${order._id}</p>
                <p><strong>Customer:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
                <p><strong>Status:</strong> ${order.orderStatus}</p>
                <h3>Items:</h3>
                <ul>${itemsList}</ul>
                <p><strong>Total: ₹${order.totalAmount.toLocaleString()}</strong></p>
                <div style="margin-top: 20px;">
                  <a href="${process.env.ADMIN_URL || 'http://localhost:3000/admin'}/orders/${order._id}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">View in Admin Panel</a>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      };
      
      await transporter.sendMail(mailOptions);
      console.log(`✅ Admin notification sent to ${process.env.ADMIN_EMAIL}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending admin notification:', error.message);
      return false;
    }
  }
  
  // Send order cancellation notification
  static async sendOrderCancellation(order, user, cancelledBy = null) {
    try {
      const cancelledByName = cancelledBy ? (cancelledBy.name || cancelledBy.email || 'Admin') : 'System';
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Order Cancelled - #${order._id}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Order Cancelled - Om Sai Industries</title>
          </head>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #ef4444; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0;">Order Cancelled</h1>
              </div>
              <div style="padding: 30px;">
                <h2 style="color: #333333;">Hello ${user.name},</h2>
                <p style="color: #555555;">Your order <strong>#${order._id}</strong> has been cancelled.</p>
                <p style="color: #555555;">Total amount: ₹${order.totalAmount.toLocaleString()}</p>
                <p style="color: #555555;">If you have any questions, please contact our support team.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };
      
      await transporter.sendMail(mailOptions);
      
      // Send detailed cancellation notification to super admin
      await this.sendSuperAdminNotification('order_cancelled', { order, user, cancelledBy });
      
      console.log(`✅ Cancellation emails sent for order ${order._id}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending cancellation notification:', error.message);
      return false;
    }
  }
  
  // NEW: Super Admin Notification Handler
  static async sendSuperAdminNotification(type, data) {
    try {
      const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
      let subject = '';
      let html = '';
      
      switch(type) {
        case 'new_user':
          subject = `👤 New User Registration - ${data.user.name}`;
          html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #8b5cf6; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">New User Registered</h1>
              </div>
              <div style="padding: 20px;">
                <p><strong>Name:</strong> ${data.user.name}</p>
                <p><strong>Email:</strong> ${data.user.email}</p>
                <p><strong>Phone:</strong> ${data.user.phone || 'N/A'}</p>
                <p><strong>Registered At:</strong> ${new Date(data.user.createdAt).toLocaleString()}</p>
              </div>
            </div>
          `;
          break;
          
        case 'new_order':
          const itemsList = data.order.products.map(item => 
            `<li>${item.product?.name || 'Product'} x ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}</li>`
          ).join('');
          
          subject = `🛍️ New Order #${data.order._id} - ₹${data.order.totalAmount.toLocaleString()}`;
          html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #22c55e; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">New Order Received!</h1>
              </div>
              <div style="padding: 20px;">
                <p><strong>Order ID:</strong> #${data.order._id}</p>
                <p><strong>Customer:</strong> ${data.user.name}</p>
                <p><strong>Email:</strong> ${data.user.email}</p>
                <p><strong>Total Amount:</strong> ₹${data.order.totalAmount.toLocaleString()}</p>
                <p><strong>Order Date:</strong> ${new Date(data.order.orderDate).toLocaleString()}</p>
                <h3>Items:</h3>
                <ul>${itemsList}</ul>
                <div style="margin-top: 20px;">
                  <a href="${process.env.ADMIN_URL || 'http://localhost:3000/admin'}/orders/${data.order._id}" style="background-color: #22c55e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">View Order</a>
                </div>
              </div>
            </div>
          `;
          break;
          
        case 'order_status_change':
          subject = `📦 Order #${data.order._id} Status Changed: ${data.oldStatus} → ${data.order.orderStatus}`;
          html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #f59e0b; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Order Status Updated</h1>
              </div>
              <div style="padding: 20px;">
                <p><strong>Order ID:</strong> #${data.order._id}</p>
                <p><strong>Customer:</strong> ${data.user.name}</p>
                <p><strong>Old Status:</strong> ${data.oldStatus}</p>
                <p><strong>New Status:</strong> ${data.order.orderStatus}</p>
                <p><strong>Updated By:</strong> ${data.updatedBy ? (data.updatedBy.name || data.updatedBy.email || 'Admin') : 'System'}</p>
                <p><strong>Updated At:</strong> ${new Date().toLocaleString()}</p>
                <div style="margin-top: 20px;">
                  <a href="${process.env.ADMIN_URL || 'http://localhost:3000/admin'}/orders/${data.order._id}" style="background-color: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">View Order</a>
                </div>
              </div>
            </div>
          `;
          break;
          
        case 'order_cancelled':
          const cancelledByName = data.cancelledBy ? (data.cancelledBy.name || data.cancelledBy.email || 'Admin') : 'Customer';
          subject = `⚠️ Order #${data.order._id} Cancelled by ${cancelledByName}`;
          html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #ef4444; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Order Cancelled</h1>
              </div>
              <div style="padding: 20px;">
                <p><strong>Order ID:</strong> #${data.order._id}</p>
                <p><strong>Customer:</strong> ${data.user.name}</p>
                <p><strong>Email:</strong> ${data.user.email}</p>
                <p><strong>Total Amount:</strong> ₹${data.order.totalAmount.toLocaleString()}</p>
                <p><strong>Cancelled By:</strong> ${cancelledByName}</p>
                <p><strong>Cancelled At:</strong> ${new Date().toLocaleString()}</p>
                <div style="margin-top: 20px;">
                  <a href="${process.env.ADMIN_URL || 'http://localhost:3000/admin'}/orders/${data.order._id}" style="background-color: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">View Order</a>
                </div>
              </div>
            </div>
          `;
          break;
          
        default:
          return false;
      }
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: superAdminEmail,
        subject: subject,
        html: html
      };
      
      await transporter.sendMail(mailOptions);
      console.log(`✅ Super admin notification sent (${type})`);
      return true;
    } catch (error) {
      console.error(`❌ Error sending super admin notification (${type}):`, error.message);
      return false;
    }
  }
  
  // NEW: Send notification when product stock is low
  static async sendLowStockAlert(product) {
    try {
      const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: superAdminEmail,
        subject: `⚠️ Low Stock Alert - ${product.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f59e0b; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Low Stock Alert!</h1>
            </div>
            <div style="padding: 20px;">
              <p><strong>Product:</strong> ${product.name}</p>
              <p><strong>Current Stock:</strong> ${product.stock} units</p>
              <p><strong>Category:</strong> ${product.category?.name || 'N/A'}</p>
              <p><strong>Price:</strong> ₹${product.price.toLocaleString()}</p>
              <div style="margin-top: 20px;">
                <a href="${process.env.ADMIN_URL || 'http://localhost:3000/admin'}/products/edit/${product._id}" style="background-color: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Restock Now</a>
              </div>
            </div>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
      console.log(`✅ Low stock alert sent for ${product.name}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending low stock alert:', error.message);
      return false;
    }
  }
}

module.exports = EmailService;