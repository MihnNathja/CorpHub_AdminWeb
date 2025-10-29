// src/features/employee/components/Badge.jsx
const Badge = ({ children, color = "gray" }) => (
  <span
    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-${color}-100 text-${color}-700`}
  >
    {children}
  </span>
);
export default Badge;
