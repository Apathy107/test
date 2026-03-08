import React, { useState } from "react";
import { Plus, FileText, Archive } from "lucide-react";
import StatusBadge from "@device/components/StatusBadge";

type ScrappingStatus = "pending" | "approved" | "scrapped" | "rejected";

type ScrappingRecord = {
  id: string;
  device: string;
  sn: string;
  model: string;
  reason: string;
  value: string;
  status: ScrappingStatus;
  time: string;
  unit: string;
  disposal: string;
  flowStep: number;
  rejectReason?: string;
};

type ArchiveRecord = {
  id: string;
  name: string;
  sn: string;
  time: string;
  reason: string;
  disposal: string;
  value: string;
  unit: string;
};

const processSteps = ["责任人提交申请", "所属单位审核", "市局资产部门审批", "财务核销", "档案封存"];

const initialRecords: ScrappingRecord[] = [
  { id: "SC001", device: "旧型号巡逻机", sn: "DJI-P4-2019001", model: "Phantom 4", reason: "超龄服役（6年），技术淘汰", value: "1,200元", status: "approved", time: "2025-06-15", unit: "市局直属队", disposal: "拍卖处理", flowStep: 3 },
  { id: "SC002", device: "损毁植保机", sn: "XAG-P30-2020001", model: "P30", reason: "维修成本超重置成本60%，严重损坏", value: "800元", status: "pending", time: "2025-07-05", unit: "郊区管理站", disposal: "待确定", flowStep: 1 },
  { id: "SC003", device: "早期侦查机", sn: "DJI-M200-2018001", model: "Matrice 200", reason: "使用年限超限，已技术淘汰", value: "500元", status: "scrapped", time: "2025-01-20", unit: "东城分局", disposal: "拆解回收", flowStep: processSteps.length - 1 },
];

const initialArchive: ArchiveRecord[] = [
  { id: "SC003", name: "早期侦查机", sn: "DJI-M200-2018001", time: "2025-01-20", reason: "技术淘汰", disposal: "拆解回收", value: "500元", unit: "东城分局" },
  { id: "SC101", name: "旧型巡逻机A", sn: "DJI-P4-2018002", time: "2024-08-10", reason: "超龄服役", disposal: "拍卖", value: "2,000元", unit: "西城分局" },
  { id: "SC100", name: "损毁应急机", sn: "DJI-M210-2019001", time: "2024-03-15", reason: "坠机严重损坏", disposal: "拆解回收", value: "800元", unit: "南区分局" },
];

const statusMap: Record<ScrappingStatus, ScrappingStatus> = {
  pending: "pending",
  approved: "approved",
  scrapped: "scrapped",
  rejected: "rejected",
};

const Scrapping: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"list" | "apply" | "archive">("list");
  const [records, setRecords] = useState<ScrappingRecord[]>(initialRecords);
  const [archiveRecords, setArchiveRecords] = useState<ArchiveRecord[]>(initialArchive);
  const [applyForm, setApplyForm] = useState({
    deviceOption: "农业巡检1号（XAG-P100-2023001）",
    reasonType: "超龄服役",
    detail: "",
    value: "",
    disposal: "拍卖",
    unit: "市局直属队",
  });
  const [detail, setDetail] = useState<ScrappingRecord | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ScrappingRecord | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [archiveDetail, setArchiveDetail] = useState<ArchiveRecord | null>(null);
  console.log("Scrapping page rendered");

  const formatNow = () => {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const nextId = () => {
    const nums = records
      .map((r) => parseInt(r.id.replace("SC", ""), 10))
      .filter((n) => !Number.isNaN(n));
    const max = nums.length ? Math.max(...nums) : 0;
    return `SC${(max + 1).toString().padStart(3, "0")}`;
  };

  return (
    <div style={{ padding: "20px 24px", minHeight: "100%" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button
          className="btn-primary-blue"
          onClick={() => setActiveTab("apply")}
          style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}
        >
          <Plus size={13} /> 发起报废申请
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[
          { label: "待审批", value: records.filter((r) => r.status === "pending").length, color: "rgba(255,167,38,1)" },
          { label: "审核通过", value: records.filter((r) => r.status === "approved").length, color: "rgba(30,136,229,1)" },
          { label: "已报废入库", value: records.filter((r) => r.status === "scrapped").length, color: "rgba(120,145,180,1)" },
          { label: "历史档案", value: archiveRecords.length, color: "rgba(38,198,218,1)" },
        ].map((s) => (
          <div key={s.label} className="panel-card" style={{ flex: 1, padding: "14px 16px" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "rgba(120,145,180,1)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(30,50,80,1)", marginBottom: 16 }}>
        {([["list", "报废记录"], ["apply", "新建申请"], ["archive", "历史档案库"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setActiveTab(k)} style={{ padding: "8px 20px", background: "none", border: "none", borderBottom: activeTab === k ? "2px solid rgba(30,136,229,1)" : "2px solid transparent", color: activeTab === k ? "rgba(100,181,246,1)" : "rgba(120,145,180,1)", cursor: "pointer", fontSize: 13, fontWeight: activeTab === k ? 600 : 400, marginBottom: -1 }}>
            {l}
          </button>
        ))}
      </div>

      {/* Process flow */}
      <div className="panel-card" style={{ padding: "14px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: "rgba(120,145,180,1)", marginBottom: 10 }}>报废审批流程</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {processSteps.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: i < 4 ? "rgba(30,136,229,0.3)" : "rgba(24,34,58,1)", border: "1px solid rgba(30,136,229,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "rgba(100,181,246,1)", fontWeight: 700 }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: 11, color: "rgba(160,185,215,1)", whiteSpace: "nowrap" }}>{s}</span>
              </div>
              {i < processSteps.length - 1 && <div style={{ flex: 1, height: 1, background: "rgba(30,136,229,0.3)", minWidth: 20 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {activeTab === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {records.map((r) => (
            <div key={r.id} className="panel-card" style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(100,181,246,1)" }}>{r.id}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(220,228,240,1)" }}>{r.device}</span>
                    <StatusBadge
                      status={statusMap[r.status] || "pending"}
                      label={
                        r.status === "scrapped"
                          ? "已报废"
                          : r.status === "approved"
                          ? "已审批"
                          : r.status === "rejected"
                          ? "已驳回"
                          : "待审批"
                      }
                    />
                  </div>
                  <div style={{ display: "flex", gap: 20, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: "rgba(80,110,150,1)" }}>SN: {r.sn}</span>
                    <span style={{ fontSize: 11, color: "rgba(80,110,150,1)" }}>型号: {r.model}</span>
                    <span style={{ fontSize: 11, color: "rgba(80,110,150,1)" }}>单位: {r.unit}</span>
                    <span style={{ fontSize: 11, color: "rgba(80,110,150,1)" }}>申请日期: {r.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(160,185,215,1)", marginBottom: 4 }}>报废原因：{r.reason}</div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <span style={{ fontSize: 11, color: "rgba(80,110,150,1)" }}>
                      残值评估：<span style={{ color: "rgba(255,202,40,1)" }}>{r.value}</span>
                    </span>
                    <span style={{ fontSize: 11, color: "rgba(80,110,150,1)" }}>处置方式：{r.disposal}</span>
                    <span style={{ fontSize: 11, color: "rgba(80,110,150,1)" }}>
                      流程进度：{Math.min(r.flowStep + 1, processSteps.length)}/{processSteps.length}
                    </span>
                  </div>
                </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {r.status === "pending" && (
                      <>
                        <button
                          className="btn-primary-blue"
                          style={{ fontSize: 11 }}
                          onClick={() => {
                            setRecords((list) =>
                              list.map((item) => {
                                if (item.id !== r.id) return item;
                                const nextStep = item.flowStep + 1;
                                if (nextStep < processSteps.length - 1) {
                                  return { ...item, flowStep: nextStep };
                                }
                                const archive: ArchiveRecord = {
                                  id: item.id,
                                  name: item.device,
                                  sn: item.sn,
                                  time: formatNow(),
                                  reason: item.reason,
                                  disposal: item.disposal === "待确定" ? "拆解回收" : item.disposal,
                                  value: item.value,
                                  unit: item.unit,
                                };
                                setArchiveRecords((a) => [archive, ...a]);
                                return { ...item, flowStep: nextStep, status: "scrapped" };
                              })
                            );
                          }}
                        >
                          审批通过
                        </button>
                        <button
                          className="btn-danger"
                          style={{ fontSize: 11 }}
                          onClick={() => {
                            setRejectTarget(r);
                            setRejectReason("");
                          }}
                        >
                          退回
                        </button>
                      </>
                    )}
                    {r.status === "approved" && (
                      <button
                        className="btn-primary"
                        style={{ fontSize: 11 }}
                        onClick={() =>
                          setRecords((list) =>
                            list.map((item) =>
                              item.id === r.id
                                ? { ...item, status: "scrapped", flowStep: processSteps.length - 1 }
                                : item
                            )
                          )
                        }
                      >
                        办理处置
                      </button>
                    )}
                    <button
                      className="btn-secondary"
                      style={{ fontSize: 11 }}
                      onClick={() => setDetail(r)}
                    >
                      详情
                    </button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "apply" && (
        <div className="panel-card" style={{ padding: "24px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(180,200,230,1)", marginBottom: 20 }}>报废申请表</div>
          <div style={{ padding: 14, background: "rgba(30,136,229,0.06)", border: "1px solid rgba(30,136,229,0.2)", borderRadius: 5, marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(100,181,246,1)", marginBottom: 6 }}>报废申请条件（满足其一即可）</div>
            <div style={{ fontSize: 12, color: "rgba(160,185,215,1)", lineHeight: 2 }}>
              ① 已达到规定使用年限 &nbsp;|&nbsp;
              ② 维修成本超过重置成本50% &nbsp;|&nbsp;
              ③ 严重损坏无法修复 &nbsp;|&nbsp;
              ④ 技术淘汰无维护价值
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <div style={{ width: "calc(50% - 8px)" }}>
              <label className="form-label">报废设备 *</label>
              <select
                className="form-input"
                style={{ appearance: "none" }}
                value={applyForm.deviceOption}
                onChange={(e) => setApplyForm((f) => ({ ...f, deviceOption: e.target.value }))}
              >
                <option>农业巡检1号（XAG-P100-2023001）</option>
                <option>高空瞭望3号（DJI-M300-2023002）</option>
              </select>
            </div>
            <div style={{ width: "calc(50% - 8px)" }}>
              <label className="form-label">报废原因类型 *</label>
              <select
                className="form-input"
                style={{ appearance: "none" }}
                value={applyForm.reasonType}
                onChange={(e) => setApplyForm((f) => ({ ...f, reasonType: e.target.value }))}
              >
                <option>超龄服役</option>
                <option>维修成本过高</option>
                <option>严重损坏无法修复</option>
                <option>技术淘汰</option>
              </select>
            </div>
            <div style={{ width: "100%" }}>
              <label className="form-label">详细说明 *</label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="详细描述报废原因，附上维修历史、成本评估等"
                style={{ resize: "vertical" }}
                value={applyForm.detail}
                onChange={(e) => setApplyForm((f) => ({ ...f, detail: e.target.value }))}
              />
            </div>
            <div style={{ width: "calc(50% - 8px)" }}>
              <label className="form-label">残值预估</label>
              <input
                className="form-input"
                placeholder="如：1,200元"
                value={applyForm.value}
                onChange={(e) => setApplyForm((f) => ({ ...f, value: e.target.value }))}
              />
            </div>
            <div style={{ width: "calc(50% - 8px)" }}>
              <label className="form-label">建议处置方式</label>
              <select
                className="form-input"
                style={{ appearance: "none" }}
                value={applyForm.disposal}
                onChange={(e) => setApplyForm((f) => ({ ...f, disposal: e.target.value }))}
              >
                <option>拍卖</option>
                <option>拆解回收</option>
                <option>委托机构环保处置</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label className="form-label">上传附件（照片、维修记录、评估报告）</label>
            <div
              style={{
                height: 80,
                border: "2px dashed rgba(40,58,90,1)",
                borderRadius: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "rgba(80,110,150,1)",
                fontSize: 12,
              }}
              onClick={() => console.log("Open file picker")}
            >
              点击上传附件（支持PDF、图片）
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
            <button className="btn-secondary" onClick={() => setActiveTab("list")}>
              取消
            </button>
            <button
              className="btn-primary-blue"
              onClick={() => {
                const [deviceName, snPart] = applyForm.deviceOption.split("（");
                const sn = snPart ? snPart.replace("）", "") : "";
                const model = deviceName.includes("农业巡检1号") ? "P100" : "M300 RTK";
                const id = nextId();
                const record: ScrappingRecord = {
                  id,
                  device: deviceName,
                  sn,
                  model,
                  reason: `${applyForm.reasonType} · ${applyForm.detail}`,
                  value: applyForm.value || "—",
                  status: "pending",
                  time: formatNow(),
                  unit: applyForm.unit,
                  disposal: applyForm.disposal,
                  flowStep: 0,
                };
                setRecords((list) => [record, ...list]);
                setActiveTab("list");
              }}
            >
              提交申请
            </button>
          </div>
        </div>
      )}

      {activeTab === "archive" && (
        <div className="panel-card" style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "12px 16px", background: "rgba(30,136,229,0.06)", border: "1px solid rgba(30,136,229,0.2)", borderRadius: 5 }}>
            <Archive size={16} color="rgba(100,181,246,1)" />
            <div style={{ fontSize: 12, color: "rgba(160,185,215,1)" }}>
              历史报废档案保留期限不少于 <strong style={{ color: "rgba(100,181,246,1)" }}>10年</strong>，审计部门可申请调阅，所有档案均已加密存储。
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr className="table-header">
                {["档案编号", "设备名称", "SN序列号", "报废时间", "报废原因", "处置方式", "残值", "归档单位", "操作"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", borderBottom: "1px solid rgba(30,50,80,1)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {archiveRecords.map((r) => (
                <tr key={r.id} className="table-row">
                  <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "rgba(100,181,246,1)" }}>{r.id}</td>
                  <td style={{ padding: "10px 14px", color: "rgba(200,220,240,1)" }}>{r.name}</td>
                  <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 11, color: "rgba(120,145,180,1)" }}>{r.sn}</td>
                  <td style={{ padding: "10px 14px", color: "rgba(120,145,180,1)" }}>{r.time}</td>
                  <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{r.reason}</td>
                  <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{r.disposal}</td>
                  <td style={{ padding: "10px 14px", color: "rgba(255,202,40,1)" }}>{r.value}</td>
                  <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{r.unit}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: 10, padding: "3px 8px", display: "flex", alignItems: "center", gap: 3 }}
                      onClick={() => setArchiveDetail(r)}
                    >
                      <FileText size={10} /> 调阅
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {detail && (
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
          onClick={(e) => e.target === e.currentTarget && setDetail(null)}
        >
          <div
            className="panel-card"
            style={{ width: 780, maxWidth: "95%", padding: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(220,228,240,1)" }}>
                  报废申请详情 · {detail.device}（{detail.id}）
                </div>
                <div style={{ fontSize: 11, color: "rgba(120,145,180,1)", marginTop: 2 }}>
                  SN：{detail.sn} · 型号：{detail.model} · 单位：{detail.unit}
                </div>
              </div>
              <button className="btn-secondary" style={{ fontSize: 11 }} onClick={() => setDetail(null)}>
                关闭
              </button>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1.2 }}>
                <div className="panel-card" style={{ padding: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(180,200,230,1)", marginBottom: 8 }}>
                    报修信息
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: "rgba(160,185,215,1)" }}>
                    <div>
                      <span style={{ display: "inline-block", width: 80 }}>报废原因：</span>
                      <textarea
                        className="form-input"
                        rows={3}
                        style={{ resize: "vertical" }}
                        value={detail.reason}
                        onChange={(e) =>
                          setDetail((prev) => (prev ? { ...prev, reason: e.target.value } : prev))
                        }
                      />
                    </div>
                    <div>
                      <span style={{ display: "inline-block", width: 80 }}>处置方式：</span>
                      <select
                        className="form-input"
                        style={{ appearance: "none" }}
                        value={detail.disposal}
                        onChange={(e) =>
                          setDetail((prev) => (prev ? { ...prev, disposal: e.target.value } : prev))
                        }
                      >
                        <option>拍卖处理</option>
                        <option>拍卖</option>
                        <option>拆解回收</option>
                        <option>委托机构环保处置</option>
                        <option>待确定</option>
                      </select>
                    </div>
                    <div>
                      <span style={{ display: "inline-block", width: 80 }}>残值评估：</span>
                      <input
                        className="form-input"
                        value={detail.value}
                        onChange={(e) =>
                          setDetail((prev) => (prev ? { ...prev, value: e.target.value } : prev))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="panel-card" style={{ padding: 14, height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(180,200,230,1)", marginBottom: 8 }}>
                    流程与状态
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(160,185,215,1)", marginBottom: 8 }}>
                    当前状态：
                    {detail.status === "scrapped"
                      ? "已报废"
                      : detail.status === "approved"
                      ? "已审批"
                      : detail.status === "rejected"
                      ? "已驳回"
                      : "待审批"}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(160,185,215,1)", marginBottom: 8 }}>
                    流程进度：{Math.min(detail.flowStep + 1, processSteps.length)}/{processSteps.length}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(160,185,215,1)", marginBottom: 8 }}>
                    退回原因：{detail.rejectReason || "—"}
                  </div>
                  <div style={{ marginTop: "auto", display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <button className="btn-secondary" onClick={() => setDetail(null)}>
                      取消
                    </button>
                    <button
                      className="btn-primary-blue"
                      onClick={() => {
                        if (!detail) return;
                        setRecords((list) =>
                          list.map((item) => (item.id === detail.id ? { ...item, ...detail } : item))
                        );
                        setDetail(null);
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

      {rejectTarget && (
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
          onClick={(e) => e.target === e.currentTarget && setRejectTarget(null)}
        >
          <div
            className="panel-card"
            style={{ width: 520, maxWidth: "95%", padding: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(220,228,240,1)", marginBottom: 10 }}>
              退回原因 · {rejectTarget.device}（{rejectTarget.id}）
            </div>
            <textarea
              className="form-input"
              rows={4}
              style={{ resize: "vertical" }}
              placeholder="请输入退回原因"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
              <button className="btn-secondary" onClick={() => setRejectTarget(null)}>
                取消
              </button>
              <button
                className="btn-danger"
                onClick={() => {
                  if (!rejectTarget) return;
                  setRecords((list) =>
                    list.map((item) =>
                      item.id === rejectTarget.id
                        ? { ...item, status: "rejected", rejectReason }
                        : item
                    )
                  );
                  setRejectTarget(null);
                }}
              >
                提交
              </button>
            </div>
          </div>
        </div>
      )}

      {archiveDetail && (
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
          onClick={(e) => e.target === e.currentTarget && setArchiveDetail(null)}
        >
          <div
            className="panel-card"
            style={{ width: 720, maxWidth: "95%", padding: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(220,228,240,1)" }}>
                  报废档案调阅 · {archiveDetail.name}（{archiveDetail.id}）
                </div>
                <div style={{ fontSize: 11, color: "rgba(120,145,180,1)", marginTop: 2 }}>
                  SN：{archiveDetail.sn} · 归档单位：{archiveDetail.unit}
                </div>
              </div>
              <button className="btn-secondary" style={{ fontSize: 11 }} onClick={() => setArchiveDetail(null)}>
                关闭
              </button>
            </div>
            <div style={{ fontSize: 12, color: "rgba(160,185,215,1)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <span>报废时间：{archiveDetail.time}</span>
              <span>报废原因：{archiveDetail.reason}</span>
              <span>处置方式：{archiveDetail.disposal}</span>
              <span>残值：{archiveDetail.value}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scrapping;