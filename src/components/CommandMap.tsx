import React, { useState } from "react";
import { Layers, ZoomIn, ZoomOut, RotateCcw, MapPin, Navigation } from "lucide-react";

interface MapDevice {
  id: string;
  type: "airport" | "uav" | "payload" | "tethered";
  name: string;
  x: number;
  y: number;
  status: "online" | "offline" | "active";
  battery?: number;
}

const mapDevices: MapDevice[] = [
  { id: "AP-001", type: "airport", name: "机场-01", x: 22, y: 35, status: "online" },
  { id: "AP-002", type: "airport", name: "机场-02", x: 68, y: 25, status: "online" },
  { id: "UAV-001", type: "uav", name: "单兵-01", x: 35, y: 50, status: "active", battery: 78 },
  { id: "UAV-002", type: "uav", name: "单兵-02", x: 55, y: 60, status: "active", battery: 65 },
  { id: "UAV-003", type: "uav", name: "单兵-03", x: 75, y: 45, status: "online", battery: 90 },
  { id: "PL-001", type: "payload", name: "负载-01", x: 42, y: 70, status: "active", battery: 55 },
  { id: "TH-001", type: "tethered", name: "系留-01", x: 60, y: 75, status: "online" },
  { id: "TH-002", type: "tethered", name: "系留-02", x: 80, y: 65, status: "offline" },
];

const flightPaths = [
  { id: "path-1", points: "M35,50 Q45,40 55,60", active: true },
  { id: "path-2", points: "M55,60 Q65,50 75,45", active: true },
];

const noFlyZones = [
  { cx: 50, cy: 30, rx: 8, ry: 5, label: "禁飞区" },
];

const deviceTypeConfig = {
  airport: { color: "rgb(0, 180, 255)", label: "机场" },
  uav: { color: "rgb(0, 220, 150)", label: "单兵" },
  payload: { color: "rgb(255, 200, 0)", label: "负载" },
  tethered: { color: "rgb(180, 100, 255)", label: "系留" },
};

/**
 * CommandMap - 3D GIS situational awareness map panel
 */
const CommandMap: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const [showLayer, setShowLayer] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<MapDevice | null>(null);

  console.log("CommandMap rendered");

  return (
    <div data-cmp="CommandMap" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Map controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          {Object.entries(deviceTypeConfig).map(([type, cfg]) => (
            <div key={type} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: cfg.color, boxShadow: `0 0 4px ${cfg.color}` }} />
              <span style={{ fontSize: "10px", color: "rgba(0, 180, 220, 0.6)", fontFamily: "monospace" }}>{cfg.label}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ width: "12px", height: "2px", background: "rgb(255, 60, 60)", boxShadow: "0 0 4px rgb(255, 60, 60)" }} />
            <span style={{ fontSize: "10px", color: "rgba(0, 180, 220, 0.6)", fontFamily: "monospace" }}>禁飞区</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ width: "14px", height: "2px", background: "linear-gradient(90deg, rgb(0, 180, 255), transparent)" }} />
            <span style={{ fontSize: "10px", color: "rgba(0, 180, 220, 0.6)", fontFamily: "monospace" }}>飞行轨迹</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {[
            { icon: ZoomIn, action: () => setZoom(z => Math.min(z + 0.1, 1.8)), label: "放大" },
            { icon: ZoomOut, action: () => setZoom(z => Math.max(z - 0.1, 0.6)), label: "缩小" },
            { icon: RotateCcw, action: () => setZoom(1), label: "重置" },
            { icon: Layers, action: () => setShowLayer(s => !s), label: "图层" },
          ].map(({ icon: Icon, action, label }) => (
            <button
              key={label}
              onClick={action}
              title={label}
              style={{ width: "26px", height: "26px", border: "1px solid rgba(0, 180, 220, 0.3)", borderRadius: "3px", background: "rgba(0, 30, 70, 0.6)", color: "rgba(0, 200, 220, 0.7)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0, 70, 130, 0.6)"; e.currentTarget.style.borderColor = "rgba(0, 212, 255, 0.6)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0, 30, 70, 0.6)"; e.currentTarget.style.borderColor = "rgba(0, 180, 220, 0.3)"; }}
            >
              <Icon size={13} />
            </button>
          ))}
        </div>
      </div>

      {/* Map viewport */}
      <div
        style={{
          flex: 1,
          background: "linear-gradient(160deg, rgba(0, 15, 50, 0.95) 0%, rgba(0, 8, 30, 0.95) 100%)",
          border: "1px solid rgba(0, 150, 200, 0.25)",
          borderRadius: "4px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0, 180, 255, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 180, 255, 0.06) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

        {/* Terrain-like gradient */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 40% 60%, rgba(0, 80, 40, 0.12) 0%, rgba(0, 40, 80, 0.06) 40%, transparent 70%)", pointerEvents: "none" }} />

        {/* SVG map content */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center", transition: "transform 0.2s" }}
        >
          {/* Coverage circles */}
          {showLayer && mapDevices.filter(d => d.type === "airport" || d.type === "tethered").map(d => (
            <ellipse key={`cov-${d.id}`}
              cx={d.x} cy={d.y} rx={d.type === "airport" ? 12 : 8} ry={d.type === "airport" ? 8 : 5}
              fill={`${deviceTypeConfig[d.type].color.replace("rgb", "rgba").replace(")", ", 0.06)")}`}
              stroke={`${deviceTypeConfig[d.type].color.replace("rgb", "rgba").replace(")", ", 0.25)")}`}
              strokeWidth="0.3" strokeDasharray="1.5 1"
            />
          ))}

          {/* No-fly zones */}
          {noFlyZones.map(z => (
            <g key={z.label}>
              <ellipse cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry}
                fill="rgba(255, 60, 60, 0.08)"
                stroke="rgba(255, 60, 60, 0.6)"
                strokeWidth="0.4" strokeDasharray="2 1"
              />
              <text x={z.cx} y={z.cy + 1} textAnchor="middle" fontSize="2.5" fill="rgba(255, 80, 80, 0.8)" fontFamily="monospace">{z.label}</text>
            </g>
          ))}

          {/* Flight paths */}
          {flightPaths.map(p => (
            <g key={p.id}>
              <path d={p.points} stroke="rgba(0, 180, 255, 0.5)" strokeWidth="0.6" fill="none" strokeDasharray="2 1" />
              <path d={p.points} stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.2" fill="none" />
            </g>
          ))}

          {/* Device icons */}
          {mapDevices.map(device => {
            const cfg = deviceTypeConfig[device.type];
            const isSelected = selectedDevice?.id === device.id;
            return (
              <g key={device.id} style={{ cursor: "pointer" }} onClick={() => setSelectedDevice(isSelected ? null : device)}>
                {/* Pulse ring for active devices */}
                {device.status === "active" && (
                  <circle cx={device.x} cy={device.y} r="4" fill="none" stroke={cfg.color} strokeWidth="0.3" opacity="0.4">
                    <animate attributeName="r" values="2;5;2" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  cx={device.x} cy={device.y} r={isSelected ? "3" : "2"}
                  fill={device.status === "offline" ? "rgba(120, 130, 140, 0.6)" : cfg.color}
                  stroke={isSelected ? "rgb(255, 255, 255)" : cfg.color}
                  strokeWidth="0.4"
                  style={{ filter: device.status !== "offline" ? `drop-shadow(0 0 2px ${cfg.color})` : "none" }}
                />
                <text x={device.x} y={device.y - 3} textAnchor="middle" fontSize="2" fill="rgba(200, 235, 255, 0.8)" fontFamily="monospace">{device.name}</text>
                {device.battery !== undefined && (
                  <text x={device.x} y={device.y + 5} textAnchor="middle" fontSize="1.8" fill={device.battery > 60 ? "rgba(0, 220, 150, 0.8)" : "rgba(255, 180, 0, 0.8)"} fontFamily="monospace">{device.battery}%</text>
                )}
              </g>
            );
          })}

          {/* Direction indicators for active UAVs */}
          {mapDevices.filter(d => d.status === "active" && d.type === "uav").map(d => (
            <polygon key={`dir-${d.id}`}
              points={`${d.x},${d.y - 2.5} ${d.x - 1},${d.y - 0.5} ${d.x + 1},${d.y - 0.5}`}
              fill="rgb(255, 255, 255)"
              opacity="0.6"
            >
              <animateTransform attributeName="transform" type="rotate" values={`0 ${d.x} ${d.y};360 ${d.x} ${d.y}`} dur="8s" repeatCount="indefinite" />
            </polygon>
          ))}
        </svg>

        {/* Selected device popup */}
        {selectedDevice && (
          <div style={{
            position: "absolute", top: "12px", right: "12px",
            background: "rgba(0, 12, 38, 0.95)",
            border: `1px solid ${deviceTypeConfig[selectedDevice.type].color}60`,
            borderRadius: "4px", padding: "10px 14px", minWidth: "160px",
            boxShadow: `0 0 15px ${deviceTypeConfig[selectedDevice.type].color}30`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "rgb(200, 235, 255)", fontFamily: "'Microsoft YaHei', sans-serif" }}>{selectedDevice.name}</span>
              <button onClick={() => setSelectedDevice(null)} style={{ background: "none", border: "none", color: "rgba(0, 180, 220, 0.5)", cursor: "pointer", fontSize: "14px", lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {[
                { label: "设备ID", value: selectedDevice.id },
                { label: "类型", value: deviceTypeConfig[selectedDevice.type].label },
                { label: "状态", value: selectedDevice.status === "active" ? "执行中" : selectedDevice.status === "online" ? "在线" : "离线" },
                selectedDevice.battery !== undefined ? { label: "电量", value: `${selectedDevice.battery}%` } : null,
              ].filter(Boolean).map((row) => (
                <div key={row!.label} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "10px", color: "rgba(0, 180, 220, 0.5)", fontFamily: "monospace" }}>{row!.label}</span>
                  <span style={{ fontSize: "10px", color: "rgb(180, 230, 255)", fontFamily: "monospace" }}>{row!.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compass */}
        <div style={{ position: "absolute", bottom: "12px", right: "12px", width: "36px", height: "36px", borderRadius: "50%", border: "1px solid rgba(0, 180, 220, 0.3)", background: "rgba(0, 15, 45, 0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Navigation size={16} style={{ color: "rgba(0, 212, 255, 0.7)" }} />
        </div>

        {/* Coordinates display */}
        <div style={{ position: "absolute", bottom: "12px", left: "12px", fontSize: "10px", color: "rgba(0, 180, 220, 0.45)", fontFamily: "monospace" }}>
          <div>N 39°56&apos; E 116°24&apos;</div>
          <div>比例尺 1:50000</div>
        </div>

        {/* Corner frame */}
        {[{ top: "6px", left: "6px" }, { top: "6px", right: "6px" }, { bottom: "6px", left: "6px" }, { bottom: "6px", right: "6px" }].map((pos, i) => (
          <div key={i} style={{ position: "absolute", ...pos, width: "14px", height: "14px", pointerEvents: "none" }}>
            <div style={{ position: "absolute", ...("top" in pos ? { top: 0 } : { bottom: 0 }), ...("left" in pos ? { left: 0 } : { right: 0 }), width: "14px", height: "1px", background: "rgba(0, 212, 255, 0.5)" }} />
            <div style={{ position: "absolute", ...("top" in pos ? { top: 0 } : { bottom: 0 }), ...("left" in pos ? { left: 0 } : { right: 0 }), width: "1px", height: "14px", background: "rgba(0, 212, 255, 0.5)" }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommandMap;