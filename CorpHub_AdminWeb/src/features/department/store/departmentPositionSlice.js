import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createPositionApi,
  deletePositionApi,
  getPositionsApi,
  reorderApi,
  updatePositionApi,
} from "../services/departmentApi";

export const fetchPositions = createAsyncThunk(
  "positions/fetch",
  async (departmentId) => {
    const res = await getPositionsApi(departmentId);
    console.log("Positions from API: ", res.data);
    return res.data;
  }
);

export const createPosition = createAsyncThunk(
  "positions/create",
  async ({ departmentId, payload }) => {
    console.log("Position Slice");
    console.log(departmentId);
    console.log(payload);
    const res = await createPositionApi(departmentId, payload);
    return res.data;
  }
);

export const updatePosition = createAsyncThunk(
  "positions/update",
  async ({ id, payload }) => {
    const res = await updatePositionApi(id, payload);
    return res.data;
  }
);

export const deletePosition = createAsyncThunk(
  "positions/delete",
  async (id) => {
    await deletePositionApi(id);
    return id;
  }
);

export const reorderPositions = createAsyncThunk(
  "positions/reorder",
  async ({ departmentId, orderedIds }) => {
    await reorderApi(departmentId, orderedIds);
    return orderedIds;
  }
);

const departmentPositionSlice = createSlice({
  name: "positions",
  initialState: { list: [], loading: false },
  reducers: {
    setLocalReorder(state, action) {
      state.list = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      /// FETCH
      .addCase(fetchPositions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPositions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPositions.rejected, (state) => {
        state.loading = false;
      })

      /// CREATE
      .addCase(createPosition.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPosition.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createPosition.rejected, (state) => {
        state.loading = false;
      })

      /// UPDATE
      .addCase(updatePosition.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePosition.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updatePosition.rejected, (state) => {
        state.loading = false;
      })

      /// DELETE
      .addCase(deletePosition.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePosition.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((p) => p.id !== action.payload);
      })
      .addCase(deletePosition.rejected, (state) => {
        state.loading = false;
      })

      /// REORDER
      .addCase(reorderPositions.pending, (state) => {
        state.loading = true;
      })
      .addCase(reorderPositions.fulfilled, (state, action) => {
        state.loading = false;

        const orderedIds = action.payload;

        // Reorder based on the provided ID list
        state.list = orderedIds.map((id, index) => {
          const pos = state.list.find((p) => p.id === id);
          if (pos) {
            pos.levelOrder = index; // update levelOrder for the UI
          }
          return pos;
        });
      })
      .addCase(reorderPositions.rejected, (state) => {
        state.loading = false;
      });
  },
});
export const { setLocalReorder } = departmentPositionSlice.actions;

export default departmentPositionSlice.reducer;
