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
//security middleware
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());

//parameter pollution
app.use(hpp());

//limit request from same api
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);
//cors
const allowedOrigins = [
  process.env.FRONTEND_URL, // local Vite dev server
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
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/ai", aiRoutes);

//
app.all("/*catchall", (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} on the server`, 404));
});

app.use(errorController);

module.exports = app;
