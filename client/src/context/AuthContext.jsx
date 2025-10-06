import { createContext, useContext, useEffect, useState } from "react";
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

  // on mount check auth via cookie-based getMe
  useEffect(() => {
    let mounted = true;
    async function fetchCurrentUser() {
      try {
        const user = await getMe();
        if (mounted) setCurrentUser(user);
      } catch (err) {
        if (mounted) setCurrentUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchCurrentUser();
    return () => {
      mounted = false;
    };
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
