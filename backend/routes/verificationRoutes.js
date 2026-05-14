const express = require("express");
const router = express.Router();

const upload = require("../utils/upload");
const { submitDocuments } = require("../controllers/verificationController");
const authMiddleware = require("../middlewares/authMiddleware");

// upload DL + RC
router.post(
    "/submit",
    authMiddleware,
    upload.fields([
        { name: "dl", maxCount: 1 },
        { name: "rc", maxCount: 1 }
    ]),
    submitDocuments
);

module.exports = router;