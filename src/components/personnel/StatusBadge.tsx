import React from "react";

type StatusType = "active" | "on_mission" | "resigned" | "valid" | "expired" | "expiring" | "no_cert";

interface StatusBadgeProps {
  status?: StatusType;
  label?: string;
}

const statusConfig: Record<StatusType, { label: string; bg: string; color: string; dot: string }> = {
  active: { label: "在岗", bg: "rgba(82, 196, 26, 0.12)", color: "rgba(82, 196, 26, 1)", dot: "rgba(82, 196, 26, 1)" },
  on_mission: { label: "任务中", bg: "rgba(24, 144, 255, 0.12)", color: "rgba(24, 144, 255, 1)", dot: "rgba(24, 144, 255, 1)" },
  resigned: { label: "离职", bg: "rgba(120, 130, 150, 0.15)", color: "rgba(120, 130, 150, 1)", dot: "rgba(120, 130, 150, 1)" },
  valid: { label: "持证", bg: "rgba(82, 196, 26, 0.12)", color: "rgba(82, 196, 26, 1)", dot: "rgba(82, 196, 26, 1)" },
  expired: { label: "已过期", bg: "rgba(255, 77, 79, 0.12)", color: "rgba(255, 77, 79, 1)", dot: "rgba(255, 77, 79, 1)" },
  expiring: { label: "即将过期", bg: "rgba(250, 173, 20, 0.12)", color: "rgba(250, 173, 20, 1)", dot: "rgba(250, 173, 20, 1)" },
  no_cert: { label: "无证", bg: "rgba(255, 77, 79, 0.12)", color: "rgba(255, 77, 79, 1)", dot: "rgba(255, 77, 79, 1)" },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status = "active", label }) => {
  const config = statusConfig[status];
  const displayLabel = label ?? config.label;
  return (
    <div
      data-cmp="StatusBadge"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "9999px",
        fontSize: 12,
        fontWeight: 500,
        background: config.bg,
        color: config.color,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: config.dot, flexShrink: 0 }} />
      {displayLabel}
    </div>
  );
};

export default StatusBadge;
