const CarModel = require("../model/carsModel");
const AppError = require("../utils/appError");

// Create a new car
exports.createCar = async (req, res, next) => {
  try {
    const newCar = await CarModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        car: newCar,
      },
    });
  } catch (error) {
    next(new AppError(`error in creating car: ${error.message}`, 400));
  }
};

// Get all cars
exports.getAllCars = async (req, res, next) => {
  try {
    const cars = await CarModel.find();
    res.status(200).json({
      status: "success",
      data: {
        cars,
      },
    });
  } catch (error) {
    next(new AppError(`error in getting cars: ${error.message}`, 400));
  }
};
// Get a single car by ID
exports.getCarById = async (req, res, next) => {
  try {
    const car = await CarModel.findById(req.params.id);
    if (!car) {
      return next(new AppError(`No car found with ID: ${req.params.id}`, 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        car,
      },
    });
  } catch (error) {
    next(new AppError(`error in getting car: ${error.message}`, 400));
  }
};

// Update a car by ID
exports.updateCarById = async (req, res, next) => {
  try {
    const updatedCar = await CarModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedCar) {
      return next(new AppError(`No car found with ID: ${req.params.id}`, 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        car: updatedCar,
      },
    });
  } catch (error) {
    next(new AppError(`error in updating car: ${error.message}`, 400));
  }
};
// Delete a car by ID
exports.deleteCarById = async (req, res, next) => {
  try {
    const deletedCar = await CarModel.findByIdAndDelete(req.params.id);
    if (!deletedCar) {
      return next(new AppError(`No car found with ID: ${req.params.id}`, 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(new AppError(`error in deleting car: ${error.message}`, 400));
  }
};
