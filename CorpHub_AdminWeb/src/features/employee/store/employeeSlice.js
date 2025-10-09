import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createEmployeeProfileApi,
  createEmployeeProfileTicketApi,
  getAllEmployeeProfileApi,
} from "../services/employeeApi";

// Async thunk gọi API
export const createEmployeeProfile = createAsyncThunk(
  "employee/createEmployeeProfile",
  async ({ profile, avatarFile }, { rejectWithValue }) => {
    try {
      console.log(profile);
      const formData = new FormData();

      // append JSON profile
      formData.append(
        "profile",
        new Blob([JSON.stringify(profile)], { type: "application/json" })
      );

      // append file avatar
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await createEmployeeProfileApi(formData);
      console.log(response);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getAllEmployeeProfile = createAsyncThunk(
  "employee/getAllEmployeeProfile",
  async ({ page = 0, size = 10, keyword = "" }, { rejectWithValue }) => {
    try {
      const response = await getAllEmployeeProfileApi({ page, size, keyword });
      console.log(response);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createEmployeeProfileTicket = createAsyncThunk(
  "employee/createEmployeeProfileTicket",
  async (employeeIds, { rejectWithValue }) => {
    try {
      console.log(employeeIds);
      const response = await createEmployeeProfileTicketApi(employeeIds);
      console.log(response);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    data: [],
    meta: { page: 0, totalPages: 1, size: 10 },
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEmployeeProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployeeProfile.fulfilled, (state, action) => {
        state.loading = false;
        // thêm employee mới vào danh sách
        state.data.push(action.payload.data);
      })
      .addCase(createEmployeeProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create employee";
      })
      .addCase(getAllEmployeeProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEmployeeProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.meta = action.payload.meta || state.meta;
      })
      .addCase(getAllEmployeeProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get all employee";
      })
      .addCase(createEmployeeProfileTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployeeProfileTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          "Đã gửi yêu cầu tạo tài khoản cho IT thành công!";
      })
      .addCase(createEmployeeProfileTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Không thể gửi yêu cầu tạo tài khoản";
      });
  },
});

export default employeeSlice.reducer;
