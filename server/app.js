const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const express = require("express");

const errorController = require("./controller/errorController");
const AppError = require("./utils/appError");
const carRoutes = require("./routes/carRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoute");
const cors = require("cors");

const app = express();
app.use(express.json());

//cors
const allowedOrigins = [
  "http://localhost:5173", // local Vite dev server
  // deployed frontend
];
app.use(
  cors({
    origin: allowedOrigins, // allow your frontend
    credentials: true,
  })
);

// Routes
app.use("/api/v1", carRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/payment", paymentRoutes);

//
app.all("/*catchall", (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} on the server`, 404));
});

app.use(errorController);

module.exports = app;
