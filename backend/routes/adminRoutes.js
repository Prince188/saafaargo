// ─── Add these 3 routes to your existing adminRoutes.js ───────────────────
// (import driverController at the top of that file alongside your other imports)
const express = require("express");
const router = express.Router();

const driverController = require("../controllers/driverController");
const authMiddleware = require("../middleware/authMiddleware");
const { getRecentActivities, getAdminDashboard } = require("../controllers/adminController");

router.get("/drivers", authMiddleware, driverController.getAllDrivers);
router.patch("/drivers/:userId/approve", authMiddleware, driverController.approveDriver);
router.patch("/drivers/:userId/reject", authMiddleware, driverController.rejectDriver);

router.get("/dashboard", authMiddleware, getAdminDashboard);
router.get("/recent-activities", authMiddleware, getRecentActivities);

module.exports = router;

// ──────────────────────────────────────────────────────────────────────────