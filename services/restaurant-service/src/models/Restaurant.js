const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    cuisine: { type: [String], required: true },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    phone: { type: String },
    email: { type: String },
    image: { type: String, default: "" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    openingHours: {
      open: { type: String, default: "09:00" },
      close: { type: String, default: "22:00" },
    },
    ownerId: { type: String, required: true },
    tags: { type: [String], default: [] },
    deliveryTime: { type: String, default: "30-45 min" },
    minimumOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);