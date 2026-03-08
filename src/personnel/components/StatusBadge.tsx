import React from "react";

type StatusType =
  | "active"
  | "expired"
  | "warning"
  | "danger"
  | "pending"
  | "approved"
  | "rejected"
  | "frozen"
  | "normal"
  | "info";

interface StatusBadgeProps {
  status?: StatusType;
  label?: string;
  dot?: boolean;
}

const statusConfig: Record<StatusType, { color: string; bg: string; border: string }> = {
  active:   { color: "rgba(0, 220, 150, 1)",  bg: "rgba(0, 150, 100, 0.15)",  border: "rgba(0, 200, 130, 0.4)" },
  normal:   { color: "rgba(0, 212, 255, 1)",  bg: "rgba(0, 100, 150, 0.15)",  border: "rgba(0, 180, 220, 0.4)" },
  info:     { color: "rgba(100, 180, 255, 1)", bg: "rgba(50, 100, 200, 0.15)", border: "rgba(80, 150, 220, 0.4)" },
  warning:  { color: "rgba(255, 200, 0, 1)",  bg: "rgba(200, 150, 0, 0.15)",  border: "rgba(230, 180, 0, 0.4)" },
  danger:   { color: "rgba(255, 80, 80, 1)",  bg: "rgba(200, 50, 50, 0.15)",  border: "rgba(220, 60, 60, 0.4)" },
  expired:  { color: "rgba(255, 100, 50, 1)", bg: "rgba(200, 60, 20, 0.15)",  border: "rgba(220, 80, 40, 0.4)" },
  pending:  { color: "rgba(180, 160, 255, 1)", bg: "rgba(120, 80, 200, 0.15)", border: "rgba(150, 100, 220, 0.4)" },
  approved: { color: "rgba(0, 220, 150, 1)",  bg: "rgba(0, 150, 100, 0.15)",  border: "rgba(0, 200, 130, 0.4)" },
  rejected: { color: "rgba(255, 80, 80, 1)",  bg: "rgba(200, 50, 50, 0.15)",  border: "rgba(220, 60, 60, 0.4)" },
  frozen:   { color: "rgba(150, 200, 240, 1)", bg: "rgba(80, 130, 180, 0.15)", border: "rgba(100, 160, 200, 0.4)" },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = "normal",
  label = "正常",
  dot = true,
}) => {
  const cfg = statusConfig[status] || statusConfig.normal;
  return (
    <span
      data-cmp="StatusBadge"
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
      style={{
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: cfg.color }}
        />
      )}
      {label}
    </span>
  );
};

export default StatusBadge;