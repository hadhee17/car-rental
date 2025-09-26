import { createContext, useContext, useState, useEffect } from "react";
import {
  getMe,
  loginUser,
  signupUser,
  logoutUser,
} from "../services/authservices";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const user = await getMe();
        setCurrentUser(user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentUser();
  }, []);

  async function login(email, password) {
    const user = await loginUser(email, password);
    setCurrentUser(user);
    return user;
  }

  async function signup(payload) {
    const user = await signupUser(payload);
    setCurrentUser(user);
    return user;
  }

  async function logout() {
    await logoutUser();
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
