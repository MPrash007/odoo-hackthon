const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const pingServer = require('./cron');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/itineraries', require('./routes/itineraryRoutes'));
app.use('/api/cities', require('./routes/cityRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/budget', require('./routes/budgetRoutes'));
app.use('/api/checklists', require('./routes/checklistRoutes'));
app.use('/api/notes', require('./routes/notesRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat room: ${chatId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const { chatId, senderId, content } = data;
      
      // Save message to DB
      const message = await Message.create({
        chatId,
        senderId,
        content
      });

      // Populate sender details before emitting
      const populatedMessage = await message.populate('senderId', 'firstName lastName profilePhoto');

      // Update last message in Chat
      const Chat = require('./models/Chat');
      await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

      // Emit to everyone in the room
      io.to(chatId).emit('receive_message', populatedMessage);
    } catch (error) {
      console.error('Socket send_message error:', error);
    }
  });

  socket.on('typing', ({ chatId, isTyping }) => {
    socket.to(chatId).emit('user_typing', isTyping);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Traveloop server running on port ${PORT}`);
  
  // Start the cron job to keep the server awake on Render
  // pingServer();
});
