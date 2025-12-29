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

  const reloadMeetings = () => {
    const startTime = startOfMonth(selectedDate);
    const endTime = endOfMonth(selectedDate);
    dispatch(
      fetchMeetings({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        emails: selectedEmails,
      })
    );
  };

  useEffect(() => {
    reloadMeetings();
  }, [dispatch, selectedDate, selectedEmails]);

  const handleAddUpdateEvent = async (eventData) => {
    const payload = {
      id: eventData.id || null,
      title: eventData.title,
      subject: eventData.subject,
      description: eventData.description,
      location: eventData.location,
      onlineLink: eventData.onlineLink,
      to: eventData.to,
      meetingRoom: eventData.meetingRoom ?? false,
      roomRequirement: eventData.meetingRoom
        ? {
          id: eventData.roomRequirement?.id || null,
          capacity: eventData.roomRequirement.capacity,
          assetCategories: eventData.roomRequirement.assetCategories,
          start: eventData.roomRequirement.start
            ? toLocal(eventData.roomRequirement.start).toISOString()
            : null,
          end: eventData.roomRequirement.end
            ? toLocal(eventData.roomRequirement.end).toISOString()
            : null,
        }
        : null,
      start: toLocal(eventData.start).toISOString(),
      end: toLocal(eventData.end).toISOString(),
    };

    try {
      const res = await dispatch(createOrUpdateMeeting(payload)).unwrap();

      dispatch(updateEvent(res));
      setIsModalOpen(false);
      setSlotInfo(null);
      showSuccess(
        eventData.id ? "Update meeting successfully" : "Create meeting successfully"
      );
      reloadMeetings();

      return { success: true };
    } catch (err) {
      console.error("Save meeting failed:", err);

      if (err?.data && typeof err.data === "object") {
        return { success: false, validationErrors: err.data };
      }

      showError(err?.message || "Save meeting failed");
      return { success: false };
    }
  };

  const handleDeleteEvent = async (id) => {
    console.log("handleDeleteEvent called with id:", id);
    const action = await dispatch(removeMeeting(id));
    console.log("removeMeeting action result:", action);
    if (!removeMeeting.fulfilled.match(action)) {
      showError(action.payload || action.error);
      console.error("Delete failed", action.payload || action.error);
    }
    else {
      showSuccess("Delete successfully");
      reloadMeetings();
    }
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
