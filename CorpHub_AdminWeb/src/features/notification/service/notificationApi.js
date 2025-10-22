import api from "../../../services/api";

export const getAll = () =>
    api.get(`/api/notifications`);

export const markAsRead = (id) =>
    api.put(`/api/notifications/${id}/read`);