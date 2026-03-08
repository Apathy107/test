import React from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Users, Cpu, ClipboardList, AlertTriangle, TrendingUp, CheckCircle, Activity } from "lucide-react";

/**
 * KPI card for a single metric display
 */
const KpiCard: React.FC<{
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
  glow: string;
}> = ({ label, value, sub, icon: Icon, color, glow }) => (
  <div
    style={{
      background: "linear-gradient(135deg, rgba(0, 20, 60, 0.85) 0%, rgba(0, 12, 40, 0.85) 100%)",
      border: `1px solid ${color}40`,
      borderRadius: "4px",
      padding: "14px 16px",
      position: "relative",
      overflow: "hidden",
      flex: 1,
      minWidth: "0",
    }}
  >
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    <div style={{ position: "absolute", top: "10px", right: "12px", opacity: 0.12 }}>
      <Icon size={32} style={{ color }} />
    </div>
    <div style={{ fontSize: "11px", color: "rgba(0, 180, 220, 0.55)", fontFamily: "monospace", letterSpacing: "0.12em", marginBottom: "6px" }}>{label}</div>
    <div style={{ fontSize: "26px", fontWeight: "700", color: "rgb(210, 245, 255)", fontFamily: "'Microsoft YaHei', sans-serif", lineHeight: 1, textShadow: `0 0 10px ${glow}` }}>{value}</div>
    {sub && <div style={{ fontSize: "10px", color: "rgba(0, 180, 220, 0.45)", marginTop: "4px", fontFamily: "monospace" }}>{sub}</div>}
    <div style={{ position: "absolute", bottom: 0, left: "20%", right: "20%", height: "1px", background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />
  </div>
);

/**
 * Section header for dashboard panels
 */
const SectionHeader: React.FC<{ icon: React.ElementType; title: string; color?: string }> = ({
  icon: Icon, title, color = "rgb(0, 212, 255)"
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
    <div style={{ width: "3px", height: "16px", background: color, borderRadius: "2px", boxShadow: `0 0 6px ${color}` }} />
    <Icon size={14} style={{ color }} />
    <span style={{ fontSize: "13px", fontWeight: "600", color: "rgb(200, 235, 255)", fontFamily: "'Microsoft YaHei', sans-serif", letterSpacing: "0.1em" }}>{title}</span>
  </div>
);

/** Task trend data for last 7 days */
const taskTrendData = [
  { day: "周一", completed: 12, total: 14 },
  { day: "周二", completed: 18, total: 20 },
  { day: "周三", completed: 15, total: 17 },
  { day: "周四", completed: 22, total: 24 },
  { day: "周五", completed: 19, total: 21 },
  { day: "周六", completed: 8, total: 9 },
  { day: "周日", completed: 6, total: 7 },
];

/** Device type distribution */
const deviceTypeData = [
  { name: "机场", value: 8, color: "rgb(0, 180, 255)" },
  { name: "单兵飞机", value: 24, color: "rgb(0, 220, 150)" },
  { name: "负载", value: 12, color: "rgb(255, 200, 0)" },
  { name: "系留", value: 6, color: "rgb(180, 100, 255)" },
];

/** Task type distribution */
const taskTypeData = [
  { name: "常态化巡检", value: 42 },
  { name: "紧急任务", value: 18 },
  { name: "安保任务", value: 25 },
  { name: "其他", value: 15 },
];

/** Personnel by group */
const personnelGroupData = [
  { name: "分局", total: 28, active: 22 },
  { name: "派出所", total: 45, active: 38 },
  { name: "其他", total: 12, active: 8 },
];

const CUSTOM_TOOLTIP_STYLE = {
  background: "rgba(0, 15, 45, 0.95)",
  border: "1px solid rgba(0, 180, 220, 0.3)",
  borderRadius: "4px",
  fontSize: "11px",
  color: "rgb(180, 230, 255)",
  fontFamily: "monospace",
};

/**
 * CommandDashboard - KPI indicator board for the command center
 */
const CommandDashboard: React.FC = () => {
  console.log("CommandDashboard rendered");

  return (
    <div data-cmp="CommandDashboard" style={{ padding: "16px 0" }}>
      {/* ===== SECTION 1: PERSONNEL ===== */}
      <div style={{ marginBottom: "20px" }}>
        <SectionHeader icon={Users} title="人员指标" color="rgb(0, 200, 255)" />
        <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
          <KpiCard label="飞手总数" value={85} sub="已注册" icon={Users} color="rgb(0, 200, 255)" glow="rgba(0, 200, 255, 0.5)" />
          <KpiCard label="在岗飞手" value={68} sub="当前在岗" icon={Users} color="rgb(0, 220, 150)" glow="rgba(0, 220, 150, 0.5)" />
          <KpiCard label="即将过期" value={7} sub="30天内到期" icon={AlertTriangle} color="rgb(255, 200, 0)" glow="rgba(255, 200, 0, 0.5)" />
          <KpiCard label="已过期" value={3} sub="需立即处理" icon={AlertTriangle} color="rgb(255, 80, 80)" glow="rgba(255, 80, 80, 0.5)" />
        </div>

        {/* Personnel by group bar chart */}
        <div style={{ background: "rgba(0, 12, 38, 0.8)", border: "1px solid rgba(0, 150, 200, 0.18)", borderRadius: "4px", padding: "14px" }}>
          <div style={{ fontSize: "11px", color: "rgba(0, 180, 220, 0.5)", fontFamily: "monospace", marginBottom: "10px", letterSpacing: "0.1em" }}>飞手分组统计（分局 / 派出所 / 其他）</div>
          <ResponsiveContainer width="100%" height={90}>
            <BarChart data={personnelGroupData} barGap={4}>
              <XAxis dataKey="name" tick={{ fill: "rgba(0, 180, 220, 0.55)", fontSize: 11, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} cursor={{ fill: "rgba(0, 180, 255, 0.06)" }} />
              <Bar dataKey="total" name="总数" fill="rgba(0, 180, 255, 0.35)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="active" name="在岗" fill="rgb(0, 200, 255)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== SECTION 2: DEVICES ===== */}
      <div style={{ marginBottom: "20px" }}>
        <SectionHeader icon={Cpu} title="设备指标" color="rgb(0, 220, 150)" />
        <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
          <KpiCard label="设备总数" value={50} icon={Cpu} color="rgb(0, 212, 255)" glow="rgba(0, 212, 255, 0.5)" />
          <KpiCard label="在线数量" value={32} sub="运行正常" icon={Activity} color="rgb(0, 220, 150)" glow="rgba(0, 220, 150, 0.5)" />
          <KpiCard label="离线数量" value={10} icon={Cpu} color="rgba(120, 140, 160, 1)" glow="rgba(120, 140, 160, 0.4)" />
          <KpiCard label="任务执行中" value={8} icon={Activity} color="rgb(0, 180, 255)" glow="rgba(0, 180, 255, 0.5)" />
        </div>
        <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
          <KpiCard label="报废数" value={3} icon={Cpu} color="rgb(255, 80, 80)" glow="rgba(255, 80, 80, 0.5)" />
          <KpiCard label="待维保" value={5} icon={AlertTriangle} color="rgb(255, 160, 0)" glow="rgba(255, 160, 0, 0.5)" />
          <KpiCard label="外借数" value={2} icon={Cpu} color="rgb(160, 100, 255)" glow="rgba(160, 100, 255, 0.5)" />
          <KpiCard label="健康度评分" value="87分" sub="综合评估" icon={TrendingUp} color="rgb(0, 220, 150)" glow="rgba(0, 220, 150, 0.5)" />
        </div>

        {/* Device type pie */}
        <div style={{ background: "rgba(0, 12, 38, 0.8)", border: "1px solid rgba(0, 150, 200, 0.18)", borderRadius: "4px", padding: "14px" }}>
          <div style={{ fontSize: "11px", color: "rgba(0, 180, 220, 0.5)", fontFamily: "monospace", marginBottom: "10px", letterSpacing: "0.1em" }}>设备分类占比</div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <ResponsiveContainer width={120} height={90}>
              <PieChart>
                <Pie data={deviceTypeData} cx="50%" cy="50%" innerRadius={22} outerRadius={40} dataKey="value" strokeWidth={0}>
                  {deviceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px" }}>
              {deviceTypeData.map((d) => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: d.color }} />
                  <span style={{ fontSize: "11px", color: "rgba(0, 180, 220, 0.65)", fontFamily: "monospace" }}>{d.name}: {d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== SECTION 3: FLIGHT TASKS ===== */}
      <div>
        <SectionHeader icon={ClipboardList} title="飞行任务指标" color="rgb(160, 100, 255)" />
        <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
          <KpiCard label="今日计划" value={24} icon={ClipboardList} color="rgb(0, 212, 255)" glow="rgba(0, 212, 255, 0.5)" />
          <KpiCard label="已完成" value={16} icon={CheckCircle} color="rgb(0, 220, 150)" glow="rgba(0, 220, 150, 0.5)" />
          <KpiCard label="执行中" value={5} icon={Activity} color="rgb(255, 200, 0)" glow="rgba(255, 200, 0, 0.5)" />
          <KpiCard label="异常中断" value={2} icon={AlertTriangle} color="rgb(255, 80, 80)" glow="rgba(255, 80, 80, 0.5)" />
        </div>

        {/* Task type pie + trend chart */}
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ flex: 1, background: "rgba(0, 12, 38, 0.8)", border: "1px solid rgba(0, 150, 200, 0.18)", borderRadius: "4px", padding: "14px" }}>
            <div style={{ fontSize: "11px", color: "rgba(0, 180, 220, 0.5)", fontFamily: "monospace", marginBottom: "10px", letterSpacing: "0.1em" }}>任务类型占比</div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <ResponsiveContainer width={100} height={90}>
                <PieChart>
                  <Pie data={taskTypeData} cx="50%" cy="50%" innerRadius={20} outerRadius={38} dataKey="value" strokeWidth={0}>
                    {taskTypeData.map((_, i) => (
                      <Cell key={i} fill={["rgb(0, 180, 255)", "rgb(255, 80, 80)", "rgb(0, 220, 150)", "rgb(160, 100, 255)"][i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {taskTypeData.map((d, i) => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: ["rgb(0, 180, 255)", "rgb(255, 80, 80)", "rgb(0, 220, 150)", "rgb(160, 100, 255)"][i] }} />
                    <span style={{ fontSize: "10px", color: "rgba(0, 180, 220, 0.6)", fontFamily: "monospace" }}>{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ flex: 2, background: "rgba(0, 12, 38, 0.8)", border: "1px solid rgba(0, 150, 200, 0.18)", borderRadius: "4px", padding: "14px" }}>
            <div style={{ fontSize: "11px", color: "rgba(0, 180, 220, 0.5)", fontFamily: "monospace", marginBottom: "10px", letterSpacing: "0.1em" }}>近7天任务完成率趋势</div>
            <ResponsiveContainer width="100%" height={90}>
              <AreaChart data={taskTrendData}>
                <defs>
                  <linearGradient id="taskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(0, 180, 255)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="rgb(0, 180, 255)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: "rgba(0, 180, 220, 0.55)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} cursor={{ stroke: "rgba(0, 180, 255, 0.3)" }} />
                <Area type="monotone" dataKey="completed" name="完成" stroke="rgb(0, 200, 255)" fill="url(#taskGrad)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="total" name="计划" stroke="rgba(0, 200, 255, 0.3)" fill="none" strokeWidth={1} strokeDasharray="4 3" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandDashboard;