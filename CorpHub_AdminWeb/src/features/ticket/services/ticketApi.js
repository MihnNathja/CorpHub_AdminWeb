import api from "../../../services/api";

export const getReceivedTickets = () =>
  api.get(`/api/tickets/department/received`);

export const getUsersDepartment = () => api.get(`/api/department/users`);

export const getMyTickets = () => api.get(`/api/tickets/my-tickets`);

export const saveTicket = (ticket) => api.post(`api/tickets/save`, ticket);

export const assignTicket = (ticketId, userId) =>
  api.post(`/api/tickets/assign`, { ticketId: ticketId, assigneeId: userId });

export const getSentTickets = () => api.get(`/api/tickets/department/sent`);

export const confirmSendTicket = (ticketId) =>
  api.post(`/api/tickets/confirm/${ticketId}`);

export const rejectTicket = (ticketId, reason) =>
  api.post(`/api/tickets/reject`, { ticketId, reason });

export const acceptTicket = (ticketId) =>
  api.post(`/api/tickets/take-over/${ticketId}`);

export const completeTicket = (ticketId) =>
  api.post(`/api/tickets/complete/${ticketId}`);
