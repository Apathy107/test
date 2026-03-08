import React, { useState } from "react";
import StatusBadge from "@mission/components/StatusBadge";
import ApprovalFlow, { FlowStep } from "@mission/components/ApprovalFlow";
import { CheckCircle2, XCircle, RotateCcw, Clock, Bell } from "lucide-react";

interface ApprovalTask {
  id: string;
  name: string;
  type: string;
  priority: "urgent" | "high" | "medium" | "low";
  creator: string;
  createTime: string;
  status: "reviewing" | "approved" | "rejected";
  flowType: "紧急流程" | "专项流程" | "常规流程";
  overdue: boolean;
  flowSteps: FlowStep[];
  flowStatusLabel: string;
}

const baseTasks: Omit<ApprovalTask, "flowSteps" | "flowStatusLabel">[] = [
  { id: "RW-JJ-2025-0019", name: "北部工业园区危化品泄漏应急排查",  type: "紧急",       priority: "urgent", creator: "李明",   createTime: "09:38",       status: "reviewing", flowType: "紧急流程",   overdue: false },
  { id: "RW-ZX-2025-0010", name: "城市主干道季度专项检测",           type: "专项",       priority: "high",   creator: "陈华",   createTime: "昨日 16:20", status: "reviewing", flowType: "专项流程", overdue: true },
  { id: "RW-XJ-2025-0044", name: "新城区住宅群日常巡检",             type: "常态化巡检", priority: "medium", creator: "赵琳",   createTime: "今日 08:00", status: "reviewing", flowType: "常规流程", overdue: false },
  { id: "RW-AB-2025-0032", name: "市委大楼重要会议安保任务",         type: "安保",       priority: "high",   creator: "王磊",   createTime: "今日 07:45", status: "approved",  flowType: "常规流程", overdue: false },
  { id: "RW-XJ-2025-0043", name: "港口货运区夜间例行巡检",           type: "常态化巡检", priority: "low",    creator: "孙斌",   createTime: "昨日 14:00", status: "rejected",  flowType: "常规流程", overdue: false },
];

const buildInitialFlow = (task: Omit<ApprovalTask, "flowSteps" | "flowStatusLabel">): FlowStep[] => {
  const creatorStep: FlowStep = {
    role: "创建人",
    name: task.creator,
    status: "approved",
    time: task.createTime,
    remark: "提交审批",
  };

  if (task.type === "紧急") {
    return [
      creatorStep,
      { role: "指挥长", name: "指挥长", status: "pending" },
    ];
  }

  if (task.type === "专项") {
    return [
      creatorStep,
      { role: "部门负责人", name: "部门负责人", status: "pending" },
      { role: "专项负责人", name: "专项负责人", status: "waiting" },
    ];
  }

  // 常规流程：创建人 -> 部门负责人
  return [
    creatorStep,
    { role: "部门负责人", name: "部门负责人", status: "pending" },
  ];
};

const labelForStatus = (status: ApprovalTask["status"], fallback: string): string => {
  if (status === "approved") return "已通过";
  if (status === "rejected") return "已驳回";
  return fallback;
};

const TaskApproval: React.FC = () => {
  const [taskList, setTaskList] = useState<ApprovalTask[]>(
    () =>
      baseTasks.map((t) => ({
        ...t,
        flowSteps: buildInitialFlow(t),
        flowStatusLabel: labelForStatus(t.status, "审批中"),
      }))
  );
  const [selected, setSelected] = useState<string>("RW-JJ-2025-0019");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<{
    priority: "" | "urgent" | "high" | "medium" | "low";
    status: "" | "reviewing" | "approved" | "rejected";
    type: "" | "紧急" | "专项" | "常规流程" | "常态化巡检" | "安保";
    keyword: string;
  }>({
    priority: "",
    status: "",
    type: "",
    keyword: "",
  });

  const filteredTasks = taskList.filter((t) => {
    if (filter.priority && t.priority !== filter.priority) return false;
    if (filter.status && t.status !== filter.status) return false;
    if (filter.type) {
      if (
        !(t.type === filter.type || t.flowType.replace("流程", "") === filter.type)
      ) {
        return false;
      }
    }
    if (filter.keyword) {
      const kw = filter.keyword.toLowerCase();
      if (
        !(
          t.name.toLowerCase().includes(kw) ||
          t.id.toLowerCase().includes(kw)
        )
      ) {
        return false;
      }
    }
    return true;
  });

  const selectedTask = taskList.find((t) => t.id === selected);

  console.log("TaskApproval rendered, selected:", selected);

  const toggleChecked = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const approveOne = (task: ApprovalTask): ApprovalTask => {
    const steps = task.flowSteps.map((s) => ({ ...s }));
    const idx = steps.findIndex((s) => s.status === "pending");
    if (idx === -1) {
      return task;
    }
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    steps[idx] = {
      ...steps[idx],
      status: "approved",
      time: steps[idx].time || timeStr,
      remark: steps[idx].remark || "同意",
    };
    const nextIdx = idx + 1;
    if (nextIdx < steps.length) {
      steps[nextIdx] = { ...steps[nextIdx], status: "pending" };
      return {
        ...task,
        flowSteps: steps,
        status: "reviewing",
        flowStatusLabel: "审批中",
      };
    }
    return {
      ...task,
      flowSteps: steps,
      status: "approved",
      flowStatusLabel: "已通过",
    };
  };

  const returnOne = (task: ApprovalTask): ApprovalTask => {
    const steps = task.flowSteps.map((s) => ({ ...s }));
    const idx = steps.findIndex((s) => s.status === "pending");
    if (idx <= 0) return task;
    steps[idx] = { ...steps[idx], status: "waiting", remark: "退回修改" };
    steps[idx - 1] = {
      ...steps[idx - 1],
      status: "pending",
      remark: "待重新提交",
    };
    return {
      ...task,
      flowSteps: steps,
      status: "reviewing",
      flowStatusLabel: "已退回",
    };
  };

  const rejectOne = (task: ApprovalTask, reason: string): ApprovalTask => {
    const steps = task.flowSteps.map((s) => ({ ...s }));
    const idxPending = steps.findIndex((s) => s.status === "pending");
    const idx = idxPending !== -1 ? idxPending : steps.length - 1;
    steps[idx] = {
      ...steps[idx],
      status: "rejected",
      remark: reason || "驳回",
    };
    return {
      ...task,
      flowSteps: steps,
      status: "rejected",
      flowStatusLabel: "已驳回",
    };
  };

  const handleApproveSelected = () => {
    if (!selectedTask || selectedTask.status !== "reviewing") return;
    setTaskList((list) =>
      list.map((t) => (t.id === selectedTask.id ? approveOne(t) : t))
    );
  };

  const handleBatchApprove = () => {
    if (!checkedIds.length) return;
    setTaskList((list) =>
      list.map((t) =>
        checkedIds.includes(t.id) && t.status === "reviewing"
          ? approveOne(t)
          : t
      )
    );
    console.log("Batch approve tasks:", checkedIds);
    setCheckedIds([]);
  };

  const handleReturn = () => {
    if (!selectedTask || selectedTask.status !== "reviewing") return;
    setTaskList((list) =>
      list.map((t) => (t.id === selectedTask.id ? returnOne(t) : t))
    );
  };

  const handleReject = () => {
    if (!selectedTask || selectedTask.status !== "reviewing") return;
    if (!rejectReason.trim()) {
      alert("请填写驳回原因后再提交。");
      return;
    }
    setTaskList((list) =>
      list.map((t) => (t.id === selectedTask.id ? rejectOne(t, rejectReason) : t))
    );
    setShowRejectForm(false);
    setRejectReason("");
  };

  return (
    <div style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden" }}>
          {/* Left: task list */}
          <div
            style={{
              width: "340px",
              flexShrink: 0,
              background: "rgba(4, 12, 30, 0.9)",
              borderRight: "1px solid rgba(0, 100, 160, 0.2)",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                padding: "14px 16px",
                borderBottom: "1px solid rgba(0,80,140,0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "rgba(0,212,255,1)",
                    fontWeight: 600,
                  }}
                >
                  待审批任务
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    padding: "1px 8px",
                    background: "rgba(255,59,59,0.15)",
                    color: "rgba(255,80,80,1)",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,59,59,0.3)",
                  }}
                >
                  {taskList.filter((t) => t.status === "reviewing").length} 条待处理
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <select
                  style={{
                    flex: 1,
                    minWidth: 120,
                    padding: "4px 8px",
                    fontSize: 12,
                    background: "rgba(4,20,40,0.9)",
                    border: "1px solid rgba(0,80,140,0.5)",
                    borderRadius: 3,
                    color: "rgba(180,210,240,1)",
                  }}
                  value={filter.priority}
                  onChange={(e) =>
                    setFilter((f) => ({
                      ...f,
                      priority: e.target.value as any,
                    }))
                  }
                >
                  <option value="">优先级：全部</option>
                  <option value="urgent">紧急</option>
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
                <select
                  style={{
                    flex: 1,
                    minWidth: 120,
                    padding: "4px 8px",
                    fontSize: 12,
                    background: "rgba(4,20,40,0.9)",
                    border: "1px solid rgba(0,80,140,0.5)",
                    borderRadius: 3,
                    color: "rgba(180,210,240,1)",
                  }}
                  value={filter.status}
                  onChange={(e) =>
                    setFilter((f) => ({
                      ...f,
                      status: e.target.value as any,
                    }))
                  }
                >
                  <option value="">审批状态：全部</option>
                  <option value="reviewing">审批中</option>
                  <option value="approved">已通过</option>
                  <option value="rejected">已驳回</option>
                </select>
                <select
                  style={{
                    flex: 1,
                    minWidth: 130,
                    padding: "4px 8px",
                    fontSize: 12,
                    background: "rgba(4,20,40,0.9)",
                    border: "1px solid rgba(0,80,140,0.5)",
                    borderRadius: 3,
                    color: "rgba(180,210,240,1)",
                  }}
                  value={filter.type}
                  onChange={(e) =>
                    setFilter((f) => ({
                      ...f,
                      type: e.target.value as any,
                    }))
                  }
                >
                  <option value="">任务类型：全部</option>
                  <option value="紧急">紧急</option>
                  <option value="专项">专项</option>
                  <option value="常态化巡检">常态化巡检</option>
                  <option value="安保">安保</option>
                </select>
                <input
                  placeholder="任务名称/编号搜索"
                  style={{
                    flexBasis: "100%",
                    padding: "4px 8px",
                    fontSize: 12,
                    background: "rgba(4,20,40,0.9)",
                    border: "1px solid rgba(0,80,140,0.5)",
                    borderRadius: 3,
                    color: "rgba(180,210,240,1)",
                  }}
                  value={filter.keyword}
                  onChange={(e) =>
                    setFilter((f) => ({ ...f, keyword: e.target.value }))
                  }
                />
                <button
                  style={{
                    marginLeft: "auto",
                    padding: "2px 10px",
                    fontSize: 11,
                    background: "rgba(0,40,80,0.7)",
                    color: "rgba(160,190,230,1)",
                    border: "1px solid rgba(0,80,140,0.5)",
                    borderRadius: 3,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setFilter({
                      priority: "",
                      status: "",
                      type: "",
                      keyword: "",
                    })
                  }
                >
                  重置
                </button>
              </div>
            </div>

            {filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => {
                  setSelected(task.id);
                  setShowRejectForm(false);
                }}
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid rgba(0,60,120,0.15)",
                  cursor: "pointer",
                  background: selected === task.id ? "rgba(0,80,140,0.3)" : "transparent",
                  borderLeft: selected === task.id ? "3px solid rgba(0,212,255,1)" : "3px solid transparent",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                  <div
                    style={{
                      flex: 1,
                      fontSize: "13px",
                      color: "rgba(190,220,255,1)",
                      fontWeight: selected === task.id ? 600 : 400,
                      marginRight: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checkedIds.includes(task.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleChecked(task.id);
                      }}
                      style={{ margin: 0 }}
                    />
                    <span>{task.name}</span>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <StatusBadge status={task.priority} />
                  <span style={{ fontSize: "11px", color: "rgba(80,120,170,1)" }}>{task.flowType}</span>
                  {task.overdue && (
                    <span style={{ fontSize: "10px", color: "rgba(255,80,80,1)", display: "flex", alignItems: "center", gap: "2px" }}>
                      <Clock size={10} /> 超时
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "11px", color: "rgba(80,120,170,1)", marginTop: "4px" }}>
                  {task.creator} 提交 · {task.createTime}
                </div>
              </div>
            ))}
          </div>

          {/* Right: approval detail */}
          <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
            {selectedTask && (
              <>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <div>
                    <div style={{ fontSize: "17px", fontWeight: 700, color: "rgba(200,230,255,1)", marginBottom: "6px" }}>
                      {selectedTask.name}
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", color: "rgba(0,180,220,1)", fontFamily: "monospace" }}>{selectedTask.id}</span>
                      <StatusBadge status={selectedTask.priority} />
                      <StatusBadge
                        status={selectedTask.status}
                        label={selectedTask.flowStatusLabel}
                      />
                      {selectedTask.overdue && (
                        <span style={{ fontSize: "11px", color: "rgba(255,80,80,1)", display: "flex", alignItems: "center", gap: "3px" }}>
                          <Bell size={11} /> 已超时，请尽快处理
                        </span>
                      )}
                    </div>
                  </div>
                  {selectedTask.status === "reviewing" && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setShowRejectForm(!showRejectForm)}
                        style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 16px", fontSize: "13px", background: "rgba(80,10,10,0.4)", color: "rgba(255,80,80,1)", border: "1px solid rgba(200,50,50,0.4)", borderRadius: "4px", cursor: "pointer" }}
                      >
                        <XCircle size={14} /> 驳回
                      </button>
                      <button
                        onClick={handleReturn}
                        style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 16px", fontSize: "13px", background: "rgba(0,80,40,0.4)", color: "rgba(0,200,120,1)", border: "1px solid rgba(0,160,80,0.4)", borderRadius: "4px", cursor: "pointer" }}
                      >
                        <RotateCcw size={14} /> 退回修改
                      </button>
                      {checkedIds.length > 0 && (
                        <button
                          style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 16px", fontSize: "13px", background: "rgba(0,80,80,0.5)", color: "rgba(0,220,170,1)", border: "1px solid rgba(0,180,150,0.5)", borderRadius: "4px", cursor: "pointer" }}
                          onClick={handleBatchApprove}
                        >
                          <CheckCircle2 size={14} /> 批量通过审批
                        </button>
                      )}
                      <button
                        style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 20px", fontSize: "13px", fontWeight: 600, background: "rgba(0,120,70,0.6)", color: "rgba(0,220,130,1)", border: "1px solid rgba(0,200,100,0.5)", borderRadius: "4px", cursor: "pointer" }}
                        onClick={handleApproveSelected}
                      >
                        <CheckCircle2 size={14} /> 通过审批
                      </button>
                    </div>
                  )}
                </div>

                {/* Reject form */}
                {showRejectForm && (
                  <div className="tech-card" style={{ borderRadius: "6px", padding: "16px", marginBottom: "16px", borderColor: "rgba(255,59,59,0.3)" }}>
                    <div style={{ fontSize: "13px", color: "rgba(255,80,80,1)", marginBottom: "8px", fontWeight: 600 }}>驳回原因（必填）</div>
                    <textarea
                      rows={3}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="请详细说明驳回原因，便于任务创建人修改..."
                      style={{ width: "100%", padding: "8px 12px", background: "rgba(40,5,5,0.4)", border: "1px solid rgba(200,50,50,0.35)", borderRadius: "4px", color: "rgba(220,180,180,1)", fontSize: "13px", outline: "none", resize: "vertical" }}
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                      <button onClick={() => setShowRejectForm(false)} style={{ padding: "6px 14px", fontSize: "12px", background: "transparent", color: "rgba(120,150,190,1)", border: "1px solid rgba(80,100,150,0.3)", borderRadius: "4px", cursor: "pointer" }}>
                        取消
                      </button>
                      <button
                        style={{ padding: "6px 14px", fontSize: "12px", background: "rgba(180,30,30,0.5)", color: "rgba(255,100,100,1)", border: "1px solid rgba(255,50,50,0.4)", borderRadius: "4px", cursor: "pointer" }}
                        onClick={handleReject}
                      >
                        确认驳回
                      </button>
                    </div>
                  </div>
                )}

                {/* Approval flow */}
                <div className="tech-card" style={{ borderRadius: "6px", padding: "20px", marginBottom: "16px" }}>
                  <div style={{ fontSize: "13px", color: "rgba(0,212,255,1)", fontWeight: 600, marginBottom: "16px" }}>审批流程</div>
                  <ApprovalFlow steps={selectedTask.flowSteps} />
                  {selectedTask.type === "紧急" && (
                    <div style={{ marginTop: "12px", fontSize: "12px", color: "rgba(255,180,0,0.9)", background: "rgba(255,180,0,0.08)", padding: "8px 12px", borderRadius: "4px", border: "1px solid rgba(255,180,0,0.25)" }}>
                      ⚡ 紧急任务采用快速审批流程，要求指挥长在 5 分钟内完成审批，跳过部门审核环节。
                    </div>
                  )}
                </div>

                {/* Task detail info + mini map */}
                <div className="tech-card" style={{ borderRadius: "6px", padding: "20px", marginBottom: "16px" }}>
                  <div style={{ fontSize: "13px", color: "rgba(0,212,255,1)", fontWeight: 600, marginBottom: "14px" }}>任务详情</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 32px" }}>
                    {[
                      ["任务类型", selectedTask.type],
                      ["创建人", selectedTask.creator],
                      ["提交时间", selectedTask.createTime],
                      ["执行时间", "立即执行"],
                      ["关联设备", "高空瞭望3号 (D005)"],
                      ["关联飞手", "张伟"],
                      ["关联航线", "滨江大道北段 v3"],
                      ["关联算法", "目标检测 v2.3"],
                    ].map(([k, v]) => (
                      <div key={k} style={{ minWidth: "180px" }}>
                        <div style={{ fontSize: "11px", color: "rgba(80,120,170,1)", marginBottom: "2px" }}>{k}</div>
                        <div style={{ fontSize: "13px", color: "rgba(180,210,240,1)" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      marginTop: 16,
                      paddingTop: 12,
                      borderTop: "1px solid rgba(0,80,140,0.25)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: "rgba(80,150,210,1)",
                        marginBottom: 6,
                      }}
                    >
                      航线轨迹预览（小地图）
                    </div>
                    <div
                      style={{
                        height: 140,
                        borderRadius: 6,
                        background:
                          "radial-gradient(circle at 20% 20%, rgba(0,212,255,0.25), transparent 55%), radial-gradient(circle at 80% 70%, rgba(0,120,220,0.35), transparent 55%), rgba(2,10,30,0.95)",
                        border: "1px solid rgba(0,120,200,0.7)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 10,
                          borderRadius: 4,
                          border: "1px dashed rgba(0,180,255,0.5)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          left: "10%",
                          top: "70%",
                          width: "60%",
                          height: 2,
                          background:
                            "linear-gradient(90deg, rgba(0,212,255,0) 0%, rgba(0,212,255,0.9) 40%, rgba(0,212,255,0.9) 60%, rgba(0,212,255,0) 100%)",
                          boxShadow: "0 0 8px rgba(0,212,255,0.8)",
                          transform: "rotate(-18deg)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          left: "18%",
                          top: "32%",
                          width: "40%",
                          height: 2,
                          background:
                            "linear-gradient(90deg, rgba(0,200,150,0) 0%, rgba(0,200,150,0.9) 45%, rgba(0,200,150,0) 100%)",
                          boxShadow: "0 0 6px rgba(0,200,150,0.8)",
                          transform: "rotate(15deg)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          right: 18,
                          top: 34,
                          width: 32,
                          height: 18,
                          borderRadius: 4,
                          border: "1px solid rgba(0,212,255,0.6)",
                          background: "rgba(0,40,80,0.9)",
                          fontSize: 10,
                          color: "rgba(170,210,245,1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        航点
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          right: 12,
                          bottom: 8,
                          display: "flex",
                          gap: 6,
                        }}
                      >
                        <button
                          style={{
                            padding: "2px 8px",
                            fontSize: 10,
                            borderRadius: 3,
                            border: "1px solid rgba(0,150,220,0.7)",
                            background: "rgba(0,40,80,0.9)",
                            color: "rgba(0,200,255,1)",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            console.log("Preview route on big map", selectedTask.id)
                          }
                        >
                          大图预览
                        </button>
                        <button
                          style={{
                            padding: "2px 8px",
                            fontSize: 10,
                            borderRadius: 3,
                            border: "1px solid rgba(0,150,220,0.7)",
                            background: "rgba(0,40,80,0.9)",
                            color: "rgba(0,200,255,1)",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            console.log("Download route KML/KMZ from approval detail")
                          }
                        >
                          下载KML/KMZ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reminder button */}
                {selectedTask.status === "reviewing" && (
                  <button
                    style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 16px", fontSize: "12px", background: "rgba(0,60,120,0.35)", color: "rgba(0,180,255,1)", border: "1px solid rgba(0,120,180,0.35)", borderRadius: "4px", cursor: "pointer" }}
                    onClick={() => {
                      console.log("Remind approver via station message and SMS:", selectedTask.id);
                    }}
                  >
                    <Bell size={13} /> 催办（超时未审批自动推送提醒）
                  </button>
                )}
              </>
            )}
          </div>
    </div>
  );
};

export default TaskApproval;
