import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAll, markAsRead as markAsReadApi } from "../service/notificationApi";

// Lấy tất cả thông báo của user
export const fetchNotifications = createAsyncThunk(
    "notification/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getAll();
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Đánh dấu thông báo đã đọc
export const markAsRead = createAsyncThunk(
    "notification/markAsRead",
    async (id, { rejectWithValue }) => {
        try {
            await markAsReadApi(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        items: [],
        unreadCount: 0,
        loading: false,
    },
    reducers: {
        addNotification: (state, action) => {
            state.items.unshift(action.payload);
            state.unreadCount++;
        },
        clearAll: (state) => {
            state.items = [];
            state.unreadCount = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
                state.unreadCount = action.payload.data.filter((n) => !n.isRead).length;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const notif = state.items.find((n) => n.id === action.payload);
                if (notif) notif.isRead = 1;
                state.unreadCount = state.items.filter((n) => !n.isRead).length;

            });
    },
});

export const { addNotification, clearAll } = notificationSlice.actions;
export default notificationSlice.reducer;
