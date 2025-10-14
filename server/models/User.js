const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    googleId: {
        type: String,
        required: false, // Changed to false: Not every user needs a Google ID initially
        unique: true,    // Keep unique for Google-authenticated users
        sparse: true     // Allows multiple documents to have a null googleId
    },
    displayName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false, // Changed to false: Not every user needs an email (e.g., alumni)
        unique: true,    // Keep unique for users with emails
        sparse: true     // Allows multiple documents to have a null email
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        enum: ['normal', 'admin', 'alumni'],
        default: 'normal',
    },
    enrollmentNo: String,
    githubId: String,
    codeforcesId: String,
    codeforcesRating: Number,
    codeforcesAvatar: String, 
    leetcodeId: String,
    codechefId: String,
}, {
    timestamps: true
});

const User = mongoose.model("User", UserSchema);

module.exports = User;