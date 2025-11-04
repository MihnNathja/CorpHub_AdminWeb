import api from "../../../services/api";

export const getRoomTypes = () => api.get("/api/room-types");