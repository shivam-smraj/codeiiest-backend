import mongoose from 'mongoose';

const iconSchema = new mongoose.Schema({
    icon: String,
    byline: String
});

const highlightSchema = new mongoose.Schema({
    heading: String,
    byline: String,
    icon: String,
    iconheading: String,
    iconbyline: String,
    bylineProps: mongoose.Schema.Types.Mixed,
    imageProps: mongoose.Schema.Types.Mixed,
});

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  codeiiest: String,
  gdg: String,
  profilepic: String,
  description: String,
  website: String,
  image: String,
  tagline: String,
  team: String,
  role: String,
  email: String,
  url: String
});

const eventSummarySchema = new mongoose.Schema({
  eventName: String,
  date: String,
  location: String,
  description: String,
  total: Number,
  progress: Number
});

const chapterSchema = new mongoose.Schema({
    chapterId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    chapterContent: {
        title: { type: String, required: true },
        description: String,
        byline: String,
        highlight: highlightSchema,
        iconset: [iconSchema],
        leads: [memberSchema],
        coreMembers: [memberSchema],
        events: [eventSummarySchema]
    }
}, {
    timestamps: true,
});

const Chapter = mongoose.model('Chapter', chapterSchema);

export default Chapter;