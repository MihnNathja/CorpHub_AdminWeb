// src/features/user/store/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserApi,
  getUserByIdApi,
  getUsersApi,
  getUsersBySearch,
} from "../services/userApi";
import { getAllDepartments } from "../../department/services/departmentApi";


// ✅ Lấy danh sách tất cả người dùng
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUsersApi();
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Lấy người dùng theo ID
export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getUserByIdApi(id);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Tạo người dùng mới
export const addUser = createAsyncThunk(
  "user/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await createUserApi(userData);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Cập nhật người dùng
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateUserApi(id, data); // hoặc gọi API riêng
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Lấy danh sách phòng ban
export const fetchDepartments = createAsyncThunk(
  "user/fetchDepartments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllDepartments();
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Tìm kiếm người dùng
export const fetchUsersBySearch = createAsyncThunk(
  "user/fetchUsersBySearch",
  async (query, { rejectWithValue }) => {
    try {
      const res = await getUsersBySearch(query);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState: {
    list: [],
    currentUser: null,
    searchResults: [],
    departments: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== FETCH USERS =====
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || action.payload || [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      })

      // ===== GET USER BY ID =====
      .addCase(getUserById.fulfilled, (state, action) => {
        state.currentUser = action.payload?.data || action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.currentUser = null;
        state.error = action.payload || "Failed to get user";
      })

      // ===== ADD USER =====
      .addCase(addUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload?.data || action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Add user failed";
      })

      // ===== FETCH DEPARTMENTS =====
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departments = action.payload?.data || action.payload || [];
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.error = action.payload || "Failed to load departments";
      })

      // ===== SEARCH USERS =====
      .addCase(fetchUsersBySearch.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsersBySearch.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload?.data || action.payload || [];
      })
      .addCase(fetchUsersBySearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Search failed";
      });
  },
});

export const { clearSearchResults } = userSlice.actions;
export default userSlice.reducer;
