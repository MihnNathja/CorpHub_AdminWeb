import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import NoticePageLayout from "./NoticePageLayout";

const NotFoundPage = () => (
  <NoticePageLayout
    icon={ExclamationTriangleIcon}
    iconColor="text-orange-500"
    title="404 - Không tìm thấy trang"
    message="Trang bạn đang tìm không tồn tại hoặc đã bị xóa."
  />
);

export default NotFoundPage;
