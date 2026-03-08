import React from "react";
import { BrainCircuit, TrendingUp, BarChart3, Database, Cpu } from "lucide-react";
import ModulePageLayout from "@/components/ModulePageLayout";

const COLOR = "rgb(20, 200, 255)";
const GLOW = "rgba(20, 200, 255, 0.4)";

/**
 * DataIntelligence - 数据智能中心 page
 */
const DataIntelligence: React.FC = () => {
  console.log("DataIntelligence page rendered");

  const metrics = [
    { label: "数据总量", value: "2.4 TB", icon: Database, change: "+12%" },
    { label: "AI分析任务", value: "1,284", icon: Cpu, change: "+28%" },
    { label: "识别准确率", value: "98.6%", icon: BrainCircuit, change: "+0.4%" },
    { label: "今日数据量", value: "36 GB", icon: BarChart3, change: "+5%" },
  ];

  const insights = [
    { title: "飞行效率分析", desc: "本月飞行效率较上月提升 14.2%，航线优化算法贡献显著", tag: "效率", color: "rgb(0, 210, 120)" },
    { title: "设备健康预测", desc: "AI预测 UAV-007 将于7天内需要主电机保养，建议提前安排", tag: "预警", color: "rgb(255, 160, 0)" },
    { title: "区域热力分析", desc: "南区CBD飞行密度最高，建议增加该区域备用设备配置", tag: "分析", color: COLOR },
    { title: "任务完成率", desc: "本月任务完成率 96.8%，较目标值高 1.8 个百分点", tag: "报告", color: "rgb(180, 120, 255)" },
  ];

  const barData = [65, 78, 82, 71, 90, 85, 88, 76, 93, 87, 95, 88];
  const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

  return (
    <ModulePageLayout title="数据智能中心" subtitle="DATA INTELLIGENCE CENTER" icon={BrainCircuit} color={COLOR} glowColor={GLOW}>
      {/* Metrics */}
      <div className="flex gap-5 mb-7">
        {metrics.map((m, i) => (
          <div key={i} style={{ flex: 1, background: "rgba(0, 15, 50, 0.8)", border: `1px solid ${GLOW}`, borderRadius: "4px", padding: "18px 20px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent, ${COLOR}, transparent)` }} />
            <div className="flex justify-between items-center mb-3">
              <m.icon size={16} style={{ color: COLOR }} />
              <span style={{ fontSize: "11px", color: "rgb(0, 210, 120)", fontFamily: "monospace" }}>{m.change}</span>
            </div>
            <div style={{ fontSize: "22px", fontWeight: "700", color: "rgb(220, 245, 255)", fontFamily: "monospace" }}>{m.value}</div>
            <div style={{ fontSize: "11px", color: "rgba(0, 160, 200, 0.55)", marginTop: "4px", fontFamily: "'Microsoft YaHei', sans-serif" }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Bar chart */}
        <div style={{ flex: 1, background: "rgba(0, 12, 45, 0.8)", border: `1px solid ${GLOW}`, borderRadius: "4px", padding: "20px" }}>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={14} style={{ color: COLOR }} />
            <span style={{ fontSize: "14px", fontWeight: "700", color: "rgb(200, 235, 255)", fontFamily: "'Microsoft YaHei', sans-serif", letterSpacing: "0.1em" }}>全年任务完成率趋势</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "180px" }}>
            {barData.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%" }}>
                <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                  <div
                    style={{
                      width: "100%",
                      height: `${v}%`,
                      background: `linear-gradient(180deg, ${COLOR} 0%, rgba(0, 120, 200, 0.4) 100%)`,
                      borderRadius: "2px 2px 0 0",
                      boxShadow: `0 0 8px ${GLOW}`,
                      transition: "height 0.5s ease",
                    }}
                  />
                </div>
                <span style={{ fontSize: "9px", color: "rgba(0, 150, 190, 0.45)", fontFamily: "monospace" }}>{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div style={{ width: "340px", flexShrink: 0, background: "rgba(0, 12, 45, 0.8)", border: `1px solid ${GLOW}`, borderRadius: "4px", padding: "20px" }}>
          <div className="flex items-center gap-2 mb-5">
            <BrainCircuit size={14} style={{ color: COLOR }} />
            <span style={{ fontSize: "14px", fontWeight: "700", color: "rgb(200, 235, 255)", fontFamily: "'Microsoft YaHei', sans-serif", letterSpacing: "0.1em" }}>AI 智能洞察</span>
          </div>
          <div className="flex flex-col gap-3">
            {insights.map((ins, i) => (
              <div key={i} style={{ padding: "12px 14px", background: "rgba(0, 20, 60, 0.6)", border: `1px solid rgba(0, 130, 180, 0.2)`, borderLeft: `3px solid ${ins.color}`, borderRadius: "3px" }}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: "13px", color: "rgb(200, 235, 255)", fontFamily: "'Microsoft YaHei', sans-serif", fontWeight: "600" }}>{ins.title}</span>
                  <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "2px", background: ins.color.replace("rgb", "rgba").replace(")", ", 0.15)"), color: ins.color }}>{ins.tag}</span>
                </div>
                <div style={{ fontSize: "11px", color: "rgba(0, 160, 200, 0.55)", fontFamily: "'Microsoft YaHei', sans-serif", lineHeight: "1.5" }}>{ins.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModulePageLayout>
  );
};

export default DataIntelligence;