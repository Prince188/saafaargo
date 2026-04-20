require('dotenv').config();  // Ensure this is at the top


const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);  // Exit process with failure
    }
};

module.exports = connectDB;