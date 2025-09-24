import api from "../../../services/api";

export const createUser = (data) => api.post("/users", data);

export const getUsers = () => api.get("/api/user/employee");

export const getUsersBySearch = async (query) => {
    if (!query || !query.trim()) return { data: [] };
    console.log(query);
    return api.get(`/api/user/search?keyword=${encodeURIComponent(query.trim())}`);
};


// export const getUserById = (id) => api.get(`/users/${id}`);

// export const updateUser = (id, data) => api.put(`/users/${id}`, data);

// export const deleteUser = (id) => api.delete(`/users/${id}`);
