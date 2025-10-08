// src/features/auth/services/authApi.js
import api from "../../../services/api";

export const loginAPI = (credentials) => api.post("/auth/login", credentials);
export const getProfile = () => api.get("/api/user/my-info"); 
