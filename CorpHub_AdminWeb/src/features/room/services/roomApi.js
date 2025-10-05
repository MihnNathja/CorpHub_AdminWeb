import api from "../../../services/api";

export const getRooms = () => api.get("/api/rooms");

export const saveRoom = (room) => api.post("/api/rooms", room);

export const deleteRoom = (id) => api.delete(`/api/rooms/${id}`)