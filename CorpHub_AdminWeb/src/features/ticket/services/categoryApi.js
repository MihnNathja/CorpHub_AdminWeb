import api from "../../../services/api";

export const getAllCategories = () => api.get(`/api/tickets/categories`);