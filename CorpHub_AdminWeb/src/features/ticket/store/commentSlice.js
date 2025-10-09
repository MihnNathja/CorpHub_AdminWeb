import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTicketComments, saveTicketComment } from "../services/commentApi";

// === LOAD COMMENTS ===
export const fetchTicketComments = createAsyncThunk(
  "comments/fetchTicketComments",
  async (ticketId, thunkAPI) => {
    try {
      const res = await getTicketComments(ticketId);
      //console.log("Ticket's comments:", res);
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// === CREATE COMMENT ===
export const createTicketComment = createAsyncThunk(
  "comments/createTicketComment",
  async ({ ticketId, commentText, parentId = null }, thunkAPI) => {
    try {
      const res = await saveTicketComment({ ticketId, commentText, parentId });
      //console.log("Save ticket comment:", res);
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    commentItems: [],
    commentLoading: false,
    commentError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // === LOAD ===
      .addCase(fetchTicketComments.pending, (state) => {
        state.commentLoading = true;
        state.commentError = null;
      })
      .addCase(fetchTicketComments.fulfilled, (state, action) => {
        state.commentLoading = false;
        state.commentItems = action.payload.data; // toàn bộ list từ server
      })
      .addCase(fetchTicketComments.rejected, (state, action) => {
        state.commentLoading = false;
        state.commentError = action.payload.data;
      })

      // === CREATE ===
      .addCase(createTicketComment.pending, (state) => {
        state.commentLoading = true;
        state.commentError = null;
      })
      .addCase(createTicketComment.fulfilled, (state, action) => {
        state.commentLoading = false;
        // thêm 1 comment mới vào danh sách
        state.commentItems.push(action.payload.data);
      })
      .addCase(createTicketComment.rejected, (state, action) => {
        state.commentLoading = false;
        state.commentError = action.payload.data;
      });
  },
});

export default commentSlice.reducer;
