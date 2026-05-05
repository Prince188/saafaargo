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

const allowedOrigins = [
    "http://localhost:3000",
    "https://saafaargo.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
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

app.use("/api/visitor", require("./routes/visitorRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});