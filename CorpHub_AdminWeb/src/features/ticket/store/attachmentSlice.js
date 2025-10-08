import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAttachments,
  uploadAttachments,
  deleteAttachment,
  downloadAttachment,
} from "../services/attachmentApi";

// === LOAD ATTACHMENTS ===
export const fetchTicketAttachments = createAsyncThunk(
  "attachments/fetchTicketAttachments",
  async (ticketId, thunkAPI) => {
    try {
      console.log(ticketId);
      const res = await fetchAttachments(ticketId);
      console.log("Load attachments", res.data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// === UPLOAD ATTACHMENTS ===
export const addTicketAttachments = createAsyncThunk(
  "attachments/addTicketAttachments",
  async ({ ticketId, files }, thunkAPI) => {
    try {
      const res = await uploadAttachments(ticketId, files);

      return res.data; // trả về list file vừa upload
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// === DELETE ATTACHMENT ===
export const removeTicketAttachment = createAsyncThunk(
  "attachments/removeTicketAttachment",
  async (attachmentId, thunkAPI) => {
    try {
      await deleteAttachment(attachmentId);
      return attachmentId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// === DOWNLOAD ATTACHMENT ===
export const downloadTicketAttachment = createAsyncThunk(
  "attachments/downloadTicketAttachment",
  async (attachmentId, thunkAPI) => {
    try {
      const res = await downloadAttachment(attachmentId); // axios.get(..., { responseType: "blob" })

      // Lấy tên file từ header
      const contentDisposition = res.headers?.["content-disposition"];
      let fileName = "attachment";
      if (contentDisposition) {
        const utf8Match = contentDisposition.match(/filename\*=UTF-8''(.+)/);
        if (utf8Match && utf8Match[1]) {
          fileName = decodeURIComponent(utf8Match[1]);
        } else {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match && match[1]) {
            fileName = match[1];
          }
        }
      }

      // 👇 xử lý download luôn ở đây
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);

      // Chỉ trả về metadata để lưu vào Redux (không dispatch Blob)
      return { attachmentId, fileName };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const attachmentSlice = createSlice({
  name: "attachments",
  initialState: {
    items: [], // danh sách file
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // LOAD
      .addCase(fetchTicketAttachments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketAttachments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
      })
      .addCase(fetchTicketAttachments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data;
      })

      // UPLOAD
      .addCase(addTicketAttachments.fulfilled, (state, action) => {
        state.items = [...state.items, ...action.payload];
      })

      // DELETE
      .addCase(removeTicketAttachment.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a.id !== action.payload);
      });
  },
});

export default attachmentSlice.reducer;
