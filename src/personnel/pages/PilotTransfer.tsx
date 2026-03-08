import React, { useState } from "react";
import StatusBadge from "@personnel/components/StatusBadge";
import TechTable from "@personnel/components/TechTable";
import { ArrowRight, Plus } from "lucide-react";

const transferApps = [
  { id: "TR001", name: "王小明", fromUnit: "东城分队", toUnit: "应急响应队", type: "单位内调动", applyDate: "2025-07-10", status: "审批中", statusKey: "pending" as const, handover: "待确认" },
  { id: "TR002", name: "李娜", fromUnit: "西城分队", toUnit: "北郊中队", type: "跨单位调动", applyDate: "2025-07-08", status: "已批准", statusKey: "approved" as const, handover: "已完成" },
  { id: "TR003", name: "赵阳", fromUnit: "南区分队", toUnit: "东城分队", type: "借调", applyDate: "2025-07-05", status: "原单位审批中", statusKey: "info" as const, handover: "未启动" },
  { id: "TR004", name: "张丽", fromUnit: "北郊中队", toUnit: "西城分队", type: "跨单位调动", applyDate: "2025-06-28", status: "交接阻塞", statusKey: "danger" as const, handover: "阻塞" },
];

const columns = [
  { key: "no", title: "序号", width: "60px", align: "center" as const },
  { key: "id", title: "申请编号" }, { key: "name", title: "飞手" },
  { key: "from", title: "原单位" }, { key: "arrow", title: "" }, { key: "to", title: "目标单位" },
  { key: "type", title: "调动类型" }, { key: "date", title: "申请日期" },
  { key: "handover", title: "交接状态" }, { key: "status", title: "审批状态" }, { key: "action", title: "操作" },
];

const approvalSteps = [
  { step: "飞手提交", done: true },
  { step: "原单位同意", done: true },
  { step: "目标单位确认", done: false },
  { step: "人事部门备案", done: false },
];

const PilotTransfer: React.FC = () => {
  const [showApply, setShowApply] = useState(false);
  const [list, setList] = useState(transferApps);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    type: "单位内调动",
    toUnit: "",
    date: "",
    reason: "",
  });
  console.log("PilotTransfer page rendered");

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const allChecked =
    list.length > 0 && list.every((a) => selectedIds.includes(a.id));

  const toggleAll = () => {
    if (allChecked) {
      setSelectedIds([]);
    } else {
      setSelectedIds(list.map((a) => a.id));
    }
  };

  return (
    <>
      {/* Summary cards */}
      <div className="flex gap-4 mb-5">
        {[
          { label: "本月调动申请", value: "4", sub: "单位内 1 / 跨单位 2 / 借调 1" },
          { label: "待审批", value: "2", sub: "需在 3 个工作日内完成" },
          { label: "交接阻塞", value: "1", sub: "张丽 — 任务未完成" },
          { label: "本月完成", value: "1", sub: "李娜 已完成调动" },
        ].map((s) => (
          <div key={s.label} className="flex-1 tech-card rounded-lg p-4">
            <div className="text-xs mb-2" style={{ color: "rgba(100, 140, 180, 1)" }}>{s.label}</div>
            <div className="text-2xl font-bold mb-1" style={{ color: "rgba(0, 212, 255, 1)" }}>{s.value}</div>
            <div className="text-xs" style={{ color: "rgba(80, 120, 160, 1)" }}>{s.sub}</div>
          </div>
        ))}
        <button
          onClick={() => {
            const toApprove = list.filter((a) => selectedIds.includes(a.id) && a.statusKey === "pending");
            if (!toApprove.length) return;
            setList((prev) =>
              prev.map((a) =>
                selectedIds.includes(a.id)
                  ? { ...a, status: "已批准", statusKey: "approved" as const, handover: a.handover === "未启动" ? "待确认" : a.handover }
                  : a
              )
            );
            console.log("Batch approve transfers:", toApprove.map((a) => a.id));
          }}
          className="flex items-center gap-2 px-4 py-2 rounded self-center text-xs font-medium"
          style={{
            background: "rgba(0, 120, 130, 0.3)",
            border: "1px solid rgba(0, 200, 160, 0.5)",
            color: "rgba(0, 230, 180, 1)",
          }}
        >
          批量审批
        </button>
        <button
          onClick={() => setShowApply(true)}
          className="flex items-center gap-2 px-5 py-3 rounded self-center text-sm font-medium"
          style={{
            background: "rgba(0, 100, 150, 0.2)",
            border: "1px solid rgba(0, 212, 255, 0.4)",
            color: "rgba(0, 212, 255, 1)",
          }}
        >
          <Plus size={15} />
          发起调动申请
        </button>
      </div>

      {/* Approval flow illustration */}
      <div className="tech-card rounded-lg p-4 mb-5">
        <div className="text-xs font-semibold mb-3" style={{ color: "rgba(0, 212, 255, 0.8)", letterSpacing: "0.1em" }}>
          — 审批流程（以 TR003 为例）
        </div>
        <div className="flex items-center gap-3">
          {approvalSteps.map((s, i) => (
            <React.Fragment key={s.step}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: s.done ? "rgba(0, 150, 100, 0.3)" : "rgba(16, 38, 76, 0.8)",
                    border: `2px solid ${s.done ? "rgba(0, 200, 130, 0.7)" : "rgba(80, 120, 160, 0.4)"}`,
                    color: s.done ? "rgba(0, 220, 150, 1)" : "rgba(80, 120, 160, 1)",
                  }}
                >
                  {i + 1}
                </div>
                <div className="text-[10px] text-center" style={{ color: s.done ? "rgba(0, 200, 130, 0.9)" : "rgba(80, 120, 160, 1)" }}>{s.step}</div>
              </div>
              {i < approvalSteps.length - 1 && (
                <div className="flex-1 h-px" style={{ background: approvalSteps[i + 1].done ? "rgba(0, 200, 130, 0.5)" : "rgba(60, 100, 140, 0.3)" }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Transfer applications table */}
      <TechTable
        columns={columns}
        showIndexCheckbox
        allChecked={allChecked}
        onToggleAll={toggleAll}
      >
        {list.map((app, index) => (
          <tr
            key={app.id}
            className="table-row-hover"
            style={{ borderBottom: "1px solid rgba(0, 80, 120, 0.2)" }}
          >
            <td className="px-3 py-3 text-xs text-center" style={{ color: "rgba(100,140,180,1)" }}>
              <input
                type="checkbox"
                checked={selectedIds.includes(app.id)}
                onChange={() => toggleSelect(app.id)}
                style={{ marginRight: 6, verticalAlign: "middle" }}
              />
              {index + 1}
            </td>
            <td className="px-3 py-3 text-xs font-medium" style={{ color: "rgba(200, 220, 240, 1)" }}>{app.name}</td>
            <td className="px-3 py-3 text-xs" style={{ color: "rgba(140, 180, 210, 1)" }}>{app.fromUnit}</td>
            <td className="px-3 py-3 text-center">
              <ArrowRight size={13} style={{ color: "rgba(0, 180, 220, 0.6)" }} />
            </td>
            <td className="px-3 py-3 text-xs" style={{ color: "rgba(0, 220, 150, 0.9)" }}>{app.toUnit}</td>
            <td className="px-3 py-3 text-xs" style={{ color: "rgba(180, 160, 255, 0.9)" }}>
              <span className="px-2 py-0.5 rounded" style={{ background: "rgba(120, 80, 200, 0.15)", border: "1px solid rgba(160, 120, 240, 0.3)" }}>
                {app.type}
              </span>
            </td>
            <td className="px-3 py-3 text-xs" style={{ color: "rgba(140, 180, 210, 1)" }}>{app.applyDate}</td>
            <td className="px-3 py-3">
              <StatusBadge
                status={app.handover === "已完成" ? "active" : app.handover === "阻塞" ? "danger" : app.handover === "待确认" ? "warning" : "info"}
                label={app.handover}
              />
            </td>
            <td className="px-3 py-3">
              <StatusBadge status={app.statusKey} label={app.status} />
            </td>
            <td className="px-3 py-3">
              <div className="flex gap-2">
                <button className="px-2 py-1 rounded text-xs" style={{ background: "rgba(0, 80, 120, 0.2)", border: "1px solid rgba(0, 150, 200, 0.3)", color: "rgba(0, 212, 255, 0.9)" }}
                  onClick={() => console.log("View transfer:", app.id)}>
                  查看
                </button>
                {app.statusKey === "pending" && (
                  <button className="px-2 py-1 rounded text-xs" style={{ background: "rgba(0, 100, 60, 0.2)", border: "1px solid rgba(0, 180, 100, 0.3)", color: "rgba(0, 200, 120, 0.9)" }}
                    onClick={() =>
                      setList((prev) =>
                        prev.map((a) =>
                          a.id === app.id ? { ...a, status: "已批准", statusKey: "approved" as const } : a
                        )
                      )
                    }
                  >
                    审批
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </TechTable>

      {/* Apply modal */}
      {showApply && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(4, 10, 24, 0.85)" }}
          onClick={() => setShowApply(false)}
        >
          <div
            className="tech-card rounded-lg p-6 w-[520px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-base font-bold mb-4" style={{ color: "rgba(200, 220, 240, 1)" }}>
              发起调动申请
            </div>
            <div className="highlight-line mb-5" />
            <div className="flex flex-col gap-4">
              <div>
                <div className="text-xs mb-1.5" style={{ color: "rgba(100, 140, 180, 1)" }}>飞手姓名</div>
                <input
                  className="w-full px-3 py-2 rounded text-xs outline-none"
                  placeholder="请选择飞手"
                  style={{
                    background: "rgba(16, 38, 76, 1)",
                    border: "1px solid rgba(0, 150, 200, 0.3)",
                    color: "rgba(180, 210, 240, 1)",
                  }}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <div className="text-xs mb-1.5" style={{ color: "rgba(100, 140, 180, 1)" }}>调动类型</div>
                <select
                  className="w-full px-3 py-2 rounded text-xs outline-none"
                  style={{
                    background: "rgba(16, 38, 76, 1)",
                    border: "1px solid rgba(0, 150, 200, 0.3)",
                    color: "rgba(180, 210, 240, 1)",
                  }}
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                >
                  <option>单位内调动</option>
                  <option>跨单位调动</option>
                  <option>借调</option>
                </select>
              </div>
              <div>
                <div className="text-xs mb-1.5" style={{ color: "rgba(100, 140, 180, 1)" }}>目标单位</div>
                <input
                  className="w-full px-3 py-2 rounded text-xs outline-none"
                  placeholder="请选择目标单位"
                  style={{
                    background: "rgba(16, 38, 76, 1)",
                    border: "1px solid rgba(0, 150, 200, 0.3)",
                    color: "rgba(180, 210, 240, 1)",
                  }}
                  value={form.toUnit}
                  onChange={(e) => setForm((f) => ({ ...f, toUnit: e.target.value }))}
                />
              </div>
              <div>
                <div className="text-xs mb-1.5" style={{ color: "rgba(100, 140, 180, 1)" }}>调动日期</div>
                <input
                  type="date"
                  className="w-full px-3 py-2 rounded text-xs outline-none"
                  style={{
                    background: "rgba(16, 38, 76, 1)",
                    border: "1px solid rgba(0, 150, 200, 0.3)",
                    color: "rgba(180, 210, 240, 1)",
                  }}
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
              </div>
              <div>
                <div className="text-xs mb-1.5" style={{ color: "rgba(100, 140, 180, 1)" }}>调动原因</div>
                <textarea
                  className="w-full px-3 py-2 rounded text-xs outline-none"
                  placeholder="请填写调动原因..."
                  rows={3}
                  style={{
                    background: "rgba(16, 38, 76, 1)",
                    border: "1px solid rgba(0, 150, 200, 0.3)",
                    color: "rgba(180, 210, 240, 1)",
                    resize: "vertical",
                  }}
                  value={form.reason}
                  onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowApply(false)}
                className="px-4 py-2 rounded text-xs"
                style={{ background: "rgba(16, 38, 76, 1)", border: "1px solid rgba(60, 100, 140, 0.4)", color: "rgba(100, 140, 180, 1)" }}
              >
                取消
              </button>
              <button
                className="px-5 py-2 rounded text-xs font-medium"
                style={{ background: "rgba(0, 100, 150, 0.3)", border: "1px solid rgba(0, 212, 255, 0.5)", color: "rgba(0, 212, 255, 1)" }}
                onClick={() => {
                  const id = `TR${(list.length + 1).toString().padStart(3, "0")}`;
                  const newRecord = {
                    id,
                    name: form.name || "新飞手",
                    fromUnit: "待确认单位",
                    toUnit: form.toUnit || "目标单位",
                    type: form.type,
                    applyDate: form.date || new Date().toISOString().slice(0, 10),
                    status: "审批中",
                    statusKey: "pending" as const,
                    handover: "未启动",
                  };
                  setList((prev) => [newRecord, ...prev]);
                  console.log("Submit transfer application and sync to records:", newRecord);
                  setShowApply(false);
                  setForm({ name: "", type: "单位内调动", toUnit: "", date: "", reason: "" });
                }}
              >
                提交申请
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PilotTransfer;