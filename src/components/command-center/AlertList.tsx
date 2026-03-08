import React, { useEffect, useRef } from "react";
import { AlertTriangle, AlertCircle, Info, Bell } from "lucide-react";
import { AlertDetailModal } from "./AlertDetailModal";

/** 与 data/command-center/realtimeAlerts 同步的告警项（含设备+任务） */
export interface AlertListItem {
  id: number;
  level: "red" | "yellow" | "blue";
  message: string;
  time: string;
  device: string;
  taskName?: string;
  source?: "device" | "mission";
}

interface AlertListProps {
  alerts?: AlertListItem[];
  /** 提交反馈后标记已处置并同步消息管理 */
  onResolve?: (alertId: number, feedback: string, alert: { message: string; device: string; time: string; level: string }) => void;
}

const AlertList: React.FC<AlertListProps> = ({ alerts = [], onResolve }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);
  const [selectedAlert, setSelectedAlert] = React.useState<AlertListItem | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollInterval = setInterval(() => {
      scrollPosRef.current += 0.4;
      if (scrollPosRef.current >= container.scrollHeight - container.clientHeight) {
        scrollPosRef.current = 0;
      }
      container.scrollTop = scrollPosRef.current;
    }, 40);
    return () => clearInterval(scrollInterval);
  }, []);

  const levelConfig = {
    red: {
      color: "rgba(255, 65, 80, 1)",
      bg: "rgba(255, 50, 70, 0.07)",
      border: "rgba(255, 65, 80, 0.28)",
      leftBar: "rgba(255, 65, 80, 1)",
      icon: AlertCircle,
      label: "紧急",
    },
    yellow: {
      color: "rgba(255, 185, 0, 1)",
      bg: "rgba(255, 185, 0, 0.06)",
      border: "rgba(255, 185, 0, 0.22)",
      leftBar: "rgba(255, 185, 0, 1)",
      icon: AlertTriangle,
      label: "警告",
    },
    blue: {
      color: "rgba(0, 185, 255, 1)",
      bg: "rgba(0, 160, 255, 0.05)",
      border: "rgba(0, 160, 255, 0.18)",
      leftBar: "rgba(0, 185, 255, 0.6)",
      icon: Info,
      label: "通知",
    },
  };

  const redCount = alerts.filter((a) => a.level === "red").length;

  return (
    <div
      data-cmp="AlertList"
      className="fui-panel"
      style={{ borderRadius: "4px", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          flexShrink: 0,
          borderBottom: "1px solid rgba(0, 80, 120, 0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "18px",
              height: "18px",
              background: "rgba(60, 20, 20, 0.6)",
              border: "1px solid rgba(255, 80, 80, 0.35)",
              borderRadius: "3px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={11} style={{ color: "rgba(255, 100, 100, 1)" }} />
          </div>
          <span className="fui-title">实时告警</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div
            className="blink-alert"
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "rgba(255, 65, 80, 1)",
              boxShadow: "0 0 6px rgba(255,65,80,0.8)",
            }}
          />
          <span style={{ fontSize: "10px", color: "rgba(255, 65, 80, 1)", fontFamily: "monospace", fontWeight: 700 }}>
            {redCount} 紧急
          </span>
        </div>
      </div>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "hidden",
          padding: "4px 8px 6px",
          display: "flex",
          flexDirection: "column",
          gap: "3px",
        }}
      >
        {alerts.map((alert) => {
          const cfg = levelConfig[alert.level];
          const Icon = cfg.icon;
          return (
            <div
              key={alert.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedAlert(alert)}
              onKeyDown={(e) => e.key === "Enter" && setSelectedAlert(alert)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "6px",
                padding: "5px 7px",
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                borderRadius: "3px",
                borderLeft: `2px solid ${cfg.leftBar}`,
                position: "relative",
                flexShrink: 0,
                cursor: "pointer",
              }}
            >
              <Icon
                size={11}
                style={{ color: cfg.color, flexShrink: 0, marginTop: "1px" }}
                className={alert.level === "red" ? "blink-alert" : ""}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "11px", color: "rgba(190, 225, 245, 1)", lineHeight: 1.3, marginBottom: "2px" }}>
                  {alert.message}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span
                    style={{
                      fontSize: "9px",
                      color: cfg.color,
                      padding: "0 4px",
                      background: cfg.bg,
                      border: `1px solid ${cfg.border}`,
                      borderRadius: "2px",
                    }}
                  >
                    {cfg.label}
                  </span>
                  <span style={{ fontSize: "9px", color: "rgba(60, 120, 160, 1)", fontFamily: "monospace" }}>
                    {alert.device}
                  </span>
                  <span style={{ fontSize: "9px", color: "rgba(50, 110, 150, 1)", fontFamily: "monospace", marginLeft: "auto" }}>
                    {alert.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {selectedAlert && (
        <AlertDetailModal
          alert={selectedAlert}
          taskName={selectedAlert.taskName}
          source={selectedAlert.source}
          onClose={() => setSelectedAlert(null)}
          onResolve={onResolve}
        />
      )}
    </div>
  );
};

export default AlertList;
