import React, { useState } from "react";
import { Eye, Download, AlertTriangle, Send, Pencil, X } from "lucide-react";
import { violationCasesList, type ViolationCaseRecord, type CaseType, type DataSourceType } from "../../../data/violationCasesData";

type ViolationCase = ViolationCaseRecord;

const statusCfg = {
  submitted:   { label: "已提交", color: "rgba(0, 210, 240, 1)",  bg: "rgba(0, 50, 82, 0.85)" },
  unsubmitted: { label: "未提交", color: "rgba(255, 185, 0, 1)", bg: "rgba(58, 38, 0, 0.85)" },
};

const inputStyle: React.CSSProperties = {
  padding: "4px 8px", border: "1px solid rgba(0, 110, 170, 0.38)", borderRadius: "4px", fontSize: "11px",
  outline: "none", color: "rgba(155, 205, 245, 1)", background: "rgba(4, 16, 46, 1)",
};

function exportToExcel(rows: ViolationCase[]) {
  const headers = ["案件编号", "违法类型", "违法代码", "违法地址", "违法时间", "类型", "数据来源", "提交状态", "车牌/对象", "证据数"];
  const csv = [
    headers.join(","),
    ...rows.map((c) =>
      [c.caseNo, c.type, c.violationCode, c.location, c.time, c.caseType ?? "", c.dataSource ?? "", statusCfg[c.status].label, c.plate, c.evidence].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `违法成果_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

const ViolationResults: React.FC = () => {
  const [cases, setCases] = useState<ViolationCase[]>(() => [...violationCasesList]);
  const [selected, setSelected] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState("");
  const [filterCaseType, setFilterCaseType] = useState<CaseType | "">("");
  const [filterTimeStart, setFilterTimeStart] = useState("");
  const [filterTimeEnd, setFilterTimeEnd] = useState("");
  const [filterAddress, setFilterAddress] = useState("");
  const [photoLightbox, setPhotoLightbox] = useState<{ caseId: string; index: number } | null>(null);
  const [editCase, setEditCase] = useState<ViolationCase | null>(null);
  const [editForm, setEditForm] = useState<ViolationCase | null>(null);

  const filtered = cases.filter((c) => {
    if (filterType && c.type !== filterType) return false;
    if (filterCaseType && c.caseType !== filterCaseType) return false;
    if (filterTimeStart && c.time < filterTimeStart) return false;
    if (filterTimeEnd && c.time > filterTimeEnd) return false;
    if (filterAddress && !c.location.includes(filterAddress)) return false;
    return true;
  });

  const toggleSelectId = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const saveEdit = () => {
    if (editForm) {
      setCases((prev) => prev.map((c) => (c.id === editForm.id ? editForm : c)));
      setEditCase(null);
      setEditForm(null);
    }
  };

  return (
    <div style={{ display: "flex", gap: "14px", height: "calc(100vh - 180px)", minHeight: "480px" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px", minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "rgba(200, 232, 255, 1)", margin: 0 }}>违法成果</h2>
            <p style={{ fontSize: "11px", color: "rgba(70, 138, 200, 1)", margin: "3px 0 0" }}>共 {cases.length} 个案件，未提交 {cases.filter((c) => c.status === "unsubmitted").length} 个</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", background: "rgba(0, 110, 170, 0.55)", color: "rgba(0, 210, 240, 1)", border: "1px solid rgba(0, 185, 225, 0.42)", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}><Send size={11} /> 批量提交</button>
            <button onClick={() => selectedIds.size > 0 && exportToExcel(cases.filter((c) => selectedIds.has(c.id)))} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", background: "rgba(6, 22, 62, 1)", color: "rgba(110, 172, 228, 1)", border: "1px solid rgba(0, 110, 170, 0.36)", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}><Download size={11} /> 导出{selectedIds.size ? `(${selectedIds.size})` : ""}</button>
          </div>
        </div>

        <div className="enf-card" style={{ padding: "10px 14px" }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div>
              <label style={{ fontSize: "10px", color: "rgba(65, 128, 190, 1)", display: "block", marginBottom: "3px" }}>违法类型</label>
              <select style={inputStyle} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="">全部</option>
                {Array.from(new Set(cases.map((c) => c.type))).map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "10px", color: "rgba(65, 128, 190, 1)", display: "block", marginBottom: "3px" }}>类型</label>
              <select style={inputStyle} value={filterCaseType} onChange={(e) => setFilterCaseType((e.target.value || "") as CaseType | "")}>
                <option value="">全部</option>
                <option value="预警">预警</option>
                <option value="执法">执法</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "10px", color: "rgba(65, 128, 190, 1)", display: "block", marginBottom: "3px" }}>时间段</label>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <input type="datetime-local" style={inputStyle} value={filterTimeStart} onChange={(e) => setFilterTimeStart(e.target.value)} />
                <span style={{ color: "rgba(65, 128, 190, 1)", fontSize: "10px" }}>-</span>
                <input type="datetime-local" style={inputStyle} value={filterTimeEnd} onChange={(e) => setFilterTimeEnd(e.target.value)} />
              </div>
            </div>
            <div style={{ minWidth: "140px" }}>
              <label style={{ fontSize: "10px", color: "rgba(65, 128, 190, 1)", display: "block", marginBottom: "3px" }}>违法地址</label>
              <input style={inputStyle} placeholder="关键词" value={filterAddress} onChange={(e) => setFilterAddress(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="enf-card" style={{ flex: 1, overflow: "auto" }}>
          <div style={{ display: "flex", padding: "9px 14px", background: "rgba(4, 14, 40, 1)", fontSize: "10px", color: "rgba(65, 128, 190, 1)", fontWeight: 600, position: "sticky", top: 0 }}>
            <span style={{ width: "28px", flexShrink: 0 }} />
            <span style={{ width: "56px", flexShrink: 0 }}>缩略图</span>
            <span style={{ flex: 2 }}>案件编号</span>
            <span style={{ flex: 1 }}>违法类型</span>
            <span style={{ width: "64px", flexShrink: 0 }}>违法代码</span>
            <span style={{ flex: 2 }}>违法地址</span>
            <span style={{ flex: 1 }}>违法时间</span>
            <span style={{ flex: 1 }}>类型</span>
            <span style={{ flex: 1 }}>数据来源</span>
            <span style={{ flex: 1 }}>车牌/对象</span>
            <span style={{ flex: 1 }}>证据数</span>
            <span style={{ flex: 1 }}>提交状态</span>
            <span style={{ width: "80px" }}>操作</span>
          </div>
          {filtered.map((c, idx) => {
            const cfg = statusCfg[c.status];
            const isSelected = selected === c.id;
            const isChecked = selectedIds.has(c.id);
            return (
              <div key={c.id} onClick={() => setSelected(c.id)} style={{ display: "flex", alignItems: "center", padding: "8px 14px", borderBottom: "1px solid rgba(0, 80, 130, 0.15)", background: isSelected ? "rgba(0, 55, 100, 0.32)" : idx % 2 === 0 ? "rgba(8, 24, 60, 1)" : "rgba(6, 18, 50, 1)", cursor: "pointer", fontSize: "11px" }}>
                <div style={{ width: "28px" }} onClick={(e) => { e.stopPropagation(); toggleSelectId(c.id); }}>
                  <input type="checkbox" checked={isChecked} readOnly style={{ accentColor: "rgba(0, 210, 240, 1)" }} />
                </div>
                <div style={{ width: "56px", height: "40px", flexShrink: 0, background: "rgba(8, 28, 72, 1)", borderRadius: "4px", border: "1px solid rgba(0, 110, 170, 0.32)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {c.thumb ? <img src={c.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "18px", opacity: 0.6 }}>{c.type.includes("车") ? "🚗" : "🚶"}</span>}
                </div>
                <span style={{ flex: 2, color: "rgba(0, 185, 225, 1)", fontFamily: "monospace", fontSize: "10px" }}>{c.caseNo}</span>
                <span style={{ flex: 1, color: "rgba(255, 80, 80, 1)", fontWeight: 500 }}>{c.type}</span>
                <span style={{ width: "64px", flexShrink: 0, color: "rgba(140, 188, 228, 1)", fontFamily: "monospace" }}>{c.violationCode}</span>
                <span style={{ flex: 2, color: "rgba(155, 205, 245, 1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.location}</span>
                <span style={{ flex: 1, color: "rgba(90, 155, 215, 1)", fontFamily: "monospace" }}>{c.time}</span>
                <span style={{ flex: 1, color: "rgba(140, 188, 228, 1)" }}>{c.caseType ?? "—"}</span>
                <span style={{ flex: 1, color: "rgba(140, 188, 228, 1)" }}>{c.dataSource ?? "—"}</span>
                <span style={{ flex: 1, color: "rgba(140, 188, 228, 1)" }}>{c.plate}</span>
                <span style={{ flex: 1, fontWeight: 600 }}>{c.evidence} 张</span>
                <span style={{ flex: 1 }}><span style={{ padding: "1px 6px", background: cfg.bg, color: cfg.color, borderRadius: "2px", fontSize: "10px" }}>{cfg.label}</span></span>
                <div style={{ width: "80px", display: "flex", gap: "4px" }} onClick={(e) => e.stopPropagation()}>
                  <button style={{ padding: "2px 6px", fontSize: "10px", background: "rgba(0, 55, 100, 0.55)", color: "rgba(0, 185, 225, 1)", border: "none", borderRadius: "3px", cursor: "pointer" }}><Eye size={10} /></button>
                  {c.status === "unsubmitted" && <button onClick={() => { setEditCase(c); setEditForm({ ...c }); }} style={{ padding: "2px 6px", fontSize: "10px", background: "rgba(0, 55, 40, 0.55)", color: "rgba(0, 205, 135, 1)", border: "none", borderRadius: "3px", cursor: "pointer" }}><Pencil size={10} /></button>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ width: "300px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
        {selected ? (() => {
          const c = cases.find((x) => x.id === selected)!;
          const cfg = statusCfg[c.status];
          const detailRows: [string, string][] = [
            ["案件编号", c.caseNo], ["违法类型", c.type], ["违法代码", c.violationCode], ["违法地址", c.location],
            ["路段代码", c.sectionCode ?? "—"], ["道路代码", c.roadCode ?? "—"], ["违法时间", c.time],
            ["类型", c.caseType ?? "—"], ["行政区划", c.region ?? "—"], ["数据来源", c.dataSource ?? "—"],
            ["上传状态", c.uploadStatus ?? (c.status === "submitted" ? "已上传" : "未上传")],
          ];
          return (
            <>
              <div className="enf-card" style={{ padding: "14px" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(140, 188, 228, 1)", marginBottom: "10px" }}>案件详情</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "7px", fontSize: "11px" }}>
                  {detailRows.map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                      <span style={{ color: "rgba(65, 128, 190, 1)", flexShrink: 0 }}>{k}</span>
                      <span style={{ color: "rgba(175, 218, 248, 1)", fontWeight: 500, wordBreak: "break-all", textAlign: "right" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "8px" }}><span style={{ padding: "2px 8px", background: cfg.bg, color: cfg.color, borderRadius: "3px", fontSize: "10px", fontWeight: 600 }}>提交状态：{cfg.label}</span></div>
              </div>
              <div className="enf-card" style={{ padding: "14px" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(140, 188, 228, 1)", marginBottom: "8px" }}>违法照片（点击查看大图）</div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {Array.from({ length: c.evidence }, (_, i) => (
                    <div
                      key={i}
                      role="button"
                      tabIndex={0}
                      onClick={() => setPhotoLightbox({ caseId: c.id, index: i })}
                      style={{ width: "72px", height: "56px", background: "rgba(8, 28, 72, 1)", borderRadius: "4px", border: "1px solid rgba(0, 110, 170, 0.32)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", cursor: "pointer" }}
                    >
                      {c.type.includes("车") ? "🚗" : "🚶"}
                    </div>
                  ))}
                </div>
              </div>
              {c.status === "unsubmitted" && (
                <button onClick={() => { setEditCase(c); setEditForm({ ...c }); }} style={{ width: "100%", padding: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", background: "rgba(0, 55, 40, 0.55)", color: "rgba(0, 205, 135, 1)", border: "1px solid rgba(0, 185, 105, 0.38)", borderRadius: "4px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}><Pencil size={12} /> 编辑</button>
              )}
            </>
          );
        })() : (
          <div className="enf-card" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "28px" }}>
            <div style={{ textAlign: "center" }}>
              <AlertTriangle size={28} style={{ color: "rgba(38, 80, 148, 1)", margin: "0 auto 10px" }} />
              <p style={{ fontSize: "12px", color: "rgba(65, 128, 190, 1)" }}>点击左侧案件查看详情</p>
            </div>
          </div>
        )}
      </div>

      {photoLightbox && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 101 }} onClick={() => setPhotoLightbox(null)}>
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh", background: "rgba(8, 24, 60, 1)", border: "1px solid rgba(0, 185, 225, 0.4)", borderRadius: "8px", padding: "16px" }} onClick={(e) => e.stopPropagation()}>
            <button type="button" style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "4px", color: "#fff", cursor: "pointer", padding: "4px" }} onClick={() => setPhotoLightbox(null)}><X size={18} /></button>
            <div style={{ width: "360px", height: "270px", background: "rgba(4, 14, 40, 1)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "80px", opacity: 0.8 }}>🖼️</span>
            </div>
            <div style={{ fontSize: "12px", color: "rgba(200, 232, 255, 1)", textAlign: "center", marginTop: "8px" }}>违法成果图</div>
          </div>
        </div>
      )}

      {editCase && editForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setEditCase(null)}>
          <div className="enf-card" style={{ width: "90%", maxWidth: "480px", padding: "20px", maxHeight: "85vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "rgba(200, 232, 255, 1)", marginBottom: "14px" }}>编辑案件（未提交可修改）</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {(["caseNo", "type", "violationCode", "location", "time", "caseType", "dataSource", "plate", "sectionCode", "roadCode", "region"] as const).map((key) => (
                <div key={key}>
                  <label style={{ fontSize: "10px", color: "rgba(65, 128, 190, 1)", display: "block", marginBottom: "3px" }}>{{ caseNo: "案件编号", type: "违法类型", violationCode: "违法代码", location: "违法地址", time: "违法时间", caseType: "类型", dataSource: "数据来源", plate: "车牌/对象", sectionCode: "路段代码", roadCode: "道路代码", region: "行政区划" }[key]}</label>
                  {key === "caseType" ? (
                    <select style={inputStyle} value={editForm.caseType ?? ""} onChange={(e) => setEditForm((f) => f ? { ...f, caseType: (e.target.value || undefined) as CaseType } : null)}>
                      <option value="">—</option>
                      <option value="预警">预警</option>
                      <option value="执法">执法</option>
                    </select>
                  ) : key === "dataSource" ? (
                    <select style={inputStyle} value={editForm.dataSource ?? ""} onChange={(e) => setEditForm((f) => f ? { ...f, dataSource: (e.target.value || undefined) as DataSourceType } : null)}>
                      <option value="">—</option>
                      <option value="自动化抓拍">自动化抓拍</option>
                      <option value="半自动化抓拍">半自动化抓拍</option>
                      <option value="人工抓拍">人工抓拍</option>
                    </select>
                  ) : (
                    <input style={inputStyle} value={String((editForm as unknown as Record<string, string>)[key] ?? "")} onChange={(e) => setEditForm((f) => f ? { ...f, [key]: e.target.value } : null)} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: "14px", display: "flex", gap: "8px" }}>
              <button type="button" onClick={saveEdit} style={{ padding: "6px 16px", background: "rgba(0, 110, 170, 0.65)", color: "rgba(0, 210, 240, 1)", border: "1px solid rgba(0, 185, 225, 0.52)", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>保存</button>
              <button type="button" onClick={() => setEditCase(null)} style={{ padding: "6px 16px", background: "rgba(6, 22, 62, 1)", color: "rgba(110, 172, 228, 1)", border: "1px solid rgba(0, 110, 170, 0.36)", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViolationResults;
export { violationCasesList as violationResultsCases };
export type { ViolationCase };
