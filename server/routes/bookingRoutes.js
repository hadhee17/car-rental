const express = require("express");
const authController = require("../controller/authController");
const bookingController = require("../controller/bookingcontroller");

const router = express.Router();

router.use(authController.protect); // Protect all booking routes

router.route("/").post(bookingController.createBooking);
router.route("/my-bookings").get(bookingController.getMyBookings);
router.route("/:id").delete(bookingController.deleteBooking);

module.exports = router;
