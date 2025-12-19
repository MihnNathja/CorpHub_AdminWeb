import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createDepartmentApi,
  deleteDepartmentApi,
  fetchDepartmentsWithUsers,
  getAllDepartments,
  moveDepartmentApi,
  setManagerApi,
  updateDepartmentApi,
} from "../services/departmentApi";

// =============== Async thunks ===============

export const fetchDepartments = createAsyncThunk(
  "department/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllDepartments();
      // Assume API returns ApiResponse { data: [...], message, status }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const loadDepartmentsWithUsers = createAsyncThunk(
  "department/loadWithUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchDepartmentsWithUsers();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createDepartment = createAsyncThunk(
  "department/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createDepartmentApi(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateDepartment = createAsyncThunk(
  "department/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateDepartmentApi(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  "department/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteDepartmentApi(id);
      return id; // only return id to filter the local list
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const setManager = createAsyncThunk(
  "department/setManager",
  async ({ departmentId, managerId }, { rejectWithValue }) => {
    try {
      const res = await setManagerApi(departmentId, managerId);
      console.log(res);
      return res.data; // API returns an updated DepartmentDetailDto
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const moveDepartment = createAsyncThunk(
  "department/move",
  async ({ dragId, newParentId }, { rejectWithValue }) => {
    try {
      console.log("move");
      const res = await moveDepartmentApi(dragId, newParentId);
      console.log("move ", res);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// =============== Slice ===============

const departmentSlice = createSlice({
  name: "department",
  initialState: {
    departments: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetDepartments: (state) => {
      state.departments = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== Fetch =====
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload || [];
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== Load with users =====
      .addCase(loadDepartmentsWithUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadDepartmentsWithUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload || [];
      })
      .addCase(loadDepartmentsWithUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== Create =====
      .addCase(createDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments.push(action.payload);
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== Update =====
      .addCase(updateDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.departments.findIndex(
          (d) => d.id === action.payload.id
        );
        if (idx >= 0) state.departments[idx] = action.payload;
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== Delete =====
      .addCase(deleteDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = state.departments.filter(
          (d) => d.id !== action.payload
        );
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }) // ===== Set Manager =====
      .addCase(setManager.pending, (state) => {
        state.loading = true;
      })
      .addCase(setManager.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        console.log("Updated: ", updated);

        // Find the department that was just updated
        const idx = state.departments.findIndex((d) => d.id === updated.id);
        if (idx >= 0) {
          state.departments[idx] = updated; // refresh manager details
        }
      })
      .addCase(setManager.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(moveDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(moveDepartment.fulfilled, (state, action) => {
        state.loading = false;
        // Do not update locally because the tree changes; reload in the hook
      })
      .addCase(moveDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetDepartments } = departmentSlice.actions;
export default departmentSlice.reducer;
