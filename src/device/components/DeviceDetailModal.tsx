import React from "react";
import { X, MapPin, Battery, Signal, Clock, Cpu, Wifi } from "lucide-react";
import StatusBadge from "./StatusBadge";
import QRCodeDisplay from "./QRCodeDisplay";

interface DeviceDetailModalProps {
  open?: boolean;
  onClose?: () => void;
  deviceName?: string;
  deviceSN?: string;
  deviceUnit?: string;
}

const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({
  open = true,
  onClose = () => console.log("Close modal"),
  deviceName = "巡逻一号",
  deviceSN = "DJI-M300-2024001",
  deviceUnit = "市局直属队",
}) => {
  if (!open) return null;

  const infoRows = [
    { label: "位置坐标", value: "116.3974°E  39.9093°N", icon: MapPin },
    { label: "部署地址", value: "北京市东城区建国门大街1号", icon: MapPin },
    { label: "电量", value: "82%", icon: Battery },
    { label: "信号强度", value: "-65 dBm (良好)", icon: Signal },
    { label: "累计飞行时长", value: "342 小时", icon: Clock },
    { label: "供电电压", value: "26.2V", icon: Cpu },
    { label: "RTK状态", value: "已固定 (精度 ±2cm)", icon: Wifi },
  ];

  return (
    <div
      data-cmp="DeviceDetailModal"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "rgba(16, 22, 38, 1)",
          border: "1px solid rgba(40, 58, 90, 1)",
          borderRadius: 8,
          width: 780,
          maxHeight: "85vh",
          overflow: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid rgba(30, 50, 80, 1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "rgba(220,228,240,1)" }}>
              设备详情 — {deviceName}
            </div>
            <div style={{ fontSize: 12, color: "rgba(100,130,170,1)", marginTop: 2 }}>
              SN: {deviceSN}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <StatusBadge status="online" />
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(120,145,180,1)" }}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 0 }}>
          {/* Left: Info */}
          <div style={{ flex: 1, padding: "20px 24px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(100,130,170,1)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              基础信息
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
              {[
                ["设备类型", "多旋翼"], ["型号", "M300 RTK"],
                ["厂商", "大疆（DJI）"], ["采购日期", "2024-01-15"],
                ["质保期", "2026-01-15"], ["适配机型", "M300系列"],
                ["所属单位", deviceUnit], ["责任人", "张伟"],
              ].map(([k, v]) => (
                <div key={k} style={{ width: "50%", marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: "rgba(100,130,170,1)" }}>{k}</div>
                  <div style={{ fontSize: 13, color: "rgba(200,220,240,1)", marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid rgba(30,50,80,1)", paddingTop: 16, marginTop: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(100,130,170,1)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                实时状态参数
              </div>
              {infoRows.map(({ label, value, icon: Icon }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <Icon size={13} color="rgba(100,181,246,1)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "rgba(120,145,180,1)", width: 100, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: 12, color: "rgba(200,220,240,1)" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: QR + Actions */}
          <div style={{ width: 200, borderLeft: "1px solid rgba(30,50,80,1)", padding: "20px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
            <QRCodeDisplay deviceId="D001" deviceName={deviceName} unit={deviceUnit} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="btn-primary" style={{ fontSize: 12 }}>远程控制</button>
              <button className="btn-secondary" style={{ fontSize: 12 }}>固件升级</button>
              <button className="btn-secondary" style={{ fontSize: 12 }}>查看保养记录</button>
              <button className="btn-secondary" style={{ fontSize: 12 }}>查看维修记录</button>
              <button className="btn-danger" style={{ fontSize: 12 }}>申请报废</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailModal;