// src/services/api.js
import axios from "axios";
import { logout, refresh } from "../features/auth/store/authSlice";
import { store } from "../store/index";

const api = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 0,
  withCredentials: true, // gửi cookie (refreshToken)
  maxContentLength: Infinity, // ⬅ cho phép tải file lớn
  maxBodyLength: Infinity, // ⬅ cho phép upload file lớn
});

// ✅ Gắn access token vào header
api.interceptors.request.use((config) => {
  if (
    config.url.includes("/auth/login") ||
    config.url.includes("/auth/register") ||
    config.url.includes("/auth/refresh")
  ) {
    return config;
  }

  const state = store.getState();
  const token = state.auth.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Xử lý response & token refresh tự động
api.interceptors.response.use(
  (response) => {
    if (response.config.responseType === "blob") return response;
    return response.data;
  },

  async (err) => {
    const originalRequest = err.config;

    // ❌ Không refresh cho /auth/refresh để tránh loop
    if (originalRequest?.url?.includes("/auth/refresh")) {
      console.warn("⚠️ Refresh endpoint failed → logging out.");
      store.dispatch(logout());
      return Promise.reject(err);
    }

    // 🔁 Nếu 401 và chưa retry → thử refresh access token
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Token expired → attempting refresh...");
        const result = await store.dispatch(refresh());
        const refreshed = result.payload;

        // 🧠 refresh trả về { user, accessToken }
        const newAccessToken = refreshed?.accessToken;

        if (newAccessToken) {
          // ✅ cập nhật header mới rồi retry request cũ
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        console.error("🚫 Refresh failed → logging out...");
        store.dispatch(logout());
      }
    }

    // 🚨 Các lỗi khác
    if (err.response) {
      const res = err.response;
      if (typeof res.data === "string") {
        res.data = {
          status: res.status,
          message: "Server error: please try again later.",
        };
      }
      return Promise.reject(res);
    }

    if (err.request) {
      return Promise.reject({
        status: 0,
        message: "No response from server. Please check your connection.",
      });
    }

    return Promise.reject({
      status: -1,
      message: err.message || "Unknown error occurred",
    });
  }
);

export default api;
