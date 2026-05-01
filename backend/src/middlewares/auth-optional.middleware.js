const jwt = require('jsonwebtoken');

const verifyTokenOptional = (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header) return next();

    const token = header.split(' ')[1];
    if (!token) return next();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { ...decoded, id: parseInt(decoded.id) };
    } catch (err) {
        // Ignore invalid token — treat as unauthenticated but continue
    }

    return next();
};

module.exports = verifyTokenOptional;
