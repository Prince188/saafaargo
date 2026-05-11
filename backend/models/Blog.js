const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
    },

    slug: {
        type: String,
        required: true,
        unique: true,
    },

    content: {
        type: String,
        required: true,
    },

    image: {
        type: String,
    },

    author: {
        type: String,
        default: "Admin",
    },

    tags: [String],
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("Blog", blogSchema);