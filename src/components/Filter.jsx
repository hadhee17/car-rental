export default function Filter({ onCategoryChange, onPriceRangeChange }) {
  const categories = [
    "All",
    "Sedan",
    "SUV",
    "Electric",
    "Hatchback",
    "Luxury",
    "Compact SUV",
  ];

  const priceRanges = [
    { label: "All Prices", min: 0, max: Infinity },
    { label: "Under ₹1000", min: 0, max: 999 },
    { label: "₹1000-₹2000", min: 1000, max: 2000 },
    { label: "₹2000-₹3000", min: 2000, max: 3000 },
    { label: "Over ₹3000", min: 3001, max: Infinity },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Category Filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
        <div className="flex gap-3 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className="px-4 py-2 border border-gray-300 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-700"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
        <div className="flex gap-3 flex-wrap">
          {priceRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => onPriceRangeChange(range.min, range.max)}
              className="px-4 py-2 border border-gray-300 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-700"
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
