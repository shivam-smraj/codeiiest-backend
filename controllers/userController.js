// backend/controllers/userController.js
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};

const googleAuthCallback = asyncHandler(async (req, res) => {
    if (req.user) {
        const token = generateToken(req.user._id, req.user.role);
        res.redirect(`${process.env.FRONTEND_URL}/login/success?token=${token}`);
    } else {
        res.redirect(`${process.env.FRONTEND_URL}/login/failure`);
    }
});

const getUserProfile = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email; 
        user.rollId = req.body.rollId || user.rollId;

        user.codeforcesHandle = req.body.codeforcesHandle || user.codeforcesHandle;
        user.leetcodeHandle = req.body.leetcodeHandle || user.leetcodeHandle;
        user.codechefHandle = req.body.codechefHandle || user.codechefHandle;

        if (req.body.password) {
            user.password = req.body.password; 
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            rollId: updatedUser.rollId,
            codeforcesHandle: updatedUser.codeforcesHandle,
            leetcodeHandle: updatedUser.leetcodeHandle,
            codechefHandle: updatedUser.codechefHandle,
            token: generateToken(updatedUser._id, updatedUser.role), 
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export { googleAuthCallback, getUserProfile, updateUserProfile };