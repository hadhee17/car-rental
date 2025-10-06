import axios from "axios";

const api = axios.create({
  baseURL: "https://drivezy-car-rental-web-application.onrender.com/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
