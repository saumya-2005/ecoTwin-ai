const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const buildingRoutes = require('./routes/buildingRoutes');
const sustainabilityRoutes = require('./routes/sustainabilityRoutes');
const aiRoutes = require('./routes/aiRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');
const reportRoutes = require('./routes/reportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecotwin_ai';

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check API
app.get('/api/health', (req, res) => {
  return res.json({
    status: 'online',
    service: 'EcoTwin AI Intelligence Backend',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/sustainability', sustainabilityRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error stack:', err);
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Database Connection & Express Server Start
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`Successfully connected to MongoDB at ${MONGODB_URI}`);
    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(` EcoTwin AI Backend running on port ${PORT}`);
      console.log(` API Endpoint: http://localhost:${PORT}/api`);
      console.log(`===============================================`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Connection Failure:', err.message);
    // Launch server even without DB connection for mock/resilient mode
    app.listen(PORT, () => {
      console.log(`EcoTwin AI Server running in offline fallback mode on port ${PORT}`);
    });
  });

module.exports = app;
