const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const connectDB = require("./config/db");

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const teamMemberRoutes = require('./routes/teamMembers'); 
const chapterRoutes = require('./routes/chapters'); 
const userRoutes = require('./routes/users');
const codeforcesAuthRoutes = require('./routes/codeforcesAuth');


dotenv.config();
require("./config/passport")(passport);

connectDB();

const app = express();

// Determine if running in production
const isProduction = process.env.NODE_ENV === 'production';

// CORS Configuration - Define allowed origins
const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:3000', 
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
    'https://www.codeiiest.in',
    'https://codeiiest-testing.vercel.app',
].filter(Boolean); // Remove undefined values

// CORS Middleware (MUST come before session)
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true // Essential for sending cookies cross-origin
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Configuration (SINGLE instance with proper settings)
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard-cat-change-this-in-production',
    resave: false, // Do not save session if unmodified
    saveUninitialized: false, // Do not create session until something is stored
    proxy: isProduction, // Trust proxy in production (for Railway, Render, etc.)
    cookie: {
        secure: isProduction, // HTTPS only in production
        httpOnly: true, // Prevent XSS attacks
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-site in production
        // Optionally set domain for subdomain sharing:
        // domain: isProduction ? '.codeiiest.in' : undefined,
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());




app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/team-members', teamMemberRoutes); 
app.use('/api/chapters', chapterRoutes);
app.use('/api/users', userRoutes);  
app.use('/api/auth/codeforces', codeforcesAuthRoutes);

app.get("/api", (req, res) => {
    res.json({ message: "Hello from the backend API!" });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`[SERVER] API server running on port ${PORT}`);
});