import React from "react";

type AlertLevel = "red" | "yellow" | "blue";

interface AlertItemProps {
  level?: AlertLevel;
  title?: string;
  device?: string;
  /** 可选，任务名称，与 device 同屏展示 */
  taskName?: string;
  time?: string;
  isNew?: boolean;
}

const LEVEL_MAP = {
  red:    { color: "rgba(255, 59, 59, 1)",  bg: "rgba(255, 59, 59, 0.08)",  label: "红色" },
  yellow: { color: "rgba(255, 200, 0, 1)",  bg: "rgba(255, 200, 0, 0.08)",  label: "黄色" },
  blue:   { color: "rgba(0, 160, 255, 1)",  bg: "rgba(0, 160, 255, 0.08)",  label: "蓝色" },
};

const AlertItem: React.FC<AlertItemProps> = ({
  level = "yellow",
  title = "设备电量低于20%，请立即返航",
  device = "侦察小蜂 (D003)",
  taskName,
  time = "3分钟前",
  isNew = false,
}) => {
  const cfg = LEVEL_MAP[level];

  return (
    <div
      data-cmp="AlertItem"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        padding: "10px 12px",
        background: cfg.bg,
        borderLeft: `3px solid ${cfg.color}`,
        borderRadius: "0 4px 4px 0",
        marginBottom: "6px",
      }}
    >
      {/* Dot */}
      <div style={{ paddingTop: "4px", flexShrink: 0 }}>
        <div
          className={level === "red" ? "blink" : ""}
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: cfg.color,
            boxShadow: `0 0 6px ${cfg.color}`,
          }}
        />
      </div>

      <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px", flexWrap: "wrap" }}>
          {isNew && (
            <span
              style={{
                fontSize: "10px",
                padding: "0 4px",
                background: cfg.color,
                color: "rgba(6, 14, 35, 1)",
                borderRadius: "2px",
                fontWeight: 700,
              }}
            >
              NEW
            </span>
          )}
          <span style={{ fontSize: "13px", color: "rgba(220, 240, 255, 1)", fontWeight: 500, wordBreak: "break-word" }}>
            {title}
          </span>
        </div>
        <div style={{ fontSize: "11px", color: "rgba(80, 120, 170, 1)", wordBreak: "break-word" }}>
          {taskName ? (
            <>设备：{device} · 任务：{taskName}</>
          ) : (
            <span style={{ color: cfg.color }}>{device}</span>
          )}
        </div>
      </div>

      <span style={{ fontSize: "11px", color: "rgba(80, 130, 180, 1)", flexShrink: 0 }}>
        {time}
      </span>
    </div>
  );
};

export default AlertItem;
