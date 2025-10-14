// In /server/models/Chapter.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventProgressSchema = new Schema({
    eventName: String,
    date: String, // Keep as string for now if it's "tbd"
    location: String,
    description: String,
    total: Number,
    progress: Number,
}, { _id: false });

const IconSetItemSchema = new Schema({
    icon: String,
    byline: String,
}, { _id: false });

const HighlightSchema = new Schema({
    heading: String,
    byline: String,
    icon: String,
    iconheading: String,
    iconbyline: String,
    bylineProps: Object, // For inline styles
    imageProps: Object, // For image styles
}, { _id: false });


const ChapterSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: String,
    byline: String, // The secondary tagline
    
    // References to TeamMember documents
    leads: [{
        type: Schema.Types.ObjectId,
        ref: 'TeamMember'
    }],
    coreMembers: [{
        type: Schema.Types.ObjectId,
        ref: 'TeamMember'
    }],

    // Fields that represent the 'chapterContent' from your JSON
    events: [EventProgressSchema],
    iconset: [IconSetItemSchema],
    title: String, // e.g., "DEV DYNAMITES"
    highlight: HighlightSchema,
    
}, {
    timestamps: true
});

const Chapter = mongoose.model("Chapter", ChapterSchema);

module.exports = Chapter;