import React from "react";
import StatusBadge from "./StatusBadge";

interface TaskRow {
  id: string;
  name: string;
  type: string;
  priority: "urgent" | "high" | "medium" | "low";
  status: "running" | "pending" | "completed" | "paused" | "cancelled";
  device: string;
  pilot: string;
  startTime: string;
  duration: string;
  approvalStatus?: "未审批" | "审批中" | "已通过" | "已驳回" | "已退回";
}

interface TaskTableProps {
  tasks?: TaskRow[];
  onDetail?: (id: string) => void;
}

const defaultTasks: TaskRow[] = [
  { id: "RW-XJ-2025-0042", name: "滨江大道日常巡检", type: "常态化巡检", priority: "medium", status: "running",   device: "高空瞭望3号", pilot: "张伟",   startTime: "09:15", duration: "45min",   approvalStatus: "审批中" },
  { id: "RW-JJ-2025-0018", name: "化工园区泄漏应急响应", type: "紧急",   priority: "urgent", status: "running",   device: "侦察小蜂",   pilot: "李明",   startTime: "09:42", duration: "进行中", approvalStatus: "审批中" },
  { id: "RW-AB-2025-0031", name: "市政大楼安保巡逻",   type: "安保",     priority: "high",   status: "pending",   device: "巡逻一号",   pilot: "王磊",   startTime: "10:00", duration: "30min",   approvalStatus: "未审批" },
  { id: "RW-ZX-2025-0009", name: "水库大坝专项检测",   type: "专项",     priority: "high",   status: "pending",   device: "农业巡检1号",pilot: "陈华",   startTime: "14:00", duration: "120min", approvalStatus: "未审批" },
  { id: "RW-XJ-2025-0041", name: "南环快速路例行巡检", type: "常态化巡检",priority: "low",    status: "completed", device: "高空瞭望1号", pilot: "赵琳",   startTime: "07:30", duration: "60min",   approvalStatus: "已通过" },
  { id: "RW-XJ-2025-0040", name: "港口码头周界检查",   type: "常态化巡检",priority: "medium", status: "completed", device: "消费级机",   pilot: "孙斌",   startTime: "06:00", duration: "90min",   approvalStatus: "已通过" },
  { id: "RW-JJ-2025-0017", name: "森林防火预警侦察",   type: "紧急",     priority: "urgent", status: "paused",    device: "侦察小蜂",   pilot: "刘洋",   startTime: "08:20", duration: "已暂停", approvalStatus: "已退回" },
];

const TaskTable: React.FC<TaskTableProps> = ({
  tasks = defaultTasks,
  onDetail = (id) => console.log("View task detail:", id),
}) => {
  const colStyle: React.CSSProperties = {
    padding: "10px 12px",
    fontSize: "12px",
    color: "rgba(160, 200, 240, 1)",
    borderBottom: "1px solid rgba(0, 100, 160, 0.15)",
    whiteSpace: "nowrap",
  };

  const headStyle: React.CSSProperties = {
    padding: "10px 12px",
    fontSize: "11px",
    color: "rgba(80, 130, 180, 1)",
    fontWeight: 500,
    letterSpacing: "0.5px",
    borderBottom: "1px solid rgba(0, 150, 200, 0.2)",
    background: "rgba(0, 40, 80, 0.4)",
    whiteSpace: "nowrap",
  };

  return (
    <div
      data-cmp="TaskTable"
      style={{ overflowX: "auto" }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={headStyle}>任务编号</th>
            <th style={headStyle}>任务名称</th>
            <th style={headStyle}>类型</th>
            <th style={headStyle}>优先级</th>
            <th style={headStyle}>状态</th>
            <th style={headStyle}>审批状态</th>
            <th style={headStyle}>执行设备</th>
            <th style={headStyle}>飞手</th>
            <th style={headStyle}>开始时间</th>
            <th style={headStyle}>时长</th>
            <th style={{ ...headStyle, textAlign: "center" }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((row, idx) => (
            <tr
              key={row.id}
              style={{
                background:
                  idx % 2 === 0
                    ? "rgba(0, 30, 70, 0.3)"
                    : "rgba(0, 20, 50, 0.2)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLTableRowElement).style.background =
                  "rgba(0, 80, 140, 0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLTableRowElement).style.background =
                  idx % 2 === 0
                    ? "rgba(0, 30, 70, 0.3)"
                    : "rgba(0, 20, 50, 0.2)";
              }}
            >
              <td style={{ ...colStyle, color: "rgba(0, 180, 220, 1)", fontFamily: "monospace", fontSize: "11px" }}>
                {row.id}
              </td>
              <td style={{ ...colStyle, maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis" }}>
                {row.name}
              </td>
              <td style={colStyle}>{row.type}</td>
              <td style={colStyle}>
                <StatusBadge status={row.priority} />
              </td>
              <td style={colStyle}>
                <StatusBadge status={row.status} />
              </td>
              <td style={colStyle}>
                {row.approvalStatus && (
                  <StatusBadge
                    status={
                      row.approvalStatus === "未审批"
                        ? "pending"
                        : row.approvalStatus === "审批中"
                        ? "reviewing"
                        : row.approvalStatus === "已通过"
                        ? "approved"
                        : row.approvalStatus === "已驳回"
                        ? "rejected"
                        : "reviewing"
                    }
                    label={row.approvalStatus}
                  />
                )}
              </td>
              <td style={colStyle}>{row.device}</td>
              <td style={colStyle}>{row.pilot}</td>
              <td style={{ ...colStyle, fontFamily: "monospace" }}>{row.startTime}</td>
              <td style={colStyle}>{row.duration}</td>
              <td style={{ ...colStyle, textAlign: "center" }}>
                <button
                  onClick={() => onDetail(row.id)}
                  style={{
                    padding: "3px 10px",
                    fontSize: "11px",
                    color: "rgba(0, 212, 255, 1)",
                    background: "rgba(0, 80, 140, 0.3)",
                    border: "1px solid rgba(0, 150, 200, 0.4)",
                    borderRadius: "3px",
                    cursor: "pointer",
                    marginRight: "4px",
                  }}
                >
                  详情
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
