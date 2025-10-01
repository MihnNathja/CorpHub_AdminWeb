import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMyTickets,
  fetchReceivedTickets,
  fetchSentTickets,
  fetchUsersDepartment,
  setStatusFilter,
  setPriorityFilter,
  setPage,
  assign,
  confirmSend,
  reject,
  createOrUpdateTicket,
  accept,
  complete,
  remove
} from "../store/ticketSlice";
import { showError, showSuccess } from "../../../utils/toastUtils";

export const useTickets = (mode) => {
  const dispatch = useDispatch();

  const {
    users,
    myItems,
    receivedItems,
    sentItems,
    loading,
    error,
    statusFilter,
    priorityFilter,
    page,
    pageSize,
  } = useSelector((state) => state.tickets);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isReasonFormOpen, setIsReasonFormOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mảng gốc
  const rawTickets =
    mode === "sent" ? sentItems : mode === "my" ? myItems : receivedItems;

  // Filter tickets nhưng KHÔNG mutate rawTickets
  const filteredTickets = useMemo(() => {
    if (!Array.isArray(rawTickets)) return [];
    return rawTickets.filter((ticket) => {
      const statusMatch = !statusFilter || ticket.status === statusFilter;
      const priorityMatch =
        !priorityFilter || ticket.priority === priorityFilter;
      return statusMatch && priorityMatch;
    });
  }, [rawTickets, statusFilter, priorityFilter]);

  // Pagination tách biệt
  const paginatedTickets = useMemo(() => {
    return filteredTickets.slice((page - 1) * pageSize, page * pageSize);
  }, [filteredTickets, page, pageSize]);

  const totalPages = Math.ceil(filteredTickets.length / pageSize);

  // Assign chỉ áp dụng cho received
  const handleAssign = async (ticketId, userId) => {
    try {
      await dispatch(assign({ ticketId, userId }));
      showSuccess("Assign successfully");
      setEditingId(null);
      dispatch(fetchReceivedTickets());
    } catch (err) {
      showError("Assign failed");
      console.error("Assign failed:", err);
    }
  };

  const handleConfirmSend = async (ticketId) => {
    try {
      await dispatch(confirmSend({ ticketId }));
      showSuccess("Confirm successfully");
      if (mode === "sent") dispatch(fetchSentTickets());
      else dispatch(fetchReceivedTickets());
    } catch (err) {
      showError("Confirm sending failed");
      console.error("Confirm sending failed:", err);
    }
  };

  const handleReject = async (ticketId, reason) => {
    try {
      await dispatch(reject({ ticketId, reason }));
      showSuccess("Reject successfully");
      if (mode === "my") dispatch(fetchMyTickets());
      if (mode === "sent") dispatch(fetchSentTickets());
      else dispatch(fetchReceivedTickets());
    } catch (err) {
      showError("Reject send failed");
      console.error("Reject send failed:", err);
    }
  };

  const handleCreateOrUpdate = async (ticketData) => {
    try {
      await dispatch(createOrUpdateTicket(ticketData));
      showSuccess("Tickets list updated");
      if (mode === "my") dispatch(fetchMyTickets());
      if (mode === "sent") dispatch(fetchSentTickets());
      if (mode === "received") dispatch(fetchReceivedTickets());
    } catch (err) {
      showError("Add ticket failed");
      console.error("Add ticket failed:", err);
    }
  };

  const handleAccept = async (ticketId) => {
    try {
      await dispatch(accept(ticketId));
      showSuccess("Ticket accepted");
      if (mode === "my") dispatch(fetchMyTickets());
    } catch (err) {
      showError("Accept ticket failed");
      console.error("Accept ticket failed:", err);
    }
  };

  const handleComplete = async (ticketId) => {
    try {
      await dispatch(complete(ticketId));
      showSuccess("Ticket completed");
      if (mode === "my") dispatch(fetchMyTickets());
    } catch (err) {
      showError("Complete ticket failed");
      console.error("Complete ticket failed:", err);
    }
  };

  const handleRemove = async (ticketId) => {
    try {
      await dispatch(remove(ticketId));
      showSuccess("Ticket deleted");
      if (mode === "my") dispatch(fetchMyTickets());
    } catch (err) {
      showError("Delete ticket failed");
      console.error("Delete ticket failed:", err);
    }
  }

  // Fetch tickets theo mode khi mount
  useEffect(() => {
    if (mode === "sent") dispatch(fetchSentTickets());
    else if (mode === "my") dispatch(fetchMyTickets());
    else dispatch(fetchReceivedTickets());
  }, [dispatch, mode]);

  // Fetch users cho assign
  useEffect(() => {
    console.log("Fetch users cho assign, ", users);
    if (!Array.isArray(users) || users.length === 0) {
      dispatch(fetchUsersDepartment());
    }
  }, [dispatch, users]);

  return {
    users,
    rawTickets,
    filteredTickets,
    tickets: paginatedTickets,
    loading,
    error,
    statusFilter,
    priorityFilter,
    setPriorityFilter: (val) => dispatch(setPriorityFilter(val)),
    setStatusFilter: (val) => dispatch(setStatusFilter(val)),
    page,
    setPage: (val) => dispatch(setPage(val)),
    totalPages,
    selectedTicket,
    setSelectedTicket,
    editingId,
    setEditingId,
    isReasonFormOpen,
    setIsReasonFormOpen,
    isModalOpen,
    setIsModalOpen,
    handleAssign,
    handleConfirmSend,
    handleReject,
    handleCreateOrUpdate,
    handleAccept,
    handleComplete,
    handleRemove
  };
};
