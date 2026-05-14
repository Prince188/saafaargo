const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");

const { getPendingUsers, approveUser, rejectUser } = require("../controllers/adminController");

router.get(
    "/dashboard",
    auth,
    admin,
    getAdminDashboard
);

router.get("/pending-users", auth, admin, getPendingUsers);

router.put("/approve/:userId", auth, admin, approveUser);

router.put("/reject/:userId", auth, admin, rejectUser);

module.exports = router;