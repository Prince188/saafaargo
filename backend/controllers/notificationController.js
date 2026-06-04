const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);
        const unreadCount = await Notification.countDocuments({ user: req.user.id, read: false });
        res.json({ notifications, unreadCount });
    } catch (err) {
        console.error("[getNotifications] Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { read: true }
        );
        res.json({ success: true });
    } catch (err) {
        console.error("[markAsRead] Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user.id, read: false },
            { read: true }
        );
        res.json({ success: true });
    } catch (err) {
        console.error("[markAllAsRead] Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};