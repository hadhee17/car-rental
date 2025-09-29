import axios from "axios";

const api = axios.create({
  baseURL: `https://car-rental-backend.vercel.app/api/v1`, // your backend
  withCredentials: true,
});

export default api;
