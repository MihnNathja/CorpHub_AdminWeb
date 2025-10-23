import api from "../../../services/api";

export const getRoomRequirements = (params) => api.get("/api/room-requirements", { params });

export const approveRoomRequirement = (id, roomId) =>
    api.put(`/api/room-requirements/approve?id=${id}&roomId=${roomId}`);

export const rejectRoomRequirement = (id) =>
    api.put(`/api/room-requirements/${id}/reject`);