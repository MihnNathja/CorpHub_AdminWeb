import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { create, getAll, getMyReq, remove, update } from "../service/absenceRequestApi";

/* ===========================
   ASYNC THUNKS
=========================== */

// Lấy tất cả 
export const fetchAbsenceRequests = createAsyncThunk(
    "absenceRequest/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getAll();
            return res; // tuỳ cấu trúc API
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Lấy của người dùng đang đăng nhập
export const fetchMyAbsenceRequests = createAsyncThunk(
    "absenceRequest/fetchMy",
    async (params, { rejectWithValue }) => {
        try {
            const res = await getMyReq(params);
            return res; // tuỳ cấu trúc API
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
            const res = await create(data);
            return res;
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
            const res = await update(id, data);
            return res;
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
        /* --- FETCH ALL --- */
        builder
            .addCase(fetchAbsenceRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAbsenceRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
            })
            .addCase(fetchAbsenceRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- FETCH ALL --- */
        builder
            .addCase(fetchMyAbsenceRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyAbsenceRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
            })
            .addCase(fetchMyAbsenceRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- CREATE --- */
        builder
            .addCase(createAbsenceRequest.pending, (state) => {
                state.loading = true;
            })
            .addCase(createAbsenceRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload.data);
            })
            .addCase(createAbsenceRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- UPDATE --- */
        builder
            .addCase(updateAbsenceRequest.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.items.findIndex((i) => i.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(updateAbsenceRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- DELETE --- */
        builder
            .addCase(deleteAbsenceRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((i) => i.id !== action.payload.data);
            })
            .addCase(deleteAbsenceRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetAbsenceRequestState } = absenceRequestSlice.actions;

export default absenceRequestSlice.reducer;
