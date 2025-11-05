import api from "../../../services/api";

export const getAll = () =>
    api.get(`/api/leave/type`);

export const create = (data) =>
    api.post(`/api/leave/type`, data);

export const update = (id, data) =>
    api.put(`/api/leave/type/${id}`, data);

export const remove = (id) =>
    api.delete(`/api/leave/type/${id}`);