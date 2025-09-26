const Booking = require("../model/bookingModel");
const AppError = require("../utils/appError");

exports.createBooking = async (req, res, next) => {
  try {
    const { car, amount, days, paymentStatus } = req.body;

    // Check for existing booking with same details
    const existingBooking = await Booking.findOne({
      user: req.user._id,
      car,
      amount,
      days,
      createdAt: {
        $gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
      },
    });

    if (existingBooking) {
      return res.status(200).json({
        status: "success",
        data: {
          booking: existingBooking,
        },
      });
    }

    const booking = await Booking.create({
      user: req.user._id,
      car,
      amount,
      days,
      paymentStatus: paymentStatus || "paid",
      bookedAt: Date.now(),
    });

    // Populate car details
    await booking.populate("car");

    res.status(201).json({
      status: "success",
      data: {
        booking,
      },
    });
  } catch (err) {
    console.error("Booking Creation Error:", err);
    next(new AppError(err.message || "Failed to create booking", 400));
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("car")
      .sort("-bookedAt");

    res.status(200).json({
      status: "success",
      data: {
        bookings,
      },
    });
  } catch (err) {
    next(new AppError("Failed to fetch bookings", 400));
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, // Ensure user can only delete their own bookings
    });

    if (!booking) {
      return next(new AppError("No booking found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(new AppError("Failed to delete booking", 400));
  }
};
