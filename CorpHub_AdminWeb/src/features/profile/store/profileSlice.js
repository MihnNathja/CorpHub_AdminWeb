import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { changePassword } from "../services/profileApi";
import { showError } from "../../../utils/toastUtils";

// ================== ASYNC ACTION ==================
export const changePasswordAsync = createAsyncThunk(
  "profile/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await changePassword(data);
      //console.log(response);
      return response; // chứa message và status từ API
    } catch (err) {
      //console.log(err);
      return rejectWithValue(err.data?.message || "Không thể đổi mật khẩu.");
    }
  }
);

// ================== SLICE ==================
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    loading: false,
    success: false,
    message: null,
    error: null,
  },
  reducers: {
    resetStatus: (state) => {
      state.loading = false;
      state.success = false;
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePasswordAsync.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.message = null;
      })
      .addCase(changePasswordAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "Đổi mật khẩu thành công.";
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload || "Đổi mật khẩu thất bại.";
        state.success = false;
      });
  },
});

export const { resetStatus } = profileSlice.actions;
export default profileSlice.reducer;
