const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/itineraries', require('./routes/itineraryRoutes'));
app.use('/api/cities', require('./routes/cityRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/budget', require('./routes/budgetRoutes'));
app.use('/api/checklists', require('./routes/checklistRoutes'));
app.use('/api/notes', require('./routes/notesRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Traveloop server running on port ${PORT}`);
});
