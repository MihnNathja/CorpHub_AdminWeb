import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { create, getAll, remove, update } from "../service/absenceTypeApi";
import { showSuccess } from "../../../utils/toastUtils";

/* ===========================
   ASYNC THUNKS
=========================== */

// Lấy tất cả loại nghỉ
export const fetchAbsenceTypes = createAsyncThunk(
    "absenceType/fetchAll",
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
export const createAbsenceType = createAsyncThunk(
    "absenceType/create",
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
export const updateAbsenceType = createAsyncThunk(
    "absenceType/update",
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
export const deleteAbsenceType = createAsyncThunk(
    "absenceType/delete",
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

const absenceTypeSlice = createSlice({
    name: "absenceType",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetAbsenceTypeState: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        /* --- FETCH ALL --- */
        builder
            .addCase(fetchAbsenceTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAbsenceTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
            })
            .addCase(fetchAbsenceTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- CREATE --- */
        builder
            .addCase(createAbsenceType.pending, (state) => {
                state.loading = true;
            })
            .addCase(createAbsenceType.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload.data);
            })
            .addCase(createAbsenceType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- UPDATE --- */
        builder
            .addCase(updateAbsenceType.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.items.findIndex((i) => i.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(updateAbsenceType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- DELETE --- */
        builder
            .addCase(deleteAbsenceType.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((i) => i.id !== action.payload.data);
            })
            .addCase(deleteAbsenceType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetAbsenceTypeState } = absenceTypeSlice.actions;

export default absenceTypeSlice.reducer;
