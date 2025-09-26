// src/components/NavBar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { pathname } = useLocation();
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();

  const navStyle = (path) =>
    `px-4 py-2 rounded hover:bg-blue-100 ${
      pathname === path ? "bg-blue-100 text-blue-700 font-semibold" : ""
    }`;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-blue-600 italic">Drivezy</h1>

      <div className="flex gap-4 items-center text-gray-700">
        <Link to="/" className={navStyle("/")}>
          Home
        </Link>
        <Link to="/booking-summary" className={navStyle("/booking-summary")}>
          Booking Summary
        </Link>

        {/* 🚀 Enhanced Glowy Ask AI Button */}
        <Link
          to="/ai"
          className="relative inline-block px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg 
                     hover:from-blue-600 hover:to-indigo-700 transition-all
                     animate-pulse
                     before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-blue-400 before:to-indigo-500 
                     before:blur-xl before:opacity-50 before:transition-opacity hover:before:opacity-100"
        >
          🚀 Ask AI
        </Link>

        {!loading &&
          (currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Welcome,{" "}
                <span className="font-semibold">{currentUser.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Sign Up
              </Link>
            </div>
          ))}
      </div>
    </nav>
  );
}
