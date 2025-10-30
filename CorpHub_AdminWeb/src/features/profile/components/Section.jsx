// src/features/employee/components/Section.jsx
const Section = ({ title, right, children }) => (
  <div className="mb-6">
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-semibold text-gray-800">{title}</h2>
      {right}
    </div>
    {children}
  </div>
);

export default Section;
