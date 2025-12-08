import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  create,
  getMyReq,
  remove,
  approveOrReject,
  getAllMyApprovals,
} from "../service/absenceRequestApi";
import {
  uploadTemp,
  deleteTemp,
  deleteAttachment,
  replaceAttachment,
  downloadAttachment,
} from "../service/absenceAttachmentApi";

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
      console.log(res);
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
      const res = await uploadTemp(file);
      console.log(res);
      return res; // expected { objectKey, url }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete temp file (before submit)
export const deleteTempAttachment = createAsyncThunk(
  "absenceRequest/deleteTempAttachment",
  async (objectKey, { rejectWithValue }) => {
    try {
      console.log("deleteTemp ", objectKey);
      const res = await deleteTemp(objectKey);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete attachment by requestId (after submit)
export const deleteAbsenceAttachment = createAsyncThunk(
  "absenceRequest/deleteAttachment",
  async (requestId, { rejectWithValue }) => {
    try {
      const res = await deleteAttachment(requestId);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Replace attachment by requestId (after submit)
export const replaceAbsenceAttachment = createAsyncThunk(
  "absenceRequest/replaceAttachment",
  async ({ requestId, newFile }, { rejectWithValue }) => {
    try {
      const res = await replaceAttachment(requestId, newFile);
      return res; // expected { objectKey, url }
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
    draftAttachment: null, // { objectKey, url, fileName }
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
    // Upload temp file
    builder.addCase(uploadAbsenceProof.pending, (state) => {
      state.uploading = true;
    });
    builder.addCase(uploadAbsenceProof.fulfilled, (state, action) => {
      state.uploading = false;
      const payload = action.payload?.data || action.payload || {};
      // Backend AttachmentUploadResponse returns { fileKey, fileUrl }
      state.draftAttachment = {
        objectKey: payload.objectKey || payload.fileKey || null,
        url: payload.url || payload.fileUrl || null,
        fileName: payload.fileName || payload.filename || null,
      };
    });
    builder.addCase(uploadAbsenceProof.rejected, (state, action) => {
      state.uploading = false;
    });

    // Delete temp file (before submit)
    builder.addCase(deleteTempAttachment.pending, (state) => {
      state.uploading = true;
    });
    builder.addCase(deleteTempAttachment.fulfilled, (state, action) => {
      state.uploading = false;
      state.draftAttachment = null;
    });
    builder.addCase(deleteTempAttachment.rejected, (state, action) => {
      state.uploading = false;
    });

    // Delete attachment (after submit)
    builder.addCase(deleteAbsenceAttachment.pending, (state) => {
      state.uploading = true;
    });
    builder.addCase(deleteAbsenceAttachment.fulfilled, (state, action) => {
      state.uploading = false;
      state.draftAttachment = null;
    });
    builder.addCase(deleteAbsenceAttachment.rejected, (state, action) => {
      state.uploading = false;
    });

    // Replace attachment (after submit)
    builder.addCase(replaceAbsenceAttachment.pending, (state) => {
      state.uploading = true;
    });
    builder.addCase(replaceAbsenceAttachment.fulfilled, (state, action) => {
      state.uploading = false;
      const payload = action.payload?.data || action.payload || {};
      state.draftAttachment = {
        objectKey: payload.objectKey || null,
        url: payload.url || null,
        fileName: payload.fileName || null,
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
