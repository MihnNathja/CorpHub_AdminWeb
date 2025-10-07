import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deleteMeeting, getMeetings, saveMeeting, confirmAttend, confirmMeeting } from "../services/calendarApi";

export const fetchMeetings = createAsyncThunk(
    "meetings/fetchMeetings",
    async ({ startTime, endTime, emails }, { rejectWithValue }) => {
        try {
            const res = await getMeetings({ startTime, endTime, emails });
            console.log(res.data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const createOrUpdateMeeting = createAsyncThunk(
    "meetings/createOrUpdateMeeting",
    async (meeting, { rejectWithValue }) => {
        try {
            const res = await saveMeeting(meeting);
            return res?.data;
        }
        catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
)

export const removeMeeting = createAsyncThunk(
    "meetings/deleteMeeting",
    async (id, { rejectWithValue }) => {
        try {
            const res = await deleteMeeting(id);
            return res?.data;
        }
        catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
)

export const confirmAttendMeeting = createAsyncThunk(
    "meetings/confirmAttend",
    async ({ id, isAccepted }, { rejectWithValue }) => {
        try {
            const res = await confirmAttend(id, isAccepted);
            console.log(res);
            return res?.data;
        }
        catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
)

export const confirmMeetingReady = createAsyncThunk(
    "meetings/confirmMeeting",
    async (id, { rejectWithValue }) => {
        try {
            const res = await confirmMeeting(id);
            console.log(res);
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

            // CREATE OR UPDATE
            .addCase(createOrUpdateMeeting.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrUpdateMeeting.fulfilled, (state, action) => {
                state.loading = false;
                const created = action.payload;
                if (!created?.id) return;
                const idx = state.meetings.findIndex((m) => m.id === created.id);
                if (idx === -1) state.meetings.push(created);
                else state.meetings[idx] = created;
            })
            .addCase(createOrUpdateMeeting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error?.message;
            })

            // DELETE
            .addCase(removeMeeting.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeMeeting.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.meta.arg; // vì ta truyền id khi gọi removeMeeting(id)
                state.meetings = state.meetings.filter((m) => m.id !== deletedId);
            })

            .addCase(removeMeeting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error?.message;
            })

            // CONFIRM ATTEND
            .addCase(confirmAttendMeeting.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(confirmAttendMeeting.fulfilled, (state, action) => {
                state.loading = false;
                const updatedMeeting = action.payload;
                if (!updatedMeeting?.id) return;
                const idx = state.meetings.findIndex((m) => m.id === updatedMeeting.id);
                if (idx !== -1) {
                    state.meetings[idx] = updatedMeeting;
                }
            })
            .addCase(confirmAttendMeeting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error?.message;
            })

            // CONFIRM MEETING READY
            .addCase(confirmMeetingReady.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(confirmMeetingReady.fulfilled, (state, action) => {
                state.loading = false;
                const updatedMeeting = action.payload;
                if (!updatedMeeting?.id) return;
                const idx = state.meetings.findIndex((m) => m.id === updatedMeeting.id);
                if (idx !== -1) {
                    state.meetings[idx] = updatedMeeting;
                }
            })
            .addCase(confirmMeetingReady.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error?.message;
            });


    }
});

export const { addEvent, updateEvent, removeEvent } = eventSlice.actions;
export default eventSlice.reducer;
