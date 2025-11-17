import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doAttendance } from "../services/attendanceApi";

export const submitAttendance = createAsyncThunk(
    "attendance/submitAttendance",
    async ({ wsId, data }, { rejectWithValue }) => {
        try {
            const res = await doAttendance(wsId, data);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const attendanceSlice = createSlice({
    name: "attendance",
    initialState: {
        records: {},   // key: wsId → record object
        loading: false,
        error: null,
        lastUpdate: null, // timestamp
    },
    reducers: {
        resetAttendanceState: (state) => {
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitAttendance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitAttendance.fulfilled, (state, action) => {
                state.loading = false;

                const record = action.payload.data; // record DTO
                const wsId = record.workSchedule.id;

                // cập nhật record theo wsId
                state.records[wsId] = record;

                state.lastUpdate = new Date().toISOString();
            })
            .addCase(submitAttendance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetAttendanceState } = attendanceSlice.actions;

export default attendanceSlice.reducer;
