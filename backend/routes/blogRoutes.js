const express = require("express");
const router = express.Router();

const {
    createBlog,
    getBlogs,
    getSingleBlog,
    deleteBlog,
    updateBlog,
    getBlogById,
    uploadBlogImage,
} = require("../controllers/blogController");

const uploadBlogImageMiddleware = require("../middleware/blogUpload");

// Upload Image
router.post("/upload-image", uploadBlogImageMiddleware, uploadBlogImage);

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