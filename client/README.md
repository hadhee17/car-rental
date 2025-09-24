# Drivezy - Car Rental Website

Drivezy is a modern car rental web application built with React and Vite. Users can browse available cars, filter by category and price, search for specific models, and book cars for a selected rental period. Bookings are stored locally and can be viewed or managed in the Booking Summary.

## Features

- 🚗 **Browse Cars:** View a wide range of rental cars with images, categories, and prices.
- 🔎 **Search & Filter:** Search by brand/model, filter by category and price range.
- 📅 **Book Cars:** Select rental period and confirm bookings.
- 📝 **Booking Summary:** View, delete, or clear all bookings.
- 💾 **Local Storage:** Bookings are saved in your browser for convenience.
- 🎨 **Responsive UI:** Clean, mobile-friendly design using Tailwind CSS.

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

## Project Structure

- `src/pages/` — Main pages (Home, Book, BookingSummary)
- `src/components/` — Reusable UI components (CarItem, Filter, Search)
- `src/data/cars.js` — Car data
- `src/assets/` — Images and SVG icons

## Customization

- **Add Cars:** Update `src/data/cars.js` to add or modify car listings.
- **Change Favicon:** Replace `car.svg` in the root directory and update the `<link rel="icon">` in `index.html`.

## License

This project is for educational/demo

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
