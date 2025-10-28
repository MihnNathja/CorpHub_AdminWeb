import AcceptButton from "../../global/components/button/AcceptButton";
import RejectButton from "../../global/components/button/RejectButton";

export default function TicketActionGroupEmp({ status, onAccept, onReject, loading = false }) {
  if (status === "ASSIGNING") {
    return (
      <div className="flex gap-2">
        <AcceptButton onClick={onAccept} loading={loading} />
        <RejectButton onClick={onReject} loading={loading} />
      </div>
    );
  }

  if (status === "REJECTED") {
    return <p className="text-red-600 font-medium">Rejected</p>;
  }

  if (status === "IN_PROGRESS" || status === "DONE") {
    return <p className="text-green-600 font-medium">Accepted</p>;
  }

  return <p className="text-gray-500 italic">–</p>;
}
