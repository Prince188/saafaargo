const express = require('express');
const connectDB = require("./config/db");
const cors = require('cors');

// Login and Register routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const rideRoutes = require("./routes/rideRoutes");



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
    origin: "https://saafaargo.vercel.app",
    // origin: "http://localhost:3000", 
    credentials: true
}));

app.use(express.json());

// Use auth routes
app.use('/api/auth', authRoutes);  // https://localhost:5000/api/auth/register or login

// User profile routes
app.use('/api/users', userRoutes);  // https://localhost:5000/api/users/profile

//Vehicle routes

app.use('/api/vehicles', vehicleRoutes)

//Add Ride Api

app.use("/api/rides", rideRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});