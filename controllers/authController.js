const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail, sendOtpEmail, sendWelcomeEmail } = require('../services/emailService');
const OTP = require('../models/OTP');

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists with this email' });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to DB (will overwrite if exists for same email)
        await OTP.findOneAndUpdate(
            { email },
            { otp, createdAt: Date.now() },
            { upsert: true, new: true }
        );

        // Send OTP via Email
        await sendOtpEmail(email, otp);

        res.json({ success: true, message: 'OTP sent successfully to your email' });
    } catch (err) {
        console.error('Send OTP Error:', err);
        res.status(500).json({ success: false, message: 'Failed to send OTP', error: err.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { fullName, email, mobileNumber, address, liveLocation, password, otp } = req.body;

        // 1. Verify OTP first
        const otpDetails = await OTP.findOne({ email, otp });
        if (!otpDetails) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        // Check if user already replaced (double safety)
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user (automatically verified since OTP worked)
        user = new User({
            fullName,
            email,
            mobileNumber,
            address,
            liveLocation: liveLocation || null,
            password: hashedPassword,
            isVerified: true 
        });

        await user.save();

        // Delete OTP after successful registration
        await OTP.deleteOne({ email });

        // Send Welcome Email in background to keep response fast
        sendWelcomeEmail(email, fullName).catch(err => 
            console.error('Background Welcome Email Error:', err)
        );

        return res.status(201).json({
            success: true,
            message: 'Registration successful! Redirecting to login...'
        });

    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).send('<h1>Invalid or expired verification token</h1><a href="/">Go to Home</a>');
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        // Redirect to a success page on frontend
        res.send('<h1>Email Verified Successfully!</h1><p>You can now login to your account.</p><a href="/login.html">Login Now</a>');

    } catch (err) {
        console.error(err);
        res.status(500).send('<h1>Server error during verification</h1>');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if verified
        if (!user.isVerified) {
            return res.status(401).json({ success: false, message: 'Please verify your email before logging in' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Create JWT
        const payload = {
            id: user._id,
            email: user.email,
            name: user.fullName
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'travelgo_secret_key',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.fullName,
                email: user.email
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};
