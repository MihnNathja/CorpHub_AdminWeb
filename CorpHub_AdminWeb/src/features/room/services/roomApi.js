import api from "../../../services/api";

export const getRooms = (params) => api.get("/api/rooms", { params });

export const saveRoom = (room) => api.post("/api/rooms", room);

export const deleteRoom = (id) => api.delete(`/api/rooms/${id}`)

export const suitableRooms = (id) => api.get(`/api/rooms/suitable-rooms/${id}`);