// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const { sendWelcomeEmail } = require('../services/emailService');

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
// };

// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, phone, address } = req.body;
    
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: 'User already exists' });
//     }
    
//     const user = await User.create({
//       name,
//       email,
//       password,
//       phone,
//       address: address || {
//         street: '',
//         city: '',
//         state: '',
//         pincode: '',
//         country: ''
//       }
//     });
    
//     // Send welcome email (don't await - don't block response)
//     sendWelcomeEmail(user).catch(err => console.error('Welcome email failed:', err));
    
//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       phone: user.phone,
//       address: user.address,
//       token: generateToken(user._id)
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
    
//     if (user && (await user.comparePassword(password))) {
//       res.json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         phone: user.phone,
//         address: user.address,
//         token: generateToken(user._id)
//       });
//     } else {
//       res.status(401).json({ message: 'Invalid email or password' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('-password');
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const updateUserProfile = async (req, res) => {
//   try {
//     const userId = req.params.id || req.user._id;
    
//     if (userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Not authorized to update this profile' });
//     }
    
//     const user = await User.findById(userId);
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
    
//     user.name = req.body.name || user.name;
//     user.phone = req.body.phone || user.phone;
    
//     if (req.body.address) {
//       user.address = {
//         street: req.body.address.street || user.address?.street || '',
//         city: req.body.address.city || user.address?.city || '',
//         state: req.body.address.state || user.address?.state || '',
//         pincode: req.body.address.pincode || user.address?.pincode || '',
//         country: req.body.address.country || user.address?.country || ''
//       };
//     }
    
//     if (req.body.password) {
//       user.password = req.body.password;
//     }
    
//     const updatedUser = await user.save();
    
//     res.json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       role: updatedUser.role,
//       phone: updatedUser.phone,
//       address: updatedUser.address,
//       token: generateToken(updatedUser._id)
//     });
//   } catch (error) {
//     console.error('Profile update error:', error);
//     res.status(500).json({ message: error.message });
//   }
// };

// const updateUserPassword = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
    
//     const { currentPassword, newPassword } = req.body;
    
//     // Check current password
//     const isPasswordValid = await user.comparePassword(currentPassword);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Current password is incorrect' });
//     }
    
//     // Update password
//     user.password = newPassword;
//     await user.save();
    
//     res.json({ message: 'Password updated successfully' });
//   } catch (error) {
//     console.error('Password update error:', error);
//     res.status(500).json({ message: error.message });
//   }
// };


// module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile,updateUserPassword };

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendWelcomeEmail, sendPasswordResetOTP, sendPasswordResetSuccess } = require('../services/emailService');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// ─── Register ───────────────────────────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({
      name, email, password, phone,
      address: address || { street: '', city: '', state: '', pincode: '', country: '' }
    });

    sendWelcomeEmail(user).catch(err => console.error('Welcome email failed:', err));

    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, phone: user.phone, address: user.address,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Login ───────────────────────────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id, name: user.name, email: user.email,
        role: user.role, phone: user.phone, address: user.address,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Get Profile ─────────────────────────────────────────────────────────────
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Update Profile ───────────────────────────────────────────────────────────
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id;
    if (userId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized to update this profile' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    if (req.body.address) {
      user.address = {
        street: req.body.address.street || user.address?.street || '',
        city: req.body.address.city || user.address?.city || '',
        state: req.body.address.state || user.address?.state || '',
        pincode: req.body.address.pincode || user.address?.pincode || '',
        country: req.body.address.country || user.address?.country || ''
      };
    }
    if (req.body.password) user.password = req.body.password;

    const updated = await user.save();
    res.json({
      _id: updated._id, name: updated.name, email: updated.email,
      role: updated.role, phone: updated.phone, address: updated.address,
      token: generateToken(updated._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Update Password (logged-in user) ────────────────────────────────────────
const updateUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { currentPassword, newPassword } = req.body;
    if (!(await user.comparePassword(currentPassword)))
      return res.status(401).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Forgot Password: Send OTP ───────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If this email exists, an OTP has been sent.' });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = expiry;
    user.resetPasswordOTPAttempts = 0;
    await user.save();

    await sendPasswordResetOTP(user, otp);

    res.json({ message: 'If this email exists, an OTP has been sent.' });
  } catch (error) {
    console.error('forgotPassword error:', error);
    res.status(500).json({ message: 'Failed to send OTP. Try again.' });
  }
};

// ─── Forgot Password: Verify OTP ─────────────────────────────────────────────
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const user = await User.findOne({ email });
    if (!user || !user.resetPasswordOTP)
      return res.status(400).json({ message: 'Invalid or expired OTP' });

    // Check expiry
    if (new Date() > user.resetPasswordOTPExpiry) {
      user.resetPasswordOTP = null;
      user.resetPasswordOTPExpiry = null;
      await user.save();
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Check max attempts (5)
    if (user.resetPasswordOTPAttempts >= 5) {
      return res.status(429).json({ message: 'Too many attempts. Please request a new OTP.' });
    }

    if (user.resetPasswordOTP !== otp.toString()) {
      user.resetPasswordOTPAttempts += 1;
      await user.save();
      const remaining = 5 - user.resetPasswordOTPAttempts;
      return res.status(400).json({ message: `Invalid OTP. ${remaining} attempt(s) remaining.` });
    }

    // OTP is valid – issue a short-lived reset token
    const resetToken = jwt.sign(
      { id: user._id, purpose: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ message: 'OTP verified', resetToken });
  } catch (error) {
    console.error('verifyOTP error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── Forgot Password: Reset Password ─────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword)
      return res.status(400).json({ message: 'Reset token and new password are required' });

    if (newPassword.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({ message: 'Reset token is invalid or expired' });
    }

    if (decoded.purpose !== 'password_reset')
      return res.status(400).json({ message: 'Invalid reset token' });

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword;
    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpiry = null;
    user.resetPasswordOTPAttempts = 0;
    await user.save();

    // Send success email (don't block response)
    sendPasswordResetSuccess(user).catch(err =>
      console.error('Password reset success email failed:', err)
    );

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error('resetPassword error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  forgotPassword,
  verifyOTP,
  resetPassword
};
