const express = require('express');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
const { createClient } = require('redis');

// Load passport config
require('./config/passport');

// Connect to database
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        // In production we might not want to exit, but for industry level setup, 
        // we should have clear error visibility.
    }
};

// Connect to Redis
const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Redis Connected Successfully');
    } catch (error) {
        console.error(`Redis Connection Error: ${error.message}`);
    }
};

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Initialize connections
connectDB();
connectRedis();

const app = express();

// Body parser
app.use(express.json());
app.use(cookieParser());

// Initialize passport
app.use(passport.initialize());

// Enable CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Route files
const auth = require('./routes/authRoutes');
const users = require('./routes/userRoutes');
const courses = require('./routes/courseRoutes');
const enrollments = require('./routes/enrollmentRoutes');
const payments = require('./routes/paymentRoutes');
const github = require('./routes/githubRoutes');
const assignments = require('./routes/assignmentRoutes');


// Mount routers
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/courses', courses);
app.use('/api/enrollments', enrollments);
app.use('/api/payments', payments);
app.use('/api/github', github);
app.use('/api/assignments', assignments);
app.use('/api/progress', require('./routes/progressRoutes'));


// Home route
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Welcome to SkillBridge API',
        services: {
            database: mongoose.connection.readyState === 1 ? 'online' : 'offline',
            redis: redisClient.isReady ? 'online' : 'offline',
            cloudinary: !!process.env.CLOUDINARY_API_KEY ? 'configured' : 'not_configured'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Server error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
});

module.exports = app;
