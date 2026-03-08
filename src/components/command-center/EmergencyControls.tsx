import React, { useState } from "react";
import { RotateCcw, Radio, Power, AlertOctagon, Lock, Zap } from "lucide-react";

interface ControlBtn {
  id: string;
  label: string;
  subLabel: string;
  icon: React.ElementType;
  color: string;
  glowColor: string;
  danger?: boolean;
}

const controlButtons: ControlBtn[] = [
  { id: "return", label: "强制返航", subLabel: "ALL RTH", icon: RotateCcw, color: "rgba(0, 210, 255, 1)", glowColor: "rgba(0, 210, 255, 0.45)", danger: false },
  { id: "takeover", label: "手动接管", subLabel: "MANUAL", icon: Radio, color: "rgba(255, 185, 0, 1)", glowColor: "rgba(255, 185, 0, 0.4)", danger: false },
  { id: "hover", label: "原地悬停", subLabel: "HOVER", icon: Zap, color: "rgba(0, 255, 180, 1)", glowColor: "rgba(0, 255, 180, 0.4)", danger: false },
  { id: "lock", label: "锁定编队", subLabel: "LOCK", icon: Lock, color: "rgba(150, 100, 255, 1)", glowColor: "rgba(150, 100, 255, 0.4)", danger: false },
  { id: "emergency", label: "紧急制停", subLabel: "E-STOP", icon: AlertOctagon, color: "rgba(255, 65, 80, 1)", glowColor: "rgba(255, 65, 80, 0.55)", danger: true },
  { id: "power", label: "切断电源", subLabel: "POWER OFF", icon: Power, color: "rgba(255, 65, 80, 1)", glowColor: "rgba(255, 65, 80, 0.45)", danger: true },
];

const EmergencyControls: React.FC = () => {
  const [activeBtn, setActiveBtn] = useState<string | null>(null);

  const handleClick = (id: string) => {
    setActiveBtn(id);
    setTimeout(() => setActiveBtn(null), 2000);
  };

  return (
    <div
      data-cmp="EmergencyControls"
      className="fui-panel"
      style={{ borderRadius: "4px", padding: "8px 10px", flexShrink: 0 }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "7px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <AlertOctagon size={11} style={{ color: "rgba(255, 65, 80, 1)" }} />
          <span className="fui-title">紧急控制</span>
        </div>
        <span style={{ fontSize: "9px", color: "rgba(255, 65, 80, 0.6)", letterSpacing: "0.05em" }}>
          ⚠ 谨慎操作
        </span>
      </div>

      <div style={{ display: "flex", gap: "5px" }}>
        {controlButtons.map((btn) => {
          const Icon = btn.icon;
          const isActive = activeBtn === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => handleClick(btn.id)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                padding: "7px 4px",
                background: isActive
                  ? btn.danger ? "rgba(100, 20, 25, 0.5)" : "rgba(0, 40, 80, 0.5)"
                  : "rgba(2, 10, 26, 0.8)",
                border: `1px solid ${isActive ? btn.color : btn.color + "30"}`,
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxShadow: isActive ? `0 0 16px ${btn.glowColor}` : "none",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: isActive ? btn.color : "rgba(2, 10, 26, 0.9)",
                  border: `1.5px solid ${btn.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isActive ? `0 0 18px ${btn.glowColor}` : `0 0 7px ${btn.glowColor}`,
                  transition: "all 0.15s ease",
                }}
              >
                <Icon
                  size={13}
                  style={{ color: isActive ? "rgba(2,8,20,1)" : btn.color }}
                />
              </div>
              <span style={{
                fontSize: "8px",
                color: isActive ? btn.color : "rgba(120, 180, 215, 1)",
                fontWeight: isActive ? 700 : 400,
                letterSpacing: "0.04em",
                lineHeight: 1.2,
                textAlign: "center",
              }}>
                {btn.label}
              </span>
              <span style={{
                fontSize: "7px",
                color: "rgba(50, 110, 150, 0.9)",
                fontFamily: "monospace",
                letterSpacing: "0.06em",
              }}>
                {btn.subLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EmergencyControls;
