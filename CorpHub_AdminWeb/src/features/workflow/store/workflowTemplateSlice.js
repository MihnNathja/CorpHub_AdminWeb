import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { create, getAll, remove, update } from "../services/workflowTemplateApi";

/* ===========================
   ASYNC THUNKS
=========================== */

// Lấy All
export const fetchWorkflowTemplates = createAsyncThunk(
    "workflowTemplate/fetchAll",
    async (params, { rejectWithValue }) => {
        try {
            const res = await getAll(params);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Tạo mới
export const createWorkflowTemplate = createAsyncThunk(
    "workflowTemplate/create",
    async (data, { rejectWithValue }) => {
        try {
            const res = await create(data);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Cập nhật
export const updateWorkflowTemplate = createAsyncThunk(
    "workflowTemplate/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await update(id, data);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Xóa
export const deleteWorkflowTemplate = createAsyncThunk(
    "workflowTemplate/delete",
    async (id, { rejectWithValue }) => {
        try {
            await remove(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* ===========================
   SLICE
=========================== */

const workflowTemplateSlice = createSlice({
    name: "workflowTemplate",
    initialState: {
        items: [],
        meta: {},
        loading: false,
        error: null,
    },
    reducers: {
        resetWorkflowTemplateState: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        /* --- FETCH ALL --- */
        builder
            .addCase(fetchWorkflowTemplates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWorkflowTemplates.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(fetchWorkflowTemplates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- CREATE --- */
        builder
            .addCase(createWorkflowTemplate.pending, (state) => {
                state.loading = true;
            })
            .addCase(createWorkflowTemplate.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload.data);
            })
            .addCase(createWorkflowTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- UPDATE --- */
        builder
            .addCase(updateWorkflowTemplate.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.items.findIndex((i) => i.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(updateWorkflowTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- DELETE --- */
        builder
            .addCase(deleteWorkflowTemplate.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((i) => i.id !== action.payload.data);
            })
            .addCase(deleteWorkflowTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetWorkflowTemplateState } = workflowTemplateSlice.actions;

export default workflowTemplateSlice.reducer;
