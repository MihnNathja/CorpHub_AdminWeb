import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRooms, saveRoom, deleteRoom, assignAssetsToRoom as assignAssetsToRoomApi, suitableRooms } from "../services/roomApi";
import { showSuccess } from "../../../utils/toastUtils";

// === FETCH ROOMS (phân trang) ===
export const fetchRooms = createAsyncThunk(
    "rooms/fetchRooms",
    async (params, { rejectWithValue }) => {
        try {
            const res = await getRooms(params);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// === CREATE / UPDATE ROOM ===
export const createOrUpdateRoom = createAsyncThunk(
    "rooms/createOrUpdateRoom",
    async (room, { rejectWithValue }) => {
        try {
            const res = await saveRoom(room);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// === DELETE ROOM ===
export const removeRoom = createAsyncThunk(
    "rooms/removeRoom",
    async (id, { rejectWithValue }) => {
        try {
            const res = await deleteRoom(id);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// === ASSIGN ASSETS TO ROOM ===
export const assignAssetsToRoom = createAsyncThunk(
    "rooms/assignAssetsToRoom",
    async (data, { rejectWithValue }) => {
        try {
            const res = await assignAssetsToRoomApi(data);
            showSuccess("Assets moved successfully.");
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// 🟩 Lấy danh sách phòng phù hợp theo RoomRequirementId
export const fetchSuitableRooms = createAsyncThunk(
    "roomRequirements/fetchSuitableRooms",
    async (requirementId, { rejectWithValue }) => {
        try {
            
            const res = await suitableRooms(requirementId);
            return res;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || { message: "Không thể tải danh sách phòng phù hợp" }
            );
        }
    }
);

const roomSlice = createSlice({
    name: "rooms",
    initialState: {
        rooms: [], // list of rooms
        suitableRooms: [],
        meta: {}, // contains pagination info
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
            // === FETCH ROOMS ===
            .addCase(fetchRooms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRooms.fulfilled, (state, action) => {
                state.loading = false;
                // Tránh lỗi "rooms.reduce is not a function"
                state.rooms = Array.isArray(action.payload.data)
                    ? action.payload.data
                    : [];
                state.meta = action.payload.meta || {};
            })
            .addCase(fetchRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch rooms";
            })
            /* ---- Fetch suitable rooms ---- */
            .addCase(fetchSuitableRooms.pending, (state) => {
                state.loadingSuitable = true; // 🆕 chỉ ảnh hưởng modal
                state.error = null;
                state.suitableRooms = [];
            })
            .addCase(fetchSuitableRooms.fulfilled, (state, action) => {
                state.loadingSuitable = false; // 🆕
                state.suitableRooms = action.payload.data || [];
            })
            .addCase(fetchSuitableRooms.rejected, (state, action) => {
                state.loadingSuitable = false; // 🆕
                state.error =
                    action.payload?.message || "Không thể tải danh sách phòng phù hợp";
                showError(state.error);
            })
            

            // === CREATE / UPDATE ROOM ===
            .addCase(createOrUpdateRoom.fulfilled, (state, action) => {
                const updated = action.payload.data;
                if (!updated) return;

                const idx = state.rooms.findIndex((r) => r.id === updated.id);
                if (idx >= 0) {
                    state.rooms[idx] = updated;
                } else {
                    state.rooms.unshift(updated);
                }
            })

            // === DELETE ROOM ===
            .addCase(removeRoom.fulfilled, (state, action) => {
                const deleted = action.payload.data;
                if (!deleted) return;
                state.rooms = state.rooms.filter((r) => r.id !== deleted.id);
            })
            // === ASSIGN ASSETS TO ROOM ===
            .addCase(assignAssetsToRoom.rejected, (state, action) => {
                state.error = action.payload?.message || "Failed to assign assets to room";
            });

    },
});

export const { setSelectedRoom } = roomSlice.actions;
export default roomSlice.reducer;
