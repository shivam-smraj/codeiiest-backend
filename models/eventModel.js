// backend/models/eventModel.js
import mongoose from 'mongoose';

const avatarSchema = new mongoose.Schema({
    name: String,
    img: String
}, { _id: false });

const sideDetailsSchema = new mongoose.Schema({
    text1: String,
    text2: String,
    text3: String
}, { _id: false });

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    miniTitle: String,
    description: String,
    imageVariant: String,
    AvatarSampleData: [avatarSchema],
    TagsList: [String],
    sideDetails1: sideDetailsSchema,
    sideDetails2: sideDetailsSchema,
    completionStatus: { type: Number, default: 0 },
    moreInfo: String,
    isFeatured: { type: Boolean, default: false }
}, {
    timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

export default Event;