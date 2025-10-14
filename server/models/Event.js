
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// We can define a simpler schema for nested objects
const SideDetailSchema = new Schema({
    text1: String,
    text2: String,
    text3: String,
}, { _id: false }); // _id: false prevents Mongoose from creating an id for this sub-document

const AvatarSchema = new Schema({
    name: String,
    img: String,
}, { _id: false });


const EventSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    miniTitle: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageVariant: String,
    AvatarSampleData: [AvatarSchema],
    TagsList: [String],
    sideDetails1: SideDetailSchema,
    sideDetails2: SideDetailSchema,
    completionStatus: {
        type: Number,
        default: 0,
    },
    moreInfo: {
        type: String,
        default: '#',
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;