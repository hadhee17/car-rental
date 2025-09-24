const AppError = require("../utils/appError");
const Stripe = require("stripe");

// Make sure your .env has STRIPE_SECRET_KEY
console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res, next) => {
  const { carId, carName, carImage, pricePerDay, rentalDays } = req.body;

  // Convert to numbers safely
  const price = Number(pricePerDay);
  const days = Number(rentalDays);

  if (isNaN(price) || isNaN(days)) {
    return next(new AppError("Invalid price or rental days", 400));
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: carName,
              images: [carImage], // optional
            },
            unit_amount: price * days * 100, // convert INR to paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/book/${carId}?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/book/${carId}&success=false`,
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    next(new AppError("Failed to create checkout session", 500));
  }
};
