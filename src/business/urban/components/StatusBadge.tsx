import React from "react";

interface StatusBadgeProps {
  status?: "active" | "pending" | "done" | "error" | "paused";
  label?: string;
  size?: "sm" | "md";
}

const statusConfig = {
  active: {
    label: "进行中",
    color: "rgb(80, 230, 180)",
    bg: "rgba(80, 230, 180, 0.1)",
    border: "rgba(80, 230, 180, 0.3)",
    dotColor: "rgb(80, 230, 180)",
  },
  pending: {
    label: "待处理",
    color: "rgb(255, 180, 0)",
    bg: "rgba(255, 180, 0, 0.1)",
    border: "rgba(255, 180, 0, 0.3)",
    dotColor: "rgb(255, 180, 0)",
  },
  done: {
    label: "已完成",
    color: "rgb(120, 180, 210)",
    bg: "rgba(120, 180, 210, 0.1)",
    border: "rgba(120, 180, 210, 0.3)",
    dotColor: "rgb(120, 180, 210)",
  },
  error: {
    label: "异常",
    color: "rgb(255, 80, 100)",
    bg: "rgba(255, 80, 100, 0.1)",
    border: "rgba(255, 80, 100, 0.3)",
    dotColor: "rgb(255, 80, 100)",
  },
  paused: {
    label: "已暂停",
    color: "rgb(160, 160, 180)",
    bg: "rgba(160, 160, 180, 0.1)",
    border: "rgba(160, 160, 180, 0.3)",
    dotColor: "rgb(160, 160, 180)",
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = "pending",
  label,
  size = "sm",
}) => {
  const cfg = statusConfig[status];
  const text = label || cfg.label;

  return (
    <span
      data-cmp="StatusBadge"
      className="inline-flex items-center gap-1 rounded-full font-medium"
      style={{
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        padding: size === "sm" ? "2px 8px" : "4px 12px",
        fontSize: size === "sm" ? "11px" : "12px",
      }}
    >
      <span
        className="rounded-full inline-block"
        style={{ width: "5px", height: "5px", background: cfg.dotColor }}
      />
      {text}
    </span>
  );
};

export default StatusBadge;