import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title?: string;
  value?: string | number;
  unit?: string;
  subInfo?: string;
  trend?: number;
  trendLabel?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  alert?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title = "统计项",
  value = "0",
  unit = "",
  subInfo = "",
  trend = 0,
  trendLabel = "较上月",
  icon: Icon,
  iconColor = "rgba(0, 212, 255, 1)",
  iconBg = "rgba(0, 100, 150, 0.3)",
  alert = false,
}) => {
  const isUp = trend >= 0;
  return (
    <div
      data-cmp="StatCard"
      className="tech-card rounded-lg p-4 relative overflow-hidden"
      style={{
        border: alert
          ? "1px solid rgba(255, 150, 0, 0.5)"
          : "1px solid rgba(0, 150, 200, 0.35)",
      }}
    >
      {/* Corner decorations */}
      <div
        className="absolute top-0 left-0 w-3 h-3"
        style={{
          borderTop: "2px solid " + iconColor,
          borderLeft: "2px solid " + iconColor,
          opacity: 0.8,
        }}
      />
      <div
        className="absolute top-0 right-0 w-3 h-3"
        style={{
          borderTop: "2px solid " + iconColor,
          borderRight: "2px solid " + iconColor,
          opacity: 0.8,
        }}
      />

      <div className="flex items-start justify-between mb-3">
        <div
          className="text-xs font-medium"
          style={{ color: "rgba(100, 140, 180, 1)" }}
        >
          {title}
        </div>
        {Icon && (
          <div
            className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: iconBg }}
          >
            <Icon size={18} style={{ color: iconColor }} />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1 mb-1">
        <span
          className="text-2xl font-bold"
          style={{ color: alert ? "rgba(255, 200, 0, 1)" : "rgba(200, 230, 255, 1)" }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-sm" style={{ color: "rgba(100, 140, 180, 1)" }}>
            {unit}
          </span>
        )}
      </div>

      {subInfo && (
        <div className="text-xs mb-2" style={{ color: "rgba(80, 120, 160, 1)" }}>
          {subInfo}
        </div>
      )}

      {trend !== 0 && (
        <div className="flex items-center gap-1 text-xs">
          {isUp ? (
            <TrendingUp size={12} style={{ color: "rgba(0, 220, 150, 1)" }} />
          ) : (
            <TrendingDown size={12} style={{ color: "rgba(255, 100, 80, 1)" }} />
          )}
          <span
            style={{ color: isUp ? "rgba(0, 220, 150, 1)" : "rgba(255, 100, 80, 1)" }}
          >
            {isUp ? "+" : ""}{trend}% {trendLabel}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;