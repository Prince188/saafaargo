const Blog = require("../models/Blog");

exports.createBlog = async (req, res) => {
    try {
        const blog = await Blog.create(req.body);

        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });

        res.json(blogs);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.getSingleBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({
            slug: req.params.slug,
        });

        res.json(blog);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(blog);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);

        res.json({
            message: "Blog deleted",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
            });
        }

        res.json(blog);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.uploadBlogImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No image file provided."
            });
        }

        res.json({
            imageUrl: req.file.path
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};