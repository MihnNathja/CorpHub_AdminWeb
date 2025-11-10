import api from "../../../services/api";

export const getAllDepartments = () => api.get("/api/department/get-all");

export const fetchDepartmentsWithUsers = async () => {
  const res = await api.get("/api/department/with-users");
  return res;
};

export const createDepartmentApi = async (data) => {
  const res = await api.post("/api/department", data);
  return res;
};

export const updateDepartmentApi = async (id, data) => {
  const res = await api.put(`/api/department/${id}`, data);
  return res;
};

export const deleteDepartmentApi = async (id) => {
  const res = await api.delete(`/api/department/${id}`);
  return res;
};
