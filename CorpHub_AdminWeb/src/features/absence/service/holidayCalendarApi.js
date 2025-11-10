import api from "../../../services/api";

export const getAll = () =>
    api.get(`/api/holiday-calendar`);

export const create = (data) =>
    api.post(`/api/holiday-calendar`, data);

export const update = (id, data) =>
    api.put(`/api/holiday-calendar/${id}`, data);

export const remove = (id) =>
    api.delete(`/api/holiday-calendar/${id}`);