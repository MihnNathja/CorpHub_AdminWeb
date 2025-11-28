import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { create, getByTemplateId, remove, update } from "../services/workflowStepApi";

/* ===========================
   ASYNC THUNKS
=========================== */
// Lấy by Id
export const fetchWorkflowStepById = createAsyncThunk(
    "workflowStep/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await getByTemplateId(id);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Tạo mới
export const createWorkflowStep = createAsyncThunk(
    "workflowStep/create",
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
export const updateWorkflowStep = createAsyncThunk(
    "workflowStep/update",
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
export const deleteWorkflowStep = createAsyncThunk(
    "workflowStep/delete",
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

const workflowStepSlice = createSlice({
    name: "workflowStep",
    initialState: {
        items: [],
        meta: {},
        loading: false,
        error: null,
    },
    reducers: {
        resetWorkflowStepState: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {

        /* --- FETCH BY ID --- */
        builder
            .addCase(fetchWorkflowStepById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWorkflowStepById.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
            })
            .addCase(fetchWorkflowStepById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- CREATE --- */
        builder
            .addCase(createWorkflowStep.pending, (state) => {
                state.loading = true;
            })
            .addCase(createWorkflowStep.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload.data);
            })
            .addCase(createWorkflowStep.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- UPDATE --- */
        builder
            .addCase(updateWorkflowStep.fulfilled, (state, action) => {
                state.loading = false;

                const idx = state.items.findIndex(
                    (i) => i.id === action.payload.meta.updatedId
                );

                if (idx !== -1) {
                    state.items[idx] = action.payload.data;
                }

                // 🎯 SẮP XẾP LẠI DANH SÁCH STEP
                state.items.sort((a, b) => a.stepOrder - b.stepOrder);
            })

            .addCase(updateWorkflowStep.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* --- DELETE --- */
        builder
            .addCase(deleteWorkflowStep.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((i) => i.id !== action.payload.data);
            })
            .addCase(deleteWorkflowStep.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetWorkflowStepState } = workflowStepSlice.actions;

export default workflowStepSlice.reducer;
