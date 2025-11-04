import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRoomTypes } from "../services/roomTypeApi";

// 🟢 Async thunk để fetch loại phòng từ API
export const fetchRoomTypes = createAsyncThunk(
    "roomTypes/fetchRoomTypes",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getRoomTypes();
            return res; // Axios trả data ở đây
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const roomTypeSlice = createSlice({
    name: "roomTypes",
    initialState: {
        items: [],       // Danh sách loại phòng
        loading: false,  // Trạng thái loading
        error: null,     // Lỗi nếu có
    },
    reducers: {
        // Có thể thêm reducer đồng bộ khác ở đây nếu cần
        clearRoomTypes: (state) => {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoomTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoomTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data || [];
            })
            .addCase(fetchRoomTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.data || "Failed to load room types";
            });
    },
});

export const { clearRoomTypes } = roomTypeSlice.actions;
export default roomTypeSlice.reducer;
