// backend/models/userModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: { 
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: false,   //no need to enter pass
        select: false, // Prevents password from being sent back in queries by default
    },
    rollId: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple users to have a null/missing rollId
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    codeforcesHandle: { type: String, trim: true },
    leetcodeHandle: { type: String, trim: true },
    codechefHandle: { type: String, trim: true },
}, {
    timestamps: true, 
});

// Hash password only if it's being modified (for manual admin-created accounts, for example)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// This method can remain for any potential password-based logic in the future
userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;