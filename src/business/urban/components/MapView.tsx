import React from "react";
import { Navigation, Layers, ZoomIn, ZoomOut, Crosshair } from "lucide-react";

interface MapRoute {
  id: string;
  name: string;
  color: string;
  status: string;
}

interface MapDevice {
  id: string;
  name: string;
  x: number;
  y: number;
  type: string;
  status: string;
}

interface MapViewProps {
  routes?: MapRoute[];
  devices?: MapDevice[];
  title?: string;
}

const defaultRoutes: MapRoute[] = [
  { id: "r1", name: "航线A-中心商圈", color: "rgb(0, 212, 255)", status: "active" },
  { id: "r2", name: "航线B-滨河路段", color: "rgb(80, 230, 180)", status: "active" },
  { id: "r3", name: "航线C-工业区", color: "rgb(255, 180, 0)", status: "paused" },
];

const defaultDevices: MapDevice[] = [
  { id: "d1", name: "无人机-001", x: 30, y: 35, type: "drone", status: "active" },
  { id: "d2", name: "无人机-002", x: 55, y: 55, type: "drone", status: "active" },
  { id: "d3", name: "无人机-003", x: 70, y: 30, type: "drone", status: "paused" },
  { id: "d4", name: "机器狗-001", x: 42, y: 65, type: "robot", status: "active" },
];

const MapView: React.FC<MapViewProps> = ({
  routes = defaultRoutes,
  devices = defaultDevices,
  title = "城市巡查实时地图",
}) => {
  console.log("MapView rendered with", devices.length, "devices");

  return (
    <div
      data-cmp="MapView"
      className="relative w-full flex flex-col flex-1 min-h-0"
      style={{ background: "rgb(5, 15, 40)" }}
    >
      {/* Map Header */}
      <div
        className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{
          background: "rgba(0, 212, 255, 0.08)",
          borderBottom: "1px solid rgba(0, 212, 255, 0.2)",
        }}
      >
        <span className="text-sm font-medium" style={{ color: "rgb(0, 212, 255)" }}>
          {title}
        </span>
        <div className="flex items-center gap-4 text-xs" style={{ color: "rgb(120, 180, 210)" }}>
          <span className="flex items-center gap-1">
            <span
              className="inline-block rounded-full"
              style={{ width: "6px", height: "6px", background: "rgb(80, 230, 180)" }}
            />
            在线设备: {devices.filter((d) => d.status === "active").length}
          </span>
          <span className="flex items-center gap-1">
            <span
              className="inline-block rounded-full"
              style={{ width: "6px", height: "6px", background: "rgb(0, 212, 255)" }}
            />
            活跃航线: {routes.filter((r) => r.status === "active").length}
          </span>
        </div>
      </div>

      {/* Map Canvas Area */}
      <div className="flex-1 min-h-0 relative overflow-hidden">
        {/* Simulated map grid */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.15 }}
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,212,255,0.5)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Simulated city blocks */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.2 }}>
          <rect x="10%" y="10%" width="18%" height="14%" rx="2" fill="rgba(0,212,255,0.15)" stroke="rgba(0,212,255,0.4)" strokeWidth="0.5" />
          <rect x="32%" y="8%" width="22%" height="18%" rx="2" fill="rgba(0,212,255,0.1)" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
          <rect x="58%" y="10%" width="15%" height="12%" rx="2" fill="rgba(0,212,255,0.12)" stroke="rgba(0,212,255,0.35)" strokeWidth="0.5" />
          <rect x="10%" y="28%" width="20%" height="25%" rx="2" fill="rgba(0,212,255,0.08)" stroke="rgba(0,212,255,0.25)" strokeWidth="0.5" />
          <rect x="34%" y="30%" width="16%" height="20%" rx="2" fill="rgba(0,212,255,0.1)" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
          <rect x="54%" y="26%" width="22%" height="22%" rx="2" fill="rgba(0,212,255,0.12)" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
          <rect x="78%" y="15%" width="14%" height="30%" rx="2" fill="rgba(0,212,255,0.08)" stroke="rgba(0,212,255,0.2)" strokeWidth="0.5" />
          <rect x="14%" y="60%" width="25%" height="22%" rx="2" fill="rgba(0,212,255,0.1)" stroke="rgba(0,212,255,0.25)" strokeWidth="0.5" />
          <rect x="44%" y="58%" width="18%" height="18%" rx="2" fill="rgba(0,212,255,0.08)" stroke="rgba(0,212,255,0.2)" strokeWidth="0.5" />
          <rect x="66%" y="54%" width="20%" height="24%" rx="2" fill="rgba(0,212,255,0.1)" stroke="rgba(0,212,255,0.25)" strokeWidth="0.5" />
          {/* Roads */}
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
          <line x1="30%" y1="0" x2="30%" y2="100%" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
          <line x1="62%" y1="0" x2="62%" y2="100%" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
          <line x1="0" y1="25%" x2="100%" y2="25%" stroke="rgba(0,212,255,0.15)" strokeWidth="0.5" />
          <line x1="0" y1="75%" x2="100%" y2="75%" stroke="rgba(0,212,255,0.15)" strokeWidth="0.5" />
        </svg>

        {/* Patrol Routes */}
        <svg className="absolute inset-0 w-full h-full">
          <polyline
            points="15%,20% 28%,35% 45%,28% 60%,40% 72%,25%"
            fill="none"
            stroke="rgb(0,212,255)"
            strokeWidth="2"
            strokeDasharray="6,3"
            opacity="0.7"
          />
          <polyline
            points="20%,60% 38%,55% 50%,70% 65%,62% 78%,68%"
            fill="none"
            stroke="rgb(80,230,180)"
            strokeWidth="2"
            strokeDasharray="6,3"
            opacity="0.7"
          />
          <polyline
            points="10%,42% 25%,48% 40%,44% 55%,50% 70%,45%"
            fill="none"
            stroke="rgb(255,180,0)"
            strokeWidth="2"
            strokeDasharray="4,4"
            opacity="0.4"
          />
        </svg>

        {/* Devices */}
        {devices.map((device) => (
          <div
            key={device.id}
            className="absolute flex flex-col items-center"
            style={{ left: `${device.x}%`, top: `${device.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: "20px",
                height: "20px",
                background: device.status === "active" ? "rgba(80,230,180,0.2)" : "rgba(160,160,180,0.2)",
                border: `2px solid ${device.status === "active" ? "rgb(80,230,180)" : "rgb(160,160,180)"}`,
                boxShadow: device.status === "active" ? "0 0 8px rgba(80,230,180,0.5)" : "none",
              }}
            >
              <Navigation
                size={10}
                style={{ color: device.status === "active" ? "rgb(80,230,180)" : "rgb(160,160,180)" }}
              />
            </div>
            <span
              className="text-xs mt-0.5 whitespace-nowrap px-1 rounded"
              style={{
                color: "rgb(0,212,255)",
                background: "rgba(5,15,40,0.8)",
                fontSize: "9px",
              }}
            >
              {device.name}
            </span>
          </div>
        ))}

        {/* Map controls */}
        <div
          className="absolute right-3 top-3 flex flex-col gap-1"
        >
          {[
            { icon: ZoomIn, label: "+" },
            { icon: ZoomOut, label: "-" },
            { icon: Crosshair, label: "定位" },
            { icon: Layers, label: "图层" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex items-center justify-center rounded"
              style={{
                width: "28px",
                height: "28px",
                background: "rgba(10,24,54,0.9)",
                border: "1px solid rgba(0,212,255,0.3)",
                color: "rgb(0,212,255)",
              }}
              title={label}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>

        {/* Coordinates display */}
        <div
          className="absolute bottom-3 left-3 text-xs"
          style={{ color: "rgba(0,212,255,0.5)", fontSize: "10px" }}
        >
          31°13&apos;N 121°28&apos;E | 比例 1:5000
        </div>
      </div>

      {/* Route Legend */}
      <div
        className="px-4 py-2 flex items-center gap-4"
        style={{ borderTop: "1px solid rgba(0,212,255,0.15)", background: "rgba(6,14,32,0.8)" }}
      >
        {routes.map((route) => (
          <div key={route.id} className="flex items-center gap-2">
            <div
              className="rounded-full"
              style={{
                width: "24px",
                height: "2px",
                background: route.color,
                opacity: route.status === "active" ? 1 : 0.4,
              }}
            />
            <span
              className="text-xs"
              style={{
                color: route.status === "active" ? route.color : "rgb(120,180,210)",
                opacity: route.status === "active" ? 1 : 0.5,
              }}
            >
              {route.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapView;