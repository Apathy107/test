import React, { useState, useMemo } from "react";
import { Play, Pause, RefreshCw, ChevronDown, Filter } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { getUrbanPatrolTasks, startTask, type UrbanPatrolTask } from "../data/urbanPatrolTasks";

const defaultTasks: UrbanPatrolTask[] = [
  { id: "T001", name: "中心商圈日常巡查", area: "中心商圈", device: "无人机-001", status: "active", progress: 65, startTime: "09:30", duration: "45min" },
  { id: "T002", name: "滨河路段水环境监测", area: "滨河路段", device: "无人机-002", status: "active", progress: 30, startTime: "10:15", duration: "60min" },
  { id: "T003", name: "工业区安全巡检", area: "工业区", device: "无人机-003", status: "paused", progress: 50, startTime: "08:00", duration: "90min" },
  { id: "T004", name: "居民区环境巡查", area: "南苑居民区", device: "无人机-004", status: "pending", progress: 0, startTime: "14:00", duration: "40min" },
  { id: "T005", name: "交通主干道巡查", area: "人民大道", device: "机器狗-001", status: "done", progress: 100, startTime: "07:00", duration: "30min" },
];

interface PatrolNormalProps {
  tasks?: UrbanPatrolTask[];
}

function mergeTaskLists(fromStorage: UrbanPatrolTask[], defaults: UrbanPatrolTask[]): UrbanPatrolTask[] {
  const ids = new Set(fromStorage.map((t) => t.id));
  const combined = [...fromStorage];
  defaults.forEach((t) => {
    if (!ids.has(t.id)) {
      combined.push(t);
      ids.add(t.id);
    }
  });
  return combined.length ? combined : defaults;
}

const PatrolNormal: React.FC<PatrolNormalProps> = (props) => {
  const fromMission = useMemo(() => getUrbanPatrolTasks(), []);
  const initialTasks = useMemo(() => mergeTaskLists(fromMission, defaultTasks), [fromMission]);
  const [taskList, setTaskList] = useState<UrbanPatrolTask[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<UrbanPatrolTask | null>(initialTasks[0] ?? null);

  const handleOneClickStart = () => {
    if (!selectedTask || selectedTask.status === "active") return;
    const nextFromStorage = startTask(selectedTask.id);
    const merged = mergeTaskLists(nextFromStorage, defaultTasks);
    setTaskList(merged);
    const updated = merged.find((t) => t.id === selectedTask.id);
    if (updated) setSelectedTask(updated);
  };

  const displayTasks = taskList.length ? taskList : initialTasks;

  return (
    <div data-cmp="PatrolNormal" className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Toolbar */}
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ borderBottom: "1px solid rgba(0,212,255,0.15)" }}
      >
        <select
          className="text-sm px-3 py-1.5 rounded"
          style={{
            background: "rgba(0,212,255,0.07)",
            border: "1px solid rgba(0,212,255,0.25)",
            color: "rgb(0,212,255)",
            outline: "none",
          }}
        >
          <option>全部区域</option>
          <option>中心商圈</option>
          <option>滨河路段</option>
          <option>工业区</option>
        </select>
        <button
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded"
          style={{
            background: "rgba(0,212,255,0.07)",
            border: "1px solid rgba(0,212,255,0.25)",
            color: "rgb(120,180,210)",
          }}
        >
          <Filter size={14} />
          筛选
        </button>
        <button
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded"
          style={{
            background: "rgba(0,212,255,0.07)",
            border: "1px solid rgba(0,212,255,0.25)",
            color: "rgb(120,180,210)",
          }}
        >
          批量操作
          <ChevronDown size={14} />
        </button>
        <button
          onClick={handleOneClickStart}
          disabled={!selectedTask || selectedTask.status === "active"}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "rgba(0,212,255,0.15)",
            border: "1px solid rgba(0,212,255,0.4)",
            color: "rgb(0,212,255)",
          }}
        >
          <Play size={14} />
          一键启动
        </button>
      </div>

      {/* Task List - 任务来源：任务调度中心创建的类型「城市常态化巡查」+ 本地示例 */}
      <div className="flex-1 overflow-auto px-2 py-2 space-y-1">
        {displayTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => setSelectedTask(task)}
            className="px-4 py-3 rounded-lg cursor-pointer transition-all"
            style={{
              background:
                selectedTask.id === task.id
                  ? "rgba(0,212,255,0.1)"
                  : "rgba(10,24,54,0.6)",
              border:
                selectedTask.id === task.id
                  ? "1px solid rgba(0,212,255,0.35)"
                  : "1px solid rgba(0,212,255,0.1)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: "rgb(200,235,255)" }}>
                {task.name}
              </span>
              <StatusBadge status={task.status} />
            </div>
            <div className="flex items-center justify-between text-xs mb-2" style={{ color: "rgb(120,180,210)" }}>
              <span>{task.device}</span>
              <span>{task.area}</span>
              <span>{task.startTime} · {task.duration}</span>
            </div>
            <div
              className="w-full rounded-full"
              style={{ height: "3px", background: "rgba(0,212,255,0.15)" }}
            >
              <div
                className="rounded-full transition-all"
                style={{
                  width: `${task.progress}%`,
                  height: "3px",
                  background:
                    task.status === "active"
                      ? "rgb(0,212,255)"
                      : task.status === "done"
                      ? "rgb(80,230,180)"
                      : "rgb(255,180,0)",
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-xs" style={{ color: "rgba(120,180,210,0.6)", fontSize: "10px" }}>
                完成进度 {task.progress}%
              </span>
              <div className="flex gap-1">
                <button
                  className="px-2 py-0.5 rounded text-xs"
                  style={{
                    background: "rgba(0,212,255,0.08)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    color: "rgb(0,212,255)",
                  }}
                >
                  {task.status === "active" ? <Pause size={10} /> : <Play size={10} />}
                </button>
                <button
                  className="px-2 py-0.5 rounded text-xs"
                  style={{
                    background: "rgba(0,212,255,0.08)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    color: "rgb(120,180,210)",
                  }}
                >
                  <RefreshCw size={10} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Task Detail */}
      {selectedTask && displayTasks.length > 0 && (
        <div
          className="px-4 py-3 space-y-2"
          style={{
            borderTop: "1px solid rgba(0,212,255,0.15)",
            background: "rgba(6,14,32,0.6)",
          }}
        >
          <div className="text-xs font-medium" style={{ color: "rgb(0,212,255)" }}>
            任务详情 · {selectedTask.id}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {[
              ["巡查区域", selectedTask.area],
              ["执行设备", selectedTask.device],
              ["开始时间", selectedTask.startTime],
              ["预计时长", selectedTask.duration],
              ["任务进度", `${selectedTask.progress}%`],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center gap-1 text-xs">
                <span style={{ color: "rgb(80,130,160)" }}>{k}:</span>
                <span style={{ color: "rgb(200,235,255)" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatrolNormal;