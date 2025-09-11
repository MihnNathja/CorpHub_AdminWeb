import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { assignTicket, confirmSendTicket, getReceivedTickets, getSentTickets, getUsersDepartment, rejectSendTicket } from "../services/ticketApi";


// Async thunk để fetch ticket từ API
export const fetchReceivedTickets = createAsyncThunk(
  "tickets/fetchReceivedTickets",
  async (thunkAPI) => {
    try {
      const res = await getReceivedTickets();
      console.log(res.data);
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

export const fetchSentTickets = createAsyncThunk(
  "tickets/fetchSentTickets",
  async (thunkAPI) => {
    try {
      const res = await getSentTickets();
      console.log(res.data);
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
  async ({ ticketId, userId }, { thunkAPI }) => {
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
    priorityFilter: "",
    page: 1,
    pageSize: 10, // số ticket mỗi trang
  },
  reducers: {
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
      state.page = 1; // reset page khi filter thay đổi
    },
    setPriorityFilter(state, action) {
      state.priorityFilter = action.payload;
      state.page = 1; // reset page khi filter thay đổi
    },
    setPage(state, action) {
      state.page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReceivedTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceivedTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReceivedTickets.rejected, (state, action) => {
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
        const updated = action.payload;

        // Check chắc chắn updated tồn tại và có id
        if (!updated || !updated.id) {
          console.warn("Assign fulfilled but payload is invalid", updated);
          return;
        }

        const index = state.items.findIndex(t => t.id === updated.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...updated };
        } else {
          // Nếu chưa có trong items, push vào hoặc bỏ qua
          console.warn("Assigned ticket not found in items", updated);
        }
      })

      .addCase(assign.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSentTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSentTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSentTickets.rejected, (state, action) => {
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
          ticket.status = "WAITING"; // hoặc action.payload.status nếu API trả về
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
          ticket.status = "REJECTED"; // hoặc action.payload.status nếu API trả về
        }
      })
      .addCase(rejectSend.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  }
});

export const { setStatusFilter, setPriorityFilter, setPage } = ticketSlice.actions;
export default ticketSlice.reducer;
