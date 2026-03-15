const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Check for token in headers
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.session?.token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'travelgo_secret_key');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
