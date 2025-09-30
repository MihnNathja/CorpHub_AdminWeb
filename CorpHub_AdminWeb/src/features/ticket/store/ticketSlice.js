import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  assignTicket,
  confirmSendTicket,
  getReceivedTickets,
  getSentTickets,
  getUsersDepartment,
  rejectTicket,
  getMyTickets,
  saveTicket,
  acceptTicket,
} from "../services/ticketApi";

// === MY TICKETS ===
export const fetchMyTickets = createAsyncThunk(
  "tickets/fetchMyTickets",
  async (_, thunkAPI) => {
    try {
      const res = await getMyTickets();
      console.log("My tickets:", res.data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk để fetch ticket từ API
export const fetchReceivedTickets = createAsyncThunk(
  "tickets/fetchReceivedTickets",
  async (_, thunkAPI) => {
    try {
      const res = await getReceivedTickets();
      console.log("Received tickets:", res.data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchSentTickets = createAsyncThunk(
  "tickets/fetchSentTickets",
  async (_, thunkAPI) => {
    try {
      const res = await getSentTickets();
      console.log("Sent tickets:", res.data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchUsersDepartment = createAsyncThunk(
  "tickets/fetchUsersDepartment",
  async (_, thunkAPI) => {
    try {
      //console.log("fetchUsersDepartment: ");
      const res = await getUsersDepartment();
      //console.log("Fetch User department ",res.data );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createOrUpdateTicket = createAsyncThunk(
  "tickets/createOrUpdateTicket",
  async (ticket, thunkAPI) => {
    try {
      const res = await saveTicket(ticket);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
)

export const confirmSend = createAsyncThunk(
  "tickets/confirmSend",
  async ({ ticketId }, thunkAPI) => {
    try {
      const res = await confirmSendTicket(ticketId);
      return { ticketId, data: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const reject = createAsyncThunk(
  "tickets/reject",
  async ({ ticketId, reason }, thunkAPI) => {
    try {
      const res = await rejectTicket(ticketId, reason);
      return { ticketId, data: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const assign = createAsyncThunk(
  "tickets/assignTicket",
  async ({ ticketId, userId }, thunkAPI) => {
    try {
      const res = await assignTicket(ticketId, userId);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const accept = createAsyncThunk(
  "tickets/accept",
  async (ticketId, thunkAPI) => {
    try {
      const res = await acceptTicket(ticketId);
      return { ticketId, data: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    myItems: [],
    receivedItems: [],
    sentItems: [],
    users: [],
    loading: false,
    actionLoading: false,
    error: null,
    statusFilter: "", // "" nghĩa là tất cả
    priorityFilter: "",
    page: 1,
    pageSize: 10,
  },
  reducers: {
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
      state.page = 1;
    },
    setPriorityFilter(state, action) {
      state.priorityFilter = action.payload;
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // === MY TICKETS ===
      .addCase(fetchMyTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.myItems = action.payload;
      })
      .addCase(fetchMyTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // === RECEIVED TICKETS ===
      .addCase(fetchReceivedTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceivedTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.receivedItems = action.payload;
      })
      .addCase(fetchReceivedTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === SENT TICKETS ===
      .addCase(fetchSentTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSentTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.sentItems = action.payload;
      })
      .addCase(fetchSentTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === USERS ===
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

      // === CREATE OR UPDATE TICKET ===
      .addCase(createOrUpdateTicket.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createOrUpdateTicket.fulfilled, (state, action) => {
        state.actionLoading = false;
        const newTicket = action.payload;
        if (!newTicket || !newTicket.id) return;

        // Nếu đã tồn tại thì update, nếu chưa thì thêm mới
        const existingIndex = state.myItems.findIndex((t) => t.id === newTicket.id);
        if (existingIndex !== -1) {
          state.myItems[existingIndex] = { ...state.myItems[existingIndex], ...newTicket };
        } else {
          state.myItems.unshift(newTicket); // thêm lên đầu danh sách
        }
      })
      .addCase(createOrUpdateTicket.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // === ASSIGN ===
      .addCase(assign.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(assign.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload;
        if (!updated || !updated.id) {
          console.warn("Assign fulfilled but payload is invalid", updated);
          return;
        }
        // Chỉ update trong receivedItems
        const index = state.receivedItems.findIndex((t) => t.id === updated.id);
        if (index !== -1) {
          state.receivedItems[index] = {
            ...state.receivedItems[index],
            ...updated,
          };
        }
      })
      .addCase(assign.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // === CONFIRM SEND ===
      .addCase(confirmSend.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(confirmSend.fulfilled, (state, action) => {
        state.actionLoading = false;
        const ticketId = action.payload.ticketId;
        const ticket =
          state.sentItems.find((t) => t.id === ticketId) ||
          state.receivedItems.find((t) => t.id === ticketId);
        if (ticket) ticket.status = "WAITING";
      })
      .addCase(confirmSend.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // === REJECT SEND ===
      .addCase(reject.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(reject.fulfilled, (state, action) => {
        state.actionLoading = false;
        const ticketId = action.payload.ticketId;
        const ticket =
          state.sentItems.find((t) => t.id === ticketId) ||
          state.receivedItems.find((t) => t.id === ticketId);
        if (ticket) ticket.status = "REJECTED";
      })
      .addCase(reject.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // === ACCEPT ===
      .addCase(accept.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(accept.fulfilled, (state, action) => {
        state.actionLoading = false;
        const ticketId = action.payload.ticketId;
        // tìm ticket trong receivedItems hoặc myItems để update
        let ticket =
          state.myItems.find((t) => t.id === ticketId);
        if (ticket) {
          ticket.status = "IN_PROGRESS"; 
        }
      })
      .addCase(accept.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setStatusFilter, setPriorityFilter, setPage } =
  ticketSlice.actions;

export default ticketSlice.reducer;
