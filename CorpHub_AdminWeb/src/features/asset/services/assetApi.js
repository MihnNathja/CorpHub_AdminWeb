import api from "../../../services/api";

export const getCategories = () => api.get(`/api/assets/categories`);
export const getAssets = (params) => api.get(`/api/assets`, { params });
export const getAssetById = (id) => api.get(`/api/assets/${id}`);
export const createAsset = (data) => api.post(`/api/assets`, data);
export const updateAsset = (data) => api.put(`/api/assets`, data);
export const deleteAsset = (id) => api.delete(`/api/assets/${id}`);
export const removeAssetFromRoom = (assetId) => api.post(`/api/assets/remove-from-room`, null, { params: { assetId } });