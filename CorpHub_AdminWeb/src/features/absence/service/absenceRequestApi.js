import api from "../../../services/api";

export const getPendingForApprover = (params) =>
    api.get(`/api/absence/requests/pending-approval`, { params });

export const getAllMyApprovals = (params) =>
    api.get(`/api/absence/requests/my-approvals`, { params });

export const getMyReq = (params) =>
    api.get(`/api/absence/requests/my`, { params })

export const create = (data) =>
    api.post(`/api/absence/requests`, data);

export const update = (id, data) =>
    api.put(`/api/absence/requests/${id}`, data);

export const remove = (id) =>
    api.delete(`/api/absence/requests/${id}`);

export const approveOrReject = (instanceId, payload) =>
    api.put(`/api/absence/requests/${instanceId}/approval`, payload);