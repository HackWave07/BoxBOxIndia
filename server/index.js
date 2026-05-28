const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const upload = require('./uploadMiddleware');
const path = require('path');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const passport = require('passport');
const session = require('express-session');

// Passport Config
require('./config/passport')(passport);

// ─── Environment flags ────────────────────────────────────────────────────────
const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'https://boxboxindia.com';

// ─── Silence Chrome DevTools probe BEFORE helmet/CSP so it is never blocked ──
app.get('/.well-known/appspecific/com.chrome.devtools.json', (_req, res) => {
  res.status(200).json({});
});

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Localhost origins are always allowed regardless of NODE_ENV.
// When the frontend .env points VITE_API_URL at the Render backend, local dev
// browsers send Origin: http://localhost:5173 to the production server.
// Localhost cannot be spoofed by real-world browsers, so this is safe.
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'https://boxboxindia.com',
  'https://www.boxboxindia.com',
  FRONTEND_ORIGIN,          // honours FRONTEND_URL / CLIENT_URL env override
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const isVercel = origin.endsWith('.vercel.app');
    const isAllowed = allowedOrigins.indexOf(origin) !== -1 || isVercel;
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Helmet + Content Security Policy ────────────────────────────────────────
//
//  Development  → permissive localhost rules + Google + Razorpay
//  Production   → tight, production-ready rules
//
const cspDirectives = isDev
  ? {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",   // Vite HMR injects inline scripts in dev
        "'unsafe-eval'",     // Vite dev server uses eval
        'https://checkout.razorpay.com',
        'https://accounts.google.com',
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://fonts.googleapis.com',
      ],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: [
        "'self'",
        'data:',
        'blob:',
        'https:',            // allow all HTTPS images (Google profile pictures, etc.)
        'http://localhost:5000',
        'http://localhost:5173',
      ],
      connectSrc: [
        "'self'",
        'http://localhost:5000',
        'http://localhost:5173',
        'ws://localhost:5173',   // Vite HMR WebSocket
        'wss://localhost:5173',
        'https://accounts.google.com',
        'https://oauth2.googleapis.com',
        'https://lh3.googleusercontent.com',
        'https://checkout.razorpay.com',
        'https://api.razorpay.com',
        'https://generativelanguage.googleapis.com',  // Gemini API
      ],
      frameSrc: [
        "'self'",
        'https://accounts.google.com',
        'https://checkout.razorpay.com',
      ],
      formAction: ["'self'", 'https://accounts.google.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: null, // do NOT force HTTPS upgrade in dev
    }
  : {
      // Production — tighter policy
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        'https://checkout.razorpay.com',
        'https://accounts.google.com',
      ],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      connectSrc: [
        "'self'",
        'https://boxboxindia.com',
        'https://boxboxindia.onrender.com',
        'https://accounts.google.com',
        'https://oauth2.googleapis.com',
        'https://checkout.razorpay.com',
        'https://api.razorpay.com',
        'https://generativelanguage.googleapis.com',  // Gemini API
        'https://*.onrender.com',
        'https://*.vercel.app',
      ],
      frameSrc: [
        "'self'",
        'https://accounts.google.com',
        'https://checkout.razorpay.com',
      ],
      formAction: ["'self'", 'https://accounts.google.com'],
      objectSrc: ["'none'"],
    };

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: cspDirectives,
    },
    // Allow images to be loaded from a different origin (e.g., localhost:5173 fetching from localhost:5000)
    crossOriginResourcePolicy: false,
    // Allow iframes from Google/Razorpay (crossOriginEmbedderPolicy would block them)
    crossOriginEmbedderPolicy: false,
    // Let the browser follow redirects to Google OAuth without referrer issues
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// ─── Body parser + static uploads ────────────────────────────────────────────
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Express Session — must be registered BEFORE passport ────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'boxbox_fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: !isDev,        // HTTPS-only cookies in production
    httpOnly: true,
    sameSite: isDev ? 'lax' : 'strict',
  },
}));

// ─── Passport Middleware ──────────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

// ─── Health Check ───────────────────────────────────────────────────────────────
app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});

// ─── Route Files ──────────────────────────────────────────────────────────────
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const chatRoutes = require('./routes/chatRoutes');

// ─── Mount Routers ────────────────────────────────────────────────────────────
// Mount routes with and without '/api' prefix to prevent 404s if VITE_API_URL is just the root URL
app.use('/api/products', productRoutes);
app.use('/products', productRoutes);

app.use('/api/orders', orderRoutes);
app.use('/orders', orderRoutes);

app.use('/api/payment', paymentRoutes);
app.use('/payment', paymentRoutes);

app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/reviews', reviewRoutes);
app.use('/reviews', reviewRoutes);

app.use('/api/chat', chatRoutes);
app.use('/chat', chatRoutes);

// ─── Seed / Reset Admin User ──────────────────────────────────────────────────
// In development: always resets the admin password so a stale or
// plaintext-stored hash never causes "wrong password" errors.
// In production: only creates the admin if they don't already exist.
const User = require('./models/User');
const seedAdmin = async () => {
  try {
    let admin = await User.findOne({ email: 'BoxBoxindia@gmail.com' });

    if (!admin) {
      // Create fresh — pre-save hook will hash the password
      admin = new User({
        name: 'Admin BoxBox',
        email: 'BoxBoxindia@gmail.com',
        password: 'admin123',
        role: 'owner',
      });
      await admin.save();
      console.log('✅ Owner user created and seeded');
    } else if (isDev) {
      // In development, force-reset the password so any stale/plaintext
      // hash stored in MongoDB gets replaced with a fresh bcrypt hash.
      admin.password = 'admin123';
      admin.role = 'owner'; // ensure role is correct too
      await admin.save(); // triggers pre-save bcrypt hook
      console.log('🔑 Owner password reset (dev mode) → admin123');
    }
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
  }
};
seedAdmin();

// ─── Upload Route ─────────────────────────────────────────────────────────────
const { protect, authorizeRoles } = require('./middleware/authMiddleware');
const uploadHandler = (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    const urls = req.files.map(file => file.path);
    res.json({ urls });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
};

app.post('/api/upload', protect, authorizeRoles('owner'), upload.array('images', 10), uploadHandler);
app.post('/upload', protect, authorizeRoles('owner'), upload.array('images', 10), uploadHandler);

// ─── 404 Catch-all (must be after all routes) ─────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ success: false, error: err.message || 'Server Error' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 BoxBox Backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  if (isDev) {
    console.log(`🔓 CSP configured for development (localhost:5173 + localhost:5000)`);
  }
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Error: Port ${PORT} is already in use.`);
    console.error(`Please kill the process running on port ${PORT} and try again.`);
    process.exit(1);
  } else {
    console.error('❌ Server Error:', error);
  }
});
