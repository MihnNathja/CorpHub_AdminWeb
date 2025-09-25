import api from "../../../services/api";

export const createUserApi = (data) => api.post("/api/user/create", data);

export const getUsersApi = () => api.get("/api/user/employee");

export const getUserByIdApi = (id) => api.get(`/api/user/employee/info/${id}`);
export const getUsersBySearch = async (query) => {
    if (!query || !query.trim()) return { data: [] };
    console.log(query);
    return api.get(`/api/user/search?keyword=${encodeURIComponent(query.trim())}`);
};


// export const getUserById = (id) => api.get(`/users/${id}`);

// export const updateUser = (id, data) => api.put(`/users/${id}`, data);

// export const deleteUser = (id) => api.delete(`/users/${id}`);
