const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    createRide,
    getRides,
    getMyRides,
    getRideById,
    bookRide,
    deleteRide,
    getAllRides
} = require("../controllers/rideController");

// ─── Driver verification routes (NEW) ─────────────────────────────────────
// Keeps everything in one router so you don't need a separate mount in app.js
const driverController = require("../controllers/driverController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/driver-docs/"),
    filename: (req, file, cb) => {
        const unique = `${req.user.id}-${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, unique);
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        /jpeg|jpg|png|pdf/.test(path.extname(file.originalname).toLowerCase())
            ? cb(null, true)
            : cb(new Error("Only jpg, png, pdf allowed"), false);
    },
    limits: { fileSize: 5 * 1024 * 1024 }   // 5 MB per file
});

// Driver submits DL + RC (first time or after rejection)
router.post(
    "/driver/submit-documents",
    authMiddleware,
    upload.fields([{ name: "dlImage", maxCount: 1 }, { name: "rcImage", maxCount: 1 }]),
    driverController.submitDocuments
);

// Frontend polls this before showing the publish modal
router.get("/driver/verification-status", authMiddleware, driverController.getVerificationStatus);
// ──────────────────────────────────────────────────────────────────────────

// ─── Existing routes (UNCHANGED) ──────────────────────────────────────────
router.post("/", authMiddleware, createRide);

router.get("/", getRides);

router.get("/my-rides", authMiddleware, getMyRides);

router.get("/admin/all", authMiddleware, getAllRides);

router.get("/:id", getRideById);

router.post("/:id/book", authMiddleware, bookRide);

router.delete("/delete/:id", authMiddleware, deleteRide);
// ──────────────────────────────────────────────────────────────────────────

module.exports = router;