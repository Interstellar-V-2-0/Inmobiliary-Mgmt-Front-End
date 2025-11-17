export const TokenService = {
  getLocalAccessToken() {
    return localStorage.getItem("accessToken");
  },
  getLocalRefreshToken() {
    return localStorage.getItem("refreshToken");
  },
  updateLocalAccessToken(token) {
    localStorage.setItem("accessToken", token);
  },
  updateLocalRefreshToken(token) {
    localStorage.setItem("refreshToken", token);
  },
  saveTokens({ accessToken, refreshToken }) {
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  },
  clear() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};
