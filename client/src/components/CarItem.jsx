import { Link } from "react-router-dom";

export default function CarItem({ car }) {
  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-md transition">
      <img
        src={car.image}
        alt={`${car.brand} ${car.model}`}
        className="w-full h-40 object-cover rounded"
        loading="lazy"
      />
      <h2 className="text-lg font-semibold mt-2">
        {car.brand} {car.model}
      </h2>
      <p className="text-blue-600 font-medium mt-1">₹{car.price}/day</p>

      <Link to={`/book/${car._id}`}>
        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Book Now
        </button>
      </Link>
    </div>
  );
}
