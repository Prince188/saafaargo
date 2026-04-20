const express = require('express');
const connectDB = require("./config/db");
const cors = require('cors');

// Login and Register routes
const authRoutes = require("./routes/authRoutes");

connectDB();

require('dotenv').config();

const app = express();

app.use(cors({
    origin: [
        // "http://localhost:5000",              // local frontend
        "https://saafaargo-a731qlx12-prince188s-projects.vercel.app"    // deployed frontend
    ],
    credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Use auth routes
app.use('/api/auth', authRoutes);  // https://localhost:5000/api/auth/register or login

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});