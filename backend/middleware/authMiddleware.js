const jwt = require("jsonwebtoken");
const Store = require("../models/Store");

const protect = async (req, res, next) => {
  let token;

  try {
    // Check for Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach store to request (excluding password)
      const store = await Store.findById(decoded.id).select("-password");

      if (!store) {
        return res.status(401).json({ message: "Store not found" });
      }

      req.store = store;
      return next();
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { protect };
