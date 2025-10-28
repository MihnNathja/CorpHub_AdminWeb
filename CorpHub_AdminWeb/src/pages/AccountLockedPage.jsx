import { LockClosedIcon } from "@heroicons/react/24/solid";
import NoticePageLayout from "../layouts/NoticePageLayout";

const AccountLockedPage = () => {
  return (
    <NoticePageLayout
      icon={LockClosedIcon}
      iconColor="text-red-500"
      title="Tài khoản của bạn đã bị khóa"
      message="Tài khoản hiện đang bị vô hiệu hóa. Vui lòng liên hệ với quản trị viên để được hỗ trợ mở khóa."
      buttonText="Quay lại đăng nhập"
    />
  );
};

export default AccountLockedPage;
