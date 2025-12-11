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

// Employee detail
export const getEmployeeFullDetail = (employeeId) =>
  api.get(`/api/employee/${employeeId}/full-detail`);

// Position change request / approval APIs
export const getPositionChangeRequestsByEmployee = (employeeId) => {
  return api.get(`/api/position-change-request/employee/${employeeId}`);
};

export const getPositionChangeRequest = (id) => {
  return api.get(`/api/position-change-request/${id}`);
};

export const getApprovalStepsByRequest = (requestId) => {
  return api.get(`/api/position-change-approval/request/${requestId}`);
};

export const approveApprovalStep = (approvalId, comment) => {
  return api.post(`/api/position-change-approval/${approvalId}/approve`, {
    comment,
  });
};

export const rejectApprovalStep = (approvalId, comment) => {
  return api.post(`/api/position-change-approval/${approvalId}/reject`, {
    comment,
  });
};

// Get all position requests (global list)
export const getAllPositionChangeRequests = (status) => {
  return api.get("/api/position-change-request", {
    params: status ? { status } : {},
  });
};

// HR Finalization APIs
export const getFinalizationRequests = (status = "FINALIZE") => {
  return api.get("/api/position-change-request", {
    params: { status },
  });
};

export const uploadDecisionFile = (requestId, files, notes) => {
  const formData = new FormData();

  // Add multiple files
  files.forEach((file) => {
    formData.append("file", file);
  });

  // Add notes if provided
  if (notes) {
    formData.append("notes", notes);
  }

  return api.post(
    `/api/position-change-request/${requestId}/upload-decision`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};
