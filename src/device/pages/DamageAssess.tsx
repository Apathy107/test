import React, { useState } from "react";
import { Plus } from "lucide-react";

type DamageRecord = {
  id: string;
  type: "整机定损" | "部件定损";
  device: string;
  sn: string;
  model: string;
  reason: string;
  time: string;
  operator: string;
};

const initialDamageRecords: DamageRecord[] = [
  { id: "DA001", type: "部件定损", device: "高空瞭望3号", sn: "DJI-M300-2023002", model: "M300 RTK", reason: "飞行中遭遇鸟击，3号电机及桨叶损坏", time: "2025-07-10", operator: "刘洋" },
  { id: "DA002", type: "整机定损", device: "农业巡检1号", sn: "XAG-P100-2023001", model: "P100", reason: "作业中因风力过大坠机，机身严重损坏", time: "2025-06-25", operator: "陈刚" },
  { id: "DA003", type: "部件定损", device: "侦查小蜂", sn: "DJI-MINI4-2024003", model: "Mini 4 Pro", reason: "降落时碰撞，图传天线断裂", time: "2025-06-01", operator: "王芳" },
];

const DamageAssess: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [records, setRecords] = useState<DamageRecord[]>(initialDamageRecords);
  const [form, setForm] = useState({
    type: "整机定损" as DamageRecord["type"],
    deviceOption: "高空瞭望3号（DJI-M300-2023002）",
    time: "",
    reason: "",
    operator: "张伟",
  });
  const [detail, setDetail] = useState<DamageRecord | null>(null);
  console.log("DamageAssess page rendered");

  const formatId = () => {
    const num = records.length + 1;
    return `DA${num.toString().padStart(3, "0")}`;
  };

  return (
    <div style={{ padding: "20px 24px", minHeight: "100%" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button
          className="btn-primary-blue"
          onClick={() => setShowForm((v) => !v)}
          style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}
        >
          <Plus size={13} /> 新建定损记录
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[
          { label: "本年定损总计", value: 6, color: "rgba(239,68,68,1)" },
          { label: "整机定损", value: 2, color: "rgba(239,68,68,1)" },
          { label: "部件定损", value: 4, color: "rgba(255,167,38,1)" },
          { label: "涉及设备数", value: 5, color: "rgba(30,136,229,1)" },
        ].map((s) => (
          <div key={s.label} className="panel-card" style={{ flex: 1, padding: "14px 16px" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "rgba(120,145,180,1)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* New form */}
      {showForm && (
        <div className="panel-card" style={{ padding: "20px 24px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(180,200,230,1)", marginBottom: 16 }}>新建定损记录</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
            <div style={{ width: "calc(33.33% - 11px)" }}>
              <label className="form-label">定损类型 *</label>
              <select
                className="form-input"
                style={{ appearance: "none" }}
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value as DamageRecord["type"] }))
                }
              >
                <option value="整机定损">整机定损</option>
                <option value="部件定损">部件定损</option>
              </select>
            </div>
            <div style={{ width: "calc(33.33% - 11px)" }}>
              <label className="form-label">选择设备 *</label>
              <select
                className="form-input"
                style={{ appearance: "none" }}
                value={form.deviceOption}
                onChange={(e) => setForm((f) => ({ ...f, deviceOption: e.target.value }))}
              >
                <option>高空瞭望3号（DJI-M300-2023002）</option>
                <option>农业巡检1号（XAG-P100-2023001）</option>
                <option>侦查小蜂（DJI-MINI4-2024003）</option>
              </select>
            </div>
            <div style={{ width: "calc(33.33% - 11px)" }}>
              <label className="form-label">定损时间 *</label>
              <input
                className="form-input"
                type="date"
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              />
            </div>
            <div style={{ width: "100%" }}>
              <label className="form-label">定损原因 *</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="描述损坏原因、过程、损坏部件详情"
                style={{ resize: "vertical" }}
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="btn-secondary" onClick={() => setShowForm(false)}>取消</button>
            <button
              className="btn-primary-blue"
              onClick={() => {
                const [deviceName, snPart] = form.deviceOption.split("（");
                const sn = snPart ? snPart.replace("）", "") : "";
                const model =
                  deviceName.includes("高空瞭望3号") ? "M300 RTK" :
                  deviceName.includes("农业巡检1号") ? "P100" :
                  "Mini 4 Pro";
                const id = formatId();
                const record: DamageRecord = {
                  id,
                  type: form.type,
                  device: deviceName,
                  sn,
                  model,
                  reason: form.reason,
                  time: form.time || new Date().toISOString().slice(0, 10),
                  operator: form.operator,
                };
                setRecords((list) => [record, ...list]);
                setShowForm(false);
                setForm({
                  type: "整机定损",
                  deviceOption: "高空瞭望3号（DJI-M300-2023002）",
                  time: "",
                  reason: "",
                  operator: form.operator,
                });
              }}
            >
              提交定损
            </button>
          </div>
        </div>
      )}

      {/* Records table */}
      <div className="panel-card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr className="table-header">
              {["定损编号", "定损类型", "设备名称", "SN序列号", "设备型号", "定损原因", "定损时间", "操作人", "操作"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", borderBottom: "1px solid rgba(30,50,80,1)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="table-row">
                <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "rgba(100,181,246,1)" }}>{r.id}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 3, background: r.type === "整机定损" ? "rgba(239,68,68,0.15)" : "rgba(255,167,38,0.15)", color: r.type === "整机定损" ? "rgba(239,83,80,1)" : "rgba(255,202,40,1)" }}>
                    {r.type}
                  </span>
                </td>
                <td style={{ padding: "10px 14px", color: "rgba(220,228,240,1)", fontWeight: 500 }}>{r.device}</td>
                <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 11, color: "rgba(120,145,180,1)" }}>{r.sn}</td>
                <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{r.model}</td>
                <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)", maxWidth: 200 }}>{r.reason}</td>
                <td style={{ padding: "10px 14px", color: "rgba(120,145,180,1)" }}>{r.time}</td>
                <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{r.operator}</td>
                <td style={{ padding: "10px 14px" }}>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: 10, padding: "3px 8px" }}
                    onClick={() => setDetail(r)}
                  >
                    详情
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
            style={{ width: 720, maxWidth: "95%", padding: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(220,228,240,1)" }}>
                  定损记录详情 · {detail.device}（{detail.id}）
                </div>
                <div style={{ fontSize: 11, color: "rgba(120,145,180,1)", marginTop: 2 }}>
                  SN：{detail.sn} · 型号：{detail.model}
                </div>
              </div>
              <button className="btn-secondary" style={{ fontSize: 11 }} onClick={() => setDetail(null)}>
                关闭
              </button>
            </div>
            <div style={{ fontSize: 12, color: "rgba(160,185,215,1)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <span>定损类型：{detail.type}</span>
              <span>操作人：{detail.operator}</span>
              <span>定损时间：{detail.time}</span>
            </div>
            <div style={{ fontSize: 12, color: "rgba(200,220,240,1)" }}>
              定损原因：{detail.reason}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DamageAssess;