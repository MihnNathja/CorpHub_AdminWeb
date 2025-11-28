import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { generate, getAll } from "../service/absenceBalanceApi";

/* ===========================
   ASYNC THUNKS
=========================== */

// Lấy tất cả 
export const fetchAbsenceBalances = createAsyncThunk(
    "absenceBalance/fetchAll",
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
export const generateAbsenceBalance = createAsyncThunk(
    "absenceBalance/generate",
    async (_, { rejectWithValue }) => {
        try {
            const res = await generate();
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* ===========================
   SLICE
=========================== */

const absenceBalanceSlice = createSlice({
    name: "absenceBalance",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetAbsenceBalanceState: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        /* --- FETCH ALL --- */
        builder
            .addCase(fetchAbsenceBalances.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAbsenceBalances.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
            })
            .addCase(fetchAbsenceBalances.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- GENERATE --- */
        builder
            .addCase(generateAbsenceBalance.pending, (state) => {
                state.loading = true;
            })
            .addCase(generateAbsenceBalance.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload.data);
            })
            .addCase(generateAbsenceBalance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });


    },
});

export const { resetAbsenceBalanceState } = absenceBalanceSlice.actions;

export default absenceBalanceSlice.reducer;
