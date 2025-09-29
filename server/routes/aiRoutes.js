const express = require("express");
const axios = require("axios");
const Car = require("../model/carsModel");
const Booking = require("../model/bookingModel");

const router = express.Router();

// Helper to build context from DB
const buildContext = async () => {
  const cars = await Car.find({}).lean();
  const bookings = await Booking.find({}).populate("car user").lean();

  const carContext = cars
    .map(
      (c) =>
        `Car: ${c.brand} ${c.model}, Category: ${c.category}, Price per day: ${c.price}`
    )
    .join("\n");

  const bookingContext = bookings
    .map(
      (b) =>
        `Booking: ${b.user?.name || "User"} booked ${b.car?.brand} ${
          b.car?.model
        } for ${b.days} days, Amount: ${b.amount}, Status: ${b.paymentStatus}`
    )
    .join("\n");

  return `Cars:\n${carContext}\n\nBookings:\n${bookingContext}`;
};

router.post("/ask", async (req, res) => {
  const { question } = req.body;

  try {
    const context = await buildContext();

    // Build the full prompt
    const prompt = `
You are an assistant for a car rental website. Use ONLY the provided data to answer questions.

Data:
${context}

Question: ${question}

If the answer is not in the data, reply: "I don't know".
`;

    // Call Groq API instead of Ollama
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      // "http://localhost:11434/api/generate",
      {
        model: "llama-3.1-8b-instant", // free fast model
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0, // more accurate, less random
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`, // store your API key in .env
        },
      }
    );

    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "AI request failed" });
  }
});

module.exports = router;
