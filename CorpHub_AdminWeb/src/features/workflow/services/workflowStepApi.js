import api from "../../../services/api";

export const getByTemplateId = (templateId) =>
    api.get(`/api/workflow/steps/${templateId}`);

export const create = (data) =>
    api.post(`/api/workflow/steps`, data);

export const update = (id, data) =>
    api.put(`/api/workflow/steps/${id}`, data);

export const remove = (id) =>
    api.delete(`/api/workflow/steps/${id}`);