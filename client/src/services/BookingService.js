import api from "./api";

// Get all bookings of current logged-in user
export async function getMyBookings() {
  const res = await api.get("/bookings/my-bookings");
  return res.data.data.bookings;
}

// Delete a booking
export async function deleteBooking(id) {
  const res = await api.delete(`/bookings/${id}`);
  return res.data;
}

// Create a new booking
export async function createBooking(bookingData) {
  try {
    const res = await api.post("/bookings", bookingData);
    return res.data.data.booking;
  } catch (error) {
    // Log the error for debugging
    console.error("Create booking error:", error.response?.data || error);
    throw error;
  }
}
