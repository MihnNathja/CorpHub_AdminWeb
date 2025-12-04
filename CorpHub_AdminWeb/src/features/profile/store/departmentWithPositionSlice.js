// src/redux/slices/departmentPositionSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDepartmentsWithPositions } from "../services/positionApi";

export const fetchDepartmentsWithPositions = createAsyncThunk(
  "departmentPosition/fetch",
  async (_, thunkAPI) => {
    try {
      return await getDepartmentsWithPositions();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const departmentPositionSlice = createSlice({
  name: "departmentPosition",
  initialState: {
    list: [], // [{ departmentId, departmentName, positions: [...] }]
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartmentsWithPositions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDepartmentsWithPositions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDepartmentsWithPositions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default departmentPositionSlice.reducer;
