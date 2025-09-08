import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchDepartmentTickets,
  fetchDepartmentTicketsSent,
  fetchUsersDepartment,
  setStatusFilter,
  setPage,
  assign,
  confirmSend,
  rejectSend
} from "../store/ticketSlice";

export const useTickets = (mode) => {
  const dispatch = useDispatch();
  const {
    users, items, loading, error,
    statusFilter, page, pageSize
  } = useSelector(state => state.tickets);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Assign cho mode = received
  const handleAssign = async (ticketId, userId) => {
    try {
      await dispatch(assign({ ticketId, userId }));
      setEditingId(null);
    } catch (err) {
      console.error("Assign failed:", err);
    }
  };

  // Confirm gửi cho mode = sent
  const handleConfirmSend = async (ticketId) => {
    try {
      await dispatch(confirmSend({ ticketId }));
    } catch (err) {
      console.error("Confirm send failed:", err);
    }
  };

  const handleRejectSend = async (ticketId) => {
    try {
      await dispatch(rejectSend({ ticketId }));
    } catch (err) {
      console.error("Reject send failed:", err);
    }
  };

  // Fetch tickets theo mode
  useEffect(() => {
  if (mode === "sent") {
    dispatch(fetchDepartmentTicketsSent());
  } else {
    dispatch(fetchDepartmentTickets());
  }
}, [dispatch, mode]);


  // Fetch users trong phòng ban (dùng cho assign)
  useEffect(() => {
    if (!Array.isArray(users) || users.length === 0) {
      dispatch(fetchUsersDepartment());
    }
  }, [dispatch, users]);

  // Filter + pagination
  const filteredTickets = Array.isArray(items)
    ? items.filter(ticket => statusFilter === "" || ticket.status === statusFilter)
    : [];

  const paginatedTickets = filteredTickets.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredTickets.length / pageSize);

  return {
    users,
    tickets: paginatedTickets,
    loading,
    error,
    statusFilter,
    setStatusFilter: val => dispatch(setStatusFilter(val)),
    page,
    setPage: val => dispatch(setPage(val)),
    totalPages,
    selectedTicket,
    setSelectedTicket,
    editingId,
    setEditingId,
    handleAssign,
    handleConfirmSend,
    handleRejectSend
  };
};
