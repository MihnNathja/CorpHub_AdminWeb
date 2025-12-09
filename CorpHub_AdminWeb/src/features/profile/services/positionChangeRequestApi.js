import api from "../../../services/api";

export const createRequest = (data) => {
  const res = api.post("/api/position-change-request", data);
  return res;
};

export const getRequest = (id) => {
  const res = api.get(`/api/position-change-request/${id}`);
  return res;
};

export const getRequestsByEmployee = (employeeId) => {
  const res = api.get(`/api/position-change-request/employee/${employeeId}`);
  return res;
};

export const getApprovalStepsByRequest = (requestId) => {
  const res = api.get(`/api/position-change-approval/request/${requestId}`);
  return res;
};
