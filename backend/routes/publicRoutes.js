const express = require("express");
const { searchMedicines } = require("../controllers/publicController");

const router = express.Router();

// Public search route
router.get("/search", searchMedicines);

module.exports = router;
