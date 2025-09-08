import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { assignTicket, confirmSendTicket, getDepartmentTickets, getDepartmentTicketsSent, getUsersDepartment, rejectSendTicket } from "../services/ticketApi";


// Async thunk để fetch ticket từ API
export const fetchDepartmentTickets = createAsyncThunk(
  "tickets/fetchDepartmentTickets",
  async (thunkAPI) => {
    try {
      const res = await getDepartmentTickets();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchUsersDepartment = createAsyncThunk(
  "tickets/fetchUsersDepartment",
  async (thunkAPI) => {
    try {
      const res = await getUsersDepartment();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchDepartmentTicketsSent = createAsyncThunk(
  "tickets/fetchDepartmentTicketsSent",
  async (thunkAPI) => {
    try {
      const res = await getDepartmentTicketsSent();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const confirmSend = createAsyncThunk(
  "tickets/confirmSend",
  async ({ ticketId }, { thunkAPI }) => {
    try {
      const res = await confirmSendTicket(ticketId);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const rejectSend = createAsyncThunk(
  "tickets/rejectSend",
  async ({ ticketId }, { thunkAPI }) => {
    try {
      const res = await rejectSendTicket(ticketId);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const assign = createAsyncThunk(
  "tickets/assignTicket",
  async ({ ticketId, userId }, { dispatch }) => {
    try {
      const res = await assignTicket(ticketId, userId);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    items: [],
    users: [],
    loading: false,
    actionLoading: false,
    error: null,
    statusFilter: "", // "" nghĩa là tất cả
    page: 1,
    pageSize: 10, // số ticket mỗi trang
  },
  reducers: {
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
      state.page = 1; // reset page khi filter thay đổi
    },
    setPage(state, action) {
      state.page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartmentTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDepartmentTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUsersDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(assign.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(assign.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload; // ticket đã update từ API
        const index = state.items.findIndex(t => t.id === updated.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...updated };
        }
      })
      .addCase(assign.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchDepartmentTicketsSent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentTicketsSent.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDepartmentTicketsSent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(confirmSend.pending, (state) => {
        state.loactionLoadingading = true;
        state.error = null;
      })
      .addCase(confirmSend.fulfilled, (state, action) => {
        state.actionLoading = false;
        const ticketId = action.meta.arg.ticketId;
        const ticket = state.items.find(t => t.id === ticketId);
        if (ticket) {
          ticket.status = "confirmed"; // hoặc action.payload.status nếu API trả về
        }
      })
      .addCase(confirmSend.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(rejectSend.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(rejectSend.fulfilled, (state) => {
        state.actionLoading = false;
        const ticketId = action.meta.arg.ticketId;
        const ticket = state.items.find(t => t.id === ticketId);
        if (ticket) {
          ticket.status = "rejected"; // hoặc action.payload.status nếu API trả về
        }
      })
      .addCase(rejectSend.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  }
});

export const { setStatusFilter, setPage } = ticketSlice.actions;
export default ticketSlice.reducer;
