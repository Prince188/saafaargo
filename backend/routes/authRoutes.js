const express = require('express');
const router = express.Router();
const { register, login } = require("../controllers/authController");
const upload = require('../middleware/upload');

router.post('/register', upload.single('profilePic') ,register); // api/auth/register
router.post('/login', login); // api/auth/login

module.exports = router;