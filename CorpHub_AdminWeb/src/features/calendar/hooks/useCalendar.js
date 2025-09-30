import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toLocal } from "../../global/utils/timezone";
import {
  fetchMeetings,
  updateEvent,
  createOrUpdateMeeting,
  removeMeeting,
} from "../store/calendarSlice";
import { startOfMonth, endOfMonth } from "date-fns";
import { showError, showSuccess } from "../../../utils/toastUtils";

export const useCalendar = (selectedEmails = []) => {
  const dispatch = useDispatch();
  const { meetings, loading, error } = useSelector((state) => state.events);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slotInfo, setSlotInfo] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const startTime = startOfMonth(selectedDate);
    const endTime = endOfMonth(selectedDate);

    dispatch(
      fetchMeetings({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        emails: selectedEmails,
      })
    );
  }, [dispatch, selectedDate, selectedEmails]);

  const handleAddUpdateEvent = async (eventData) => {
    const payload = {
      id: eventData.id ?? null,
      title: eventData.title,
      subject: eventData.subject,
      description: eventData.description,
      location: eventData.location,
      onlineLink: eventData.onlineLink,
      to: eventData.to,
      start: toLocal(eventData.start).toISOString(),
      end: toLocal(eventData.end).toISOString(),
    };

    const action = await dispatch(createOrUpdateMeeting(payload));
    if (createOrUpdateMeeting.fulfilled.match(action)) {
      dispatch(updateEvent(action.payload));
      setIsModalOpen(false);
      setSlotInfo(null);
      showSuccess("Create meeting successfully");
    } else {
      showError("Create meeting failed");
      console.error("Create meeting failed:", action.payload || action.error);
    }
  };

  const handleDeleteEvent = async (id) => {
    const action = await dispatch(removeMeeting(id));
    if (!removeMeeting.fulfilled.match(action)) {
      showError("Delete failed");
      console.error("Delete failed", action.payload || action.error);
    }
    showSuccess("Delete successfully");
  };

  return {
    meetings,
    loading,
    error,
    isModalOpen,
    setIsModalOpen,
    slotInfo,
    setSlotInfo,
    selectedEvent,
    setSelectedEvent,
    selectedDate,
    setSelectedDate,
    handleAddUpdateEvent,
    handleDeleteEvent,
  };
};
