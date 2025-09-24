// src/pages/Book.jsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCarById } from "../services/car";
import { createCheckoutSession } from "../services/paymentServic";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Book() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [car, setCar] = useState(null);
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false); // track payment success

  // Check query params for success
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("success") === "true") {
      setPaymentSuccess(true);
    }
  }, [location.search]);

  // Fetch car details
  useEffect(() => {
    async function fetchCar() {
      try {
        const data = await getCarById(id);
        setCar(data);
      } catch (err) {
        console.error("Error fetching car:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCar();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading car details...
      </div>
    );
  if (!car)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 p-8">
        Car not found.
      </div>
    );

  const handleBooking = async () => {
    try {
      setProcessingPayment(true);

      const bookingData = {
        carId: car._id,
        carName: `${car.brand} ${car.model}`,
        pricePerDay: Number(car.price),
        rentalDays: Number(days),
      };

      const sessionData = await createCheckoutSession(bookingData);
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: sessionData.id });
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Please try again.");
      setProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-2xl">
        <div className="md:flex">
          {/* Car Image */}
          <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-6">
            <img
              src={car.image}
              alt={car.model}
              className="w-full h-64 object-contain"
            />
          </div>

          {/* Car Details */}
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

            {/* Rental Days Selector */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Rental Period (Days)
              </label>
              <div className="flex items-center">
                <button
                  onClick={() => setDays(Math.max(1, days - 1))}
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-l"
                  disabled={paymentSuccess}
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
                  disabled={paymentSuccess}
                />
                <button
                  onClick={() => setDays(days + 1)}
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-r"
                  disabled={paymentSuccess}
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Amount</span>
                <span className="text-xl font-bold text-blue-600">
                  ₹{car.price * days}
                </span>
              </div>
            </div>

            {/* Success message above button */}
            {paymentSuccess && (
              <div className="mb-4 text-green-600 font-medium">
                ✅ Your booking has been confirmed!
              </div>
            )}

            {/* Confirm Booking Button */}
            <button
              onClick={handleBooking}
              disabled={processingPayment || paymentSuccess}
              className={`w-full py-3 rounded-lg font-medium ${
                processingPayment
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white transition-colors`}
            >
              {processingPayment ? "Processing Payment..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
