import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { create, getAll, remove, update } from "../service/leaveBalanceApi";

/* ===========================
   ASYNC THUNKS
=========================== */

// Lấy tất cả 
export const fetchLeaveBalances = createAsyncThunk(
    "leaveBalance/fetchAll",
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
export const createLeaveBalance = createAsyncThunk(
    "leaveBalance/create",
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
export const updateLeaveBalance = createAsyncThunk(
    "leaveBalance/update",
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
export const deleteLeaveBalance = createAsyncThunk(
    "leaveBalance/delete",
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

const leaveBalanceSlice = createSlice({
    name: "leaveBalance",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetLeaveBalanceState: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        /* --- FETCH ALL --- */
        builder
            .addCase(fetchLeaveBalances.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLeaveBalances.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
            })
            .addCase(fetchLeaveBalances.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- CREATE --- */
        builder
            .addCase(createLeaveBalance.pending, (state) => {
                state.loading = true;
            })
            .addCase(createLeaveBalance.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload.data);
            })
            .addCase(createLeaveBalance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- UPDATE --- */
        builder
            .addCase(updateLeaveBalance.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.items.findIndex((i) => i.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(updateLeaveBalance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- DELETE --- */
        builder
            .addCase(deleteLeaveBalance.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((i) => i.id !== action.payload.data);
            })
            .addCase(deleteLeaveBalance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetLeaveBalanceState } = leaveBalanceSlice.actions;

export default leaveBalanceSlice.reducer;
