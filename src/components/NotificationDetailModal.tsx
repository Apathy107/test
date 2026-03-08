import React, { useState } from "react";
import { X } from "lucide-react";
import type { NotificationItem } from "@/contexts/NotificationContext";

interface NotificationDetailModalProps {
  notification: NotificationItem;
  onClose: () => void;
  onSubmitFeedback: (id: string, feedback: string) => void;
}

export const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  notification,
  onClose,
  onSubmitFeedback,
}) => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    const text = feedback.trim();
    if (!text) return;
    onSubmitFeedback(notification.id, text);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-label="消息详情"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2100,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: 420,
          maxWidth: "95vw",
          maxHeight: "85vh",
          background: "rgba(3, 18, 40, 0.98)",
          border: "1px solid rgba(0, 170, 220, 0.4)",
          borderRadius: 8,
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
          <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(0, 210, 255, 1)" }}>消息详情</span>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", color: "rgba(140, 180, 220, 1)", cursor: "pointer", padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: 14, flex: 1, overflowY: "auto" }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "rgba(100, 160, 200, 1)", marginBottom: 4 }}>消息类型</div>
            <div style={{ fontSize: 13, color: "rgba(200, 230, 255, 1)" }}>{notification.category}</div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "rgba(100, 160, 200, 1)", marginBottom: 4 }}>标题</div>
            <div style={{ fontSize: 13, color: "rgba(200, 230, 255, 1)", lineHeight: 1.5 }}>{notification.title}</div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "rgba(100, 160, 200, 1)", marginBottom: 4 }}>摘要</div>
            <div style={{ fontSize: 12, color: "rgba(180, 220, 255, 0.95)", lineHeight: 1.5 }}>{notification.summary}</div>
          </div>
          {notification.receivers && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "rgba(100, 160, 200, 1)", marginBottom: 4 }}>接收人</div>
              <div style={{ fontSize: 12, color: "rgba(180, 220, 255, 0.95)" }}>{notification.receivers}</div>
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "rgba(100, 160, 200, 1)", marginBottom: 4 }}>时间</div>
            <div style={{ fontSize: 12, color: "rgba(180, 220, 255, 0.95)", fontFamily: "monospace" }}>{notification.time}</div>
          </div>
          <div style={{ borderTop: "1px solid rgba(0, 100, 150, 0.25)", paddingTop: 12, marginTop: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(0, 210, 255, 1)", marginBottom: 8 }}>处置反馈</div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="输入处置说明或反馈…"
              rows={3}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "8px 10px",
                fontSize: 12,
                background: "rgba(0, 25, 55, 0.8)",
                border: "1px solid rgba(0, 140, 200, 0.35)",
                borderRadius: 4,
                color: "rgba(200, 230, 255, 1)",
                resize: "vertical",
                minHeight: 60,
              }}
            />
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                marginTop: 8,
                padding: "6px 14px",
                fontSize: 12,
                background: "rgba(0, 120, 180, 0.5)",
                border: "1px solid rgba(0, 180, 220, 0.5)",
                borderRadius: 4,
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

export default NotificationDetailModal;
