const express = require("express");
const router = express.Router();

const {
    createBlog,
    getBlogs,
    getSingleBlog,
    deleteBlog,
    updateBlog,
    getBlogById,
} = require("../controllers/blogController");

// Create
router.post("/", createBlog);

// Get all
router.get("/", getBlogs);

// 👇 IMPORTANT: separate paths

// Get by SLUG (public)
// router.get("/slug/:slug", getSingleBlog);

// Get by ID (admin edit)
router.get("/id/:id", getBlogById);

// Update
router.put("/:id", updateBlog);

// Delete
router.delete("/:id", deleteBlog);

module.exports = router;