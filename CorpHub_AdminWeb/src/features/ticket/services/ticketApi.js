import api from "../../../services/api";

export const getReceivedTickets = () => api.get(`/api/tickets/department/received`);

export const getUsersDepartment = () => api.get(`/api/department/users`);

export const assignTicket = (ticketId, userId) => api.post(`/api/tickets/assign`, { ticketId: ticketId, assigneeId: userId });

export const getSentTickets = () => api.get(`/api/tickets/department/sent`);

export const confirmSendTicket = (ticketId) => api.post(`/api/tickets/confirm/${ticketId}`);

export const rejectSendTicket = (ticketId) => api.post(`/api/tickets/reject/${ticketId}`);