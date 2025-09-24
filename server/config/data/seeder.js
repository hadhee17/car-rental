const fs = require("fs");
const connectDB = require("../DB");

const Car = require("../../model/carsModel");

const exportDataToDB = async () => {
  try {
    await connectDB();
    await Car.deleteMany();
    const cars = JSON.parse(fs.readFileSync(`${__dirname}/cars.json`, "utf-8"));

    await Car.insertMany(cars);
    console.log("Data successfully seeded!✅");
    process.exit();
  } catch (error) {
    console.error("❌ error seeding data", error);
    process.exit(1);
  }
};

const deleteDataFromDB = async () => {
  try {
    await connectDB();

    await Car.deleteMany();

    console.log("✅ Data deleted successfully from DB");
    process.exit();
  } catch (error) {
    console.error("❌ Could not delete data:", error);
    process.exit(1);
  }
};

if (process.argv[2] === "--export") {
  exportDataToDB();
} else if (process.argv[2] === "--delete") {
  deleteDataFromDB();
}
