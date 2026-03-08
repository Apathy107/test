import React from "react";

interface Column {
  key: string;
  title: string;
  width?: string;
  align?: "left" | "center" | "right";
}

interface TechTableProps {
  columns?: Column[];
  children?: React.ReactNode;
  loading?: boolean;
  /** 是否在首列表头展示多选复选框（用于“序号”列头全选） */
  showIndexCheckbox?: boolean;
  /** 当前页是否全部选中，用于首列表头复选框状态 */
  allChecked?: boolean;
  /** 切换当前页全选/全不选 */
  onToggleAll?: () => void;
}

const TechTable: React.FC<TechTableProps> = ({
  columns = [],
  children,
  loading = false,
  showIndexCheckbox = false,
  allChecked = false,
  onToggleAll,
}) => {
  return (
    <div
      data-cmp="TechTable"
      className="tech-card rounded-lg overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: "rgba(0, 80, 130, 0.25)" }}>
              {columns.map((col, idx) => (
                <th
                  key={col.key}
                  className="px-3 py-3 font-medium whitespace-nowrap"
                  style={{
                    color: "rgba(0, 212, 255, 0.85)",
                    textAlign: col.align || "left",
                    borderBottom: "1px solid rgba(0, 150, 200, 0.3)",
                    width: col.width,
                    letterSpacing: "0.05em",
                  }}
                >
                  {idx === 0 && showIndexCheckbox ? (
                    <span className="inline-flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={() => onToggleAll && onToggleAll()}
                      />
                      {col.title}
                    </span>
                  ) : (
                    col.title
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-12 text-xs"
                  style={{ color: "rgba(80, 120, 160, 1)" }}
                >
                  加载中...
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TechTable;