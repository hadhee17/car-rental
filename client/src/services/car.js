// src/services/courseServices.js
import api from "./api";

// ✅ Get all cars
export async function getAllCars() {
  const res = await api.get("/cars");
  return res.data.data.cars;
}

// ✅ Get single car by ID
export async function getCarById(id) {
  const res = await api.get(`/cars/${id}`);
  return res.data.data.car;
}
