import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getRoomRequirements,
    approveRoomRequirement as approveApi,
    rejectRoomRequirement as rejectApi,
    getRoomRequirementsFilter,
} from "../services/roomRequirementApi";
import { showError } from "../../../utils/toastUtils";
import { suitableRooms } from "../services/roomApi";

/* ----------------------------- ASYNC ACTIONS ----------------------------- */

// 🟩 Lấy danh sách yêu cầu phòng (có phân trang)
export const fetchRoomRequirements = createAsyncThunk(
    "roomRequirements/fetchAll",
    async ({ page = 0, size = 9 } = {}, { rejectWithValue }) => {
        try {
            const res = await getRoomRequirements({ page, size });
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
    async ({ id, roomId }, { rejectWithValue }) => {
        try {
            const res = await approveApi(id, roomId);
            console.log(res);
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

export const fetchRoomRequirementsFilter = createAsyncThunk(
    "roomRequirements/fetchFiltered",
    async ({ roomId, date }, { rejectWithValue }) => {
        try {
            const res = await getRoomRequirementsFilter(roomId, date);
            return res;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || { message: "Không thể tải danh sách yêu cầu phòng" }
            );
        }
    }
);

/* ----------------------------- SLICE ----------------------------- */

const roomRequirementSlice = createSlice({
    name: "roomRequirements",
    initialState: {
        items: [], // danh sách yêu cầu phòng
        suitableRooms: [], // danh sách phòng phù hợp (từ RoomRequirementId)
        roomReqsByRoom: [], // danh sách yêu cầu đã lọc
        selected: null,
        meta: {}, // phân trang
        loading: false, // loading danh sách yêu cầu
        loadingSuitable: false, // 🆕 loading riêng cho suitable rooms
        loadingRoomReqsByRoom: false,
        error: null,
    },
    reducers: {
        setSelectedRequirement: (state, action) => {
            state.selected = action.payload;
        },
        clearSelectedRequirement: (state) => {
            state.selected = null;
            state.suitableRooms = [];
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
                if (index !== -1) state.items[index] = updated;
            })

            /* ---- Reject ---- */
            .addCase(rejectRoomRequirement.fulfilled, (state, action) => {
                const updated = action.payload.data;
                if (!updated) return;
                const index = state.items.findIndex((r) => r.id === updated.id);
                if (index !== -1) state.items[index] = updated;
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

            /* ---- Fetch filtered ---- */
            .addCase(fetchRoomRequirementsFilter.pending, (state) => {
                state.loadingRoomReqsByRoom = true;
                state.error = null;
            })
            .addCase(fetchRoomRequirementsFilter.fulfilled, (state, action) => {
                state.loadingRoomReqsByRoom = false;
                state.roomReqsByRoom = action.payload.data || [];
            })
            .addCase(fetchRoomRequirementsFilter.rejected, (state, action) => {
                state.loadingRoomReqsByRoom = false;
                state.error =
                    action.payload?.message || "Không thể tải danh sách yêu cầu phòng";
            });
    },
});

export const { setSelectedRequirement, clearSelectedRequirement } =
    roomRequirementSlice.actions;

export default roomRequirementSlice.reducer;
