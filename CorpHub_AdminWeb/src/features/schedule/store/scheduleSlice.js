import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getEmployeeSchedule } from "../services/scheduleApi";

/* ===========================
   ASYNC THUNKS
=========================== */

// Lấy tất cả 
export const fetchSchedules = createAsyncThunk(
    "schedule/fetchSchedules",
    async (params, { rejectWithValue }) => {
        try {
            const res = await getEmployeeSchedule(params);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* ===========================
   SLICE
=========================== */

const scheduleSlice = createSlice({
    name: "schedule",
    initialState: {
        items: [],
        meta: {},
        loading: false,
        error: null,
    },
    reducers: {
        resetScheduleState: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        /* --- FETCH ALL --- */
        builder
            .addCase(fetchSchedules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSchedules.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
            })
            .addCase(fetchSchedules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetScheduleState } = scheduleSlice.actions;

export default scheduleSlice.reducer;
