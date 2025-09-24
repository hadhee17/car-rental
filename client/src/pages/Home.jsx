// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { getAllCars } from "../services/car";
import CarItem from "../components/CarItem";
import Filter from "../components/Filter";
import Search from "../components/Search";

export default function Home() {
  const [cars, setCars] = useState([]); // full list from API
  const [filteredCars, setFilteredCars] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePriceRange, setActivePriceRange] = useState({
    min: 0,
    max: Infinity,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCars() {
      try {
        const data = await getAllCars();
        setCars(data);
        setFilteredCars(data);
      } catch (err) {
        console.error("Error fetching cars:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  function applyFilters(category, minPrice, maxPrice, sourceCars = cars) {
    let results = sourceCars;

    if (category !== "All") {
      results = results.filter((car) => car.category === category);
    }

    results = results.filter(
      (car) => car.price >= minPrice && car.price <= maxPrice
    );

    setFilteredCars(results);
  }

  function handleCategoryChange(category) {
    setActiveCategory(category);
    applyFilters(category, activePriceRange.min, activePriceRange.max);
  }

  function handlePriceRangeChange(min, max) {
    setActivePriceRange({ min, max });
    applyFilters(activeCategory, min, max);
  }

  function handleSearch(searchTerm) {
    if (!searchTerm.trim()) {
      applyFilters(activeCategory, activePriceRange.min, activePriceRange.max);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = cars.filter(
      (car) =>
        car.brand.toLowerCase().includes(term) ||
        car.model.toLowerCase().includes(term)
    );

    applyFilters(
      activeCategory,
      activePriceRange.min,
      activePriceRange.max,
      filtered
    );
  }

  function resetFilters() {
    setActiveCategory("All");
    setActivePriceRange({ min: 0, max: Infinity });
    setFilteredCars(cars);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600">Loading cars...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Search onSearch={handleSearch} />
      </div>

      <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl text-center mb-8 shadow-sm">
        <h2 className="text-4xl font-bold text-blue-700 mb-2">
          Find Your Perfect Ride
        </h2>
        <p className="text-gray-600 text-lg">
          Choose from a wide range of rental cars at unbeatable prices.
        </p>
      </div>

      <Filter
        onCategoryChange={handleCategoryChange}
        onPriceRangeChange={handlePriceRangeChange}
      />

      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <CarItem key={car._id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No cars found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={resetFilters}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
