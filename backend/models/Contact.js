const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
    {
        name: String,
        email: String,

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