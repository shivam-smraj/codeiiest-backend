// In /server/models/TeamMember.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeamMemberSchema = new Schema({
    // Link to our User model if the person is a registered user.
    // This allows us to get their email, image from Google, etc.
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Not every team member has to be a portal user
    },
    // If not a registered user, we might store some basic info directly
    name: { // Display name if not linked to a User, or fallback if user.displayName isn't available
        type: String,
        required: true,
        trim: true
    },
    profilepic: { // Image filename or URL if not linked to a User
        type: String,
        required: false,
    },
    description: String, // Their quote/tagline
    website: String, // Their personal website/LinkedIn
    
    // Role within the specific team (e.g., "Frontend Lead", "CP Core Member")
    codeiiest: String, 
    gdg: String,

}, {
    timestamps: true
});

const TeamMember = mongoose.model("TeamMember", TeamMemberSchema);

module.exports = TeamMember;