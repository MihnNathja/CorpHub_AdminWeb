import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getByEmployee,
  createHistory,
} from "../services/internalWorkHistoryApi";

/**
 * Lấy danh sách lịch sử làm việc nội bộ theo employeeId
 */
export const fetchInternalWorkHistories = createAsyncThunk(
  "internalWorkHistory/fetchByEmployee",
  async (employeeId, { rejectWithValue }) => {
    try {
      const res = await getByEmployee(employeeId);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/**
 * Tạo mới lịch sử làm việc nội bộ
 */
export const createInternalWorkHistory = createAsyncThunk(
  "internalWorkHistory/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createHistory(data);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const internalWorkHistorySlice = createSlice({
  name: "internalWorkHistory",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch histories
    builder
      .addCase(fetchInternalWorkHistories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInternalWorkHistories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.data || action.payload || [];
      })
      .addCase(fetchInternalWorkHistories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create history
    builder
      .addCase(createInternalWorkHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createInternalWorkHistory.fulfilled, (state, action) => {
        state.loading = false;
        const newItem = action.payload?.data || action.payload;
        if (newItem) {
          state.items.push(newItem);
        }
      })
      .addCase(createInternalWorkHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = internalWorkHistorySlice.actions;
export default internalWorkHistorySlice.reducer;
