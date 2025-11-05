import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { create, getAll, remove, update } from "../service/leaveTypeApi";
import { showSuccess } from "../../../utils/toastUtils";

/* ===========================
   ASYNC THUNKS
=========================== */

// Lấy tất cả loại nghỉ
export const fetchLeaveTypes = createAsyncThunk(
    "leaveType/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getAll();
            return res; // tuỳ cấu trúc API
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Tạo mới
export const createLeaveType = createAsyncThunk(
    "leaveType/create",
    async (data, { rejectWithValue }) => {
        try {
            const res = await create(data);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Cập nhật
export const updateLeaveType = createAsyncThunk(
    "leaveType/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await update(id, data);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Xóa
export const deleteLeaveType = createAsyncThunk(
    "leaveType/delete",
    async (id, { rejectWithValue }) => {
        try {
            await remove(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* ===========================
   SLICE
=========================== */

const leaveTypeSlice = createSlice({
    name: "leaveType",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetLeaveTypeState: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        /* --- FETCH ALL --- */
        builder
            .addCase(fetchLeaveTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLeaveTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
            })
            .addCase(fetchLeaveTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- CREATE --- */
        builder
            .addCase(createLeaveType.pending, (state) => {
                state.loading = true;
            })
            .addCase(createLeaveType.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload.data);
            })
            .addCase(createLeaveType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- UPDATE --- */
        builder
            .addCase(updateLeaveType.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.items.findIndex((i) => i.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(updateLeaveType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- DELETE --- */
        builder
            .addCase(deleteLeaveType.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((i) => i.id !== action.payload.data);
            })
            .addCase(deleteLeaveType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetLeaveTypeState } = leaveTypeSlice.actions;

export default leaveTypeSlice.reducer;
