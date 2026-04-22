const express = require("express");
const MenuItem = require("../models/Menu");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/restaurant/:restaurantId", async (req, res) => {
  try {
    const { category } = req.query;
    const query = { restaurantId: req.params.restaurantId, isAvailable: true };
    if (category) query.category = category;

    const items = await MenuItem.find(query).sort({ category: 1, name: 1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/bulk", async (req, res) => {
  try {
    const { ids } = req.body;
    const items = await MenuItem.find({ _id: { $in: ids } });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/", verifyToken, requireRole("restaurant_owner", "admin"), async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/:id", verifyToken, requireRole("restaurant_owner", "admin"), async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/:id", verifyToken, requireRole("restaurant_owner", "admin"), async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;