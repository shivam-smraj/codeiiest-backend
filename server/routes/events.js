// In /server/routes/events.js

const express = require('express');
const router = express.Router();
const { ensureAdmin } = require('../middleware/authMiddleware'); // Import our admin protection
const Event = require('../models/Event'); // Import the Event model

// --- Public Route ---
// @desc    Get all events
// @route   GET /api/events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find({}).sort({ createdAt: -1 }); // Get newest first
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- Admin-Only Routes ---

// @desc    Create a new event
// @route   POST /api/events
router.post('/', ensureAdmin, async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        res.status(400).json({ message: 'Error creating event', error: err.message });
    }
});
// @desc    Get single event by ID
// @route   GET /api/events/:id
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (err) {
        // Handle cases where ID format is invalid (e.g., not a valid ObjectId)
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Event ID format' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update an existing event
// @route   PUT /api/events/:id
router.put('/:id', ensureAdmin, async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // {new: true} returns the updated document
        );
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(updatedEvent);
    } catch (err) {
        res.status(400).json({ message: 'Error updating event', error: err.message });
    }
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
router.delete('/:id', ensureAdmin, async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event removed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;