// src/features/user/store/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createUserApi, getUserByIdApi, getUsersApi } from "../services/userApi";
import { getAllDepartments } from "../../department/services/departmentApi";
import { showError } from "../../../utils/toastUtils"

// Lấy danh sách user
export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  const response = await getUsersApi();
  return response.data;
});

export const getUserById = createAsyncThunk("user/getUserById",
  async (id) => {
    try {
      const response = await getUserByIdApi(id);
      console.log(response.data);
      return response.data;
    } catch (error) {
      showError(error)
      // Nếu API trả về error response từ server
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      // Nếu là lỗi khác (network, timeout...)
      return rejectWithValue(error.message);
    }
  }
)

// Thêm user
export const addUser = createAsyncThunk(
  "user/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      console.log(userData);
      const response = await createUserApi(userData);
      return response.data;
    } catch (error) {
      showError(error)
      // Nếu API trả về error response từ server
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      // Nếu là lỗi khác (network, timeout...)
      return rejectWithValue(error.message);
    }
  }
);


// Cập nhật user
export const updateUser = createAsyncThunk("user/updateUser", async ({ id, data }) => {
  const response = await api.put(`/api/user/${id}`, data);
  return response.data;
});

// Lấy danh sách department
export const fetchDepartments = createAsyncThunk(
  "user/fetchDepartments",
  async () => {
    const response = await getAllDepartments();
    return response.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    list: [],
    currentUser: null,  
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
      // getUserById
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload; 
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentUser = null;
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
