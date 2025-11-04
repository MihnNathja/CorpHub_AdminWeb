import { useState, useRef, useEffect } from "react";

/**
 * Generic SearchableSelect
 * 
 * Props:
 * - items: danh sách object [{ id, name }]
 * - value: id được chọn
 * - onChange: callback(id)
 * - loading: boolean (đang tải dữ liệu)
 * - keywords: string (từ khóa tìm kiếm)
 * - onKeyWordsChange: callback(keyword)
 * - placeholder: (optional) string, placeholder hiển thị khi chưa chọn
 * - labelKey: (optional) string, tên field dùng để hiển thị (mặc định: 'name')
 * 
 */
const SearchableSelect = ({
    items = [],
    value,
    onChange,
    loading = false,
    keywords,
    onKeyWordsChange,
    placeholder = "Select or search...",
    labelKey = "name",
}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const selectedItem = items.find((i) => i.id === value);

    // ✅ Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative">
            {/* Ô hiển thị giá trị đã chọn */}
            <div
                onClick={() => setOpen((prev) => !prev)}
                className="mt-1 w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white cursor-pointer select-none"
            >
                {selectedItem ? selectedItem[labelKey] : placeholder}
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-700 border rounded-lg shadow-lg">
                    {/* Ô nhập tìm kiếm */}
                    <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                        <input
                            type="text"
                            value={keywords}
                            onChange={(e) => onKeyWordsChange(e.target.value)}
                            placeholder={`Search...`}
                            autoFocus
                            className="w-full px-2 py-1 text-sm border rounded-md dark:bg-gray-800 dark:text-white"
                        />
                    </div>

                    {/* Danh sách kết quả */}
                    <div className="max-h-48 overflow-auto">
                        {loading ? (
                            <div className="p-2 text-gray-500 text-sm">Loading...</div>
                        ) : items.length === 0 ? (
                            <div className="p-2 text-gray-500 text-sm">No results</div>
                        ) : (
                            items.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        onChange(item.id);
                                        onKeyWordsChange("");
                                        setOpen(false);
                                    }}
                                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 ${item.id === value
                                            ? "bg-gray-200 dark:bg-gray-600 font-medium"
                                            : ""
                                        }`}
                                >
                                    {item[labelKey]}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
