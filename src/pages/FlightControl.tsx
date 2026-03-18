import React, { useState } from "react";
import { Plane, Navigation, Wind, Gauge, Wifi, Battery } from "lucide-react";
import ModulePageLayout from "@/components/ModulePageLayout";

const COLOR = "rgb(60, 210, 255)";
const GLOW = "rgba(60, 210, 255, 0.4)";

type UavCategory = "警用" | "政务" | "民用";

const CATEGORY_COLOR: Record<UavCategory, string> = {
  // Keep consistent with Command Center legend colors
  警用: "rgba(0, 140, 255, 1)",
  政务: "rgba(0, 220, 150, 1)",
  民用: "rgba(255, 200, 0, 1)",
};

/**
 * FlightControl - 飞行控制中心 page
 */
const FlightControl: React.FC = () => {
  console.log("FlightControl page rendered");
  const [selectedUav, setSelectedUav] = useState("UAV-003");
  const [categoryFilter, setCategoryFilter] = useState<"全部" | UavCategory>("全部");
  const [nameFilter, setNameFilter] = useState("");

  const uavList = [
    { id: "UAV-003", status: "飞行中", battery: 78, signal: 95, alt: 120, speed: 15, category: "警用" as UavCategory },
    { id: "UAV-007", status: "返航中", battery: 22, signal: 88, alt: 80, speed: 8, category: "政务" as UavCategory },
    { id: "UAV-009", status: "飞行中", battery: 55, signal: 92, alt: 200, speed: 22, category: "民用" as UavCategory },
    { id: "UAV-015", status: "待命", battery: 100, signal: 100, alt: 0, speed: 0, category: "警用" as UavCategory },
  ];

  const filteredUavList = uavList.filter((u) => {
    const matchCategory = categoryFilter === "全部" || u.category === categoryFilter;
    const kw = nameFilter.trim();
    const matchName = !kw || u.id.includes(kw);
    return matchCategory && matchName;
  });

  const selected = filteredUavList.find((u) => u.id === selectedUav) || filteredUavList[0] || uavList[0];

  const gaugeItems = [
    { label: "飞行高度", value: selected.alt, unit: "m", max: 500, icon: Navigation },
    { label: "飞行速度", value: selected.speed, unit: "m/s", max: 50, icon: Wind },
    { label: "信号强度", value: selected.signal, unit: "%", max: 100, icon: Wifi },
    { label: "电池电量", value: selected.battery, unit: "%", max: 100, icon: Battery },
  ];

  return (
    <ModulePageLayout
      title="飞行控制中心"
      subtitle="FLIGHT CONTROL CENTER"
      icon={Plane}
      color={COLOR}
      glowColor={GLOW}
    >
      <div className="flex gap-6">
        {/* UAV list panel */}
        <div
          style={{
            width: "260px",
            flexShrink: 0,
            background: "rgba(0, 15, 50, 0.75)",
            border: `1px solid ${GLOW}`,
            borderRadius: "4px",
            padding: "16px",
          }}
        >
          <div style={{ fontSize: "12px", color: "rgba(0, 180, 220, 0.55)", fontFamily: "monospace", letterSpacing: "0.2em", marginBottom: "10px" }}>UAV LIST</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as "全部" | UavCategory)}
              style={{
                flex: 1,
                fontSize: 11,
                background: "rgba(15,23,42,0.9)",
                color: "rgba(148,163,184,1)",
                borderRadius: 4,
                border: "1px solid rgba(51,65,85,1)",
                padding: "4px 6px",
              }}
            >
              <option value="全部">全部类别</option>
              <option value="警用">警用</option>
              <option value="政务">政务</option>
              <option value="民用">民用</option>
            </select>
            <input
              placeholder="按设备编号搜索"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              style={{
                flex: 1,
                fontSize: 11,
                background: "rgba(15,23,42,0.9)",
                color: "rgba(226,232,240,1)",
                borderRadius: 4,
                border: "1px solid rgba(51,65,85,1)",
                padding: "4px 6px",
              }}
            />
          </div>
          <div className="flex flex-col gap-3">
            {filteredUavList.map((uav) => (
              <div
                key={uav.id}
                onClick={() => setSelectedUav(uav.id)}
                style={{
                  padding: "12px 14px",
                  border: `1px solid ${selectedUav === uav.id ? COLOR : "rgba(0, 130, 180, 0.25)"}`,
                  borderRadius: "3px",
                  background: selectedUav === uav.id ? "rgba(0, 80, 150, 0.35)" : "rgba(0, 20, 60, 0.5)",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  boxShadow: selectedUav === uav.id ? `0 0 12px ${GLOW}` : "none",
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: "13px", color: "rgb(200, 235, 255)", fontFamily: "monospace", fontWeight: "700" }}>{uav.id}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: "10px", color: uav.status === "飞行中" ? "rgb(0, 220, 120)" : uav.status === "返航中" ? "rgb(255, 180, 0)" : COLOR }}>{uav.status}</span>
                    <span
                      style={{
                        fontSize: 10,
                        padding: "0 6px",
                        borderRadius: 999,
                        border: `1px solid ${CATEGORY_COLOR[uav.category]}`,
                        color: CATEGORY_COLOR[uav.category],
                        background: CATEGORY_COLOR[uav.category].replace("1)", "0.12)"),
                      }}
                    >
                      类别 {uav.category}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ fontSize: "10px", color: "rgba(0, 160, 200, 0.6)", fontFamily: "monospace" }}>🔋{uav.battery}%</span>
                  <span style={{ fontSize: "10px", color: "rgba(0, 160, 200, 0.6)", fontFamily: "monospace" }}>📶{uav.signal}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: telemetry + map */}
        <div className="flex flex-col gap-6" style={{ flex: 1 }}>
          {/* Telemetry gauges */}
          <div className="flex gap-4">
            {gaugeItems.map((g, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: "rgba(0, 15, 50, 0.75)",
                  border: `1px solid ${GLOW}`,
                  borderRadius: "4px",
                  padding: "16px",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent, ${COLOR}, transparent)` }} />
                <g.icon size={16} style={{ color: COLOR, margin: "0 auto 8px" }} />
                <div style={{ fontSize: "28px", fontWeight: "700", color: "rgb(220, 245, 255)", fontFamily: "monospace" }}>{g.value}</div>
                <div style={{ fontSize: "11px", color: COLOR, fontFamily: "monospace" }}>{g.unit}</div>
                <div style={{ fontSize: "11px", color: "rgba(0, 160, 200, 0.5)", marginTop: "4px", fontFamily: "'Microsoft YaHei', sans-serif" }}>{g.label}</div>
                {/* Progress bar */}
                <div style={{ marginTop: "10px", height: "3px", background: "rgba(0, 80, 150, 0.4)", borderRadius: "2px" }}>
                  <div style={{ width: `${(g.value / g.max) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${COLOR}, rgba(0, 180, 255, 0.5))`, borderRadius: "2px" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Simulated flight map area */}
          <div
            style={{
              flex: 1,
              minHeight: "340px",
              background: "rgba(0, 10, 40, 0.85)",
              border: `1px solid ${GLOW}`,
              borderRadius: "4px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Grid lines on map */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(0, 180, 255, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 180, 255, 0.06) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
            {/* Label */}
            <div style={{ position: "absolute", top: "14px", left: "16px", fontSize: "11px", color: "rgba(0, 160, 200, 0.5)", fontFamily: "monospace", letterSpacing: "0.2em" }}>LIVE FLIGHT MAP — {selectedUav}</div>
            {/* Simulated UAV position dots */}
            {[
              { x: "35%", y: "40%", id: "UAV-003", active: selectedUav === "UAV-003" },
              { x: "60%", y: "55%", id: "UAV-007", active: selectedUav === "UAV-007" },
              { x: "50%", y: "30%", id: "UAV-009", active: selectedUav === "UAV-009" },
              { x: "75%", y: "65%", id: "UAV-015", active: selectedUav === "UAV-015" },
            ].map((dot) => (
              <div
                key={dot.id}
                style={{ position: "absolute", left: dot.x, top: dot.y, transform: "translate(-50%, -50%)" }}
              >
                <div className={dot.active ? "animate-scan-ring" : ""} style={{ position: "absolute", width: "40px", height: "40px", borderRadius: "50%", border: `1px solid ${dot.active ? COLOR : "rgba(0, 180, 255, 0.3)"}`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
                <div style={{ width: dot.active ? "12px" : "8px", height: dot.active ? "12px" : "8px", borderRadius: "50%", background: dot.active ? COLOR : "rgba(0, 180, 255, 0.5)", boxShadow: dot.active ? `0 0 12px ${COLOR}` : "none" }} />
                <div style={{ position: "absolute", top: "14px", left: "14px", fontSize: "10px", color: dot.active ? COLOR : "rgba(0, 160, 200, 0.5)", fontFamily: "monospace", whiteSpace: "nowrap" }}>{dot.id}</div>
              </div>
            ))}
            {/* Route line simulation */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.3 }}>
              <polyline points="504,136,360,144,288,208" stroke={COLOR} strokeWidth="1" fill="none" strokeDasharray="4 4" />
            </svg>
          </div>
        </div>
      </div>
    </ModulePageLayout>
  );
};

export default FlightControl;