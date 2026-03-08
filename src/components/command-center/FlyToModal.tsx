import React, { useState } from "react";
import { Plane } from "lucide-react";

interface FlyToModalProps {
  /** 右键点击的经纬度 */
  lat: number;
  lng: number;
  onClose: () => void;
  onExecute: (aircraftId: string, heightM: number) => void;
  aircraftOptions: { id: string; name: string }[];
}

export const FlyToModal: React.FC<FlyToModalProps> = ({
  lat,
  lng,
  onClose,
  onExecute,
  aircraftOptions,
}) => {
  const [aircraftId, setAircraftId] = useState(aircraftOptions[0]?.id ?? "");
  const [heightM, setHeightM] = useState(50);

  return (
    <div
      role="dialog"
      aria-label="一键直飞"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: "320px",
          background: "rgba(3, 18, 40, 0.98)",
          border: "1px solid rgba(0, 170, 220, 0.4)",
          borderRadius: "8px",
          padding: "16px 20px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Plane size={18} style={{ color: "rgba(0, 210, 255, 1)" }} />
          <span style={{ fontSize: "14px", fontWeight: 700, color: "rgba(0, 210, 255, 1)" }}>一键直飞</span>
        </div>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", fontSize: "11px", color: "rgba(100, 160, 200, 1)", marginBottom: "4px" }}>
            目标点位
          </label>
          <span style={{ fontFamily: "monospace", fontSize: "12px", color: "rgba(200, 230, 255, 1)" }}>
            {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
          </span>
        </div>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", fontSize: "11px", color: "rgba(100, 160, 200, 1)", marginBottom: "4px" }}>
            选择飞机
          </label>
          <select
            value={aircraftId}
            onChange={(e) => setAircraftId(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 10px",
              fontSize: "12px",
              background: "rgba(0, 30, 60, 0.9)",
              border: "1px solid rgba(0, 140, 200, 0.4)",
              borderRadius: "4px",
              color: "rgba(0, 210, 255, 1)",
              cursor: "pointer",
            }}
          >
            {aircraftOptions.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "11px", color: "rgba(100, 160, 200, 1)", marginBottom: "4px" }}>
            飞行高度 (m)
          </label>
          <input
            type="number"
            min={20}
            max={500}
            value={heightM}
            onChange={(e) => setHeightM(Number(e.target.value) || 50)}
            style={{
              width: "100%",
              padding: "6px 10px",
              fontSize: "12px",
              background: "rgba(0, 30, 60, 0.9)",
              border: "1px solid rgba(0, 140, 200, 0.4)",
              borderRadius: "4px",
              color: "rgba(0, 210, 255, 1)",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "6px 14px",
              fontSize: "12px",
              background: "rgba(60, 80, 100, 0.5)",
              border: "1px solid rgba(100, 140, 180, 0.4)",
              borderRadius: "4px",
              color: "rgba(180, 210, 240, 1)",
              cursor: "pointer",
            }}
          >
            取消
          </button>
          <button
            type="button"
            onClick={() => onExecute(aircraftId, heightM)}
            style={{
              padding: "6px 14px",
              fontSize: "12px",
              background: "rgba(0, 120, 180, 0.5)",
              border: "1px solid rgba(0, 180, 220, 0.5)",
              borderRadius: "4px",
              color: "rgba(0, 220, 255, 1)",
              cursor: "pointer",
            }}
          >
            执行
          </button>
        </div>
      </div>
    </div>
  );
};
