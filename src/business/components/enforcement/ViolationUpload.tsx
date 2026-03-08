import React, { useState, useRef, useEffect } from "react";
import { CheckCircle, XCircle, Clock, RefreshCw, FileText, FolderOpen, Database, Plus, Save, Pencil, X } from "lucide-react";

export interface UploadItem {
  id: string;
  name: string;
  type: string;
  size: string;
  status: "pending" | "uploading" | "success" | "failed";
  progress: number;
  time: string;
  /** 可编辑的完整记录（未上传时支持二次编辑） */
  record?: ViolationRecord;
}

export interface ViolationRecord {
  address: string;
  violation: string;
  violationType: string;
  roadCode: string;
  sectionCode: string;
  laneNo: string;
  plateNumber: string;
  violationTime: string;
  region?: string;
}

const INITIAL_QUEUE: UploadItem[] = [
  { id: "U001", name: "ZP-001_违规停车_20250711091532.jpg", type: "违规停车", size: "2.4 MB", status: "success", progress: 100, time: "09:16:05" },
  { id: "U002", name: "ZP-003_违规停车_20250711092211.jpg", type: "违规停车", size: "2.1 MB", status: "success", progress: 100, time: "09:23:40" },
  { id: "U003", name: "ZP-004_闯红灯_20250711092508.jpg", type: "闯红灯", size: "3.2 MB", status: "success", progress: 100, time: "09:26:15" },
  { id: "U004", name: "ZP-002_行人违规_20250711091844.jpg", type: "行人违规", size: "1.8 MB", status: "uploading", progress: 65, time: "09:32:00" },
  { id: "U005", name: "ZP-005_非法占道_20250711092853.jpg", type: "非法占道", size: "2.6 MB", status: "pending", progress: 0, time: "—" },
  { id: "U006", name: "ZP-006_违法焚烧_20250711093127.jpg", type: "违法焚烧", size: "2.9 MB", status: "failed", progress: 30, time: "09:33:12" },
];

/** 抓拍记录（与抓拍记录页一致，用于“从抓拍记录中选择”），含缩略图占位 */
const MOCK_CAPTURE_RECORDS: { id: string; gps: string; time: string; algo: string; type: string; plateNumber: string; source: string; thumb?: string }[] = [
  { id: "ZP-001", gps: "30.2741, 120.1551", time: "2025-07-11 09:15:32", algo: "车辆识别", type: "违规停车", plateNumber: "浙A·12345", source: "自动化抓拍" },
  { id: "ZP-002", gps: "30.2788, 120.1623", time: "2025-07-11 09:18:44", algo: "人员识别", type: "行人违规", plateNumber: "", source: "人工抓拍" },
  { id: "ZP-003", gps: "30.2712, 120.1498", time: "2025-07-11 09:22:11", algo: "车辆识别", type: "违规停车", plateNumber: "浙B·67890", source: "自动化抓拍" },
  { id: "ZP-004", gps: "30.2755, 120.1577", time: "2025-07-11 09:25:08", algo: "车辆识别", type: "闯红灯", plateNumber: "浙A·88888", source: "半自动化抓拍" },
  { id: "ZP-005", gps: "30.2731, 120.1540", time: "2025-07-11 09:28:53", algo: "人员识别", type: "非法占道", plateNumber: "", source: "人工抓拍" },
  { id: "ZP-006", gps: "30.2769, 120.1602", time: "2025-07-11 09:31:27", algo: "烟火检测", type: "违法焚烧", plateNumber: "", source: "自动化抓拍" },
];

/** 第三方数据源模拟接口（含缩略图占位） */
async function fetchThirdPartyList(): Promise<{ id: string; name: string; type: string; time: string; thumb?: string }[]> {
  await new Promise((r) => setTimeout(r, 400));
  return [
    { id: "TP-001", name: "第三方_违停_001", type: "违规停车", time: "2025-07-11 08:12:00" },
    { id: "TP-002", name: "第三方_闯红灯_002", type: "闯红灯", time: "2025-07-11 08:35:00" },
  ];
}

const statusCfg = {
  success:  { label: "上传成功", color: "rgba(0, 205, 135, 1)",  bg: "rgba(0, 58, 40, 0.55)",  icon: CheckCircle },
  uploading:{ label: "上传中",   color: "rgba(0, 210, 240, 1)",  bg: "rgba(0, 55, 100, 0.55)", icon: RefreshCw },
  pending:  { label: "等待上传", color: "rgba(90, 158, 215, 1)", bg: "rgba(8, 28, 72, 0.85)",  icon: Clock },
  failed:   { label: "上传失败", color: "rgba(255, 80, 80, 1)",  bg: "rgba(78, 8, 8, 0.55)",   icon: XCircle },
};

const VIOLATION_TYPES = ["违规停车", "闯红灯", "行人违规", "非法占道", "违法焚烧", "其他"];

const inputStyle: React.CSSProperties = {
  padding: "6px 9px",
  border: "1px solid rgba(0, 110, 170, 0.38)",
  borderRadius: "4px",
  fontSize: "11px",
  outline: "none",
  color: "rgba(155, 205, 245, 1)",
  background: "rgba(4, 16, 46, 1)",
  width: "100%",
};

const emptyRecord: ViolationRecord = {
  address: "", violation: "", violationType: "", roadCode: "", sectionCode: "", laneNo: "", plateNumber: "", violationTime: "", region: "",
};

interface ViolationUploadProps {
  mode?: "queue" | "add";
  onModeChange?: (mode: "queue" | "add") => void;
  /** 从抓拍记录批量上传时传入的选中记录 ID 列表 */
  initialBatchRecordIds?: string[];
}

const ViolationUpload: React.FC<ViolationUploadProps> = ({ mode = "queue", onModeChange, initialBatchRecordIds }) => {
  const [queueItems, setQueueItems] = useState<UploadItem[]>(() => INITIAL_QUEUE);
  const [savedRecords, setSavedRecords] = useState<(ViolationRecord & { id: string; createdAt: string })[]>([]);
  const [addForm, setAddForm] = useState<ViolationRecord & { region?: string }>({ ...emptyRecord, region: "" });
  const [dataSource, setDataSource] = useState<"capture" | "local" | "third" | null>(null);
  const [selectedCaptureIds, setSelectedCaptureIds] = useState<Set<string>>(new Set());
  const [thirdList, setThirdList] = useState<{ id: string; name: string; type: string; time: string; thumb?: string }[]>([]);
  const [thirdLoading, setThirdLoading] = useState(false);
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ViolationRecord & { region?: string }>({ ...emptyRecord, region: "" });
  const [lightbox, setLightbox] = useState<{ type: "capture" | "third"; id: string; label: string } | null>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialBatchRecordIds && initialBatchRecordIds.length > 0) {
      setDataSource("capture");
      setSelectedCaptureIds(new Set(initialBatchRecordIds));
    }
  }, [initialBatchRecordIds]);

  const successCount = queueItems.filter((u) => u.status === "success").length;
  const failedCount = queueItems.filter((u) => u.status === "failed").length;
  const pendingCount = queueItems.filter((u) => u.status === "pending").length;
  const isAdd = mode === "add";

  const handleSelectDataSource = (key: "capture" | "local" | "third") => {
    setDataSource(key);
    setSelectedCaptureIds(new Set());
    setLocalFiles([]);
    if (key === "third") {
      setThirdLoading(true);
      fetchThirdPartyList().then((list) => {
        setThirdList(list);
        setThirdLoading(false);
      });
    }
    if (key === "local" && folderInputRef.current) folderInputRef.current.click();
  };

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setLocalFiles(files);
    e.target.value = "";
  };

  const toggleCaptureSelect = (id: string) => {
    setSelectedCaptureIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const addToQueue = (record: ViolationRecord & { region?: string }, namePrefix: string) => {
    const id = `Q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const type = record.violationType || record.violation || "其他";
    setQueueItems((prev) => [
      ...prev,
      {
        id,
        name: `${namePrefix}_${type}_${(record.violationTime || "").replace(/[-: ]/g, "") || "noday"}.jpg`,
        type,
        size: "—",
        status: "pending",
        progress: 0,
        time: "—",
        record: { ...record, region: record.region },
      },
    ]);
  };

  const handleSubmit = () => {
    const r = { ...addForm, region: addForm.region ?? "" };
    if (dataSource === "capture" && selectedCaptureIds.size > 0) {
      selectedCaptureIds.forEach((cid) => {
        const rec = MOCK_CAPTURE_RECORDS.find((x) => x.id === cid);
        addToQueue(
          { ...r, plateNumber: r.plateNumber || rec?.plateNumber || "", violation: r.violation || rec?.type || "" },
          rec?.id || cid
        );
      });
    } else if (dataSource === "local" && localFiles.length > 0) {
      localFiles.forEach((f, i) => {
        addToQueue(r, `LOCAL-${i + 1}`);
      });
    } else if (dataSource === "third" && thirdList.length > 0) {
      thirdList.forEach((t) => addToQueue({ ...r, violationType: t.type }, t.id));
    } else {
      addToQueue(r, "NEW");
    }
    setAddForm({ ...emptyRecord, region: "" });
    setSelectedCaptureIds(new Set());
    setLocalFiles([]);
    onModeChange?.("queue");
  };

  const handleSaveTemp = () => {
    const r = addForm;
    setSavedRecords((prev) => [...prev, { ...r, id: `S-${Date.now()}`, createdAt: new Date().toISOString().slice(0, 19).replace("T", " ") }]);
    setAddForm({ ...emptyRecord, region: "" });
  };

  const handleEditQueueItem = (item: UploadItem) => {
    setEditingItemId(item.id);
    setEditForm({ ...(item.record || emptyRecord), region: item.record?.region ?? "" });
  };

  const handleSaveEdit = () => {
    if (!editingItemId) return;
    setQueueItems((prev) =>
      prev.map((it) =>
        it.id === editingItemId ? { ...it, type: editForm.violationType || it.type, name: it.name.replace(/_[^_]+\.jpg$/, `_${editForm.violationType || it.type}.jpg`), record: { ...editForm, region: editForm.region } } : it
      )
    );
    setEditingItemId(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "rgba(200, 232, 255, 1)", margin: 0 }}>违法上传</h2>
          <p style={{ fontSize: "11px", color: "rgba(70, 138, 200, 1)", margin: "3px 0 0" }}>将抓拍记录上传至执法平台系统，支持批量操作与新增违法记录</p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => onModeChange?.("queue")}
            style={{
              padding: "6px 14px", fontSize: "12px", borderRadius: "4px", cursor: "pointer", whiteSpace: "nowrap",
              background: !isAdd ? "rgba(0, 110, 170, 0.55)" : "rgba(6, 22, 62, 1)",
              color: !isAdd ? "rgba(0, 210, 240, 1)" : "rgba(110, 172, 228, 1)",
              border: !isAdd ? "1px solid rgba(0, 185, 225, 0.42)" : "1px solid rgba(0, 110, 170, 0.36)",
              fontWeight: !isAdd ? 600 : 400,
            }}
          >
            上传队列
          </button>
          <button
            type="button"
            onClick={() => onModeChange?.("add")}
            style={{
              padding: "6px 14px", fontSize: "12px", borderRadius: "4px", cursor: "pointer", whiteSpace: "nowrap", minWidth: "120px",
              background: isAdd ? "rgba(0, 110, 170, 0.55)" : "rgba(6, 22, 62, 1)",
              color: isAdd ? "rgba(0, 210, 240, 1)" : "rgba(110, 172, 228, 1)",
              border: isAdd ? "1px solid rgba(0, 185, 225, 0.42)" : "1px solid rgba(0, 110, 170, 0.36)",
              fontWeight: isAdd ? 600 : 400,
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "4px",
            }}
          >
            <Plus size={14} />
            新增违法记录
          </button>
        </div>
      </div>

      {isAdd ? (
        <>
          <div className="enf-card" style={{ padding: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(140, 188, 228, 1)", marginBottom: "12px" }}>违法上传数据来源</div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {[
                { key: "capture" as const, label: "从抓拍记录中选择", icon: FileText },
                { key: "local" as const, label: "本地文件夹选择", icon: FolderOpen },
                { key: "third" as const, label: "从第三方数据源中选择", icon: Database },
              ].map((opt) => {
                const Icon = opt.icon;
                const active = dataSource === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectDataSource(opt.key)}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px", padding: "12px 18px",
                      background: active ? "rgba(0, 110, 170, 0.45)" : "rgba(6, 22, 62, 1)",
                      color: active ? "rgba(0, 210, 240, 1)" : "rgba(110, 172, 228, 1)",
                      border: active ? "1px solid rgba(0, 185, 225, 0.52)" : "1px solid rgba(0, 110, 170, 0.32)",
                      borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: active ? 600 : 400,
                    }}
                  >
                    <Icon size={16} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <input ref={folderInputRef} type="file" style={{ display: "none" }} {...({ webkitdirectory: "", directory: "", multiple: true } as any)} onChange={handleLocalFileChange} />
          </div>

          {dataSource === "capture" && (
            <div className="enf-card" style={{ padding: "14px" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(140, 188, 228, 1)", marginBottom: "10px" }}>抓拍记录列表（可多选，点击缩略图查看大图）</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {MOCK_CAPTURE_RECORDS.map((rec) => {
                  const checked = selectedCaptureIds.has(rec.id);
                  return (
                    <div
                      key={rec.id}
                      style={{
                        width: "calc(25% - 10px)", minWidth: "200px", padding: "10px", background: checked ? "rgba(0, 55, 100, 0.35)" : "rgba(6, 22, 52, 1)",
                        border: `1px solid ${checked ? "rgba(0, 185, 225, 0.5)" : "rgba(0, 110, 170, 0.28)"}`,
                        borderRadius: "6px", fontSize: "11px", display: "flex", gap: "10px", alignItems: "flex-start",
                      }}
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); setLightbox({ type: "capture", id: rec.id, label: `${rec.id} ${rec.type}` }); }}
                        style={{ width: "72px", height: "54px", flexShrink: 0, background: "rgba(8, 28, 72, 1)", borderRadius: "4px", border: "1px solid rgba(0, 110, 170, 0.32)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden" }}
                      >
                        {rec.thumb ? <img src={rec.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "24px", opacity: 0.7 }}>{rec.type.includes("车") ? "🚗" : "🚶"}</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }} onClick={() => toggleCaptureSelect(rec.id)}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", cursor: "pointer" }}>
                          <input type="checkbox" checked={checked} readOnly style={{ accentColor: "rgba(0, 210, 240, 1)" }} />
                          <span style={{ color: "rgba(0, 185, 225, 1)", fontWeight: 600 }}>{rec.id}</span>
                        </div>
                        <div style={{ color: "rgba(140, 188, 228, 1)" }}>{rec.type} · {rec.time}</div>
                        {rec.plateNumber && <div style={{ color: "rgba(90, 155, 215, 1)", fontSize: "10px" }}>车牌 {rec.plateNumber}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {dataSource === "local" && localFiles.length > 0 && (
            <div className="enf-card" style={{ padding: "14px" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(140, 188, 228, 1)", marginBottom: "8px" }}>已选本地文件（{localFiles.length} 个）</div>
              <div style={{ fontSize: "11px", color: "rgba(90, 155, 215, 1)" }}>
                {localFiles.map((f, i) => (
                  <div key={i}>{f.name}</div>
                ))}
              </div>
            </div>
          )}

          {dataSource === "third" && (
            <div className="enf-card" style={{ padding: "14px" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(140, 188, 228, 1)", marginBottom: "10px" }}>第三方数据列表（接口调用结果，点击缩略图查看大图）</div>
              {thirdLoading ? (
                <div style={{ color: "rgba(90, 155, 215, 1)", fontSize: "11px" }}>加载中…</div>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  {thirdList.map((t) => (
                    <div key={t.id} style={{ display: "flex", gap: "10px", padding: "10px", background: "rgba(6, 22, 52, 1)", borderRadius: "6px", fontSize: "11px", color: "rgba(155, 205, 245, 1)", width: "calc(50% - 6px)", minWidth: "260px" }}>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setLightbox({ type: "third", id: t.id, label: `${t.id} ${t.type}` })}
                        style={{ width: "72px", height: "54px", flexShrink: 0, background: "rgba(8, 28, 72, 1)", borderRadius: "4px", border: "1px solid rgba(0, 110, 170, 0.32)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                      >
                        {t.thumb ? <img src={t.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "24px", opacity: 0.7 }}>🚗</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: "rgba(0, 185, 225, 1)", fontWeight: 600 }}>{t.id}</div>
                        <div>{t.name}</div>
                        <div style={{ color: "rgba(255, 80, 80, 1)" }}>{t.type}</div>
                        <div style={{ color: "rgba(65, 128, 190, 1)", fontSize: "10px" }}>{t.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="enf-card" style={{ padding: "18px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(140, 188, 228, 1)", marginBottom: "14px" }}>新增违法记录配置</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
              {[
                { key: "address", label: "违法地址" },
                { key: "violation", label: "违法行为" },
                { key: "violationType", label: "违法类型" },
                { key: "roadCode", label: "道路编码" },
                { key: "sectionCode", label: "路段代码" },
                { key: "laneNo", label: "车道号" },
                { key: "plateNumber", label: "车牌号" },
                { key: "violationTime", label: "违法时间" },
                { key: "region", label: "行政区划" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label style={{ fontSize: "10px", color: "rgba(65, 128, 190, 1)", display: "block", marginBottom: "4px" }}>{label}</label>
                  <input
                    type={key === "violationTime" ? "datetime-local" : "text"}
                    style={inputStyle}
                    value={((addForm as unknown) as Record<string, string>)[key] ?? ""}
                    onChange={(e) => setAddForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={key === "violationTime" ? "选择时间" : `请输入${label}`}
                  />
                </div>
              ))}
            </div>
            <div style={{ marginTop: "14px" }}>
              <label style={{ fontSize: "10px", color: "rgba(65, 128, 190, 1)", display: "block", marginBottom: "4px" }}>违法类型（快捷选择）</label>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {VIOLATION_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAddForm((f) => ({ ...f, violationType: t }))}
                    style={{
                      padding: "4px 10px", fontSize: "11px", borderRadius: "4px", cursor: "pointer",
                      background: addForm.violationType === t ? "rgba(0, 110, 170, 0.55)" : "rgba(4, 16, 46, 1)",
                      color: addForm.violationType === t ? "rgba(0, 210, 240, 1)" : "rgba(90, 155, 215, 1)",
                      border: addForm.violationType === t ? "1px solid rgba(0, 185, 225, 0.52)" : "1px solid rgba(0, 110, 170, 0.32)",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button type="button" onClick={handleSubmit} style={{ padding: "8px 20px", background: "rgba(0, 110, 170, 0.65)", color: "rgba(0, 210, 240, 1)", border: "1px solid rgba(0, 185, 225, 0.52)", borderRadius: "4px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                提交违法记录
              </button>
              <button type="button" onClick={handleSaveTemp} style={{ padding: "8px 20px", background: "rgba(0, 75, 42, 0.55)", color: "rgba(0, 205, 135, 1)", border: "1px solid rgba(0, 185, 105, 0.38)", borderRadius: "4px", fontSize: "12px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <Save size={14} /> 保存
              </button>
              <button type="button" onClick={() => onModeChange?.("queue")} style={{ padding: "8px 20px", background: "rgba(6, 22, 62, 1)", color: "rgba(110, 172, 228, 1)", border: "1px solid rgba(0, 110, 170, 0.36)", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>
                返回上传队列
              </button>
            </div>
          </div>

          {savedRecords.length > 0 && (
            <div className="enf-card" style={{ padding: "14px" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(140, 188, 228, 1)", marginBottom: "8px" }}>已保存记录（可二次修改后提交）</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {savedRecords.map((s) => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: "rgba(6, 22, 52, 1)", borderRadius: "4px", fontSize: "11px" }}>
                    <span style={{ color: "rgba(155, 205, 245, 1)" }}>{s.violationType || "—"} · {s.plateNumber || "—"} · {s.createdAt}</span>
                    <button type="button" onClick={() => { setAddForm({ ...s, region: s.region }); setSavedRecords((p) => p.filter((x) => x.id !== s.id)); }} style={{ padding: "3px 8px", fontSize: "10px", background: "rgba(0, 55, 100, 0.5)", color: "rgba(0, 185, 225, 1)", border: "none", borderRadius: "3px", cursor: "pointer" }}>编辑并提交</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div style={{ display: "flex", gap: "12px" }}>
            {[
              { label: "上传成功", value: successCount, color: "rgba(0, 205, 135, 1)", bg: "rgba(0, 38, 25, 0.85)" },
              { label: "上传中", value: 1, color: "rgba(0, 210, 240, 1)", bg: "rgba(0, 38, 72, 0.85)" },
              { label: "等待上传", value: pendingCount, color: "rgba(90, 158, 215, 1)", bg: "rgba(6, 20, 55, 1)" },
              { label: "上传失败", value: failedCount, color: "rgba(255, 80, 80, 1)", bg: "rgba(58, 6, 6, 0.85)" },
            ].map((s) => (
              <div key={s.label} className="enf-card" style={{ flex: 1, padding: "14px 16px", background: s.bg, borderColor: `${s.color.replace("1)", "0.28)")}` }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: "11px", color: s.color, opacity: 0.82, marginTop: "2px" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="enf-card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "11px 16px", borderBottom: "1px solid rgba(0, 110, 170, 0.22)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(155, 205, 245, 1)" }}>上传队列</span>
              <div style={{ display: "flex", gap: "7px" }}>
                <button style={{ padding: "4px 11px", fontSize: "11px", background: "rgba(0, 100, 165, 0.55)", color: "rgba(0, 210, 240, 1)", border: "1px solid rgba(0, 185, 225, 0.42)", borderRadius: "3px", cursor: "pointer" }}>全部上传</button>
                <button style={{ padding: "4px 11px", fontSize: "11px", background: "rgba(78, 8, 8, 0.42)", color: "rgba(255, 80, 80, 1)", border: "1px solid rgba(255, 60, 60, 0.32)", borderRadius: "3px", cursor: "pointer" }}>重试失败</button>
              </div>
            </div>
            <div style={{ display: "flex", padding: "7px 16px", background: "rgba(4, 14, 40, 1)", fontSize: "10px", color: "rgba(65, 128, 190, 1)", fontWeight: 600 }}>
              <span style={{ flex: 3 }}>文件名称</span><span style={{ flex: 1 }}>违法类型</span><span style={{ flex: 1 }}>大小</span><span style={{ flex: 2 }}>上传进度</span><span style={{ flex: 1 }}>状态</span><span style={{ flex: 1 }}>上传时间</span><span style={{ width: "90px" }}>操作</span>
            </div>
            {queueItems.map((item, idx) => {
              const cfg = statusCfg[item.status];
              const Icon = cfg.icon;
              const canEdit = item.status === "pending" || item.status === "failed";
              return (
                <div key={item.id} style={{ display: "flex", alignItems: "center", padding: "9px 16px", borderBottom: idx < queueItems.length - 1 ? "1px solid rgba(0, 80, 130, 0.15)" : "none", background: idx % 2 === 0 ? "rgba(8, 24, 60, 1)" : "rgba(6, 18, 50, 1)", fontSize: "11px" }}>
                  <span style={{ flex: 3, color: "rgba(155, 205, 245, 1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: "8px" }}>{item.name}</span>
                  <span style={{ flex: 1, color: "rgba(255, 80, 80, 1)", fontWeight: 500 }}>{item.type}</span>
                  <span style={{ flex: 1, color: "rgba(65, 128, 190, 1)" }}>{item.size}</span>
                  <div style={{ flex: 2, paddingRight: "12px" }}>
                    {item.status !== "pending" && (
                      <div style={{ height: "5px", background: "rgba(0, 38, 82, 1)", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${item.progress}%`, background: item.status === "failed" ? "rgba(255, 80, 80, 1)" : item.status === "success" ? "rgba(0, 205, 135, 1)" : "rgba(0, 210, 240, 1)", borderRadius: "3px" }} />
                      </div>
                    )}
                    {item.status === "pending" && <span style={{ fontSize: "10px", color: "rgba(50, 95, 158, 1)" }}>待上传</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", padding: "1px 6px", background: cfg.bg, color: cfg.color, borderRadius: "3px", fontSize: "10px" }}>
                      <Icon size={10} className={item.status === "uploading" ? "spin" : ""} />{cfg.label}
                    </span>
                  </div>
                  <span style={{ flex: 1, color: "rgba(65, 128, 190, 1)", fontFamily: "monospace", fontSize: "10px" }}>{item.time}</span>
                  <div style={{ width: "90px", display: "flex", gap: "3px" }}>
                    {canEdit && (
                      <button onClick={() => handleEditQueueItem(item)} style={{ padding: "2px 6px", fontSize: "10px", background: "rgba(0, 55, 100, 0.42)", color: "rgba(0, 185, 225, 1)", border: "none", borderRadius: "2px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "2px" }}><Pencil size={10} /> 编辑</button>
                    )}
                    {item.status === "failed" && <button style={{ padding: "2px 6px", fontSize: "10px", background: "rgba(78, 8, 8, 0.42)", color: "rgba(255, 80, 80, 1)", border: "none", borderRadius: "2px", cursor: "pointer" }}>重试</button>}
                    {item.status === "pending" && <button style={{ padding: "2px 6px", fontSize: "10px", background: "rgba(0, 55, 100, 0.42)", color: "rgba(0, 185, 225, 1)", border: "none", borderRadius: "2px", cursor: "pointer" }}>上传</button>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {lightbox && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 101 }} onClick={() => setLightbox(null)}>
          <div style={{ maxWidth: "90vw", maxHeight: "90vh", background: "rgba(8, 24, 60, 1)", border: "1px solid rgba(0, 185, 225, 0.4)", borderRadius: "8px", padding: "16px", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button type="button" style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "4px", color: "#fff", cursor: "pointer", padding: "4px" }} onClick={() => setLightbox(null)}><X size={18} /></button>
            <div style={{ width: "320px", height: "240px", background: "rgba(4, 14, 40, 1)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "64px", opacity: 0.8 }}>🖼️</span>
            </div>
            <div style={{ fontSize: "12px", color: "rgba(200, 232, 255, 1)", textAlign: "center" }}>{lightbox.label}</div>
          </div>
        </div>
      )}

      {editingItemId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setEditingItemId(null)}>
          <div className="enf-card" style={{ width: "90%", maxWidth: "520px", padding: "20px", maxHeight: "85vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "rgba(200, 232, 255, 1)", marginBottom: "14px" }}>编辑未上传记录</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {["address", "violation", "violationType", "roadCode", "sectionCode", "laneNo", "plateNumber", "violationTime", "region"].map((key) => (
                <div key={key}>
                  <label style={{ fontSize: "10px", color: "rgba(65, 128, 190, 1)", display: "block", marginBottom: "3px" }}>{({ address: "违法地址", violation: "违法行为", violationType: "违法类型", roadCode: "道路编码", sectionCode: "路段代码", laneNo: "车道号", plateNumber: "车牌号", violationTime: "违法时间", region: "行政区划" } as Record<string, string>)[key]}</label>
                  <input
                    type={key === "violationTime" ? "datetime-local" : "text"}
                    style={inputStyle}
                    value={((editForm as unknown) as Record<string, string>)[key] ?? ""}
                    onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div style={{ marginTop: "14px", display: "flex", gap: "8px" }}>
              <button type="button" onClick={handleSaveEdit} style={{ padding: "6px 16px", background: "rgba(0, 110, 170, 0.65)", color: "rgba(0, 210, 240, 1)", border: "1px solid rgba(0, 185, 225, 0.52)", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>保存</button>
              <button type="button" onClick={() => setEditingItemId(null)} style={{ padding: "6px 16px", background: "rgba(6, 22, 62, 1)", color: "rgba(110, 172, 228, 1)", border: "1px solid rgba(0, 110, 170, 0.36)", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViolationUpload;
