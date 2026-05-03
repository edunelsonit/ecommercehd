const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for Bearer token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, please login",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token payload" });
    }

    req.user = {
      id: Number(decoded.id), // Safer than parseInt for numeric IDs
      role: decoded.role,
    };

    next();
  } catch (error) {
    // Distinguish between expired and invalid if you want to be specific
    const message =
      error.name === "TokenExpiredError" ? "Session expired" : "Invalid token";
    res.status(401).json({ success: false, message });
  }
};

module.exports = { protect };
