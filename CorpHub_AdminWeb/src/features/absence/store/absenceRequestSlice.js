import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    create,
    getMyReq,
    remove,
    update,
    approveOrReject,
    getAllMyApprovals
} from "../service/absenceRequestApi";

/* ===========================
   ASYNC THUNKS
=========================== */

// Lấy danh sách request tôi tạo
export const fetchMyAbsenceRequests = createAsyncThunk(
    "absenceRequest/fetchMy",
    async (params, { rejectWithValue }) => {
        try {
            const res = await getMyReq(params);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Lấy các request tôi phải duyệt hoặc từng duyệt
export const fetchMyApprovals = createAsyncThunk(
    "absenceRequest/fetchMyApprovals",
    async (params, { rejectWithValue }) => {
        try {
            const res = await getAllMyApprovals(params);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Tạo mới
export const createAbsenceRequest = createAsyncThunk(
    "absenceRequest/create",
    async (data, { rejectWithValue }) => {
        try {
            return await create(data);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Cập nhật
export const updateAbsenceRequest = createAsyncThunk(
    "absenceRequest/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return await update(id, data);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Xóa
export const deleteAbsenceRequest = createAsyncThunk(
    "absenceRequest/delete",
    async (id, { rejectWithValue }) => {
        try {
            await remove(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Approve/Reject
export const approveOrRejectRequest = createAsyncThunk(
    "absenceRequest/approveOrReject",
    async ({ instanceId, approve, comment }, { rejectWithValue }) => {
        try {
            return await approveOrReject(instanceId, { approve, comment });
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


/* ===========================
   SLICE
=========================== */

const absenceRequestSlice = createSlice({
    name: "absenceRequest",
    initialState: {
        items: [],
        meta: {},
        loading: false,
        error: null,
    },
    reducers: {
        resetAbsenceRequestState: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {

        /* --- FETCH MY REQUESTS --- */
        builder
            .addCase(fetchMyAbsenceRequests.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMyAbsenceRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
                state.meta = action.payload.meta || {};
            })
            .addCase(fetchMyAbsenceRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- FETCH MY APPROVALS --- */
        builder
            .addCase(fetchMyApprovals.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMyApprovals.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
                state.meta = action.payload.meta || {};
            })
            .addCase(fetchMyApprovals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- CREATE --- */
        builder
            .addCase(createAbsenceRequest.fulfilled, (state, action) => {
                state.items.push(action.payload.data);
            });

        /* --- UPDATE --- */
        builder
            .addCase(updateAbsenceRequest.fulfilled, (state, action) => {
                const data = action.payload.data;
                const idx = state.items.findIndex((i) => i.id === data.id);
                if (idx !== -1) state.items[idx] = data;
            });

        /* --- DELETE --- */
        builder
            .addCase(deleteAbsenceRequest.fulfilled, (state, action) => {
                state.items = state.items.filter((i) => i.id !== action.payload);
            })
            .addCase(deleteAbsenceRequest.rejected, (state, action) => {
                // Có thể hiện lỗi nếu cần
                state.error = action.payload;
            });

        /* --- APPROVE / REJECT --- */
        builder
            .addCase(approveOrRejectRequest.fulfilled, (state, action) => {
                const updated = action.payload.data;
                const idx = state.items.findIndex((i) => i.id === updated.id);
                if (idx !== -1) state.items[idx] = updated;
            });
    },
});

export const { resetAbsenceRequestState } = absenceRequestSlice.actions;

export default absenceRequestSlice.reducer;
