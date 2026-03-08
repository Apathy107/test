import React, { useState } from "react";
import { Plus, FileText, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "@device/components/StatusBadge";
import FileUpload from "@device/components/FileUpload";

type RepairStatus = "diagnosing" | "repairing" | "completed" | "pending";

type Repair = {
  id: string;
  device: string;
  sn: string;
  fault: string;
  source: "系统告警" | "手动上报";
  reporter: string;
  time: string;
  status: RepairStatus;
  engineer: string;
  cost: string;
  faultType?: string;
  repairCause?: string;
  repairPlan?: string;
  repairHours?: string;
  repairCostParts?: string;
  repairCostLabor?: string;
  repairTechnician?: string;
  repairPartsList?: string;
  remoteReport?: string;
  remoteReportCreatedAt?: string;
};

const initialRepairs: Repair[] = [
  {
    id: "R001",
    device: "高空瞭望3号",
    sn: "DJI-M300-2023002",
    fault: "主控模块响应异常，无法正常起飞",
    source: "系统告警",
    reporter: "刘洋",
    time: "2025-07-10 14:30",
    status: "diagnosing",
    engineer: "王工程师",
    cost: "—",
  },
  {
    id: "R002",
    device: "农业巡检1号",
    sn: "XAG-P100-2023001",
    fault: "3号电机噪音异常，疑似轴承磨损",
    source: "手动上报",
    reporter: "陈刚",
    time: "2025-07-08 09:15",
    status: "repairing",
    engineer: "陈技师",
    cost: "1,200元",
  },
  {
    id: "R003",
    device: "侦查小蜂",
    sn: "DJI-MINI4-2024003",
    fault: "图传信号不稳定，720P以下断连",
    source: "手动上报",
    reporter: "王芳",
    time: "2025-07-05 16:40",
    status: "completed",
    engineer: "李工",
    cost: "380元",
  },
];

const FaultRepair: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"list" | "new" | "detail">("list");
  const [repairs, setRepairs] = useState<Repair[]>(initialRepairs);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newForm, setNewForm] = useState({
    device: "高空瞭望3号（DJI-M300-2023002）",
    faultType: "飞控/主控故障",
    faultDesc: "",
    reporter: "张伟",
    engineer: "王工程师",
  });
  const [updatingRepair, setUpdatingRepair] = useState<Repair | null>(null);
  const [updateForm, setUpdateForm] = useState({
    repairCause: "",
    repairPlan: "",
    repairHours: "",
    repairCostParts: "",
    repairCostLabor: "",
    repairTechnician: "",
    repairPartsList: "",
    status: "diagnosing" as RepairStatus,
  });
  const [detailRepair, setDetailRepair] = useState<Repair | null>(null);

  const navigate = useNavigate();
  console.log("FaultRepair page rendered");

  const statusMap: Record<RepairStatus, string> = {
    diagnosing: "待诊断",
    repairing: "维修中",
    completed: "已完成",
    pending: "待处理",
  };
  const statusColor: Record<Exclude<RepairStatus, "pending">, string> = {
    diagnosing: "rgba(255,167,38,1)",
    repairing: "rgba(30,136,229,1)",
    completed: "rgba(76,175,80,1)",
  };

  const formatNow = () => {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const remoteReportKey = (sn: string) => `remote_diagnosis_${sn}`;

  const createRepairFromForm = (form: typeof newForm) => {
    const [deviceName, snPart] = form.device.split("（");
    const sn = snPart ? snPart.replace("）", "") : "";
    const newId = `R${(repairs.length + 1).toString().padStart(3, "0")}`;
    const newRepair: Repair = {
      id: newId,
      device: deviceName,
      sn,
      fault: form.faultDesc || `${form.faultType} 故障`,
      source: "手动上报",
      reporter: form.reporter,
      time: formatNow(),
      status: "diagnosing",
      engineer: form.engineer,
      cost: "—",
      faultType: form.faultType,
    };
    setRepairs((prev) => [newRepair, ...prev]);
  };

  return (
    <div style={{ padding: "20px 24px", minHeight: "100%" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button
          className="btn-primary-blue"
          onClick={() => setShowNewModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}
        >
          <Plus size={13} /> 手动提交报修
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[
          { label: "待诊断", value: 1, color: "rgba(255,167,38,1)" },
          { label: "维修中", value: 1, color: "rgba(30,136,229,1)" },
          { label: "本月已完成", value: 3, color: "rgba(76,175,80,1)" },
          { label: "本月维修费用", value: "1,580元", color: "rgba(38,198,218,1)" },
          { label: "平均维修时长", value: "2.3天", color: "rgba(255,167,38,1)" },
        ].map((s) => (
          <div key={s.label} className="panel-card" style={{ flex: 1, padding: "14px 16px" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "rgba(120,145,180,1)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(30,50,80,1)", marginBottom: 16 }}>
        {([["list", "维修工单列表"], ["new", "新建报修单"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setActiveTab(k)} style={{ padding: "8px 20px", background: "none", border: "none", borderBottom: activeTab === k ? "2px solid rgba(30,136,229,1)" : "2px solid transparent", color: activeTab === k ? "rgba(100,181,246,1)" : "rgba(120,145,180,1)", cursor: "pointer", fontSize: 13, fontWeight: activeTab === k ? 600 : 400, marginBottom: -1 }}>
            {l}
          </button>
        ))}
      </div>

      {activeTab === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {repairs.map((r) => (
            <div key={r.id} className="panel-card" style={{ padding: "16px 20px", borderLeft: `3px solid ${statusColor[r.status]}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(100,181,246,1)" }}>{r.id}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(220,228,240,1)" }}>{r.device}</span>
                    <span style={{ fontSize: 11, padding: "1px 7px", borderRadius: 2, background: `${statusColor[r.status]}20`, color: statusColor[r.status], border: `1px solid ${statusColor[r.status]}40` }}>
                      {statusMap[r.status]}
                    </span>
                    <span style={{ fontSize: 11, background: "rgba(24,34,58,1)", color: "rgba(120,145,180,1)", padding: "1px 7px", borderRadius: 2 }}>
                      {r.source === "系统告警" ? "🤖 自动生成" : "👤 手动上报"}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(200,220,240,1)", marginBottom: 6 }}>{r.fault}</div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <span style={{ fontSize: 11, color: "rgba(80,110,150,1)" }}>上报人：{r.reporter}</span>
                    <span style={{ fontSize: 11, color: "rgba(80,110,150,1)" }}>时间：{r.time}</span>
                    <span style={{ fontSize: 11, color: "rgba(80,110,150,1)" }}>维修工程师：{r.engineer}</span>
                    <span style={{ fontSize: 11, color: "rgba(80,110,150,1)" }}>费用：{r.cost}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {r.status === "diagnosing" && (
                    <button
                      className="btn-primary-blue"
                      style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}
                      onClick={() =>
                        navigate("/device/remote-monitor", {
                          state: { from: "fault-repair", deviceName: r.device, sn: r.sn },
                        })
                      }
                    >
                      <FileText size={11} /> 远程诊断
                    </button>
                  )}
                  {r.status === "repairing" && (
                    <button
                      className="btn-primary-blue"
                      style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}
                      onClick={() => {
                        setUpdatingRepair(r);
                        setUpdateForm({
                          repairCause: r.repairCause || "",
                          repairPlan: r.repairPlan || "",
                          repairHours: r.repairHours || "",
                          repairCostParts: r.repairCostParts || "",
                          repairCostLabor: r.repairCostLabor || "",
                          repairTechnician: r.repairTechnician || r.engineer,
                          repairPartsList: r.repairPartsList || "",
                          status: r.status,
                        });
                      }}
                    >
                      <Wrench size={11} /> 更新进度
                    </button>
                  )}
                  <button
                    className="btn-secondary"
                    style={{ fontSize: 11 }}
                    onClick={() => {
                      try {
                        const key = remoteReportKey(r.sn);
                        const stored = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
                        if (stored) {
                          const parsed = JSON.parse(stored) as { report?: string };
                          setDetailRepair({ ...r, remoteReport: parsed.report || "" });
                        } else {
                          setDetailRepair(r);
                        }
                      } catch {
                        setDetailRepair(r);
                      }
                      setActiveTab("detail");
                    }}
                  >
                    详情
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "new" && (
        <div className="panel-card" style={{ padding: "24px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(180,200,230,1)", marginBottom: 20 }}>新建报修单</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
            <div style={{ width: "calc(50% - 8px)" }}>
              <label className="form-label">报修设备 *</label>
              <select
                className="form-input"
                style={{ appearance: "none" }}
                value={newForm.device}
                onChange={(e) => setNewForm((f) => ({ ...f, device: e.target.value }))}
              >
                <option>高空瞭望3号（DJI-M300-2023002）</option>
                <option>农业巡检1号（XAG-P100-2023001）</option>
              </select>
            </div>
            <div style={{ width: "calc(50% - 8px)" }}>
              <label className="form-label">故障类型</label>
              <select
                className="form-input"
                style={{ appearance: "none" }}
                value={newForm.faultType}
                onChange={(e) => setNewForm((f) => ({ ...f, faultType: e.target.value }))}
              >
                <option>飞控/主控故障</option>
                <option>电机故障</option>
                <option>图传故障</option>
                <option>电源/电池故障</option>
                <option>传感器故障</option>
                <option>其他</option>
              </select>
            </div>
            <div style={{ width: "100%" }}>
              <label className="form-label">故障描述 *</label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="详细描述故障现象、发生时间、已采取的处置措施等"
                style={{ resize: "vertical" }}
                value={newForm.faultDesc}
                onChange={(e) => setNewForm((f) => ({ ...f, faultDesc: e.target.value }))}
              />
            </div>
            <div style={{ width: "calc(50% - 8px)" }}>
              <label className="form-label">上报人</label>
              <input
                className="form-input"
                value={newForm.reporter}
                onChange={(e) => setNewForm((f) => ({ ...f, reporter: e.target.value }))}
              />
            </div>
            <div style={{ width: "calc(50% - 8px)" }}>
              <label className="form-label">分配维修工程师</label>
              <select
                className="form-input"
                style={{ appearance: "none" }}
                value={newForm.engineer}
                onChange={(e) => setNewForm((f) => ({ ...f, engineer: e.target.value }))}
              >
                <option>王工程师</option>
                <option>陈技师</option>
                <option>李工</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <FileUpload label="故障照片/视频（支持jpg、png、mp4）" files={[]} accept=".jpg,.png,.mp4" />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="btn-secondary" onClick={() => setActiveTab("list")}>取消</button>
            <button
              className="btn-primary-blue"
              onClick={() => {
                createRepairFromForm(newForm);
                setActiveTab("list");
              }}
            >
              提交报修单
            </button>
          </div>
        </div>
      )}

      {showNewModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 60,
          }}
          onClick={(e) => e.target === e.currentTarget && setShowNewModal(false)}
        >
          <div
            className="panel-card"
            style={{ width: 720, maxWidth: "95%", padding: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(220,228,240,1)" }}>手动提交报修</div>
              <button className="btn-secondary" style={{ fontSize: 11 }} onClick={() => setShowNewModal(false)}>
                关闭
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
              <div style={{ width: "calc(50% - 8px)" }}>
                <label className="form-label">报修设备 *</label>
                <select
                  className="form-input"
                  style={{ appearance: "none" }}
                  value={newForm.device}
                  onChange={(e) => setNewForm((f) => ({ ...f, device: e.target.value }))}
                >
                  <option>高空瞭望3号（DJI-M300-2023002）</option>
                  <option>农业巡检1号（XAG-P100-2023001）</option>
                  <option>侦查小蜂（DJI-MINI4-2024003）</option>
                </select>
              </div>
              <div style={{ width: "calc(50% - 8px)" }}>
                <label className="form-label">故障类型</label>
                <select
                  className="form-input"
                  style={{ appearance: "none" }}
                  value={newForm.faultType}
                  onChange={(e) => setNewForm((f) => ({ ...f, faultType: e.target.value }))}
                >
                  <option>飞控/主控故障</option>
                  <option>电机故障</option>
                  <option>图传故障</option>
                  <option>电源/电池故障</option>
                  <option>传感器故障</option>
                  <option>其他</option>
                </select>
              </div>
              <div style={{ width: "100%" }}>
                <label className="form-label">故障描述 *</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="详细描述故障现象、发生时间、已采取的处置措施等"
                  style={{ resize: "vertical" }}
                  value={newForm.faultDesc}
                  onChange={(e) => setNewForm((f) => ({ ...f, faultDesc: e.target.value }))}
                />
              </div>
              <div style={{ width: "calc(50% - 8px)" }}>
                <label className="form-label">上报人</label>
                <input
                  className="form-input"
                  value={newForm.reporter}
                  onChange={(e) => setNewForm((f) => ({ ...f, reporter: e.target.value }))}
                />
              </div>
              <div style={{ width: "calc(50% - 8px)" }}>
                <label className="form-label">分配维修工程师</label>
                <select
                  className="form-input"
                  style={{ appearance: "none" }}
                  value={newForm.engineer}
                  onChange={(e) => setNewForm((f) => ({ ...f, engineer: e.target.value }))}
                >
                  <option>王工程师</option>
                  <option>陈技师</option>
                  <option>李工</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <FileUpload label="故障照片/视频（支持jpg、png、mp4）" files={[]} accept=".jpg,.png,.mp4" />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn-secondary" onClick={() => setShowNewModal(false)}>
                取消
              </button>
              <button
                className="btn-primary-blue"
                onClick={() => {
                  createRepairFromForm(newForm);
                  setShowNewModal(false);
                }}
              >
                提交报修单
              </button>
            </div>
          </div>
        </div>
      )}

      {updatingRepair && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 60,
          }}
          onClick={(e) => e.target === e.currentTarget && setUpdatingRepair(null)}
        >
          <div
            className="panel-card"
            style={{ width: 780, maxWidth: "95%", padding: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(220,228,240,1)" }}>
                更新维修进度 · {updatingRepair.device}（{updatingRepair.id}）
              </div>
              <button className="btn-secondary" style={{ fontSize: 11 }} onClick={() => setUpdatingRepair(null)}>
                关闭
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
              <div style={{ width: "100%" }}>
                <label className="form-label">故障原因</label>
                <input
                  className="form-input"
                  placeholder="如：电机轴承磨损"
                  value={updateForm.repairCause}
                  onChange={(e) => setUpdateForm((f) => ({ ...f, repairCause: e.target.value }))}
                />
              </div>
              <div style={{ width: "100%" }}>
                <label className="form-label">维修方案</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="如：更换轴承型号XXX，并重新校准电机"
                  style={{ resize: "vertical" }}
                  value={updateForm.repairPlan}
                  onChange={(e) => setUpdateForm((f) => ({ ...f, repairPlan: e.target.value }))}
                />
              </div>
              <div style={{ width: "calc(33.33% - 10px)" }}>
                <label className="form-label">维修耗时（h）</label>
                <input
                  className="form-input"
                  value={updateForm.repairHours}
                  onChange={(e) => setUpdateForm((f) => ({ ...f, repairHours: e.target.value }))}
                />
              </div>
              <div style={{ width: "calc(33.33% - 10px)" }}>
                <label className="form-label">配件费用（元）</label>
                <input
                  className="form-input"
                  value={updateForm.repairCostParts}
                  onChange={(e) => setUpdateForm((f) => ({ ...f, repairCostParts: e.target.value }))}
                />
              </div>
              <div style={{ width: "calc(33.33% - 10px)" }}>
                <label className="form-label">人工费用（元）</label>
                <input
                  className="form-input"
                  value={updateForm.repairCostLabor}
                  onChange={(e) => setUpdateForm((f) => ({ ...f, repairCostLabor: e.target.value }))}
                />
              </div>
              <div style={{ width: "calc(33.33% - 10px)" }}>
                <label className="form-label">维修员</label>
                <input
                  className="form-input"
                  value={updateForm.repairTechnician}
                  onChange={(e) => setUpdateForm((f) => ({ ...f, repairTechnician: e.target.value }))}
                />
              </div>
              <div style={{ width: "calc(33.33% - 10px)" }}>
                <label className="form-label">维修状态</label>
                <select
                  className="form-input"
                  style={{ appearance: "none" }}
                  value={updateForm.status}
                  onChange={(e) => setUpdateForm((f) => ({ ...f, status: e.target.value as RepairStatus }))}
                >
                  <option value="diagnosing">待诊断</option>
                  <option value="repairing">维修中</option>
                  <option value="completed">已完成</option>
                </select>
              </div>
              <div style={{ width: "100%" }}>
                <label className="form-label">更换配件清单</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="如：电机×1，轴承×2，桨叶×2，序列号等"
                  style={{ resize: "vertical" }}
                  value={updateForm.repairPartsList}
                  onChange={(e) => setUpdateForm((f) => ({ ...f, repairPartsList: e.target.value }))}
                />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="btn-secondary" onClick={() => setUpdatingRepair(null)}>
                取消
              </button>
              <button
                className="btn-primary-blue"
                onClick={() => {
                  setRepairs((list) =>
                    list.map((item) => {
                      if (item.id !== updatingRepair.id) return item;
                      const parts = parseFloat(updateForm.repairCostParts || "0") || 0;
                      const labor = parseFloat(updateForm.repairCostLabor || "0") || 0;
                      const total = parts + labor;
                      return {
                        ...item,
                        repairCause: updateForm.repairCause,
                        repairPlan: updateForm.repairPlan,
                        repairHours: updateForm.repairHours,
                        repairCostParts: updateForm.repairCostParts,
                        repairCostLabor: updateForm.repairCostLabor,
                        repairTechnician: updateForm.repairTechnician,
                        repairPartsList: updateForm.repairPartsList,
                        status: updateForm.status,
                        engineer: updateForm.repairTechnician || item.engineer,
                        cost: total > 0 ? `${total.toLocaleString()}元` : item.cost,
                      };
                    })
                  );
                  setUpdatingRepair(null);
                }}
              >
                提交
              </button>
            </div>
          </div>
        </div>
      )}

      {detailRepair && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 60,
          }}
          onClick={(e) => e.target === e.currentTarget && setDetailRepair(null)}
        >
          <div
            className="panel-card"
            style={{ width: 860, maxWidth: "96%", padding: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(220,228,240,1)" }}>
                  维修工单详情 · {detailRepair.device}（{detailRepair.id}）
                </div>
                <div style={{ fontSize: 11, color: "rgba(120,145,180,1)", marginTop: 2 }}>
                  设备编号：{detailRepair.sn} · 当前状态：{statusMap[detailRepair.status]}
                </div>
              </div>
              <button className="btn-secondary" style={{ fontSize: 11 }} onClick={() => setDetailRepair(null)}>
                关闭
              </button>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1.2, display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="panel-card" style={{ padding: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(180,200,230,1)", marginBottom: 8 }}>报修信息</div>
                  <div style={{ fontSize: 12, color: "rgba(160,185,215,1)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <span>报修设备：{detailRepair.device}</span>
                    <span>来源：{detailRepair.source === "系统告警" ? "系统告警" : "手动上报"}</span>
                    <span>上报人：{detailRepair.reporter}</span>
                    <span>上报时间：{detailRepair.time}</span>
                    <span>分配工程师：{detailRepair.engineer}</span>
                    <span>预计费用：{detailRepair.cost}</span>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 12, color: "rgba(200,220,240,1)" }}>故障描述：{detailRepair.fault}</div>
                </div>
                <div className="panel-card" style={{ padding: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(180,200,230,1)", marginBottom: 8 }}>远程诊断报告（初判）</div>
                  <div style={{ fontSize: 12, color: "rgba(160,185,215,1)", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div>
                      <span style={{ display: "inline-block", width: 90 }}>初步判断：</span>
                      <textarea
                        className="form-input"
                        rows={3}
                        style={{ resize: "vertical" }}
                        placeholder="结合远程运维告警信息，填写初步故障判断"
                        value={detailRepair.remoteReport || ""}
                        onChange={(e) =>
                          setDetailRepair((prev) => (prev ? { ...prev, remoteReport: e.target.value } : prev))
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="panel-card" style={{ padding: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(180,200,230,1)", marginBottom: 8 }}>维修信息</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: "rgba(160,185,215,1)" }}>
                    <div>
                      <span style={{ display: "inline-block", width: 80 }}>故障原因：</span>
                      <input
                        className="form-input"
                        value={detailRepair.repairCause || ""}
                        onChange={(e) =>
                          setDetailRepair((prev) => (prev ? { ...prev, repairCause: e.target.value } : prev))
                        }
                      />
                    </div>
                    <div>
                      <span style={{ display: "inline-block", width: 80 }}>维修方案：</span>
                      <textarea
                        className="form-input"
                        rows={3}
                        style={{ resize: "vertical" }}
                        value={detailRepair.repairPlan || ""}
                        onChange={(e) =>
                          setDetailRepair((prev) => (prev ? { ...prev, repairPlan: e.target.value } : prev))
                        }
                      />
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ display: "inline-block", width: 80 }}>耗时（h）：</span>
                        <input
                          className="form-input"
                          value={detailRepair.repairHours || ""}
                          onChange={(e) =>
                            setDetailRepair((prev) => (prev ? { ...prev, repairHours: e.target.value } : prev))
                          }
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ display: "inline-block", width: 80 }}>维修员：</span>
                        <input
                          className="form-input"
                          value={detailRepair.repairTechnician || detailRepair.engineer}
                          onChange={(e) =>
                            setDetailRepair((prev) =>
                              prev ? { ...prev, repairTechnician: e.target.value, engineer: e.target.value } : prev
                            )
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <span style={{ display: "inline-block", width: 80 }}>更换配件：</span>
                      <textarea
                        className="form-input"
                        rows={2}
                        style={{ resize: "vertical" }}
                        value={detailRepair.repairPartsList || ""}
                        onChange={(e) =>
                          setDetailRepair((prev) => (prev ? { ...prev, repairPartsList: e.target.value } : prev))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="panel-card" style={{ padding: 14, height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(180,200,230,1)", marginBottom: 8 }}>状态与费用</div>
                  <div style={{ fontSize: 12, color: "rgba(160,185,215,1)", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div>
                      <span style={{ display: "inline-block", width: 80 }}>维修状态：</span>
                      <select
                        className="form-input"
                        style={{ appearance: "none" }}
                        value={detailRepair.status}
                        onChange={(e) =>
                          setDetailRepair((prev) =>
                            prev ? { ...prev, status: e.target.value as RepairStatus } : prev
                          )
                        }
                      >
                        <option value="diagnosing">待诊断</option>
                        <option value="repairing">维修中</option>
                        <option value="completed">已完成</option>
                      </select>
                    </div>
                    <div>
                      <span style={{ display: "inline-block", width: 80 }}>配件费用：</span>
                      <input
                        className="form-input"
                        value={detailRepair.repairCostParts || ""}
                        onChange={(e) =>
                          setDetailRepair((prev) => (prev ? { ...prev, repairCostParts: e.target.value } : prev))
                        }
                      />
                    </div>
                    <div>
                      <span style={{ display: "inline-block", width: 80 }}>人工费用：</span>
                      <input
                        className="form-input"
                        value={detailRepair.repairCostLabor || ""}
                        onChange={(e) =>
                          setDetailRepair((prev) => (prev ? { ...prev, repairCostLabor: e.target.value } : prev))
                        }
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: "auto", display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <button className="btn-secondary" onClick={() => setDetailRepair(null)}>
                      取消
                    </button>
                    <button
                      className="btn-primary-blue"
                      onClick={() => {
                        if (!detailRepair) return;
                        const parts = parseFloat(detailRepair.repairCostParts || "0") || 0;
                        const labor = parseFloat(detailRepair.repairCostLabor || "0") || 0;
                        const total = parts + labor;
                        setRepairs((list) =>
                          list.map((item) =>
                            item.id === detailRepair.id
                              ? {
                                  ...item,
                                  ...detailRepair,
                                  cost: total > 0 ? `${total.toLocaleString()}元` : item.cost,
                                }
                              : item
                          )
                        );
                        setDetailRepair(null);
                        setActiveTab("list");
                      }}
                    >
                      保存
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaultRepair;