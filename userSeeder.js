// backend/userSeeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

// Import Models
import User from './models/userModel.js'; 

// Import DB connection
import connectDB from './config/db.js';

dotenv.config();
connectDB();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importUsers = async () => {
    try {
        // Read the JSON file with past student data
        const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'data.json'), 'utf-8'));

        // A default password for all imported users. 
        // They can reset it later if you implement a "Forgot Password" feature.
        const defaultPassword = "password123"; 

        // Map the data from your JSON file to your User schema
        const formattedUsers = usersData.map(user => {
            // Basic data cleaning
            const codeforcesHandle = user["CodeForces handle"] ? user["CodeForces handle"].trim() : '';
            const leetcodeHandle = user["LeetCode handle"] ? user["LeetCode handle"].trim() : '';
            const codechefHandle = user["CodeChef handle"] ? user["CodeChef handle"].trim() : '';

            return {
                name: user["Full Name"],
                email: user["Email Address"],
                rollId: user["Enrollment No"],
                // We are not hashing here because the pre-save hook in userModel will do it.
                password: defaultPassword, 
                codeforcesHandle: codeforcesHandle,
                leetcodeHandle: leetcodeHandle,
                codechefHandle: codechefHandle,
                // Role defaults to 'user' as defined in the schema
            };
        });

        console.log(`Preparing to import ${formattedUsers.length} users...`);

        // Use insertMany for efficient bulk insertion.
        // Mongoose will automatically trigger the 'pre-save' hook for each document to hash the password.
        await User.insertMany(formattedUsers, { ordered: false }); // ordered: false continues even if some users fail (e.g., duplicate email)

        console.log('✅ All past users have been imported successfully!');
        process.exit();
    } catch (error) {
        // Handle potential duplicate key errors gracefully
        if (error.code === 11000) {
            console.warn('⚠️ Some users were not imported because they already exist (duplicate email/rollId). This is normal during re-runs.');
        } else {
            console.error(`❌ Error importing users: ${error}`);
        }
        process.exit(1);
    }
};

const destroyUsers = async () => {
    try {
        await User.deleteMany(); // This will delete ALL users in the collection
        console.log('🔥 All users have been destroyed.');
        process.exit();
    } catch (error) {
        console.error(`❌ Error destroying users: ${error}`);
        process.exit(1);
    }
};

// Check for command-line arguments
if (process.argv[2] === '-d') {
    destroyUsers();
} else {
    importUsers();
}