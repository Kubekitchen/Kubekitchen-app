require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");

const app = express();
connectDB();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("combined"));
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api/auth", limiter);

app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => res.json({ status: "ok", service: "auth-service" }));

app.listen(process.env.PORT || 4001, () =>
  console.log(`Auth service running on port ${process.env.PORT || 4001}`)
);