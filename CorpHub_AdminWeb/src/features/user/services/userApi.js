import api from "../../../services/api";

export const createUserApi = (userData, ticketId) =>
  api.post(`/api/user/create?ticketId=${ticketId}`, userData);

export const getUsersApi = (params) => api.get("/api/user/employee", params);

export const getUserByIdApi = (id) => api.get(`/api/user/employee/info/${id}`);
export const getUsersBySearch = async (query) => {
  if (!query || !query.trim()) return { data: [] };
  console.log(query);
  return api.get(
    `/api/user/search?keyword=${encodeURIComponent(query.trim())}`
  );
};

export const getMyInfo = () => api.get(`/api/user/my-info`);

export const getAllRoles = () => api.get("/api/roles");

// export const getUserById = (id) => api.get(`/users/${id}`);

// export const updateUser = (id, data) => api.put(`/users/${id}`, data);

// export const deleteUser = (id) => api.delete(`/users/${id}`);
