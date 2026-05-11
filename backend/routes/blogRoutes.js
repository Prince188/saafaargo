const express = require("express");
const router = express.Router();

const {
    createBlog,
    getBlogs,
    getSingleBlog,
    deleteBlog,
    updateBlog,
} = require("../controllers/blogController");

router.post("/", createBlog);

router.get("/", getBlogs);

router.get("/:slug", getSingleBlog);

router.put("/:id", updateBlog);

router.delete("/:id", deleteBlog);

module.exports = router;