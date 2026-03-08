import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  title?: string;
  value?: string | number;
  unit?: string;
  icon?: LucideIcon;
  iconBg?: string;
  trend?: number;
  highlight?: "red" | "yellow" | "blue" | "none";
  subtitle?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title = "指标名称",
  value = "0",
  unit = "",
  icon: Icon = TrendingUp,
  iconBg = "rgba(24, 144, 255, 0.15)",
  trend = 0,
  highlight = "none",
  subtitle = "",
}) => {
  const borderLeft = highlight !== "none" ? `4px solid ${highlight === "red" ? "rgb(248, 113, 113)" : highlight === "yellow" ? "rgb(250, 204, 21)" : "rgb(96, 165, 250)"}` : "none";
  const valueColor = highlight === "red" ? "rgba(248, 113, 113, 1)" : highlight === "yellow" ? "rgba(250, 204, 21, 1)" : highlight === "blue" ? "rgba(96, 165, 250, 1)" : "rgba(224, 228, 236, 1)";

  return (
    <div
      data-cmp="KpiCard"
      style={{
        background: "rgba(22, 26, 35, 1)",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.4)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minWidth: 0,
        borderLeft,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(120, 130, 150, 1)" }}>{title}</span>
        <div style={{ width: 40, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: iconBg }}>
          <Icon size={20} style={{ color: "rgba(24, 144, 255, 1)" }} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
        <span style={{ fontSize: 30, fontWeight: 700, lineHeight: 1, color: valueColor }}>{value}</span>
        {unit && <span style={{ color: "rgba(120, 130, 150, 1)", fontSize: 14, marginBottom: 2 }}>{unit}</span>}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "rgba(120, 130, 150, 1)" }}>{subtitle}</span>
        {trend !== 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, color: trend > 0 ? "rgba(74, 222, 128, 1)" : "rgba(248, 113, 113, 1)" }}>
            {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
