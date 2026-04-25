import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // On mount - verify existing token
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await authApi.get("/me", true);
        if (res.success) {
          setUser(res.user);
          setToken(savedToken);
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.post("/login", { email, password }, false); // ← auth=false
    if (res.success) {
      localStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.user);
      return { success: true, user: res.user };
    }
    throw new Error(res.message || "Login failed");
  };

  const register = async (name, email, password, role = "customer") => {
    const res = await authApi.post("/register", { name, email, password, role }, false); // ← auth=false
    if (res.success) {
      localStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.user);
      return { success: true, user: res.user };
    }
    throw new Error(res.message || "Registration failed");
  };
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;