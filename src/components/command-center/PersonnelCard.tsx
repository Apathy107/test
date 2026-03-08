import React from "react";
import { Users, UserCheck, UserX, TrendingUp, Award } from "lucide-react";
import type { PilotQualificationMetrics } from "@/data/command-center/personnelMetrics";

interface PersonnelCardProps {
  total?: number;
  /** 持证人数 */
  certified?: number;
  /** 未持证人数 */
  uncertified?: number;
  trend?: number;
  /** 飞手资质指标（与人员资质管理同步） */
  pilotQualification?: PilotQualificationMetrics;
}

const PersonnelCard: React.FC<PersonnelCardProps> = ({
  total = 48,
  certified = 32,
  uncertified = 16,
  trend = 12,
  pilotQualification,
}) => {
  const ratio = total ? Math.round((certified / total) * 100) : 0;
  const qual = pilotQualification;

  return (
    <div
      data-cmp="PersonnelCard"
      className="fui-panel fui-corner"
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
            <Users size={11} style={{ color: "rgba(0, 210, 255, 1)" }} />
          </div>
          <span className="fui-title">人员指标</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
          <TrendingUp size={10} style={{ color: "rgba(0, 255, 180, 1)" }} />
          <span style={{ fontSize: "10px", color: "rgba(0, 255, 180, 1)", fontFamily: "monospace" }}>+{trend}%</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", marginBottom: "8px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span
              className="data-value number-flash"
              style={{ fontSize: "36px", lineHeight: 1 }}
            >
              {total}
            </span>
            <span style={{ fontSize: "10px", color: "rgba(60, 140, 180, 1)" }}>飞手</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginBottom: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <UserCheck size={11} style={{ color: "rgba(0, 255, 180, 1)" }} />
            <span style={{ fontSize: "13px", fontFamily: "monospace", fontWeight: 700, color: "rgba(0, 255, 180, 1)" }}>{certified}</span>
            <span style={{ fontSize: "10px", color: "rgba(60, 130, 160, 1)" }}>持证</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <UserX size={11} style={{ color: "rgba(80, 140, 180, 1)" }} />
            <span style={{ fontSize: "13px", fontFamily: "monospace", fontWeight: 700, color: "rgba(80, 140, 180, 1)" }}>{uncertified}</span>
            <span style={{ fontSize: "10px", color: "rgba(60, 130, 160, 1)" }}>未持证</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
          <span style={{ fontSize: "10px", color: "rgba(60, 130, 160, 1)" }}>持证率</span>
          <span style={{ fontSize: "10px", fontFamily: "monospace", fontWeight: 700, color: "rgba(0, 255, 180, 1)" }}>{ratio}%</span>
        </div>
        <div
          style={{
            width: "100%",
            height: "4px",
            background: "rgba(0, 30, 60, 0.8)",
            borderRadius: "2px",
            overflow: "hidden",
            border: "1px solid rgba(0, 60, 100, 0.5)",
          }}
        >
          <div
            style={{
              width: `${ratio}%`,
              height: "100%",
              background: "linear-gradient(90deg, rgba(0,120,200,1), rgba(0,255,180,1))",
              borderRadius: "2px",
              boxShadow: "0 0 6px rgba(0,255,180,0.7)",
              transition: "width 1s ease",
            }}
          />
        </div>
      </div>

      {qual && (
        <div style={{ marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
            <Award size={10} style={{ color: "rgba(0, 210, 255, 1)" }} />
            <span style={{ fontSize: "10px", color: "rgba(60, 130, 160, 1)" }}>飞手资质</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 6px" }}>
            <span style={{ fontSize: "9px", color: "rgba(0, 212, 255, 0.95)", background: "rgba(0, 60, 100, 0.5)", padding: "2px 5px", borderRadius: "2px" }}>视距内 {qual.vlos}</span>
            <span style={{ fontSize: "9px", color: "rgba(0, 220, 150, 0.95)", background: "rgba(0, 60, 80, 0.5)", padding: "2px 5px", borderRadius: "2px" }}>超视距 {qual.bvlos}</span>
            <span style={{ fontSize: "9px", color: "rgba(180, 160, 255, 0.95)", background: "rgba(60, 40, 100, 0.4)", padding: "2px 5px", borderRadius: "2px" }}>教员 {qual.instructor}</span>
            <span style={{ fontSize: "9px", color: "rgba(255, 200, 0, 0.95)", background: "rgba(80, 60, 0, 0.3)", padding: "2px 5px", borderRadius: "2px" }}>农业植保 {qual.agriculture}</span>
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "28px" }}>
        {[55, 68, 58, 75, 62, 70, 80, 65, 85, 72, 78, 90].map((v, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${(v / 100) * 100}%`,
              background: i === 11
                ? "rgba(0, 255, 180, 0.85)"
                : `rgba(0, ${120 + i * 6}, 220, 0.4)`,
              borderRadius: "1px 1px 0 0",
              boxShadow: i === 11 ? "0 0 5px rgba(0,255,180,0.6)" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PersonnelCard;
