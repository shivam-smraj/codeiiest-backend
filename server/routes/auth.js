
const express = require("express");
const passport = require("passport");
const router = express.Router();

// Use environment variable for frontend URL with fallback to localhost
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: `${FRONTEND_URL}/login?error=true`, 
        successRedirect: `${FRONTEND_URL}/dashboard`, 
    })
);

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect(FRONTEND_URL);
    });
});

router.get('/current_user', (req, res) => {
    console.log('[AUTH] /current_user called');
    console.log('[AUTH] Session ID:', req.sessionID);
    console.log('[AUTH] Is Authenticated:', req.isAuthenticated());
    console.log('[AUTH] User exists:', !!req.user);
    
    if (req.isAuthenticated() && req.user) {
        res.json(req.user);
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

module.exports = router;