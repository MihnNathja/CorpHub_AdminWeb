// src/redux/slices/attachmentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadPositionChangeAttachment } from "../services/positionChangeAttachmentApi";

export const uploadAttachment = createAsyncThunk(
  "attachments/upload",
  async ({ file, uploadedById }, thunkAPI) => {
    try {
      return await uploadPositionChangeAttachment(file, uploadedById);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err);
    }
  }
);

const attachmentSlice = createSlice({
  name: "attachments",
  initialState: {
    items: [],
    uploading: false,
  },
  reducers: {
    removeAttachment(state, action) {
      state.items = state.items.filter(
        (a) => a.fileKey !== action.payload // fileKey làm ID xoá
      );
    },
    clearAttachments(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadAttachment.pending, (state) => {
        state.uploading = true;
      })
      .addCase(uploadAttachment.fulfilled, (state, action) => {
        state.uploading = false;
        state.items.push(action.payload);
      })
      .addCase(uploadAttachment.rejected, (state) => {
        state.uploading = false;
      });
  },
});

export const { removeAttachment, clearAttachments } = attachmentSlice.actions;
export default attachmentSlice.reducer;
