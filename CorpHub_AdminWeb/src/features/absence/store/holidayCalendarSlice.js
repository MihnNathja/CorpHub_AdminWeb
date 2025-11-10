import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { create, getAll, remove, update } from "../service/holidayCalendarApi";

/* ===========================
   ASYNC THUNKS
=========================== */

// Lấy tất cả holiday
export const fetchHolidayCalendars = createAsyncThunk(
    "holidayCalendar/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getAll();
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Tạo mới
export const createHolidayCalendar = createAsyncThunk(
    "holidayCalendar/create",
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
export const updateHolidayCalendar = createAsyncThunk(
    "holidayCalendar/update",
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
export const deleteHolidayCalendar = createAsyncThunk(
    "holidayCalendar/delete",
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

const holidayCalendarlice = createSlice({
    name: "holiday",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetHolidayCalendartate: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        /* --- FETCH ALL --- */
        builder
            .addCase(fetchHolidayCalendars.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHolidayCalendars.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
            })
            .addCase(fetchHolidayCalendars.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- CREATE --- */
        builder
            .addCase(createHolidayCalendar.pending, (state) => {
                state.loading = true;
            })
            .addCase(createHolidayCalendar.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload.data);
            })
            .addCase(createHolidayCalendar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- UPDATE --- */
        builder
            .addCase(updateHolidayCalendar.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.items.findIndex((i) => i.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(updateHolidayCalendar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- DELETE --- */
        builder
            .addCase(deleteHolidayCalendar.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((i) => i.id !== action.payload.data);
            })
            .addCase(deleteHolidayCalendar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetHolidayCalendartate } = holidayCalendarlice.actions;

export default holidayCalendarlice.reducer;
