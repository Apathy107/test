import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "@mission/components/StatCard";
import TaskTable from "@mission/components/TaskTable";
import AlertItem from "@mission/components/AlertItem";
import StatusBadge from "@mission/components/StatusBadge";
import { missionAlertsForMissionModule } from "@/data/command-center/realtimeAlerts";
import {
  ClipboardList,
  PlayCircle,
  CheckCircle2,
  Clock,
  PauseCircle,
  PlusCircle,
  RefreshCw,
  Calendar,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// 日历视图模拟数据
const calendarTasks: Record<number, any[]> = {
  11: [
    { name: "南环快速路例行巡检", type: "常态化巡检", time: "07:30", pilot: "赵琳", status: "completed" },
    { name: "市政大楼安保巡逻", type: "安保任务", time: "10:00", pilot: "王磊", status: "pending" },
  ],
  15: [
    { name: "化工园区泄漏排查", type: "紧急任务", time: "09:42", pilot: "李明", status: "running" },
  ],
  18: [
    { name: "水库大坝专项检测", type: "专项任务", time: "14:00", pilot: "陈华", status: "paused" },
    { name: "港口码头周界检查", type: "常态化巡检", time: "22:00", pilot: "孙斌", status: "pending" },
  ],
};

type TaskType = "常态化巡检" | "紧急任务" | "安保任务" | "专项任务" | "调度任务";
type TaskStatus = "running" | "pending" | "completed" | "paused" | "cancelled";
type TaskPriority = "urgent" | "high" | "medium" | "low";
type ApprovalStatus = "未审批" | "审批中" | "已通过" | "已驳回" | "已退回";

interface BoardTask {
  id: string;
  name: string;
  type: TaskType;
  date: string;
  priority: TaskPriority;
  status: TaskStatus;
  approvalStatus: ApprovalStatus;
  device: string;
  pilot: string;
  startTime: string;
  duration: string;
  timeMode: "立即执行" | "定时执行" | "周期执行";
  planStart: string;
  planEnd: string;
  route: string;
  autoPlan: string;
  devices: string[];
  pilots: string[];
  algorithms: string[];
  attachments: string[];
  partners: string[];
}

const TASK_STORAGE_KEY = "mission_custom_tasks";

// 任务台账模拟数据（包含详情所需的全部字段）
const ALL_TASKS: BoardTask[] = [
  {
    id: "RW-XJ-2025-0042",
    name: "滨江大道日常巡检",
    type: "常态化巡检",
    date: "2025-07-11",
    priority: "medium",
    status: "running",
    approvalStatus: "审批中",
    device: "高空瞭望3号",
    pilot: "张伟",
    startTime: "09:15",
    duration: "45min",
    timeMode: "周期执行",
    planStart: "2025-07-11 09:15",
    planEnd: "2025-07-11 10:00",
    route: "滨江大道北侧主航线",
    autoPlan: "城区河道常规巡检模板 V3.1",
    devices: ["高空瞭望3号"],
    pilots: ["张伟"],
    algorithms: ["车流量识别", "违停识别"],
    attachments: ["任务方案.pdf"],
    partners: ["市政养护中心"],
  },
  {
    id: "RW-JJ-2025-0018",
    name: "化工园区泄漏应急响应",
    type: "紧急任务",
    date: "2025-07-11",
    priority: "urgent",
    status: "running",
    approvalStatus: "审批中",
    device: "侦察小蜂",
    pilot: "李明",
    startTime: "09:42",
    duration: "进行中",
    timeMode: "立即执行",
    planStart: "2025-07-11 09:42",
    planEnd: "2025-07-11 11:00",
    route: "化工园区高空环绕航线",
    autoPlan: "危化品泄漏应急模板 V2.0",
    devices: ["侦察小蜂", "机库A01"],
    pilots: ["李明", "值班指挥"],
    algorithms: ["烟雾识别", "红外异常识别"],
    attachments: ["应急预案.docx"],
    partners: ["应急管理局", "化工园区管委会"],
  },
  {
    id: "RW-AB-2025-0031",
    name: "市政大楼安保巡逻",
    type: "安保任务",
    date: "2025-07-11",
    priority: "high",
    status: "pending",
    approvalStatus: "未审批",
    device: "巡逻一号",
    pilot: "王磊",
    startTime: "10:00",
    duration: "30min",
    timeMode: "定时执行",
    planStart: "2025-07-11 10:00",
    planEnd: "2025-07-11 10:40",
    route: "市政大楼周界安保航线",
    autoPlan: "会展活动安保巡逻模板",
    devices: ["巡逻一号"],
    pilots: ["王磊"],
    algorithms: ["人群聚集识别", "遗留物检测"],
    attachments: ["安保方案.pdf"],
    partners: ["公安安保支队"],
  },
  {
    id: "RW-ZX-2025-0009",
    name: "水库大坝专项检测",
    type: "专项任务",
    date: "2025-07-12",
    priority: "high",
    status: "pending",
    approvalStatus: "未审批",
    device: "农业巡检1号",
    pilot: "陈华",
    startTime: "14:00",
    duration: "120min",
    timeMode: "定时执行",
    planStart: "2025-07-12 14:00",
    planEnd: "2025-07-12 16:30",
    route: "大坝立面贴近巡检航线",
    autoPlan: "水利设施专项检测模板",
    devices: ["农业巡检1号"],
    pilots: ["陈华"],
    algorithms: ["裂缝识别", "渗漏识别"],
    attachments: ["设计图纸.pdf"],
    partners: ["水务局", "水库管理处"],
  },
  {
    id: "RW-XJ-2025-0041",
    name: "南环快速路例行巡检",
    type: "常态化巡检",
    date: "2025-07-10",
    priority: "low",
    status: "completed",
    approvalStatus: "已通过",
    device: "高空瞭望1号",
    pilot: "赵琳",
    startTime: "07:30",
    duration: "60min",
    timeMode: "周期执行",
    planStart: "2025-07-10 07:30",
    planEnd: "2025-07-10 08:30",
    route: "南环快速路双向主线",
    autoPlan: "城市快速路巡检模板",
    devices: ["高空瞭望1号"],
    pilots: ["赵琳"],
    algorithms: ["路面异常识别"],
    attachments: [],
    partners: ["交警支队"],
  },
  {
    id: "RW-DD-2025-0003",
    name: "跨区应急支援调度",
    type: "调度任务",
    date: "2025-07-09",
    priority: "medium",
    status: "completed",
    approvalStatus: "已通过",
    device: "机库A01",
    pilot: "指挥调度席",
    startTime: "16:00",
    duration: "90min",
    timeMode: "立即执行",
    planStart: "2025-07-09 16:00",
    planEnd: "2025-07-09 17:30",
    route: "跨区支援调度航线组",
    autoPlan: "智能调度一键出动方案",
    devices: ["机库A01", "高空瞭望3号"],
    pilots: ["指挥调度席"],
    algorithms: ["路径优化", "资源调度"],
    attachments: [],
    partners: ["多区联动指挥中心"],
  },
];

const TaskDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [typeTab, setTypeTab] = useState<"全部" | TaskType>("全部");
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState({
    dateFrom: "",
    dateTo: "",
    status: "",
    priority: "",
    pilot: "",
    device: "",
    keyword: "",
  });
  const [detailTask, setDetailTask] = useState<BoardTask | null>(null);

  const [extraTasks] = useState<BoardTask[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(TASK_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Partial<BoardTask>[];
      return parsed
        .filter((t) => t && t.id && t.name)
        .map((t) => ({
          id: t.id as string,
          name: t.name as string,
          type: (t.type as TaskType) || "常态化巡检",
          date: t.date || new Date().toISOString().slice(0, 10),
          priority: (t.priority as TaskPriority) || "medium",
          status: (t.status as TaskStatus) || "pending",
          approvalStatus: (t.approvalStatus as ApprovalStatus) || "未审批",
          device: t.device || "待分配设备",
          pilot: t.pilot || "待分配飞手",
          startTime: t.startTime || "--:--",
          duration: t.duration || "待执行",
          timeMode: t.timeMode || "定时执行",
          planStart: t.planStart || "",
          planEnd: t.planEnd || "",
          route: t.route || "待规划航线",
          autoPlan: t.autoPlan || "—",
          devices: t.devices || [],
          pilots: t.pilots || [],
          algorithms: t.algorithms || [],
          attachments: t.attachments || [],
          partners: t.partners || [],
        }));
    } catch {
      return [];
    }
  });

  const allTasks = useMemo(
    () => [...extraTasks, ...ALL_TASKS],
    [extraTasks]
  );

  const filteredTasks = useMemo(
    () =>
      allTasks.filter((t) => {
        if (typeTab !== "全部" && t.type !== typeTab) return false;
        if (filter.dateFrom && t.date < filter.dateFrom) return false;
        if (filter.dateTo && t.date > filter.dateTo) return false;
        if (filter.status && t.status !== filter.status) return false;
        if (filter.priority && t.priority !== filter.priority) return false;
        if (filter.pilot && t.pilot !== filter.pilot) return false;
        if (filter.device && t.device !== filter.device) return false;
        if (filter.keyword) {
          const kw = filter.keyword.toLowerCase();
          if (
            !(
              t.name.toLowerCase().includes(kw) ||
              t.id.toLowerCase().includes(kw) ||
              t.device.toLowerCase().includes(kw)
            )
          ) {
            return false;
          }
        }
        return true;
      }),
    [typeTab, filter, allTasks]
  );

  const tableTasks = filteredTasks.map((t) => ({
    id: t.id,
    name: t.name,
    type: t.type,
    priority: t.priority,
    status: t.status,
    approvalStatus: t.approvalStatus,
    device: t.device,
    pilot: t.pilot,
    startTime: t.startTime,
    duration: t.duration,
  }));

  console.log("TaskDashboard rendered, viewMode:", viewMode);

  return (
    <>
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        {/* 统计卡片 */}
        <div style={{ display: "flex", gap: "14px", marginBottom: "20px" }}>
          <div style={{ flex: 1 }}>
            <StatCard
              title="今日任务总数"
              value={String(allTasks.length)}
              unit="个"
              sub="本周新增 6 个"
              trend="15% 较昨日"
              trendUp
              icon={ClipboardList}
              iconColor="rgba(0,212,255,1)"
              iconBg="rgba(0,80,140,0.5)"
            />
          </div>
          <div style={{ flex: 1 }}>
            <StatCard
              title="执行中"
              value={String(allTasks.filter((t) => t.status === "running").length)}
              unit="个"
              sub="涉及设备 12 台"
              trend="3% 较昨日"
              trendUp
              icon={PlayCircle}
              iconColor="rgba(0,200,120,1)"
              iconBg="rgba(0,100,60,0.4)"
            />
          </div>
          <div style={{ flex: 1 }}>
            <StatCard
              title="待执行"
              value={String(allTasks.filter((t) => t.status === "pending").length)}
              unit="个"
              sub="最近开始 10:00"
              icon={Clock}
              iconColor="rgba(255,180,0,1)"
              iconBg="rgba(120,80,0,0.4)"
            />
          </div>
          <div style={{ flex: 1 }}>
            <StatCard
              title="今日已完成"
              value={String(allTasks.filter((t) => t.status === "completed").length)}
              unit="个"
              sub="完成率 75%"
              trend="8% 较昨日"
              trendUp
              icon={CheckCircle2}
              iconColor="rgba(0,180,255,1)"
              iconBg="rgba(0,60,120,0.4)"
            />
          </div>
          <div style={{ flex: 1 }}>
            <StatCard
              title="暂停/异常"
              value={String(allTasks.filter((t) => t.status === "paused").length)}
              unit="个"
              sub="红色预警 1 个"
              highlight="需处理"
              icon={PauseCircle}
              iconColor="rgba(255,80,80,1)"
              iconBg="rgba(120,20,20,0.4)"
            />
          </div>
        </div>

        {/* 主体：任务台账 + 预警侧栏 */}
        <div style={{ display: "flex", gap: "16px" }}>
          {/* 任务台账面板 */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
            <div
              className="tech-card"
              style={{ borderRadius: "6px", flex: 1, display: "flex", flexDirection: "column" }}
            >
              {/* 面板头部 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderBottom: "1px solid rgba(0, 100, 160, 0.2)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <ClipboardList size={15} style={{ color: "rgba(0,212,255,1)" }} />
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "rgba(200,230,255,1)",
                    }}
                  >
                    任务台账
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "1px 8px",
                      background: "rgba(0,80,140,0.4)",
                      color: "rgba(0,212,255,1)",
                      borderRadius: "10px",
                      border: "1px solid rgba(0,150,200,0.3)",
                    }}
                  >
                    共 {filteredTasks.length} 条
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  {/* 视图切换 */}
                  <div
                    style={{
                      display: "flex",
                      border: "1px solid rgba(0,120,180,0.4)",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={() => setViewMode("list")}
                      style={{
                        padding: "4px 10px",
                        fontSize: "12px",
                        background:
                          viewMode === "list" ? "rgba(0,100,160,0.6)" : "transparent",
                        color:
                          viewMode === "list"
                            ? "rgba(0,212,255,1)"
                            : "rgba(100,150,200,1)",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <List size={13} />
                      列表
                    </button>
                    <button
                      onClick={() => setViewMode("calendar")}
                      style={{
                        padding: "4px 10px",
                        fontSize: "12px",
                        background:
                          viewMode === "calendar"
                            ? "rgba(0,100,160,0.6)"
                            : "transparent",
                        color:
                          viewMode === "calendar"
                            ? "rgba(0,212,255,1)"
                            : "rgba(100,150,200,1)",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Calendar size={13} />
                      日历
                    </button>
                  </div>

                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "5px 12px",
                      fontSize: "12px",
                      background: "rgba(0,80,140,0.4)",
                      color: "rgba(0,212,255,1)",
                      border: "1px solid rgba(0,150,200,0.4)",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCw size={12} />
                    刷新
                  </button>
                  <button
                    onClick={() => navigate("/mission/task-create")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "5px 12px",
                      fontSize: "12px",
                      background: "rgba(0,150,200,0.5)",
                      color: "rgba(220,245,255,1)",
                      border: "1px solid rgba(0,212,255,0.5)",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    <PlusCircle size={12} />
                    新建任务
                  </button>
                </div>
              </div>

              {/* 顶部筛选行（列表视图） */}
              {viewMode === "list" && (
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    padding: "10px 16px",
                    borderBottom: "1px solid rgba(0,80,120,0.15)",
                    flexWrap: "wrap",
                  }}
                >
                  {["全部", "常态化巡检", "紧急任务", "安保任务", "专项任务", "调度任务"].map(
                    (t) => (
                      <button
                        key={t}
                        onClick={() => setTypeTab(t as any)}
                        style={{
                          padding: "3px 12px",
                          fontSize: "12px",
                          background:
                            typeTab === t ? "rgba(0,120,180,0.4)" : "rgba(0,40,80,0.3)",
                          color:
                            typeTab === t ? "rgba(0,212,255,1)" : "rgba(120,160,210,1)",
                          border:
                            typeTab === t
                              ? "1px solid rgba(0,150,200,0.5)"
                              : "1px solid rgba(0,80,130,0.3)",
                          borderRadius: "3px",
                          cursor: "pointer",
                        }}
                      >
                        {t}
                      </button>
                    )
                  )}
                  <div
                    style={{
                      marginLeft: "auto",
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      style={{
                        padding: "3px 10px",
                        fontSize: "12px",
                        background: showFilter
                          ? "rgba(0,120,180,0.4)"
                          : "rgba(0,40,80,0.3)",
                        color: "rgba(0,212,255,1)",
                        border: "1px solid rgba(0,120,180,0.5)",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                      onClick={() => setShowFilter((v) => !v)}
                    >
                      筛选
                    </button>
                    <input
                      placeholder="搜索任务名称/编号"
                      style={{
                        padding: "3px 10px",
                        fontSize: "12px",
                        background: "rgba(0,40,90,0.4)",
                        border: "1px solid rgba(0,100,160,0.3)",
                        borderRadius: "3px",
                        color: "rgba(180,210,240,1)",
                        outline: "none",
                        width: "180px",
                      }}
                      onChange={(e) =>
                        setFilter((f) => ({ ...f, keyword: e.target.value }))
                      }
                    />
                  </div>
                </div>
              )}

              {/* 列表或日历主体 */}
              <div style={{ padding: 0, flex: 1 }}>
                {viewMode === "list" ? (
                  <>
                    {showFilter && (
                      <div
                        className="tech-card"
                        style={{
                          margin: "10px 16px 0",
                          padding: "10px 12px",
                          borderRadius: "4px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px 16px",
                            fontSize: "12px",
                            color: "rgba(150,190,230,1)",
                          }}
                        >
                          <div>
                            <div>开始日期</div>
                            <input
                              type="date"
                              style={{
                                padding: "4px 8px",
                                background: "rgba(0,30,70,0.6)",
                                border: "1px solid rgba(0,100,160,0.4)",
                                borderRadius: "3px",
                                color: "rgba(180,210,240,1)",
                              }}
                              value={filter.dateFrom}
                              onChange={(e) =>
                                setFilter((f) => ({ ...f, dateFrom: e.target.value }))
                              }
                            />
                          </div>
                          <div>
                            <div>结束日期</div>
                            <input
                              type="date"
                              style={{
                                padding: "4px 8px",
                                background: "rgba(0,30,70,0.6)",
                                border: "1px solid rgba(0,100,160,0.4)",
                                borderRadius: "3px",
                                color: "rgba(180,210,240,1)",
                              }}
                              value={filter.dateTo}
                              onChange={(e) =>
                                setFilter((f) => ({ ...f, dateTo: e.target.value }))
                              }
                            />
                          </div>
                          <div>
                            <div>任务状态</div>
                            <select
                              style={{
                                padding: "4px 8px",
                                background: "rgba(0,30,70,0.6)",
                                border: "1px solid rgba(0,100,160,0.4)",
                                borderRadius: "3px",
                                color: "rgba(180,210,240,1)",
                              }}
                              value={filter.status}
                              onChange={(e) =>
                                setFilter((f) => ({ ...f, status: e.target.value }))
                              }
                            >
                              <option value="">全部</option>
                              <option value="running">执行中</option>
                              <option value="pending">待执行</option>
                              <option value="completed">已完成</option>
                              <option value="paused">已暂停</option>
                            </select>
                          </div>
                          <div>
                            <div>优先级</div>
                            <select
                              style={{
                                padding: "4px 8px",
                                background: "rgba(0,30,70,0.6)",
                                border: "1px solid rgba(0,100,160,0.4)",
                                borderRadius: "3px",
                                color: "rgba(180,210,240,1)",
                              }}
                              value={filter.priority}
                              onChange={(e) =>
                                setFilter((f) => ({ ...f, priority: e.target.value }))
                              }
                            >
                              <option value="">全部</option>
                              <option value="urgent">紧急</option>
                              <option value="high">高</option>
                              <option value="medium">中</option>
                              <option value="low">低</option>
                            </select>
                          </div>
                          <div>
                            <div>飞手</div>
                            <select
                              style={{
                                padding: "4px 8px",
                                background: "rgba(0,30,70,0.6)",
                                border: "1px solid rgba(0,100,160,0.4)",
                                borderRadius: "3px",
                                color: "rgba(180,210,240,1)",
                              }}
                              value={filter.pilot}
                              onChange={(e) =>
                                setFilter((f) => ({ ...f, pilot: e.target.value }))
                              }
                            >
                              <option value="">全部</option>
                              {Array.from(new Set(allTasks.map((t) => t.pilot))).map((p) => (
                                <option key={p} value={p}>
                                  {p}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <div>设备名称</div>
                            <select
                              style={{
                                padding: "4px 8px",
                                background: "rgba(0,30,70,0.6)",
                                border: "1px solid rgba(0,100,160,0.4)",
                                borderRadius: "3px",
                                color: "rgba(180,210,240,1)",
                              }}
                              value={filter.device}
                              onChange={(e) =>
                                setFilter((f) => ({ ...f, device: e.target.value }))
                              }
                            >
                              <option value="">全部</option>
                              {Array.from(new Set(allTasks.map((t) => t.device))).map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div style={{ marginLeft: "auto" }}>
                            <button
                              style={{
                                padding: "4px 10px",
                                fontSize: "12px",
                                background: "rgba(0,40,80,0.5)",
                                color: "rgba(160,190,230,1)",
                                border: "1px solid rgba(0,100,160,0.5)",
                                borderRadius: "3px",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                setFilter({
                                  dateFrom: "",
                                  dateTo: "",
                                  status: "",
                                  priority: "",
                                  pilot: "",
                                  device: "",
                                  keyword: "",
                                })
                              }
                            >
                              重置
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <TaskTable
                      tasks={tableTasks}
                      onDetail={(id) => {
                        const t = allTasks.find((x) => x.id === id) || null;
                        setDetailTask(t);
                      }}
                    />
                  </>
                ) : (
                  <div
                    style={{
                      padding: "16px",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* 日历头部 */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "rgba(0,212,255,1)",
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        }}
                      >
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            color: "rgba(100,150,200,1)",
                            cursor: "pointer",
                          }}
                        >
                          <ChevronLeft size={18} />
                        </button>
                        2025年 7月
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            color: "rgba(100,150,200,1)",
                            cursor: "pointer",
                          }}
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          fontSize: "12px",
                          color: "rgba(100,150,200,1)",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "2px",
                              background: "rgba(0,212,255,0.4)",
                            }}
                          />
                          未执行
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "2px",
                              background: "rgba(0,200,120,0.4)",
                            }}
                          />
                          已完成
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "2px",
                              background: "rgba(255,180,0,0.4)",
                            }}
                          />
                          异常/暂停
                        </span>
                      </div>
                    </div>

                    {/* 日历网格 */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 1fr)",
                        gap: "1px",
                        background: "rgba(0,100,160,0.3)",
                        border: "1px solid rgba(0,100,160,0.3)",
                        borderRadius: "6px",
                        overflow: "hidden",
                      }}
                    >
                      {/* 星期标题 */}
                      {["一", "二", "三", "四", "五", "六", "日"].map((day) => (
                        <div
                          key={day}
                          style={{
                            padding: "8px",
                            textAlign: "center",
                            fontSize: "12px",
                            color: "rgba(140,180,220,1)",
                            background: "rgba(0,30,70,0.6)",
                            fontWeight: 500,
                          }}
                        >
                          周{day}
                        </div>
                      ))}

                      {/* 月初占位 */}
                      <div
                        style={{
                          background: "rgba(4,12,30,0.4)",
                          minHeight: "100px",
                          padding: "8px",
                        }}
                      />

                      {/* 日期单元格 */}
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                        const todayTasks = calendarTasks[d] || [];
                        const isToday = d === 11;
                        return (
                          <div
                            key={d}
                            style={{
                              minHeight: "100px",
                              padding: "6px",
                              background: "rgba(6,20,45,0.8)",
                              borderTop: isToday
                                ? "2px solid rgba(0,212,255,1)"
                                : "none",
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "12px",
                                color: isToday
                                  ? "rgba(0,212,255,1)"
                                  : "rgba(100,140,180,1)",
                                fontWeight: isToday ? 700 : 400,
                                textAlign: "right",
                              }}
                            >
                              {d}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                                overflowY: "auto",
                                flex: 1,
                                maxHeight: "80px",
                              }}
                            >
                              {todayTasks.map((t, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    padding: "6px",
                                    background:
                                      t.status === "completed"
                                        ? "rgba(0,200,120,0.1)"
                                        : t.status === "running"
                                        ? "rgba(0,212,255,0.15)"
                                        : t.status === "pending"
                                        ? "rgba(255,255,255,0.05)"
                                        : "rgba(255,180,0,0.1)",
                                    borderLeft: `2px solid ${
                                      t.status === "completed"
                                        ? "rgba(0,200,120,1)"
                                        : t.status === "running"
                                        ? "rgba(0,212,255,1)"
                                        : t.status === "pending"
                                        ? "rgba(180,180,220,1)"
                                        : "rgba(255,180,0,1)"
                                    }`,
                                    borderRadius: "3px",
                                    fontSize: "10px",
                                    color: "rgba(200,230,255,1)",
                                    cursor: "pointer",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontWeight: 600,
                                      marginBottom: "2px",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {t.name}
                                  </div>
                                  <div style={{ color: "rgba(120,160,200,1)" }}>
                                    {t.time} · {t.pilot}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      {/* 补齐到 7x5 */}
                      <div
                        style={{
                          background: "rgba(4,12,30,0.4)",
                          minHeight: "100px",
                          padding: "8px",
                        }}
                      />
                      <div
                        style={{
                          background: "rgba(4,12,30,0.4)",
                          minHeight: "100px",
                          padding: "8px",
                        }}
                      />
                      <div
                        style={{
                          background: "rgba(4,12,30,0.4)",
                          minHeight: "100px",
                          padding: "8px",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 分页（仅列表视图展示，静态展示样式） */}
              {viewMode === "list" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 16px",
                    borderTop: "1px solid rgba(0,80,120,0.15)",
                  }}
                >
                  <span
                    style={{ fontSize: "12px", color: "rgba(80,120,170,1)" }}
                  >
                    共 {filteredTasks.length} 条记录
                  </span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {["上一页", "1", "2", "3", "下一页"].map((p) => (
                      <button
                        key={p}
                        style={{
                          padding: "3px 8px",
                          fontSize: "12px",
                          background:
                            p === "1"
                              ? "rgba(0,100,160,0.5)"
                              : "rgba(0,40,80,0.3)",
                          color:
                            p === "1"
                              ? "rgba(0,212,255,1)"
                              : "rgba(100,150,200,1)",
                          border: "1px solid rgba(0,80,130,0.3)",
                          borderRadius: "3px",
                          cursor: "pointer",
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右侧预警面板 */}
          <div style={{ width: "260px", flexShrink: 0 }}>
            <div className="tech-card" style={{ borderRadius: "6px", height: "100%" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderBottom: "1px solid rgba(0,100,160,0.2)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    className="blink"
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "rgba(255,59,59,1)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "rgba(200,230,255,1)",
                    }}
                  >
                    实时预警动态
                  </span>
                </div>
                <button
                  onClick={() => navigate("/mission/alert-center")}
                  style={{
                    fontSize: "11px",
                    color: "rgba(0,212,255,0.8)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  查看全部 →
                </button>
              </div>
              <div style={{ padding: "12px" }}>
                {missionAlertsForMissionModule.map((a, i) => (
                  <AlertItem
                    key={i}
                    level={a.level}
                    title={a.title}
                    device={a.device}
                    taskName={a.taskName}
                    time={a.time}
                    isNew={i === 0}
                  />
                ))}
              </div>

              {/* 快速操作 */}
              <div
                style={{
                  padding: "12px 16px",
                  borderTop: "1px solid rgba(0,80,120,0.15)",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "rgba(80,120,170,1)",
                    marginBottom: "8px",
                  }}
                >
                  快速操作
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {[
                    { label: "新建任务", color: "rgba(0,150,200,1)" },
                    { label: "一键返航全部低电设备", color: "rgba(255,80,80,1)" },
                    { label: "查看今日执行报告", color: "rgba(0,180,100,1)" },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      style={{
                        width: "100%",
                        padding: "7px",
                        fontSize: "12px",
                        color: btn.color,
                        background: `${btn.color}14`,
                        border: `1px solid ${btn.color}40`,
                        borderRadius: "4px",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 任务详情弹窗 */}
      {detailTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(4,10,24,0.85)" }}
          onClick={() => setDetailTask(null)}
        >
          <div
            className="tech-card rounded-lg p-5 w-[880px] max-h-[86vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: "rgba(210,230,250,1)" }}
                >
                  任务详情 · {detailTask.name}
                </div>
              <div
                className="text-[11px]"
                style={{ color: "rgba(130,160,200,1)" }}
              >
                任务编号：{detailTask.id} · 类型：{detailTask.type} · 优先级：
                <StatusBadge status={detailTask.priority} />
              </div>
              </div>
              <button
                className="text-xs px-3 py-1 rounded"
                style={{
                  background: "rgba(10,30,60,1)",
                  color: "rgba(140,180,210,1)",
                }}
                onClick={() => setDetailTask(null)}
              >
                关闭
              </button>
            </div>

            {/* 基础信息 */}
            <div className="tech-card rounded mb-3 p-4">
              <div
                className="text-xs font-semibold mb-2"
                style={{ color: "rgba(0,212,255,0.9)" }}
              >
                基础信息
              </div>
              <div
                className="grid grid-cols-2 gap-2 text-xs"
                style={{ color: "rgba(160,190,220,1)" }}
              >
                <div>任务名称：{detailTask.name}</div>
                <div>任务编号：{detailTask.id}</div>
                <div>
                  时间范围：{detailTask.planStart} ~ {detailTask.planEnd}
                </div>
                <div>执行模式：{detailTask.timeMode}</div>
                <div>任务类型：{detailTask.type}</div>
                <div>
                  任务状态：<StatusBadge status={detailTask.status} />
                </div>
                <div>
                  审批状态：
                  <StatusBadge
                    status={
                      detailTask.approvalStatus === "未审批"
                        ? "pending"
                        : detailTask.approvalStatus === "审批中"
                        ? "reviewing"
                        : detailTask.approvalStatus === "已通过"
                        ? "approved"
                        : detailTask.approvalStatus === "已驳回"
                        ? "rejected"
                        : "reviewing"
                    }
                    label={detailTask.approvalStatus}
                  />
                </div>
              </div>
            </div>

            {/* 关联信息 */}
            <div
              className="grid grid-cols-2 gap-3 text-xs"
              style={{ color: "rgba(160,190,220,1)" }}
            >
              <div className="tech-card rounded p-3">
                <div
                  className="font-semibold mb-2"
                  style={{ color: "rgba(0,212,255,0.9)" }}
                >
                  航线关联
                </div>
                <div>{detailTask.route}</div>
              </div>
              <div className="tech-card rounded p-3">
                <div
                  className="font-semibold mb-2"
                  style={{ color: "rgba(0,212,255,0.9)" }}
                >
                  自动规划作业关联
                </div>
                <div>{detailTask.autoPlan}</div>
              </div>
              <div className="tech-card rounded p-3">
                <div
                  className="font-semibold mb-2"
                  style={{ color: "rgba(0,212,255,0.9)" }}
                >
                  设备关联
                </div>
                <div className="flex flex-wrap gap-1">
                  {detailTask.devices.map((d) => (
                    <span
                      key={d}
                      className="px-2 py-0.5 rounded"
                      style={{
                        background: "rgba(0,80,140,0.3)",
                        border: "1px solid rgba(0,150,200,0.5)",
                      }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
              <div className="tech-card rounded p-3">
                <div
                  className="font-semibold mb-2"
                  style={{ color: "rgba(0,212,255,0.9)" }}
                >
                  人员关联
                </div>
                <div className="flex flex-wrap gap-1">
                  {detailTask.pilots.map((p) => (
                    <span
                      key={p}
                      className="px-2 py-0.5 rounded"
                      style={{
                        background: "rgba(0,80,120,0.3)",
                        border: "1px solid rgba(0,150,220,0.4)",
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <div className="tech-card rounded p-3">
                <div
                  className="font-semibold mb-2"
                  style={{ color: "rgba(0,212,255,0.9)" }}
                >
                  算法关联
                </div>
                <div className="flex flex-wrap gap-1">
                  {detailTask.algorithms.map((a) => (
                    <span
                      key={a}
                      className="px-2 py-0.5 rounded"
                      style={{
                        background: "rgba(40,80,140,0.3)",
                        border: "1px solid rgba(80,150,230,0.5)",
                      }}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
              <div className="tech-card rounded p-3">
                <div
                  className="font-semibold mb-2"
                  style={{ color: "rgba(0,212,255,0.9)" }}
                >
                  协作单位
                </div>
                <div className="flex flex-wrap gap-1">
                  {detailTask.partners.map((u) => (
                    <span
                      key={u}
                      className="px-2 py-0.5 rounded"
                      style={{
                        background: "rgba(0,60,90,0.4)",
                        border: "1px solid rgba(0,120,180,0.5)",
                      }}
                    >
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 附件 */}
            <div
              className="tech-card rounded p-3 mt-3 text-xs"
              style={{ color: "rgba(160,190,220,1)" }}
            >
              <div
                className="font-semibold mb-2"
                style={{ color: "rgba(0,212,255,0.9)" }}
              >
                附件
              </div>
              {detailTask.attachments.length ? (
                <div className="flex flex-wrap gap-2">
                  {detailTask.attachments.map((f) => (
                    <button
                      key={f}
                      className="px-3 py-1.5 rounded"
                      style={{
                        background: "rgba(0,40,80,0.6)",
                        border: "1px solid rgba(0,150,200,0.5)",
                        color: "rgba(180,210,240,1)",
                      }}
                    >
                      📎 {f}
                    </button>
                  ))}
                </div>
              ) : (
                <div>暂无附件</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskDashboard;
