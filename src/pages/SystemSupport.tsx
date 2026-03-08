import React from "react";
import { Server, HardDrive, Wifi, Shield, RefreshCw, CheckCircle } from "lucide-react";
import ModulePageLayout from "@/components/ModulePageLayout";

const COLOR = "rgb(50, 218, 255)";
const GLOW = "rgba(50, 218, 255, 0.4)";

/**
 * SystemSupport - 系统支撑平台 page
 */
const SystemSupport: React.FC = () => {
  console.log("SystemSupport page rendered");

  const services = [
    { name: "核心调度服务", status: "运行中", cpu: 23, mem: 41, uptime: "99.98%", version: "v3.2.1" },
    { name: "数据存储服务", status: "运行中", cpu: 15, mem: 68, uptime: "99.99%", version: "v2.8.0" },
    { name: "通信中继服务", status: "运行中", cpu: 8, mem: 32, uptime: "99.95%", version: "v4.1.2" },
    { name: "AI推理引擎", status: "运行中", cpu: 76, mem: 85, uptime: "99.87%", version: "v1.5.3" },
    { name: "地图服务", status: "维护中", cpu: 0, mem: 12, uptime: "98.20%", version: "v2.3.0" },
    { name: "用户认证服务", status: "运行中", cpu: 5, mem: 28, uptime: "100%", version: "v3.0.5" },
  ];

  const systemStats = [
    { label: "服务总数", value: "18", icon: Server },
    { label: "存储容量", value: "48TB", icon: HardDrive },
    { label: "网络带宽", value: "10Gbps", icon: Wifi },
    { label: "安全等级", value: "Level 3", icon: Shield },
  ];

  return (
    <ModulePageLayout title="系统支撑平台" subtitle="SYSTEM SUPPORT PLATFORM" icon={Server} color={COLOR} glowColor={GLOW}>
      {/* Stats */}
      <div className="flex gap-5 mb-7">
        {systemStats.map((s, i) => (
          <div key={i} style={{ flex: 1, background: "rgba(0, 15, 50, 0.8)", border: `1px solid ${GLOW}`, borderRadius: "4px", padding: "18px 22px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "40px", height: "40px", border: `1px solid ${GLOW}`, borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0, 60, 130, 0.4)" }}>
              <s.icon size={18} style={{ color: COLOR }} />
            </div>
            <div>
              <div style={{ fontSize: "20px", fontWeight: "700", color: "rgb(220, 245, 255)", fontFamily: "monospace" }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "rgba(0, 160, 200, 0.55)", fontFamily: "'Microsoft YaHei', sans-serif" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Services table */}
      <div style={{ background: "rgba(0, 12, 45, 0.8)", border: `1px solid ${GLOW}`, borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${GLOW}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Server size={14} style={{ color: COLOR }} />
            <span style={{ fontSize: "14px", fontWeight: "700", color: "rgb(200, 235, 255)", letterSpacing: "0.12em", fontFamily: "'Microsoft YaHei', sans-serif" }}>服务状态监控</span>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: "5px", padding: "4px 12px", border: `1px solid ${GLOW}`, borderRadius: "3px", background: "rgba(0, 50, 100, 0.4)", color: COLOR, fontSize: "11px", cursor: "pointer", fontFamily: "'Microsoft YaHei', sans-serif" }}>
            <RefreshCw size={11} /><span>刷新</span>
          </button>
        </div>
        <div style={{ display: "flex", padding: "10px 20px", background: "rgba(0, 30, 80, 0.5)", borderBottom: "1px solid rgba(0, 130, 180, 0.15)" }}>
          {["服务名称", "状态", "CPU使用率", "内存使用率", "可用性", "版本"].map((h) => (
            <div key={h} style={{ flex: 1, fontSize: "11px", color: "rgba(0, 160, 200, 0.55)", fontFamily: "monospace", letterSpacing: "0.1em" }}>{h}</div>
          ))}
        </div>
        {services.map((svc, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderBottom: i < services.length - 1 ? "1px solid rgba(0, 100, 160, 0.12)" : "none" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0, 40, 100, 0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <div style={{ flex: 1, fontSize: "13px", color: "rgb(200, 235, 255)", fontFamily: "'Microsoft YaHei', sans-serif", display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircle size={13} style={{ color: svc.status === "运行中" ? "rgb(0, 210, 120)" : "rgb(255, 160, 0)" }} />
              {svc.name}
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "2px", background: svc.status === "运行中" ? "rgba(0, 200, 100, 0.15)" : "rgba(255, 160, 0, 0.15)", color: svc.status === "运行中" ? "rgb(0, 210, 120)" : "rgb(255, 160, 0)" }}>{svc.status}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "80px", height: "4px", background: "rgba(0, 60, 120, 0.5)", borderRadius: "2px" }}>
                  <div style={{ width: `${svc.cpu}%`, height: "100%", background: svc.cpu > 70 ? "rgb(255, 100, 80)" : COLOR, borderRadius: "2px" }} />
                </div>
                <span style={{ fontSize: "11px", color: "rgba(0, 180, 220, 0.7)", fontFamily: "monospace" }}>{svc.cpu}%</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "80px", height: "4px", background: "rgba(0, 60, 120, 0.5)", borderRadius: "2px" }}>
                  <div style={{ width: `${svc.mem}%`, height: "100%", background: svc.mem > 80 ? "rgb(255, 100, 80)" : "rgb(180, 120, 255)", borderRadius: "2px" }} />
                </div>
                <span style={{ fontSize: "11px", color: "rgba(0, 180, 220, 0.7)", fontFamily: "monospace" }}>{svc.mem}%</span>
              </div>
            </div>
            <div style={{ flex: 1, fontSize: "12px", color: "rgb(0, 210, 120)", fontFamily: "monospace" }}>{svc.uptime}</div>
            <div style={{ flex: 1, fontSize: "11px", color: "rgba(0, 160, 200, 0.5)", fontFamily: "monospace" }}>{svc.version}</div>
          </div>
        ))}
      </div>
    </ModulePageLayout>
  );
};

export default SystemSupport;