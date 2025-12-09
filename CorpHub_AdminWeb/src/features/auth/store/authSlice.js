// src/features/auth/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, refreshLogin, logoutAPI } from "../services/authApi";
import api from "../../../services/api";

/* -------------------- LOGIN -------------------- */
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // 🧠 Gửi login request, BE set cookie refreshToken (HTTP-only)
      const res = await loginAPI(credentials);
      const { accessToken, ...user } = res.data; // { userInfo + accessToken }

      // Lưu accessToken tạm trong RAM
      window.__ACCESS_TOKEN__ = accessToken;
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      return { user, accessToken };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

/* -------------------- REFRESH TOKEN -------------------- */
export const refresh = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const res = await refreshLogin(); // Cookie sẽ tự gửi qua axios
      const { accessToken, ...user } = res.data;

      window.__ACCESS_TOKEN__ = accessToken;
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      return { user, accessToken };
    } catch (err) {
      if (err.response?.status === 401) {
        console.log("🚫 Refresh token invalid or expired");
        return rejectWithValue("unauthorized");
      }
      return rejectWithValue(err.response?.data?.message || "Refresh failed");
    }
  }
);

/* -------------------- LOGOUT -------------------- */
export const logoutAsync = createAsyncThunk(
  "auth/logoutAsync",
  async (_, { dispatch }) => {
    try {
      await logoutAPI(); // BE xoá cookie
    } catch (e) {
      console.warn("Logout request failed:", e.message);
    } finally {
      dispatch(logout());
    }
  }
);

/* -------------------- SLICE -------------------- */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.loading = false;
      state.error = null;
      delete api.defaults.headers.common["Authorization"];
      window.__ACCESS_TOKEN__ = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* 🔹 LOGIN */
      .addCase(login.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.accessToken = a.payload.accessToken;
      })
      .addCase(login.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      /* 🔁 REFRESH */
      .addCase(refresh.fulfilled, (s, a) => {
        s.user = a.payload.user;
        s.accessToken = a.payload.accessToken;
      })
      .addCase(refresh.rejected, (s, a) => {
        if (a.payload === "unauthorized") {
          s.user = null;
          s.accessToken = null;
          window.__ACCESS_TOKEN__ = null;
        }
      })

      /* 🚪 LOGOUT */
      .addCase(logoutAsync.fulfilled, (s) => {
        s.user = null;
        s.accessToken = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
