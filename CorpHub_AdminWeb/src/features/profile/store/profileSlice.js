import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { changePassword, uploadAvatar } from "../services/profileApi";
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

export const uploadAvatarAsync = createAsyncThunk(
  "profile/uploadAvatar",
  async (file, { rejectWithValue }) => {
    try {
      const res = await uploadAvatar(file);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Upload failed");
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
    uploading: false,
    uploadSuccess: false,
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
      //Change Password
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
      })

      // Upload Avatar
      .addCase(uploadAvatarAsync.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadAvatarAsync.fulfilled, (state) => {
        state.uploading = false;
        state.uploadSuccess = true;
      })
      .addCase(uploadAvatarAsync.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      });
  },
});

export const { resetStatus } = profileSlice.actions;
export default profileSlice.reducer;
