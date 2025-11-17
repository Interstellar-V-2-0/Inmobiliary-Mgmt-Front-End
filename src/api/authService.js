import axiosClient from "./axiosClient";
import { TokenService } from "./tokenService";

export const AuthService = {
  async login({ email, password }) {
    const resp = await axiosClient.post("/api/Auth/login", { email, password });
    // retornar el cuerpo
    const data = resp.data || resp;
    // Guardar tokens si vienen
    const accessToken = data.accessToken || data.token;
    const refreshToken = data.refreshToken;
    if (accessToken || refreshToken) {
      TokenService.saveTokens({ accessToken, refreshToken });
    }
    return data;
  },

  async register({ email, password, ...other }) {
    const resp = await axiosClient.post("/api/Auth/register", { email, password, ...other });
    return resp.data;
  },

  async refresh(body) {
    const resp = await axiosClient.post("/api/Auth/refresh", body);
    const data = resp.data || resp;
    // actualizar tokens si vienen
    const newAccessToken = data.accessToken || data.token;
    const newRefreshToken = data.refreshToken;
    if (newAccessToken || newRefreshToken) {
      TokenService.saveTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    }
    return data;
  },

  logout() {
    TokenService.clear();
  }
};
