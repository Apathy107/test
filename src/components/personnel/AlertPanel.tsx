import React from "react";
import { Bell, ClipboardList, Send, ChevronRight } from "lucide-react";

interface AlertItem {
  id: string;
  name: string;
  unit: string;
  daysLeft: number;
  urgency: "red" | "yellow" | "blue";
}

interface ApprovalItem {
  id: string;
  name: string;
  type: string;
  time: string;
}

interface AlertPanelProps {
  alerts?: AlertItem[];
  approvals?: ApprovalItem[];
}

const defaultAlerts: AlertItem[] = [
  { id: "1", name: "张伟", unit: "北方大队", daysLeft: -12, urgency: "red" },
  { id: "2", name: "李明", unit: "南方大队", daysLeft: 18, urgency: "red" },
  { id: "3", name: "赵磊", unit: "中央直属队", daysLeft: 25, urgency: "yellow" },
  { id: "4", name: "刘洋", unit: "西部中队", daysLeft: -5, urgency: "red" },
  { id: "5", name: "陈静", unit: "北方大队", daysLeft: 58, urgency: "blue" },
];

const defaultApprovals: ApprovalItem[] = [
  { id: "1", name: "孙鹏", type: "升级申请", time: "2小时前" },
  { id: "2", name: "周娜", type: "调动申请", time: "5小时前" },
  { id: "3", name: "王芳", type: "资质更新", time: "昨天" },
];

const urgencyConfig = {
  red: { bg: "rgba(255, 77, 79, 0.1)", border: "rgba(255, 77, 79, 0.3)", dot: "rgba(255, 77, 79, 1)", label: "rgba(255, 77, 79, 1)" },
  yellow: { bg: "rgba(250, 173, 20, 0.1)", border: "rgba(250, 173, 20, 0.3)", dot: "rgba(250, 173, 20, 1)", label: "rgba(250, 173, 20, 1)" },
  blue: { bg: "rgba(24, 144, 255, 0.08)", border: "rgba(24, 144, 255, 0.2)", dot: "rgba(24, 144, 255, 1)", label: "rgba(24, 144, 255, 1)" },
};

const AlertPanel: React.FC<AlertPanelProps> = ({ alerts = defaultAlerts, approvals = defaultApprovals }) => {
  return (
    <div
      data-cmp="AlertPanel"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        overflowY: "auto",
        width: 260,
        flexShrink: 0,
        background: "rgba(18, 22, 30, 1)",
        borderLeft: "1px solid rgba(40, 48, 66, 1)",
        padding: "20px 16px",
        minHeight: "100%",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Bell size={15} style={{ color: "rgba(255, 77, 79, 1)" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(224, 228, 236, 1)" }}>资质到期预警</span>
          </div>
          <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 999, fontWeight: 500, background: "rgba(255, 77, 79, 0.15)", color: "rgba(255, 77, 79, 1)" }}>{alerts.length}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {alerts.map((alert) => {
            const cfg = urgencyConfig[alert.urgency];
            const isExpired = alert.daysLeft <= 0;
            return (
              <div key={alert.id} style={{ borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 8, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(224, 228, 236, 1)" }}>{alert.name}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "rgba(120, 130, 150, 1)" }}>{alert.unit}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: cfg.label }}>{isExpired ? `已逾期 ${Math.abs(alert.daysLeft)} 天` : `剩余 ${alert.daysLeft} 天`}</span>
                  <button onClick={() => {}} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, padding: "4px 8px", borderRadius: 6, background: cfg.bg, color: cfg.label, border: `1px solid ${cfg.border}`, cursor: "pointer" }}>
                    <Send size={10} />
                    提醒
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, borderTop: "1px solid rgba(40, 48, 66, 1)", paddingTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ClipboardList size={15} style={{ color: "rgba(24, 144, 255, 1)" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(224, 228, 236, 1)" }}>待办审批</span>
          </div>
          <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 999, fontWeight: 500, background: "rgba(24, 144, 255, 0.15)", color: "rgba(24, 144, 255, 1)" }}>{approvals.length}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {approvals.map((item) => (
            <div
              key={item.id}
              onClick={() => {}}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 12, borderRadius: 8, background: "rgba(30, 36, 50, 1)", border: "1px solid rgba(40, 48, 66, 1)", cursor: "pointer" }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(224, 228, 236, 1)" }}>{item.name}</span>
                <span style={{ fontSize: 12, color: "rgba(24, 144, 255, 1)" }}>{item.type}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 12, color: "rgba(120, 130, 150, 1)" }}>{item.time}</span>
                <ChevronRight size={13} style={{ color: "rgba(120, 130, 150, 1)" }} />
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => {}} style={{ width: "100%", textAlign: "center", fontSize: 12, padding: "8px", borderRadius: 8, background: "rgba(24, 144, 255, 0.1)", color: "rgba(24, 144, 255, 1)", border: "1px solid rgba(24, 144, 255, 0.2)", cursor: "pointer" }}>
          查看全部待办
        </button>
      </div>
    </div>
  );
};

export default AlertPanel;
