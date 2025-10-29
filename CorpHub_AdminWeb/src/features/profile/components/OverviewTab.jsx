import Section from "./Section";
import Badge from "./Badge";
import KeyValue from "./KeyValue";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserRound,
  Building2,
  ShieldCheck,
  KeyRound,
  BadgeCheck,
} from "lucide-react";

const OverviewTab = ({ profile }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-6">
      <Section title="Giới thiệu">
        <p className="text-sm text-gray-700 leading-6">{profile.about}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {profile.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </Section>

      <Section title="Dòng thời gian">
        <ul className="space-y-3">
          {profile.timeline.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <BadgeCheck className="w-4 h-4 mt-1 text-gray-400" />
              <div>
                <div className="text-sm">{item.text}</div>
                <div className="text-xs text-gray-500">{item.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </div>

    <div className="space-y-6">
      <Section title="Thông tin liên hệ">
        <KeyValue label="Email" value={profile.email} icon={Mail} />
        <KeyValue label="Điện thoại" value={profile.phone} icon={Phone} />
        <KeyValue label="Địa chỉ" value={profile.address} icon={MapPin} />
        <KeyValue
          label="Ngày vào làm"
          value={profile.joinDate}
          icon={Calendar}
        />
        <KeyValue label="Giới tính" value={profile.sex} icon={UserRound} />
        <KeyValue label="Ngày sinh" value={profile.dob} icon={Calendar} />
        <KeyValue label="Quản lý" value={profile.manager} icon={Building2} />
      </Section>
    </div>
  </div>
);

export default OverviewTab;
