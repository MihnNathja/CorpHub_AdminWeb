// src/features/parameters/store/parameterSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchCompetencyLevels,
  fetchCompetencyTypes,
  fetchDocumentTypes,
} from "../parameterService";

// ========== Async Thunks ==========

export const loadParameters = createAsyncThunk(
  "parameters/loadAll",
  async (_, { rejectWithValue }) => {
    try {
      const types = await fetchCompetencyTypes();

      // 🔹 Chuẩn hóa data về dạng UI hiểu
      const mapped = [];

      // Competency Types
      types.forEach((t) => {
        mapped.push({
          id: t.id,
          group: "COMPETENCY_TYPE",
          code: t.code,
          name: t.name,
        });

        // Cấp độ đi kèm (nếu có)
        if (t.levels && t.levels.length > 0) {
          t.levels.forEach((lv) => {
            mapped.push({
              id: lv.id,
              group: "COMPETENCY_LEVEL",
              code: `${t.code}_${lv.name}`.toUpperCase(),
              name: `${lv.name} (${t.name})`,
            });
          });
        }
      });

      // Document Types
      //   docs.forEach((d) => {
      //     mapped.push({
      //       id: d.id,
      //       group: "DOCUMENT_TYPE",
      //       code: d.code,
      //       name: d.name,
      //     });
      //   });

      return mapped;
    } catch (err) {
      console.error("❌ Lỗi load parameters:", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ========== Slice ==========

const parameterSlice = createSlice({
  name: "parameters",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadParameters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadParameters.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadParameters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default parameterSlice.reducer;
