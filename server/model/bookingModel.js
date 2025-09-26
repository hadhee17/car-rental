// models/bookingModel.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  car: {
    type: mongoose.Schema.ObjectId,
    ref: "Car",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  days: {
    type: Number,
    required: true,
    min: 1,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
