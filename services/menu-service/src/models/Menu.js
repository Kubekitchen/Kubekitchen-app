const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    restaurantId: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ["starter", "main", "dessert", "beverage", "side"],
      required: true,
    },
    image: { type: String, default: "" },
    isAvailable: { type: Boolean, default: true },
    isVeg: { type: Boolean, default: false },
    spiceLevel: { type: String, enum: ["mild", "medium", "hot", "extra-hot"], default: "mild" },
    preparationTime: { type: Number, default: 15 },
    calories: { type: Number },
    allergens: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);