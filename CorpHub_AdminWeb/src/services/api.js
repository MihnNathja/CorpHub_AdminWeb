// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 10000,
});

// ✅ Add Authorization header (skip for login/register)
api.interceptors.request.use((config) => {
  if (
    config.url.includes("/auth/login") ||
    config.url.includes("/auth/register")
  ) {
    return config;
  }

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Unified response + error handler
api.interceptors.response.use(
  (response) => {
    // Nếu là download file (blob) thì giữ nguyên
    if (response.config.responseType === "blob") {
      return response;
    }

    // Trả response.data để code trong slice nhận đúng {status, message, data}
    return response.data;
  },
  (err) => {
    // 🧠 Không gói vào new Error(message) để giữ nguyên err.response
    if (err.response) {
      // Nếu backend trả HTML (VD: 500 HTML page)
      if (typeof err.response.data === "string") {
        err.response.data = {
          status: err.response.status,
          message: "Server error: please try again later.",
        };
      }

      // Nếu 401 → thông báo và có thể logout
      if (err.response.status === 401) {
        console.warn("⚠️ Unauthorized. Please login again.");
        // localStorage.removeItem("token");
        // window.location.href = "/login";
      }

      // 🔥 Giữ nguyên cấu trúc err.response.data (ApiResponse)
      console.log("From api", err.response);
      return Promise.reject(err.response);
    }

    // ❗Không có phản hồi (network hoặc timeout)
    if (err.request) {
      return Promise.reject({
        status: 0,
        message: "No response from server. Please check your connection.",
      });
    }

    // ❗Lỗi không xác định
    return Promise.reject({
      status: -1,
      message: err.message || "Unknown error occurred",
    });
  }
);

export default api;
