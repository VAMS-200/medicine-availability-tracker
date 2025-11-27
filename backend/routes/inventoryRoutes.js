const express = require("express");
const {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} = require("../controllers/inventoryController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes below are protected
router.use(protect);

// GET /api/inventory -> list all medicines for this store
router.get("/", getMedicines);

// GET /api/inventory/:id -> get one medicine
router.get("/:id", getMedicineById);

// POST /api/inventory -> create new medicine
router.post("/", createMedicine);

// PUT /api/inventory/:id -> update medicine
router.put("/:id", updateMedicine);

// DELETE /api/inventory/:id -> delete medicine
router.delete("/:id", deleteMedicine);

module.exports = router;
