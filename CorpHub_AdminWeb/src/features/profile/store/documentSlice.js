// src/features/document/documentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  checkDocumentRelations,
  deleteDocument,
  downloadEmployeeDocument,
  getDocumentTypes,
  getMyDocuments,
  uploadEmployeeDocuments,
} from "../services/documentApi";
import { showError, showSuccess } from "../../../utils/toastUtils";

export const fetchDocumentTypes = createAsyncThunk(
  "document/fetchTypes",
  async () => {
    return await getDocumentTypes();
  }
);

export const fetchMyDocuments = createAsyncThunk(
  "document/fetchMyDocuments",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getMyDocuments();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching documents");
    }
  }
);

export const uploadDocumentsAsync = createAsyncThunk(
  "document/uploadDocuments",
  async (formData, { rejectWithValue }) => {
    try {
      const documentIds = await uploadEmployeeDocuments(formData);
      showSuccess("Upload successfully");
      console.log("Upload API result: ", documentIds);
      return documentIds;
    } catch (err) {
      showError("Upload failed");
      return rejectWithValue(err.response?.data || "Upload failed");
    }
  }
);

export const downloadDocumentAsync = createAsyncThunk(
  "document/downloadDocument",
  async (documentId, { rejectWithValue }) => {
    try {
      const res = await downloadEmployeeDocument(documentId);

      // Tạo link tải file
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const contentDisposition = res.headers["content-disposition"];
      let filename = "document";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) filename = decodeURIComponent(match[1]);
      }

      // Tự động tải xuống
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);

      return { success: true, filename };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Unable to download document."
      );
    }
  }
);

export const checkDocumentRelationsAsync = createAsyncThunk(
  "document/checkRelations",
  async (id, { rejectWithValue }) => {
    try {
      const data = await checkDocumentRelations(id);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Document validation failed"
      );
    }
  }
);

export const deleteDocumentAsync = createAsyncThunk(
  "document/deleteDocument",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteDocument(id);
      showSuccess("Document deleted successfully");
      return id; // trả về id để filter khỏi state
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Unable to delete the document. It may be in use.";
      showError(msg);
      return rejectWithValue(msg);
    }
  }
);

const documentSlice = createSlice({
  name: "document",
  initialState: {
    items: [],
    types: [],
    documentIds: [],
    loading: false,
    uploading: false,
    uploadSuccess: false,
    downloading: false,
    downloadSuccess: false,
    checking: false,
    deleting: false,
    relationInfo: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocumentTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDocumentTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.types = action.payload;
      })
      .addCase(fetchDocumentTypes.rejected, (state) => {
        state.loading = false;
      })
      // Upload Document
      .addCase(uploadDocumentsAsync.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadDocumentsAsync.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadSuccess = true;
        state.documentIds = action.payload;
      })
      .addCase(uploadDocumentsAsync.rejected, (state, action) => {
        state.uploading = false;
        //state.error = action.payload;
      })
      // Download Document
      .addCase(downloadDocumentAsync.pending, (state) => {
        state.downloading = true;
        state.downloadSuccess = false;
        state.error = null;
      })
      .addCase(downloadDocumentAsync.fulfilled, (state) => {
        state.downloading = false;
        state.downloadSuccess = true;
      })
      .addCase(downloadDocumentAsync.rejected, (state, action) => {
        state.downloading = false;
        state.error = action.payload;
        state.downloadSuccess = false;
        // showError("Không thể tải tài liệu."); // optional
      })
      // Fetch My Document
      .addCase(fetchMyDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔹 Check Relations
      .addCase(checkDocumentRelationsAsync.pending, (state) => {
        state.checking = true;
        state.relationInfo = null;
      })
      .addCase(checkDocumentRelationsAsync.fulfilled, (state, action) => {
        state.checking = false;
        state.relationInfo = action.payload;
      })
      .addCase(checkDocumentRelationsAsync.rejected, (state, action) => {
        state.checking = false;
        state.error = action.payload;
      })

      // 🔹 Delete Document
      .addCase(deleteDocumentAsync.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteDocumentAsync.fulfilled, (state, action) => {
        state.deleting = false;
        // Xóa khỏi danh sách hiện tại
        state.items = state.items.filter((d) => d.id !== action.payload);
      })
      .addCase(deleteDocumentAsync.rejected, (state) => {
        state.deleting = false;
      });
  },
});

export default documentSlice.reducer;
