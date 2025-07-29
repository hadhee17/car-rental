import { useParams } from "react-router-dom";
import { useState } from "react";
import cars from "../data/cars";

export default function Book() {
  const { id } = useParams();
  const car = cars.find((car) => car.id === parseInt(id));
  const [days, setDays] = useState(1);
  const [booked, setBooked] = useState(false);

  if (!car)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 p-8">
        Car not found.
      </div>
    );

  const handleBooking = () => {
    const booking = {
      carId: car.id,
      carName: `${car.brand} ${car.model}`,
      pricePerDay: car.price,
      days,
      total: car.price * days,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };
    // Save with unique key to store multiple bookings
    localStorage.setItem(`booking_${Date.now()}`, JSON.stringify(booking));
    setBooked(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-2xl">
        <div className="md:flex">
          <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-6">
            <img
              src={car.image}
              alt={car.model}
              className="w-full h-64 object-contain"
            />
          </div>

          <div className="md:w-1/2 p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {car.brand} {car.model}
              </h1>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {car.category}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Price per day</span>
                <span className="font-medium">₹{car.price}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Rental Period (Days)
              </label>
              <div className="flex items-center">
                <button
                  onClick={() => setDays(Math.max(1, days - 1))}
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-l"
                >
                  -
                </button>
                <input
                  type="number"
                  value={days}
                  onChange={(e) =>
                    setDays(Math.max(1, parseInt(e.target.value || "1")))
                  }
                  className="border-t border-b border-gray-300 text-center w-16 py-1"
                  min="1"
                />
                <button
                  onClick={() => setDays(days + 1)}
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-r"
                >
                  +
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Amount</span>
                <span className="text-xl font-bold text-blue-600">
                  ₹{car.price * days}
                </span>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={booked}
              className={`w-full py-3 rounded-lg font-medium ${
                booked ? "bg-green-500" : "bg-blue-600 hover:bg-blue-700"
              } text-white transition-colors`}
            >
              {booked ? "Booking Confirmed!" : "Confirm Booking"}
            </button>

            {booked && (
              <p className="mt-4 text-green-600 text-center">
                Your booking has been confirmed. You can view all bookings in
                your Booking Summary.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
