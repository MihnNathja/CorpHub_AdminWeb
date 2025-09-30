import { LockClosedIcon } from "@heroicons/react/24/outline";
import NoticePageLayout from "../layouts/NoticePageLayout";

const UnauthorizedPage = () => (
  <NoticePageLayout
    icon={LockClosedIcon}
    iconColor="text-red-500"
    title="Truy cập bị từ chối"
    message="Bạn không có quyền truy cập trang này. Nếu bạn nghĩ đây là lỗi, hãy liên hệ quản trị viên."
  />
);

export default UnauthorizedPage;
