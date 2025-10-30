import api from "../../../services/api";

export const getAllDepartments = () => api.get("/api/department/get-all");

export const fetchDepartmentsWithUsers = async () => {
  const res = await api.get("/api/department/with-users");
  return res.data;
};
