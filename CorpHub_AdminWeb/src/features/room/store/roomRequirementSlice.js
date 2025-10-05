import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getRoomRequirements,
    approveRoomRequirement as approveApi,
    rejectRoomRequirement as rejectApi,
} from "../services/roomRequirementApi";

/* ----------------------------- ASYNC ACTIONS ----------------------------- */

export const fetchRoomRequirements = createAsyncThunk(
    "roomRequirements/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getRoomRequirements();
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Lỗi khi tải danh sách yêu cầu phòng"
            );
        }
    }
);

export const approveRoomRequirement = createAsyncThunk(
    "roomRequirements/approve",
    async (id, { rejectWithValue }) => {
        try {
            const res = await approveApi(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Lỗi khi phê duyệt yêu cầu");
        }
    }
);

export const rejectRoomRequirement = createAsyncThunk(
    "roomRequirements/reject",
    async (id, { rejectWithValue }) => {
        try {
            const res = await rejectApi(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Lỗi khi từ chối yêu cầu");
        }
    }
);

/* ----------------------------- SLICE ----------------------------- */

const roomRequirementSlice = createSlice({
    name: "roomRequirements",
    initialState: {
        list: [],
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
                state.list = action.payload;
            })
            .addCase(fetchRoomRequirements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ---- Approve ---- */
            .addCase(approveRoomRequirement.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.list.findIndex((r) => r.id === updated.id);
                if (index !== -1) state.list[index] = updated;
            })

            /* ---- Reject ---- */
            .addCase(rejectRoomRequirement.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.list.findIndex((r) => r.id === updated.id);
                if (index !== -1) state.list[index] = updated;
            });
    },
});

export const { setSelectedRequirement, clearSelectedRequirement } =
    roomRequirementSlice.actions;
export default roomRequirementSlice.reducer;
