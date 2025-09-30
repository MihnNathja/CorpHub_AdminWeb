import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import NoticePageLayout from "../layouts/NoticePageLayout";

const FeatureComingSoonPage = () => (
  <NoticePageLayout
    icon={WrenchScrewdriverIcon}
    iconColor="text-yellow-500"
    title="Tính năng đang phát triển"
    message="Chúng tôi đang hoàn thiện tính năng này. Vui lòng quay lại sau!"
  />
);

export default FeatureComingSoonPage;
