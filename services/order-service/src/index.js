require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const orderRoutes = require("./routes/order");

const app = express();

const start = async () => {
  await connectDB();

  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(morgan("combined"));
  app.use(express.json());

  app.use("/api/orders", orderRoutes);

  app.get("/health", (req, res) =>
    res.json({ status: "ok", service: "order-service" })
  );

  app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Internal server error" });
  });

  const PORT = process.env.PORT || 4004;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Order service running on 0.0.0.0:${PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start order-service:", err);
  process.exit(1);
});