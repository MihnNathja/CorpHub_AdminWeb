import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMyCompetencies } from "../services/competencyApi";

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

const competencySlice = createSlice({
  name: "competency",
  initialState: {
    items: [],
    types: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //   .addCase(fetchDocumentTypes.pending, (state) => {
      //     state.loading = true;
      //   })
      //   .addCase(fetchDocumentTypes.fulfilled, (state, action) => {
      //     state.loading = false;
      //     state.types = action.payload;
      //   })
      //   .addCase(fetchDocumentTypes.rejected, (state) => {
      //     state.loading = false;
      //   })
      // Upload Document
      //   .addCase(uploadDocumentsAsync.pending, (state) => {
      //     state.uploading = true;
      //     state.error = null;
      //   })
      //   .addCase(uploadDocumentsAsync.fulfilled, (state) => {
      //     state.uploading = false;
      //     state.uploadSuccess = true;
      //   })
      //   .addCase(uploadDocumentsAsync.rejected, (state, action) => {
      //     state.uploading = false;
      //state.error = action.payload;
      //   })
      // Download Document
      //   .addCase(downloadDocumentAsync.pending, (state) => {
      //     state.downloading = true;
      //     state.downloadSuccess = false;
      //     state.error = null;
      //   })
      //   .addCase(downloadDocumentAsync.fulfilled, (state) => {
      //     state.downloading = false;
      //     state.downloadSuccess = true;
      //   })
      //   .addCase(downloadDocumentAsync.rejected, (state, action) => {
      //     state.downloading = false;
      //     state.error = action.payload;
      //     state.downloadSuccess = false;
      //     // showError("Không thể tải tài liệu."); // optional
      //   })
      // Fetch My Document
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
      });
  },
});

export default competencySlice.reducer;
