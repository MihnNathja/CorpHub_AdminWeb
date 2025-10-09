import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getRoomRequirements,
    approveRoomRequirement as approveApi,
    rejectRoomRequirement as rejectApi,
} from "../services/roomRequirementApi";

/* ----------------------------- ASYNC ACTIONS ----------------------------- */

// 🟩 Fetch danh sách yêu cầu phòng (có phân trang)
export const fetchRoomRequirements = createAsyncThunk(
    "roomRequirements/fetchAll",
    async ({ page = 0, size = 9 } = {}, { rejectWithValue }) => {
        try {
            const res = await getRoomRequirements({ page, size });
            // Giả định API trả về ApiResponse {status, message, data, meta}
            return res;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || { message: "Lỗi khi tải danh sách yêu cầu phòng" }
            );
        }
    }
);

// 🟩 Phê duyệt yêu cầu
export const approveRoomRequirement = createAsyncThunk(
    "roomRequirements/approve",
    async (id, { rejectWithValue }) => {
        try {
            const res = await approveApi(id);
            return res;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || { message: "Lỗi khi phê duyệt yêu cầu" }
            );
        }
    }
);

// 🟩 Từ chối yêu cầu
export const rejectRoomRequirement = createAsyncThunk(
    "roomRequirements/reject",
    async (id, { rejectWithValue }) => {
        try {
            const res = await rejectApi(id);
            return res;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || { message: "Lỗi khi từ chối yêu cầu" }
            );
        }
    }
);

/* ----------------------------- SLICE ----------------------------- */

const roomRequirementSlice = createSlice({
    name: "roomRequirements",
    initialState: {
        items: [], // danh sách yêu cầu phòng
        meta: {}, // thông tin phân trang (page, totalPages, v.v.)
        loading: false,
        error: null,
        selected: null,
    },
    reducers: {
        setSelectedRequirement: (state, action) => {
            state.selected = action.payload;
        },
        clearSelectedRequirement: (state) => {
            state.selected = null;
        },
    },
    extraReducers: (builder) => {
        builder
            /* ---- Fetch all ---- */
            .addCase(fetchRoomRequirements.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoomRequirements.fulfilled, (state, action) => {
                state.loading = false;
                state.items = Array.isArray(action.payload.data)
                    ? action.payload.data
                    : [];
                state.meta = action.payload.meta || {};
            })
            .addCase(fetchRoomRequirements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Không thể tải danh sách yêu cầu";
            })

            /* ---- Approve ---- */
            .addCase(approveRoomRequirement.fulfilled, (state, action) => {
                const updated = action.payload.data;
                if (!updated) return;
                const index = state.items.findIndex((r) => r.id === updated.id);
                if (index !== -1) {
                    state.items[index] = updated;
                }
            })

            /* ---- Reject ---- */
            .addCase(rejectRoomRequirement.fulfilled, (state, action) => {
                const updated = action.payload.data;
                if (!updated) return;
                const index = state.items.findIndex((r) => r.id === updated.id);
                if (index !== -1) {
                    state.items[index] = updated;
                }
            });
    },
});

export const { setSelectedRequirement, clearSelectedRequirement } =
    roomRequirementSlice.actions;

export default roomRequirementSlice.reducer;
