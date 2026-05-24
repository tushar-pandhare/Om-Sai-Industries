const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
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
app.use('/api/messages', require('./routes/messageRoutes'));
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

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  allowUpgrades: true,
  perMessageDeflate: false,
  httpCompression: false
});

// Socket.IO authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    console.log('🔐 Socket auth - Token received:', token ? 'Yes' : 'No');
    
    if (!token) {
      console.log('❌ No token provided');
      return next(new Error('Authentication required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified for user:', decoded.id);
    
    const User = require('./models/User');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.log('❌ User not found:', decoded.id);
      return next(new Error('User not found'));
    }

    socket.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };
    
    console.log(`✅ Socket authenticated: ${socket.user.name} (${socket.user.role})`);
    next();
  } catch (error) {
    console.error('❌ Socket auth error:', error.message);
    next(new Error('Invalid token'));
  }
});

// Store connected users
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`✅ Socket connected: ${socket.user.name} (${socket.user.role}) - ID: ${socket.id}`);
  
  // Store connected user
  connectedUsers.set(socket.user.id, {
    socketId: socket.id,
    userId: socket.user.id,
    userName: socket.user.name,
    userRole: socket.user.role,
    connectedAt: new Date()
  });

  // Join user to their personal room
  const userRoom = `user:${socket.user.id}`;
  socket.join(userRoom);
  console.log(`📢 User joined room: ${userRoom}`);

  // Send current connection status
  socket.emit('connection_status', { 
    connected: true, 
    userId: socket.user.id,
    message: 'Connected to chat server'
  });

  // Handle sending messages - UPDATED VERSION
  socket.on('send_message', async (data) => {
    console.log('📨 send_message event received:', data);
    console.log('👤 Sender role:', socket.user.role);
    
    try {
      const { toUserId, message, type = 'text' } = data;
      
      if (!message || !message.trim()) {
        console.error('❌ Missing message');
        socket.emit('message_error', { error: 'Missing message' });
        return;
      }
      
      const Message = require('./models/Message');
      const User = require('./models/User');
      
      // CASE 1: Customer sending message (no toUserId needed - send to ALL admins)
      if (socket.user.role === 'user') {
        console.log('📝 Customer sending message to all admins');
        
        // Find all admins
        const admins = await User.find({ role: 'admin' });
        console.log(`Found ${admins.length} admins`);
        
        if (admins.length === 0) {
          socket.emit('message_error', { error: 'No support staff available' });
          return;
        }
        
        // Create a message for EACH admin
        const savedMessages = [];
        for (const admin of admins) {
          const newMessage = new Message({
            from: socket.user.id,
            to: admin._id,
            message: message.trim(),
            messageType: type,
            isRead: false
          });
          
          await newMessage.save();
          await newMessage.populate('from', 'name email role');
          savedMessages.push(newMessage);
          
          console.log(`📤 Sending to admin: ${admin.name} (${admin._id})`);
          
          // Send to admin's room
          io.to(`user:${admin._id}`).emit('receive_message', {
            _id: newMessage._id,
            from: newMessage.from,
            to: newMessage.to,
            message: newMessage.message,
            messageType: newMessage.messageType,
            createdAt: newMessage.createdAt,
            isRead: newMessage.isRead
          });
        }
        
        // Confirm to sender (customer)
        socket.emit('message_sent', {
          _id: savedMessages[0]._id,
          from: savedMessages[0].from,
          message: message.trim(),
          createdAt: new Date()
        });
        
        console.log(`✅ Message sent from ${socket.user.name} to ${admins.length} admins`);
      }
      
      // CASE 2: Admin replying to specific customer
      else if (socket.user.role === 'admin') {
        console.log('📝 Admin sending reply');
        
        if (!toUserId) {
          console.error('❌ Admin message missing toUserId');
          socket.emit('message_error', { error: 'Recipient required' });
          return;
        }
        
        const newMessage = new Message({
          from: socket.user.id,
          to: toUserId,
          message: message.trim(),
          messageType: type,
          isRead: false
        });
        
        await newMessage.save();
        await newMessage.populate('from', 'name email role');
        
        // Send to customer's room
        io.to(`user:${toUserId}`).emit('receive_message', {
          _id: newMessage._id,
          from: newMessage.from,
          to: newMessage.to,
          message: newMessage.message,
          messageType: newMessage.messageType,
          createdAt: newMessage.createdAt,
          isRead: newMessage.isRead
        });
        
        socket.emit('message_sent', newMessage);
        console.log(`✅ Reply sent from ${socket.user.name} to customer ${toUserId}`);
      }
      
    } catch (error) {
      console.error('❌ Error sending message:', error);
      socket.emit('message_error', { error: error.message });
    }
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    const { toUserId, isTyping } = data;
    if (toUserId) {
      socket.to(`user:${toUserId}`).emit('user_typing', {
        from: socket.user.id,
        fromName: socket.user.name,
        isTyping
      });
    }
  });

  // Handle marking messages as read
  socket.on('mark_read', async (data) => {
    const { messageIds } = data;
    try {
      const Message = require('./models/Message');
      await Message.updateMany(
        { _id: { $in: messageIds }, to: socket.user.id },
        { isRead: true, readAt: new Date() }
      );
      
      const messages = await Message.find({ _id: { $in: messageIds } });
      const senderIds = [...new Set(messages.map(m => m.from?.toString()).filter(Boolean))];
      
      senderIds.forEach(senderId => {
        io.to(`user:${senderId}`).emit('messages_read', {
          readBy: socket.user.id,
          messageIds
        });
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });

  // Broadcast active users periodically
  const broadcastActiveUsers = () => {
    const activeUsersList = Array.from(connectedUsers.values()).map(u => ({
      userId: u.userId,
      name: u.userName,
      role: u.userRole
    }));
    io.emit('active_users', activeUsersList);
  };
  
  // Broadcast every 10 seconds
  const interval = setInterval(broadcastActiveUsers, 10000);
  broadcastActiveUsers(); // Initial broadcast

  // Handle ping to keep connection alive
  socket.on('ping', () => {
    socket.emit('pong');
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`❌ Socket disconnected: ${socket.user.name} - Reason: ${reason}`);
    connectedUsers.delete(socket.user.id);
    clearInterval(interval);
    broadcastActiveUsers();
  });
});

app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔌 Socket.IO ready for connections`);
  console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}/socket.io`);
});

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true })); 

// // Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/products', require('./routes/productRoutes'));
// app.use('/api/categories', require('./routes/categoryRoutes'));
// app.use('/api/offers', require('./routes/offerRoutes'));
// app.use('/api/orders', require('./routes/orderRoutes'));
// app.use('/api/reviews', require('./routes/reviewRoutes'));
// app.use('/api/complaints', require('./routes/complaintRoutes'));
// app.use('/api/contact', require('./routes/contactRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/messages',require('./routes/messageRoutes'))
// app.use('/api/feedback', require('./routes/feedbackRoutes'));

// // Database connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/omsai', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log('Connected to MongoDB');
  
//   // Create default admin if not exists
//   const User = require('./models/User');
//   User.findOne({ email: 'admin@omsai.com' }).then(async (user) => {
//     if (!user) {
//       await User.create({
//         name: 'Admin User',
//         email: 'admin@omsai.com',
//         password: 'admin123',
//         role: 'admin',
//         phone: '1234567890'
//       });
//       console.log('Default admin created: admin@omsai.com / admin123');
//     }
//   });
// }).catch(err => console.error('MongoDB connection error:', err));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });