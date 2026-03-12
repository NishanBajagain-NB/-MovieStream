const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Load environment variables - prioritize .env.local for development
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
require('dotenv').config(); // Fallback to .env

const { initializeDatabase, insertDefaultData } = require('./database/connection');

// Import routes
const movieRoutes = require('./routes/movieRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adsRoutes = require('./routes/adsRoutes');
const popupRoutes = require('./routes/popupRoutes');
const siteRoutes = require('./routes/siteRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    /\.vercel\.app$/
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'MovieStream API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/movies', movieRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/popup', popupRoutes);
app.use('/api/site-settings', siteRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('🚀 Starting MovieStream API Server...');
    
    // Initialize database
    await initializeDatabase();
    await insertDefaultData();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
      console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('\n📋 Available Endpoints:');
        console.log('   GET  /health - Health check');
        console.log('   POST /api/admin/login - Admin login');
        console.log('   GET  /api/movies - Get all movies');
        console.log('   GET  /api/movies/search?q=query - Search movies');
        console.log('   POST /api/movies - Add new movie (admin)');
        console.log('   GET  /api/ads - Get all ads');
        console.log('   GET  /api/popup - Get popup settings');
        console.log('   GET  /api/site-settings - Get site settings');
        console.log('\n🔐 Admin Credentials:');
        console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@nishanbajagain.com.np'}`);
        console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Nishan1010@@##$$__'}`);
        console.log('\n🌐 Aiven MySQL Database Connected');
        console.log(`   Host: ${process.env.DB_HOST}`);
        console.log(`   Database: ${process.env.DB_NAME}`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();