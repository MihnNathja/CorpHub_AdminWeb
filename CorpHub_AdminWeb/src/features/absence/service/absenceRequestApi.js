import api from "../../../services/api";

export const getAll = (params) =>
    api.get(`/api/absence/requests`, params);

export const getMyReq = (params) =>
    api.get(`/api/absence/requests/my`, { params })

export const create = (data) =>
    api.post(`/api/absence/requests`, data);

export const update = (id, data) =>
    api.put(`/api/absence/requests/${id}`, data);

export const remove = (id) =>
    api.delete(`/api/absence/requests/${id}`);