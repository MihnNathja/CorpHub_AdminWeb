// src/features/employee/components/Section.jsx
const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
    <h3 className="text-base font-semibold text-gray-900 mb-3">{title}</h3>
    {children}
  </div>
);
export default Section;
