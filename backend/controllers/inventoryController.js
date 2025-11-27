const Medicine = require("../models/Medicine");

// Helper: derive status from quantity (if not provided)
const getStatusFromQuantity = (quantity) => {
  if (quantity <= 0) return "OUT_OF_STOCK";
  if (quantity <= 10) return "LOW_STOCK";
  return "IN_STOCK";
};

// @desc    Get all medicines for logged-in store
// @route   GET /api/inventory
// @access  Private
const getMedicines = async (req, res) => {
  try {
    const storeId = req.store._id;

    const medicines = await Medicine.find({ store: storeId }).sort({
      updatedAt: -1,
    });

    return res.json({
      success: true,
      count: medicines.length,
      medicines,
    });
  } catch (error) {
    console.error("GetMedicines error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a single medicine by ID (owned by store)
// @route   GET /api/inventory/:id
// @access  Private
const getMedicineById = async (req, res) => {
  try {
    const storeId = req.store._id;
    const { id } = req.params;

    const medicine = await Medicine.findOne({ _id: id, store: storeId });

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    return res.json({
      success: true,
      medicine,
    });
  } catch (error) {
    console.error("GetMedicineById error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new medicine
// @route   POST /api/inventory
// @access  Private
const createMedicine = async (req, res) => {
  try {
    const storeId = req.store._id;
    const { name, genericName, brand, quantity, price, status } = req.body;

    if (name == null || name.trim() === "") {
      return res.status(400).json({ message: "Medicine name is required" });
    }

    if (quantity == null || isNaN(quantity)) {
      return res.status(400).json({ message: "Quantity is required" });
    }

    const numericQuantity = Number(quantity);
    const numericPrice = price != null ? Number(price) : 0;

    const derivedStatus =
      status && ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"].includes(status)
        ? status
        : getStatusFromQuantity(numericQuantity);

    const medicine = await Medicine.create({
      store: storeId,
      name: name.trim(),
      genericName: genericName ? genericName.trim() : undefined,
      brand: brand ? brand.trim() : undefined,
      quantity: numericQuantity,
      price: numericPrice,
      status: derivedStatus,
      lastUpdated: new Date(),
    });

    return res.status(201).json({
      success: true,
      medicine,
    });
  } catch (error) {
    console.error("CreateMedicine error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a medicine
// @route   PUT /api/inventory/:id
// @access  Private
const updateMedicine = async (req, res) => {
  try {
    const storeId = req.store._id;
    const { id } = req.params;
    const { name, genericName, brand, quantity, price, status } = req.body;

    // Ensure medicine belongs to this store
    const medicine = await Medicine.findOne({ _id: id, store: storeId });

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    if (name != null) medicine.name = name.trim();
    if (genericName != null) medicine.genericName = genericName.trim();
    if (brand != null) medicine.brand = brand.trim();

    if (quantity != null && !isNaN(quantity)) {
      medicine.quantity = Number(quantity);
    }

    if (price != null && !isNaN(price)) {
      medicine.price = Number(price);
    }

    // Decide status:
    //  - if a valid status is provided, use it
    //  - else, derive from current quantity
    if (status && ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"].includes(status)) {
      medicine.status = status;
    } else if (quantity != null) {
      medicine.status = getStatusFromQuantity(medicine.quantity);
    }

    medicine.lastUpdated = new Date();

    const updated = await medicine.save();

    return res.json({
      success: true,
      medicine: updated,
    });
  } catch (error) {
    console.error("UpdateMedicine error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a medicine
// @route   DELETE /api/inventory/:id
// @access  Private
const deleteMedicine = async (req, res) => {
  try {
    const storeId = req.store._id;
    const { id } = req.params;

    const medicine = await Medicine.findOne({ _id: id, store: storeId });

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    await medicine.deleteOne();

    return res.json({
      success: true,
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    console.error("DeleteMedicine error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
};
