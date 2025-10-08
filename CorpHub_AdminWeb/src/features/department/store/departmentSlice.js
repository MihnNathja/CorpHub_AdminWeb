import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllDepartments } from "../services/departmentApi";

// Async thunk gọi API
export const fetchDepartments = createAsyncThunk(
    "department/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllDepartments();
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

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
            .addCase(fetchDepartments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.loading = false;
                state.departments = action.payload.data;
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch departments";
            });
    },
});

export const { resetDepartments } = departmentSlice.actions;

export default departmentSlice.reducer;
