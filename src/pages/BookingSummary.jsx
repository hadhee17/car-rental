import { useState } from "react";

export default function BookingSummary() {
  // Get all bookings from localStorage
  const [bookings, setBookings] = useState(() => {
    const savedBookings = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("booking_")) {
        savedBookings.push({
          key,
          ...JSON.parse(localStorage.getItem(key)),
        });
      }
    }
    return savedBookings;
  });

  const handleDelete = (bookingKey) => {
    localStorage.removeItem(bookingKey);
    setBookings(bookings.filter((booking) => booking.key !== bookingKey));
  };

  const handleClearAll = () => {
    bookings.forEach((booking) => {
      localStorage.removeItem(booking.key);
    });
    setBookings([]);
  };

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
          <a
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Browse Cars
          </a>
        </div>
      </div>
    );
  }

  const grandTotal = bookings.reduce((sum, booking) => sum + booking.total, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            Your Booking History
          </h1>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Clear All Bookings
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.key}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {booking.carName}
                    </h2>
                    <p className="text-gray-500 mt-1">
                      {new Date(booking.startDate).toLocaleDateString()} -{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      Confirmed
                    </span>
                    <button
                      onClick={() => handleDelete(booking.key)}
                      className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-100 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Price per day</p>
                    <p className="font-medium">₹{booking.pricePerDay}</p>
                  </div>
                  <div className="border border-gray-100 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Rental days</p>
                    <p className="font-medium">{booking.days} days</p>
                  </div>
                  <div className="border border-gray-100 rounded-lg p-4 bg-blue-50">
                    <p className="text-sm text-blue-600">Subtotal</p>
                    <p className="font-bold text-blue-700">₹{booking.total}</p>
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
            <button
              onClick={() => window.print()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Print All Receipts
            </button>
            <a
              href="/"
              className="flex-1 text-center border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-medium transition-colors"
            >
              Book Another Car
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
