const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Store = require("../models/Store");

// Helper: generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @desc    Register new store
// @route   POST /api/auth/register
// @access  Public
const registerStore = async (req, res) => {
  try {
    const {
      name,
      ownerName,
      email,
      password,
      phone,
      addressLine,
      city,
      state,
      pincode,
    } = req.body;

    // Basic validation
    if (!name || !email || !password || !pincode) {
      return res
        .status(400)
        .json({ message: "Name, email, password, and pincode are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if store already exists
    const existingStore = await Store.findOne({ email });
    if (existingStore) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create store
    const store = await Store.create({
      name,
      ownerName,
      email,
      password: hashedPassword,
      phone,
      addressLine,
      city,
      state,
      pincode,
    });

    const token = generateToken(store._id);

    return res.status(201).json({
      success: true,
      token,
      store: {
        _id: store._id,
        name: store.name,
        ownerName: store.ownerName,
        email: store.email,
        phone: store.phone,
        addressLine: store.addressLine,
        city: store.city,
        state: store.state,
        pincode: store.pincode,
        createdAt: store.createdAt,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Login store
// @route   POST /api/auth/login
// @access  Public
const loginStore = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const store = await Store.findOne({ email });

    if (!store) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, store.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(store._id);

    return res.json({
      success: true,
      token,
      store: {
        _id: store._id,
        name: store.name,
        ownerName: store.ownerName,
        email: store.email,
        phone: store.phone,
        addressLine: store.addressLine,
        city: store.city,
        state: store.state,
        pincode: store.pincode,
        createdAt: store.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get current logged-in store
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.store is set in protect middleware
    return res.json({
      success: true,
      store: req.store,
    });
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerStore,
  loginStore,
  getMe,
};
