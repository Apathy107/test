import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Cpu } from "lucide-react";

interface DeviceOverviewProps {
  online?: number;
  offline?: number;
  maintenance?: number;
  healthScore?: number;
}

const DeviceOverview: React.FC<DeviceOverviewProps> = ({
  online = 28,
  offline = 8,
  maintenance = 5,
  healthScore = 87,
}) => {
  const total = online + offline + maintenance;
  const pieData = [
    { name: "在线", value: online, color: "rgba(0, 210, 255, 1)" },
    { name: "离线", value: offline, color: "rgba(255, 70, 90, 1)" },
    { name: "维护", value: maintenance, color: "rgba(255, 185, 0, 1)" },
  ];

  const circumference = 2 * Math.PI * 28;
  const dashOffset = circumference - (healthScore / 100) * circumference;

  return (
    <div
      data-cmp="DeviceOverview"
      className="fui-panel"
      style={{ borderRadius: "4px", padding: "10px 12px", flexShrink: 0 }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "18px",
              height: "18px",
              background: "rgba(0, 60, 100, 0.6)",
              border: "1px solid rgba(0, 180, 220, 0.4)",
              borderRadius: "3px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Cpu size={11} style={{ color: "rgba(0, 210, 255, 1)" }} />
          </div>
          <span className="fui-title">设备概览</span>
        </div>
        <span style={{ fontSize: "10px", color: "rgba(60, 140, 180, 1)", fontFamily: "monospace" }}>
          共 <span style={{ color: "rgba(0, 210, 255, 1)", fontWeight: 700 }}>{total}</span> 台
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: 76, height: 76, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={20}
                outerRadius={34}
                dataKey="value"
                strokeWidth={0}
                paddingAngle={2}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} opacity={0.88} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          {pieData.map((item) => (
            <div key={item.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    background: item.color,
                    borderRadius: "1px",
                    boxShadow: `0 0 5px ${item.color}`,
                  }}
                />
                <span style={{ fontSize: "10px", color: "rgba(100, 170, 210, 1)" }}>{item.name}</span>
              </div>
              <span style={{ fontSize: "12px", fontFamily: "monospace", fontWeight: 700, color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          <svg width="58" height="58" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="34" fill="none" stroke="rgba(0,60,100,0.4)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(0, 30, 60, 0.9)" strokeWidth="7" />
            <circle
              cx="36"
              cy="36"
              r="28"
              fill="none"
              stroke="rgba(0, 210, 255, 1)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 36 36)"
              style={{ filter: "drop-shadow(0 0 5px rgba(0,210,255,0.8))" }}
            />
            <text x="36" y="33" textAnchor="middle" fill="rgba(0,230,255,1)" fontSize="13" fontWeight="bold" fontFamily="monospace">
              {healthScore}
            </text>
            <text x="36" y="46" textAnchor="middle" fill="rgba(60,140,180,1)" fontSize="7">
              健康度
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DeviceOverview;
