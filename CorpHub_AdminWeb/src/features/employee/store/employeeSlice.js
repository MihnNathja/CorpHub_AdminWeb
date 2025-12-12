import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  approvePendingCompetencies,
  createEmployeeProfileApi,
  createEmployeeProfileTicketApi,
  getAllEmployeeProfileApi,
  getPendingCompetencies,
  rejectPendingCompetencies,
} from "../services/employeeApi";
import { showError, showSuccess } from "../../../utils/toastUtils";

// Async thunk gọi API
export const createEmployeeProfile = createAsyncThunk(
  "employee/createEmployeeProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await createEmployeeProfileApi(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getAllEmployeeProfile = createAsyncThunk(
  "employee/getAllEmployeeProfile",
  async ({ page = 0, size = 10, keyword = "" }, { rejectWithValue }) => {
    try {
      const response = await getAllEmployeeProfileApi({ page, size, keyword });
      console.log(response);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createEmployeeProfileTicket = createAsyncThunk(
  "employee/createEmployeeProfileTicket",
  async (employeeIds, { rejectWithValue }) => {
    try {
      console.log(employeeIds);
      const response = await createEmployeeProfileTicketApi(employeeIds);
      console.log(response);

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getAllPendingCompetencies = createAsyncThunk(
  "employee/getAllPendingCompetencies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPendingCompetencies();
      console.log(response);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const approveCompetency = createAsyncThunk(
  "employee/approveCompetency",
  async (competencyId, { rejectWithValue }) => {
    try {
      const response = await approvePendingCompetencies(competencyId);
      showSuccess("Approve Successfully");
      return { id: competencyId, data: response.data };
    } catch (err) {
      showError("Approve Failed");
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const rejectCompetency = createAsyncThunk(
  "employee/rejectCompetency",
  async ({ competencyId, reason }, { rejectWithValue }) => {
    try {
      const response = await rejectPendingCompetencies(competencyId, reason);
      showSuccess("Reject Successfully");
      return { id: competencyId, data: response.data };
    } catch (err) {
      showError("Reject Failed");
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    data: [],
    meta: { page: 0, totalPages: 1, size: 10 },
    loading: false,
    error: null,
    lastCreatedId: null,
    successMessage: null,
    pendingCompetencies: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEmployeeProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployeeProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.lastCreatedId = action.payload?.data ?? null;
        state.successMessage = action.payload?.message || null;
      })
      .addCase(createEmployeeProfile.rejected, (state, action) => {
        state.loading = false;
        state.lastCreatedId = null;
        state.error = action.payload || "Failed to create employee";
      })
      .addCase(getAllEmployeeProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEmployeeProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.meta = action.payload.meta || state.meta;
      })
      .addCase(getAllEmployeeProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get all employee";
      })
      .addCase(createEmployeeProfileTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployeeProfileTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          "Đã gửi yêu cầu tạo tài khoản cho IT thành công!";
      })
      .addCase(createEmployeeProfileTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Không thể gửi yêu cầu tạo tài khoản";
      })
      // ===============================
      // GET ALL PENDING COMPETENCIES
      // ===============================
      .addCase(getAllPendingCompetencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPendingCompetencies.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingCompetencies = action.payload;
      })
      .addCase(getAllPendingCompetencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch pending competencies";
      })
      // ===============================
      // APPROVE PENDING COMPETENCY
      // ===============================
      .addCase(approveCompetency.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveCompetency.fulfilled, (state, action) => {
        state.loading = false;

        // xóa item khỏi list pending
        state.pendingCompetencies = state.pendingCompetencies.filter(
          (c) => c.id !== action.payload.id
        );
      })
      .addCase(approveCompetency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to approve competency";
      })

      // ===============================
      // REJECT PENDING COMPETENCY
      // ===============================
      .addCase(rejectCompetency.pending, (state) => {
        state.loading = true;
      })
      .addCase(rejectCompetency.fulfilled, (state, action) => {
        state.loading = false;

        // xóa item khỏi pending
        state.pendingCompetencies = state.pendingCompetencies.filter(
          (c) => c.id !== action.payload.id
        );
      })
      .addCase(rejectCompetency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to reject competency";
      });
  },
});

export default employeeSlice.reducer;
