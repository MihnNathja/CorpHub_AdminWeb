import React from "react";

export const Card = ({ title, subtitle, icon, actions, children, id }) => (
  <div id={id} className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900">
    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
      {icon}
      <span>{title}</span>
      {subtitle && (
        <span className="ml-auto text-xs font-normal text-gray-500">
          {subtitle}
        </span>
      )}
      {actions && (
        <div className="ml-auto flex items-center gap-2">{actions}</div>
      )}
    </div>
    {children}
  </div>
);

export default Card;
