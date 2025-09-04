// src/features/user/store/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createUser, getUsers } from "../services/userApi";

// Async thunk để thêm user
export const addUser = createAsyncThunk(
  "user/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await createUser(userData);
      return response; // data từ API
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUsers();
      console.log("Fetched users:", res);
      return res.data; // backend trả về danh sách user
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    list: [],       // danh sách user
    loading: false,
    error: null,
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
      });
  },
});

export default userSlice.reducer;
