require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const restaurantRoutes = require("./routes/restaurant");

const app = express();
connectDB();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("combined"));
app.use(express.json());

app.use("/api/restaurants", restaurantRoutes);

app.get("/health", (req, res) => res.json({ status: "ok", service: "restaurant-service" }));

app.listen(process.env.PORT || 4002, () =>
  console.log(`Restaurant service running on port ${process.env.PORT || 4002}`)
);