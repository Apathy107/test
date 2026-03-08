import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title?: string;
  value?: string | number;
  unit?: string;
  icon?: LucideIcon;
  trend?: number;
  trendLabel?: string;
  color?: string;
  subValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title = "统计指标",
  value = "0",
  unit = "",
  icon: Icon,
  trend,
  trendLabel = "较上月",
  color = "rgba(30, 136, 229, 1)",
  subValue,
}) => {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <div
      data-cmp="StatCard"
      className="panel-card"
      style={{ padding: "20px 24px", position: "relative", overflow: "hidden" }}
    >
      {/* Background accent */}
      <div
        style={{
          position: "absolute",
          right: -10,
          top: -10,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: color,
          opacity: 0.06,
        }}
      />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 12, color: "rgba(120, 145, 180, 1)", marginBottom: 8 }}>{title}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: "rgba(220, 228, 240, 1)", lineHeight: 1 }}>
              {value}
            </span>
            {unit && (
              <span style={{ fontSize: 12, color: "rgba(120, 145, 180, 1)" }}>{unit}</span>
            )}
          </div>
          {subValue && (
            <div style={{ fontSize: 11, color: "rgba(100, 130, 170, 1)", marginTop: 4 }}>{subValue}</div>
          )}
          {trend !== undefined && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
              {isPositive
                ? <TrendingUp size={12} color="rgba(76,175,80,1)" />
                : <TrendingDown size={12} color="rgba(239,68,68,1)" />
              }
              <span style={{ fontSize: 11, color: isPositive ? "rgba(100,200,100,1)" : "rgba(239,83,80,1)" }}>
                {isPositive ? "+" : ""}{trend}% {trendLabel}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 8,
              background: color,
              opacity: 0.15,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={20} color={color} style={{ opacity: 6.67 }} />
          </div>
        )}
      </div>

      {/* Icon overlay properly */}
      {Icon && (
        <div
          style={{
            position: "absolute",
            right: 24,
            top: 20,
            width: 42,
            height: 42,
            borderRadius: 8,
            background: `${color}26`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={20} color={color} />
        </div>
      )}
    </div>
  );
};

export default StatCard;