import React from "react";

type StatusType =
  | "urgent"
  | "high"
  | "medium"
  | "low"
  | "running"
  | "pending"
  | "completed"
  | "paused"
  | "cancelled"
  | "approved"
  | "rejected"
  | "reviewing"
  | "red"
  | "yellow"
  | "blue";

interface StatusBadgeProps {
  status?: StatusType;
  label?: string;
}

const STATUS_MAP: Record<StatusType, { label: string; color: string; bg: string; border: string }> = {
  urgent:    { label: "紧急",   color: "rgba(255,59,59,1)",   bg: "rgba(255,59,59,0.12)",   border: "rgba(255,59,59,0.4)" },
  high:      { label: "高",     color: "rgba(255,120,0,1)",   bg: "rgba(255,120,0,0.12)",   border: "rgba(255,120,0,0.4)" },
  medium:    { label: "中",     color: "rgba(255,200,0,1)",   bg: "rgba(255,200,0,0.1)",    border: "rgba(255,200,0,0.35)" },
  low:       { label: "低",     color: "rgba(100,180,100,1)", bg: "rgba(100,180,100,0.12)", border: "rgba(100,180,100,0.4)" },
  running:   { label: "执行中", color: "rgba(0,212,255,1)",   bg: "rgba(0,212,255,0.1)",    border: "rgba(0,212,255,0.35)" },
  pending:   { label: "待执行", color: "rgba(180,180,220,1)", bg: "rgba(180,180,220,0.1)",  border: "rgba(180,180,220,0.3)" },
  completed: { label: "已完成", color: "rgba(0,200,120,1)",   bg: "rgba(0,200,120,0.1)",    border: "rgba(0,200,120,0.35)" },
  paused:    { label: "已暂停", color: "rgba(255,180,0,1)",   bg: "rgba(255,180,0,0.1)",    border: "rgba(255,180,0,0.35)" },
  cancelled: { label: "已取消", color: "rgba(120,120,160,1)", bg: "rgba(120,120,160,0.1)",  border: "rgba(120,120,160,0.3)" },
  approved:  { label: "已通过", color: "rgba(0,200,120,1)",   bg: "rgba(0,200,120,0.1)",    border: "rgba(0,200,120,0.35)" },
  rejected:  { label: "已驳回", color: "rgba(255,59,59,1)",   bg: "rgba(255,59,59,0.12)",   border: "rgba(255,59,59,0.4)" },
  reviewing: { label: "审批中", color: "rgba(0,212,255,1)",   bg: "rgba(0,212,255,0.1)",    border: "rgba(0,212,255,0.35)" },
  red:       { label: "红色预警", color: "rgba(255,59,59,1)", bg: "rgba(255,59,59,0.12)",   border: "rgba(255,59,59,0.4)" },
  yellow:    { label: "黄色预警", color: "rgba(255,200,0,1)", bg: "rgba(255,200,0,0.1)",    border: "rgba(255,200,0,0.35)" },
  blue:      { label: "蓝色预警", color: "rgba(0,160,255,1)", bg: "rgba(0,160,255,0.1)",    border: "rgba(0,160,255,0.35)" },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status = "pending", label }) => {
  const cfg = STATUS_MAP[status];
  return (
    <span
      data-cmp="StatusBadge"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 8px",
        borderRadius: "3px",
        fontSize: "11px",
        fontWeight: 500,
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: cfg.color,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      {label ?? cfg.label}
    </span>
  );
};

export default StatusBadge;
