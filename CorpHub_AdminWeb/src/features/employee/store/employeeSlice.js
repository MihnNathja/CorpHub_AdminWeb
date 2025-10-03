import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createEmployeeProfileApi,
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
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllEmployeeProfileApi();
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
    loading: false,
    error: null,
    employees: [], // danh sách
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
        state.employees.push(action.payload);
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
        state.employees = action.payload;
      })
      .addCase(getAllEmployeeProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get all employee";
      });
  },
});

export default employeeSlice.reducer;
