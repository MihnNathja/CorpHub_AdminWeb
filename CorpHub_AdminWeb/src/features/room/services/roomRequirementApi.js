import api from "../../../services/api";

export const getRoomRequirements = (params) => api.get("/api/room-requirements", { params });

export const approveRoomRequirement = (id) =>
    api.put(`/api/room-requirements/${id}/approve`);

export const rejectRoomRequirement = (id) =>
    api.put(`/api/room-requirements/${id}/reject`);