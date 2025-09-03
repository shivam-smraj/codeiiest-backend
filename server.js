// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import configurePassport from './config/passport.js';
import passport from 'passport';

// Import all route files
import userRoutes from './routes/userRoutes.js';
import chapterRoutes from './routes/chapterRoutes.js';
import eventRoutes from './routes/eventRoutes.js';   
import leaderboardRoutes from './routes/leaderboardRoutes.js'; 

dotenv.config();
connectDB();
configurePassport();

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
// Test route
app.get('/', (req, res) => {
    res.send(`Server running fine`);
});

// Mount all routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/chapters', chapterRoutes); 
app.use('/api/v1/events', eventRoutes);     
app.use('/api/v1/leaderboard', leaderboardRoutes);

// Use custom error handlers
app.use(notFound);
app.use(errorHandler);

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, console.log(`CodeIIEST Backend Server running on port ${PORT}`));
}

// Export the Express API
export default app;