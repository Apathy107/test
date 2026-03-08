import React, { useState } from "react";
import { AlertTriangle, Navigation, Camera, FileOutput, Zap } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface Device {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  status: "active" | "pending" | "paused";
  battery: number;
}

interface EmergencyPanelProps {
  eventName?: string;
  eventLocation?: string;
  eventTime?: string;
  devices?: Device[];
}

const defaultDevices: Device[] = [
  { id: "d1", name: "无人机-001", type: "无人机", x: 35, y: 40, status: "active", battery: 82 },
  { id: "d2", name: "无人机-005", type: "无人机", x: 60, y: 55, status: "active", battery: 67 },
  { id: "d3", name: "机器狗-003", type: "机器狗", x: 45, y: 65, status: "pending", battery: 91 },
  { id: "d4", name: "机器人-002", type: "机器人", x: 70, y: 38, status: "paused", battery: 44 },
];

const EmergencyPanel: React.FC<EmergencyPanelProps> = ({
  eventName = "外滩路段交通事故",
  eventLocation = "外滩中山东一路18号附近",
  eventTime = "2025-06-13 11:02:44",
  devices = defaultDevices,
}) => {
  const [launched, setLaunched] = useState(false);

  console.log("EmergencyPanel rendered, launched:", launched);

  return (
    <div data-cmp="EmergencyPanel" className="flex flex-col h-full">
      {/* Emergency Alert */}
      <div
        className="px-4 py-3"
        style={{
          background: "rgba(255,60,80,0.08)",
          borderBottom: "1px solid rgba(255,60,80,0.2)",
        }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} style={{ color: "rgb(255,80,100)", flexShrink: 0, marginTop: "2px" }} />
          <div>
            <div className="text-sm font-bold" style={{ color: "rgb(255,80,100)" }}>
              {eventName}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "rgb(200,235,255)" }}>
              📍 {eventLocation}
            </div>
            <div className="text-xs" style={{ color: "rgb(120,180,210)" }}>
              🕐 {eventTime}
            </div>
          </div>
        </div>

        {/* Emergency Launch Button */}
        <button
          onClick={() => setLaunched(true)}
          className="w-full mt-3 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all"
          style={{
            background: launched
              ? "rgba(80,230,180,0.15)"
              : "rgba(255,60,80,0.2)",
            border: launched
              ? "1px solid rgba(80,230,180,0.4)"
              : "1px solid rgba(255,60,80,0.5)",
            color: launched ? "rgb(80,230,180)" : "rgb(255,80,100)",
            boxShadow: launched
              ? "0 0 12px rgba(80,230,180,0.2)"
              : "0 0 16px rgba(255,60,80,0.3)",
          }}
        >
          <Zap size={16} />
          {launched ? "✓ 应急响应已启动" : "一键发起应急响应"}
        </button>
      </div>

      {/* Device Coordination Map - Mini */}
      <div
        className="relative px-2 py-3"
        style={{
          borderBottom: "1px solid rgba(0,212,255,0.15)",
          background: "rgb(5,15,38)",
        }}
      >
        <div className="text-xs mb-2 px-2" style={{ color: "rgb(120,180,210)" }}>
          设备编队分布
        </div>
        <div
          className="relative rounded overflow-hidden mx-2"
          style={{ height: "120px", background: "rgb(5,12,32)" }}
        >
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.15 }}>
            <defs>
              <pattern id="miniGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,212,255,0.5)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#miniGrid)" />
          </svg>
          {/* Event marker */}
          <div
            className="absolute flex items-center justify-center rounded-full"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "24px",
              height: "24px",
              background: "rgba(255,60,80,0.2)",
              border: "2px solid rgba(255,60,80,0.6)",
              boxShadow: "0 0 12px rgba(255,60,80,0.4)",
            }}
          >
            <AlertTriangle size={10} style={{ color: "rgb(255,80,100)" }} />
          </div>
          {/* Ripple effect */}
          <div
            className="absolute rounded-full"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "50px",
              height: "50px",
              border: "1px solid rgba(255,60,80,0.3)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "80px",
              height: "80px",
              border: "1px solid rgba(255,60,80,0.15)",
            }}
          />
          {/* Devices */}
          {devices.map((d) => (
            <div
              key={d.id}
              className="absolute"
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: "14px",
                  height: "14px",
                  background: d.status === "active" ? "rgba(80,230,180,0.2)" : "rgba(160,160,180,0.2)",
                  border: `1.5px solid ${d.status === "active" ? "rgb(80,230,180)" : "rgb(160,160,180)"}`,
                }}
              >
                <Navigation
                  size={7}
                  style={{ color: d.status === "active" ? "rgb(80,230,180)" : "rgb(160,160,180)" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Device List */}
      <div className="flex-1 overflow-auto px-4 py-3">
        <div className="text-xs mb-2" style={{ color: "rgb(120,180,210)" }}>
          协同设备状态
        </div>
        <div className="space-y-2">
          {devices.map((device) => (
            <div
              key={device.id}
              className="flex items-center gap-3 p-2.5 rounded"
              style={{
                background: "rgba(10,24,54,0.6)",
                border: "1px solid rgba(0,212,255,0.1)",
              }}
            >
              <div
                className="rounded flex items-center justify-center flex-shrink-0"
                style={{
                  width: "32px",
                  height: "32px",
                  background: "rgba(0,212,255,0.08)",
                  border: "1px solid rgba(0,212,255,0.2)",
                }}
              >
                <Navigation size={14} style={{ color: "rgb(0,212,255)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: "rgb(200,235,255)" }}>
                    {device.name}
                  </span>
                  <StatusBadge status={device.status} size="sm" />
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="flex-1 rounded-full"
                    style={{ height: "3px", background: "rgba(0,212,255,0.15)" }}
                  >
                    <div
                      className="rounded-full"
                      style={{
                        width: `${device.battery}%`,
                        height: "3px",
                        background: device.battery > 50 ? "rgb(80,230,180)" : device.battery > 20 ? "rgb(255,180,0)" : "rgb(255,80,100)",
                      }}
                    />
                  </div>
                  <span className="text-xs flex-shrink-0" style={{ color: "rgb(80,130,160)", fontSize: "10px" }}>
                    {device.battery}%
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    background: "rgba(0,212,255,0.08)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    color: "rgb(0,212,255)",
                    fontSize: "10px",
                  }}
                >
                  调度
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Generation */}
      <div
        className="px-4 py-3 flex gap-2"
        style={{ borderTop: "1px solid rgba(0,212,255,0.15)" }}
      >
        <button
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded text-xs"
          style={{
            background: "rgba(0,212,255,0.08)",
            border: "1px solid rgba(0,212,255,0.25)",
            color: "rgb(0,212,255)",
          }}
        >
          <Camera size={13} />实时画面
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded text-xs"
          style={{
            background: "rgba(80,230,180,0.08)",
            border: "1px solid rgba(80,230,180,0.25)",
            color: "rgb(80,230,180)",
          }}
        >
          <FileOutput size={13} />生成报告
        </button>
      </div>
    </div>
  );
};

export default EmergencyPanel;