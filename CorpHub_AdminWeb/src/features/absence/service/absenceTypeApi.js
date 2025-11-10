import api from "../../../services/api";

export const getAll = () =>
    api.get(`/api/absence/type`);

export const create = (data) =>
    api.post(`/api/absence/type`, data);

export const update = (id, data) =>
    api.put(`/api/absence/type/${id}`, data);

export const remove = (id) =>
    api.delete(`/api/absence/type/${id}`);