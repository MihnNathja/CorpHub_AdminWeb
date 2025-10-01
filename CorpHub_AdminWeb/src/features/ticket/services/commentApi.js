import api from "../../../services/api";

export const getTicketComments = (ticketId) =>
    api.get(`/api/ticket-comments?ticketId=${ticketId}`);

export const saveTicketComment = ({ ticketId, commentText, parentId }) =>
    api.post("/api/ticket-comments/save", {
        ticketId,
        commentText,
        parentId,
    });
