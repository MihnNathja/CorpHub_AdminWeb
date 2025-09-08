import React from "react";

const TicketFilter = ({ statusFilter, setStatusFilter }) => {
  return (
    <div className="mb-4 flex items-center gap-2">
      <label>Status: </label>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border rounded p-1"
      >
        <option value="">All</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="CLOSED">Closed</option>
        <option value="WAITING">Waiting</option>
        <option value="ACCEPTED">Accepted</option>
        <option value="REJECTED">Rejected</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>
    </div>
  );
};

export default TicketFilter;
