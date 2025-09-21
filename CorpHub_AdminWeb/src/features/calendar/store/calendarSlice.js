import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMeetings } from "../services/calendarService";

export const fetchMeetings = createAsyncThunk(
    "meetings/fetchMeetings",
    async (thunkAPI) => {
        try {
            const res = await getMeetings();
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);

const eventSlice = createSlice({
    name: "events",
    initialState: {
        meetings: [],
        loading: false,
        error: null,
    },
    reducers: {
        addEvent: (state, action) => {
            state.meetings.push(action.payload);
        },
        updateEvent: (state, action) => {
            const idx = state.meetings.findIndex(e => e.id === action.payload.id);
            if (idx !== -1) state.meetings[idx] = action.payload;
        },
        removeEvent: (state, action) => {
            state.meetings = state.meetings.filter(e => e.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMeetings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMeetings.fulfilled, (state, action) => {
                state.loading = false;
                state.meetings = action.payload;
            })
            .addCase(fetchMeetings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { addEvent, updateEvent, removeEvent } = eventSlice.actions;
export default eventSlice.reducer;
