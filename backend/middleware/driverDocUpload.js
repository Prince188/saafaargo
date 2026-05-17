const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

const storage = multer.memoryStorage();
const driverUpload = multer({ storage });

const uploadToCloudinary = (fileBuffer, options) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
        Readable.from(fileBuffer).pipe(stream);
    });
};

const handleDriverDocUpload = async (req, res, next) => {
    try {
        if (!req.files) return next();

        for (const fieldName of ["dlImage", "rcImage"]) {
            const file = req.files?.[fieldName]?.[0];
            if (!file) continue;

            const isPdf = file.mimetype === "application/pdf";

            const result = await uploadToCloudinary(file.buffer, {
                folder: "driver_documents",
                resource_type: isPdf ? "raw" : "image",
                public_id: Date.now() + "-" + file.originalname.replace(/\s+/g, "_"),
            });

            // Overwrite so controller can still use req.files[field][0].path
            req.files[fieldName][0].path = result.secure_url;
        }

        next();
    } catch (err) {
        console.error("Cloudinary upload error:", err);
        return res.status(500).json({ message: "Document upload failed", error: err.message });
    }
};

module.exports = { driverUpload, handleDriverDocUpload };