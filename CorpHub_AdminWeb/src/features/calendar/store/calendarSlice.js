// store/calendarSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFakeEvents } from "../services/calendarService";

export const loadEvents = createAsyncThunk("calendar/loadEvents", async () => {
    const events = await fetchFakeEvents();
    return events;
});

const calendarSlice = createSlice({
    name: "calendar",
    initialState: {
        events: [],
        loading: false,
    },
    reducers: {
        addEvent: (state, action) => {
            state.events.push(action.payload);
        },
        updateEvent: (state, action) => {
            const index = state.events.findIndex((e) => e.id === action.payload.id);
            if (index !== -1) {
                state.events[index] = action.payload;
            }
        },
        deleteEvent: (state, action) => {
            state.events = state.events.filter((e) => e.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadEvents.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(loadEvents.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { addEvent, updateEvent, deleteEvent } = calendarSlice.actions;
export default calendarSlice.reducer;
