import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import { Eye, Edit, MoreHorizontal } from "lucide-react";

interface PilotTableRowProps {
  index?: number;
  id?: string;
  name?: string;
  gender?: string;
  idCard?: string;
  phone?: string;
  unit?: string;
  certStatus?: "持证" | "未持证" | "已过期";
  taskStatus?: "在岗" | "任务中" | "休假" | "冻结";
  certExpiry?: string;
  onView?: () => void;
  onEdit?: () => void;
  selected?: boolean;
  onToggleSelect?: () => void;
  onDelete?: () => void;
  onDisable?: () => void;
}

const PilotTableRow: React.FC<PilotTableRowProps> = ({
  index = 1,
  id = "P001",
  name = "张三",
  gender = "男",
  idCard = "110101199001011234",
  phone = "138****8888",
  unit = "东城分队",
  certStatus = "持证",
  taskStatus = "在岗",
  certExpiry = "2026-03-15",
  onView = () => console.log("View pilot"),
  onEdit = () => console.log("Edit pilot"),
  selected = false,
  onToggleSelect,
  onDelete,
  onDisable,
}) => {
  const certBadge = certStatus === "持证" ? "active" : certStatus === "已过期" ? "expired" : "warning";
  const taskBadge =
    taskStatus === "在岗" ? "normal" :
    taskStatus === "任务中" ? "info" :
    taskStatus === "休假" ? "pending" : "frozen";
  const [showMenu, setShowMenu] = useState(false);

  return (
    <tr
      data-cmp="PilotTableRow"
      className="table-row-hover transition-colors"
      style={{ borderBottom: "1px solid rgba(0, 100, 150, 0.2)" }}
    >
      <td className="px-3 py-3 text-center" style={{ color: "rgba(80, 120, 160, 1)", fontSize: "12px" }}>
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          style={{ marginRight: 6, verticalAlign: "middle" }}
        />
        {index}
      </td>
      <td className="px-3 py-3 text-xs font-medium" style={{ color: "rgba(0, 212, 255, 0.8)" }}>{id}</td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{
              background: "rgba(0, 100, 150, 0.4)",
              color: "rgba(0, 212, 255, 1)",
              border: "1px solid rgba(0, 150, 200, 0.4)",
            }}
          >
            {name.charAt(0)}
          </div>
          <span className="text-xs font-medium" style={{ color: "rgba(200, 220, 240, 1)" }}>{name}</span>
        </div>
      </td>
      <td className="px-3 py-3 text-xs text-center" style={{ color: "rgba(140, 180, 210, 1)" }}>{gender}</td>
      <td className="px-3 py-3 text-xs" style={{ color: "rgba(120, 160, 200, 1)", fontFamily: "monospace" }}>{idCard}</td>
      <td className="px-3 py-3 text-xs" style={{ color: "rgba(140, 180, 210, 1)", fontFamily: "monospace" }}>{phone}</td>
      <td className="px-3 py-3 text-xs" style={{ color: "rgba(140, 180, 210, 1)" }}>{unit}</td>
      <td className="px-3 py-3">
        <StatusBadge status={certBadge as "active" | "expired" | "warning"} label={certStatus} />
      </td>
      <td className="px-3 py-3">
        <StatusBadge status={taskBadge as "normal" | "info" | "pending" | "frozen"} label={taskStatus} />
      </td>
      <td className="px-3 py-3 text-xs" style={{ color: "rgba(140, 180, 210, 1)" }}>{certExpiry}</td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onView}
            className="px-2 py-1 rounded text-xs transition-colors"
            style={{
              background: "rgba(0, 100, 150, 0.2)",
              color: "rgba(0, 212, 255, 0.9)",
              border: "1px solid rgba(0, 150, 200, 0.3)",
            }}
            title="详情"
          >
            <Eye size={11} />
          </button>
          <button
            onClick={onEdit}
            className="px-2 py-1 rounded text-xs transition-colors"
            style={{
              background: "rgba(60, 60, 120, 0.2)",
              color: "rgba(180, 160, 255, 0.9)",
              border: "1px solid rgba(120, 100, 200, 0.3)",
            }}
            title="编辑"
          >
            <Edit size={11} />
          </button>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="p-1 rounded"
              style={{ color: "rgba(100, 140, 180, 1)" }}
              title="更多操作"
            >
              <MoreHorizontal size={13} />
            </button>
            {showMenu && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  marginTop: 4,
                  minWidth: 96,
                  background: "rgba(4, 12, 30, 1)",
                  border: "1px solid rgba(0, 150, 200, 0.4)",
                  borderRadius: 4,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.45)",
                  zIndex: 20,
                }}
              >
                <button
                  className="w-full text-left px-3 py-1.5 text-xs"
                  style={{ color: "rgba(220, 80, 80, 1)" }}
                  onClick={() => {
                    setShowMenu(false);
                    onDelete?.();
                  }}
                >
                  删除
                </button>
                <button
                  className="w-full text-left px-3 py-1.5 text-xs"
                  style={{ color: "rgba(240, 190, 80, 1)" }}
                  onClick={() => {
                    setShowMenu(false);
                    onDisable?.();
                  }}
                >
                  禁用
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default PilotTableRow;