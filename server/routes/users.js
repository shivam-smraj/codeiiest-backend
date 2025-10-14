
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { ensureAuthenticated } = require('../middleware/authMiddleware'); // Import ensureAuthenticated

// @desc    Get all users (for linking in admin panel, can be public or admin-only based on security needs)
// @route   GET /api/users
router.get('/', async (req, res) => {
    try {
        // Only return essential user info for linking, not sensitive data
        const users = await User.find().select('_id displayName email enrollmentNo  codeforcesId image ');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update current logged-in user's profile
// @route   PUT /api/users/me
router.put('/me', ensureAuthenticated, async (req, res) => {
    try {
        // req.user is provided by Passport.js after successful authentication
        const user = req.user;

        // Extract allowed fields from request body
        const { enrollmentNo, githubId, codeforcesId, leetcodeId, codechefId } = req.body;

        // Update only the allowed fields
        if (enrollmentNo !== undefined) user.enrollmentNo = enrollmentNo;
        if (githubId !== undefined) user.githubId = githubId;
        if (codeforcesId !== undefined) user.codeforcesId = codeforcesId;
        if (leetcodeId !== undefined) user.leetcodeId = leetcodeId;
        if (codechefId !== undefined) user.codechefId = codechefId;

        await user.save(); // Save the updated user document
        res.json(user); // Return the updated user profile
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

module.exports = router;