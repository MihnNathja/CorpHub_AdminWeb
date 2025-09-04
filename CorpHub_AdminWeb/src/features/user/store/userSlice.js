// src/features/user/store/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

// Lấy danh sách user
export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  const response = await api.get("/api/user/get-all");
  return response.data;
});

// Thêm user
export const addUser = createAsyncThunk("user/addUser", async (userData) => {
  const response = await api.post("/api/user/create", userData);
  return response.data;
});

// Cập nhật user
export const updateUser = createAsyncThunk("user/updateUser", async ({id, data}) => {
  const response = await api.put(`/api/user/${id}`, data);
  return response.data;
});

// Lấy danh sách department
export const fetchDepartments = createAsyncThunk(
  "user/fetchDepartments",
  async () => {
    const response = await api.get("/api/department/get-all");
    return response.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    list: [],
    loading: false,
    error: null,
    departments: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Khi gửi request
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Khi thành công
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload); // thêm user mới vào list
      })
      // Khi thất bại
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Departments
      .addCase(fetchDepartments.fulfilled, (state, action) => { state.departments = action.payload; })
      .addCase(fetchDepartments.rejected, (state, action) => { state.error = action.error.message; });
  },
});

export default userSlice.reducer;
