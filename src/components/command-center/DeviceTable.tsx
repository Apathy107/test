import React from "react";
import { Battery, Activity } from "lucide-react";
import { useCommandCenter } from "./CommandCenterContext";

const DeviceTable: React.FC = () => {
  const { devices, setFlyToDeviceId } = useCommandCenter();
  const statusConfig: Record<string, { color: string; bg: string; dot: string }> = {
    执行任务: { color: "rgba(0, 210, 255, 1)", bg: "rgba(0,210,255,0.1)", dot: "rgba(0,210,255,1)" },
    待命: { color: "rgba(0, 255, 180, 1)", bg: "rgba(0,255,180,0.08)", dot: "rgba(0,255,180,1)" },
    返航: { color: "rgba(255, 185, 0, 1)", bg: "rgba(255,185,0,0.08)", dot: "rgba(255,185,0,1)" },
    充电: { color: "rgba(150, 100, 255, 1)", bg: "rgba(150,100,255,0.08)", dot: "rgba(150,100,255,1)" },
    异常: { color: "rgba(255, 65, 80, 1)", bg: "rgba(255,65,80,0.1)", dot: "rgba(255,65,80,1)" },
  };

  const handleRowClick = (deviceId: string) => {
    setFlyToDeviceId(deviceId);
  };

  const getBatteryColor = (v: number) => {
    if (v > 40) return "rgba(0, 255, 180, 1)";
    if (v > 20) return "rgba(255, 185, 0, 1)";
    return "rgba(255, 65, 80, 1)";
  };

  return (
    <div
      data-cmp="DeviceTable"
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
          borderBottom: "1px solid rgba(0, 70, 110, 0.25)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div
            style={{
              width: "18px",
              height: "18px",
              background: "rgba(0, 40, 80, 0.6)",
              border: "1px solid rgba(0, 180, 220, 0.35)",
              borderRadius: "3px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Activity size={11} style={{ color: "rgba(0, 210, 255, 1)" }} />
          </div>
          <span className="fui-title">设备实时列表</span>
        </div>
        <span style={{ fontSize: "10px", color: "rgba(60, 130, 170, 1)", fontFamily: "monospace" }}>
          {devices.length} 台设备
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "4px 12px",
          background: "rgba(0, 30, 65, 0.35)",
          borderBottom: "1px solid rgba(0,70,110,0.2)",
          flexShrink: 0,
          fontSize: "9px",
          color: "rgba(0, 140, 190, 0.8)",
          letterSpacing: "0.08em",
        }}
      >
        <span style={{ width: "58px" }}>设备ID</span>
        <span style={{ flex: 1 }}>电量</span>
        <span style={{ width: "52px" }}>信号</span>
        <span style={{ width: "60px" }}>状态</span>
        <span style={{ flex: 1 }}>当前任务</span>
      </div>

      <div style={{ overflowY: "auto", flex: 1 }}>
        {devices.map((device, idx) => {
          const sc = statusConfig[device.taskStatus] || statusConfig["待命"];
          const battColor = getBatteryColor(device.battery);
          return (
            <div
              key={device.id}
              role="button"
              tabIndex={0}
              onClick={() => handleRowClick(device.id)}
              onKeyDown={(e) => e.key === "Enter" && handleRowClick(device.id)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "5px 12px",
                borderBottom: "1px solid rgba(0,50,90,0.18)",
                cursor: "pointer",
                background: idx % 2 === 0 ? "transparent" : "rgba(0,30,60,0.08)",
              }}
            >
              <span style={{ width: "58px", fontFamily: "monospace", fontSize: "11px", color: "rgba(0, 210, 255, 1)", fontWeight: 700 }}>
                {device.sn}
              </span>

              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "5px" }}>
                <Battery size={10} style={{ color: battColor, flexShrink: 0 }} />
                <div style={{ flex: 1, height: "3px", background: "rgba(0,30,60,0.8)", borderRadius: "2px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${device.battery}%`,
                      height: "100%",
                      background: battColor,
                      boxShadow: `0 0 4px ${battColor}`,
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
                <span style={{ width: "26px", textAlign: "right", fontFamily: "monospace", fontSize: "9px", color: battColor }}>
                  {device.battery}%
                </span>
              </div>

              <div style={{ width: "52px", display: "flex", alignItems: "flex-end", gap: "2px", paddingLeft: "6px" }}>
                {[1, 2, 3, 4, 5].map((bar) => (
                  <div
                    key={bar}
                    style={{
                      width: "3px",
                      height: `${bar * 3}px`,
                      borderRadius: "1px",
                      background: bar <= device.signal ? "rgba(0, 210, 255, 0.9)" : "rgba(0, 60, 100, 0.4)",
                    }}
                  />
                ))}
              </div>

              <div style={{ width: "60px", display: "flex", alignItems: "center", gap: "3px" }}>
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: sc.dot, boxShadow: `0 0 4px ${sc.dot}`, flexShrink: 0 }} />
                <span style={{ fontSize: "9px", color: sc.color, letterSpacing: "0.02em" }}>{device.taskStatus}</span>
              </div>

              <span style={{
                flex: 1,
                fontSize: "9px",
                color: "rgba(100, 170, 210, 0.9)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {device.taskName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeviceTable;
