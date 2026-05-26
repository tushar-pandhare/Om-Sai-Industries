// const transporter = require('../config/email');

// class EmailService {
//   // ─── Welcome Email ──────────────────────────────────────────────────────────
//   static async sendWelcomeEmail(user) {
//     try {
//       const mailOptions = {
//         from: `"Om Sai Industries" <${process.env.EMAIL_USER}>`,
//         to: user.email,
//         subject: 'Welcome to Om Sai Industries! 🌾',
//         html: `
//           <!DOCTYPE html>
//           <html>
//           <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
//           <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
//             <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.1);">
//               <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:30px;text-align:center;">
//                 <h1 style="color:#fff;margin:0;font-size:24px;">Welcome to Om Sai Industries!</h1>
//               </div>
//               <div style="padding:30px;">
//                 <h2 style="color:#333;margin-bottom:20px;">Hello ${user.name || 'Valued Customer'},</h2>
//                 <p style="color:#555;line-height:1.6;margin-bottom:15px;">Thank you for registering with Om Sai Industries! We're excited to have you as part of our family.</p>
//                 <p style="color:#555;line-height:1.6;margin-bottom:20px;">Browse our collection, track your orders, and enjoy exclusive offers.</p>
//                 <div style="text-align:center;margin-top:30px;">
//                   <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/products"
//                      style="background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;padding:12px 30px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:bold;">
//                     Start Shopping
//                   </a>
//                 </div>
//               </div>
//               <div style="background:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#888;">
//                 <p>© ${new Date().getFullYear()} Om Sai Industries. All rights reserved.</p>
//               </div>
//             </div>
//           </body>
//           </html>
//         `
//       };
//       await transporter.sendMail(mailOptions);
//       console.log(`✅ Welcome email sent to ${user.email}`);
//       try { await this.sendSuperAdminNotification('new_user', { user }); } catch {}
//       return true;
//     } catch (error) {
//       console.error('❌ Welcome email error:', error.message);
//       return false;
//     }
//   }

//   // ─── Password Reset OTP Email ───────────────────────────────────────────────
//   static async sendPasswordResetOTP(user, otp) {
//     try {
//       const mailOptions = {
//         from: `"Om Sai Industries" <${process.env.EMAIL_USER}>`,
//         to: user.email,
//         subject: '🔐 Password Reset OTP – Om Sai Industries',
//         html: `
//           <!DOCTYPE html>
//           <html>
//           <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
//           <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
//             <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.1);">
//               <div style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:30px;text-align:center;">
//                 <h1 style="color:#fff;margin:0;font-size:24px;">Password Reset Request</h1>
//               </div>
//               <div style="padding:30px;">
//                 <h2 style="color:#333;margin-bottom:10px;">Hello ${user.name},</h2>
//                 <p style="color:#555;line-height:1.6;margin-bottom:20px;">
//                   We received a request to reset your password. Use the OTP below to proceed.
//                   This OTP is valid for <strong>10 minutes</strong>.
//                 </p>
//                 <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:12px;padding:30px;text-align:center;margin:20px 0;">
//                   <p style="color:rgba(255,255,255,.8);margin:0 0 8px;font-size:14px;letter-spacing:2px;text-transform:uppercase;">Your OTP</p>
//                   <p style="color:#fff;font-size:42px;font-weight:900;margin:0;letter-spacing:12px;">${otp}</p>
//                 </div>
//                 <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 16px;border-radius:4px;margin:20px 0;">
//                   <p style="margin:0;color:#92400e;font-size:13px;">
//                     ⚠️ <strong>Never share this OTP.</strong> It expires in 10 minutes. If you didn't request this, ignore this email.
//                   </p>
//                 </div>
//               </div>
//               <div style="background:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#888;">
//                 <p>© ${new Date().getFullYear()} Om Sai Industries. All rights reserved.</p>
//               </div>
//             </div>
//           </body>
//           </html>
//         `
//       };
//       await transporter.sendMail(mailOptions);
//       console.log(`✅ Password reset OTP sent to ${user.email}`);
//       return true;
//     } catch (error) {
//       console.error('❌ OTP email error:', error.message);
//       throw error;
//     }
//   }

//   // ─── Password Reset Success Email ───────────────────────────────────────────
//   static async sendPasswordResetSuccess(user) {
//     try {
//       const mailOptions = {
//         from: `"Om Sai Industries" <${process.env.EMAIL_USER}>`,
//         to: user.email,
//         subject: '✅ Password Reset Successful – Om Sai Industries',
//         html: `
//           <!DOCTYPE html>
//           <html>
//           <head><meta charset="UTF-8"></head>
//           <body style="font-family:Arial,sans-serif;margin:0;padding:0;background:#f4f4f4;">
//             <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.1);">
//               <div style="background:linear-gradient(135deg,#10b981,#059669);padding:30px;text-align:center;">
//                 <h1 style="color:#fff;margin:0;">Password Reset Successful ✅</h1>
//               </div>
//               <div style="padding:30px;">
//                 <h2 style="color:#333;">Hello ${user.name},</h2>
//                 <p style="color:#555;line-height:1.6;">Your password has been reset successfully. You can now log in with your new password.</p>
//                 <p style="color:#ef4444;font-size:13px;">If you did NOT make this change, contact us immediately at <a href="mailto:${process.env.ADMIN_EMAIL}">${process.env.ADMIN_EMAIL}</a>.</p>
//                 <div style="text-align:center;margin-top:24px;">
//                   <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login"
//                      style="background:linear-gradient(135deg,#10b981,#059669);color:#fff;padding:12px 30px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:bold;">
//                     Log In Now
//                   </a>
//                 </div>
//               </div>
//               <div style="background:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#888;">
//                 <p>© ${new Date().getFullYear()} Om Sai Industries. All rights reserved.</p>
//               </div>
//             </div>
//           </body>
//           </html>
//         `
//       };
//       await transporter.sendMail(mailOptions);
//       console.log(`✅ Password reset success email sent to ${user.email}`);
//       return true;
//     } catch (error) {
//       console.error('❌ Password reset success email error:', error.message);
//       return false;
//     }
//   }

//   // ─── Order Confirmation ─────────────────────────────────────────────────────
//   static async sendOrderConfirmation(order, user) {
//     try {
//       const itemsList = order.products.map(item => `
//         <tr style="border-bottom:1px solid #e0e0e0;">
//           <td style="padding:10px;">${item.product?.name || 'Product'}</td>
//           <td style="padding:10px;text-align:center;">${item.quantity}</td>
//           <td style="padding:10px;text-align:right;">₹${(item.price * item.quantity).toLocaleString()}</td>
//         </tr>`).join('');
//       const mailOptions = {
//         from: `"Om Sai Industries" <${process.env.EMAIL_USER}>`,
//         to: user.email,
//         subject: `Order Confirmed 🎉 – #${order._id}`,
//         html: `
//           <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
//           <body style="font-family:Arial,sans-serif;margin:0;padding:0;background:#f4f4f4;">
//             <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;">
//               <div style="background:#22c55e;padding:30px;text-align:center;">
//                 <h1 style="color:#fff;margin:0;">Order Confirmed! 🎉</h1>
//                 <p style="color:#fff;margin-top:10px;">Order #${order._id}</p>
//               </div>
//               <div style="padding:30px;">
//                 <h2 style="color:#333;">Hello ${user.name},</h2>
//                 <p style="color:#555;">Your order has been placed successfully!</p>
//                 <div style="background:#f8fafc;padding:20px;border-radius:8px;margin:20px 0;">
//                   <h3 style="margin-top:0;">Order Summary</h3>
//                   <table style="width:100%;border-collapse:collapse;">
//                     <thead><tr style="background:#e2e8f0;">
//                       <th style="padding:10px;text-align:left;">Product</th>
//                       <th style="padding:10px;text-align:center;">Qty</th>
//                       <th style="padding:10px;text-align:right;">Total</th>
//                     </tr></thead>
//                     <tbody>${itemsList}</tbody>
//                     <tfoot><tr style="border-top:2px solid #cbd5e1;">
//                       <td colspan="2" style="padding:10px;text-align:right;font-weight:bold;">Grand Total:</td>
//                       <td style="padding:10px;text-align:right;font-weight:bold;color:#4f46e5;">₹${order.totalAmount.toLocaleString()}</td>
//                     </tr></tfoot>
//                   </table>
//                 </div>
//                 <div style="text-align:center;margin-top:20px;">
//                   <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders/${order._id}"
//                      style="background:#4f46e5;color:#fff;padding:12px 30px;text-decoration:none;border-radius:6px;display:inline-block;">
//                     Track Your Order
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </body></html>`
//       };
//       await transporter.sendMail(mailOptions);
//       console.log(`✅ Order confirmation sent to ${user.email}`);
//       try { await this.sendSuperAdminNotification('new_order', { order, user }); } catch {}
//       return true;
//     } catch (error) {
//       console.error('❌ Order confirmation error:', error.message);
//       return false;
//     }
//   }

//   // ─── Order Status Update ────────────────────────────────────────────────────
//   static async sendOrderStatusUpdate(order, user, oldStatus, updatedBy = null) {
//     try {
//       const colors = { confirmed: '#22c55e', cancelled: '#ef4444', shipped: '#f59e0b', delivered: '#10b981' };
//       const color = colors[order.orderStatus] || '#4f46e5';
//       const mailOptions = {
//         from: `"Om Sai Industries" <${process.env.EMAIL_USER}>`,
//         to: user.email,
//         subject: `Order Status Updated – #${order._id}`,
//         html: `
//           <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
//           <body style="font-family:Arial,sans-serif;margin:0;padding:0;background:#f4f4f4;">
//             <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;">
//               <div style="background:${color};padding:30px;text-align:center;">
//                 <h1 style="color:#fff;margin:0;">Order Status Updated</h1>
//               </div>
//               <div style="padding:30px;">
//                 <h2 style="color:#333;">Hello ${user.name},</h2>
//                 <p style="color:#555;">Your order <strong>#${order._id}</strong> status changed from <strong>${oldStatus}</strong> to <strong>${order.orderStatus}</strong>.</p>
//                 <div style="text-align:center;margin-top:20px;">
//                   <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders/${order._id}"
//                      style="background:#4f46e5;color:#fff;padding:12px 30px;text-decoration:none;border-radius:6px;display:inline-block;">
//                     View Order
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </body></html>`
//       };
//       await transporter.sendMail(mailOptions);
//       console.log(`✅ Status update email sent to ${user.email}`);
//       try { await this.sendSuperAdminNotification('order_status_change', { order, user, oldStatus, updatedBy }); } catch {}
//       return true;
//     } catch (error) {
//       console.error('❌ Status update email error:', error.message);
//       return false;
//     }
//   }

//   // ─── Order Cancellation ─────────────────────────────────────────────────────
//   static async sendOrderCancellation(order, user, cancelledBy = null) {
//     try {
//       const mailOptions = {
//         from: `"Om Sai Industries" <${process.env.EMAIL_USER}>`,
//         to: user.email,
//         subject: `Order Cancelled – #${order._id}`,
//         html: `
//           <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
//           <body style="font-family:Arial,sans-serif;margin:0;padding:0;background:#f4f4f4;">
//             <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;">
//               <div style="background:#ef4444;padding:30px;text-align:center;">
//                 <h1 style="color:#fff;margin:0;">Order Cancelled</h1>
//               </div>
//               <div style="padding:30px;">
//                 <h2 style="color:#333;">Hello ${user.name},</h2>
//                 <p style="color:#555;">Your order <strong>#${order._id}</strong> has been cancelled. Total: ₹${order.totalAmount.toLocaleString()}</p>
//               </div>
//             </div>
//           </body></html>`
//       };
//       await transporter.sendMail(mailOptions);
//       try { await this.sendSuperAdminNotification('order_cancelled', { order, user, cancelledBy }); } catch {}
//       console.log(`✅ Cancellation email sent for order ${order._id}`);
//       return true;
//     } catch (error) {
//       console.error('❌ Cancellation email error:', error.message);
//       return false;
//     }
//   }

//   // ─── Super Admin Notification ───────────────────────────────────────────────
//   static async sendSuperAdminNotification(type, data) {
//     try {
//       const to = process.env.SUPER_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
//       if (!to) return false;
//       let subject = '', html = '';
//       switch (type) {
//         case 'new_user':
//           subject = `👤 New User – ${data.user.name}`;
//           html = `<p><b>Name:</b> ${data.user.name}</p><p><b>Email:</b> ${data.user.email}</p><p><b>Phone:</b> ${data.user.phone || 'N/A'}</p>`;
//           break;
//         case 'new_order':
//           subject = `🛍️ New Order #${data.order._id} – ₹${data.order.totalAmount.toLocaleString()}`;
//           html = `<p><b>Customer:</b> ${data.user.name}</p><p><b>Amount:</b> ₹${data.order.totalAmount.toLocaleString()}</p>`;
//           break;
//         case 'order_status_change':
//           subject = `📦 Order #${data.order._id}: ${data.oldStatus} → ${data.order.orderStatus}`;
//           html = `<p><b>Customer:</b> ${data.user.name}</p><p><b>Status:</b> ${data.oldStatus} → ${data.order.orderStatus}</p>`;
//           break;
//         case 'order_cancelled':
//           subject = `⚠️ Order #${data.order._id} Cancelled`;
//           html = `<p><b>Customer:</b> ${data.user.name}</p><p><b>Amount:</b> ₹${data.order.totalAmount.toLocaleString()}</p>`;
//           break;
//         default:
//           return false;
//       }
//       await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
//       return true;
//     } catch (error) {
//       console.error(`❌ Super admin notification error (${type}):`, error.message);
//       return false;
//     }
//   }

//   // ─── Low Stock Alert ────────────────────────────────────────────────────────
//   static async sendLowStockAlert(product) {
//     try {
//       const to = process.env.SUPER_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
//       if (!to) return false;
//       await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to,
//         subject: `⚠️ Low Stock – ${product.name}`,
//         html: `<p><b>Product:</b> ${product.name}</p><p><b>Stock:</b> ${product.stock} units remaining</p>`
//       });
//       return true;
//     } catch (error) {
//       console.error('❌ Low stock alert error:', error.message);
//       return false;
//     }
//   }
// }

// module.exports = EmailService;

const transporter = require('../config/email');

class EmailService {
  // ─── Welcome Email ──────────────────────────────────────────────────────────
  static async sendWelcomeEmail(user) {
    try {
      const mailOptions = {
        from: `"Om Sai Industries" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Welcome to Om Sai Industries! 🌾',
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
            <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.1);">
              <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:30px;text-align:center;">
                <h1 style="color:#fff;margin:0;font-size:24px;">Welcome to Om Sai Industries!</h1>
              </div>
              <div style="padding:30px;">
                <h2 style="color:#333;margin-bottom:20px;">Hello ${user.name || 'Valued Customer'},</h2>
                <p style="color:#555;line-height:1.6;margin-bottom:15px;">Thank you for registering with Om Sai Industries! We're excited to have you as part of our family.</p>
                <p style="color:#555;line-height:1.6;margin-bottom:20px;">Browse our collection, track your orders, and enjoy exclusive offers.</p>
                <div style="text-align:center;margin-top:30px;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/products"
                     style="background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;padding:12px 30px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:bold;">
                    Start Shopping
                  </a>
                </div>
              </div>
              <div style="background:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#888;">
                <p>© ${new Date().getFullYear()} Om Sai Industries. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };
      await transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to ${user.email}`);
      try { await this.sendSuperAdminNotification('new_user', { user }); } catch {}
      return true;
    } catch (error) {
      console.error('❌ Welcome email error:', error.message);
      return false;
    }
  }

  // ─── Password Reset OTP Email ───────────────────────────────────────────────
  static async sendPasswordResetOTP(user, otp) {
    try {
      const mailOptions = {
        from: `"Om Sai Industries" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: '🔐 Password Reset OTP – Om Sai Industries',
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
            <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.1);">
              <div style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:30px;text-align:center;">
                <h1 style="color:#fff;margin:0;font-size:24px;">Password Reset Request</h1>
              </div>
              <div style="padding:30px;">
                <h2 style="color:#333;margin-bottom:10px;">Hello ${user.name},</h2>
                <p style="color:#555;line-height:1.6;margin-bottom:20px;">
                  We received a request to reset your password. Use the OTP below to proceed.
                  This OTP is valid for <strong>10 minutes</strong>.
                </p>
                <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:12px;padding:30px;text-align:center;margin:20px 0;">
                  <p style="color:rgba(255,255,255,.8);margin:0 0 8px;font-size:14px;letter-spacing:2px;text-transform:uppercase;">Your OTP</p>
                  <p style="color:#fff;font-size:42px;font-weight:900;margin:0;letter-spacing:12px;">${otp}</p>
                </div>
                <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 16px;border-radius:4px;margin:20px 0;">
                  <p style="margin:0;color:#92400e;font-size:13px;">
                    ⚠️ <strong>Never share this OTP.</strong> It expires in 10 minutes. If you didn't request this, ignore this email.
                  </p>
                </div>
              </div>
              <div style="background:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#888;">
                <p>© ${new Date().getFullYear()} Om Sai Industries. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };
      await transporter.sendMail(mailOptions);
      console.log(`✅ Password reset OTP sent to ${user.email}`);
      return true;
    } catch (error) {
      console.error('❌ OTP email error:', error.message);
      throw error;
    }
  }

  // ─── Password Reset Success Email ───────────────────────────────────────────
  static async sendPasswordResetSuccess(user) {
    try {
      const mailOptions = {
        from: `"Om Sai Industries" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: '✅ Password Reset Successful – Om Sai Industries',
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="UTF-8"></head>
          <body style="font-family:Arial,sans-serif;margin:0;padding:0;background:#f4f4f4;">
            <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.1);">
              <div style="background:linear-gradient(135deg,#10b981,#059669);padding:30px;text-align:center;">
                <h1 style="color:#fff;margin:0;">Password Reset Successful ✅</h1>
              </div>
              <div style="padding:30px;">
                <h2 style="color:#333;">Hello ${user.name},</h2>
                <p style="color:#555;line-height:1.6;">Your password has been reset successfully. You can now log in with your new password.</p>
                <p style="color:#ef4444;font-size:13px;">If you did NOT make this change, contact us immediately at <a href="mailto:${process.env.ADMIN_EMAIL}">${process.env.ADMIN_EMAIL}</a>.</p>
                <div style="text-align:center;margin-top:24px;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login"
                     style="background:linear-gradient(135deg,#10b981,#059669);color:#fff;padding:12px 30px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:bold;">
                    Log In Now
                  </a>
                </div>
              </div>
              <div style="background:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#888;">
                <p>© ${new Date().getFullYear()} Om Sai Industries. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };
      await transporter.sendMail(mailOptions);
      console.log(`✅ Password reset success email sent to ${user.email}`);
      return true;
    } catch (error) {
      console.error('❌ Password reset success email error:', error.message);
      return false;
    }
  }

  // ─── Order Confirmation ─────────────────────────────────────────────────────
  static async sendOrderConfirmation(order, user) {
    try {
      const itemsList = order.products.map(item => `
        <tr style="border-bottom:1px solid #e0e0e0;">
          <td style="padding:10px;">${item.product?.name || 'Product'}</td>
          <td style="padding:10px;text-align:center;">${item.quantity}</td>
          <td style="padding:10px;text-align:right;">₹${(item.price * item.quantity).toLocaleString()}</td>
        </tr>`).join('');
      const mailOptions = {
        from: `"Om Sai Industries" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Order Confirmed 🎉 – #${order._id}`,
        html: `
          <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
          <body style="font-family:Arial,sans-serif;margin:0;padding:0;background:#f4f4f4;">
            <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;">
              <div style="background:#22c55e;padding:30px;text-align:center;">
                <h1 style="color:#fff;margin:0;">Order Confirmed! 🎉</h1>
                <p style="color:#fff;margin-top:10px;">Order #${order._id}</p>
              </div>
              <div style="padding:30px;">
                <h2 style="color:#333;">Hello ${user.name},</h2>
                <p style="color:#555;">Your order has been placed successfully!</p>
                <div style="background:#f8fafc;padding:20px;border-radius:8px;margin:20px 0;">
                  <h3 style="margin-top:0;">Order Summary</h3>
                  <table style="width:100%;border-collapse:collapse;">
                    <thead><tr style="background:#e2e8f0;">
                      <th style="padding:10px;text-align:left;">Product</th>
                      <th style="padding:10px;text-align:center;">Qty</th>
                      <th style="padding:10px;text-align:right;">Total</th>
                    </tr></thead>
                    <tbody>${itemsList}</tbody>
                    <tfoot><tr style="border-top:2px solid #cbd5e1;">
                      <td colspan="2" style="padding:10px;text-align:right;font-weight:bold;">Grand Total:</td>
                      <td style="padding:10px;text-align:right;font-weight:bold;color:#4f46e5;">₹${order.totalAmount.toLocaleString()}</td>
                    </tr></tfoot>
                  </table>
                </div>
                <div style="text-align:center;margin-top:20px;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders/${order._id}"
                     style="background:#4f46e5;color:#fff;padding:12px 30px;text-decoration:none;border-radius:6px;display:inline-block;">
                    Track Your Order
                  </a>
                </div>
              </div>
            </div>
          </body></html>`
      };
      await transporter.sendMail(mailOptions);
      console.log(`✅ Order confirmation sent to ${user.email}`);
      try { await this.sendSuperAdminNotification('new_order', { order, user }); } catch {}
      return true;
    } catch (error) {
      console.error('❌ Order confirmation error:', error.message);
      return false;
    }
  }

  // ─── Order Status Update ────────────────────────────────────────────────────
  static async sendOrderStatusUpdate(order, user, oldStatus, updatedBy = null) {
    try {
      const colors = { confirmed: '#22c55e', cancelled: '#ef4444', shipped: '#f59e0b', delivered: '#10b981' };
      const color = colors[order.orderStatus] || '#4f46e5';
      const mailOptions = {
        from: `"Om Sai Industries" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Order Status Updated – #${order._id}`,
        html: `
          <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
          <body style="font-family:Arial,sans-serif;margin:0;padding:0;background:#f4f4f4;">
            <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;">
              <div style="background:${color};padding:30px;text-align:center;">
                <h1 style="color:#fff;margin:0;">Order Status Updated</h1>
              </div>
              <div style="padding:30px;">
                <h2 style="color:#333;">Hello ${user.name},</h2>
                <p style="color:#555;">Your order <strong>#${order._id}</strong> status changed from <strong>${oldStatus}</strong> to <strong>${order.orderStatus}</strong>.</p>
                <div style="text-align:center;margin-top:20px;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders/${order._id}"
                     style="background:#4f46e5;color:#fff;padding:12px 30px;text-decoration:none;border-radius:6px;display:inline-block;">
                    View Order
                  </a>
                </div>
              </div>
            </div>
          </body></html>`
      };
      await transporter.sendMail(mailOptions);
      console.log(`✅ Status update email sent to ${user.email}`);
      try { await this.sendSuperAdminNotification('order_status_change', { order, user, oldStatus, updatedBy }); } catch {}
      return true;
    } catch (error) {
      console.error('❌ Status update email error:', error.message);
      return false;
    }
  }

  // ─── Order Cancellation ─────────────────────────────────────────────────────
  static async sendOrderCancellation(order, user, cancelledBy = null) {
    try {
      const mailOptions = {
        from: `"Om Sai Industries" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Order Cancelled – #${order._id}`,
        html: `
          <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
          <body style="font-family:Arial,sans-serif;margin:0;padding:0;background:#f4f4f4;">
            <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;">
              <div style="background:#ef4444;padding:30px;text-align:center;">
                <h1 style="color:#fff;margin:0;">Order Cancelled</h1>
              </div>
              <div style="padding:30px;">
                <h2 style="color:#333;">Hello ${user.name},</h2>
                <p style="color:#555;">Your order <strong>#${order._id}</strong> has been cancelled. Total: ₹${order.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </body></html>`
      };
      await transporter.sendMail(mailOptions);
      try { await this.sendSuperAdminNotification('order_cancelled', { order, user, cancelledBy }); } catch {}
      console.log(`✅ Cancellation email sent for order ${order._id}`);
      return true;
    } catch (error) {
      console.error('❌ Cancellation email error:', error.message);
      return false;
    }
  }

  // ─── Super Admin Notification ───────────────────────────────────────────────
  static async sendSuperAdminNotification(type, data) {
    try {
      const to = process.env.SUPER_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
      if (!to) return false;
      let subject = '', html = '';
      switch (type) {
        case 'new_user':
          subject = `👤 New User – ${data.user.name}`;
          html = `<p><b>Name:</b> ${data.user.name}</p><p><b>Email:</b> ${data.user.email}</p><p><b>Phone:</b> ${data.user.phone || 'N/A'}</p>`;
          break;
        case 'new_order':
          subject = `🛍️ New Order #${data.order._id} – ₹${data.order.totalAmount.toLocaleString()}`;
          html = `<p><b>Customer:</b> ${data.user.name}</p><p><b>Amount:</b> ₹${data.order.totalAmount.toLocaleString()}</p>`;
          break;
        case 'order_status_change':
          subject = `📦 Order #${data.order._id}: ${data.oldStatus} → ${data.order.orderStatus}`;
          html = `<p><b>Customer:</b> ${data.user.name}</p><p><b>Status:</b> ${data.oldStatus} → ${data.order.orderStatus}</p>`;
          break;
        case 'order_cancelled':
          subject = `⚠️ Order #${data.order._id} Cancelled`;
          html = `<p><b>Customer:</b> ${data.user.name}</p><p><b>Amount:</b> ₹${data.order.totalAmount.toLocaleString()}</p>`;
          break;
        default:
          return false;
      }
      await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
      return true;
    } catch (error) {
      console.error(`❌ Super admin notification error (${type}):`, error.message);
      return false;
    }
  }

  // ─── Low Stock Alert ────────────────────────────────────────────────────────
  static async sendLowStockAlert(product) {
    try {
      const to = process.env.SUPER_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
      if (!to) return false;
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: `⚠️ Low Stock – ${product.name}`,
        html: `<p><b>Product:</b> ${product.name}</p><p><b>Stock:</b> ${product.stock} units remaining</p>`
      });
      return true;
    } catch (error) {
      console.error('❌ Low stock alert error:', error.message);
      return false;
    }
  }
}

module.exports = EmailService;
