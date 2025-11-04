import api from "../../../services/api";

export const getRoomRequirements = (params) => api.get("/api/room-requirements", { params });

export const approveRoomRequirement = (id, roomId) =>
    api.put(`/api/room-requirements/approve?id=${id}&roomId=${roomId}`);

export const rejectRoomRequirement = (id) =>
    api.put(`/api/room-requirements/${id}/reject`);

export const getRoomRequirementsFilter = (roomId, date) =>
    api.get("/api/room-requirements/filter", { params: { roomId, date } });

export const allocationSuggestion = (ids) =>
    api.post("/api/room-requirements/allocations/suggestions", { ids });

