const express = require("express");
const Order = require("../models/Order");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

router.get("/", async (req, res) => {
  try {
    const query =
      req.user.role === "admin" ? {} : { customerId: req.user.id };

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Not found" });

    if (order.customerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { items, restaurantId, restaurantName, deliveryAddress, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order must have at least one item" });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const estimatedDelivery = new Date();
    estimatedDelivery.setMinutes(estimatedDelivery.getMinutes() + 45);

    const order = await Order.create({
      customerId: req.user.id,
      customerName: req.user.name,
      restaurantId,
      restaurantName,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      notes,
      estimatedDelivery,
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: "Not found" });

    if (req.user.role === "customer" && status !== "cancelled") {
      return res.status(403).json({ success: false, message: "Customers can only cancel orders" });
    }

    if (status === "cancelled" && order.status !== "pending") {
      return res.status(400).json({ success: false, message: "Only pending orders can be cancelled" });
    }

    order.status = status;
    if (status === "paid") order.paymentStatus = "paid";
    await order.save();

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;