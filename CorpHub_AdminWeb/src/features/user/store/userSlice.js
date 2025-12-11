// src/features/user/store/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserApi,
  getUserByIdApi,
  getUsersApi,
  getUsersBySearch,
  resetPassword,
  toggleUserActive,
} from "../services/userApi";
import { getAllDepartments } from "../../department/services/departmentApi";
import { showError, showSuccess } from "../../../utils/toastUtils";

// ✅ Lấy danh sách tất cả người dùng
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async ({ page = 1, keyword = "", filters, sort }, { rejectWithValue }) => {
    try {
      // console.log("Filter: ");
      // console.log("Page: ", page);
      // console.log("keyword: ", keyword);
      // console.log("Filters:", filters);
      // console.log("sort:", sort);

      const res = await getUsersApi({
        page,
        keyword,
        gender: filters.gender,
        departmentId: filters.departmentId,
        isActive: filters.active,
        sortField: sort.field,
        sortDir: sort.direction,
      });
      console.log("Danh sách người dùng ", res);
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
  async ({ userData, ticketId }, { rejectWithValue }) => {
    try {
      console.log("Thông tin người dùng: ", userData);
      const res = await createUserApi(userData, ticketId);
      showSuccess("Create user successfully!");
      return res;
    } catch (err) {
      showError("Failed with Error:", err);
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

// ✅ Lấy danh sách vai trò
// export const fetchRoles = createAsyncThunk(
//   "user/fetchRoles",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await getAllRoles();
//       return res;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

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

// ===== UPDATE ACTIVE STATUS =====
export const changeUserActive = createAsyncThunk(
  "user/changeUserActive",
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await toggleUserActive(id);
      const active = res.data;
      showSuccess(res?.message || "Cập nhật trạng thái thành công!");
      return { id, active };
    } catch (err) {
      showError("Cập nhật trạng thái thất bại!");
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ===== RESET PASSWORD STATUS =====
export const resetUserPassword = createAsyncThunk(
  "user/resetPassword",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await resetPassword(userId);
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
    meta: { page: 0, totalPages: 1, size: 10 },
    currentUser: null,
    searchResults: [],
    departments: [],
    roles: [],
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
        state.list = action.payload?.data || [];
        state.meta = action.payload.meta;
        console.log("Phân trang", state.meta);
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
      })
      // Toggle active
      .addCase(changeUserActive.fulfilled, (state, action) => {
        const updated = action.payload; // { id, active }
        const user = state.list.find((u) => u.id === updated.id);
        if (user) {
          user.active = updated.active; // ✅ cập nhật trạng thái mới từ server
        }
      })
      // Reset Password
      .addCase(resetUserPassword.pending, (state) => {})
      .addCase(resetUserPassword.fulfilled, (state) => {})
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearSearchResults } = userSlice.actions;
export default userSlice.reducer;
