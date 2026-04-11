import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("zurl_token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Decode JWT payload or simply infer user is valid if token exists 
      // since the Spring Boot backend verifies token in the request headers
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ name: payload.sub, email: payload.sub });
      } catch (e) {
        setUser({ name: "User" });
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    const response = await api.post("/api/auth/public/login", { username, password });
    const { token: jwtToken } = response.data;
    if (jwtToken) {
      setToken(jwtToken);
      localStorage.setItem("zurl_token", jwtToken);
      setUser({ name: username, email: username });
      return true;
    }
  };

  const signup = async (username, email, password) => {
    await api.post("/api/auth/public/register", { username, email, password });
    // After signup, optionally trigger a login immediately
    return login(username, password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("zurl_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
