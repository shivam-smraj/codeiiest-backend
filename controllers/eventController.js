// backend/controllers/eventController.js
import asyncHandler from 'express-async-handler';
import Event from '../models/eventModel.js';

const getEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({}).sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(events);
});

const getEventById = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (event) {
        res.status(200).json(event);
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
});

const createEvent = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    
    if (!title || !description) {
        res.status(400);
        throw new Error('Title and description are required');
    }
    
    const event = new Event(req.body);
    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
});

const updateEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (event) {
        Object.assign(event, req.body);
        const updatedEvent = await event.save();
        res.status(200).json(updatedEvent);
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
});

const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (event) {
        await event.deleteOne();
        res.status(200).json({ message: 'Event removed' });
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
});
export { getEvents, getEventById, createEvent, updateEvent, deleteEvent };