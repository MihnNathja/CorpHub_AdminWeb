// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  // Nếu request là login hoặc register thì bỏ qua token
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

// Gộp response interceptor
api.interceptors.response.use(
  (response) => {
    // Nếu là download file (blob) thì giữ nguyên response để còn headers
    if (response.config.responseType === "blob") {
      return response;
    }
    // Còn lại thì trả về response.data
    return response.data;
  },
  (err) => {
    let message = "Something went wrong";

    if (err.response) {
      // Nếu backend trả HTML thay vì JSON
      if (typeof err.response.data === "string") {
        message = "Server error: please try again later.";
      }
      // Nếu backend trả JSON có message
      else if (err.response.data?.message) {
        message = err.response.data.message;
      }
      // Nếu muốn handle riêng theo status code
      else if (err.response.status === 401) {
        message = "Unauthorized. Please login again.";
        // 👉 Ở đây bạn có thể clear token + redirect về login
        // localStorage.removeItem("token");
        // window.location.href = "/login";
      }
    } else if (err.request) {
      message = "No response from server. Please check your connection.";
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
