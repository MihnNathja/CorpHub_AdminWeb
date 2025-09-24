import React from "react";

export default function UserSuggestions({ suggestions, onSelect }) {
    if (!suggestions || suggestions.length === 0) return null;

    return (
        <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto 
                   rounded-md border border-gray-200 dark:border-gray-600
                   bg-white dark:bg-gray-700 shadow-md">
            {suggestions.map((user) => (
                <li
                    key={user.id}
                    className="cursor-pointer px-3 py-2 
                     hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => onSelect(user)}
                >
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                        {user.fullName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                        {user.email}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-400">
                        {user.department?.name}
                    </div>
                </li>
            ))}
        </ul>
    );
}