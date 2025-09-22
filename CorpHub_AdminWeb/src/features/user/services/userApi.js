import api from "../../../services/api";

export const createUserApi = (data) => api.post("/api/user/create", data);

export const getUsersApi = () => api.get("/api/user/employee");

export const getUserByIdApi = (id) => api.get(`/api/user/employee/info/${id}`);

// export const updateUser = (id, data) => api.put(`/users/${id}`, data);

// export const deleteUser = (id) => api.delete(`/users/${id}`);
