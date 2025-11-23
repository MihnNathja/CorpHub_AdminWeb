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

export const setManagerApi = async (departmentId, managerId) => {
  const res = await api.put(
    `/api/department/${departmentId}/assign-manager/${managerId}`
  );
  return res;
};

export const createPositionApi = async (departmentId, data) => {
  const res = await api.post(`/api/department/${departmentId}/positions`, data);
  return res;
};

export const updatePositionApi = async (id, data) => {
  const res = await api.put(`/api/department/positions/${id}`, data);
  return res;
};

export const deletePositionApi = async (id) => {
  const res = await api.delete(`/api/department/positions/${id}`);
  return res;
};

export const reorderApi = async (departmentId, orderedIds) => {
  const res = await api.put(
    `/api/department/${departmentId}/positions/reorder`,
    orderedIds
  );
  return res;
};

export const getPositionsApi = async (departmentId) => {
  const res = await api.get(`/api/department/${departmentId}/positions`);
  return res;
};
