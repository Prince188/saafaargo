const express = require('express');
const connectDB = require("./config/db");
const cors = require('cors');

// Login and Register routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");


connectDB();

require('dotenv').config();

const app = express();

// app.use(cors({
//     origin: [
//         "http://localhost:5000",              // local frontend
//         "https://saafaargo.vercel.app"    // deployed frontend
//     ],
//     credentials: true
// }));

app.use(cors({
    origin: "*", // Allow all origins (for development purposes)
    credentials: true
}));

app.use(express.json());

// Use auth routes
app.use('/api/auth', authRoutes);  // https://localhost:5000/api/auth/register or login

// User profile routes
app.use('/api/users', userRoutes);  // https://localhost:5000/api/users/profile

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});