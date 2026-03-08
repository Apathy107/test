import React, { useState } from "react";
import { Battery, Signal, Activity, ChevronRight } from "lucide-react";

type DeviceTab = "airport" | "uav" | "payload" | "tethered";

interface Device {
  id: string;
  name: string;
  unit: string;
  model: string;
  status: "online" | "offline" | "active" | "fault";
  battery: number;
  signal: number;
  todayTasks: number;
  activeTaskId?: string;
  progress?: number;
  remainMin?: number;
}

const devicesByTab: Record<DeviceTab, Device[]> = {
  airport: [
    { id: "AP-001", name: "大疆机场-A型", unit: "某分局", model: "DJI Dock 2", status: "online", battery: 100, signal: 4, todayTasks: 3, activeTaskId: "T-2023", progress: 65, remainMin: 12 },
    { id: "AP-002", name: "大疆机场-B型", unit: "某派出所", model: "DJI Dock 2", status: "online", battery: 100, signal: 4, todayTasks: 1 },
    { id: "AP-003", name: "御4机场", unit: "某分局", model: "DJI Dock 1", status: "offline", battery: 100, signal: 0, todayTasks: 0 },
  ],
  uav: [
    { id: "UAV-001", name: "大疆M30T-01", unit: "某分局", model: "M30T", status: "active", battery: 78, signal: 4, todayTasks: 2, activeTaskId: "T-2023", progress: 65, remainMin: 12 },
    { id: "UAV-002", name: "大疆M30T-02", unit: "某派出所", model: "M30T", status: "active", battery: 65, signal: 3, todayTasks: 3, activeTaskId: "T-2024", progress: 40, remainMin: 25 },
    { id: "UAV-003", name: "御3T-01", unit: "某分局", model: "Mavic 3T", status: "online", battery: 90, signal: 4, todayTasks: 1 },
    { id: "UAV-004", name: "御3T-02", unit: "某派出所", model: "Mavic 3T", status: "offline", battery: 45, signal: 0, todayTasks: 0 },
  ],
  payload: [
    { id: "PL-001", name: "三光吊舱-01", unit: "某分局", model: "ZT30", status: "active", battery: 55, signal: 3, todayTasks: 1, activeTaskId: "T-2023", progress: 65, remainMin: 12 },
    { id: "PL-002", name: "变焦吊舱-01", unit: "某派出所", model: "H20T", status: "online", battery: 80, signal: 4, todayTasks: 2 },
  ],
  tethered: [
    { id: "TH-001", name: "系留-01", unit: "某分局", model: "T50", status: "online", battery: 100, signal: 4, todayTasks: 0 },
    { id: "TH-002", name: "系留-02", unit: "某派出所", model: "T50", status: "offline", battery: 100, signal: 0, todayTasks: 0 },
  ],
};

const tabConfig: { key: DeviceTab; label: string; color: string }[] = [
  { key: "airport", label: "机场", color: "rgb(0, 180, 255)" },
  { key: "uav", label: "单兵飞机", color: "rgb(0, 220, 150)" },
  { key: "payload", label: "负载", color: "rgb(255, 200, 0)" },
  { key: "tethered", label: "系留", color: "rgb(180, 100, 255)" },
];

const statusConfig = {
  online: { label: "在线", color: "rgb(0, 220, 150)" },
  offline: { label: "离线", color: "rgb(120, 130, 140)" },
  active: { label: "执行中", color: "rgb(0, 180, 255)" },
  fault: { label: "故障", color: "rgb(255, 80, 80)" },
};

/**
 * CommandDeviceList - Tabbed device status list panel
 */
const CommandDeviceList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DeviceTab>("uav");
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  console.log("CommandDeviceList rendered, tab:", activeTab);

  const devices = devicesByTab[activeTab];

  return (
    <div data-cmp="CommandDeviceList" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
        {tabConfig.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, padding: "6px 0",
              border: `1px solid ${activeTab === tab.key ? tab.color : "rgba(0, 150, 200, 0.25)"}`,
              borderRadius: "3px",
              background: activeTab === tab.key ? `${tab.color.replace("rgb", "rgba").replace(")", ", 0.15)")}` : "rgba(0, 15, 45, 0.6)",
              color: activeTab === tab.key ? tab.color : "rgba(0, 180, 220, 0.5)",
              fontSize: "12px", fontFamily: "'Microsoft YaHei', sans-serif",
              cursor: "pointer", transition: "all 0.2s",
              boxShadow: activeTab === tab.key ? `0 0 8px ${tab.color.replace("rgb", "rgba").replace(")", ", 0.3)")}` : "none",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Device list */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
        {devices.map(device => {
          const st = statusConfig[device.status];
          const isSelected = selectedDevice === device.id;
          const tabColor = tabConfig.find(t => t.key === activeTab)?.color || "rgb(0, 212, 255)";

          return (
            <div
              key={device.id}
              onClick={() => setSelectedDevice(isSelected ? null : device.id)}
              style={{
                background: isSelected
                  ? `linear-gradient(90deg, ${tabColor.replace("rgb", "rgba").replace(")", ", 0.1)")}, rgba(0, 10, 30, 0.9))`
                  : "rgba(0, 10, 30, 0.75)",
                border: `1px solid ${isSelected ? tabColor.replace("rgb", "rgba").replace(")", ", 0.45)") : "rgba(0, 130, 180, 0.2)"}`,
                borderRadius: "3px",
                padding: "8px 10px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {/* Row 1: ID + name + status */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                <span style={{ fontSize: "10px", color: "rgba(0, 180, 220, 0.5)", fontFamily: "monospace", flexShrink: 0 }}>{device.id}</span>
                <span style={{ fontSize: "12px", color: "rgb(200, 235, 255)", fontFamily: "'Microsoft YaHei', sans-serif", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{device.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "3px", flexShrink: 0 }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: st.color, boxShadow: `0 0 4px ${st.color}` }} />
                  <span style={{ fontSize: "10px", color: st.color, fontFamily: "monospace" }}>{st.label}</span>
                </div>
              </div>

              {/* Row 2: Battery + Signal + Unit */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                  <Battery size={11} style={{ color: device.battery > 60 ? "rgb(0, 220, 150)" : device.battery > 30 ? "rgb(255, 200, 0)" : "rgb(255, 80, 80)" }} />
                  <div style={{ width: "36px", height: "4px", background: "rgba(0, 150, 200, 0.2)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${device.battery}%`, background: device.battery > 60 ? "rgb(0, 220, 150)" : device.battery > 30 ? "rgb(255, 200, 0)" : "rgb(255, 80, 80)", borderRadius: "2px" }} />
                  </div>
                  <span style={{ fontSize: "10px", color: "rgba(0, 180, 220, 0.6)", fontFamily: "monospace" }}>{device.battery}%</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                  <Signal size={11} style={{ color: device.signal > 2 ? "rgb(0, 200, 220)" : "rgb(120, 130, 140)" }} />
                  <span style={{ fontSize: "10px", color: "rgba(0, 180, 220, 0.5)", fontFamily: "monospace" }}>{device.signal}/4</span>
                </div>
                <span style={{ fontSize: "10px", color: "rgba(0, 180, 220, 0.4)", fontFamily: "monospace", flex: 1 }}>{device.unit}</span>
                <span style={{ fontSize: "10px", color: "rgba(0, 180, 220, 0.35)", fontFamily: "monospace" }}>今日:{device.todayTasks}任务</span>
              </div>

              {/* Row 3: Active task progress */}
              {device.activeTaskId && device.progress !== undefined && (
                <div style={{ marginTop: "5px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                    <span style={{ fontSize: "10px", color: "rgba(0, 180, 255, 0.7)", fontFamily: "monospace" }}>执行中: {device.activeTaskId}</span>
                    <span style={{ fontSize: "10px", color: "rgba(0, 180, 220, 0.5)", fontFamily: "monospace" }}>剩余{device.remainMin}min</span>
                  </div>
                  <div style={{ height: "3px", background: "rgba(0, 150, 200, 0.2)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${device.progress}%`, background: "linear-gradient(90deg, rgb(0, 150, 255), rgb(0, 210, 255))", borderRadius: "2px" }} />
                  </div>
                </div>
              )}

              {/* Expand icon */}
              <ChevronRight size={10} style={{ position: "absolute", right: "8px", top: "50%", transform: `translateY(-50%) rotate(${isSelected ? "90deg" : "0"})`, color: "rgba(0, 180, 220, 0.35)", transition: "transform 0.2s", pointerEvents: "none" }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommandDeviceList;