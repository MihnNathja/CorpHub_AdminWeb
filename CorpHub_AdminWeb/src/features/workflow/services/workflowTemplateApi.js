import api from "../../../services/api";

export const getAll = (params) =>
    api.get(`/api/workflow/templates`, { params });

export const getById = (id) =>
    api.get(`/api/workflow/templates/${id}`);

export const create = (data) =>
    api.post(`/api/workflow/templates`, data);

export const update = (id, data) =>
    api.put(`/api/workflow/templates/${id}`, data);

export const remove = (id) =>
    api.delete(`/api/workflow/templates/${id}`);