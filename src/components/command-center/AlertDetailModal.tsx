import React, { useState } from "react";
import { X, AlertCircle, AlertTriangle, Info } from "lucide-react";
import type { AlertListItem } from "./AlertList";

interface AlertDetailModalProps {
  alert: AlertListItem;
  taskName?: string;
  source?: string;
  onClose: () => void;
  /** 提交反馈后标记已处置并同步消息管理，随后关闭弹窗 */
  onResolve?: (alertId: number, feedback: string, alert: { message: string; device: string; time: string; level: string }) => void;
}

const levelConfig = {
  red: { color: "rgba(255, 65, 80, 1)", label: "紧急", icon: AlertCircle },
  yellow: { color: "rgba(255, 185, 0, 1)", label: "警告", icon: AlertTriangle },
  blue: { color: "rgba(0, 185, 255, 1)", label: "通知", icon: Info },
};

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alert,
  taskName,
  source,
  onClose,
  onResolve,
}) => {
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbacks, setFeedbacks] = useState<string[]>([]);
  const cfg = levelConfig[alert.level];
  const Icon = cfg.icon;

  const handleSubmitFeedback = () => {
    const text = feedbackText.trim();
    if (!text) return;
    setFeedbacks((prev) => [...prev, text]);
    setFeedbackText("");
    if (onResolve) {
      onResolve(alert.id, text, { message: alert.message, device: alert.device, time: alert.time, level: alert.level });
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-label="告警明细"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: "400px",
          maxWidth: "95vw",
          maxHeight: "85vh",
          background: "rgba(3, 18, 40, 0.98)",
          border: "1px solid rgba(0, 170, 220, 0.4)",
          borderRadius: "8px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "12px 14px",
            borderBottom: "1px solid rgba(0, 120, 180, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(0, 50, 90, 0.4)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Icon size={18} style={{ color: cfg.color }} />
            <span style={{ fontSize: "14px", fontWeight: 700, color: "rgba(0, 210, 255, 1)" }}>
              告警明细
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", color: "rgba(140, 180, 220, 1)", cursor: "pointer", padding: "4px" }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "14px", flex: 1, overflowY: "auto" }}>
          <div style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "11px", color: "rgba(100, 160, 200, 1)", marginBottom: "4px" }}>级别</div>
            <span
              style={{
                fontSize: "12px",
                padding: "2px 8px",
                borderRadius: "4px",
                background: `${cfg.color}20`,
                border: `1px solid ${cfg.color}50`,
                color: cfg.color,
                fontWeight: 600,
              }}
            >
              {cfg.label}
            </span>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "11px", color: "rgba(100, 160, 200, 1)", marginBottom: "4px" }}>告警内容</div>
            <div style={{ fontSize: "13px", color: "rgba(200, 230, 255, 1)", lineHeight: 1.5 }}>{alert.message}</div>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "11px", color: "rgba(100, 160, 200, 1)", marginBottom: "4px" }}>关联设备</div>
            <div style={{ fontSize: "12px", color: "rgba(180, 220, 255, 1)", fontFamily: "monospace" }}>{alert.device}</div>
          </div>
          {taskName && (
            <div style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: "11px", color: "rgba(100, 160, 200, 1)", marginBottom: "4px" }}>关联任务</div>
              <div style={{ fontSize: "12px", color: "rgba(180, 220, 255, 1)" }}>{taskName}</div>
            </div>
          )}
          <div style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "11px", color: "rgba(100, 160, 200, 1)", marginBottom: "4px" }}>发生时间</div>
            <div style={{ fontSize: "12px", color: "rgba(180, 220, 255, 1)", fontFamily: "monospace" }}>{alert.time}</div>
          </div>
          {source && (
            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "11px", color: "rgba(100, 160, 200, 1)", marginBottom: "4px" }}>来源</div>
              <div style={{ fontSize: "12px", color: "rgba(180, 220, 255, 1)" }}>{source === "device" ? "设备运维" : "任务调度"}</div>
            </div>
          )}

          <div style={{ borderTop: "1px solid rgba(0, 100, 150, 0.25)", paddingTop: "12px", marginTop: "12px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(0, 210, 255, 1)", marginBottom: "8px" }}>
              处置反馈
            </div>
            {feedbacks.length > 0 && (
              <div style={{ marginBottom: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                {feedbacks.map((text, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: "11px",
                      color: "rgba(190, 220, 245, 1)",
                      background: "rgba(0, 40, 80, 0.4)",
                      border: "1px solid rgba(0, 120, 180, 0.25)",
                      borderRadius: "4px",
                      padding: "6px 8px",
                      lineHeight: 1.4,
                    }}
                  >
                    {text}
                  </div>
                ))}
              </div>
            )}
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="输入处置说明或反馈..."
              rows={3}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "8px 10px",
                fontSize: "12px",
                background: "rgba(0, 25, 55, 0.8)",
                border: "1px solid rgba(0, 140, 200, 0.35)",
                borderRadius: "4px",
                color: "rgba(200, 230, 255, 1)",
                resize: "vertical",
                minHeight: "60px",
              }}
            />
            <button
              type="button"
              onClick={handleSubmitFeedback}
              style={{
                marginTop: "8px",
                padding: "6px 14px",
                fontSize: "12px",
                background: "rgba(0, 120, 180, 0.5)",
                border: "1px solid rgba(0, 180, 220, 0.5)",
                borderRadius: "4px",
                color: "rgba(0, 220, 255, 1)",
                cursor: "pointer",
              }}
            >
              提交反馈
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
