const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        mobile: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            enum: [
                "general",
                "support",
                "bug",
                "unblock_request",
            ],
            default: "general",
        },

        message: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);