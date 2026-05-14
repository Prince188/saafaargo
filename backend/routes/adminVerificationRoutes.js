const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
    getPendingVerifications,
    approveVerification,
    rejectVerification,
} = require("../controllers/adminVerificationController");

const router = express.Router();

router.get(
    "/pending",
    // authMiddleware,
    getPendingVerifications
);

router.patch(
    "/:id/approve",
    // authMiddleware,
    approveVerification
);

router.patch(
    "/:id/reject",
    //    authMiddleware,
    rejectVerification
);

module.exports = router;