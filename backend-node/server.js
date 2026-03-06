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
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');

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
app.use(express.json({ limit: '10kb' })); // Limit body payload
app.use(cookieParser());

// ──────────────────────────────────────────────────────────
// CORS MUST be applied BEFORE helmet so preflight OPTIONS
// requests receive the Access-Control-Allow-Origin header
// before helmet's cross-origin policies can reject them.
// ──────────────────────────────────────────────────────────
const allowedOrigins = [
    'https://skillbridgeai-1.onrender.com',
    'https://skillbridgeai.onrender.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.FRONTEND_URL
].filter(Boolean).map(origin => origin.replace(/\/$/, '')); // Normalize: remove trailing slashes

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const normalizedOrigin = origin.replace(/\/$/, '');
        
        if (allowedOrigins.includes(normalizedOrigin) || 
            normalizedOrigin.endsWith('.onrender.com') || // Dynamic render subdomains
            process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            console.error(`Blocked by CORS: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Cache-Control', 'Pragma']
}));

// Explicitly handle preflight for all routes
app.options('*', cors());

// Security Middlewares (after CORS)
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }
}));
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(compression()); // Compress responses

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per window (generous for development)
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests from this IP, please try again in 15 minutes' }
});
app.use('/api/', limiter);

// Disable console.log in production
if (process.env.NODE_ENV === 'production') {
    console.log = function () {};
    console.warn = function () {};
    console.debug = function () {};
}

// Initialize passport
app.use(passport.initialize());

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
const ai = require('./routes/aiRoutes');


// Mount routers
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/courses', courses);
app.use('/api/enrollments', enrollments);
app.use('/api/payments', payments);
app.use('/api/github', github);
app.use('/api/assignments', assignments);
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/ai', ai);
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/saas', require('./routes/saasRoutes'));
app.use('/api/career', require('./routes/careerRoutes'));
app.use('/api/communication', require('./routes/communicationRoutes'));
app.use('/api/hub', require('./routes/hubRoutes'));
app.use('/api/placement', require('./routes/placementRoutes'));
app.use('/api/collaboration', require('./routes/collaborationRoutes'));
app.use('/api/community', require('./routes/communityRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));


// Home route
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Welcome to SkillBridge API',
        services: {
            database: mongoose.connection.readyState === 1 ? 'online' : 'offline',
            redis: redisClient.isReady ? 'online' : 'offline',
            cloudinary: !!process.env.CLOUDINARY_API_KEY ? 'configured' : 'not_configured',
            gemini: !!process.env.GEMINI_API_KEY ? 'configured' : 'missing_key'
        }
    });
});

// Error handling middleware
const errorHandler = require('./middleware/errorMiddleware');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Rejection at: ${promise}, reason: ${err.message}`);
    console.error(err.stack);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
});

module.exports = app;
