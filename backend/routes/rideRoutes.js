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
    getAllRides,
    editRide
} = require("../controllers/rideController");

// ─── Driver verification routes ────────────────────────────────────────────
const driverController = require("../controllers/driverController");

const { driverUpload, handleDriverDocUpload } = require("../middleware/driverDocUpload");

router.post(
    "/driver/submit-documents",
    authMiddleware,
    driverUpload.fields([
        { name: "dlImage", maxCount: 1 },
        { name: "rcImage", maxCount: 1 }
    ]),
    handleDriverDocUpload,      // ← manually uploads to Cloudinary, sets .path
    driverController.submitDocuments   // ← controller unchanged, still reads .path
);

router.get("/driver/verification-status", authMiddleware, driverController.getVerificationStatus);
// ──────────────────────────────────────────────────────────────────────────

// ─── Existing routes (unchanged) ──────────────────────────────────────────
router.post("/", authMiddleware, createRide);

router.get("/", getRides);

router.get("/my-rides", authMiddleware, getMyRides);

router.get("/admin/all", authMiddleware, getAllRides);

router.get("/:id", getRideById);

router.post("/:id/book", authMiddleware, bookRide);

router.delete("/delete/:id", authMiddleware, deleteRide);

router.put("/edit/:id", authMiddleware, editRide);
// ──────────────────────────────────────────────────────────────────────────

module.exports = router;