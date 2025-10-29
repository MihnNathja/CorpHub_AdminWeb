import Section from "./Section";

const DocumentsTab = ({ profile }) => (
  <Section title="Tài liệu nhân sự">
    <div className="divide-y">
      {profile.documents.map((doc, idx) => (
        <div key={idx} className="flex items-center justify-between py-3">
          <div>
            <div className="text-sm font-medium">{doc.name}</div>
            <div className="text-xs text-gray-500">{doc.size}</div>
          </div>
          <button className="px-3 py-1.5 border rounded-xl text-sm hover:bg-gray-50">
            Tải xuống
          </button>
        </div>
      ))}
    </div>
  </Section>
);

export default DocumentsTab;
