// ─── Add these 3 routes to your existing adminRoutes.js ───────────────────
// (import driverController at the top of that file alongside your other imports)

const driverController = require("../controllers/driverController");

router.get("/drivers", authMiddleware, adminOnly, driverController.getAllDrivers);
router.patch("/drivers/:userId/approve", authMiddleware, adminOnly, driverController.approveDriver);
router.patch("/drivers/:userId/reject", authMiddleware, adminOnly, driverController.rejectDriver);
// ──────────────────────────────────────────────────────────────────────────