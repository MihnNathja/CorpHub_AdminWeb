import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDepartmentTickets, setStatusFilter, setPage, fetchUsersDepartment, assign } from "../store/ticketSlice";

export const useTickets = () => {
  const dispatch = useDispatch();
  const { users, items, loading, error, statusFilter, page, pageSize } = useSelector(
    state => state.tickets
  );

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const handleAssign = async (ticketId, userId) => {
    try {
      dispatch(assign({ ticketId, userId }));
      setEditingId(null);
    } catch (err) {
      console.error("Assign failed:", err);
    }
  };

  // Dispatch fetchDepartmentTickets khi hook mount
  useEffect(() => {
    if(!Array.isArray(items) || items.length === 0) {
      dispatch(fetchDepartmentTickets());
    }
  }, [dispatch]);
 
  useEffect(() => {
    if(!Array.isArray(users) || users.length === 0)
    {
      dispatch(fetchUsersDepartment());
    }

  }, [dispatch, users]);

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
    handleAssign
  };
};
