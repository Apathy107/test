import React from "react";
import { Search, Filter, Download, Upload, Plus } from "lucide-react";

interface FilterBarProps {
  onSearch?: (v: string) => void;
  onAdd?: () => void;
  onImport?: () => void;
  onExport?: () => void;
  onFilter?: () => void;
  placeholder?: string;
  showAdd?: boolean;
  showImport?: boolean;
  showExport?: boolean;
  extraFilters?: React.ReactNode;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onSearch = () => {},
  onAdd = () => console.log("Add clicked"),
  onImport = () => console.log("Import clicked"),
  onExport = () => console.log("Export clicked"),
  onFilter,
  placeholder = "搜索...",
  showAdd = true,
  showImport = true,
  showExport = true,
  extraFilters,
}) => {
  return (
    <div
      data-cmp="FilterBar"
      className="flex items-center gap-3 flex-wrap"
    >
      {/* Search */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded flex-1 min-w-[180px] max-w-xs"
        style={{
          background: "rgba(16, 38, 76, 1)",
          border: "1px solid rgba(0, 150, 200, 0.3)",
        }}
      >
        <Search size={13} style={{ color: "rgba(80, 120, 160, 1)" }} />
        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 bg-transparent text-xs outline-none placeholder-opacity-60"
          style={{ color: "rgba(180, 210, 240, 1)" }}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Extra filters slot */}
      {extraFilters}

      {/* Filter button */}
      <button
        className="flex items-center gap-1.5 px-3 py-2 rounded text-xs transition-colors"
        style={{
          background: "rgba(16, 38, 76, 1)",
          border: "1px solid rgba(0, 150, 200, 0.3)",
          color: "rgba(100, 150, 200, 1)",
        }}
        onClick={() => onFilter ? onFilter() : console.log("Filter clicked")}
      >
        <Filter size={12} />
        筛选
      </button>

      <div className="flex-1" />

      {/* Action buttons */}
      {showImport && (
        <button
          onClick={onImport}
          className="flex items-center gap-1.5 px-3 py-2 rounded text-xs transition-colors"
          style={{
            background: "rgba(30, 50, 90, 1)",
            border: "1px solid rgba(0, 150, 200, 0.35)",
            color: "rgba(0, 180, 220, 1)",
          }}
        >
          <Upload size={12} />
          批量导入
        </button>
      )}
      {showExport && (
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-2 rounded text-xs transition-colors"
          style={{
            background: "rgba(30, 50, 90, 1)",
            border: "1px solid rgba(0, 150, 200, 0.35)",
            color: "rgba(0, 180, 220, 1)",
          }}
        >
          <Download size={12} />
          批量导出
        </button>
      )}
      {showAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded text-xs font-medium transition-colors"
          style={{
            background: "rgba(0, 130, 180, 0.25)",
            border: "1px solid rgba(0, 212, 255, 0.5)",
            color: "rgba(0, 212, 255, 1)",
            boxShadow: "0 0 10px rgba(0, 212, 255, 0.1)",
          }}
        >
          <Plus size={12} />
          新增飞手
        </button>
      )}
    </div>
  );
};

export default FilterBar;