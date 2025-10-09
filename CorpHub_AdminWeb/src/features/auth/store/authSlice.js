import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, getProfile } from "../services/authApi";

/* -------------------- LOGIN -------------------- */
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginAPI(credentials);
      console.log("✅ Login response:", response.data);

      // Lấy đúng dữ liệu user
      const userData = response.data;
      // Lưu vào localStorage
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));

      return userData; // Trả ra userData thay vì cả response
    } catch (err) {
      console.error("❌ Login error:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* -------------------- FETCH PROFILE -------------------- */
export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfile();
      return response.data?.data || response.data;
    } catch (err) {
      console.error("❌ Fetch profile error:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* -------------------- SLICE -------------------- */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: (() => {
      try {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
      } catch {
        localStorage.removeItem("user");
        return null;
      }
    })(),
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },

  extraReducers: (builder) => {
    builder
      /* 🔵 LOGIN */
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload || null; // ✅ userData
        state.token = action.payload.token || null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      /* 🟢 FETCH PROFILE */
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch profile";

        // Nếu token hết hạn
        if (action.payload?.status === 401) {
          state.user = null;
          state.token = null;
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      });
  },
});

/* -------------------- EXPORT -------------------- */
export const { logout } = authSlice.actions;
export default authSlice.reducer;
