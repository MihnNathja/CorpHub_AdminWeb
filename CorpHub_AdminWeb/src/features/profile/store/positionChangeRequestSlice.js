import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createRequest,
  getRequestsByEmployee,
} from "../../profile/services/positionChangeRequestApi";

export const createPositionChangeRequest = createAsyncThunk(
  "positionChange/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await createRequest(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchPositionChangeRequestsByEmployee = createAsyncThunk(
  "positionChange/byEmployee",
  async (employeeId, { rejectWithValue }) => {
    try {
      const res = await getRequestsByEmployee(employeeId);
      console.log("position request", res);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const positionChangeRequestSlice = createSlice({
  name: "positionChangeRequest",
  initialState: {
    items: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPositionChangeRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPositionChangeRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(createPositionChangeRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPositionChangeRequestsByEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPositionChangeRequestsByEmployee.fulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(
        fetchPositionChangeRequestsByEmployee.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default positionChangeRequestSlice.reducer;
