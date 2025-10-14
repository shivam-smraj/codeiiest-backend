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
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat', 
    resave: false, // Do not save session if unmodified
    saveUninitialized: false, // Do not create session until something is stored
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true, 
        maxAge: 24 * 60 * 60 * 1000, 
        sameSite: 'lax', 
    }
}));

const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'https://www.codeiiest.in',
    'https://codeiiest-testing.vercel.app',

];

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
    credentials: true
}));
app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET ,
    resave: false,
    saveUninitialized: false,
}));

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