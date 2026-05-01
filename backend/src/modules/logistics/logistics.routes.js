const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Ensure the ID is a number for our Int-based queries
        req.user = {
            ...decoded,
            id: parseInt(decoded.id)
        };
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
};

module.exports = verifyToken;