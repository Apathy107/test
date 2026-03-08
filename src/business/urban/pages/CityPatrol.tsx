import React, { useState } from "react";
import MapView from "../components/MapView";
import PatrolNormal from "../components/PatrolNormal";
import PatrolSpecial from "../components/PatrolSpecial";
import PatrolEmergency from "../components/PatrolEmergency";

type PatrolTab = "normal" | "special" | "emergency";

const tabs: { key: PatrolTab; label: string; sublabel: string }[] = [
  { key: "normal", label: "常态化巡查", sublabel: "Regular Patrol" },
  { key: "special", label: "专项巡查", sublabel: "Special Patrol" },
  { key: "emergency", label: "应急处置", sublabel: "Emergency" },
];

const CityPatrol: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PatrolTab>("normal");

  console.log("CityPatrol page rendered, active tab:", activeTab);

  return (
    <div
      className="flex flex-col flex-1 min-h-0"
      style={{ background: "rgb(8,18,38)" }}
    >
      {/* 主内容：标签页（城市巡查/事件审核/工单管理/应急应用）已在 UrbanApp 标头下方，此处直接为地图+右侧面板 */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Map Area - 城市巡查实时地图紧贴上方标签栏 */}
        <div
          className="flex-1 min-w-0 flex flex-col min-h-0"
          style={{ borderRight: "1px solid rgba(0,212,255,0.15)" }}
        >
          <MapView />
        </div>

        {/* Right Panel - 30% */}
        <div
          className="flex flex-col min-h-0 flex-shrink-0"
          style={{
            width: "380px",
            minWidth: "380px",
            background: "rgba(10,24,54,0.5)",
          }}
        >
          {/* Tabs */}
          <div
            className="flex"
            style={{ borderBottom: "1px solid rgba(0,212,255,0.15)", flexShrink: 0 }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex-1 py-3 text-center transition-all"
                style={{
                  background:
                    activeTab === tab.key
                      ? "rgba(0,212,255,0.08)"
                      : "transparent",
                  borderBottom:
                    activeTab === tab.key
                      ? "2px solid rgb(0,212,255)"
                      : "2px solid transparent",
                  color:
                    activeTab === tab.key
                      ? "rgb(0,212,255)"
                      : "rgb(80,130,160)",
                }}
              >
                <div className="text-xs font-medium">{tab.label}</div>
                <div
                  className="text-xs"
                  style={{ opacity: 0.6, fontSize: "10px" }}
                >
                  {tab.sublabel}
                </div>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <div
              className="flex-1 min-h-0 flex flex-col"
              style={{ display: activeTab === "normal" ? "flex" : "none" }}
            >
              <PatrolNormal />
            </div>
            <div
              className="flex-1 min-h-0 flex flex-col"
              style={{ display: activeTab === "special" ? "flex" : "none" }}
            >
              <PatrolSpecial />
            </div>
            <div
              className="flex-1 min-h-0 flex flex-col"
              style={{ display: activeTab === "emergency" ? "flex" : "none" }}
            >
              <PatrolEmergency />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityPatrol;