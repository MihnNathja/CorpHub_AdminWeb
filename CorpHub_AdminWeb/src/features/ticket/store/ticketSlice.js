import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  assignTicket,
  confirmSendTicket,
  getReceivedTickets,
  getSentTickets,
  getUsersDepartment,
  rejectTicket,
  getMyTickets,
  getTicketMetaById,
  saveTicket,
  acceptTicket,
  completeTicket,
  deleteTicket,
} from "../services/ticketApi";

// ==================== ASYNC THUNKS ====================

// === MY TICKETS ===
export const fetchMyTickets = createAsyncThunk(
  "tickets/fetchMyTickets",
  async (
    {
      page = 0,
      size = 10,
      isRequester = true,
      status = "",
      priority = "",
      from = "",
      to = "",
      keyword = "",
    },
    thunkAPI
  ) => {
    try {
      const res = await getMyTickets({
        page,
        size,
        isRequester,
        status,
        priority,
        from,
        to,
        keyword,
      });
      return res; // { data, meta }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// === RECEIVED TICKETS ===
export const fetchReceivedTickets = createAsyncThunk(
  "tickets/fetchReceivedTickets",
  async (
    {
      page = 0,
      size = 10,
      status = "",
      priority = "",
      from = "",
      to = "",
      keyword = "",
    },
    thunkAPI
  ) => {
    try {
      const res = await getReceivedTickets({
        page,
        size,
        status,
        priority,
        from,
        to,
        keyword,
      });
      return res; // { data, meta }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// === SENT TICKETS ===
export const fetchSentTickets = createAsyncThunk(
  "tickets/fetchSentTickets",
  async (
    {
      page = 0,
      size = 10,
      status = "",
      priority = "",
      from = "",
      to = "",
      keyword = "",
    },
    thunkAPI
  ) => {
    try {
      const res = await getSentTickets({
        page,
        size,
        status,
        priority,
        from,
        to,
        keyword,
      });
      return res; // { data, meta }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// === USERS DEPARTMENT ===
export const fetchUsersDepartment = createAsyncThunk(
  "tickets/fetchUsersDepartment",
  async (_, thunkAPI) => {
    try {
      const res = await getUsersDepartment();
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// === CREATE / UPDATE / DELETE / ACTIONS ===
export const createOrUpdateTicket = createAsyncThunk(
  "tickets/createOrUpdateTicket",
  async (ticket, thunkAPI) => {
    try {
      const res = await saveTicket(ticket);
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const confirmSend = createAsyncThunk(
  "tickets/confirmSend",
  async ({ ticketId }, thunkAPI) => {
    try {
      const res = await confirmSendTicket(ticketId);
      return { ticketId, data: res };
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
      return { ticketId, data: res };
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
      return res;
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
      return { ticketId, data: res };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const complete = createAsyncThunk(
  "tickets/complete",
  async (ticketId, thunkAPI) => {
    try {
      const res = await completeTicket(ticketId);
      return { ticketId, data: res };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const remove = createAsyncThunk(
  "tickets/remove",
  async (ticketId, thunkAPI) => {
    try {
      await deleteTicket(ticketId);
      return ticketId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchTickets = createAsyncThunk(
  "tickets/fetchTickets",
  async ({ ticketId }, thunkAPI) => {
    try {
      const res = await getTicketMetaById(ticketId);
      console.log("Fectch Ticket, ", res);
      return res; // { data, meta }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    my: { data: [], meta: {}, loading: false, error: null },
    received: { data: [], meta: {}, loading: false, error: null },
    sent: { data: [], meta: {}, loading: false, error: null },
    selectedTicket: null,
    users: [],
    actionLoading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    // === MY TICKETS ===
    builder
      .addCase(fetchMyTickets.pending, (state) => {
        state.my.loading = true;
        state.my.error = null;
      })
      .addCase(fetchMyTickets.fulfilled, (state, action) => {
        state.my.loading = false;
        state.my.data = action.payload.data;
        state.my.meta = action.payload.meta;
      })
      .addCase(fetchMyTickets.rejected, (state, action) => {
        state.my.loading = false;
        state.my.error = action.payload.data;
      });
    builder
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.selectedTicket = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // === RECEIVED ===
    builder
      .addCase(fetchReceivedTickets.pending, (state) => {
        state.received.loading = true;
        state.received.error = null;
      })
      .addCase(fetchReceivedTickets.fulfilled, (state, action) => {
        state.received.loading = false;
        state.received.data = action.payload.data;
        state.received.meta = action.payload.meta;
      })
      .addCase(fetchReceivedTickets.rejected, (state, action) => {
        state.received.loading = false;
        state.received.error = action.payload.data;
      });

    // === SENT ===
    builder
      .addCase(fetchSentTickets.pending, (state) => {
        state.sent.loading = true;
        state.sent.error = null;
      })
      .addCase(fetchSentTickets.fulfilled, (state, action) => {
        state.sent.loading = false;
        state.sent.data = action.payload.data;
        state.sent.meta = action.payload.meta;
        console.log(action.payload.meta);
      })
      .addCase(fetchSentTickets.rejected, (state, action) => {
        state.sent.loading = false;
        state.sent.error = action.payload.data;
      });

    // === USERS ===
    builder.addCase(fetchUsersDepartment.fulfilled, (state, action) => {
      state.users = action.payload.data;
    });

    // === CREATE / UPDATE ===
    builder
      .addCase(createOrUpdateTicket.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(createOrUpdateTicket.fulfilled, (state, action) => {
        state.actionLoading = false;
        const newTicket = action.payload.data;
        if (!newTicket || !newTicket.id) return;

        // cập nhật trong danh sách my tickets
        const index = state.my.data.findIndex((t) => t.id === newTicket.id);
        if (index !== -1) {
          state.my.data[index] = { ...state.my.data[index], ...newTicket };
        } else {
          state.my.data.unshift(newTicket);
        }
      })
      .addCase(createOrUpdateTicket.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload.data;
      });

    // === DELETE ===
    builder.addCase(remove.fulfilled, (state, action) => {
      const id = action.payload.data;
      state.my.data = state.my.data.filter((t) => t.id !== id);
      state.received.data = state.received.data.filter((t) => t.id !== id);
      state.sent.data = state.sent.data.filter((t) => t.id !== id);
    });
  },
});

export default ticketSlice.reducer;
