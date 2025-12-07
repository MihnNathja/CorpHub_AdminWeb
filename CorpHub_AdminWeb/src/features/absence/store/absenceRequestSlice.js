import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  create,
  getMyReq,
  remove,
  update,
  approveOrReject,
  getAllMyApprovals,
  uploadProof as uploadProofService,
  deleteAttachment as deleteAttachmentService,
  replaceAttachment as replaceAttachmentService,
} from "../service/absenceRequestApi";

/* ===========================
   ASYNC THUNKS
=========================== */

// Lấy danh sách request tôi tạo
export const fetchMyAbsenceRequests = createAsyncThunk(
  "absenceRequest/fetchMy",
  async (params, { rejectWithValue }) => {
    try {
      const res = await getMyReq(params);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Lấy các request tôi phải duyệt hoặc từng duyệt
export const fetchMyApprovals = createAsyncThunk(
  "absenceRequest/fetchMyApprovals",
  async (params, { rejectWithValue }) => {
    try {
      const res = await getAllMyApprovals(params);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Tạo mới
export const createAbsenceRequest = createAsyncThunk(
  "absenceRequest/create",
  async (data, { rejectWithValue }) => {
    try {
      return await create(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Cập nhật
export const updateAbsenceRequest = createAsyncThunk(
  "absenceRequest/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await update(id, data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Xóa
export const deleteAbsenceRequest = createAsyncThunk(
  "absenceRequest/delete",
  async (id, { rejectWithValue }) => {
    try {
      await remove(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Approve/Reject
export const approveOrRejectRequest = createAsyncThunk(
  "absenceRequest/approveOrReject",
  async ({ instanceId, approve, comment }, { rejectWithValue }) => {
    try {
      return await approveOrReject(instanceId, { approve, comment });
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Upload proof file (store draft attachment in slice)
export const uploadAbsenceProof = createAsyncThunk(
  "absenceRequest/uploadProof",
  async (file, { rejectWithValue }) => {
    try {
      const res = await uploadProofService(file);
      return res; // expected { objectKey (or fileKey), presignedUrl (or fileUrl) }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete attachment by objectKey
export const deleteAbsenceAttachment = createAsyncThunk(
  "absenceRequest/deleteAttachment",
  async (objectKey, { rejectWithValue }) => {
    try {
      await deleteAttachmentService(objectKey);
      return objectKey;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Replace attachment (delete old, upload new)
export const replaceAbsenceAttachment = createAsyncThunk(
  "absenceRequest/replaceAttachment",
  async ({ oldKey, newFile }, { rejectWithValue }) => {
    try {
      const res = await replaceAttachmentService(oldKey, newFile);
      return res; // expected { objectKey, presignedUrl }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===========================
   SLICE
=========================== */

const absenceRequestSlice = createSlice({
  name: "absenceRequest",
  initialState: {
    items: [],
    meta: {},
    loading: false,
    error: null,
    uploading: false,
    draftAttachment: null, // { fileKey, fileUrl, fileName }
  },
  reducers: {
    resetAbsenceRequestState: (state) => {
      state.loading = false;
      state.error = null;
    },
    clearDraftAttachment: (state) => {
      state.draftAttachment = null;
      state.uploading = false;
    },
    setDraftAttachment: (state, action) => {
      state.draftAttachment = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Upload proof file
    builder.addCase(uploadAbsenceProof.pending, (state) => {
      state.uploading = true;
    });
    builder.addCase(uploadAbsenceProof.fulfilled, (state, action) => {
      state.uploading = false;
      const payload = action.payload || {};
      state.draftAttachment = {
        fileKey: payload.objectKey || payload.fileKey || payload.key || null,
        fileUrl: payload.presignedUrl || payload.fileUrl || payload.url || null,
        fileName: payload.fileName || payload.filename || null,
      };
    });
    builder.addCase(uploadAbsenceProof.rejected, (state, action) => {
      state.uploading = false;
    });

    // Delete attachment
    builder.addCase(deleteAbsenceAttachment.pending, (state) => {
      state.uploading = true;
    });
    builder.addCase(deleteAbsenceAttachment.fulfilled, (state, action) => {
      state.uploading = false;
      // Clear draft attachment on successful delete
      state.draftAttachment = null;
    });
    builder.addCase(deleteAbsenceAttachment.rejected, (state, action) => {
      state.uploading = false;
    });

    // Replace attachment
    builder.addCase(replaceAbsenceAttachment.pending, (state) => {
      state.uploading = true;
    });
    builder.addCase(replaceAbsenceAttachment.fulfilled, (state, action) => {
      state.uploading = false;
      const payload = action.payload || {};
      state.draftAttachment = {
        fileKey: payload.objectKey || payload.fileKey || payload.key || null,
        fileUrl: payload.presignedUrl || payload.fileUrl || payload.url || null,
        fileName: payload.fileName || payload.filename || null,
      };
    });
    builder.addCase(replaceAbsenceAttachment.rejected, (state, action) => {
      state.uploading = false;
    });

    /* --- FETCH MY REQUESTS --- */
    builder
      .addCase(fetchMyAbsenceRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyAbsenceRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.meta = action.payload.meta || {};
      })
      .addCase(fetchMyAbsenceRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    /* --- FETCH MY APPROVALS --- */
    builder
      .addCase(fetchMyApprovals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyApprovals.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.meta = action.payload.meta || {};
      })
      .addCase(fetchMyApprovals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    /* --- CREATE --- */
    builder.addCase(createAbsenceRequest.fulfilled, (state, action) => {
      state.items.push(action.payload.data);
    });

    /* --- UPDATE --- */
    builder.addCase(updateAbsenceRequest.fulfilled, (state, action) => {
      const data = action.payload.data;
      const idx = state.items.findIndex((i) => i.id === data.id);
      if (idx !== -1) state.items[idx] = data;
    });

    /* --- DELETE --- */
    builder
      .addCase(deleteAbsenceRequest.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      })
      .addCase(deleteAbsenceRequest.rejected, (state, action) => {
        // Có thể hiện lỗi nếu cần
        state.error = action.payload;
      });

    /* --- APPROVE / REJECT --- */
    builder.addCase(approveOrRejectRequest.fulfilled, (state, action) => {
      const updated = action.payload.data;
      const idx = state.items.findIndex((i) => i.id === updated.id);
      if (idx !== -1) state.items[idx] = updated;
    });
  },
});

export const {
  resetAbsenceRequestState,
  clearDraftAttachment,
  setDraftAttachment,
} = absenceRequestSlice.actions;

export default absenceRequestSlice.reducer;
