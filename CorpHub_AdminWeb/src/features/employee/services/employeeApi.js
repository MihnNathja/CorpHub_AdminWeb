import api from "../../../services/api";

export const createEmployeeProfileApi = (formData) =>
  api.post("/api/employee/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getAllEmployeeProfileApi = ({ page, size, keyword }) => {
  return api.get("/api/employee", {
    params: { page, size, keyword },
  });
};

export const createEmployeeProfileTicketApi = (employeeIds) => {
  return api.post("/api/tickets/create-user-ticket", employeeIds);
};

export const getPendingCompetencies = () => {
  return api.get("/api/admin/employee/competencies/pending");
};

export const approvePendingCompetencies = (competencyId) => {
  return api.put(`/api/admin/employee/competencies/approve/${competencyId}`);
};

export const rejectPendingCompetencies = (competencyId, reason) => {
  return api.put(`/api/admin/employee/competencies/reject/${competencyId}`);
};
