// src/features/employee/components/KeyValue.jsx
const KeyValue = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
    {Icon && <Icon className="w-4 h-4 mt-1 text-gray-400" />}
    <div>
      <div className="text-xs uppercase text-gray-500">{label}</div>
      <div className="text-sm text-gray-800">{value}</div>
    </div>
  </div>
);
export default KeyValue;
