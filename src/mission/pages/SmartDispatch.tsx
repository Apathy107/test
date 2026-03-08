import React, { useState } from "react";
import StatCard from "@mission/components/StatCard";
import StatusBadge from "@mission/components/StatusBadge";
import { Cpu, Layers, GitBranch, Play, Pause, SkipForward, RefreshCw, CheckCircle } from "lucide-react";

interface DispatchTask {
  id: string;
  name: string;
  priority: "urgent" | "high" | "medium" | "low";
  status: "running" | "pending" | "paused";
  device: string;
  pilot: string;
  progress: number;
  eta: string;
  conflict: boolean;
}

const tasks: DispatchTask[] = [
  { id: "RW-JJ-2025-0019", name: "化工园区泄漏应急响应",  priority: "urgent", status: "running", device: "侦察小蜂",     pilot: "李明",   progress: 35,  eta: "约25分钟", conflict: false },
  { id: "RW-AB-2025-0031", name: "市政大楼安保巡逻",       priority: "high",   status: "pending", device: "巡逻一号",    pilot: "王磊",   progress: 0,   eta: "10:00启动", conflict: false },
  { id: "RW-XJ-2025-0042", name: "滨江大道日常巡检",       priority: "medium", status: "running", device: "高空瞭望3号",  pilot: "张伟",   progress: 62,  eta: "约17分钟", conflict: false },
  { id: "RW-ZX-2025-0009", name: "水库大坝专项检测",       priority: "high",   status: "paused",  device: "农业巡检1号", pilot: "陈华",   progress: 28,  eta: "已暂停",   conflict: false },
  { id: "RW-XJ-2025-0045", name: "新城区商业街环境监测",   priority: "medium", status: "pending", device: "高空瞭望1号",  pilot: "赵琳",   progress: 0,   eta: "14:00启动", conflict: true },
  { id: "RW-JJ-2025-0020", name: "港区集装箱码头夜间排查", priority: "low",    status: "pending", device: "消费级机",    pilot: "孙斌",   progress: 0,   eta: "22:00启动", conflict: false },
];

const SmartDispatch: React.FC = () => {
  const [optimizing, setOptimizing] = useState(false);
  const [optimized, setOptimized] = useState(false);

  const handleOptimize = () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
      setOptimized(true);
      console.log("Smart dispatch optimization completed");
    }, 2000);
  };

  console.log("SmartDispatch rendered, optimized:", optimized);

  return (
    <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
          {/* Stats */}
          <div style={{ display: "flex", gap: "14px", marginBottom: "20px" }}>
            <div style={{ flex: 1 }}>
              <StatCard title="当前调度任务" value={tasks.length} unit="个" sub="同时调度中" icon={Layers} iconColor="rgba(0,212,255,1)" iconBg="rgba(0,80,140,0.4)" />
            </div>
            <div style={{ flex: 1 }}>
              <StatCard title="执行中" value={tasks.filter((t) => t.status === "running").length} unit="个" sub="设备占用率 72%" icon={Play} iconColor="rgba(0,200,120,1)" iconBg="rgba(0,80,40,0.4)" />
            </div>
            <div style={{ flex: 1 }}>
              <StatCard title="资源冲突" value={tasks.filter((t) => t.conflict).length} unit="处" sub="需人工确认" icon={GitBranch} iconColor="rgba(255,180,0,1)" iconBg="rgba(100,70,0,0.4)" highlight={tasks.filter((t) => t.conflict).length > 0 ? "需处理" : ""} />
            </div>
            <div style={{ flex: 1 }}>
              <StatCard title="暂停等待恢复" value={tasks.filter((t) => t.status === "paused").length} unit="个" sub="可从断点继续" icon={Pause} iconColor="rgba(180,120,255,1)" iconBg="rgba(60,20,120,0.4)" />
            </div>
            <div style={{ flex: 1 }}>
              <StatCard title="今日完成任务" value="6" unit="个" sub="完成率 75%" trend="8% 较昨日" trendUp icon={CheckCircle} iconColor="rgba(0,180,255,1)" iconBg="rgba(0,60,120,0.4)" />
            </div>
          </div>

          {/* Optimization panel */}
          {!optimized ? (
            <div className="tech-card" style={{ borderRadius: "6px", padding: "16px 20px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "16px" }}>
              <Cpu size={20} style={{ color: "rgba(0,212,255,0.8)", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", color: "rgba(180,215,250,1)", fontWeight: 600, marginBottom: "2px" }}>
                  智能调度优化
                </div>
                <div style={{ fontSize: "12px", color: "rgba(80,130,180,1)" }}>
                  根据设备位置、飞手负荷、任务优先级，系统自动推荐最优执行方案，消除资源冲突
                </div>
              </div>
              <button
                onClick={handleOptimize}
                disabled={optimizing}
                style={{
                  padding: "8px 20px",
                  fontSize: "13px",
                  fontWeight: 600,
                  background: optimizing ? "rgba(0,60,120,0.4)" : "rgba(0,120,180,0.6)",
                  color: optimizing ? "rgba(80,130,180,1)" : "rgba(0,212,255,1)",
                  border: "1px solid rgba(0,160,220,0.4)",
                  borderRadius: "4px",
                  cursor: optimizing ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  flexShrink: 0,
                }}
              >
                <RefreshCw size={13} style={{ animation: optimizing ? "spin 1s linear infinite" : "none" }} />
                {optimizing ? "优化中..." : "立即优化"}
              </button>
            </div>
          ) : (
            <div className="tech-card" style={{ borderRadius: "6px", padding: "14px 20px", marginBottom: "16px", borderColor: "rgba(0,200,120,0.3)", display: "flex", alignItems: "center", gap: "12px", background: "rgba(0,60,30,0.2)" }}>
              <CheckCircle size={18} style={{ color: "rgba(0,200,120,1)", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", color: "rgba(0,220,130,1)", fontWeight: 600 }}>优化方案已生成</div>
                <div style={{ fontSize: "12px", color: "rgba(60,140,90,1)" }}>建议将「新城区商业街环境监测」改派至高空瞭望2号执行，消除设备冲突，效率提升约18%</div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={{ padding: "6px 14px", fontSize: "12px", background: "rgba(0,100,50,0.5)", color: "rgba(0,200,120,1)", border: "1px solid rgba(0,160,80,0.4)", borderRadius: "4px", cursor: "pointer" }}>
                  采纳方案
                </button>
                <button onClick={() => setOptimized(false)} style={{ padding: "6px 14px", fontSize: "12px", background: "transparent", color: "rgba(100,150,200,1)", border: "1px solid rgba(60,100,150,0.35)", borderRadius: "4px", cursor: "pointer" }}>
                  忽略
                </button>
              </div>
            </div>
          )}

          {/* Conflict warning */}
          {tasks.some((t) => t.conflict) && (
            <div style={{ padding: "10px 14px", background: "rgba(255,180,0,0.08)", border: "1px solid rgba(255,180,0,0.3)", borderRadius: "6px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
              <GitBranch size={15} style={{ color: "rgba(255,200,0,1)", flexShrink: 0 }} />
              <div style={{ fontSize: "13px", color: "rgba(220,180,60,1)" }}>
                <strong>资源冲突提示：</strong>「新城区商业街环境监测」与「南环快速路例行巡检」存在飞手资源冲突，建议调整。
              </div>
            </div>
          )}

          {/* Task dispatch board */}
          <div className="tech-card" style={{ borderRadius: "6px" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(0,80,140,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "rgba(200,230,255,1)" }}>多任务协同调度看板</span>
              <span style={{ fontSize: "12px", color: "rgba(80,120,170,1)" }}>{tasks.length} 个任务</span>
            </div>

            {tasks.map((task, idx) => (
              <div
                key={task.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px 16px",
                  borderBottom: idx < tasks.length - 1 ? "1px solid rgba(0,60,120,0.12)" : "none",
                  background: task.conflict ? "rgba(255,180,0,0.04)" : "transparent",
                }}
              >
                {/* Priority indicator */}
                <div style={{ width: "4px", height: "40px", borderRadius: "2px", flexShrink: 0, background: task.priority === "urgent" ? "rgba(255,59,59,1)" : task.priority === "high" ? "rgba(255,120,0,1)" : task.priority === "medium" ? "rgba(255,200,0,1)" : "rgba(80,160,80,1)" }} />

                {/* Task info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", color: "rgba(190,220,255,1)", fontWeight: 500 }}>
                      {task.name}
                    </span>
                    {task.conflict && (
                      <span style={{ fontSize: "10px", color: "rgba(255,180,0,1)", background: "rgba(255,180,0,0.12)", padding: "1px 6px", borderRadius: "2px", border: "1px solid rgba(255,180,0,0.3)" }}>
                        冲突
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  {task.status !== "pending" && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <div style={{ flex: 1, height: "4px", background: "rgba(0,40,90,0.6)", borderRadius: "2px", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${task.progress}%`,
                            borderRadius: "2px",
                            background: task.status === "paused" ? "rgba(180,100,255,1)" : "linear-gradient(90deg, rgba(0,150,200,1), rgba(0,212,255,1))",
                            boxShadow: task.status === "running" ? "0 0 6px rgba(0,212,255,0.5)" : "none",
                            transition: "width 0.3s",
                          }}
                        />
                      </div>
                      <span style={{ fontSize: "11px", color: "rgba(80,130,180,1)", minWidth: "28px" }}>
                        {task.progress}%
                      </span>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: "rgba(80,120,170,1)" }}>
                    <span>{task.device}</span>
                    <span>·</span>
                    <span>{task.pilot}</span>
                    <span>·</span>
                    <span>{task.eta}</span>
                  </div>
                </div>

                {/* Status badges */}
                <div style={{ display: "flex", gap: "6px", alignItems: "center", flexShrink: 0 }}>
                  <StatusBadge status={task.priority} />
                  <StatusBadge status={task.status} />
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                  {task.status === "running" && (
                    <button style={{ padding: "4px 10px", fontSize: "11px", background: "rgba(80,30,120,0.4)", color: "rgba(180,100,255,1)", border: "1px solid rgba(150,60,220,0.35)", borderRadius: "3px", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}>
                      <Pause size={11} /> 暂停
                    </button>
                  )}
                  {task.status === "paused" && (
                    <button style={{ padding: "4px 10px", fontSize: "11px", background: "rgba(0,80,40,0.4)", color: "rgba(0,200,120,1)", border: "1px solid rgba(0,160,80,0.35)", borderRadius: "3px", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}>
                      <Play size={11} /> 从断点恢复
                    </button>
                  )}
                  {task.status === "pending" && (
                    <button style={{ padding: "4px 10px", fontSize: "11px", background: "rgba(0,60,120,0.4)", color: "rgba(0,180,255,1)", border: "1px solid rgba(0,120,180,0.35)", borderRadius: "3px", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}>
                      <SkipForward size={11} /> 提前执行
                    </button>
                  )}
                  <button style={{ padding: "4px 10px", fontSize: "11px", background: "rgba(0,30,70,0.4)", color: "rgba(100,150,200,1)", border: "1px solid rgba(0,60,120,0.3)", borderRadius: "3px", cursor: "pointer" }}>
                    详情
                  </button>
                </div>
              </div>
            ))}
          </div>
    </div>
  );
};

export default SmartDispatch;
