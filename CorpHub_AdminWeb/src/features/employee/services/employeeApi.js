import api from "../../../services/api";

export const createEmployeeProfileApi = (formData) =>
  api.post("/api/employee/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getAllEmployeeProfileApi = () => api.get("/api/employee");
