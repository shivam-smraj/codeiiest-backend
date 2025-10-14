const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`[SERVER] MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[SERVER] Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;