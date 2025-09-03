// backend/seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import Chapter from './models/chapterModel.js';
import Event from './models/eventModel.js';
import User from './models/userModel.js'; 

import connectDB from './config/db.js';

dotenv.config();
connectDB();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the JSON files
try {
    // --- CHAPTERS ---
    // Your chapters.json is an object, but mongoose needs an array to insert. 
    // This code transforms the object {'development': {...}, 'cybersecurity': {...}}
    // into an array [{chapterId: 'development', ...}, {chapterId: 'cybersecurity', ...}]
    const chaptersObject = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'chapters.json'), 'utf-8'));
    const chaptersArray = Object.keys(chaptersObject).map(key => {
        return {
            chapterId: key,
            chapterContent: chaptersObject[key].chapterContent
        };
    });

    // --- EVENTS ---
    // Your events.json is already an array, so we can use it directly.
    const eventsArray = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'events.json'), 'utf-8'));
    
    const importData = async () => {
        try {
            // Clear existing data to prevent duplicates
            await Chapter.deleteMany();
            await Event.deleteMany();
            // Optional: uncomment to clear all users during a full reset
            // await User.deleteMany();

            // Insert the new data from your files
            await Chapter.insertMany(chaptersArray);
            await Event.insertMany(eventsArray);

            console.log('✅ Data Imported Successfully!');
            process.exit();
        } catch (error) {
            console.error(`❌ Error with data import: ${error}`);
            process.exit(1);
        }
    };

    const destroyData = async () => {
        try {
            await Chapter.deleteMany();
            await Event.deleteMany();
            // await User.deleteMany();
            
            console.log('🔥 Data Destroyed Successfully!');
            process.exit();
        } catch (error) {
            console.error(`❌ Error with data destruction: ${error}`);
            process.exit(1);
        }
    };

    // Check for command-line argument to decide whether to import or destroy
    if (process.argv[2] === '-d') {
        destroyData();
    } else {
        importData();
    }
} catch (error) {
    console.error('❌ Could not read JSON files. Make sure they are in the /backend/data/ directory.', error);
    process.exit(1);
}