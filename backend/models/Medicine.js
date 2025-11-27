const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
    },
    genericName: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
    },
    status: {
      type: String,
      enum: ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"],
      default: "OUT_OF_STOCK",
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Medicine = mongoose.model("Medicine", medicineSchema);

module.exports = Medicine;
