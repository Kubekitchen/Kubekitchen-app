import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("kk_user");
    const token = localStorage.getItem("kk_token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.post("/api/auth/login", { email, password });
    localStorage.setItem("kk_token", data.token);
    localStorage.setItem("kk_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, role) => {
    const { data } = await authAPI.post("/api/auth/register", { name, email, password, role });
    localStorage.setItem("kk_token", data.token);
    localStorage.setItem("kk_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("kk_token");
    localStorage.removeItem("kk_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};