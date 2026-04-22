require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const menuRoutes = require("./routes/menu");

const app = express();
connectDB();

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

app.use("/api/menu", menuRoutes);

app.get("/health", (req, res) => res.json({ status: "ok", service: "menu-service" }));

app.listen(process.env.PORT || 4003, () =>
  console.log(`Menu service running on port ${process.env.PORT || 4003}`)
);