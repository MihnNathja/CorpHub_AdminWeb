import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { create, getAll, getMy, remove, update } from "../services/shiftApi";

/* ===========================
   ASYNC THUNKS
=========================== */

// Lấy tất cả 
export const fetchShifts = createAsyncThunk(
    "shift/fetchAll",
    async (params, { rejectWithValue }) => {
        try {
            const res = await getAll(params);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Lấy của người dùng đang đăng nhập
export const fetchMyShifts = createAsyncThunk(
    "shift/fetchMy",
    async (params, { rejectWithValue }) => {
        try {
            const res = await getMy(params);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Tạo mới
export const createShift = createAsyncThunk(
    "shift/create",
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
export const updateShift = createAsyncThunk(
    "shift/update",
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
export const deleteShift = createAsyncThunk(
    "shift/delete",
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

const shiftSlice = createSlice({
    name: "shift",
    initialState: {
        items: [],
        meta: {},
        loading: false,
        error: null,
    },
    reducers: {
        resetShiftState: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        /* --- FETCH ALL --- */
        builder
            .addCase(fetchShifts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShifts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
            })
            .addCase(fetchShifts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- FETCH ALL --- */
        builder
            .addCase(fetchMyShifts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyShifts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
            })
            .addCase(fetchMyShifts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- CREATE --- */
        builder
            .addCase(createShift.pending, (state) => {
                state.loading = true;
            })
            .addCase(createShift.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload.data);
            })
            .addCase(createShift.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- UPDATE --- */
        builder
            .addCase(updateShift.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.items.findIndex((i) => i.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(updateShift.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- DELETE --- */
        builder
            .addCase(deleteShift.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((i) => i.id !== action.payload.data);
            })
            .addCase(deleteShift.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetShiftState } = shiftSlice.actions;

export default shiftSlice.reducer;
