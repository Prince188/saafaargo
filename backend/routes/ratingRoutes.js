const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { submitRating, getMyRatings } = require("../controllers/ratingController");

router.post("/", authMiddleware, submitRating);
router.get("/mine", authMiddleware, getMyRatings);

module.exports = router;
