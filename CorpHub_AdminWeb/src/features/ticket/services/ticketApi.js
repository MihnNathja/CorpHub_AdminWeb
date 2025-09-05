import api from "../../../services/api";

export const getDepartmentTickets = () => api.get(`/api/tickets/department`);

export const getUsersDepartment = () => api.get(`/api/department/users`);

export const assignTicket = (ticketId, userId) => api.post(`/api/tickets/assign`, { ticketId: ticketId, assigneeId: userId });