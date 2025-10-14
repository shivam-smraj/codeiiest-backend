// In /server/routes/teamMembers.js

const express = require('express');
const router = express.Router();
const { ensureAdmin } = require('../middleware/authMiddleware');
const TeamMember = require('../models/TeamMember');
const User = require('../models/User'); // We need User to link them if provided

// @desc    Get all team members
// @route   GET /api/team-members
router.get('/', async (req, res) => {
    try {
        // Populate the 'user' field if it exists to get more details
        const teamMembers = await TeamMember.find().populate('user', 'displayName email image googleId enrollmentNo').sort({ name: 1 });
        res.json(teamMembers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get a single team member by ID
// @route   GET /api/team-members/:id
router.get('/:id', async (req, res) => {
    try {
        const teamMember = await TeamMember.findById(req.params.id).populate('user', 'displayName email image googleId enrollmentNo');
        if (!teamMember) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        res.json(teamMember);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Team Member ID format' });
        }
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});


// @desc    Create a new team member
// @route   POST /api/team-members
router.post('/', ensureAdmin, async (req, res) => {
    try {
        const { userId, name, profilepic, description, website, codeiiest, gdg } = req.body;

        const newTeamMemberData = { name, profilepic, description, website, codeiiest, gdg };

        // If a userId is provided, find the user and link them
        if (userId) {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found for provided userId' });
            }
            newTeamMemberData.user = userId;
        }

        const newTeamMember = new TeamMember(newTeamMemberData);
        const savedTeamMember = await newTeamMember.save();
        res.status(201).json(savedTeamMember);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Error creating team member', error: err.message });
    }
});

// @desc    Update an existing team member
// @route   PUT /api/team-members/:id
router.put('/:id', ensureAdmin, async (req, res) => {
    try {
        const { userId, name, profilepic, description, website, codeiiest, gdg } = req.body;
        const updateData = { name, profilepic, description, website, codeiiest, gdg };

        if (userId) {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found for provided userId' });
            }
            updateData.user = userId;
        } else {
            // If userId is explicitly set to null/undefined in update, unlink
            updateData.$unset = { user: 1 };
        }

        const updatedTeamMember = await TeamMember.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('user', 'displayName email image googleId enrollmentNo'); // Populate on update as well

        if (!updatedTeamMember) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        res.json(updatedTeamMember);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Error updating team member', error: err.message });
    }
});

// @desc    Delete a team member
// @route   DELETE /api/team-members/:id
router.delete('/:id', ensureAdmin, async (req, res) => {
    try {
        const teamMember = await TeamMember.findByIdAndDelete(req.params.id);
        if (!teamMember) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        res.json({ message: 'Team member removed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;