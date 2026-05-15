const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createRide, getRides, getMyRides, getRideById, bookRide, deleteRide, getAllRides } = require("../controllers/rideController");

router.post("/", authMiddleware, createRide);

router.get("/", getRides);

router.get("/my-rides", authMiddleware, getMyRides)

router.get("/admin/all", authMiddleware, getAllRides);

router.get("/:id", getRideById)

router.post("/:id/book", authMiddleware, bookRide);

router.delete("/delete/:id", authMiddleware, deleteRide);


module.exports = router; 