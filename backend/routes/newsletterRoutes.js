const express = require("express");
const router = express.Router();

const {
    subscribe,
    unsubscribe,
    getSubscribers,
} = require("../controllers/newsletterController");

router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);

router.get("/", getSubscribers);

module.exports = router;