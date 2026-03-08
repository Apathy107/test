import React, { useState } from "react";
import StatusBadge from "@personnel/components/StatusBadge";
import TechTable from "@personnel/components/TechTable";
import { BookOpen, Monitor, MapPin, Star } from "lucide-react";

type TrainingTab = "plan" | "record" | "exam";

const plans = [
  { id: "TP001", title: "新训飞手基础操作课程", target: "新入职飞手", type: "线上", participants: 8, startDate: "2025-07-15", endDate: "2025-07-30", status: "进行中", statusKey: "info" as const },
  { id: "TP002", title: "法规与安全培训（季度）", target: "全体飞手", type: "线上", participants: 128, startDate: "2025-07-01", endDate: "2025-07-31", status: "进行中", statusKey: "info" as const },
  { id: "TP003", title: "超视距飞行技能强化", target: "持BVLOS证飞手", type: "线下", participants: 32, startDate: "2025-08-05", endDate: "2025-08-10", status: "待开始", statusKey: "pending" as const },
  { id: "TP004", title: "应急处置专项训练", target: "应急响应队", type: "线下", participants: 12, startDate: "2025-06-01", endDate: "2025-06-15", status: "已完成", statusKey: "approved" as const },
];

const records = [
  { name: "张三", course: "基础操作课程 V3.0", type: "线上", duration: "6h", score: 92, date: "2025-07-05", status: "合格", statusKey: "active" as const },
  { name: "李四", course: "法规与安全 Q2-2025", type: "线上", duration: "4h", score: 86, date: "2025-07-08", status: "合格", statusKey: "active" as const },
  { name: "王五", course: "基础操作课程 V3.0", type: "线上", duration: "6h", score: 74, date: "2025-07-06", status: "不合格", statusKey: "rejected" as const },
  { name: "赵六", course: "超视距强化训练", type: "线下", duration: "16h", score: 95, date: "2025-06-14", status: "优秀", statusKey: "approved" as const },
];

const examQuestions = [
  { no: 1, question: "无人机飞行前，飞手必须检查哪些安全项目？（多选）", type: "多选", score: 4 },
  { no: 2, question: "在管制空域内飞行，需提前向相关部门申报的时限是？", type: "单选", score: 2 },
  { no: 3, question: "发现飞行器异常时，飞手应首先采取什么措施？", type: "单选", score: 2 },
  { no: 4, question: "超视距飞行的最大通视距离限制为多少公里？", type: "填空", score: 2 },
];

const planCols = [
  { key: "no", title: "序号", width: "60px", align: "center" as const },
  { key: "id", title: "计划编号" }, { key: "title", title: "培训名称" }, { key: "target", title: "适用对象" },
  { key: "type", title: "培训方式" }, { key: "participants", title: "参训人数", align: "center" as const },
  { key: "period", title: "培训周期" }, { key: "status", title: "状态" }, { key: "action", title: "操作" },
];

const recordCols = [
  { key: "no", title: "序号", width: "60px", align: "center" as const },
  { key: "name", title: "飞手" }, { key: "course", title: "课程名称" }, { key: "type", title: "类型" },
  { key: "duration", title: "时长", align: "center" as const }, { key: "score", title: "成绩", align: "center" as const },
  { key: "date", title: "完成日期" }, { key: "status", title: "结果" }, { key: "action", title: "操作" },
];

const Training: React.FC = () => {
  const [tab, setTab] = useState<TrainingTab>("plan");
  const [planList, setPlanList] = useState(plans);
  const [recordList, setRecordList] = useState(records);
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
  const [selectedRecordIdx, setSelectedRecordIdx] = useState<number[]>([]);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showPlanDetail, setShowPlanDetail] = useState<typeof plans[0] | null>(null);
  const [planForm, setPlanForm] = useState({
    title: "",
    duration: "",
    startDate: "",
    type: "线上",
    material: "",
  });
  console.log("Training page rendered");

  const togglePlanSelect = (id: string) => {
    setSelectedPlanIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleRecordSelect = (index: number) => {
    setSelectedRecordIdx((prev) =>
      prev.includes(index) ? prev.filter((x) => x !== index) : [...prev, index]
    );
  };

  const allPlansChecked =
    planList.length > 0 &&
    planList.every((p) => selectedPlanIds.includes(p.id));

  const allRecordsChecked =
    recordList.length > 0 &&
    recordList.every((_, idx) => selectedRecordIdx.includes(idx));

  const toggleAllPlans = () => {
    if (allPlansChecked) {
      setSelectedPlanIds([]);
    } else {
      setSelectedPlanIds(planList.map((p) => p.id));
    }
  };

  const toggleAllRecords = () => {
    if (allRecordsChecked) {
      setSelectedRecordIdx([]);
    } else {
      setSelectedRecordIdx(recordList.map((_, idx) => idx));
    }
  };

  const startTraining = (id: string) => {
    setPlanList((list) =>
      list.map((item) =>
        item.id === id && item.statusKey === "pending"
          ? { ...item, status: "进行中", statusKey: "info" as const }
          : item
      )
    );
    console.log("Start training for plan:", id);
  };

  const submitTrainingResult = (plan: typeof plans[0]) => {
    setPlanList((list) =>
      list.map((item) =>
        item.id === plan.id
          ? { ...item, status: "已完成", statusKey: "approved" as const }
          : item
      )
    );
    setRecordList((list) => [
      {
        name: "示例飞手",
        course: plan.title,
        type: plan.type,
        duration: "4h",
        score: 90,
        date: plan.endDate,
        status: "合格",
        statusKey: "active" as const,
      },
      ...list,
    ]);
    console.log("Submit training result for plan:", plan.id);
  };

  const exportRecords = () => {
    const targets =
      selectedRecordIdx.length > 0
        ? recordList.filter((_, idx) => selectedRecordIdx.includes(idx))
        : recordList;
    if (!targets.length) return;
    const header = ["飞手", "课程名称", "类型", "时长", "成绩", "完成日期", "结果"];
    const rows = targets.map((r) => [
      r.name,
      r.course,
      r.type,
      r.duration,
      r.score,
      r.date,
      r.status,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "飞手培训记录导出.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Stats */}
      <div className="flex gap-4 mb-5">
        {[
          { label: "本月培训计划", value: "4", icon: BookOpen, color: "rgba(0, 212, 255, 1)" },
          { label: "线上培训", value: "2", icon: Monitor, color: "rgba(0, 220, 150, 1)" },
          { label: "线下培训", value: "2", icon: MapPin, color: "rgba(180, 160, 255, 1)" },
          { label: "综合合格率", value: "91.7%", icon: Star, color: "rgba(255, 200, 0, 1)" },
        ].map((s) => {
          const Ic = s.icon;
          return (
            <div key={s.label} className="flex-1 tech-card rounded-lg p-4 flex items-center gap-3">
              <Ic size={22} style={{ color: s.color }} />
              <div>
                <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs" style={{ color: "rgba(100, 140, 180, 1)" }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {([
          { key: "plan", label: "培训计划" },
          { key: "record", label: "培训记录" },
          { key: "exam", label: "理论考核题库" },
        ] as { key: TrainingTab; label: string }[]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-2 rounded text-xs font-medium transition-colors"
            style={{
              background: tab === t.key ? "rgba(0, 80, 130, 0.3)" : "rgba(16, 38, 76, 0.5)",
              border: tab === t.key ? "1px solid rgba(0, 212, 255, 0.5)" : "1px solid rgba(0, 100, 150, 0.2)",
              color: tab === t.key ? "rgba(0, 212, 255, 1)" : "rgba(100, 140, 180, 1)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Training plans */}
      <div style={{ display: tab === "plan" ? "block" : "none" }}>
        <div className="flex justify-between items-center mb-2 text-xs" style={{ color: "rgba(100,140,180,1)" }}>
          <div>当前共有 {planList.length} 条培训计划，已选 {selectedPlanIds.length} 条</div>
          <button
            className="px-3 py-1 rounded"
            style={{ background: "rgba(0,100,150,0.25)", border: "1px solid rgba(0,212,255,0.5)", color: "rgba(0,212,255,1)" }}
            onClick={() => setShowPlanModal(true)}
          >
            新增培训计划
          </button>
        </div>
        <TechTable
          columns={planCols}
          showIndexCheckbox
          allChecked={allPlansChecked}
          onToggleAll={toggleAllPlans}
        >
          {planList.map((p, index) => (
            <tr
              key={p.id}
              className="table-row-hover"
              style={{ borderBottom: "1px solid rgba(0, 80, 120, 0.2)" }}
            >
              <td
                className="px-3 py-3 text-xs text-center"
                style={{ color: "rgba(100,140,180,1)" }}
              >
                <input
                  type="checkbox"
                  checked={selectedPlanIds.includes(p.id)}
                  onChange={() => togglePlanSelect(p.id)}
                  style={{ marginRight: 6, verticalAlign: "middle" }}
                />
                {index + 1}
              </td>
              <td
                className="px-3 py-3 text-xs"
                style={{
                  color: "rgba(0, 212, 255, 0.7)",
                  fontFamily: "monospace",
                }}
              >
                {p.id}
              </td>
              <td
                className="px-3 py-3 text-xs font-medium"
                style={{ color: "rgba(200, 220, 240, 1)" }}
              >
                {p.title}
              </td>
              <td
                className="px-3 py-3 text-xs"
                style={{ color: "rgba(140, 180, 210, 1)" }}
              >
                {p.target}
              </td>
              <td className="px-3 py-3 text-xs">
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded"
                  style={{
                    background: p.type === "线上" ? "rgba(0, 100, 150, 0.2)" : "rgba(120, 60, 180, 0.2)",
                    color: p.type === "线上" ? "rgba(0, 200, 255, 1)" : "rgba(180, 140, 255, 1)",
                    border: p.type === "线上" ? "1px solid rgba(0, 180, 220, 0.3)" : "1px solid rgba(160, 120, 240, 0.3)",
                  }}
                >
                  {p.type === "线上" ? <Monitor size={10} /> : <MapPin size={10} />}
                  {p.type}
                </span>
              </td>
              <td className="px-3 py-3 text-xs text-center font-medium" style={{ color: "rgba(0, 212, 255, 0.9)" }}>{p.participants}</td>
              <td className="px-3 py-3 text-xs" style={{ color: "rgba(140, 180, 210, 1)" }}>{p.startDate} ~ {p.endDate}</td>
              <td className="px-3 py-3">
                <StatusBadge status={p.statusKey} label={p.status} />
              </td>
              <td className="px-3 py-3">
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1 rounded text-xs"
                    style={{
                      background: "rgba(0, 80, 120, 0.2)",
                      border: "1px solid rgba(0, 150, 200, 0.3)",
                      color: "rgba(0, 212, 255, 0.9)",
                    }}
                    onClick={() => setShowPlanDetail(p)}
                  >
                    详情
                  </button>
                  {p.statusKey === "pending" && (
                    <button
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        background: "rgba(0, 120, 90, 0.2)",
                        border: "1px solid rgba(0, 200, 140, 0.4)",
                        color: "rgba(0, 230, 170, 1)",
                      }}
                      onClick={() => startTraining(p.id)}
                    >
                      开始培训
                    </button>
                  )}
                  {p.statusKey === "info" && (
                    <button
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        background: "rgba(0, 120, 90, 0.2)",
                        border: "1px solid rgba(0, 200, 140, 0.4)",
                        color: "rgba(0, 230, 170, 1)",
                      }}
                      onClick={() => submitTrainingResult(p)}
                    >
                      提交成果
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </TechTable>
      </div>

      {/* Training records */}
      <div style={{ display: tab === "record" ? "block" : "none" }}>
        <div className="flex justify-between items-center mb-2 text-xs" style={{ color: "rgba(100,140,180,1)" }}>
          <div>当前共有 {recordList.length} 条培训记录，已选 {selectedRecordIdx.length} 条</div>
          <button
            className="px-3 py-1 rounded"
            style={{ background: "rgba(0,100,150,0.25)", border: "1px solid rgba(0,212,255,0.5)", color: "rgba(0,212,255,1)" }}
            onClick={exportRecords}
          >
            批量导出
          </button>
        </div>
        <TechTable
          columns={recordCols}
          showIndexCheckbox
          allChecked={allRecordsChecked}
          onToggleAll={toggleAllRecords}
        >
          {recordList.map((r, i) => (
            <tr
              key={i}
              className="table-row-hover"
              style={{ borderBottom: "1px solid rgba(0, 80, 120, 0.2)" }}
            >
              <td
                className="px-3 py-3 text-xs text-center"
                style={{ color: "rgba(100,140,180,1)" }}
              >
                <input
                  type="checkbox"
                  checked={selectedRecordIdx.includes(i)}
                  onChange={() => toggleRecordSelect(i)}
                  style={{ marginRight: 6, verticalAlign: "middle" }}
                />
                {i + 1}
              </td>
              <td
                className="px-3 py-3 text-xs font-medium"
                style={{ color: "rgba(200, 220, 240, 1)" }}
              >
                {r.name}
              </td>
              <td
                className="px-3 py-3 text-xs"
                style={{ color: "rgba(180, 210, 240, 1)" }}
              >
                {r.course}
              </td>
              <td
                className="px-3 py-3 text-xs"
                style={{ color: "rgba(140, 180, 210, 1)" }}
              >
                {r.type}
              </td>
              <td
                className="px-3 py-3 text-xs text-center"
                style={{ color: "rgba(140, 180, 210, 1)" }}
              >
                {r.duration}
              </td>
              <td className="px-3 py-3 text-xs text-center">
                <span
                  className="font-bold"
                  style={{
                    color:
                      r.score >= 90
                        ? "rgba(0, 220, 150, 1)"
                        : r.score >= 80
                        ? "rgba(255, 200, 0, 1)"
                        : "rgba(255, 80, 80, 1)",
                  }}
                >
                  {r.score}
                </span>
              </td>
              <td
                className="px-3 py-3 text-xs"
                style={{ color: "rgba(140, 180, 210, 1)" }}
              >
                {r.date}
              </td>
              <td className="px-3 py-3">
                <StatusBadge status={r.statusKey} label={r.status} />
              </td>
              <td className="px-3 py-3">
                <button className="px-2 py-1 rounded text-xs" style={{ background: "rgba(0, 80, 120, 0.2)", border: "1px solid rgba(0, 150, 200, 0.3)", color: "rgba(0, 212, 255, 0.9)" }}
                  onClick={() => console.log("Export PDF:", r.name)}>
                  导出履历
                </button>
              </td>
            </tr>
          ))}
        </TechTable>
      </div>

      {/* Exam questions */}
      <div style={{ display: tab === "exam" ? "block" : "none" }}>
        <div
          className="tech-card rounded-lg p-4 mb-4 flex items-center justify-between"
        >
          <div className="text-xs" style={{ color: "rgba(100, 140, 180, 1)" }}>
            理论考核规则：每季度一次，随机抽取 <span style={{ color: "rgba(0, 212, 255, 1)" }}>50</span> 道题，
            满分 100 分，<span style={{ color: "rgba(0, 220, 150, 1)" }}>80 分</span>合格；
            不合格者限制派单直至补考通过
          </div>
          <button
            className="px-4 py-2 rounded text-xs"
            style={{ background: "rgba(0, 100, 150, 0.2)", border: "1px solid rgba(0, 212, 255, 0.4)", color: "rgba(0, 212, 255, 1)" }}
            onClick={() => console.log("Start exam")}
          >
            发起本季度考核
          </button>
        </div>
        <TechTable columns={[
          { key: "no", title: "题号", width: "60px", align: "center" as const },
          { key: "q", title: "题目内容" },
          { key: "type", title: "题型", width: "80px" },
          { key: "score", title: "分值", width: "60px", align: "center" as const },
          { key: "action", title: "操作", width: "80px" },
        ]}>
          {examQuestions.map((q) => (
            <tr key={q.no} className="table-row-hover" style={{ borderBottom: "1px solid rgba(0, 80, 120, 0.2)" }}>
              <td className="px-3 py-3 text-xs text-center" style={{ color: "rgba(0, 212, 255, 0.7)" }}>{q.no}</td>
              <td className="px-3 py-3 text-xs" style={{ color: "rgba(180, 210, 240, 1)" }}>{q.question}</td>
              <td className="px-3 py-3 text-xs">
                <span className="px-2 py-0.5 rounded" style={{ background: "rgba(0, 80, 120, 0.3)", color: "rgba(0, 200, 255, 0.9)", border: "1px solid rgba(0, 150, 200, 0.3)", fontSize: "11px" }}>
                  {q.type}
                </span>
              </td>
              <td className="px-3 py-3 text-xs text-center font-medium" style={{ color: "rgba(255, 200, 0, 1)" }}>{q.score}分</td>
              <td className="px-3 py-3">
                <button className="px-2 py-1 rounded text-xs" style={{ background: "rgba(0, 80, 120, 0.2)", border: "1px solid rgba(0, 150, 200, 0.3)", color: "rgba(0, 212, 255, 0.9)" }}>编辑</button>
              </td>
            </tr>
          ))}
        </TechTable>
      </div>

      {showPlanModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(4,10,24,0.85)" }}
          onClick={() => setShowPlanModal(false)}
        >
          <div
            className="tech-card rounded-lg p-5 w-[560px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm font-semibold mb-3" style={{ color: "rgba(210,230,250,1)" }}>
              新增培训计划
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs" style={{ color: "rgba(160,190,220,1)" }}>
              <div>
                <div className="form-label">培训名称 *</div>
                <input
                  className="form-input"
                  value={planForm.title}
                  onChange={(e) => setPlanForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div>
                <div className="form-label">培训时长 *</div>
                <input
                  className="form-input"
                  placeholder="如：4h / 16h"
                  value={planForm.duration}
                  onChange={(e) => setPlanForm((f) => ({ ...f, duration: e.target.value }))}
                />
              </div>
              <div>
                <div className="form-label">计划开始时间 *</div>
                <input
                  type="date"
                  className="form-input"
                  value={planForm.startDate}
                  onChange={(e) => setPlanForm((f) => ({ ...f, startDate: e.target.value }))}
                />
              </div>
              <div>
                <div className="form-label">培训类型 *</div>
                <select
                  className="form-input"
                  value={planForm.type}
                  onChange={(e) => setPlanForm((f) => ({ ...f, type: e.target.value }))}
                >
                  <option>线上</option>
                  <option>线下</option>
                </select>
              </div>
            </div>
            <div className="mt-3 text-xs" style={{ color: "rgba(160,190,220,1)" }}>
              <div className="form-label">培训资料（说明或链接）</div>
              <textarea
                className="form-input"
                rows={3}
                placeholder="填写培训课件说明、在线学习地址等"
                style={{ resize: "vertical" }}
                value={planForm.material}
                onChange={(e) => setPlanForm((f) => ({ ...f, material: e.target.value }))}
              />
            </div>
            <div className="mt-5 flex justify-end gap-3 text-xs">
              <button
                className="px-4 py-2 rounded"
                style={{ background: "rgba(16,38,76,1)", color: "rgba(140,180,210,1)" }}
                onClick={() => setShowPlanModal(false)}
              >
                取消
              </button>
              <button
                className="px-5 py-2 rounded"
                style={{ background: "rgba(0,130,200,0.9)", color: "#fff" }}
                onClick={() => {
                  const id = `TP${(planList.length + 1).toString().padStart(3, "0")}`;
                  const newPlan = {
                    id,
                    title: planForm.title || "新培训计划",
                    target: "待配置对象",
                    type: planForm.type,
                    participants: 0,
                    startDate: planForm.startDate || new Date().toISOString().slice(0, 10),
                    endDate: planForm.startDate || new Date().toISOString().slice(0, 10),
                    status: "待开始",
                    statusKey: "pending" as const,
                  };
                  setPlanList((list) => [newPlan, ...list]);
                  console.log("New training plan created and synced to list:", newPlan);
                  setShowPlanModal(false);
                  setPlanForm({ title: "", duration: "", startDate: "", type: "线上", material: "" });
                }}
              >
                提交
              </button>
            </div>
          </div>
        </div>
      )}

      {showPlanDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(4,10,24,0.85)" }}
          onClick={() => setShowPlanDetail(null)}
        >
          <div
            className="tech-card rounded-lg p-5 w-[640px] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="text-sm font-semibold" style={{ color: "rgba(210,230,250,1)" }}>
                  培训计划详情 · {showPlanDetail.title}（{showPlanDetail.id}）
                </div>
                <div className="text-[11px]" style={{ color: "rgba(130,160,200,1)" }}>
                  适用对象：{showPlanDetail.target} · 培训方式：{showPlanDetail.type}
                </div>
              </div>
              <button
                className="text-xs px-2 py-1 rounded"
                style={{ background: "rgba(10,30,60,1)", color: "rgba(140,180,210,1)" }}
                onClick={() => setShowPlanDetail(null)}
              >
                关闭
              </button>
            </div>
            <div className="text-xs space-y-2" style={{ color: "rgba(160,190,220,1)" }}>
              <div>计划周期：{showPlanDetail.startDate} ~ {showPlanDetail.endDate}</div>
              <div>当前状态：{showPlanDetail.status}</div>
              <div>计划说明：用于演示的培训计划详情，可在接入后台后替换为真实课纲与资料链接。</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Training;