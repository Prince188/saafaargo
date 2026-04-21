const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bio:{
        type: String,
        default: ""
    },
    profilePic: {
        type: String,   // store image URL or file path
        default: ""     // optional default image
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);