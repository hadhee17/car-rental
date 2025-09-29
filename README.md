# Drivezy — Car Rental Web App

Drivezy is a full‑stack car rental application with searchable car listings, booking flow powered by Stripe, cookie‑based authentication, and an AI chatbot (Llama) for conversational assistance.

## Key features
- Browse, search and filter cars with responsive UI (React + Vite + Tailwind CSS).
- Secure authentication using JWT stored in httpOnly cookies and protect middleware on server.
- Stripe Checkout for payments; bookings are saved server‑side after successful payment with duplicate prevention.
- AI chatbot using Llama model to assist users (local or hosted Llama inference endpoint).

## Tech stack
- Frontend: React, Vite, React Router, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Payments: Stripe (Checkout session)
- AI: Llama model endpoint (integrated via /api/ai)
- Auth: JWT tokens in httpOnly cookies; cookie-parser + CORS configured with credentials

## Project structure (important files)
- client/ — React app (src/pages, src/components, src/services, src/context)
- server/ — Express API (controller, model, routes, utils)
- server/model/bookingModel.js — Booking schema (user, car, amount, days, paymentStatus)
- server/controller/bookingcontroller.js — createBooking, getMyBookings, deleteBooking with duplicate checks
- server/controller/authController.js — signup/login/logout/createSendToken/protect middleware
- client/src/pages/Book.jsx — Stripe checkout and save booking on redirect
- client/src/pages/BookingSummary.jsx — fetch bookings from backend (protected route)
- client/src/services/api.js — axios instance configured with withCredentials: true

## Quick start (local development)

1. Clone repo:
   git clone <repo-url>
   cd "car rental"

2. Server
   cd server
   npm install
   create a `.env` file (see example below)
   npm run dev   # or node server.js

3. Client
   cd ../client
   npm install
   npm run dev   # Vite dev server, default http://localhost:5173

4. Open http://localhost:5173

## Environment variables (examples)

server/.env
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/drivezy
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:5173
```

client/.env
```
VITE_API_BASE=http://localhost:3000/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Booking + payment flow (implementation overview)
1. User clicks "Confirm Booking" on Book page → client calls backend `/payment/checkout` to create a Stripe Checkout Session.
2. Stripe redirects user back to Book page with query `?success=true` on completion.
3. Book.jsx detects `success=true`, computes amount & days, then sends a POST `/bookings` (protected) to create the booking record.
4. Server-side booking controller checks for recent duplicate bookings (same user/car/amount/days within short window) and returns existing record or creates a new booking; populated car details returned to the client.
5. BookingSummary fetches `/bookings/my-bookings` using axios (withCredentials) and displays the user’s bookings.

## Authentication & security notes
- Server sets JWT as httpOnly cookie on login/signup (`res.cookie('jwt', token, { httpOnly: true, sameSite, secure })`).
- Protect middleware reads token from Authorization header or cookie; attaches `req.user`.
- Axios client is configured with `withCredentials: true` so cookies are included on requests.
- CORS configured to allow credentials and the exact frontend origin.

## AI Chatbot (Llama) integration
- A lightweight endpoint `/api/ai` forwards user prompts to a local or hosted Llama inference service.
- The frontend AI chat component sends messages to `/api/ai`, receives model responses, and displays them in a chat UI.
- Ensure the Llama inference server (or provider) is running and accessible by the backend; set any model keys/URLs in `server/.env`.

## API endpoints (selected)
- POST /api/v1/users/signup
- POST /api/v1/users/login
- GET /api/v1/users/me (protected)
- POST /api/v1/payment/checkout
- POST /api/v1/bookings (protected)
- GET /api/v1/bookings/my-bookings (protected)
- DELETE /api/v1/bookings/:id (protected)

## Development tips
- Inspect network tab after login to ensure `Set-Cookie` is present and subsequent requests include `Cookie`.
- If using SameSite=None for cookies in cross‑origin testing, use HTTPS or fallback to Lax for localhost.
- To avoid duplicate bookings from double renders, Book.jsx uses localStorage flags and server-side duplicate checks.

## Deployment notes
- Ensure FRONTEND_URL matches deployed frontend origin.
- For production, set NODE_ENV=production, secure=true and sameSite='none' on cookies (requires HTTPS).
- Protect your JWT secret and Stripe secret key in environment variables.

## License
This project is for demonstration/learning purposes.
