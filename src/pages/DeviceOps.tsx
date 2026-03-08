import React from "react";
import { Wrench, CheckCircle, AlertCircle, Clock, Package } from "lucide-react";
import ModulePageLayout from "@/components/ModulePageLayout";

const COLOR = "rgb(0, 195, 248)";
const GLOW = "rgba(0, 195, 248, 0.4)";

/**
 * DeviceOps - 设备运维管理 page
 */
const DeviceOps: React.FC = () => {
  console.log("DeviceOps page rendered");

  const devices = [
    { id: "DJI-M300-001", type: "M300 RTK", status: "正常", lastCheck: "2025-07-10", nextCheck: "2025-08-10", health: 95 },
    { id: "DJI-M300-002", type: "M300 RTK", status: "维修中", lastCheck: "2025-07-01", nextCheck: "2025-07-20", health: 42 },
    { id: "AUTEL-EVO-003", type: "EVO II Pro", status: "正常", lastCheck: "2025-07-08", nextCheck: "2025-08-08", health: 88 },
    { id: "DJI-FPV-004", type: "FPV Combo", status: "待检修", lastCheck: "2025-06-20", nextCheck: "2025-07-15", health: 61 },
    { id: "DJI-M30-005", type: "M30T", status: "正常", lastCheck: "2025-07-12", nextCheck: "2025-08-12", health: 99 },
  ];

  const summary = [
    { label: "设备总数", value: "32", icon: Package, color: COLOR },
    { label: "运行正常", value: "26", icon: CheckCircle, color: "rgb(0, 210, 120)" },
    { label: "待维护", value: "4", icon: Clock, color: "rgb(255, 180, 0)" },
    { label: "故障设备", value: "2", icon: AlertCircle, color: "rgb(255, 80, 80)" },
  ];

  const getStatusColor = (s: string) =>
    s === "正常" ? "rgb(0, 210, 120)" : s === "维修中" ? "rgb(255, 80, 80)" : "rgb(255, 180, 0)";

  return (
    <ModulePageLayout title="设备运维管理" subtitle="DEVICE OPERATIONS MANAGEMENT" icon={Wrench} color={COLOR} glowColor={GLOW}>
      {/* Summary */}
      <div className="flex gap-6 mb-8">
        {summary.map((s, i) => (
          <div key={i} style={{ flex: 1, background: "rgba(0, 15, 50, 0.8)", border: `1px solid rgba(0, 180, 220, 0.25)`, borderRadius: "4px", padding: "18px 22px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "44px", height: "44px", border: `1px solid ${s.color.replace("rgb", "rgba").replace(")", ", 0.4)")}`, borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", background: s.color.replace("rgb", "rgba").replace(")", ", 0.12)") }}>
              <s.icon size={20} style={{ color: s.color }} />
            </div>
            <div>
              <div style={{ fontSize: "26px", fontWeight: "700", color: "rgb(220, 245, 255)", fontFamily: "monospace" }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "rgba(0, 160, 200, 0.55)", fontFamily: "'Microsoft YaHei', sans-serif" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Device table */}
      <div style={{ background: "rgba(0, 12, 45, 0.8)", border: `1px solid ${GLOW}`, borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${GLOW}`, display: "flex", alignItems: "center", gap: "8px" }}>
          <Wrench size={14} style={{ color: COLOR }} />
          <span style={{ fontSize: "14px", fontWeight: "700", color: "rgb(200, 235, 255)", letterSpacing: "0.12em", fontFamily: "'Microsoft YaHei', sans-serif" }}>设备台账</span>
        </div>
        {/* Table header */}
        <div style={{ display: "flex", padding: "10px 20px", background: "rgba(0, 30, 80, 0.5)", borderBottom: "1px solid rgba(0, 130, 180, 0.15)" }}>
          {["设备编号", "设备型号", "运行状态", "上次检修", "下次检修", "健康度"].map((h) => (
            <div key={h} style={{ flex: 1, fontSize: "11px", color: "rgba(0, 160, 200, 0.55)", fontFamily: "monospace", letterSpacing: "0.1em" }}>{h}</div>
          ))}
        </div>
        {devices.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderBottom: i < devices.length - 1 ? "1px solid rgba(0, 100, 160, 0.12)" : "none", transition: "background 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0, 40, 100, 0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <div style={{ flex: 1, fontSize: "13px", color: COLOR, fontFamily: "monospace" }}>{d.id}</div>
            <div style={{ flex: 1, fontSize: "13px", color: "rgb(180, 220, 255)", fontFamily: "'Microsoft YaHei', sans-serif" }}>{d.type}</div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "2px", background: getStatusColor(d.status).replace("rgb", "rgba").replace(")", ", 0.15)"), color: getStatusColor(d.status), fontFamily: "monospace" }}>{d.status}</span>
            </div>
            <div style={{ flex: 1, fontSize: "12px", color: "rgba(0, 160, 200, 0.6)", fontFamily: "monospace" }}>{d.lastCheck}</div>
            <div style={{ flex: 1, fontSize: "12px", color: "rgba(0, 160, 200, 0.6)", fontFamily: "monospace" }}>{d.nextCheck}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ flex: 1, height: "4px", background: "rgba(0, 60, 120, 0.5)", borderRadius: "2px" }}>
                  <div style={{ width: `${d.health}%`, height: "100%", background: d.health > 80 ? "rgb(0, 210, 120)" : d.health > 50 ? "rgb(255, 180, 0)" : "rgb(255, 80, 80)", borderRadius: "2px" }} />
                </div>
                <span style={{ fontSize: "11px", color: "rgb(180, 220, 255)", fontFamily: "monospace", width: "36px" }}>{d.health}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ModulePageLayout>
  );
};

export default DeviceOps;