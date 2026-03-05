# SkillBridge 4-Year Professional Suite: Final Production & Deployment Guide

This document contains the final security protocols, backend configurations, and deployment steps for deploying the hardened version of the SkillBridge Student Ecosystem to production.

---

## 1. Backend Production Hardening Snippets

### Security Middleware (`server.js`)
We have added global production hardening via essential security and parsing middlewares:
```javascript
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');

const app = express();

// Body Parser with strict limits
app.use(express.json({ limit: '10kb' })); 
app.use(cookieParser());

// Security Headers & Sanitization
app.use(helmet()); 
app.use(mongoSanitize()); 
app.use(compression()); 

// Advanced API Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per sliding window
    message: 'Too many requests from this node, please retry in 15 minutes.'
});
app.use('/api/', limiter);

// Strip debug logs in production
if (process.env.NODE_ENV === 'production') {
    console.log = function () {};
    console.warn = function () {};
    console.debug = function () {};
}
```

### Global Error Handler (`middleware/errorMiddleware.js`)
All errors are caught uniformly using this middleware, preventing unhandled promises and stripping stack traces in production.
```javascript
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error = new Error(`Resource not found with id of ${err.value}`);
        error.statusCode = 404;
    }
    // Mongoose Duplicate Key
    if (err.code === 11000) {
        error = new Error('Duplicate field value entered');
        error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
module.exports = errorHandler;
```

### Multi-Tenant Institutional Isolation (`middleware/collegeMiddleware.js`)
Prevents cross-college data access inside any protected student endpoint by automatically binding database queries to `req.user.collegeId` or global resources.
```javascript
const preserveCollegeIsolation = (req, res, next) => {
    if (!req.user || !req.user.collegeId) {
        return res.status(403).json({ success: false, message: 'Institutional alignment missing. College ID required.' });
    }
    // Apply isolation to future DB Queries
    req.collegeFilter = { collegeId: req.user.collegeId };
    req.collegeOrGlobalFilter = { 
        $or: [ { collegeId: req.user.collegeId }, { isGlobal: true } ]
    };
    next();
};
module.exports = preserveCollegeIsolation;
```

---

## 2. Updated Package Scripts

Add these to your `package.json` to handle production execution properly:

**Frontend (`frontend/package.json`)**
```json
"scripts": {
  "start": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "deploy": "vercel --prod"
}
```

**Backend (`backend-node/package.json`)**
```json
"scripts": {
  "start": "NODE_ENV=production node server.js",
  "dev": "NODE_ENV=development nodemon server.js",
  "pm2": "pm2 start server.js --name skillbridge-api -i max"
}
```

---

## 3. Database Indexing Upgrades
To optimize telemetry loading for complex metrics like Readiness Scores, we added these core indexes across models:
```javascript
userSchema.index({ collegeId: 1, year: 1, role: 1 });
aptitudeTestSchema.index({ collegeId: 1, createdAt: -1 });
internshipSchema.index({ collegeId: 1, isActive: 1 });
interviewSessionSchema.index({ userId: 1, createdAt: -1 });
testResultSchema.index({ userId: 1, createdAt: -1 });
```

---

## 4. Deployment Guides

### Approach A: Vercel + Render + MongoDB Atlas

1. **Frontend (Vercel)**
   - Login to Vercel and Import the Github Repo.
   - Root Directory: `frontend/`
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Add `.env.production`: `VITE_API_URL=https://api.skillbridge.com`

2. **Backend (Render)**
   - Login to Render and Create a new **Web Service**.
   - Connect the Github Repo.
   - Root Directory: `backend-node/`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add all Backend Secrets into the Render environment settings (`JWT_SECRET`, `MONGODB_URI`, `NODE_ENV=production`, `FRONTEND_URL`, etc).

3. **Database (MongoDB Atlas)**
   - Ensure the IP Access List is set to allow connections from anywhere (`0.0.0.0/0`) since Render IPs are dynamic.
   - Make sure your database URIs reflect the specific Production cluster.

### Approach B: Fully Custom VPS Deployment (Ubuntu + Nginx + PM2)

If deploying to a raw Linux Ubuntu Host (AWS EC2, DigitalOcean Droplet):

1. **Sync Source Logic**
   ```bash
   git clone https://github.com/YourOrg/SkillBridge.git
   ```

2. **Backend PM2 Process Manager**
   ```bash
   cd backend-node
   npm install --production
   npm install pm2 -g
   pm2 start server.js --name "skillbridge-backend"
   pm2 startup
   pm2 save
   ```

3. **Frontend Build**
   ```bash
   cd ../frontend
   npm install
   npm run build
   ```

4. **Nginx Reverse Proxy Configuration**
   ```nginx
   # /etc/nginx/sites-available/skillbridge
   
   server {
       listen 80;
       server_name app.skillbridge.com;

       location / {
           root /var/www/skillbridge/frontend/dist;
           try_files $uri /index.html;
       }
   }

   server {
       listen 80;
       server_name api.skillbridge.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
5. **SSL Provisioning**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d app.skillbridge.com -d api.skillbridge.com
   ```

---

## 5. Final Security Checklist (Pre-Flight)

- [x] All `.env` files are in `.gitignore`
- [x] `console.log()` outputs are muted by the NODE_ENV flag override.
- [x] JWT expiration tokens are correctly configured to short intervals.
- [x] Multi-tenant Institutional Data Isolation is active via `collegeMiddleware.js`.
- [x] Helmet security headers enforce modern XSS protections.
- [x] Rate limiting is implemented globally at 100 requests per 15 minutes.
- [x] Mongoose indexing handles large scale payload requests.
- [x] Passwords encrypted using `bcrypt.js`.
- [x] Inputs sanitized using `express-mongo-sanitize`.
