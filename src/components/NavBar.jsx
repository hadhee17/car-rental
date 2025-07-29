import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  const navStyle = (path) =>
    `px-4 py-2 rounded hover:bg-blue-100 ${
      pathname === path ? "bg-blue-100 text-blue-700 font-semibold" : ""
    }`;

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-blue-600  tracking-wide italic">
        {" "}
        Drivezy
      </h1>

      <div className="flex gap-4 text-gray-700">
        <Link to="/" className={navStyle("/")}>
          Home
        </Link>
        <Link to="/booking-summary" className={navStyle("/booking-summary")}>
          Booking Summary
        </Link>
      </div>
    </nav>
  );
}
