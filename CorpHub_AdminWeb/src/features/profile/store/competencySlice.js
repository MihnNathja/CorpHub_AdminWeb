import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createCompetency,
  deleteCompetency,
  getCompetencyTypes,
  getMyCompetencies,
  updateCompetency,
} from "../services/competencyApi";

export const fetchMyCompetencies = createAsyncThunk(
  "competency/fetchMyCompetencies",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getMyCompetencies();
      console.log("Kết quả của API Competency:", data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching documents");
    }
  }
);

export const fetchCompetencyTypes = createAsyncThunk(
  "competency/fetchCompetencyTypes",
  async () => {
    return await getCompetencyTypes();
  }
);

export const addCompetency = createAsyncThunk(
  "competency/addCompetency",
  async ({ competency }, { rejectWithValue }) => {
    try {
      const res = await createCompetency(competency);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const changeCompetency = createAsyncThunk(
  "competency/changeCompetency",
  async ({ competency }, { rejectWithValue }) => {
    try {
      const res = await updateCompetency(competency);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeCompetency = createAsyncThunk(
  "competency/removeCompetency",
  async ({ competencyId, isDeletedFile }, { rejectWithValue }) => {
    try {
      const res = await deleteCompetency(competencyId, isDeletedFile);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const competencySlice = createSlice({
  name: "competency",
  initialState: {
    items: [],
    types: [],
    loading: false,
    error: false,
    success: false,
  },
  reducers: {
    resetCompetencyState: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompetencyTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompetencyTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.types = action.payload;
      })
      .addCase(fetchCompetencyTypes.rejected, (state) => {
        state.loading = false;
      })

      .addCase(fetchMyCompetencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCompetencies.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyCompetencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Add Competency ---
      .addCase(addCompetency.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(addCompetency.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.items.push(action.payload);
      })
      .addCase(addCompetency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // === UPDATE COMPETENCY ===
      .addCase(changeCompetency.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(changeCompetency.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // cập nhật item trong danh sách
        const updated = action.payload;
        const idx = state.items.findIndex((i) => i.id === updated.id);
        if (idx !== -1) {
          state.items[idx] = updated;
        }
      })
      .addCase(changeCompetency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // === REMOVE COMPETENCY ===
      .addCase(removeCompetency.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCompetency.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (item) => item.id !== action.meta.arg.competencyId
        );
      })
      .addCase(removeCompetency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { resetCompetencyState } = competencySlice.actions;
export default competencySlice.reducer;
