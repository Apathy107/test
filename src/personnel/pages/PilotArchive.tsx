import React, { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import FilterBar from "@personnel/components/FilterBar";
import TechTable from "@personnel/components/TechTable";
import PilotTableRow from "@personnel/components/PilotTableRow";
import StatusBadge from "@personnel/components/StatusBadge";
import { LayoutList, LayoutGrid, QrCode, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Pilot = {
  id: string;
  name: string;
  gender: string;
  idCard: string;
  phone: string;
  unit: string;
  certStatus: "持证" | "未持证" | "已过期";
  taskStatus: "在岗" | "任务中" | "休假" | "冻结";
  certExpiry: string;
  avatarUrl?: string;
};

const INITIAL_PILOTS: Pilot[] = [
  { id: "P001", name: "张三", gender: "男", idCard: "110101199001011234", phone: "138****1234", unit: "东城分队", certStatus: "持证" as const, taskStatus: "在岗" as const, certExpiry: "2026-03-15", avatarUrl: "" },
  { id: "P002", name: "李四", gender: "男", idCard: "110101198505054321", phone: "139****5678", unit: "西城分队", certStatus: "持证" as const, taskStatus: "任务中" as const, certExpiry: "2025-09-20", avatarUrl: "" },
  { id: "P003", name: "王五", gender: "男", idCard: "110101199203073456", phone: "137****9012", unit: "北郊中队", certStatus: "未持证" as const, taskStatus: "在岗" as const, certExpiry: "—", avatarUrl: "" },
  { id: "P004", name: "赵六", gender: "女", idCard: "110101199507192468", phone: "136****3456", unit: "南区分队", certStatus: "已过期" as const, taskStatus: "冻结" as const, certExpiry: "2024-12-31", avatarUrl: "" },
  { id: "P005", name: "陈峰", gender: "男", idCard: "110101198812284567", phone: "135****7890", unit: "应急响应", certStatus: "持证" as const, taskStatus: "在岗" as const, certExpiry: "2027-06-10", avatarUrl: "" },
  { id: "P006", name: "吴雪", gender: "女", idCard: "110101199409155678", phone: "134****1234", unit: "西城分队", certStatus: "持证" as const, taskStatus: "休假" as const, certExpiry: "2026-11-28", avatarUrl: "" },
  { id: "P007", name: "郑宇", gender: "男", idCard: "110101199111016789", phone: "133****5678", unit: "应急响应", certStatus: "持证" as const, taskStatus: "任务中" as const, certExpiry: "2026-05-18", avatarUrl: "" },
  { id: "P008", name: "刘洋", gender: "男", idCard: "110101199307257890", phone: "132****9012", unit: "北郊中队", certStatus: "持证" as const, taskStatus: "在岗" as const, certExpiry: "2025-07-21", avatarUrl: "" },
];

const columns = [
  { key: "no", title: "序号", width: "60px", align: "center" as const },
  { key: "id", title: "编号" },
  { key: "name", title: "姓名" },
  { key: "gender", title: "性别", align: "center" as const },
  { key: "idCard", title: "身份证号" },
  { key: "phone", title: "联系方式" },
  { key: "unit", title: "所属单位" },
  { key: "certStatus", title: "持证状态" },
  { key: "taskStatus", title: "任务状态" },
  { key: "certExpiry", title: "证书到期" },
  { key: "action", title: "操作", width: "160px" },
];

const PILOTS_STORAGE_KEY = "personnel.pilots.v1";

const PilotArchive: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [list, setList] = useState<Pilot[]>(INITIAL_PILOTS);
  const [showDetail, setShowDetail] = useState(false);
  const [detailMode, setDetailMode] = useState<"view" | "edit">("view");
  const [selectedPilot, setSelectedPilot] = useState<Pilot>(INITIAL_PILOTS[0]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [createTab, setCreateTab] = useState<"basic" | "cert" | "files">("basic");
  const [activeCertTab, setActiveCertTab] = useState<"全部" | "持证" | "未持证" | "已过期" | "已冻结">("全部");
  const [showImport, setShowImport] = useState(false);
  const [filterUnit, setFilterUnit] = useState<string>("");
  const [filterTaskStatus, setFilterTaskStatus] = useState<"" | Pilot["taskStatus"]>("");
  const [keyword, setKeyword] = useState("");
  const [basicForm, setBasicForm] = useState({
    id: "",
    name: "",
    gender: "男",
    idCard: "",
    age: "",
    politics: "",
    phone: "",
    unitCategory: "分局",
    unitName: "",
    entryDate: "",
    contractPeriod: "",
    emergencyContact: "",
    education: "",
    experience: "",
    avatarUrl: "",
  });
  const [certForm, setCertForm] = useState({
    hasCert: "no",
    type: "",
    typeOther: "",
    number: "",
    issuer: "",
    validFrom: "",
    validTo: "",
    level: "",
    score: "",
    org: "",
  });
  const [filesForm, setFilesForm] = useState({
    idCardFile: "",
    degreeFile: "",
    criminalRecordFile: "",
    healthFile: "",
    pilotCertFile: "",
  });

  const [detailForm, setDetailForm] = useState<Pilot | null>(null);
  const [exportSections, setExportSections] = useState({
    basic: true,
    qualification: true,
    attachments: true,
    tasks: true,
    training: true,
  });

  console.log("PilotArchive page rendered, view mode:", viewMode);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PILOTS_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) setList(parsed as Pilot[]);
    } catch (e) {
      console.error("Failed to load pilots from localStorage", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(PILOTS_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Failed to save pilots to localStorage", e);
    }
  }, [list]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    const targets = selectedIds.length
      ? list.filter((p) => selectedIds.includes(p.id))
      : list;
    if (!targets.length) return;
    const header = ["编号", "姓名", "性别", "身份证号", "联系方式", "所属单位", "持证状态", "任务状态", "证书到期"];
    const rows = targets.map((p) => [
      p.id,
      p.name,
      p.gender,
      p.idCard,
      p.phone,
      p.unit,
      p.certStatus,
      p.taskStatus,
      p.certExpiry,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "飞手列表导出.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const autoPilotId = () => {
    const maxNum = list.reduce((max, p) => {
      const num = parseInt(p.id.replace(/\D/g, ""), 10);
      return Number.isNaN(num) ? max : Math.max(max, num);
    }, 0);
    return `P${(maxNum + 1).toString().padStart(3, "0")}`;
  };

  const openCreate = () => {
    setBasicForm((f) => ({ ...f, id: autoPilotId() }));
    setCreateTab("basic");
    setShowCreate(true);
  };

  const computeCertStatus = (): Pilot["certStatus"] => {
    if (certForm.hasCert !== "yes") return "未持证";
    if (!certForm.validTo) return "持证";
    const today = new Date().toISOString().slice(0, 10);
    return certForm.validTo < today ? "已过期" : "持证";
  };

  const handleCreateSubmit = () => {
    const certStatus = computeCertStatus();
    const newPilot: Pilot = {
      id: basicForm.id || autoPilotId(),
      name: basicForm.name || "新飞手",
      gender: basicForm.gender,
      idCard: basicForm.idCard || "—",
      phone: basicForm.phone || "—",
      unit: basicForm.unitName || `${basicForm.unitCategory}`,
      certStatus,
      taskStatus: "在岗" as const,
      certExpiry: certForm.validTo || "—",
      avatarUrl: basicForm.avatarUrl || "",
    };
    setList((prev) => [newPilot, ...prev]);
    setShowCreate(false);
  };

  const filteredList = list.filter((p) => {
    // 证书标签筛选
    if (activeCertTab === "持证" && p.certStatus !== "持证") return false;
    if (activeCertTab === "未持证" && p.certStatus !== "未持证") return false;
    if (activeCertTab === "已过期" && p.certStatus !== "已过期") return false;
    if (activeCertTab === "已冻结" && p.taskStatus !== "冻结") return false;

    // 所属单位筛选
    if (filterUnit && p.unit !== filterUnit) return false;

    // 任务状态筛选
    if (filterTaskStatus && p.taskStatus !== filterTaskStatus) return false;

    // 关键字搜索：姓名 / 编号 / 单位
    if (keyword) {
      const kw = keyword.toLowerCase();
      if (
        !(
          p.name.toLowerCase().includes(kw) ||
          p.id.toLowerCase().includes(kw) ||
          p.unit.toLowerCase().includes(kw)
        )
      ) {
        return false;
      }
    }

    return true;
  });

  const counts = {
    all: list.length,
    certified: list.filter((p) => p.certStatus === "持证").length,
    uncertified: list.filter((p) => p.certStatus === "未持证").length,
    expired: list.filter((p) => p.certStatus === "已过期").length,
    frozen: list.filter((p) => p.taskStatus === "冻结").length,
  };

  const unitOptions = Array.from(new Set(list.map((p) => p.unit)));

  const allSelectedOnCurrent =
    filteredList.length > 0 &&
    filteredList.every((p) => selectedIds.includes(p.id));

  const handleToggleSelectAllCurrent = () => {
    if (allSelectedOnCurrent) {
      // 只取消当前页已选中的
      setSelectedIds((prev) =>
        prev.filter((id) => !filteredList.some((p) => p.id === id))
      );
    } else {
      // 合并当前页所有 ID
      const currentIds = filteredList.map((p) => p.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  const handleExportDetailPdf = () => {
    if (!detailForm) return;
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(16);
    doc.text(`飞手档案：${detailForm.name}`, 14, y);
    y += 8;
    doc.setFontSize(11);
    if (exportSections.basic) {
      doc.text("一、基础信息", 14, y);
      y += 6;
      [
        `编号：${detailForm.id}`,
        `姓名：${detailForm.name}`,
        `性别：${detailForm.gender}`,
        `身份证号：${detailForm.idCard}`,
        `联系方式：${detailForm.phone}`,
        `所属单位：${detailForm.unit}`,
      ].forEach((line) => {
        doc.text(line, 18, y);
        y += 5;
      });
      y += 2;
    }
    if (exportSections.qualification) {
      doc.text("二、资质信息", 14, y);
      y += 6;
      [
        `持证状态：${detailForm.certStatus}`,
        `证书到期：${detailForm.certExpiry}`,
        `主证书：CAAC 超视距执照`,
      ].forEach((line) => {
        doc.text(line, 18, y);
        y += 5;
      });
      y += 2;
    }
    if (exportSections.attachments) {
      doc.text("三、附件材料摘要", 14, y);
      y += 6;
      doc.text("已存档材料：身份证、学历证明、无犯罪记录、体检报告、飞手证书等。", 18, y);
      y += 7;
    }
    if (exportSections.training) {
      doc.text("四、培训记录摘要", 14, y);
      y += 6;
      doc.text("示例：警用无人机基础飞行、夜航与复杂气象飞行等课程记录。", 18, y);
      y += 7;
    }
    if (exportSections.tasks) {
      doc.text("五、任务记录摘要", 14, y);
      y += 6;
      doc.text("示例：城市重点区域巡逻、夜间治安巡逻等任务执行情况。", 18, y);
    }
    doc.save(`${detailForm.name}-飞手档案.pdf`);
  };

  return (
    <>
      {/* Header controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-xs" style={{ color: "rgba(100, 140, 180, 1)" }}>
            共 <span style={{ color: "rgba(0, 212, 255, 1)", fontWeight: 600 }}>{filteredList.length}</span> 名飞手
          </div>
          {[
            { label: "全部" as const, count: counts.all },
            { label: "持证" as const, count: counts.certified },
            { label: "未持证" as const, count: counts.uncertified },
            { label: "已过期" as const, count: counts.expired },
            { label: "已冻结" as const, count: counts.frozen },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveCertTab(tab.label)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors"
              style={{
                background: activeCertTab === tab.label ? "rgba(0, 100, 150, 0.25)" : "rgba(16, 38, 76, 0.5)",
                border: activeCertTab === tab.label ? "1px solid rgba(0, 212, 255, 0.5)" : "1px solid rgba(0, 100, 150, 0.2)",
                color: activeCertTab === tab.label ? "rgba(0, 212, 255, 1)" : "rgba(100, 140, 180, 1)",
              }}
            >
              {tab.label}
              <span
                className="px-1.5 rounded-full text-[10px]"
                style={{
                  background: "rgba(0, 80, 120, 0.5)",
                  color: "rgba(140, 180, 210, 1)",
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("list")}
            className="p-1.5 rounded transition-colors"
            style={{
              background: viewMode === "list" ? "rgba(0, 100, 150, 0.3)" : "transparent",
              color: viewMode === "list" ? "rgba(0, 212, 255, 1)" : "rgba(80, 120, 160, 1)",
              border: "1px solid rgba(0, 100, 150, 0.3)",
            }}
          >
            <LayoutList size={14} />
          </button>
          <button
            onClick={() => setViewMode("card")}
            className="p-1.5 rounded transition-colors"
            style={{
              background: viewMode === "card" ? "rgba(0, 100, 150, 0.3)" : "transparent",
              color: viewMode === "card" ? "rgba(0, 212, 255, 1)" : "rgba(80, 120, 160, 1)",
              border: "1px solid rgba(0, 100, 150, 0.3)",
            }}
          >
            <LayoutGrid size={14} />
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="mb-3">
        <FilterBar
          placeholder="搜索姓名 / 编号 / 单位..."
          onSearch={(v) => setKeyword(v)}
          onAdd={openCreate}
          onImport={() => setShowImport(true)}
          onExport={handleExport}
          extraFilters={
            <div className="flex items-center gap-2">
              <select
                className="px-3 py-2 rounded text-xs outline-none"
                style={{
                  background: "rgba(16, 38, 76, 1)",
                  border: "1px solid rgba(0, 150, 200, 0.3)",
                  color: "rgba(140, 180, 210, 1)",
                }}
                value={filterUnit}
                onChange={(e) => setFilterUnit(e.target.value)}
              >
                <option value="">所属单位（全部）</option>
                {unitOptions.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <select
                className="px-3 py-2 rounded text-xs outline-none"
                style={{
                  background: "rgba(16, 38, 76, 1)",
                  border: "1px solid rgba(0, 150, 200, 0.3)",
                  color: "rgba(140, 180, 210, 1)",
                }}
                value={filterTaskStatus}
                onChange={(e) =>
                  setFilterTaskStatus(
                    e.target.value as "" | Pilot["taskStatus"]
                  )
                }
              >
                <option value="">任务状态（全部）</option>
                <option value="在岗">在岗</option>
                <option value="任务中">任务中</option>
                <option value="休假">休假</option>
                <option value="冻结">冻结</option>
              </select>
            </div>
          }
        />
      </div>

      {/* Bulk selection helper（去掉按钮，仅展示统计） */}
      <div
        className="flex items-center justify-between mb-2 text-xs"
        style={{ color: "rgba(100,140,180,1)" }}
      >
        <div>
          当前标签下共{" "}
          <span style={{ color: "rgba(0,212,255,1)" }}>
            {filteredList.length}
          </span>{" "}
          名飞手，已选{" "}
          <span style={{ color: "rgba(0,212,255,1)" }}>
            {selectedIds.length}
          </span>
        </div>
      </div>

      {/* Table view */}
      <div style={{ display: viewMode === "list" ? "block" : "none" }}>
        <TechTable
          columns={columns}
          showIndexCheckbox
          allChecked={allSelectedOnCurrent}
          onToggleAll={handleToggleSelectAllCurrent}
        >
          {filteredList.map((p, i) => (
            <PilotTableRow
              key={p.id}
              index={i + 1}
              id={p.id}
              name={p.name}
              gender={p.gender}
              idCard={p.idCard}
              phone={p.phone}
              unit={p.unit}
              certStatus={p.certStatus}
              taskStatus={p.taskStatus}
              certExpiry={p.certExpiry}
              onView={() => {
                setSelectedPilot(p);
                setDetailForm({ ...p });
                setDetailMode("view");
                setShowDetail(true);
              }}
              onEdit={() => {
                setSelectedPilot(p);
                setDetailForm({ ...p });
                setDetailMode("edit");
                setShowDetail(true);
              }}
              selected={selectedIds.includes(p.id)}
              onToggleSelect={() => handleToggleSelect(p.id)}
              onDelete={() => {
                setList((prev) => prev.filter((x) => x.id !== p.id));
                setSelectedIds((prev) => prev.filter((x) => x !== p.id));
              }}
              onDisable={() => {
                setList((prev) =>
                  prev.map((x) =>
                    x.id === p.id ? { ...x, taskStatus: "冻结" as const } : x
                  )
                );
              }}
            />
          ))}
        </TechTable>
      </div>

      {/* Card view */}
      <div
        className="flex flex-wrap gap-4"
        style={{ display: viewMode === "card" ? "flex" : "none" }}
      >
        {filteredList.map((p) => (
          <div
            key={p.id}
            className="tech-card rounded-lg p-4 cursor-pointer hover:opacity-90 transition-opacity"
            style={{ width: "220px" }}
            onClick={() => navigate(`/personnel/pilot-archive/${encodeURIComponent(p.id)}`)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div>
                  <div className="text-sm font-semibold" style={{ color: "rgba(200, 220, 240, 1)" }}>{p.name}</div>
                  <div className="text-xs" style={{ color: "rgba(80, 120, 160, 1)" }}>{p.id}</div>
                </div>
              </div>
              {p.avatarUrl ? (
                <img
                  src={p.avatarUrl}
                  alt={p.name}
                  style={{
                    width: 38,
                    height: 48,
                    borderRadius: 6,
                    objectFit: "cover",
                    border: "1px solid rgba(0,150,200,0.6)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 38,
                    height: 48,
                    borderRadius: 6,
                    border: "1px dashed rgba(0,150,200,0.45)",
                    background: "rgba(15, 23, 42, 0.65)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(100, 140, 180, 1)",
                    fontSize: 10,
                    textAlign: "center",
                    padding: "0 4px",
                    lineHeight: 1.2,
                  }}
                  title="未上传一寸照"
                >
                  未上传
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <StatusBadge
                status={p.certStatus === "持证" ? "active" : p.certStatus === "已过期" ? "expired" : "warning"}
                label={p.certStatus}
              />
              <StatusBadge
                status={p.taskStatus === "在岗" ? "normal" : p.taskStatus === "任务中" ? "info" : p.taskStatus === "休假" ? "pending" : "frozen"}
                label={p.taskStatus}
              />
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span style={{ color: "rgba(80, 120, 160, 1)" }}>所属单位</span>
                <span style={{ color: "rgba(160, 200, 230, 1)" }}>{p.unit}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "rgba(80, 120, 160, 1)" }}>证书到期</span>
                <span style={{ color: p.certExpiry === "—" ? "rgba(80, 120, 160, 1)" : "rgba(160, 200, 230, 1)" }}>{p.certExpiry}</span>
              </div>
            </div>
            <div className="flex items-center justify-center mt-3 gap-1" style={{ color: "rgba(60, 100, 140, 1)" }}>
              <QrCode size={11} />
              <span className="text-[10px]">查看二维码</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-xs" style={{ color: "rgba(80, 120, 160, 1)" }}>
          显示 1-{filteredList.length} 条，共 {list.length} 条
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className="w-7 h-7 rounded text-xs transition-colors"
              style={{
                background: n === 1 ? "rgba(0, 120, 180, 0.3)" : "rgba(16, 38, 76, 0.6)",
                border: n === 1 ? "1px solid rgba(0, 212, 255, 0.5)" : "1px solid rgba(0, 100, 150, 0.3)",
                color: n === 1 ? "rgba(0, 212, 255, 1)" : "rgba(100, 140, 180, 1)",
              }}
            >
              {n}
            </button>
          ))}
          <span className="text-xs" style={{ color: "rgba(80, 120, 160, 1)" }}>...</span>
          <button className="w-7 h-7 rounded text-xs" style={{ background: "rgba(16, 38, 76, 0.6)", border: "1px solid rgba(0, 100, 150, 0.3)", color: "rgba(100, 140, 180, 1)" }}>16</button>
        </div>
      </div>

      {/* Detail / edit modal */}
      {showDetail && detailForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(4, 10, 24, 0.85)" }}
          onClick={() => {
            setShowDetail(false);
            setDetailMode("view");
          }}
        >
          <div
            className="tech-card rounded-lg p-6 w-[640px] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                {detailForm.avatarUrl ? (
                  <img
                    src={detailForm.avatarUrl}
                    alt={detailForm.name}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 8,
                      objectFit: "cover",
                      border: "1px solid rgba(0,150,200,0.6)",
                    }}
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{ background: "rgba(0, 80, 130, 0.5)", color: "rgba(0, 212, 255, 1)", border: "1px solid rgba(0, 150, 200, 0.4)" }}
                  >
                    {detailForm.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-base font-bold" style={{ color: "rgba(200, 220, 240, 1)" }}>{detailForm.name}</div>
                  <div className="text-xs" style={{ color: "rgba(80, 120, 160, 1)" }}>{detailForm.id} · {detailForm.unit}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="text-xs px-3 py-1 rounded"
                  style={{
                    background: "rgba(0, 60, 110, 0.9)",
                    color: "rgba(210,230,250,1)",
                    border: "1px solid rgba(0, 150, 220, 0.6)",
                  }}
                  onClick={handleExportDetailPdf}
                >
                  导出 PDF
                </button>
                {detailMode === "view" && (
                  <button
                    className="text-xs px-3 py-1 rounded"
                    style={{
                      background: "rgba(0, 100, 150, 0.2)",
                      color: "rgba(0, 212, 255, 1)",
                      border: "1px solid rgba(0, 212, 255, 0.6)",
                    }}
                    onClick={() => setDetailMode("edit")}
                  >
                    进入编辑
                  </button>
                )}
                {detailMode === "edit" && (
                  <>
                    <button
                      className="text-xs px-3 py-1 rounded"
                      style={{
                        background: "rgba(0, 130, 200, 0.9)",
                        color: "#fff",
                        boxShadow: "0 0 8px rgba(0,212,255,0.35)",
                      }}
                      onClick={() => {
                        setList((list) =>
                          list.map((p) =>
                            p.id === detailForm.id ? detailForm : p
                          )
                        );
                        setSelectedPilot(detailForm);
                        setDetailMode("view");
                        setShowDetail(false);
                      }}
                    >
                      保存修改
                    </button>
                    <button
                      className="text-xs px-3 py-1 rounded"
                      style={{
                        background: "rgba(16,38,76,1)",
                        color: "rgba(140,180,210,1)",
                      }}
                      onClick={() => {
                        setDetailForm(selectedPilot);
                        setDetailMode("view");
                      }}
                    >
                      取消编辑
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    setShowDetail(false);
                    setDetailMode("view");
                  }}
                  style={{ color: "rgba(100, 140, 180, 1)" }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="highlight-line mb-3" />

            <div className="mb-4 text-[11px] flex flex-wrap gap-3" style={{ color: "rgba(130,160,200,1)" }}>
              <span style={{ marginRight: 8 }}>导出内容：</span>
              {[
                { key: "basic", label: "基础信息" },
                { key: "qualification", label: "资质信息" },
                { key: "attachments", label: "附件材料" },
                { key: "training", label: "培训记录" },
                { key: "tasks", label: "任务记录" },
              ].map((sec) => (
                <label key={sec.key} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={exportSections[sec.key as keyof typeof exportSections]}
                    onChange={() =>
                      setExportSections((prev) => ({
                        ...prev,
                        [sec.key]: !prev[sec.key as keyof typeof exportSections],
                      }))
                    }
                  />
                  {sec.label}
                </label>
              ))}
            </div>

            {detailMode === "edit" && (
              <div
                className="mb-5 grid grid-cols-2 gap-3 text-xs"
                style={{ color: "rgba(160,190,220,1)" }}
              >
                <div>
                  <div className="form-label">姓名</div>
                  <input
                    className="form-input"
                    value={detailForm.name}
                    onChange={(e) =>
                      setDetailForm((f) =>
                        f ? { ...f, name: e.target.value } : f
                      )
                    }
                  />
                </div>
                <div>
                  <div className="form-label">性别</div>
                  <select
                    className="form-input"
                    value={detailForm.gender}
                    onChange={(e) =>
                      setDetailForm((f) =>
                        f ? { ...f, gender: e.target.value } : f
                      )
                    }
                  >
                    <option>男</option>
                    <option>女</option>
                  </select>
                </div>
                <div>
                  <div className="form-label">身份证号</div>
                  <input
                    className="form-input"
                    value={detailForm.idCard}
                    onChange={(e) =>
                      setDetailForm((f) =>
                        f ? { ...f, idCard: e.target.value } : f
                      )
                    }
                  />
                </div>
                <div>
                  <div className="form-label">联系方式</div>
                  <input
                    className="form-input"
                    value={detailForm.phone}
                    onChange={(e) =>
                      setDetailForm((f) =>
                        f ? { ...f, phone: e.target.value } : f
                      )
                    }
                  />
                </div>
                <div>
                  <div className="form-label">所属单位</div>
                  <input
                    className="form-input"
                    value={detailForm.unit}
                    onChange={(e) =>
                      setDetailForm((f) =>
                        f ? { ...f, unit: e.target.value } : f
                      )
                    }
                  />
                </div>
                <div>
                  <div className="form-label">任务状态</div>
                  <select
                    className="form-input"
                    value={detailForm.taskStatus}
                    onChange={(e) =>
                      setDetailForm((f) =>
                        f
                          ? {
                              ...f,
                              taskStatus: e.target
                                .value as Pilot["taskStatus"],
                            }
                          : f
                      )
                    }
                  >
                    <option value="在岗">在岗</option>
                    <option value="任务中">任务中</option>
                    <option value="休假">休假</option>
                    <option value="冻结">冻结</option>
                  </select>
                </div>
                <div>
                  <div className="form-label">持证状态</div>
                  <select
                    className="form-input"
                    value={detailForm.certStatus}
                    onChange={(e) =>
                      setDetailForm((f) =>
                        f
                          ? {
                              ...f,
                              certStatus: e.target
                                .value as Pilot["certStatus"],
                            }
                          : f
                      )
                    }
                  >
                    <option value="持证">持证</option>
                    <option value="未持证">未持证</option>
                    <option value="已过期">已过期</option>
                  </select>
                </div>
                <div>
                  <div className="form-label">证书到期</div>
                  <input
                    type="date"
                    className="form-input"
                    value={detailForm.certExpiry === "—" ? "" : detailForm.certExpiry}
                    onChange={(e) =>
                      setDetailForm((f) =>
                        f
                          ? {
                              ...f,
                              certExpiry: e.target.value || "—",
                            }
                          : f
                      )
                    }
                  />
                </div>
              </div>
            )}

            {/* Basic info */}
            <div className="mb-5">
              <div className="text-xs font-semibold mb-3" style={{ color: "rgba(0, 212, 255, 0.8)", letterSpacing: "0.1em" }}>
                — 基础信息
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {[
                  { label: "性别", value: detailForm.gender },
                  { label: "身份证号", value: detailForm.idCard },
                  { label: "联系方式", value: detailForm.phone },
                  { label: "所属单位", value: detailForm.unit },
                  { label: "入职时间", value: "2020-06-01" },
                  { label: "合同期限", value: "2025-05-31" },
                  { label: "学历", value: "本科" },
                  { label: "政治面貌", value: "群众" },
                ].map((f) => (
                  <div key={f.label} className="w-[calc(50%-16px)]">
                    <span className="text-xs" style={{ color: "rgba(80, 120, 160, 1)" }}>{f.label}：</span>
                    <span className="text-xs" style={{ color: "rgba(180, 210, 240, 1)" }}>{f.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Qualification info */}
            <div className="mb-5">
              <div className="text-xs font-semibold mb-3" style={{ color: "rgba(0, 212, 255, 0.8)", letterSpacing: "0.1em" }}>
                — 资质信息
              </div>
              <div
                className="p-3 rounded"
                style={{ background: "rgba(0, 60, 100, 0.2)", border: "1px solid rgba(0, 150, 200, 0.2)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium" style={{ color: "rgba(0, 212, 255, 0.9)" }}>CAAC 超视距执照</span>
                  <StatusBadge
                    status={detailForm.certStatus === "持证" ? "active" : detailForm.certStatus === "已过期" ? "expired" : "warning"}
                    label={detailForm.certStatus}
                  />
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-1 text-xs">
                  <div>
                    <span style={{ color: "rgba(80, 120, 160, 1)" }}>证书编号：</span>
                    <span style={{ color: "rgba(180, 210, 240, 1)" }}>CAAC-BVLOS-2022-{detailForm.id}</span>
                  </div>
                  <div>
                    <span style={{ color: "rgba(80, 120, 160, 1)" }}>等级：</span>
                    <span style={{ color: "rgba(180, 210, 240, 1)" }}>三级</span>
                  </div>
                  <div>
                    <span style={{ color: "rgba(80, 120, 160, 1)" }}>有效期至：</span>
                    <span style={{ color: "rgba(180, 210, 240, 1)" }}>{detailForm.certExpiry}</span>
                  </div>
                  <div>
                    <span style={{ color: "rgba(80, 120, 160, 1)" }}>发证机关：</span>
                    <span style={{ color: "rgba(180, 210, 240, 1)" }}>中国民用航空局</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div className="mb-5">
              <div className="text-xs font-semibold mb-3" style={{ color: "rgba(0, 212, 255, 0.8)", letterSpacing: "0.1em" }}>
                — 附件材料
              </div>
              <div className="flex flex-wrap gap-2">
                {["身份证扫描件", "学历证明", "无犯罪记录证明", "体检报告", "CAAC执照扫描件"].map((att) => (
                  <div
                    key={att}
                    className="flex items-center gap-2 px-3 py-1.5 rounded text-xs cursor-pointer hover:opacity-80"
                    style={{
                      background: "rgba(0, 80, 120, 0.2)",
                      border: "1px solid rgba(0, 150, 200, 0.3)",
                      color: "rgba(0, 212, 255, 0.8)",
                    }}
                  >
                    📎 {att}
                  </div>
                ))}
              </div>
            </div>

            {/* Qualification upgrade & review */}
            <div className="mb-4">
              <div className="text-xs font-semibold mb-2" style={{ color: "rgba(0, 212, 255, 0.8)", letterSpacing: "0.08em" }}>
                — 飞手资质升级与复审记录
              </div>
              <div className="tech-card rounded-lg overflow-hidden">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr style={{ background: "rgba(3,20,45,1)" }}>
                      {["记录ID", "飞手姓名", "身份证号", "所属单位名称", "当前级别", "目标级别", "提交日期", "审批状态"].map((h) => (
                        <th key={h} className="px-2 py-2 text-left" style={{ color: "rgba(130,170,210,1)", borderBottom: "1px solid rgba(0,80,130,0.5)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: "UP001", name: detailForm.name, idCard: detailForm.idCard, unit: detailForm.unit, current: "三级", target: "二级", date: "2025-03-01", status: "审批通过" },
                      { id: "UP002", name: detailForm.name, idCard: detailForm.idCard, unit: detailForm.unit, current: "二级", target: "一级", date: "2026-01-15", status: "待审批" },
                    ].map((r) => (
                      <tr key={r.id} className="hover:bg-[rgba(4,40,80,0.6)]">
                        <td className="px-2 py-2" style={{ color: "rgba(120,180,240,1)", fontFamily: "monospace" }}>{r.id}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(200,220,240,1)" }}>{r.name}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(130,160,200,1)", fontFamily: "monospace" }}>{r.idCard}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(130,170,210,1)" }}>{r.unit}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(150,190,230,1)" }}>{r.current}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(0,212,255,1)" }}>{r.target}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(130,160,200,1)" }}>{r.date}</td>
                        <td className="px-2 py-2" style={{ color: r.status === "审批通过" ? "rgba(76,175,80,1)" : "rgba(255,193,7,1)" }}>{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Transfer records */}
            <div className="mb-4">
              <div className="text-xs font-semibold mb-2" style={{ color: "rgba(0, 212, 255, 0.8)", letterSpacing: "0.08em" }}>
                — 飞手调动记录
              </div>
              <div className="tech-card rounded-lg overflow-hidden">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr style={{ background: "rgba(3,20,45,1)" }}>
                      {["调动ID", "飞手姓名", "身份证号", "原单位名称", "目标单位", "调动类型", "申请日期", "交接状态", "审批状态"].map((h) => (
                        <th key={h} className="px-2 py-2 text-left" style={{ color: "rgba(130,170,210,1)", borderBottom: "1px solid rgba(0,80,130,0.5)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: "MV001", name: detailForm.name, idCard: detailForm.idCard, from: detailForm.unit, to: "市局飞行中心", type: "跨单位调动", date: "2024-09-10", handover: "已完成", status: "审批通过" },
                    ].map((r) => (
                      <tr key={r.id} className="hover:bg-[rgba(4,40,80,0.6)]">
                        <td className="px-2 py-2" style={{ color: "rgba(120,180,240,1)", fontFamily: "monospace" }}>{r.id}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(200,220,240,1)" }}>{r.name}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(130,160,200,1)", fontFamily: "monospace" }}>{r.idCard}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(130,170,210,1)" }}>{r.from}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(160,200,240,1)" }}>{r.to}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(0,212,255,1)" }}>{r.type}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(130,160,200,1)" }}>{r.date}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(76,175,80,1)" }}>{r.handover}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(76,175,80,1)" }}>{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Training records */}
            <div className="mb-4">
              <div className="text-xs font-semibold mb-2" style={{ color: "rgba(0, 212, 255, 0.8)", letterSpacing: "0.08em" }}>
                — 飞手培训记录
              </div>
              <div className="tech-card rounded-lg overflow-hidden">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr style={{ background: "rgba(3,20,45,1)" }}>
                      {["培训ID", "飞手姓名", "身份证号", "所属单位名称", "课程名称", "类型", "时长", "完成日期", "结果"].map((h) => (
                        <th key={h} className="px-2 py-2 text-left" style={{ color: "rgba(130,170,210,1)", borderBottom: "1px solid rgba(0,80,130,0.5)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: "TR001", name: detailForm.name, idCard: detailForm.idCard, unit: detailForm.unit, course: "警用无人机基础飞行", type: "初训", hours: "16h", date: "2024-05-20", result: "合格" },
                      { id: "TR002", name: detailForm.name, idCard: detailForm.idCard, unit: detailForm.unit, course: "夜航与复杂气象飞行", type: "复训", hours: "8h", date: "2025-02-11", result: "优秀" },
                    ].map((r) => (
                      <tr key={r.id} className="hover:bg-[rgba(4,40,80,0.6)]">
                        <td className="px-2 py-2" style={{ color: "rgba(120,180,240,1)", fontFamily: "monospace" }}>{r.id}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(200,220,240,1)" }}>{r.name}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(130,160,200,1)", fontFamily: "monospace" }}>{r.idCard}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(130,170,210,1)" }}>{r.unit}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(160,200,240,1)" }}>{r.course}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(0,212,255,1)" }}>{r.type}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(160,200,240,1)" }}>{r.hours}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(130,160,200,1)" }}>{r.date}</td>
                        <td className="px-2 py-2" style={{ color: r.result === "合格" || r.result === "优秀" ? "rgba(76,175,80,1)" : "rgba(255,167,38,1)" }}>{r.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Task records */}
            <div className="mb-4">
              <div className="text-xs font-semibold mb-2" style={{ color: "rgba(0, 212, 255, 0.8)", letterSpacing: "0.08em" }}>
                — 飞手任务记录
              </div>
              <div className="tech-card rounded-lg overflow-hidden">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr style={{ background: "rgba(3,20,45,1)" }}>
                      {["任务ID", "飞手姓名", "身份证号", "所属单位名称", "任务名称", "执行时间", "关联设备", "任务状态"].map((h) => (
                        <th key={h} className="px-2 py-2 text-left" style={{ color: "rgba(130,170,210,1)", borderBottom: "1px solid rgba(0,80,130,0.5)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: "TS001", name: detailForm.name, idCard: detailForm.idCard, unit: detailForm.unit, task: "城市重点区域巡逻", time: "2025-03-02 09:30", device: "高空瞭望3号", status: "已完成" },
                      { id: "TS002", name: detailForm.name, idCard: detailForm.idCard, unit: detailForm.unit, task: "夜间治安巡逻", time: "2025-03-05 22:10", device: "巡逻一号", status: "执行中" },
                    ].map((r) => (
                      <tr key={r.id} className="hover:bg-[rgba(4,40,80,0.6)]">
                        <td className="px-2 py-2" style={{ color: "rgba(120,180,240,1)", fontFamily: "monospace" }}>{r.id}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(200,220,240,1)" }}>{r.name}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(130,160,200,1)", fontFamily: "monospace" }}>{r.idCard}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(130,170,210,1)" }}>{r.unit}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(160,200,240,1)" }}>{r.task}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(130,160,200,1)" }}>{r.time}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(160,200,240,1)" }}>{r.device}</td>
                        <td className="px-2 py-2" style={{ color: r.status === "已完成" ? "rgba(76,175,80,1)" : "rgba(0, 188, 212, 1)" }}>{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Resignation records */}
            <div>
              <div className="text-xs font-semibold mb-2" style={{ color: "rgba(0, 212, 255, 0.8)", letterSpacing: "0.08em" }}>
                — 飞手离职记录
              </div>
              <div className="tech-card rounded-lg overflow-hidden">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr style={{ background: "rgba(3,20,45,1)" }}>
                      {["离职ID", "飞手姓名", "身份证号", "所属单位名称", "离职日期", "交接状态", "审批状态"].map((h) => (
                        <th key={h} className="px-2 py-2 text-left" style={{ color: "rgba(130,170,210,1)", borderBottom: "1px solid rgba(0,80,130,0.5)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: "LE001", name: detailForm.name, idCard: detailForm.idCard, unit: detailForm.unit, date: "2027-08-31", handover: "已完成", status: "已离职归档" },
                    ].map((r) => (
                      <tr key={r.id} className="hover:bg-[rgba(4,40,80,0.6)]">
                        <td className="px-2 py-2" style={{ color: "rgba(120,180,240,1)", fontFamily: "monospace" }}>{r.id}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(200,220,240,1)" }}>{r.name}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(130,160,200,1)", fontFamily: "monospace" }}>{r.idCard}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(130,170,210,1)" }}>{r.unit}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(130,160,200,1)" }}>{r.date}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(76,175,80,1)" }}>{r.handover}</td>
                        <td className="px-2 py-2" style={{ color: "rgba(160,160,200,1)" }}>{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      {showImport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(4, 10, 24, 0.85)" }}
          onClick={() => setShowImport(false)}
        >
          <div
            className="tech-card rounded-lg p-5 w-[900px] max-h-[86vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm font-semibold" style={{ color: "rgba(210, 230, 250, 1)" }}>批量导入飞手（Excel）</div>
                <div className="text-[11px]" style={{ color: "rgba(120, 150, 190, 1)" }}>
                  按模板准备飞手基础信息与资质信息，支持一次性导入多名飞手，字段校验不通过的记录会提示错误信息。
                </div>
              </div>
              <button
                className="text-xs px-3 py-1 rounded"
                style={{ color: "rgba(140, 180, 210, 1)", background: "rgba(10, 30, 60, 1)" }}
                onClick={() => setShowImport(false)}
              >
                关闭
              </button>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <div
                  className="mb-3 p-4 rounded"
                  style={{ background: "rgba(4, 20, 50, 1)", border: "1px solid rgba(0, 120, 190, 0.5)" }}
                >
                  <div className="text-xs font-semibold mb-2" style={{ color: "rgba(200,220,245,1)" }}>
                    使用说明
                  </div>
                  <ol className="text-[11px] space-y-1.5" style={{ color: "rgba(130,160,200,1)" }}>
                    <li>1. 点击下方【下载模板（Excel）】，按要求填写飞手基础信息和资质信息。</li>
                    <li>2. 必填字段：人员编号、姓名、性别、身份证号、联系方式、所属单位类型、所属单位名称。</li>
                    <li>3. 资质信息必填：证书类型、证书编号、发证机关、有效期（起止日期）、执照等级。</li>
                    <li>4. 日期格式建议使用 YYYY-MM-DD，证书类型可选择官方枚举或填写“其他”。</li>
                    <li>5. 导入时系统会校验字段格式，错误数据将提示具体行号和错误原因。</li>
                  </ol>
                </div>
                <button
                  className="btn-primary-blue text-xs px-3 py-2 mb-4"
                  onClick={() => {
                    const header = [
                      "人员编号",
                      "姓名",
                      "性别",
                      "身份证号",
                      "联系方式",
                      "所属单位类型",
                      "所属单位名称",
                      "证书类型",
                      "证书编号",
                      "发证机关",
                      "有效期起",
                      "有效期止",
                      "执照等级",
                    ];
                    const csv = header.map((h) => `"${h}"`).join(",");
                    const blob = new Blob(["\uFEFF" + csv + "\r\n"], {
                      type: "text/csv;charset=utf-8;",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "飞手批量导入模板.csv";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  下载模板（Excel）
                </button>
                <div
                  className="mt-2 p-4 rounded border-dashed"
                  style={{
                    border: "1px dashed rgba(0, 120, 190, 0.7)",
                    background: "rgba(4, 20, 50, 0.9)",
                    color: "rgba(130,160,200,1)",
                    fontSize: 11,
                  }}
                >
                  <div className="mb-2">上传填写好的 Excel 文件</div>
                  <input
                    type="file"
                    accept=".xls,.xlsx,.csv"
                    className="text-[11px]"
                    style={{ color: "rgba(180,210,240,1)" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        console.log("Pilot Excel file selected:", file.name);
                      }
                    }}
                  />
                  <div className="mt-1 text-[10px]" style={{ color: "rgba(110,140,180,1)" }}>
                    支持 Excel / CSV，单文件大小不超过 20MB。
                  </div>
                </div>
              </div>
              <div style={{ width: 260 }}>
                <div
                  className="p-4 rounded"
                  style={{ background: "rgba(4, 20, 50, 1)", border: "1px solid rgba(60,90,140,0.9)" }}
                >
                  <div className="text-xs font-semibold mb-2" style={{ color: "rgba(210,230,250,1)" }}>
                    字段校验规则
                  </div>
                  <div className="space-y-1.5 text-[11px]" style={{ color: "rgba(150,180,215,1)" }}>
                    <div>• 人员编号：全局唯一，不可重复（必填）</div>
                    <div>• 姓名：不超过 30 字符（必填）</div>
                    <div>• 性别：男 / 女（必填）</div>
                    <div>• 身份证号：18 位合法身份证格式（必填）</div>
                    <div>• 联系方式：手机号或座机号（必填）</div>
                    <div>• 所属单位类型：分局 / 派出所 / 班组 / 其他（必填）</div>
                    <div>• 所属单位名称：文本，不超过 50 字符（必填）</div>
                    <div>• 证书类型：枚举或“其他”（必填）</div>
                    <div>• 证书编号：不超过 50 字符（必填）</div>
                    <div>• 发证机关：不超过 50 字符（必填）</div>
                    <div>• 有效期：起止日期，格式 YYYY-MM-DD（必填）</div>
                    <div>• 执照等级：文本，不超过 30 字符（必填）</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(4, 10, 24, 0.85)" }}
          onClick={() => setShowCreate(false)}
        >
          <div
            className="tech-card rounded-lg p-5 w-[880px] max-h-[86vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="text-sm font-semibold" style={{ color: "rgba(210, 230, 250, 1)" }}>新增飞手建档</div>
                <div className="text-[11px]" style={{ color: "rgba(120, 150, 190, 1)" }}>
                  完整录入基础信息、飞手资质与附件材料，支持后续资质监管与任务调度。
                </div>
              </div>
              <button
                className="text-xs px-3 py-1 rounded"
                style={{ color: "rgba(140, 180, 210, 1)", background: "rgba(10, 30, 60, 1)" }}
                onClick={() => setShowCreate(false)}
              >
                关闭
              </button>
            </div>

            <div className="flex gap-4 border-b border-[rgba(0,80,130,0.5)] mb-4">
              {[
                { key: "basic", label: "基础信息" },
                { key: "cert", label: "飞手资质信息" },
                { key: "files", label: "附件上传" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setCreateTab(tab.key as typeof createTab)}
                  className="px-3 py-2 text-xs"
                  style={{
                    borderBottom: createTab === tab.key ? "2px solid rgba(0,212,255,1)" : "2px solid transparent",
                    color: createTab === tab.key ? "rgba(0,212,255,1)" : "rgba(120,150,190,1)",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {createTab === "basic" && (
              <div
                className="space-y-3 text-xs"
                style={{ color: "rgba(160,190,220,1)", position: "relative", paddingTop: "4px" }}
              >
                {/* 固定在基础信息区域右上角的一寸照 */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 4,
                  }}
                >
                  <div className="form-label" style={{ marginBottom: 2 }}>
                    人员一寸照
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById("pilot-avatar-input") as HTMLInputElement | null;
                      input?.click();
                    }}
                    style={{
                      width: 80,
                      height: 104,
                      borderRadius: 6,
                      border: "1px solid rgba(0,120,190,0.7)",
                      background: "rgba(15,23,42,0.95)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                  >
                    {basicForm.avatarUrl ? (
                      <img
                        src={basicForm.avatarUrl}
                        alt="一寸照预览"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: 10,
                          color: "rgba(100,140,180,1)",
                          textAlign: "center",
                          padding: "0 4px",
                        }}
                      >
                        点击上传一寸照
                      </span>
                    )}
                  </button>
                  <input
                    id="pilot-avatar-input"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = URL.createObjectURL(file);
                      setBasicForm((f) => ({ ...f, avatarUrl: url }));
                    }}
                  />
                  <div
                    className="text-[10px]"
                    style={{ color: "rgba(110,140,180,1)", marginTop: 2 }}
                  >
                    建议 295×413 像素，JPG/PNG。
                  </div>
                </div>

                {/* 左侧两列基础字段，右侧留出头像的空间，通过 padding-right 控制 */}
                <div
                  className="grid grid-cols-2 gap-3 items-start"
                  style={{ paddingRight: 140 }}
                >
                  <div>
                    <div className="form-label">人员编号</div>
                    <input
                      className="form-input"
                      value={basicForm.id}
                      readOnly
                    />
                  </div>
                  <div>
                    <div className="form-label">姓名 *</div>
                    <input
                      className="form-input"
                      value={basicForm.name}
                      onChange={(e) => setBasicForm((f) => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <div className="form-label">性别</div>
                    <select
                      className="form-input"
                      value={basicForm.gender}
                      onChange={(e) => setBasicForm((f) => ({ ...f, gender: e.target.value }))}
                    >
                      <option>男</option>
                      <option>女</option>
                    </select>
                  </div>
                  <div>
                    <div className="form-label">身份证号</div>
                    <input
                      className="form-input"
                      value={basicForm.idCard}
                      onChange={(e) => setBasicForm((f) => ({ ...f, idCard: e.target.value }))}
                    />
                  </div>
                  <div>
                    <div className="form-label">年龄</div>
                    <input
                      className="form-input"
                      value={basicForm.age}
                      onChange={(e) => setBasicForm((f) => ({ ...f, age: e.target.value }))}
                    />
                  </div>
                  <div>
                    <div className="form-label">政治面貌</div>
                    <input
                      className="form-input"
                      value={basicForm.politics}
                      onChange={(e) => setBasicForm((f) => ({ ...f, politics: e.target.value }))}
                    />
                  </div>
                  <div>
                    <div className="form-label">联系方式</div>
                    <input
                      className="form-input"
                      value={basicForm.phone}
                      onChange={(e) => setBasicForm((f) => ({ ...f, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <div className="form-label">所属单位（类型）</div>
                    <select
                      className="form-input"
                      value={basicForm.unitCategory}
                      onChange={(e) => setBasicForm((f) => ({ ...f, unitCategory: e.target.value }))}
                    >
                      <option>分局</option>
                      <option>派出所</option>
                      <option>班组</option>
                      <option>其他</option>
                    </select>
                  </div>
                  <div>
                    <div className="form-label">所属单位名称</div>
                    <input
                      className="form-input"
                      value={basicForm.unitName}
                      onChange={(e) => setBasicForm((f) => ({ ...f, unitName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <div className="form-label">入职时间</div>
                    <input
                      type="date"
                      className="form-input"
                      value={basicForm.entryDate}
                      onChange={(e) => setBasicForm((f) => ({ ...f, entryDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <div className="form-label">劳动合同期限</div>
                    <input
                      className="form-input"
                      value={basicForm.contractPeriod}
                      onChange={(e) => setBasicForm((f) => ({ ...f, contractPeriod: e.target.value }))}
                    />
                  </div>
                  <div>
                    <div className="form-label">紧急联系人</div>
                    <input
                      className="form-input"
                      value={basicForm.emergencyContact}
                      onChange={(e) => setBasicForm((f) => ({ ...f, emergencyContact: e.target.value }))}
                    />
                  </div>
                  <div>
                    <div className="form-label">学历</div>
                    <input
                      className="form-input"
                      value={basicForm.education}
                      onChange={(e) => setBasicForm((f) => ({ ...f, education: e.target.value }))}
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="form-label">从业经历</div>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder="填写过往飞行单位、任务类型等经历"
                      value={basicForm.experience}
                      onChange={(e) => setBasicForm((f) => ({ ...f, experience: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {createTab === "cert" && (
              <div className="space-y-3 text-xs" style={{ color: "rgba(160,190,220,1)" }}>
                <div className="flex items-center gap-4 mb-2">
                  <span>是否持证：</span>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      checked={certForm.hasCert === "yes"}
                      onChange={() => setCertForm((f) => ({ ...f, hasCert: "yes" }))}
                    />
                    是
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      checked={certForm.hasCert === "no"}
                      onChange={() => setCertForm((f) => ({ ...f, hasCert: "no" }))}
                    />
                    否
                  </label>
                </div>
                {certForm.hasCert === "yes" && (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <div className="form-label">证书类型</div>
                        <select
                          className="form-input"
                          value={certForm.type}
                          onChange={(e) => setCertForm((f) => ({ ...f, type: e.target.value }))}
                        >
                          <option value="">请选择</option>
                          <option>警航培训合格证</option>
                          <option>CAAC视距内Ⅲ类</option>
                          <option>CAAC教员证</option>
                          <option>机长证</option>
                          <option>其他</option>
                        </select>
                      </div>
                      {certForm.type === "其他" && (
                        <div>
                          <div className="form-label">其他类型</div>
                          <input
                            className="form-input"
                            value={certForm.typeOther}
                            onChange={(e) => setCertForm((f) => ({ ...f, typeOther: e.target.value }))}
                          />
                        </div>
                      )}
                      <div>
                        <div className="form-label">证书编号</div>
                        <input
                          className="form-input"
                          value={certForm.number}
                          onChange={(e) => setCertForm((f) => ({ ...f, number: e.target.value }))}
                        />
                      </div>
                      <div>
                        <div className="form-label">发证机关</div>
                        <input
                          className="form-input"
                          value={certForm.issuer}
                          onChange={(e) => setCertForm((f) => ({ ...f, issuer: e.target.value }))}
                        />
                      </div>
                      <div>
                        <div className="form-label">有效期起</div>
                        <input
                          type="date"
                          className="form-input"
                          value={certForm.validFrom}
                          onChange={(e) => setCertForm((f) => ({ ...f, validFrom: e.target.value }))}
                        />
                      </div>
                      <div>
                        <div className="form-label">有效期止</div>
                        <input
                          type="date"
                          className="form-input"
                          value={certForm.validTo}
                          onChange={(e) => setCertForm((f) => ({ ...f, validTo: e.target.value }))}
                        />
                      </div>
                      <div>
                        <div className="form-label">执照等级</div>
                        <input
                          className="form-input"
                          value={certForm.level}
                          onChange={(e) => setCertForm((f) => ({ ...f, level: e.target.value }))}
                        />
                      </div>
                      <div>
                        <div className="form-label">考核成绩</div>
                        <input
                          className="form-input"
                          value={certForm.score}
                          onChange={(e) => setCertForm((f) => ({ ...f, score: e.target.value }))}
                        />
                      </div>
                      <div>
                        <div className="form-label">培训机构</div>
                        <input
                          className="form-input"
                          value={certForm.org}
                          onChange={(e) => setCertForm((f) => ({ ...f, org: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="form-label">上传证书（PDF/JPG/PNG）</div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="form-input"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (!certForm.number) {
                            setCertForm((f) => ({
                              ...f,
                              number: f.number || "AUTO-" + Math.floor(Math.random() * 100000),
                              type: f.type || "警航培训合格证",
                              validTo: f.validTo || new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().slice(0, 10),
                            }));
                          }
                        }}
                      />
                      <div className="text-[11px] mt-1" style={{ color: "rgba(120,150,190,1)" }}>
                        系统将自动识别证书编号、有效期、证书类型，识别结果可在上方字段中人工校正。
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {createTab === "files" && (
              <div className="space-y-3 text-xs" style={{ color: "rgba(160,190,220,1)" }}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="form-label">身份证扫描件</div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="form-input"
                      onChange={(e) =>
                        setFilesForm((f) => ({
                          ...f,
                          idCardFile: e.target.files?.[0]?.name || "",
                        }))
                      }
                    />
                  </div>
                  <div>
                    <div className="form-label">学历证明</div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="form-input"
                      onChange={(e) =>
                        setFilesForm((f) => ({
                          ...f,
                          degreeFile: e.target.files?.[0]?.name || "",
                        }))
                      }
                    />
                  </div>
                  <div>
                    <div className="form-label">无犯罪记录证明</div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="form-input"
                      onChange={(e) =>
                        setFilesForm((f) => ({
                          ...f,
                          criminalRecordFile: e.target.files?.[0]?.name || "",
                        }))
                      }
                    />
                  </div>
                  <div>
                    <div className="form-label">体检报告</div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="form-input"
                      onChange={(e) =>
                        setFilesForm((f) => ({
                          ...f,
                          healthFile: e.target.files?.[0]?.name || "",
                        }))
                      }
                    />
                  </div>
                  {certForm.hasCert === "yes" && (
                    <div>
                      <div className="form-label">飞手证书</div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="form-input"
                        onChange={(e) =>
                          setFilesForm((f) => ({
                            ...f,
                            pilotCertFile: e.target.files?.[0]?.name || "",
                          }))
                        }
                      />
                    </div>
                  )}
                </div>
                <div className="text-[11px]" style={{ color: "rgba(120,150,190,1)" }}>
                  注：选择“有证书”的飞手必须上传飞手证书附件。
                </div>
              </div>
            )}

            <div className="mt-5 flex justify-end gap-3 text-xs">
              <button
                className="px-4 py-2 rounded"
                style={{ background: "rgba(16,38,76,1)", color: "rgba(140,180,210,1)" }}
                onClick={() => setShowCreate(false)}
              >
                取消
              </button>
              <button
                className="px-5 py-2 rounded"
                style={{ background: "rgba(0,130,200,0.9)", color: "#fff", boxShadow: "0 0 10px rgba(0,212,255,0.25)" }}
                onClick={handleCreateSubmit}
              >
                提交建档
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PilotArchive;