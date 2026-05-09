const express = require("express");
const router = express.Router();
const { trackUniqueVisitor, getTodayVisitors, getVisitorStats, getTotalVisitors } = require("../controllers/visitorController");

router.post("/track-visitor", trackUniqueVisitor);
router.get("/today", getTodayVisitors);
router.get("/total", getTotalVisitors);
router.get("/stats", getVisitorStats);

module.exports = router; 