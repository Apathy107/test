import React, { useState } from "react";
import StatusBadge from "@personnel/components/StatusBadge";
import { Calendar, List, MapPin, Clock, AlertCircle } from "lucide-react";

type TaskTab = "calendar" | "list";

const tasks = [
  { id: "T001", name: "南郊水库巡检", pilot: "李明", pilotId: "P001", unit: "东城分队", area: "南郊水库", date: "2025-07-14", time: "09:00-11:00", device: "DJI M300", status: "进行中", statusKey: "info" as const, qual: "超视距" },
  { id: "T002", name: "城区电网巡查", pilot: "周强", pilotId: "P002", unit: "北郊中队", area: "城区北段", date: "2025-07-14", time: "14:00-16:00", device: "DJI Mavic 3T", status: "待执行", statusKey: "pending" as const, qual: "超视距" },
  { id: "T003", name: "农业植保作业", pilot: "吴雪", pilotId: "P006", unit: "西城分队", area: "西郊农业园", date: "2025-07-13", time: "06:00-10:00", device: "极飞 P80", status: "已完成", statusKey: "active" as const, qual: "农业植保" },
  { id: "T004", name: "事故现场勘察", pilot: "郑宇", pilotId: "P007", unit: "应急响应", area: "G107 主干道", date: "2025-07-13", time: "15:30-17:00", device: "DJI M300 RTK", status: "已完成", statusKey: "active" as const, qual: "超视距" },
  { id: "T005", name: "公园人群监测", pilot: "张伟", pilotId: "P012", unit: "西城分队", area: "中央公园", date: "2025-07-14", time: "18:00-20:00", device: "DJI Mini 3", status: "已冻结", statusKey: "frozen" as const, qual: "视距内" },
];

const calendarDays = [
  { day: 14, today: true, taskCount: 3 },
  { day: 15, today: false, taskCount: 5 },
  { day: 16, today: false, taskCount: 2 },
  { day: 17, today: false, taskCount: 4 },
  { day: 18, today: false, taskCount: 1 },
  { day: 19, today: false, taskCount: 0 },
  { day: 20, today: false, taskCount: 3 },
];

const PilotTasks: React.FC = () => {
  const [tab, setTab] = useState<TaskTab>("list");
  console.log("PilotTasks page rendered");

  return (
    <>
      {/* Stats */}
      <div className="flex gap-4 mb-5">
        {[
          { label: "今日任务", value: "8", color: "rgba(0, 212, 255, 1)" },
          { label: "进行中", value: "3", color: "rgba(0, 220, 150, 1)" },
          { label: "待执行", value: "4", color: "rgba(255, 200, 0, 1)" },
          { label: "已完成（本月）", value: "67", color: "rgba(180, 160, 255, 1)" },
          { label: "冻结无法派单", value: "3", color: "rgba(255, 80, 80, 1)" },
        ].map((s) => (
          <div key={s.label} className="flex-1 tech-card rounded-lg p-4 text-center">
            <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs" style={{ color: "rgba(100, 140, 180, 1)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* View tabs */}
      <div className="flex gap-2 mb-4">
        {([
          { key: "list", label: "任务列表", icon: List },
          { key: "calendar", label: "任务日历", icon: Calendar },
        ] as { key: TaskTab; label: string; icon: React.ElementType }[]).map((t) => {
          const Ic = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded text-xs font-medium transition-colors"
              style={{
                background: tab === t.key ? "rgba(0, 80, 130, 0.3)" : "rgba(16, 38, 76, 0.5)",
                border: tab === t.key ? "1px solid rgba(0, 212, 255, 0.5)" : "1px solid rgba(0, 100, 150, 0.2)",
                color: tab === t.key ? "rgba(0, 212, 255, 1)" : "rgba(100, 140, 180, 1)",
              }}
            >
              <Ic size={13} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Calendar view */}
      <div style={{ display: tab === "calendar" ? "block" : "none" }}>
        <div className="tech-card rounded-lg p-5 mb-4">
          <div className="text-sm font-semibold mb-4" style={{ color: "rgba(200, 220, 240, 1)" }}>2025年7月</div>
          <div className="flex gap-3">
            {calendarDays.map((d) => (
              <div
                key={d.day}
                className="flex-1 p-3 rounded text-center cursor-pointer"
                style={{
                  background: d.today ? "rgba(0, 100, 150, 0.3)" : "rgba(16, 38, 76, 0.5)",
                  border: d.today ? "1px solid rgba(0, 212, 255, 0.6)" : "1px solid rgba(0, 100, 150, 0.2)",
                  boxShadow: d.today ? "0 0 10px rgba(0, 212, 255, 0.1)" : "none",
                }}
              >
                <div
                  className="text-lg font-bold mb-1"
                  style={{ color: d.today ? "rgba(0, 212, 255, 1)" : "rgba(160, 200, 230, 1)" }}
                >
                  {d.day}
                </div>
                <div className="text-xs mb-1" style={{ color: "rgba(80, 120, 160, 1)" }}>周{["一", "二", "三", "四", "五", "六", "日"][calendarDays.indexOf(d)]}</div>
                {d.taskCount > 0 ? (
                  <div
                    className="text-xs font-medium px-1.5 py-0.5 rounded mx-auto w-fit"
                    style={{
                      background: "rgba(0, 80, 120, 0.4)",
                      color: "rgba(0, 200, 255, 0.9)",
                    }}
                  >
                    {d.taskCount}个任务
                  </div>
                ) : (
                  <div className="text-xs" style={{ color: "rgba(60, 100, 140, 0.6)" }}>无任务</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* List view */}
      <div style={{ display: tab === "list" ? "block" : "none" }}>
        <div className="tech-card rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "rgba(0, 60, 100, 0.3)", borderBottom: "1px solid rgba(0, 150, 200, 0.3)" }}>
                {["任务编号", "任务名称", "关联飞手", "所属单位", "作业区域", "执行时间", "关联设备", "资质要求", "任务状态", "操作"].map((h) => (
                  <th key={h} className="px-3 py-3 text-left font-medium text-xs" style={{ color: "rgba(0, 212, 255, 0.85)", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr
                  key={t.id}
                  className="table-row-hover"
                  style={{ borderBottom: "1px solid rgba(0, 80, 120, 0.2)" }}
                >
                  <td className="px-3 py-3 text-xs" style={{ color: "rgba(0, 212, 255, 0.7)", fontFamily: "monospace" }}>{t.id}</td>
                  <td className="px-3 py-3 text-xs font-medium" style={{ color: "rgba(200, 220, 240, 1)" }}>{t.name}</td>
                  <td className="px-3 py-3">
                    <div className="text-xs font-medium" style={{ color: t.status === "已冻结" ? "rgba(150, 180, 200, 0.5)" : "rgba(200, 220, 240, 1)" }}>{t.pilot}</div>
                    <div className="text-xs" style={{ color: "rgba(80, 120, 160, 1)" }}>{t.pilotId}</div>
                  </td>
                  <td className="px-3 py-3 text-xs" style={{ color: "rgba(140, 180, 210, 1)" }}>{t.unit}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(180, 210, 240, 1)" }}>
                      <MapPin size={10} style={{ color: "rgba(0, 180, 220, 0.7)" }} />
                      {t.area}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-xs" style={{ color: "rgba(140, 180, 210, 1)", fontFamily: "monospace" }}>{t.date}</div>
                    <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(80, 120, 160, 1)" }}>
                      <Clock size={9} />
                      {t.time}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs" style={{ color: "rgba(180, 160, 255, 0.9)" }}>{t.device}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: "rgba(0, 200, 255, 0.8)" }}>{t.qual}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={t.statusKey} label={t.status} />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button className="px-2 py-1 rounded text-xs" style={{ background: "rgba(0, 80, 120, 0.2)", border: "1px solid rgba(0, 150, 200, 0.3)", color: "rgba(0, 212, 255, 0.9)" }}
                        onClick={() => console.log("View task:", t.id)}>
                        详情
                      </button>
                      {t.statusKey === "info" && (
                        <button className="px-2 py-1 rounded text-xs flex items-center gap-1" style={{ background: "rgba(180, 60, 30, 0.2)", border: "1px solid rgba(220, 80, 40, 0.3)", color: "rgba(255, 120, 80, 0.9)" }}
                          onClick={() => console.log("Interrupt task:", t.id)}>
                          <AlertCircle size={9} />
                          中断
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PilotTasks;