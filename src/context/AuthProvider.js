import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "../api/authService";
import { TokenService } from "../api/tokenService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = TokenService.getLocalAccessToken();
      if (token) {
        try {
          setUser({});
        } catch (e) {
          try {
            const refreshToken = TokenService.getLocalRefreshToken();
            if (refreshToken) {
              await AuthService.refresh({ refreshToken });
              setUser({});
            } else {
              TokenService.clear();
              setUser(null);
            }
          } catch (err) {
            TokenService.clear();
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await AuthService.login({ email, password });
    setUser({});
    return data;
  };

  const register = async (payload) => {
    return AuthService.register(payload);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
