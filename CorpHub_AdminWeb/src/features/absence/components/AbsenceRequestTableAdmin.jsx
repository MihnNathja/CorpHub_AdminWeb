
import { useAbsenceRequest } from "../hooks/useAdminAbsenceRequest";
import { useAuth } from "../../auth/hooks/useAuth";
import AbsenceRequestCard from "./AbsenceRequestCard";



const AbsenceRequestTable = () => {
    const { absenceRequests, approveRequest, rejectRequest } = useAbsenceRequest();
    const { user } = useAuth();

    return (
        <div className="space-y-4">
            {absenceRequests.map((item) => (
                <AbsenceRequestCard
                    key={item.id}
                    item={item}
                    currentUserId={user.id}
                    approveRequest={approveRequest}
                    rejectRequest={rejectRequest}
                />
            ))}
        </div>
    );
};

export default AbsenceRequestTable;