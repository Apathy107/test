import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Upload, Download, Search, MapPin, Clock, Cpu, Eye, Trash2, CheckSquare, Pencil, Image } from "lucide-react";

export type DataSourceType = "自动化抓拍" | "半自动化抓拍" | "人工抓拍";

export interface CaptureRecord {
  id: string;
  gps: string;
  time: string;
  algo: string;
  source: DataSourceType;
  uploaded: boolean;
  type: string;
  plateNumber?: string;
  violation?: string;
  /** 证据照片占位，实际可为 URL 或 key */
  evidenceUrls?: string[];
}

const mockRecords: CaptureRecord[] = [
  { id: "ZP-001", gps: "30.2741, 120.1551", time: "2025-07-11 09:15:32", algo: "车辆识别", source: "自动化抓拍", uploaded: true,  type: "违规停车", plateNumber: "浙A·12345", violation: "违规停车" },
  { id: "ZP-002", gps: "30.2788, 120.1623", time: "2025-07-11 09:18:44", algo: "人员识别", source: "人工抓拍", uploaded: false, type: "行人违规" },
  { id: "ZP-003", gps: "30.2712, 120.1498", time: "2025-07-11 09:22:11", algo: "车辆识别", source: "自动化抓拍", uploaded: true,  type: "违规停车", plateNumber: "浙B·67890", violation: "违规停车" },
  { id: "ZP-004", gps: "30.2755, 120.1577", time: "2025-07-11 09:25:08", algo: "车辆识别", source: "半自动化抓拍", uploaded: true,  type: "闯红灯", plateNumber: "浙A·88888", violation: "闯红灯" },
  { id: "ZP-005", gps: "30.2731, 120.1540", time: "2025-07-11 09:28:53", algo: "人员识别", source: "人工抓拍", uploaded: false, type: "非法占道" },
  { id: "ZP-006", gps: "30.2769, 120.1602", time: "2025-07-11 09:31:27", algo: "烟火检测", source: "自动化抓拍", uploaded: false, type: "违法焚烧", violation: "违法焚烧" },
];

const thumbBg: Record<number, string> = {
  0: "rgba(18, 42, 88, 1)", 1: "rgba(32, 20, 52, 1)", 2: "rgba(12, 44, 32, 1)",
  3: "rgba(44, 18, 18, 1)", 4: "rgba(22, 38, 68, 1)", 5: "rgba(38, 28, 14, 1)",
};

const inputStyle: React.CSSProperties = {
  padding: "6px 9px", border: "1px solid rgba(0, 110, 170, 0.38)", borderRadius: "4px",
  fontSize: "11px", outline: "none", color: "rgba(155, 205, 245, 1)", background: "rgba(4, 16, 46, 1)",
};

const DATA_SOURCE_OPTIONS: DataSourceType[] = ["自动化抓拍", "半自动化抓拍", "人工抓拍"];

const CaptureRecords: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [uploadFilter, setUploadFilter] = useState("全部");
  const [sourceFilter, setSourceFilter] = useState<string>("全部");
  const [records, setRecords] = useState<CaptureRecord[]>(() => mockRecords);
  const [editRecord, setEditRecord] = useState<CaptureRecord | null>(null);
  const [editForm, setEditForm] = useState<CaptureRecord | null>(null);

  const goToUploadAdd = (recordId?: string) => {
    navigate("/business/traffic?tab=upload&add=1" + (recordId ? `&fromRecord=${recordId}` : ""));
  };

  const goToBatchUpload = () => {
    if (selected.length === 0) return;
    navigate("/business/traffic?tab=upload&add=1&batchRecords=" + selected.join(","));
  };

  const toggleSelect = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const filtered = records.filter((r) => {
    if (uploadFilter === "已上传") if (!r.uploaded) return false;
    if (uploadFilter === "未上传") if (r.uploaded) return false;
    if (sourceFilter !== "全部" && r.source !== sourceFilter) return false;
    return true;
  });

  const openEdit = (rec: CaptureRecord) => {
    setEditRecord(rec);
    setEditForm({ ...rec });
  };

  const saveEdit = () => {
    if (editForm) {
      setRecords((prev) => prev.map((r) => (r.id === editForm.id ? editForm : r)));
      setEditRecord(null);
      setEditForm(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "rgba(200, 232, 255, 1)", margin: 0 }}>抓拍记录管理</h2>
          <p style={{ fontSize: "11px", color: "rgba(70, 138, 200, 1)", margin: "3px 0 0" }}>共 {records.length} 条记录，已上传 {records.filter((r) => r.uploaded).length} 条</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {[{ icon: Plus, label: "新增记录", primary: true }, { icon: Upload, label: "批量导入", primary: false }, { icon: Download, label: "导出数据", primary: false }].map((btn) => {
            const Icon = btn.icon;
            return (
              <button key={btn.label} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", background: btn.primary ? "rgba(0, 110, 170, 0.55)" : "rgba(6, 22, 62, 1)", color: btn.primary ? "rgba(0, 210, 240, 1)" : "rgba(110, 172, 228, 1)", border: btn.primary ? "1px solid rgba(0, 185, 225, 0.42)" : "1px solid rgba(0, 110, 170, 0.36)", borderRadius: "4px", fontSize: "11px", cursor: "pointer", fontWeight: btn.primary ? 600 : 400 }}>
                <Icon size={12} /> {btn.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="enf-card" style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ minWidth: "260px" }}>
            <label style={{ fontSize: "10px", color: "rgba(65, 128, 190, 1)", display: "block", marginBottom: "3px" }}>时间范围</label>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <input type="date" defaultValue="2025-07-11" style={inputStyle} />
              <span style={{ color: "rgba(50, 100, 165, 1)", fontSize: "11px" }}>-</span>
              <input type="date" defaultValue="2025-07-11" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: "10px", color: "rgba(65, 128, 190, 1)", display: "block", marginBottom: "3px" }}>数据来源</label>
            <select style={inputStyle} value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
              <option value="全部">全部来源</option>
              {DATA_SOURCE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: "10px", color: "rgba(65, 128, 190, 1)", display: "block", marginBottom: "3px" }}>上传状态</label>
            <div style={{ display: "flex", gap: "5px" }}>
              {["全部", "已上传", "未上传"].map((f) => (
                <button key={f} onClick={() => setUploadFilter(f)} style={{ padding: "4px 10px", fontSize: "11px", borderRadius: "3px", cursor: "pointer", background: uploadFilter === f ? "rgba(0, 110, 170, 0.55)" : "rgba(4, 16, 46, 1)", color: uploadFilter === f ? "rgba(0, 210, 240, 1)" : "rgba(90, 155, 215, 1)", border: uploadFilter === f ? "1px solid rgba(0, 185, 225, 0.52)" : "1px solid rgba(0, 110, 170, 0.32)" }}>{f}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: "10px", color: "rgba(65, 128, 190, 1)", display: "block", marginBottom: "3px" }}>算法名称</label>
            <select style={inputStyle}><option>全部算法</option><option>车辆识别</option><option>人员识别</option></select>
          </div>
          <div style={{ flex: 1, minWidth: "160px" }}>
            <label style={{ fontSize: "10px", color: "rgba(65, 128, 190, 1)", display: "block", marginBottom: "3px" }}>搜索</label>
            <div style={{ position: "relative" }}>
              <Search size={11} style={{ position: "absolute", left: "7px", top: "50%", transform: "translateY(-50%)", color: "rgba(65, 128, 190, 1)" }} />
              <input placeholder="编号 / 违规类型..." style={{ ...inputStyle, width: "100%", paddingLeft: "24px" }} />
            </div>
          </div>
        </div>
      </div>

      {selected.length > 0 && (
        <div style={{ padding: "8px 12px", background: "rgba(0, 55, 100, 0.32)", borderRadius: "4px", border: "1px solid rgba(0, 155, 210, 0.22)", display: "flex", alignItems: "center", gap: "10px", fontSize: "12px" }}>
          <CheckSquare size={13} style={{ color: "rgba(0, 210, 240, 1)" }} />
          <span style={{ color: "rgba(0, 210, 240, 1)", fontWeight: 600 }}>已选 {selected.length} 条</span>
          <button onClick={goToBatchUpload} style={{ padding: "3px 10px", background: "rgba(0, 110, 170, 0.55)", color: "rgba(0, 210, 240, 1)", border: "1px solid rgba(0, 185, 225, 0.42)", borderRadius: "3px", fontSize: "11px", cursor: "pointer" }}>批量上传</button>
          <button style={{ padding: "3px 10px", background: "rgba(78, 8, 8, 0.42)", color: "rgba(255, 80, 80, 1)", border: "1px solid rgba(255, 60, 60, 0.32)", borderRadius: "3px", fontSize: "11px", cursor: "pointer" }}>批量删除</button>
          <button onClick={() => setSelected([])} style={{ marginLeft: "auto", padding: "3px 8px", background: "transparent", color: "rgba(65, 128, 190, 1)", border: "1px solid rgba(0, 110, 170, 0.32)", borderRadius: "3px", fontSize: "11px", cursor: "pointer" }}>取消</button>
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
        {filtered.map((rec, idx) => {
          const isSelected = selected.includes(rec.id);
          return (
            <div key={rec.id} className="enf-card" style={{ width: "calc(33.333% - 8px)", minWidth: "220px", overflow: "hidden", border: isSelected ? "1px solid rgba(0, 210, 240, 0.72)" : "1px solid rgba(0, 110, 170, 0.32)", cursor: "pointer" }}>
              <div style={{ height: "128px", background: thumbBg[idx % 6] || "rgba(18, 38, 80, 1)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "32px", opacity: 0.18 }}>{rec.source === "自动化抓拍" ? "🚗" : rec.source === "半自动化抓拍" ? "📷" : "🚶"}</span>
                <div onClick={(e) => { e.stopPropagation(); toggleSelect(rec.id); }} style={{ position: "absolute", top: "7px", left: "7px", width: "16px", height: "16px", borderRadius: "3px", background: isSelected ? "rgba(0, 180, 220, 0.92)" : "rgba(6, 22, 62, 0.82)", border: `1.5px solid ${isSelected ? "rgba(0, 210, 240, 1)" : "rgba(55, 112, 185, 0.65)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isSelected && <span style={{ color: "rgba(255, 255, 255, 1)", fontSize: "10px", lineHeight: 1 }}>✓</span>}
                </div>
                <div style={{ position: "absolute", top: "7px", right: "7px", padding: "1px 6px", background: "rgba(255, 60, 60, 0.88)", color: "rgba(255, 255, 255, 1)", borderRadius: "2px", fontSize: "9px", fontWeight: 700 }}>{rec.type}</div>
                <div style={{ position: "absolute", bottom: "7px", right: "7px", padding: "1px 6px", background: rec.uploaded ? "rgba(0, 148, 102, 0.88)" : "rgba(200, 120, 0, 0.88)", color: "rgba(255, 255, 255, 1)", borderRadius: "2px", fontSize: "9px" }}>{rec.uploaded ? "已上传" : "未上传"}</div>
              </div>
              <div style={{ padding: "9px 12px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(0, 185, 225, 1)", marginBottom: "5px", fontFamily: "monospace" }}>{rec.id}</div>
                {[{ icon: MapPin, text: `GPS：${rec.gps}` }, { icon: Clock, text: `时间：${rec.time}` }, { icon: Cpu, text: `算法：${rec.algo}` }, ...(rec.plateNumber ? [{ icon: Cpu, text: `车牌号：${rec.plateNumber}` }] : []), ...(rec.violation ? [{ icon: Cpu, text: `违法行为：${rec.violation}` }] : [])].map((info, i) => {
                  const Icon = info.icon;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "2px", fontSize: "10px", color: "rgba(80, 148, 205, 1)" }}>
                      <Icon size={10} style={{ color: "rgba(55, 112, 185, 1)", flexShrink: 0 }} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{info.text}</span>
                    </div>
                  );
                })}
                <div style={{ fontSize: "10px", color: "rgba(60, 118, 182, 1)", marginTop: "3px" }}>数据来源：<span style={{ color: "rgba(0, 210, 240, 1)", fontWeight: 500 }}>{rec.source}</span></div>
              </div>
              <div style={{ padding: "7px 12px", borderTop: "1px solid rgba(0, 88, 142, 0.22)", display: "flex", gap: "5px" }}>
                <button style={{ flex: 1, padding: "4px 0", fontSize: "10px", background: "rgba(0, 55, 100, 0.42)", color: "rgba(0, 185, 225, 1)", border: "none", borderRadius: "3px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "3px" }}><Eye size={10} /> 查看</button>
                <button onClick={() => openEdit(rec)} style={{ flex: 1, padding: "4px 0", fontSize: "10px", background: "rgba(0, 55, 40, 0.42)", color: "rgba(0, 185, 135, 1)", border: "none", borderRadius: "3px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "3px" }}><Pencil size={10} /> 编辑</button>
                <button style={{ padding: "4px 7px", fontSize: "10px", background: "rgba(78, 8, 8, 0.32)", color: "rgba(255, 80, 80, 1)", border: "none", borderRadius: "3px", cursor: "pointer" }}><Trash2 size={10} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {editRecord && editForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setEditRecord(null)}>
          <div className="enf-card" style={{ width: "90%", maxWidth: "520px", padding: "20px", maxHeight: "85vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "rgba(200, 232, 255, 1)", marginBottom: "14px" }}>抓拍记录详情（可修改）</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
              {(["id", "gps", "time", "algo", "source", "type", "plateNumber", "violation"] as const).map((key) => (
                <div key={key}>
                  <label style={{ fontSize: "10px", color: "rgba(65, 128, 190, 1)", display: "block", marginBottom: "3px" }}>{{ id: "记录编号", gps: "GPS", time: "时间", algo: "算法", source: "数据来源", type: "违法类型", plateNumber: "车牌号", violation: "违法行为" }[key]}</label>
                  {key === "source" ? (
                    <select style={inputStyle} value={editForm.source} onChange={(e) => setEditForm((f) => f ? { ...f, source: e.target.value as DataSourceType } : null)}>
                      {DATA_SOURCE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <input style={inputStyle} value={String((editForm as unknown as Record<string, string>)[key] ?? "")} onChange={(e) => setEditForm((f) => f ? { ...f, [key]: e.target.value } : null)} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "10px", color: "rgba(65, 128, 190, 1)", display: "block", marginBottom: "6px" }}>证据照片（支持替换）</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ width: "80px", height: "60px", background: "rgba(8, 28, 72, 1)", borderRadius: "4px", border: "1px solid rgba(0, 110, 170, 0.32)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <Image size={20} style={{ color: "rgba(90, 155, 215, 0.6)" }} />
                    <button type="button" style={{ position: "absolute", bottom: "2px", right: "2px", padding: "1px 4px", fontSize: "9px", background: "rgba(0, 110, 170, 0.6)", color: "rgba(0, 210, 240, 1)", border: "none", borderRadius: "2px", cursor: "pointer" }}>替换</button>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="button" onClick={saveEdit} style={{ padding: "6px 16px", background: "rgba(0, 110, 170, 0.65)", color: "rgba(0, 210, 240, 1)", border: "1px solid rgba(0, 185, 225, 0.52)", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>保存</button>
              <button type="button" onClick={() => setEditRecord(null)} style={{ padding: "6px 16px", background: "rgba(6, 22, 62, 1)", color: "rgba(110, 172, 228, 1)", border: "1px solid rgba(0, 110, 170, 0.36)", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptureRecords;
export { mockRecords as captureRecordsForUpload };
