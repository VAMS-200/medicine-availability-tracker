const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

// Middleware
// Middleware
const corsOptions = {
  origin: ["http://localhost:5173"], // e.g. "https://your-frontend.vercel.app"
  credentials: false,
};
app.use(cors(corsOptions));
app.use(express.json());
 // Parse JSON bodies

// Basic health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend server is running",
    time: new Date().toISOString()
  });
});
// Auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Inventory routes
const inventoryRoutes = require("./routes/inventoryRoutes");
app.use("/api/inventory", inventoryRoutes);



// Public routes (no auth)
const publicRoutes = require("./routes/publicRoutes");
app.use("/api/public", publicRoutes);

// Get port from env or default
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
