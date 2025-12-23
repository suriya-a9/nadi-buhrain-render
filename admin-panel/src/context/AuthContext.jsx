import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setRole(null);
  };

  const login = (jwtToken) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
    const decoded = jwtDecode(jwtToken);
    setRole(decoded.role);
  };

  const isTokenExpired = (jwtToken) => {
    try {
      const decoded = jwtDecode(jwtToken);
      if (!decoded.exp) return false;
      return Date.now() >= decoded.exp * 1000;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      if (isTokenExpired(storedToken)) {
        logout();
      } else {
        setToken(storedToken);
        const decoded = jwtDecode(storedToken);
        setRole(decoded.role);
      }
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const decoded = jwtDecode(token);
    if (decoded.exp) {
      const expiryTime = decoded.exp * 1000 - Date.now();
      const timer = setTimeout(() => {
        logout();
      }, expiryTime);

      return () => clearTimeout(timer);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);