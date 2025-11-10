import api from "../../../services/api";

export const getAll = (params) =>
    api.get(`/api/shifts`, { params });

export const getMy = (params) =>
    api.get(`/api/shifts/my`, { params })

export const create = (data) =>
    api.post(`/api/shifts`, data);

export const update = (id, data) =>
    api.put(`/api/shifts/${id}`, data);

export const remove = (id) =>
    api.delete(`/api/shifts/${id}`);