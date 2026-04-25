const express = require("express");
const MenuItem = require("../models/Menu");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

// GET menu items for a restaurant
router.get("/restaurant/:restaurantId", async (req, res) => {
  try {
    const { category } = req.query;
    const query = { restaurantId: req.params.restaurantId, isAvailable: true };
    if (category) query.category = category;

    const items = await MenuItem.find(query).sort({ category: 1, name: 1 });
    res.json({ success: true, data: items });
  } catch (err) {
    console.error("Get menu error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single menu item
router.get("/:id", async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item)
      return res.status(404).json({ success: false, message: "Menu item not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    console.error("Get item error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET multiple items by IDs
router.post("/bulk", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids))
      return res.status(400).json({ success: false, message: "Invalid IDs array" });

    const items = await MenuItem.find({ _id: { $in: ids } });
    res.json({ success: true, data: items });
  } catch (err) {
    console.error("Bulk get error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// CREATE menu item
router.post(
  "/",
  verifyToken,
  requireRole("restaurant_owner", "admin"),
  async (req, res) => {
    try {
      const item = await MenuItem.create(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      console.error("Create item error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// UPDATE menu item
router.put(
  "/:id",
  verifyToken,
  requireRole("restaurant_owner", "admin"),
  async (req, res) => {
    try {
      const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item)
        return res.status(404).json({ success: false, message: "Menu item not found" });
      res.json({ success: true, data: item });
    } catch (err) {
      console.error("Update item error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// DELETE menu item
router.delete(
  "/:id",
  verifyToken,
  requireRole("restaurant_owner", "admin"),
  async (req, res) => {
    try {
      const item = await MenuItem.findByIdAndDelete(req.params.id);
      if (!item)
        return res.status(404).json({ success: false, message: "Menu item not found" });
      res.json({ success: true, message: "Menu item deleted" });
    } catch (err) {
      console.error("Delete item error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

module.exports = router;