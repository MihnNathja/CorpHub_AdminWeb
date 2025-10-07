import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRooms, saveRoom, deleteRoom } from "../services/roomApi";

// Lấy danh sách rooms
export const fetchRooms = createAsyncThunk("rooms/fetchRooms", async (_, { rejectWithValue }) => {
    try {
        const res = await getRooms();
        return res.data; // vì bạn đang dùng ApiResponse {status, message, timestamp, data}
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

// Tạo / cập nhật room
export const createOrUpdateRoom = createAsyncThunk("rooms/saveRoom", async (room, { rejectWithValue }) => {
    try {
        const res = await saveRoom(room);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

// Xóa room
export const removeRoom = createAsyncThunk("rooms/deleteRoom", async (id, { rejectWithValue }) => {
    try {
        const res = await deleteRoom(id);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

// ==== Slice ====
const roomSlice = createSlice({
    name: "rooms",
    initialState: {
        rooms: [],
        loading: false,
        error: null,
        selectedRoom: null,
    },
    reducers: {
        setSelectedRoom(state, action) {
            state.selectedRoom = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchRooms
            .addCase(fetchRooms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRooms.fulfilled, (state, action) => {
                state.loading = false;
                state.rooms = action.payload || [];
            })
            .addCase(fetchRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // saveRoom
            .addCase(createOrUpdateRoom.fulfilled, (state, action) => {
                const updated = action.payload;
                const idx = state.rooms.findIndex((r) => r.id === updated.id);
                if (idx >= 0) {
                    state.rooms[idx] = updated;
                } else {
                    state.rooms.push(updated);
                }
            })
            // deleteRoom
            .addCase(removeRoom.fulfilled, (state, action) => {
                const deleted = action.payload;
                state.rooms = state.rooms.filter((r) => r.id !== deleted.id);
            });
    },
});

export const { setSelectedRoom } = roomSlice.actions;
export default roomSlice.reducer;
