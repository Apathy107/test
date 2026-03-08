import React from "react";
import StatusBadge from "@personnel/components/StatusBadge";
import { Trophy, Target, Clock, Shield, TrendingUp, TrendingDown } from "lucide-react";

const pilots = [
  { name: "李明", unit: "东城分队", attendance: 98, successRate: 100, responseTime: 11, safetyScore: 100, deductions: 0, total: 98, rank: 1 },
  { name: "周强", unit: "北郊中队", attendance: 95, successRate: 97, responseTime: 13, safetyScore: 100, deductions: 0, total: 95, rank: 2 },
  { name: "吴雪", unit: "西城分队", attendance: 92, successRate: 96, responseTime: 14, safetyScore: 80, deductions: 1, total: 93, rank: 3 },
  { name: "郑宇", unit: "应急响应", attendance: 90, successRate: 95, responseTime: 12, safetyScore: 100, deductions: 0, total: 91, rank: 4 },
  { name: "张三", unit: "东城分队", attendance: 88, successRate: 94, responseTime: 16, safetyScore: 80, deductions: 1, total: 87, rank: 5 },
  { name: "刘洋", unit: "北郊中队", attendance: 85, successRate: 90, responseTime: 18, safetyScore: 60, deductions: 2, total: 80, rank: 6 },
  { name: "王五", unit: "北郊中队", attendance: 70, successRate: 82, responseTime: 22, safetyScore: 60, deductions: 2, total: 68, rank: 7 },
  { name: "赵六", unit: "南区分队", attendance: 60, successRate: 75, responseTime: 28, safetyScore: 40, deductions: 3, total: 55, rank: 8 },
];

const scoreFormulas = [
  { label: "出勤率", formula: "（实际执行任务数 / 计划任务数）× 100%", weight: "25%" },
  { label: "任务成功率", formula: "（成功完成任务数 / 总派单数）× 100%", weight: "35%" },
  { label: "响应时效", formula: "紧急任务接单至起飞时间（目标 ≤ 15 分钟，超时按比例扣分）", weight: "20%" },
  { label: "安全评分", formula: "100 分 − 违规次数 × 20 分（越界/未按航线执行）", weight: "20%" },
];

const Performance: React.FC = () => {
  console.log("Performance page rendered");

  const avgScore = Math.round(pilots.reduce((s, p) => s + p.total, 0) / pilots.length);
  const deductedCount = pilots.filter((p) => p.deductions > 0).length;

  return (
    <>
      {/* Stats row */}
      <div className="flex gap-4 mb-5">
        {[
          { label: "平均综合评分", value: avgScore, unit: "分", color: "rgba(0, 212, 255, 1)", icon: Trophy },
          { label: "平均出勤率", value: "84.8", unit: "%", color: "rgba(0, 220, 150, 1)", icon: Target },
          { label: "平均响应时效", value: "16.8", unit: "分钟", color: "rgba(255, 200, 0, 1)", icon: Clock },
          { label: "有违规记录", value: deductedCount, unit: "人", color: "rgba(255, 80, 80, 1)", icon: Shield },
        ].map((s) => {
          const Ic = s.icon;
          return (
            <div key={s.label} className="flex-1 tech-card rounded-lg p-4 flex items-center gap-3">
              <Ic size={22} style={{ color: s.color }} />
              <div>
                <div className="text-2xl font-bold" style={{ color: s.color }}>
                  {s.value}<span className="text-sm font-normal ml-1" style={{ color: "rgba(100, 140, 180, 1)" }}>{s.unit}</span>
                </div>
                <div className="text-xs" style={{ color: "rgba(100, 140, 180, 1)" }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 mb-5">
        {/* Score formula explanation */}
        <div className="tech-card rounded-lg p-4 w-[380px] flex-shrink-0">
          <div className="text-xs font-semibold mb-3" style={{ color: "rgba(0, 212, 255, 0.8)", letterSpacing: "0.1em" }}>
            — 绩效计算规则
          </div>
          <div className="flex flex-col gap-3">
            {scoreFormulas.map((f) => (
              <div
                key={f.label}
                className="p-3 rounded"
                style={{ background: "rgba(0, 50, 90, 0.2)", border: "1px solid rgba(0, 100, 150, 0.2)" }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: "rgba(0, 212, 255, 0.9)" }}>{f.label}</span>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(0, 80, 120, 0.3)", color: "rgba(0, 200, 255, 0.8)" }}>{f.weight}</span>
                </div>
                <div className="text-xs" style={{ color: "rgba(100, 150, 190, 1)", lineHeight: "1.5" }}>{f.formula}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution bar chart */}
        <div className="tech-card rounded-lg p-4 flex-1">
          <div className="text-xs font-semibold mb-4" style={{ color: "rgba(0, 212, 255, 0.8)", letterSpacing: "0.1em" }}>
            — 评分分布
          </div>
          <div className="flex flex-col gap-3">
            {[
              { range: "优秀（90-100分）", count: 4, color: "rgba(0, 220, 150, 1)" },
              { range: "良好（80-89分）", count: 2, color: "rgba(0, 212, 255, 1)" },
              { range: "一般（70-79分）", count: 1, color: "rgba(255, 200, 0, 1)" },
              { range: "待改进（<70分）", count: 1, color: "rgba(255, 80, 80, 1)" },
            ].map((item) => (
              <div key={item.range}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: "rgba(140, 180, 210, 1)" }}>{item.range}</span>
                  <span className="text-xs font-medium" style={{ color: item.color }}>{item.count}人</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: "rgba(16, 38, 76, 1)" }}>
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${(item.count / pilots.length) * 100}%`,
                      background: item.color,
                      boxShadow: `0 0 6px ${item.color}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance ranking table */}
      <div className="tech-card rounded-lg overflow-hidden">
        <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(0, 150, 200, 0.2)" }}>
          <span className="text-sm font-semibold" style={{ color: "rgba(200, 220, 240, 1)" }}>绩效排行榜</span>
          <span className="text-xs ml-3" style={{ color: "rgba(80, 120, 160, 1)" }}>统计周期：2025年7月</span>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: "rgba(0, 60, 100, 0.25)", borderBottom: "1px solid rgba(0, 150, 200, 0.3)" }}>
              {["排名", "飞手", "所属单位", "出勤率", "任务成功率", "响应时效", "安全评分", "扣分次数", "综合评分", "趋势"].map((h) => (
                <th key={h} className="px-3 py-3 text-left font-medium text-xs" style={{ color: "rgba(0, 212, 255, 0.85)", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pilots.map((p) => (
              <tr key={p.name} className="table-row-hover" style={{ borderBottom: "1px solid rgba(0, 80, 120, 0.2)" }}>
                <td className="px-3 py-3">
                  <span
                    className="w-7 h-7 inline-flex items-center justify-center rounded text-xs font-bold"
                    style={{
                      background: p.rank <= 3 ? (p.rank === 1 ? "rgba(255, 200, 0, 0.15)" : p.rank === 2 ? "rgba(180, 200, 220, 0.15)" : "rgba(200, 120, 60, 0.15)") : "rgba(16, 38, 76, 0.5)",
                      color: p.rank <= 3 ? (p.rank === 1 ? "rgba(255, 200, 0, 1)" : p.rank === 2 ? "rgba(200, 220, 240, 1)" : "rgba(200, 120, 60, 1)") : "rgba(100, 140, 180, 1)",
                      border: `1px solid ${p.rank <= 3 ? (p.rank === 1 ? "rgba(255, 200, 0, 0.4)" : "rgba(160, 180, 200, 0.3)") : "rgba(60, 100, 140, 0.3)"}`,
                    }}
                  >
                    {p.rank}
                  </span>
                </td>
                <td className="px-3 py-3 text-xs font-medium" style={{ color: "rgba(200, 220, 240, 1)" }}>{p.name}</td>
                <td className="px-3 py-3 text-xs" style={{ color: "rgba(140, 180, 210, 1)" }}>{p.unit}</td>
                <td className="px-3 py-3 text-xs">
                  <span style={{ color: p.attendance >= 90 ? "rgba(0, 220, 150, 1)" : p.attendance >= 80 ? "rgba(255, 200, 0, 1)" : "rgba(255, 80, 80, 1)" }}>
                    {p.attendance}%
                  </span>
                </td>
                <td className="px-3 py-3 text-xs">
                  <span style={{ color: p.successRate >= 95 ? "rgba(0, 220, 150, 1)" : p.successRate >= 85 ? "rgba(255, 200, 0, 1)" : "rgba(255, 80, 80, 1)" }}>
                    {p.successRate}%
                  </span>
                </td>
                <td className="px-3 py-3 text-xs">
                  <span style={{ color: p.responseTime <= 15 ? "rgba(0, 220, 150, 1)" : p.responseTime <= 20 ? "rgba(255, 200, 0, 1)" : "rgba(255, 80, 80, 1)" }}>
                    {p.responseTime}min
                  </span>
                </td>
                <td className="px-3 py-3 text-xs">
                  <span style={{ color: p.safetyScore === 100 ? "rgba(0, 220, 150, 1)" : p.safetyScore >= 80 ? "rgba(255, 200, 0, 1)" : "rgba(255, 80, 80, 1)" }}>
                    {p.safetyScore}
                  </span>
                </td>
                <td className="px-3 py-3 text-xs text-center">
                  {p.deductions > 0 ? (
                    <span style={{ color: "rgba(255, 80, 80, 1)", fontWeight: 600 }}>-{p.deductions * 5}分</span>
                  ) : (
                    <span style={{ color: "rgba(0, 220, 150, 0.6)" }}>—</span>
                  )}
                </td>
                <td className="px-3 py-3">
                  <span
                    className="text-sm font-bold"
                    style={{ color: p.total >= 90 ? "rgba(0, 220, 150, 1)" : p.total >= 80 ? "rgba(0, 212, 255, 1)" : p.total >= 70 ? "rgba(255, 200, 0, 1)" : "rgba(255, 80, 80, 1)" }}
                  >
                    {p.total}
                  </span>
                  <StatusBadge
                    status={p.total >= 90 ? "active" : p.total >= 80 ? "normal" : p.total >= 70 ? "warning" : "danger"}
                    label={p.total >= 90 ? "优秀" : p.total >= 80 ? "良好" : p.total >= 70 ? "一般" : "待改进"}
                    dot={false}
                  />
                </td>
                <td className="px-3 py-3">
                  {p.rank <= 4 ? (
                    <TrendingUp size={14} style={{ color: "rgba(0, 220, 150, 1)" }} />
                  ) : (
                    <TrendingDown size={14} style={{ color: "rgba(255, 80, 80, 1)" }} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Performance;