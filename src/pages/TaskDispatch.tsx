import React from "react";
import { CalendarClock, Plus, MapPin, Clock, CheckCircle } from "lucide-react";
import ModulePageLayout from "@/components/ModulePageLayout";

const COLOR = "rgb(0, 210, 255)";
const GLOW = "rgba(0, 210, 255, 0.4)";

/**
 * TaskDispatch - 任务调度中心 page
 */
const TaskDispatch: React.FC = () => {
  console.log("TaskDispatch page rendered");

  const tasks = [
    { id: "T-2025-001", name: "城区安全巡逻", type: "例行巡逻", area: "南区CBD", uav: "UAV-003", pilot: "张伟", time: "08:00-10:00", status: "执行中", priority: "高" },
    { id: "T-2025-002", name: "物资配送-医院", type: "物资运输", area: "市中心医院", uav: "UAV-009", pilot: "陈刚", time: "09:30-10:30", status: "执行中", priority: "紧急" },
    { id: "T-2025-003", name: "基础设施巡检", type: "设施巡检", area: "北区高压线", uav: "UAV-005", pilot: "李明", time: "14:00-16:00", status: "待执行", priority: "中" },
    { id: "T-2025-004", name: "航拍测绘任务", type: "航拍测绘", area: "东郊开发区", uav: "UAV-012", pilot: "王芳", time: "10:00-12:00", status: "已完成", priority: "低" },
    { id: "T-2025-005", name: "消防应急支援", type: "应急响应", area: "西区工业园", uav: "UAV-007", pilot: "刘洋", time: "即时", status: "待命", priority: "紧急" },
  ];

  const getPriorityColor = (p: string) =>
    p === "紧急" ? "rgb(255, 80, 80)" : p === "高" ? "rgb(255, 160, 0)" : p === "中" ? COLOR : "rgba(0, 160, 200, 0.6)";

  const getStatusColor = (s: string) =>
    s === "执行中" ? "rgb(0, 210, 120)" : s === "已完成" ? "rgba(0, 160, 200, 0.6)" : s === "待命" ? "rgb(255, 160, 0)" : "rgba(180, 200, 220, 0.6)";

  const todaySummary = [
    { label: "今日任务", value: "12" },
    { label: "执行中", value: "3" },
    { label: "待执行", value: "5" },
    { label: "已完成", value: "4" },
  ];

  return (
    <ModulePageLayout title="任务调度中心" subtitle="TASK SCHEDULING CENTER" icon={CalendarClock} color={COLOR} glowColor={GLOW}>
      {/* Summary strip */}
      <div className="flex gap-4 mb-6">
        {todaySummary.map((s, i) => (
          <div key={i} style={{ flex: 1, background: "rgba(0, 15, 50, 0.8)", border: `1px solid ${GLOW}`, borderRadius: "4px", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "rgba(0, 170, 210, 0.6)", fontFamily: "'Microsoft YaHei', sans-serif" }}>{s.label}</span>
            <span style={{ fontSize: "26px", fontWeight: "700", color: "rgb(220, 245, 255)", fontFamily: "monospace" }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Task list */}
      <div style={{ background: "rgba(0, 12, 45, 0.8)", border: `1px solid ${GLOW}`, borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${GLOW}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CalendarClock size={14} style={{ color: COLOR }} />
            <span style={{ fontSize: "14px", fontWeight: "700", color: "rgb(200, 235, 255)", letterSpacing: "0.12em", fontFamily: "'Microsoft YaHei', sans-serif" }}>任务清单</span>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 14px", border: `1px solid ${GLOW}`, borderRadius: "3px", background: "rgba(0, 60, 120, 0.4)", color: COLOR, fontSize: "12px", cursor: "pointer", fontFamily: "'Microsoft YaHei', sans-serif" }}>
            <Plus size={13} /><span>新建任务</span>
          </button>
        </div>
        <div style={{ display: "flex", padding: "10px 20px", background: "rgba(0, 30, 80, 0.5)", borderBottom: "1px solid rgba(0, 130, 180, 0.15)" }}>
          {["任务编号", "任务名称", "任务类型", "执行区域", "无人机", "飞手", "计划时间", "优先级", "状态"].map((h) => (
            <div key={h} style={{ flex: 1, fontSize: "10px", color: "rgba(0, 160, 200, 0.55)", fontFamily: "monospace", letterSpacing: "0.08em" }}>{h}</div>
          ))}
        </div>
        {tasks.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", padding: "13px 20px", borderBottom: i < tasks.length - 1 ? "1px solid rgba(0, 100, 160, 0.12)" : "none" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0, 40, 100, 0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <div style={{ flex: 1, fontSize: "11px", color: COLOR, fontFamily: "monospace" }}>{t.id}</div>
            <div style={{ flex: 1, fontSize: "12px", color: "rgb(200, 235, 255)", fontFamily: "'Microsoft YaHei', sans-serif" }}>{t.name}</div>
            <div style={{ flex: 1, fontSize: "11px", color: "rgba(0, 180, 220, 0.6)", fontFamily: "'Microsoft YaHei', sans-serif" }}>{t.type}</div>
            <div style={{ flex: 1, fontSize: "11px", color: "rgba(0, 160, 200, 0.6)", fontFamily: "'Microsoft YaHei', sans-serif", display: "flex", alignItems: "center", gap: "4px" }}><MapPin size={10} />{t.area}</div>
            <div style={{ flex: 1, fontSize: "11px", color: "rgba(0, 180, 220, 0.7)", fontFamily: "monospace" }}>{t.uav}</div>
            <div style={{ flex: 1, fontSize: "12px", color: "rgb(180, 220, 255)", fontFamily: "'Microsoft YaHei', sans-serif" }}>{t.pilot}</div>
            <div style={{ flex: 1, fontSize: "11px", color: "rgba(0, 160, 200, 0.6)", fontFamily: "monospace", display: "flex", alignItems: "center", gap: "4px" }}><Clock size={10} />{t.time}</div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "2px", background: getPriorityColor(t.priority).replace("rgb", "rgba").replace(")", ", 0.15)"), color: getPriorityColor(t.priority) }}>{t.priority}</span>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "2px", background: getStatusColor(t.status).replace("rgb", "rgba").replace(")", ", 0.15)"), color: getStatusColor(t.status) }}>{t.status}</span>
            </div>
          </div>
        ))}
      </div>
    </ModulePageLayout>
  );
};

export default TaskDispatch;