// src/features/auth/services/authApi.js
import api from "../../../services/api";

export const loginAPI = (credentials) => api.post("/auth/login", credentials);
export const refreshLogin = () => api.post("/auth/refresh");
export const logoutAPI = () => api.post("/auth/logout");
export const getProfile = () => api.get("/api/user/my-info"); 
