const express = require("express");
const Restaurant = require("../models/Restaurant");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { cuisine, search, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (cuisine) query.cuisine = { $in: [cuisine] };
    if (search) query.name = { $regex: search, $options: "i" };

    const restaurants = await Restaurant.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ rating: -1 });

    const total = await Restaurant.countDocuments(query);

    res.json({ success: true, data: restaurants, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: restaurant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/", verifyToken, requireRole("restaurant_owner", "admin"), async (req, res) => {
  try {
    const restaurant = await Restaurant.create({ ...req.body, ownerId: req.user.id });
    res.status(201).json({ success: true, data: restaurant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/:id", verifyToken, requireRole("restaurant_owner", "admin"), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, message: "Not found" });

    if (restaurant.ownerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/:id", verifyToken, requireRole("restaurant_owner", "admin"), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, message: "Not found" });

    if (restaurant.ownerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Restaurant deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/:id/rate", verifyToken, async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, message: "Not found" });

    const newTotal = restaurant.totalRatings + 1;
    const newRating = (restaurant.rating * restaurant.totalRatings + rating) / newTotal;

    restaurant.rating = Math.round(newRating * 10) / 10;
    restaurant.totalRatings = newTotal;
    await restaurant.save();

    res.json({ success: true, data: restaurant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;