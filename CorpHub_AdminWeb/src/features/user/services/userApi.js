import api from "../../../services/api";
import { showError, showSuccess } from "../../../utils/toastUtils";

export const createUserApi = (userData, ticketId) =>
  api.post(`/api/user/create?ticketId=${ticketId}`, userData);

export const getUsersApi = (params) => {
  console.log(params);
  return api.get("/api/user/employee", { params });
};

export const getUserByIdApi = async (id) => {
  const res = await api.get(`/api/user/${id}`);
  return res.data?.data || res.data;
};
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

export const toggleUserActive = async (id) => {
  console.log("Gọi tới API thay đổi active");
  try {
    const res = await api.patch(`/api/user/${id}/toggle-active`);
    return res;
  } catch (error) {
    console.error("Lỗi khi toggleActive:", error);
    throw new Error("Cập nhật trạng thái thất bại");
  }
};

export const resetPassword = async (userId) => {
  try {
    const res = await api.post(`/api/user/admin/reset-password/${userId}`);
    showSuccess(res.data?.message || "Đã đặt lại mật khẩu và gửi qua email!");
    return res.data;
  } catch (error) {
    showError(error.response?.data?.message || "Cập nhật mật khẩu thất bại");
    throw error;
  }
};
