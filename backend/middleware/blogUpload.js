const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "blog_images",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        transformation: [
            { width: 1200, crop: "limit" }, // Resize large images to maximum 1200px width
            { quality: "auto:eco" },       // Optimize quality for lower file size
            { fetch_format: "auto" }      // Deliver in the most optimal format automatically (webp, avif)
        ]
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Enforce 5 MB maximum size limit
});

// Wrapper middleware to intercept and handle multer errors gracefully
const uploadBlogImageMiddleware = (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    message: "Image is too large. Maximum size allowed is 5 MB."
                });
            }
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({
                message: err.message || "An error occurred during file upload."
            });
        }
        next();
    });
};

module.exports = uploadBlogImageMiddleware;
