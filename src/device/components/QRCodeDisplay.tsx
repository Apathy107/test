import React from "react";
import { QrCode, Download } from "lucide-react";

interface QRCodeDisplayProps {
  deviceId?: string;
  deviceName?: string;
  unit?: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  deviceId = "D001",
  deviceName = "巡逻一号",
  unit = "市局直属队",
}) => {
  // Generate a visual QR code placeholder pattern
  const cells = Array.from({ length: 7 }, (_, r) =>
    Array.from({ length: 7 }, (_, c) => {
      const hash = (r * 13 + c * 7 + deviceId.charCodeAt(0)) % 3;
      return hash < 2;
    })
  );

  return (
    <div
      data-cmp="QRCodeDisplay"
      style={{
        background: "rgba(255,255,255,1)",
        borderRadius: 6,
        padding: 12,
        textAlign: "center",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
        <QrCode size={80} color="rgba(10,14,26,1)" />
      </div>
      <div style={{ fontSize: 10, color: "rgba(40,58,90,1)", fontWeight: 700, marginBottom: 2 }}>
        {deviceId}
      </div>
      <div style={{ fontSize: 9, color: "rgba(60,80,110,1)", marginBottom: 1 }}>{deviceName}</div>
      <div style={{ fontSize: 9, color: "rgba(80,100,130,1)" }}>{unit}</div>
      <button
        style={{
          marginTop: 8,
          background: "rgba(30,136,229,1)",
          color: "rgba(255,255,255,1)",
          border: "none",
          borderRadius: 3,
          padding: "3px 10px",
          fontSize: 10,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
        }}
        onClick={() => console.log("Download QR for", deviceId)}
      >
        <Download size={9} /> 下载
      </button>
    </div>
  );
};

export default QRCodeDisplay;