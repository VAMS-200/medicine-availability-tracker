const express = require("express");
const {
  registerStore,
  loginStore,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerStore);
router.post("/login", loginStore);

// Private route
router.get("/me", protect, getMe);

module.exports = router;
