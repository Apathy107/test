import React from "react";

type AlertLevel = "red" | "yellow" | "blue" | "orange";

interface AlertItemProps {
  level?: AlertLevel;
  content?: string;
  target?: string;
  time?: string;
  onClick?: () => void;
}

const levelConfig: Record<AlertLevel, { dot: string; border: string; bg: string }> = {
  red:    { dot: "rgba(255, 80, 80, 1)",   border: "rgba(255, 80, 80, 0.25)",   bg: "rgba(255, 50, 50, 0.06)" },
  yellow: { dot: "rgba(255, 200, 0, 1)",   border: "rgba(255, 200, 0, 0.25)",   bg: "rgba(255, 180, 0, 0.06)" },
  blue:   { dot: "rgba(0, 212, 255, 1)",   border: "rgba(0, 212, 255, 0.25)",   bg: "rgba(0, 180, 230, 0.06)" },
  orange: { dot: "rgba(255, 150, 0, 1)",   border: "rgba(255, 150, 0, 0.25)",   bg: "rgba(255, 130, 0, 0.06)" },
};

const AlertItem: React.FC<AlertItemProps> = ({
  level = "yellow",
  content = "证书即将到期，请及时处理",
  target = "张三 (P001)",
  time = "2小时前",
  onClick = () => console.log("Alert item clicked"),
}) => {
  const cfg = levelConfig[level];
  return (
    <div
      data-cmp="AlertItem"
      className="flex items-start gap-3 p-3 rounded cursor-pointer transition-colors hover:opacity-90"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderLeft: `3px solid ${cfg.dot}`,
      }}
      onClick={onClick}
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0 mt-1 pulse-dot"
        style={{ background: cfg.dot }}
      />
      <div className="flex-1 min-w-0">
        <div
          className="text-xs font-medium mb-0.5"
          style={{ color: "rgba(200, 220, 240, 1)" }}
        >
          {content}
        </div>
        <div className="text-xs" style={{ color: "rgba(100, 140, 180, 1)" }}>
          {target}
        </div>
      </div>
      <div
        className="text-xs flex-shrink-0"
        style={{ color: "rgba(80, 120, 160, 1)" }}
      >
        {time}
      </div>
    </div>
  );
};

export default AlertItem;