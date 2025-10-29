// src/store/assetSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getAssets,
    getCategories,
    createAsset as createAssetApi,
    updateAsset as updateAssetApi,
    deleteAsset as deleteAssetApi,
} from "../services/assetApi";

// ===== Async Thunks =====

// Lấy danh sách categories
export const fetchCategories = createAsyncThunk(
    "assets/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getCategories();
            return res; // { data: [...] }
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Lấy danh sách assets (phân trang)
export const fetchAssets = createAsyncThunk(
    "assets/fetchAssets",
    async (params, { rejectWithValue }) => {
        try {
            const res = await getAssets(params);
            return res;
        } catch (err) {
            console.error("❌ fetchAssets error:", err);
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Tạo asset
export const createAsset = createAsyncThunk(
    "assets/createAsset",
    async (assetData, { rejectWithValue }) => {
        try {
            const res = await createAssetApi(assetData);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Cập nhật asset
export const updateAsset = createAsyncThunk(
    "assets/updateAsset",
    async (assetData, { rejectWithValue }) => {
        try {
            const res = await updateAssetApi(assetData);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Xóa asset
export const deleteAsset = createAsyncThunk(
    "assets/deleteAsset",
    async (assetId, { rejectWithValue }) => {
        try {
            const res = await deleteAssetApi(assetId);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ===== Slice =====
const assetSlice = createSlice({
    name: "assets",
    initialState: {
        assets: [],
        meta: {}, // thông tin phân trang
        categories: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchCategories
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.data || action.payload || [];
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetchAssets
            .addCase(fetchAssets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssets.fulfilled, (state, action) => {
                state.loading = false;
                state.assets = action.payload.data || [];
                state.meta = action.payload.meta || {};
            })
            .addCase(fetchAssets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // createAsset
            .addCase(createAsset.pending, (state) => {
                state.loading = true;
            })
            .addCase(createAsset.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.data) state.assets.unshift(action.payload.data);
            })
            .addCase(createAsset.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // updateAsset
            .addCase(updateAsset.fulfilled, (state, action) => {
                const updated = action.payload?.data;
                if (updated) {
                    const index = state.assets.findIndex((a) => a.id === updated.id);
                    if (index !== -1) state.assets[index] = updated;
                }
            })

            // deleteAsset
            .addCase(deleteAsset.fulfilled, (state, action) => {
                const deletedId = action.meta.arg;
                state.assets = state.assets.filter((a) => a.id !== deletedId);
            });
    },
});

export default assetSlice.reducer;
