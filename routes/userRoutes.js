// backend/routes/userRoutes.js
import express from 'express';
import passport from 'passport';
const router = express.Router();
import {
    googleAuthCallback,
    getUserProfile,
    updateUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';


router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false, 
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=true`, 
    }),
    googleAuthCallback
);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

export default router;