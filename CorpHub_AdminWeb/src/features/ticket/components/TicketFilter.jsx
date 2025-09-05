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
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="closed">Closed</option>
      </select>
    </div>
  );
};

export default TicketFilter;
