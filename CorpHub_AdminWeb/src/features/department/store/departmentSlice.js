import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllDepartments } from "../services/departmentApi";

// Async thunk gọi API
export const fetchDepartments = createAsyncThunk(
  "department/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllDepartments();
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const departmentSlice = createSlice({
  name: "department",
  initialState: {
    departments: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetDepartments: (state) => {
      state.departments = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;

        const newData = action.payload.data || [];
        const oldData = state.departments || [];

        // So sánh sâu để tránh tạo mảng mới nếu không thay đổi
        const isSame =
          newData.length === oldData.length &&
          newData.every((dept, i) => dept.id === oldData[i]?.id);

        if (!isSame) {
          state.departments = newData;
        }
      })

      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch departments";
      });
  },
});

export const { resetDepartments } = departmentSlice.actions;

export default departmentSlice.reducer;
