import api from "../../../services/api";

export const getAll = () =>
    api.get(`/api/absence/balance`);

export const generate = () =>
    api.post(`/api/absence/balance/generate`);