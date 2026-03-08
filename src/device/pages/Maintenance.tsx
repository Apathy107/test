import React, { useState } from "react";
import { Plus, Clock, CheckCircle, AlertCircle, Download } from "lucide-react";
import MaintenanceTimeline from "@device/components/MaintenanceTimeline";
import StatusBadge from "@device/components/StatusBadge";

const Maintenance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"plan" | "workorder" | "history" | "reminder">("plan");
  console.log("Maintenance page rendered");

  const initialPlans = [
    { id: "MP001", device: "巡逻一号", type: "定期保养", cycle: "季度", nextDate: "2025-09-30", daysLeft: 81, status: "normal", lastDate: "2025-07-01" },
    { id: "MP002", device: "农业巡检1号", type: "大修保养", cycle: "按需", nextDate: "2025-07-15", daysLeft: 4, status: "urgent", lastDate: "2024-12-01" },
    { id: "MP003", device: "侦查小蜂", type: "定期保养", cycle: "季度", nextDate: "2025-07-01", daysLeft: -10, status: "overdue", lastDate: "2025-04-01" },
    { id: "MP004", device: "应急响应2号", type: "专项保养", cycle: "一次性", nextDate: "2025-07-20", daysLeft: 9, status: "warning", lastDate: "—" },
  ];
  const initialWorkorders = [
    { id: "WO-2025-0701", device: "巡逻一号", type: "季度定期保养", assignee: "陈技师", planDate: "2025-07-01", status: "completed", duration: "3.5h" },
    { id: "WO-2025-0711", device: "农业巡检1号", type: "按需保养（飞行时长触发）", assignee: "王工", planDate: "2025-07-15", status: "pending", duration: "—" },
    { id: "WO-2025-0708", device: "侦查小蜂", type: "季度定期保养（逾期）", assignee: "待分配", planDate: "2025-07-08", status: "overdue", duration: "—" },
  ];

  type Plan = (typeof initialPlans)[number];
  type WorkOrder = (typeof initialWorkorders)[number] & { project?: string };
  type HistoryEvent = {
    date: string;
    type: "completed" | "overdue" | "upcoming" | "inprogress";
    title: string;
    operator: string;
    detail: string;
    workOrder?: string;
  };

  const [planList, setPlanList] = useState<Plan[]>(initialPlans);
  const [workorders, setWorkorders] = useState<WorkOrder[]>(initialWorkorders);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planForm, setPlanForm] = useState({
    deviceName: "",
    deviceSn: "",
    type: "定期保养",
    cycle: "季度",
    time: "",
    project: "",
    standard: "",
    materials: "",
    maintainer: "",
    contact: "",
    nextTime: "",
    conclusion: "",
  });
  const [editingWorkorder, setEditingWorkorder] = useState<WorkOrder | null>(null);
  const [feedbackWorkorder, setFeedbackWorkorder] = useState<WorkOrder | null>(null);
  const [feedbackResult, setFeedbackResult] = useState("正常");
  const [feedbackDetail, setFeedbackDetail] = useState("");
  const [feedbackMediaNote, setFeedbackMediaNote] = useState("");
  const [feedbackMaterials, setFeedbackMaterials] = useState<
    { name: string; model: string; sn: string }[]
  >([{ name: "", model: "", sn: "" }]);
  const [historyEvents, setHistoryEvents] = useState<HistoryEvent[]>([
    {
      date: "2025-07-01",
      type: "completed",
      title: "定期保养（季度）",
      operator: "陈技师",
      detail: "全面检查，更换桨叶，清洁传感器，电子签名完成",
      workOrder: "WO-2025-0701",
    },
  ]);

  const daysColor = (d: number) => d < 0 ? "rgba(239,68,68,1)" : d <= 7 ? "rgba(255,167,38,1)" : d <= 15 ? "rgba(255,202,40,1)" : "rgba(76,175,80,1)";
  const statusBadge = (s: string) => {
    if (s === "overdue") return <StatusBadge status="overdue" />;
    if (s === "urgent") return <StatusBadge status="danger" label="紧急" />;
    if (s === "warning") return <StatusBadge status="warning" label="即将到期" />;
    return <StatusBadge status="normal" />;
  };

  return (
    <div style={{ padding: "20px 24px", minHeight: "100%" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-secondary" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
            <Download size={12} /> 导出PDF报告
          </button>
          <button
            className="btn-primary-blue"
            style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}
            onClick={() => {
              setPlanForm({
                deviceName: "",
                deviceSn: "",
                type: "定期保养",
                cycle: "季度",
                time: "",
                project: "",
                standard: "",
                materials: "",
                maintainer: "",
                contact: "",
                nextTime: "",
                conclusion: "",
              });
              setShowPlanModal(true);
            }}
          >
            <Plus size={12} /> 制定保养计划
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[
          { label: "本月应保养", value: 6, color: "rgba(30,136,229,1)" },
          { label: "已完成", value: 4, color: "rgba(76,175,80,1)" },
          { label: "即将到期（15天内）", value: 2, color: "rgba(255,202,40,1)" },
          { label: "逾期未保养", value: 1, color: "rgba(239,68,68,1)" },
          { label: "带病运行设备", value: 1, color: "rgba(239,68,68,1)" },
        ].map((s) => (
          <div key={s.label} className="panel-card" style={{ flex: 1, padding: "14px 16px" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "rgba(120,145,180,1)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(30,50,80,1)", marginBottom: 16 }}>
        {([["plan", "保养计划"], ["workorder", "保养工单"], ["history", "保养履历"], ["reminder", "提醒逾期"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setActiveTab(k)} style={{ padding: "8px 20px", background: "none", border: "none", borderBottom: activeTab === k ? "2px solid rgba(30,136,229,1)" : "2px solid transparent", color: activeTab === k ? "rgba(100,181,246,1)" : "rgba(120,145,180,1)", cursor: "pointer", fontSize: 13, fontWeight: activeTab === k ? 600 : 400, marginBottom: -1 }}>
            {l}
          </button>
        ))}
      </div>

      {activeTab === "plan" && (
        <div className="panel-card" style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr className="table-header">
                {["计划ID", "设备名称", "保养类型", "周期", "下次保养日期", "剩余天数", "上次保养", "状态", "操作"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", borderBottom: "1px solid rgba(30,50,80,1)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {planList.map((p) => (
                <tr key={p.id} className="table-row">
                  <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "rgba(100,181,246,1)", fontSize: 11 }}>{p.id}</td>
                  <td style={{ padding: "10px 14px", color: "rgba(220,228,240,1)", fontWeight: 500 }}>{p.device}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: 11, background: "rgba(30,136,229,0.1)", color: "rgba(100,181,246,1)", padding: "2px 7px", borderRadius: 3 }}>{p.type}</span>
                  </td>
                  <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{p.cycle}</td>
                  <td style={{ padding: "10px 14px", color: "rgba(180,200,230,1)" }}>{p.nextDate}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: daysColor(p.daysLeft) }}>
                    {p.daysLeft < 0 ? `逾期 ${Math.abs(p.daysLeft)} 天` : `${p.daysLeft} 天`}
                  </td>
                  <td style={{ padding: "10px 14px", color: "rgba(120,145,180,1)", fontSize: 11 }}>{p.lastDate}</td>
                  <td style={{ padding: "10px 14px" }}>{statusBadge(p.status)}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        className="btn-primary-blue"
                        style={{ fontSize: 10, padding: "3px 8px" }}
                        onClick={() => {
                          const newId = `WO-${p.id.replace("MP", "2025-")}`;
                          const wo: WorkOrder = {
                            id: newId,
                            device: p.device,
                            type: p.type,
                            assignee: "待分配",
                            planDate: p.nextDate,
                            status: "pending",
                            duration: "—",
                            project: planForm.project || p.type,
                          };
                          setWorkorders((prev) =>
                            prev.some((w) => w.id === newId) ? prev : [...prev, wo]
                          );
                          setActiveTab("workorder");
                          setEditingWorkorder(wo);
                        }}
                      >
                        生成工单
                      </button>
                      <button
                        className="btn-secondary"
                        style={{ fontSize: 10, padding: "3px 8px" }}
                        onClick={() => {
                          setPlanForm({
                            deviceName: p.device,
                            deviceSn: "",
                            type: p.type,
                            cycle: p.cycle,
                            time: p.nextDate,
                            project: "",
                            standard: "",
                            materials: "",
                            maintainer: "",
                            contact: "",
                            nextTime: "",
                            conclusion: "",
                          });
                          setShowPlanModal(true);
                        }}
                      >
                        编辑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "workorder" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {workorders.map((wo) => {
            const woStatusColor = wo.status === "completed" ? "rgba(76,175,80,1)" : wo.status === "overdue" ? "rgba(239,68,68,1)" : "rgba(255,167,38,1)";
            const woStatusLabel = wo.status === "completed" ? "已完成" : wo.status === "overdue" ? "逾期未执行" : "待执行";
            return (
              <div key={wo.id} className="panel-card" style={{ padding: "14px 20px", borderLeft: `3px solid ${woStatusColor}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(100,181,246,1)" }}>{wo.id}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(220,228,240,1)" }}>{wo.device}</span>
                      <span style={{ fontSize: 11, padding: "1px 7px", borderRadius: 2, background: `${woStatusColor}20`, color: woStatusColor }}>{woStatusLabel}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(160,185,215,1)", marginBottom: 4 }}>{wo.type}</div>
                    <div style={{ display: "flex", gap: 16 }}>
                      <span style={{ fontSize: 11, color: "rgba(80,110,150,1)" }}>执行人：{wo.assignee}</span>
                      <span style={{ fontSize: 11, color: "rgba(80,110,150,1)" }}>计划日期：{wo.planDate}</span>
                      <span style={{ fontSize: 11, color: "rgba(80,110,150,1)" }}>耗时：{wo.duration}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {wo.status === "pending" && (
                      <button
                        className="btn-primary-blue"
                        style={{ fontSize: 11 }}
                        onClick={() => {
                          setFeedbackWorkorder(wo);
                          setFeedbackResult("正常");
                          setFeedbackDetail("");
                          setFeedbackMediaNote("");
                          setFeedbackMaterials([{ name: "", model: "", sn: "" }]);
                        }}
                      >
                        处置反馈
                      </button>
                    )}
                    {wo.status === "completed" && (
                      <button
                        className="btn-secondary"
                        style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <Download size={11} /> 导出PDF
                      </button>
                    )}
                    <button
                      className="btn-secondary"
                      style={{ fontSize: 11 }}
                      onClick={() => setEditingWorkorder(wo)}
                    >
                      编辑
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "history" && (
        <div className="panel-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <select className="form-input" style={{ appearance: "none", width: 200, fontSize: 12 }}>
              <option>巡逻一号</option>
              <option>应急响应2号</option>
              <option>侦查小蜂</option>
            </select>
            <button className="btn-secondary" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
              <Download size={12} /> 导出履历PDF
            </button>
          </div>
          <MaintenanceTimeline events={historyEvents} />
        </div>
      )}

      {activeTab === "reminder" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { device: "农业巡检1号", days: 4, level: "red", msg: "当天保养提醒，逾期将标记带病运行" },
            { device: "应急响应2号", days: 9, level: "yellow", msg: "7日内保养到期提醒，请安排保养计划" },
            { device: "高空瞭望3号", days: 14, level: "blue", msg: "15日内保养到期提醒，建议提前预约" },
            { device: "侦查小蜂", days: -10, level: "red", msg: "⚠ 逾期10天未保养，已标记带病运行，限制新任务派单" },
          ].map((r, i) => {
            const lc = r.level === "red" ? "rgba(239,68,68,1)" : r.level === "yellow" ? "rgba(255,202,40,1)" : "rgba(41,182,246,1)";
            return (
              <div key={i} className="panel-card" style={{ padding: "14px 20px", borderLeft: `3px solid ${lc}` }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(220,228,240,1)" }}>{r.device}</span>
                      <span style={{ fontSize: 11, color: lc, fontWeight: 600 }}>
                        {r.days < 0 ? `逾期 ${Math.abs(r.days)} 天` : `还有 ${r.days} 天到期`}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(160,185,215,1)" }}>{r.msg}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      className="btn-primary-blue"
                      style={{ fontSize: 11 }}
                      onClick={() => {
                        const newId = `WO-REM-${i + 1}`;
                        const wo: WorkOrder = {
                          id: newId,
                          device: r.device,
                          type: "提醒逾期自动生成",
                          assignee: "待分配",
                          planDate: new Date().toISOString().slice(0, 10),
                          status: "pending",
                          duration: "—",
                          project: r.msg,
                        };
                        setWorkorders((prev) => [...prev, wo]);
                        setActiveTab("workorder");
                        setEditingWorkorder(wo);
                      }}
                    >
                      立即安排
                    </button>
                    <button className="btn-secondary" style={{ fontSize: 11 }}>忽略</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editingWorkorder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={(e) => e.target === e.currentTarget && setEditingWorkorder(null)}
        >
          <div
            className="panel-card"
            style={{ width: 560, maxWidth: "95%", padding: "20px 24px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(220,228,240,1)" }}>
                保养工单详情 - {editingWorkorder.device}（{editingWorkorder.id}）
              </div>
              <button className="btn-secondary" style={{ fontSize: 11, padding: "4px 10px" }} onClick={() => setEditingWorkorder(null)}>
                关闭
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label className="form-label">计划时间 *</label>
                <input
                  className="form-input"
                  type="date"
                  value={editingWorkorder.planDate}
                  onChange={(e) =>
                    setEditingWorkorder((w) => (w ? { ...w, planDate: e.target.value } : w))
                  }
                />
              </div>
              <div>
                <label className="form-label">保养项目 *</label>
                <textarea
                  className="form-input"
                  rows={2}
                  style={{ resize: "vertical" }}
                  value={editingWorkorder.project || ""}
                  onChange={(e) =>
                    setEditingWorkorder((w) => (w ? { ...w, project: e.target.value } : w))
                  }
                />
              </div>
              <div>
                <label className="form-label">执行人 *</label>
                <input
                  className="form-input"
                  value={editingWorkorder.assignee}
                  onChange={(e) =>
                    setEditingWorkorder((w) => (w ? { ...w, assignee: e.target.value } : w))
                  }
                />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
              <button className="btn-secondary" onClick={() => setEditingWorkorder(null)}>
                取消
              </button>
              <button
                className="btn-primary-blue"
                onClick={() => {
                  if (!editingWorkorder) return;
                  setWorkorders((prev) =>
                    prev.map((w) => (w.id === editingWorkorder.id ? editingWorkorder : w))
                  );
                  setEditingWorkorder(null);
                }}
              >
                保存工单
              </button>
            </div>
          </div>
        </div>
      )}

      {feedbackWorkorder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={(e) => e.target === e.currentTarget && setFeedbackWorkorder(null)}
        >
          <div
            className="panel-card"
            style={{ width: 720, maxWidth: "96%", padding: "20px 24px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(220,228,240,1)" }}>
                处置反馈 - {feedbackWorkorder.device}（{feedbackWorkorder.id}）
              </div>
              <button className="btn-secondary" style={{ fontSize: 11, padding: "4px 10px" }} onClick={() => setFeedbackWorkorder(null)}>
                关闭
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label className="form-label">处置详情 *</label>
                <textarea
                  className="form-input"
                  rows={3}
                  style={{ resize: "vertical" }}
                  placeholder="按清单逐项保养的执行情况说明"
                  value={feedbackDetail}
                  onChange={(e) => setFeedbackDetail(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">现场照片/视频</label>
                <textarea
                  className="form-input"
                  rows={2}
                  style={{ resize: "vertical" }}
                  placeholder="可记录保养前后对比图、关键步骤视频的文件名或链接"
                  value={feedbackMediaNote}
                  onChange={(e) => setFeedbackMediaNote(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">保养结果 *</label>
                <select
                  className="form-input"
                  style={{ appearance: "none" }}
                  value={feedbackResult}
                  onChange={(e) => setFeedbackResult(e.target.value)}
                >
                  <option>正常</option>
                  <option>配件更换</option>
                  <option>定损</option>
                </select>
              </div>
              <div>
                <label className="form-label">耗材使用情况</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {feedbackMaterials.map((m, idx) => (
                    <div key={idx} style={{ display: "flex", gap: 8 }}>
                      <input
                        className="form-input"
                        style={{ flex: 1 }}
                        placeholder="名称"
                        value={m.name}
                        onChange={(e) =>
                          setFeedbackMaterials((prev) =>
                            prev.map((row, i) =>
                              i === idx ? { ...row, name: e.target.value } : row
                            )
                          )
                        }
                      />
                      <input
                        className="form-input"
                        style={{ flex: 1 }}
                        placeholder="型号"
                        value={m.model}
                        onChange={(e) =>
                          setFeedbackMaterials((prev) =>
                            prev.map((row, i) =>
                              i === idx ? { ...row, model: e.target.value } : row
                            )
                          )
                        }
                      />
                      <input
                        className="form-input"
                        style={{ flex: 1 }}
                        placeholder="SN码"
                        value={m.sn}
                        onChange={(e) =>
                          setFeedbackMaterials((prev) =>
                            prev.map((row, i) =>
                              i === idx ? { ...row, sn: e.target.value } : row
                            )
                          )
                        }
                      />
                    </div>
                  ))}
                  <button
                    className="btn-secondary"
                    style={{ fontSize: 11, alignSelf: "flex-start", marginTop: 4 }}
                    onClick={() =>
                      setFeedbackMaterials((prev) => [...prev, { name: "", model: "", sn: "" }])
                    }
                  >
                    添加耗材记录
                  </button>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
              <button className="btn-secondary" onClick={() => setFeedbackWorkorder(null)}>
                取消
              </button>
              <button
                className="btn-primary-blue"
                onClick={() => {
                  if (!feedbackWorkorder) return;
                  const now = new Date();
                  const date = now.toISOString().slice(0, 10);
                  const newEvent: HistoryEvent = {
                    date,
                    type: "completed",
                    title: feedbackWorkorder.type,
                    operator: feedbackWorkorder.assignee || "未指定",
                    detail:
                      feedbackDetail ||
                      `按计划完成保养，结果：${feedbackResult}。耗材：${feedbackMaterials
                        .filter((m) => m.name || m.model || m.sn)
                        .map((m) => `${m.name}/${m.model}/${m.sn}`)
                        .join("；")}`,
                    workOrder: feedbackWorkorder.id,
                  };
                  setHistoryEvents((prev) => [newEvent, ...prev]);
                  setWorkorders((prev) =>
                    prev.map((w) =>
                      w.id === feedbackWorkorder.id ? { ...w, status: "completed" } : w
                    )
                  );
                  setFeedbackWorkorder(null);
                }}
              >
                提交反馈
              </button>
            </div>
          </div>
        </div>
      )}

      {showPlanModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={(e) => e.target === e.currentTarget && setShowPlanModal(false)}
        >
          <div
            className="panel-card"
            style={{ width: 720, maxWidth: "95%", padding: "20px 24px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(220,228,240,1)" }}>新建保养计划</div>
              <button className="btn-secondary" style={{ fontSize: 11, padding: "4px 10px" }} onClick={() => setShowPlanModal(false)}>
                关闭
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              <div style={{ width: "calc(50% - 8px)" }}>
                <label className="form-label">设备名称 *</label>
                <input
                  className="form-input"
                  value={planForm.deviceName}
                  onChange={(e) => setPlanForm((f) => ({ ...f, deviceName: e.target.value }))}
                  placeholder="如：巡逻一号"
                />
              </div>
              <div style={{ width: "calc(50% - 8px)" }}>
                <label className="form-label">设备编号 *</label>
                <input
                  className="form-input"
                  value={planForm.deviceSn}
                  onChange={(e) => setPlanForm((f) => ({ ...f, deviceSn: e.target.value }))}
                  placeholder="如：DJI-M300-2024001"
                />
              </div>
              <div style={{ width: "calc(50% - 8px)" }}>
                <label className="form-label">保养类型 *</label>
                <select
                  className="form-input"
                  style={{ appearance: "none" }}
                  value={planForm.type}
                  onChange={(e) => setPlanForm((f) => ({ ...f, type: e.target.value }))}
                >
                  <option>定期保养</option>
                  <option>大修保养</option>
                  <option>专项保养</option>
                </select>
              </div>
              <div style={{ width: "calc(50% - 8px)" }}>
                <label className="form-label">周期 *</label>
                <input
                  className="form-input"
                  value={planForm.cycle}
                  onChange={(e) => setPlanForm((f) => ({ ...f, cycle: e.target.value }))}
                  placeholder="如：季度 / 每120小时"
                />
              </div>
              <div style={{ width: "calc(50% - 8px)" }}>
                <label className="form-label">保养时间 *</label>
                <input
                  className="form-input"
                  type="date"
                  value={planForm.time}
                  onChange={(e) => setPlanForm((f) => ({ ...f, time: e.target.value }))}
                />
              </div>
              <div style={{ width: "calc(50% - 8px)" }}>
                <label className="form-label">下次保养时间</label>
                <input
                  className="form-input"
                  type="date"
                  value={planForm.nextTime}
                  onChange={(e) => setPlanForm((f) => ({ ...f, nextTime: e.target.value }))}
                />
              </div>
              <div style={{ width: "100%" }}>
                <label className="form-label">保养项目 *</label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="如：无人机电机润滑、机库传感器校准、负载镜头清洁"
                  style={{ resize: "vertical" }}
                  value={planForm.project}
                  onChange={(e) => setPlanForm((f) => ({ ...f, project: e.target.value }))}
                />
              </div>
              <div style={{ width: "100%" }}>
                <label className="form-label">保养标准</label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="如：螺丝扭矩≥5N·m；传感器零偏≤0.5%"
                  style={{ resize: "vertical" }}
                  value={planForm.standard}
                  onChange={(e) => setPlanForm((f) => ({ ...f, standard: e.target.value }))}
                />
              </div>
              <div style={{ width: "100%" }}>
                <label className="form-label">耗材清单</label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="如：更换密封圈型号XXX，更换润滑油型号YYY"
                  style={{ resize: "vertical" }}
                  value={planForm.materials}
                  onChange={(e) => setPlanForm((f) => ({ ...f, materials: e.target.value }))}
                />
              </div>
              <div style={{ width: "calc(50% - 8px)" }}>
                <label className="form-label">保养人</label>
                <input
                  className="form-input"
                  value={planForm.maintainer}
                  onChange={(e) => setPlanForm((f) => ({ ...f, maintainer: e.target.value }))}
                  placeholder="如：陈技师"
                />
              </div>
              <div style={{ width: "calc(50% - 8px)" }}>
                <label className="form-label">对接人</label>
                <input
                  className="form-input"
                  value={planForm.contact}
                  onChange={(e) => setPlanForm((f) => ({ ...f, contact: e.target.value }))}
                  placeholder="如：设备使用人"
                />
              </div>
              <div style={{ width: "100%" }}>
                <label className="form-label">保养结论</label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="如：各项指标正常 / 建议下一次更换部件时间"
                  style={{ resize: "vertical" }}
                  value={planForm.conclusion}
                  onChange={(e) => setPlanForm((f) => ({ ...f, conclusion: e.target.value }))}
                />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
              <button className="btn-secondary" onClick={() => setShowPlanModal(false)}>
                取消
              </button>
              <button
                className="btn-primary-blue"
                onClick={() => {
                  const id = `MP${String(planList.length + 1).padStart(3, "0")}`;
                  const daysLeft = 30;
                  const newPlan: Plan = {
                    id,
                    device: planForm.deviceName || "未命名设备",
                    type: planForm.type,
                    cycle: planForm.cycle || "暂未设置",
                    nextDate: planForm.time || "待定",
                    daysLeft,
                    status: "normal",
                    lastDate: "—",
                  };
                  setPlanList((prev) => [...prev, newPlan]);
                  setShowPlanModal(false);
                }}
              >
                保存计划
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;