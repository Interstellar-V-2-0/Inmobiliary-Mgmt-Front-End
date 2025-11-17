import axios from "axios";
import { TokenService } from "./tokenService";
import { AuthService } from "./authService";

const API_URL = "https://inmobiliarymgmt-production.up.railway.app";

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// añadir Authorization si hay access token
axiosClient.interceptors.request.use(config => {
  const token = TokenService.getLocalAccessToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

//401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (err.response && err.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axiosClient(originalRequest);
        }).catch(e => Promise.reject(e));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = TokenService.getLocalRefreshToken();
      if (!refreshToken) {
        isRefreshing = false;
        return Promise.reject(err);
      }

      try {
        const resp = await AuthService.refresh({ refreshToken });
        const newAccessToken = resp.accessToken || resp.token || resp.data?.accessToken || resp.data?.token;
        const newRefreshToken = resp.refreshToken || resp.data?.refreshToken;

        if (newAccessToken) {
          TokenService.updateLocalAccessToken(newAccessToken);
          if (newRefreshToken) TokenService.updateLocalRefreshToken(newRefreshToken);
          processQueue(null, newAccessToken);
          originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
          return axiosClient(originalRequest);
        } else {
          processQueue(new Error("No token on refresh"), null);
          return Promise.reject(err);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default axiosClient;
