import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyBookings, deleteBooking } from "../services/BookingService";

export default function BookingSummary() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchBookings() {
      try {
        const fetchedBookings = await getMyBookings();
        setBookings(fetchedBookings);
      } catch (err) {
        setError("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const handleDelete = async (bookingId) => {
    try {
      await deleteBooking(bookingId);
      setBookings((b) => b.filter((bk) => bk._id !== bookingId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Access Restricted
          </h1>
          <p className="text-gray-600 mb-8">
            You need to log in or sign up to view your booking summary
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="px-6 py-2 bg-blue-600 text-white rounded"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 bg-green-600 text-white rounded"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            No bookings found
          </h1>
          <p className="text-gray-600 mb-6">
            You haven't made any reservations yet
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Browse Cars
          </Link>
        </div>
      </div>
    );
  }

  const grandTotal = bookings.reduce(
    (sum, booking) => sum + (booking.amount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            Your Booking History
          </h1>
        </div>

        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {booking.car?.brand} {booking.car?.model}
                    </h2>
                    <p className="text-gray-500 mt-1">
                      Booked on:{" "}
                      {new Date(booking.bookedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 ${
                        booking.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      } text-sm font-medium rounded-full`}
                    >
                      {booking.paymentStatus}
                    </span>
                    <button
                      onClick={() => handleDelete(booking._id)}
                      className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-100 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Car Details</p>
                    <p className="font-medium">{booking.car?.category}</p>
                    <p className="text-sm text-gray-500">
                      {booking.car?.fuelType}
                    </p>
                  </div>
                  <div className="border border-gray-100 rounded-lg p-4 bg-blue-50">
                    <p className="text-sm text-blue-600">Amount Paid</p>
                    <p className="font-bold text-blue-700">₹{booking.amount}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Grand Total</h3>
            <p className="text-2xl font-bold text-blue-600">₹{grandTotal}</p>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Link
              to="/"
              className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
            >
              Book Another Car
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
