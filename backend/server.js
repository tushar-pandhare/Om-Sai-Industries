// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const cartRoutes = require("./routes/cartRoutes");

// dotenv.config();
// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Corrected routes - removed duplicate product route
// app.use("/omsai/products/routes", require("./routes/productRoutes"))
// app.use("/omsai/products", require("./routes/productRoutes"));
// app.use("/omsai/offers", require("./routes/offerRoutes"));
// app.use("/omsai/messages", require("./routes/messageRoutes"));
// app.use("/omsai/auth", require("./routes/loginRegister")); 
// app.use("/omsai/cart", cartRoutes);

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/offers', require('./routes/offerRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/messages',require('./routes/messageRoutes'))
app.use('/api/feedback', require('./routes/feedbackRoutes'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/omsai', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  
  // Create default admin if not exists
  const User = require('./models/User');
  User.findOne({ email: 'admin@omsai.com' }).then(async (user) => {
    if (!user) {
      await User.create({
        name: 'Admin User',
        email: 'admin@omsai.com',
        password: 'admin123',
        role: 'admin',
        phone: '1234567890'
      });
      console.log('Default admin created: admin@omsai.com / admin123');
    }
  });
}).catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});