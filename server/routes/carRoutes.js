const express = require("express");
const carController = require("../controller/carController");
const router = express.Router();

router
  .route("/cars")
  .get(carController.getAllCars)
  .post(carController.createCar);

router
  .route("/cars/:id")
  .get(carController.getCarById)
  .patch(carController.updateCarById)
  .delete(carController.deleteCarById);

module.exports = router;
