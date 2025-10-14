// In /server/routes/chapters.js

const express = require('express');
const router = express.Router();
const { ensureAdmin } = require('../middleware/authMiddleware');
const Chapter = require('../models/Chapter');
const TeamMember = require('../models/TeamMember'); // Needed for validation/linking

// Helper function to populate member details
const populateChapterMembers = (query) => {
    return query
        .populate({
            path: 'leads',
            populate: {
                path: 'user',
                select: 'displayName email image enrollmentNo' // Select relevant user fields
            }
        })
        .populate({
            path: 'coreMembers',
            populate: {
                path: 'user',
                select: 'displayName email image enrollmentNo'
            }
        });
};


// @desc    Get all chapters
// @route   GET /api/chapters
router.get('/', async (req, res) => {
    try {
        const chapters = await populateChapterMembers(Chapter.find()).sort({ name: 1 });
        res.json(chapters);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get a single chapter by ID
// @route   GET /api/chapters/:id
router.get('/:id', async (req, res) => {
    try {
        const chapter = await populateChapterMembers(Chapter.findById(req.params.id));
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        res.json(chapter);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Chapter ID format' });
        }
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a new chapter
// @route   POST /api/chapters
router.post('/', ensureAdmin, async (req, res) => {
    try {
        // Basic validation for leads/coreMembers IDs (optional but good)
        if (req.body.leads && !Array.isArray(req.body.leads)) {
            return res.status(400).json({ message: 'Leads must be an array of TeamMember IDs' });
        }
        if (req.body.coreMembers && !Array.isArray(req.body.coreMembers)) {
            return res.status(400).json({ message: 'Core Members must be an array of TeamMember IDs' });
        }

        const newChapter = new Chapter(req.body);
        const savedChapter = await newChapter.save();
        // Populate immediately to return full details
        const populatedChapter = await populateChapterMembers(Chapter.findById(savedChapter._id));
        res.status(201).json(populatedChapter);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Error creating chapter', error: err.message });
    }
});

// @desc    Update an existing chapter
// @route   PUT /api/chapters/:id
router.put('/:id', ensureAdmin, async (req, res) => {
    try {
        // Basic validation for leads/coreMembers IDs (optional but good)
        if (req.body.leads && !Array.isArray(req.body.leads)) {
            return res.status(400).json({ message: 'Leads must be an array of TeamMember IDs' });
        }
        if (req.body.coreMembers && !Array.isArray(req.body.coreMembers)) {
            return res.status(400).json({ message: 'Core Members must be an array of TeamMember IDs' });
        }

        const updatedChapter = await Chapter.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedChapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        // Populate immediately to return full details
        const populatedChapter = await populateChapterMembers(Chapter.findById(updatedChapter._id));
        res.json(populatedChapter);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Error updating chapter', error: err.message });
    }
});

// @desc    Delete a chapter
// @route   DELETE /api/chapters/:id
router.delete('/:id', ensureAdmin, async (req, res) => {
    try {
        const chapter = await Chapter.findByIdAndDelete(req.params.id);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        res.json({ message: 'Chapter removed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;