// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose;
mongoose
  .connect(process.env.MONGODB_URI)

  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err.message));

// Import routes
const authRoutes = require('./routes/auth');
const fieldRoutes = require('./routes/fields');
const sensorRoutes = require('./routes/sensor');

// Use routes
app.use('/auth', authRoutes);
app.use('/fields', fieldRoutes);
app.use('/sensors', sensorRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('🌾 Smart Farm API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
