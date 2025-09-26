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

    // Call Ollama API
    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3",
        prompt: `You are an assistant for a car rental website. Use ONLY the provided data to answer questions.

Data:
${context}

Question: ${question}

If the answer is not in the data, reply: "I don't know".`,
        max_tokens: 500,
      },
      {
        headers: { "Content-Type": "application/json" },
        responseType: "stream", // enable streaming
      }
    );

    let answer = "";
    response.data.on("data", (chunk) => {
      const lines = chunk.toString().split("\n");
      for (let line of lines) {
        if (line) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) answer += parsed.response;
          } catch (err) {
            // ignore parse errors
          }
        }
      }
    });

    response.data.on("end", () => {
      res.json({ answer });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
