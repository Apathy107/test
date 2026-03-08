import React, { useState } from "react";
import { Play, Pause, FileText, MapPin, Clock, AlertCircle, Navigation } from "lucide-react";

/** 预设任务：不同任务对应不同航线与执行信息 */
const PRESET_TASKS = [
  {
    id: "task-01",
    name: "任务模板01 - 违规停车检测",
    routePoints: "60,290 130,230 200,170 280,130 360,110 430,90 470,70",
    points: [[60, 290], [130, 230], [200, 170], [280, 130], [360, 110], [430, 90], [470, 70]],
    progress: 60,
    executedKm: "0.9",
    totalKm: "2.3",
    remainingTime: "15分钟",
    coord: "30.27°N 120.15°E",
    captured: "23 张",
    violations: "5 处",
    taskNo: "ZF-2025-0711-001",
    pilot: "张三",
  },
  {
    id: "task-02",
    name: "任务模板02 - 交叉路口监控",
    routePoints: "80,260 180,200 320,180 420,120 480,80",
    points: [[80, 260], [180, 200], [320, 180], [420, 120], [480, 80]],
    progress: 35,
    executedKm: "0.5",
    totalKm: "1.4",
    remainingTime: "22分钟",
    coord: "30.28°N 120.16°E",
    captured: "12 张",
    violations: "2 处",
    taskNo: "ZF-2025-0711-002",
    pilot: "李四",
  },
];

const statusCfg = {
  idle:    { label: "空闲",   bg: "rgba(10, 30, 75, 1)",  color: "rgba(90, 158, 215, 1)", dot: "rgba(80, 138, 205, 1)" },
  running: { label: "执行中", bg: "rgba(0, 48, 34, 1)",   color: "rgba(0, 205, 135, 1)",  dot: "rgba(0, 205, 135, 1)" },
  done:    { label: "已完成", bg: "rgba(0, 48, 80, 1)",   color: "rgba(0, 215, 240, 1)",  dot: "rgba(0, 215, 240, 1)" },
};

const AutoCapture: React.FC = () => {
  const [status, setStatus] = useState<"idle" | "running" | "done">("running");
  const [selectedTaskId, setSelectedTaskId] = useState<string>(PRESET_TASKS[0].id);

  const selectedTask = PRESET_TASKS.find((t) => t.id === selectedTaskId) || PRESET_TASKS[0];
  const cfg = statusCfg[status];

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "7px 11px",
    border: "1px solid rgba(0, 110, 170, 0.42)",
    borderRadius: "4px",
    fontSize: "12px",
    background: "rgba(4, 16, 46, 1)",
    color: "rgba(170, 215, 248, 1)",
    outline: "none",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "rgba(200, 232, 255, 1)", margin: 0 }}>
            自动化非现抓拍
          </h2>
          <p style={{ fontSize: "11px", color: "rgba(70, 138, 200, 1)", margin: "3px 0 0" }}>
            选择预设任务，系统将按任务航线自动执行抓拍
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "4px 13px",
            background: cfg.bg,
            color: cfg.color,
            borderRadius: "14px",
            fontSize: "11px",
            fontWeight: 600,
            border: `1px solid ${cfg.dot}44`,
          }}
        >
          <div
            className={status === "running" ? "blink" : ""}
            style={{ width: "6px", height: "6px", borderRadius: "50%", background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}` }}
          />
          执行状态：{cfg.label}
        </div>
      </div>

      {/* 预设任务选择 + 启动抓拍、暂停、查看日志、任务信息 */}
      <div className="enf-card" style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: "260px" }}>
            <label style={{ fontSize: "11px", color: "rgba(70, 138, 200, 1)", display: "block", marginBottom: "5px" }}>预设任务选择</label>
            <select
              style={inputStyle}
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
            >
              {PRESET_TASKS.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={() => setStatus(status === "running" ? "idle" : "running")}
              style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 18px", background: "rgba(0, 110, 170, 0.65)", color: "rgba(0, 210, 240, 1)", border: "1px solid rgba(0, 185, 225, 0.52)", borderRadius: "4px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
            >
              <Play size={13} /> 启动抓拍
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 18px", background: "rgba(58, 38, 0, 0.55)", color: "rgba(255, 185, 0, 1)", border: "1px solid rgba(255, 165, 0, 0.42)", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>
              <Pause size={13} /> 暂停任务
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 18px", background: "rgba(6, 22, 62, 1)", color: "rgba(110, 172, 228, 1)", border: "1px solid rgba(0, 110, 170, 0.36)", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>
              <FileText size={13} /> 查看日志
            </button>
          </div>
          <div style={{ marginLeft: "auto", fontSize: "11px", color: "rgba(60, 118, 182, 1)" }}>
            任务编号：{selectedTask.taskNo} &nbsp;|&nbsp; 执行飞手：{selectedTask.pilot}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "14px" }}>
        <div
          className="enf-card"
          style={{ flex: 2, minHeight: "340px", overflow: "hidden", position: "relative", background: "rgba(4, 14, 40, 1)" }}
        >
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0, 160, 220, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 160, 220, 0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div style={{ position: "absolute", top: "10px", left: "12px", fontSize: "11px", fontWeight: 600, color: "rgba(0, 210, 240, 1)", background: "rgba(4, 14, 40, 0.88)", padding: "3px 10px", borderRadius: "4px", border: "1px solid rgba(0, 175, 225, 0.32)" }}>
            航线地图预览 — {selectedTask.name}
          </div>
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 500 340">
            <polyline points={selectedTask.routePoints} fill="none" stroke="rgba(0,205,235,0.65)" strokeWidth="2.5" strokeDasharray="8 4" />
            {selectedTask.points.map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={i === 3 ? 8 : 5} fill={i === 3 ? "rgba(255,80,80,1)" : "rgba(0,205,235,1)"} stroke="rgba(4,14,40,1)" strokeWidth="2" />
            ))}
            <rect x="310" y="170" width="75" height="55" fill="rgba(255,80,80,0.08)" stroke="rgba(255,80,80,0.52)" strokeWidth="1.5" strokeDasharray="5 3" />
            <text x="318" y="202" fontSize="10" fill="rgba(255,105,105,1)">禁飞区</text>
            <circle cx={selectedTask.points[3][0]} cy={selectedTask.points[3][1]} r="11" fill="rgba(4,14,40,1)" stroke="rgba(0,205,235,0.85)" strokeWidth="1.5" />
            <text x={selectedTask.points[3][0] - 6} y={selectedTask.points[3][1] + 4} fontSize="11" fill="rgba(0,210,240,1)">✈</text>
          </svg>
          <div style={{ position: "absolute", bottom: "10px", right: "10px", background: "rgba(4, 14, 40, 0.92)", border: "1px solid rgba(0, 110, 170, 0.32)", borderRadius: "4px", padding: "7px 11px", fontSize: "10px", color: "rgba(90, 155, 215, 1)" }}>
            {[
              { line: "16px", dash: true, label: "预设航线" },
              { dot: "rgba(255,80,80,1)", label: "当前位置" },
              { rect: "rgba(255,80,80,0.1)", label: "禁飞区域" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: i < 2 ? "3px" : "0" }}>
                {item.dash && <div style={{ width: "16px", borderTop: "2px dashed rgba(0,205,235,0.65)" }} />}
                {item.dot && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.dot }} />}
                {item.rect && <div style={{ width: "8px", height: "7px", background: item.rect, border: "1px dashed rgba(255,80,80,0.52)" }} />}
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
          <div className="enf-card" style={{ padding: "14px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(140, 188, 228, 1)", marginBottom: "10px" }}>当前任务进度</div>
            <div style={{ marginBottom: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "5px" }}>
                <span style={{ color: "rgba(90, 155, 215, 1)" }}>{selectedTask.name}</span>
                <span style={{ color: "rgba(0, 210, 240, 1)", fontWeight: 700 }}>{selectedTask.progress}%</span>
              </div>
              <div style={{ height: "8px", background: "rgba(0, 35, 80, 1)", borderRadius: "4px", overflow: "hidden" }}>
                <div className="progress-stripe" style={{ height: "100%", width: `${selectedTask.progress}%`, background: "rgba(0, 210, 240, 1)", borderRadius: "4px" }} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "rgba(60, 120, 185, 1)" }}>
              <span>已执行：{selectedTask.executedKm} km</span>
              <span>总长：{selectedTask.totalKm} km</span>
            </div>
          </div>
          {[
            { icon: Clock, label: "预计剩余时间", value: selectedTask.remainingTime, color: "rgba(255, 185, 0, 1)" },
            { icon: MapPin, label: "当前坐标", value: selectedTask.coord, color: "rgba(0, 210, 240, 1)" },
            { icon: Navigation, label: "已抓拍数量", value: selectedTask.captured, color: "rgba(0, 205, 135, 1)" },
            { icon: AlertCircle, label: "违规识别", value: selectedTask.violations, color: "rgba(255, 80, 80, 1)" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="enf-card" style={{ padding: "10px 13px", display: "flex", alignItems: "center", gap: "9px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "5px", background: `${item.color.replace("1)", "0.14)")}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${item.color.replace("1)", "0.28)")}` }}>
                  <Icon size={13} style={{ color: item.color }} />
                </div>
                <div>
                  <div style={{ fontSize: "10px", color: "rgba(65, 128, 190, 1)" }}>{item.label}</div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(200, 230, 255, 1)" }}>{item.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AutoCapture;
