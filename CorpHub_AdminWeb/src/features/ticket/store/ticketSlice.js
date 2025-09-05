import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { assignTicket, getDepartmentTickets, getDepartmentTicketsSent, getUsersDepartment } from "../services/ticketApi";


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
  async () => {
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
  async ({ ticketId }) => {
    // const res = await api.put(`/tickets/${ticketId}/confirm`);
    // return res.data;
  }
);

export const assign = createAsyncThunk(
  "tickets/assignTicket",
  async ({ ticketId, userId }, { dispatch }) => {
    try {
      const res = await assignTicket(ticketId, userId);
      // refresh lại danh sách tickets
      dispatch(fetchDepartmentTickets());
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
        state.loading = true;
        state.error = null;
      })
      .addCase(assign.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(assign.rejected, (state, action) => {
        state.loading = false;
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
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmSend.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(confirmSend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setStatusFilter, setPage } = ticketSlice.actions;
export default ticketSlice.reducer;
