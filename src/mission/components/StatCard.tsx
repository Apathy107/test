import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title?: string;
  value?: string | number;
  unit?: string;
  sub?: string;
  trend?: string;
  trendUp?: boolean;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  highlight?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title = "统计项",
  value = "0",
  unit = "",
  sub = "",
  trend = "",
  trendUp = true,
  icon: Icon,
  iconColor = "rgba(0, 212, 255, 1)",
  iconBg = "rgba(0, 80, 140, 0.5)",
  highlight = "",
}) => {
  return (
    <div
      data-cmp="StatCard"
      className="tech-card"
      style={{
        borderRadius: "6px",
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        minWidth: 0,
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "12px", color: "rgba(100, 150, 200, 1)", letterSpacing: "0.5px" }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              background: iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${iconColor}33`,
            }}
          >
            <Icon size={16} style={{ color: iconColor }} />
          </div>
        )}
      </div>

      {/* Value row */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
        <span
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "rgba(220, 240, 255, 1)",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: "13px", color: "rgba(100, 150, 200, 1)" }}>{unit}</span>
        )}
      </div>

      {/* Sub + Trend */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "11px", color: "rgba(80, 120, 180, 1)" }}>{sub}</span>
        {trend && (
          <span
            style={{
              fontSize: "11px",
              color: trendUp ? "rgba(0, 200, 120, 1)" : "rgba(255, 80, 80, 1)",
              display: "flex",
              alignItems: "center",
              gap: "2px",
            }}
          >
            {trendUp ? "▲" : "▼"} {trend}
          </span>
        )}
        {highlight && (
          <span style={{ fontSize: "11px", color: "rgba(255, 180, 0, 1)" }}>{highlight}</span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
