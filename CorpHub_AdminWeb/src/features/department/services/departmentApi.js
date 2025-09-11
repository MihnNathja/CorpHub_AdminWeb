import api from "../../../services/api";

export const getAllDepartments = () => api.get("/api/department/get-all");