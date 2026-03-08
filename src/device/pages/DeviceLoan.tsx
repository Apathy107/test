import React, { useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import StatusBadge from "@device/components/StatusBadge";

const DeviceLoan: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"list" | "apply">("list");
  const [step, setStep] = useState(1);
  console.log("DeviceLoan page rendered");

  const initialLoans = [
    { id: "L001", device: "应急响应2号", sn: "DJI-M30T-2024002", from: "东城分局", to: "南区分局", type: "跨单位", reason: "防汛应急任务", startDate: "2025-07-10", endDate: "2025-07-20", status: "pending", applicant: "李明", handover: "含充电套装、收纳箱" },
    { id: "L002", device: "侦查小蜂", sn: "DJI-MINI4-2024003", from: "西城分局", to: "市局直属队", type: "专项任务", reason: "重大活动安保", startDate: "2025-07-05", endDate: "2025-07-08", status: "completed", applicant: "王芳", handover: "含遥控器、2组电池" },
    { id: "L003", device: "高空瞭望3号", sn: "DJI-M300-2023002", from: "南区分局", to: "东城分局", type: "单位内", reason: "日常巡逻轮换", startDate: "2025-07-01", endDate: "2025-07-31", status: "approved", applicant: "刘洋", handover: "含RTK模块" },
  ];

  const steps = ["填写申请信息", "工作交接清单", "提交审批"];

  const statusMap: Record<string, "pending" | "approved" | "completed" | "rejected"> = {
    pending: "pending", approved: "approved", completed: "completed", rejected: "rejected"
  };

  const [loanRecords, setLoanRecords] = useState(initialLoans);
  const [formStep1, setFormStep1] = useState({
    type: "单位内借用",
    device: "应急响应2号",
    targetUnit: "市局直属队",
    reason: "",
    startDate: "",
    endDate: "",
  });
  const [formHandover, setFormHandover] = useState({
    items: "",
    status: "",
    handoverPerson: "",
  });

  return (
    <div style={{ padding: "20px 24px", minHeight: "100%" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button className="btn-primary-blue" onClick={() => setActiveTab("apply")} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
          <Plus size={13} /> 发起借用申请
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(30,50,80,1)", marginBottom: 20 }}>
        {([["list", "借用记录"], ["apply", "新建申请"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{ padding: "8px 20px", background: "none", border: "none", borderBottom: activeTab === key ? "2px solid rgba(30,136,229,1)" : "2px solid transparent", color: activeTab === key ? "rgba(100,181,246,1)" : "rgba(120,145,180,1)", cursor: "pointer", fontSize: 13, fontWeight: activeTab === key ? 600 : 400, marginBottom: -1 }}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {loanRecords.map((l) => (
            <div key={l.id} className="panel-card" style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(100,181,246,1)" }}>{l.id}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(220,228,240,1)" }}>{l.device}</span>
                    <span style={{ fontSize: 11, color: "rgba(100,130,170,1)", fontFamily: "monospace" }}>{l.sn}</span>
                    <span style={{ fontSize: 11, background: "rgba(30,136,229,0.1)", color: "rgba(100,181,246,1)", padding: "1px 7px", borderRadius: 3 }}>{l.type}</span>
                    <StatusBadge status={statusMap[l.status]} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "rgba(160,185,215,1)" }}>{l.from}</span>
                    <ArrowRight size={12} color="rgba(100,181,246,1)" />
                    <span style={{ fontSize: 12, color: "rgba(100,181,246,1)", fontWeight: 500 }}>{l.to}</span>
                  </div>
                  <div style={{ display: "flex", gap: 20 }}>
                    <span style={{ fontSize: 11, color: "rgba(80,110,150,1)" }}>申请人：{l.applicant}</span>
                    <span style={{ fontSize: 11, color: "rgba(80,110,150,1)" }}>借用：{l.startDate} 至 {l.endDate}</span>
                    <span style={{ fontSize: 11, color: "rgba(80,110,150,1)" }}>原因：{l.reason}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(80,110,150,1)", marginTop: 4 }}>交接清单：{l.handover}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {l.status === "pending" && (
                    <>
                      <button className="btn-primary-blue" style={{ fontSize: 11 }} onClick={() => console.log("Approve:", l.id)}>审批通过</button>
                      <button className="btn-danger" style={{ fontSize: 11 }} onClick={() => console.log("Reject:", l.id)}>拒绝</button>
                    </>
                  )}
                  <button className="btn-secondary" style={{ fontSize: 11 }}>详情</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "apply" && (
        <div>
          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: step > i + 1 ? "rgba(76,175,80,1)" : step === i + 1 ? "rgba(30,136,229,1)" : "rgba(24,34,58,1)",
                    border: `2px solid ${step >= i + 1 ? "rgba(30,136,229,1)" : "rgba(40,58,90,1)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, color: "rgba(255,255,255,1)", fontWeight: 600,
                  }}>
                    {step > i + 1 ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: 12, color: step >= i + 1 ? "rgba(200,220,240,1)" : "rgba(80,110,150,1)" }}>{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ flex: 1, height: 1, background: step > i + 1 ? "rgba(76,175,80,0.5)" : "rgba(40,58,90,1)", margin: "0 12px" }} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="panel-card" style={{ padding: "24px" }}>
            {step === 1 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(180,200,230,1)", marginBottom: 16 }}>申请基础信息</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                  <div style={{ width: "calc(50% - 8px)" }}>
                    <label className="form-label">借用类型 *</label>
                    <select
                      className="form-input"
                      style={{ appearance: "none" }}
                      value={formStep1.type}
                      onChange={(e) => setFormStep1((f) => ({ ...f, type: e.target.value }))}
                    >
                      {["单位内借用", "跨单位借调", "专项任务调配"].map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ width: "calc(50% - 8px)" }}>
                    <label className="form-label">借用设备 *</label>
                    <select
                      className="form-input"
                      style={{ appearance: "none" }}
                      value={formStep1.device}
                      onChange={(e) => setFormStep1((f) => ({ ...f, device: e.target.value }))}
                    >
                      {["应急响应2号", "巡逻一号", "侦查小蜂"].map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ width: "calc(50% - 8px)" }}>
                    <label className="form-label">目标单位 *</label>
                    <select
                      className="form-input"
                      style={{ appearance: "none" }}
                      value={formStep1.targetUnit}
                      onChange={(e) => setFormStep1((f) => ({ ...f, targetUnit: e.target.value }))}
                    >
                      {["市局直属队", "东城分局", "西城分局"].map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ width: "calc(50% - 8px)" }}>
                    <label className="form-label">借用原因 *</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="填写借用原因"
                      value={formStep1.reason}
                      onChange={(e) => setFormStep1((f) => ({ ...f, reason: e.target.value }))}
                    />
                  </div>
                  <div style={{ width: "calc(50% - 8px)" }}>
                    <label className="form-label">借用开始日期 *</label>
                    <input
                      className="form-input"
                      type="date"
                      value={formStep1.startDate}
                      onChange={(e) => setFormStep1((f) => ({ ...f, startDate: e.target.value }))}
                    />
                  </div>
                  <div style={{ width: "calc(50% - 8px)" }}>
                    <label className="form-label">借用结束日期 *</label>
                    <input
                      className="form-input"
                      type="date"
                      value={formStep1.endDate}
                      onChange={(e) => setFormStep1((f) => ({ ...f, endDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                  <button className="btn-primary" onClick={() => setStep(2)} style={{ fontSize: 12 }}>下一步</button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(180,200,230,1)", marginBottom: 16 }}>工作交接清单</div>
                <div style={{ marginBottom: 16 }}>
                  <label className="form-label">交接物品清单 *</label>
                  <textarea
                    className="form-input"
                    rows={4}
                    placeholder="列明交接的设备配件、文件资料等，如：遥控器×1、电池×2、充电器×1、收纳箱×1"
                    style={{ resize: "vertical" }}
                    value={formHandover.items}
                    onChange={(e) => setFormHandover((f) => ({ ...f, items: e.target.value }))}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label className="form-label">设备当前状态说明</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="描述设备当前状态、已知问题等"
                    style={{ resize: "vertical" }}
                    value={formHandover.status}
                    onChange={(e) => setFormHandover((f) => ({ ...f, status: e.target.value }))}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label className="form-label">交接人</label>
                  <input
                    className="form-input"
                    placeholder="输入交接人姓名"
                    value={formHandover.handoverPerson}
                    onChange={(e) => setFormHandover((f) => ({ ...f, handoverPerson: e.target.value }))}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
                  <button className="btn-secondary" onClick={() => setStep(1)} style={{ fontSize: 12 }}>上一步</button>
                  <button className="btn-primary" onClick={() => setStep(3)} style={{ fontSize: 12 }}>下一步</button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(180,200,230,1)", marginBottom: 16 }}>确认提交</div>
                <div style={{ padding: 16, background: "rgba(18,26,44,1)", borderRadius: 5, marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: "rgba(120,145,180,1)", marginBottom: 8 }}>审批流程说明</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {["申请人提交", "原单位审核", "目标单位确认", "完成"].map((s, i) => (
                      <React.Fragment key={s}>
                        <span style={{ fontSize: 11, color: "rgba(160,185,215,1)", padding: "4px 10px", background: "rgba(30,136,229,0.1)", borderRadius: 3 }}>{s}</span>
                        {i < 3 && <ArrowRight size={12} color="rgba(80,110,150,1)" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div style={{ padding: 14, background: "rgba(255,167,38,0.06)", border: "1px solid rgba(255,167,38,0.2)", borderRadius: 4, marginBottom: 16, fontSize: 12, color: "rgba(200,180,120,1)" }}>
                  ⚠ 提交后系统将自动通知原单位负责人进行审核，审批通过后设备权属将自动更新。
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
                  <button className="btn-secondary" onClick={() => setStep(2)} style={{ fontSize: 12 }}>上一步</button>
                  <button
                    className="btn-primary-blue"
                    onClick={() => {
                      const newIdNum = loanRecords.length + 1;
                      const id = `L${String(newIdNum).padStart(3, "0")}`;
                      const newRecord = {
                        id,
                        device: formStep1.device || "未命名设备",
                        sn: "SN-NEW",
                        from: "市局直属队",
                        to: formStep1.targetUnit || "市局直属队",
                        type: formStep1.type,
                        reason: formStep1.reason || "借用申请",
                        startDate: formStep1.startDate || "待定",
                        endDate: formStep1.endDate || "待定",
                        status: "pending",
                        applicant: "当前用户",
                        handover:
                          formHandover.items ||
                          "交接清单待补充",
                      };
                      setLoanRecords((prev) => [...prev, newRecord]);
                      console.log("Submit loan application", newRecord);
                      setActiveTab("list");
                      setStep(1);
                    }}
                    style={{ fontSize: 12 }}
                  >
                    提交申请
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceLoan;