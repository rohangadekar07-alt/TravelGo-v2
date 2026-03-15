const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/send-otp', authController.sendOtp);
router.post('/register', authController.register);
router.get('/verify', authController.verifyEmail);
router.post('/login', authController.login);

module.exports = router;
