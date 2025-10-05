import api from "../../../services/api";

export const getRoomRequirements = () => api.get("/api/room-requirements");

export const approveRoomRequirement = (id) =>
    api.put(`/api/room-requirements/${id}/approve`);

export const rejectRoomRequirement = (id) =>
    api.put(`/api/room-requirements/${id}/reject`);