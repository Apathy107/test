import React, { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X, MapPin, Video, Shield, FileText } from "lucide-react";
import type { DeviceMapItem } from "@/data/command-center/deviceMapData";
import { AIRCRAFT_STATUS_MAP } from "@/data/command-center/deviceMapData";

interface DeviceDetailPanelProps {
  device: DeviceMapItem;
  position: { x: number; y: number };
  onClose: () => void;
  onPositionChange: (pos: { x: number; y: number }) => void;
}

export const DeviceDetailPanel: React.FC<DeviceDetailPanelProps> = ({
  device,
  position,
  onClose,
  onPositionChange,
}) => {
  const navigate = useNavigate();
  const headRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [showLiveVideo, setShowLiveVideo] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      e.preventDefault();
      headRef.current?.setPointerCapture?.(e.pointerId);
      setDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY, posX: position.x, posY: position.y };
    },
    [position]
  );
  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      onPositionChange({ x: dragStart.current.posX + dx, y: dragStart.current.posY + dy });
    },
    [dragging, onPositionChange]
  );
  const onPointerUp = useCallback(() => {
    setDragging(false);
    headRef.current?.releasePointerCapture?.(-1);
  }, []);

  const pointStr = `${device.lat.toFixed(4)}°N, ${device.lng.toFixed(4)}°E`;

  return (
    <div
      role="dialog"
      aria-label="设备详情"
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: "280px",
        background: "rgba(3, 18, 40, 0.97)",
        border: "1px solid rgba(0, 170, 220, 0.4)",
        borderRadius: "8px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,180,220,0.15)",
        zIndex: 1000,
        overflow: "hidden",
      }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div
        ref={headRef}
        onPointerDown={onPointerDown}
        style={{
          padding: "8px 10px 6px",
          background: "rgba(0, 50, 90, 0.5)",
          borderBottom: "1px solid rgba(0, 120, 180, 0.3)",
          cursor: dragging ? "grabbing" : "grab",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: 700, color: "rgba(0, 210, 255, 1)" }}>{device.name}</span>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "rgba(120, 160, 200, 1)",
            cursor: "pointer",
            padding: "2px",
          }}
        >
          <X size={14} />
        </button>
      </div>
      <div style={{ padding: "10px 12px", fontSize: "11px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
          <span style={{ color: "rgba(100, 150, 190, 1)", minWidth: "64px" }}>SN</span>
          <span style={{ color: "rgba(200, 230, 255, 1)", fontFamily: "monospace" }}>{device.sn}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
          <MapPin size={12} style={{ color: "rgba(0, 180, 220, 0.9)", flexShrink: 0 }} />
          <span style={{ color: "rgba(180, 220, 255, 0.9)" }}>点位</span>
          <span style={{ color: "rgba(200, 230, 255, 1)", fontFamily: "monospace", fontSize: "10px" }}>{pointStr}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
          <span style={{ color: "rgba(100, 150, 190, 1)", minWidth: "64px" }}>任务名称</span>
          <span style={{ color: "rgba(200, 230, 255, 1)" }}>{device.taskName}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
          <span style={{ color: "rgba(100, 150, 190, 1)", minWidth: "64px" }}>任务状态</span>
          <span
            style={{
              color:
                device.statusCode === 14
                  ? "rgba(148, 163, 184, 1)"
                  : [9, 10, 11, 12].includes(device.statusCode)
                    ? "rgba(255, 185, 0, 1)"
                    : [3, 4, 5, 6, 7, 17, 20, 21].includes(device.statusCode)
                      ? "rgba(0, 210, 255, 1)"
                      : "rgba(0, 255, 180, 1)",
            }}
          >
            {AIRCRAFT_STATUS_MAP[String(device.statusCode)] ?? `状态${device.statusCode}`}
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setShowLiveVideo((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "5px 10px",
              fontSize: "10px",
              background: showLiveVideo ? "rgba(0, 120, 180, 0.5)" : "rgba(0, 100, 160, 0.35)",
              border: "1px solid rgba(0, 180, 220, 0.4)",
              borderRadius: "4px",
              color: "rgba(0, 210, 255, 1)",
              cursor: "pointer",
            }}
          >
            <Video size={12} />
            直播画面
          </button>
          <button
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "5px 10px",
              fontSize: "10px",
              background: "rgba(180, 60, 60, 0.25)",
              border: "1px solid rgba(255, 80, 80, 0.4)",
              borderRadius: "4px",
              color: "rgba(255, 120, 120, 1)",
              cursor: "pointer",
            }}
          >
            <Shield size={12} />
            强制接管
          </button>
          <button
            type="button"
            onClick={() => navigate("/fly", { state: { deviceId: device.id, deviceSn: device.sn, deviceName: device.name } })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "5px 10px",
              fontSize: "10px",
              background: "rgba(0, 80, 120, 0.3)",
              border: "1px solid rgba(0, 160, 200, 0.35)",
              borderRadius: "4px",
              color: "rgba(0, 200, 255, 1)",
              cursor: "pointer",
            }}
          >
            <FileText size={12} />
            详情
          </button>
        </div>
      </div>
      {showLiveVideo && (
        <div
          style={{
            borderTop: "1px solid rgba(0, 120, 180, 0.3)",
            padding: "8px",
            background: "rgba(0, 20, 45, 0.95)",
          }}
        >
          <div style={{ fontSize: "10px", color: "rgba(0, 180, 220, 0.9)", marginBottom: "6px" }}>飞机直播画面 · {device.name}</div>
          <div
            style={{
              aspectRatio: "16/9",
              background: "rgba(0, 40, 80, 0.6)",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(0, 180, 220, 0.5)",
              fontSize: "11px",
            }}
          >
            直播流占位（可接入真实推流）
          </div>
        </div>
      )}
    </div>
  );
};
