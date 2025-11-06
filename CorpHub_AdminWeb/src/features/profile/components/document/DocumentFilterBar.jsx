const DocumentFilterBar = ({
  types,
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
}) => (
  <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    <input
      type="text"
      placeholder="🔍 Tìm kiếm theo tên tài liệu..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full sm:w-1/2 border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />

    <div className="flex items-center gap-2 w-full sm:w-auto">
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="border rounded-xl px-3 py-2 text-sm text-gray-700 bg-white"
      >
        <option value="">-- Tất cả loại tài liệu --</option>
        {types.map((t) => (
          <option key={t.id} value={t.name}>
            {t.name}
          </option>
        ))}
      </select>
      <button
        onClick={() => {
          setSearchTerm("");
          setFilterType("");
        }}
        className="px-3 py-2 text-sm border rounded-xl hover:bg-gray-50 transition"
      >
        Làm mới
      </button>
    </div>
  </div>
);

export default DocumentFilterBar;
