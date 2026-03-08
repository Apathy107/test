import React from "react";

type StatusType =
  | "online" | "offline" | "fault" | "maintenance"
  | "normal" | "warning" | "danger" | "info"
  | "pending" | "approved" | "rejected" | "completed"
  | "scrapped" | "loaned" | "overdue" | "sick";

interface StatusBadgeProps {
  status?: StatusType;
  label?: string;
  dot?: boolean;
}

const statusConfig: Record<StatusType, { label: string; className: string; dotColor: string }> = {
  online:      { label: "在线",     className: "badge-success", dotColor: "rgba(76,175,80,1)" },
  offline:     { label: "离线",     className: "badge-neutral", dotColor: "rgba(120,145,180,1)" },
  fault:       { label: "故障",     className: "badge-danger",  dotColor: "rgba(239,68,68,1)" },
  maintenance: { label: "维护中",   className: "badge-warning", dotColor: "rgba(255,167,38,1)" },
  normal:      { label: "正常",     className: "badge-success", dotColor: "rgba(76,175,80,1)" },
  warning:     { label: "预警",     className: "badge-warning", dotColor: "rgba(255,167,38,1)" },
  danger:      { label: "告警",     className: "badge-danger",  dotColor: "rgba(239,68,68,1)" },
  info:        { label: "信息",     className: "badge-info",    dotColor: "rgba(30,136,229,1)" },
  pending:     { label: "待审批",   className: "badge-warning", dotColor: "rgba(255,167,38,1)" },
  approved:    { label: "已批准",   className: "badge-success", dotColor: "rgba(76,175,80,1)" },
  rejected:    { label: "已拒绝",   className: "badge-danger",  dotColor: "rgba(239,68,68,1)" },
  completed:   { label: "已完成",   className: "badge-info",    dotColor: "rgba(30,136,229,1)" },
  scrapped:    { label: "已报废",   className: "badge-neutral", dotColor: "rgba(120,145,180,1)" },
  loaned:      { label: "借用中",   className: "badge-info",    dotColor: "rgba(38,198,218,1)" },
  overdue:     { label: "逾期未保养", className: "badge-danger", dotColor: "rgba(239,68,68,1)" },
  sick:        { label: "带病运行", className: "badge-danger",  dotColor: "rgba(239,68,68,1)" },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = "normal",
  label,
  dot = true,
}) => {
  const config = statusConfig[status];
  const displayLabel = label || config.label;

  return (
    <span
      data-cmp="StatusBadge"
      className={config.className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 8px",
        borderRadius: 3,
        fontSize: 11,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {dot && (
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: config.dotColor,
            flexShrink: 0,
          }}
        />
      )}
      {displayLabel}
    </span>
  );
};

export default StatusBadge;