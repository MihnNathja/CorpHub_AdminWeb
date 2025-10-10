import api from "../../../services/api";

export const getReceivedTickets = (params) =>
  api.get(`/api/tickets/department/received`, { params });

export const getSentTickets = (params) =>
  api.get(`/api/tickets/department/sent`, { params });

export const getMyTickets = (params) =>
  api.get(`/api/tickets/my-tickets`, { params });

export const getTicketMetaById = (ticketId) =>
  api.get(`/api/tickets/meta/${ticketId}`);

export const getUsersDepartment = () => api.get(`/api/department/users`);

export const saveTicket = (ticket) => api.post(`api/tickets/save`, ticket);

export const assignTicket = (ticketId, userId) =>
  api.post(`/api/tickets/assign`, { ticketId: ticketId, assigneeId: userId });

export const confirmSendTicket = (ticketId) =>
  api.post(`/api/tickets/confirm/${ticketId}`);

export const rejectTicket = (ticketId, reason) =>
  api.post(`/api/tickets/reject`, { ticketId, reason });

export const acceptTicket = (ticketId) =>
  api.post(`/api/tickets/take-over/${ticketId}`);

export const completeTicket = (ticketId) =>
  api.post(`/api/tickets/complete/${ticketId}`);

export const deleteTicket = (ticketId) =>
  api.delete(`/api/tickets/delete/${ticketId}`);
