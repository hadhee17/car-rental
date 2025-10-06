// src/services/authServices.js
import api from "./api";

// Get currently logged-in user
export async function getMe() {
  const res = await api.get("/users/me");
  return res.data.data.user;
}

// Login with email & password
export async function loginUser(email, password) {
  const res = await api.post("/users/login", { email, password });
  return res.data.data.user;
}

// Signup (register new user)
export async function signupUser(userData) {
  const res = await api.post("/users/signup", userData);
  return res.data.data.user;
}

// Logout user (clears cookie/JWT on backend)
export async function logoutUser() {
  const res = await api.post("/users/logout");
  return res.data;
}
