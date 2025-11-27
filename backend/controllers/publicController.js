const Store = require("../models/Store");
const Medicine = require("../models/Medicine");

// @desc    Public search: find medicines by name + pincode
// @route   GET /api/public/search?medicineName=...&pincode=...
// @access  Public
const searchMedicines = async (req, res) => {
  try {
    const { medicineName, pincode } = req.query;

    // Basic validation
    if (!medicineName || !pincode) {
      return res.status(400).json({
        message: "medicineName and pincode query parameters are required",
      });
    }

    // Find stores in this pincode
    const storesInArea = await Store.find({ pincode: pincode.trim() }).select(
      "_id name phone addressLine city state pincode"
    );

    if (!storesInArea.length) {
      return res.json({
        success: true,
        query: { medicineName, pincode },
        resultsCount: 0,
        stores: [],
      });
    }

    const storeIds = storesInArea.map((s) => s._id);

    // Case-insensitive partial match for medicine name
    const regex = new RegExp(medicineName, "i");

    const medicines = await Medicine.find({
      store: { $in: storeIds },
      $or: [
        { name: regex },
        { genericName: regex },
        { brand: regex },
      ],
    })
      .populate("store", "name phone addressLine city state pincode")
      .sort({ status: 1, updatedAt: -1 }); // optional: sort IN_STOCK higher later if you want

    if (!medicines.length) {
      return res.json({
        success: true,
        query: { medicineName, pincode },
        resultsCount: 0,
        stores: [],
      });
    }

    // Group medicines by store
    const storeMap = new Map();

    medicines.forEach((med) => {
      const store = med.store;
      const storeId = store._id.toString();

      if (!storeMap.has(storeId)) {
        storeMap.set(storeId, {
          storeId,
          storeName: store.name,
          phone: store.phone,
          addressLine: store.addressLine,
          city: store.city,
          state: store.state,
          pincode: store.pincode,
          medicines: [],
        });
      }

      storeMap.get(storeId).medicines.push({
        id: med._id,
        name: med.name,
        genericName: med.genericName,
        brand: med.brand,
        quantity: med.quantity,
        price: med.price,
        status: med.status,
        lastUpdated: med.lastUpdated,
      });
    });

    const stores = Array.from(storeMap.values());

    return res.json({
      success: true,
      query: { medicineName, pincode },
      resultsCount: stores.length,
      stores,
    });
  } catch (error) {
    console.error("Public search error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  searchMedicines,
};
