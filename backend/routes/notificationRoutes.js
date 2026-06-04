const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
} = require("../controllers/notificationController");

router.get("/", authMiddleware, getNotifications);
router.put("/read/:id", authMiddleware, markAsRead);
router.put("/read-all", authMiddleware, markAllAsRead);

module.exports = router;