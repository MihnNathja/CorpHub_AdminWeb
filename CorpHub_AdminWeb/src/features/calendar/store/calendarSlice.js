import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createMeeting, getMeetings } from "../services/calendarApi";

export const fetchMeetings = createAsyncThunk(
    "meetings/fetchMeetings",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getMeetings();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const createNewMeeting = createAsyncThunk(
    "meetings/createMeeting",
    async (meeting, { rejectWithValue }) => {
        try {
            const res = await createMeeting(meeting);
            return res?.data;
        }
        catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
)

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
            const idx = state.meetings.findIndex((e) => e.id === action.payload.id);
            if (idx !== -1) {
                state.meetings[idx] = { ...state.meetings[idx], ...action.payload };
            }
        },

        removeEvent: (state, action) => {
            state.meetings = state.meetings.filter(e => e.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            // FETCH
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

            // CREATE
            .addCase(createNewMeeting.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNewMeeting.fulfilled, (state, action) => {
                state.loading = false;
                const created = action.payload;
                if (!created?.id) return;
                const idx = state.meetings.findIndex((m) => m.id === created.id);
                if (idx === -1) state.meetings.push(created);
                else state.meetings[idx] = created;
            })
            .addCase(createNewMeeting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error?.message;
            });
    }
});

export const { addEvent, updateEvent, removeEvent } = eventSlice.actions;
export default eventSlice.reducer;
