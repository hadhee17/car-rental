import api from "./api";

/**
 * Create a Stripe checkout session
 * @param {Object} booking - { carId, carName, pricePerDay, days }
 * @returns {Promise<Object>} - Stripe session info
 */

export async function createCheckoutSession(booking) {
  try {
    const res = await api.post("/payment/checkout", booking);
    return res.data; // contains session ID & URL
  } catch (err) {
    console.error("Error creating checkout session:", err);
    throw err;
  }
}
