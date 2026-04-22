require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const orderRoutes = require("./routes/order");

const app = express();
connectDB();

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

app.use("/api/orders", orderRoutes);

app.get("/health", (req, res) => res.json({ status: "ok", service: "order-service" }));

app.listen(process.env.PORT || 4004, () =>
  console.log(`Order service running on port ${process.env.PORT || 4004}`)
);