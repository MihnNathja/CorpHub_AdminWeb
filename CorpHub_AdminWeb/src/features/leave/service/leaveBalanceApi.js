import api from "../../../services/api";

export const getAll = () =>
    api.get(`/api/leave/balance`);

export const create = (data) =>
    api.post(`/api/leave/balance`, data);

export const update = (id, data) =>
    api.put(`/api/leave/balance/${id}`, data);

export const remove = (id) =>
    api.delete(`/api/leave/balance/${id}`);