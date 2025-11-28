import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    autoAssign,
    create,
    getEmployeeSchedule,
    getScheduleForUserOnDate,
    remove,
    update,
} from "../services/scheduleApi";

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

export const fetchTodayShiftsForUser = createAsyncThunk(
    "schedule/fetchTodayShiftsForUser",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getScheduleForUserOnDate();
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Phân ca tự động
export const autoAssignSchedules = createAsyncThunk(
    "schedule/autoAssignSchedules",
    async (data, { rejectWithValue }) => {
        try {
            const res = await autoAssign(data);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* ===========================
   CRUD
=========================== */

// Tạo mới
export const createSchedule = createAsyncThunk(
    "schedule/create",
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
export const updateSchedule = createAsyncThunk(
    "schedule/update",
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
export const deleteSchedule = createAsyncThunk(
    "schedule/delete",
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

const scheduleSlice = createSlice({
    name: "schedule",
    initialState: {
        admin: {
            items: [],
            meta: {}
        },
        user: {
            today: [],
            meta: {}
        },
        meta: {},
        loading: false,
        error: null,
        assignResult: null,
    },
    reducers: {
        resetScheduleState: (state) => {
            state.loading = false;
            state.error = null;
            state.assignResult = null;
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
                state.admin.items = action.payload.data || [];
                state.admin.meta = action.payload.metadata || {};
            })
            .addCase(fetchSchedules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- FETCH FOR USER --- */
        builder
            .addCase(fetchTodayShiftsForUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTodayShiftsForUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user.today = action.payload.data || [];
                state.user.meta = action.payload.metadata || {};
            })
            .addCase(fetchTodayShiftsForUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });


        /* --- AUTO ASSIGN --- */
        builder
            .addCase(autoAssignSchedules.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.assignResult = null;
            })
            .addCase(autoAssignSchedules.fulfilled, (state, action) => {
                state.loading = false;
                const result =
                    action.payload.metadata?.createdCount ||
                    action.payload.data?.length ||
                    0;
                state.assignResult = {
                    count: result,
                    message: `Đã tạo ${result} lịch làm việc tự động.`,
                };
            })
            .addCase(autoAssignSchedules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.assignResult = null;
            });

        /* --- CREATE --- */
        builder
            .addCase(createSchedule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSchedule.fulfilled, (state, action) => {
                state.loading = false;
                // Nếu API trả về object mới, thêm vào danh sách
                const newItem = action.payload.data;
                if (newItem) state.admin.items.push(newItem);
            })
            .addCase(createSchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- UPDATE --- */
        builder
            .addCase(updateSchedule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSchedule.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload.data;
                if (updated) {
                    const idx = state.admin.items.findIndex((i) => i.id === updated.id);
                    if (idx !== -1) state.admin.items[idx] = updated;
                }
            })
            .addCase(updateSchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- DELETE --- */
        builder
            .addCase(deleteSchedule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSchedule.fulfilled, (state, action) => {
                state.loading = false;
                const id = action.payload;
                state.admin.items = state.admin.items.filter((i) => i.id !== id);
            })
            .addCase(deleteSchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetScheduleState } = scheduleSlice.actions;

export default scheduleSlice.reducer;
