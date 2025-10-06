const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const express = require("express");

const errorController = require("./controller/errorController");
const AppError = require("./utils/appError");
const carRoutes = require("./routes/carRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoute");
const bookingRoutes = require("./routes/bookingRoutes");
const aiRoutes = require("./routes/aiRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS - allow credentials and exact frontend origin
const FRONTEND = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND,
    credentials: true,
  })
);

// Routes
app.use("/api/v1", carRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/ai", aiRoutes);

app.all("/*catchall", (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} on the server`, 404));
});

app.use(errorController);

module.exports = app;
