import React, { useState, useRef, useMemo, useEffect } from "react";
import { FileText, Download, Eye, RefreshCw, CheckCircle, Clock, X, Upload } from "lucide-react";
import html2pdf from "html2pdf.js";
import { violationResultsCases } from "./ViolationResults";
import * as RadixProgress from "@radix-ui/react-progress";

const reportTemplates = [
  { id: "daily", label: "日报" },
  { id: "weekly", label: "周报" },
  { id: "monthly", label: "月报" },
  { id: "special", label: "专项" },
];

interface ReportRecord {
  id: string;
  name: string;
  type: string;
  createTime: string;
  creator: string;
  status: "done" | "generating" | "failed";
  size: string;
  dateFrom?: string;
  dateTo?: string;
}

const initialReports: ReportRecord[] = [
  { id: "R001", name: "2025-07-11 日报", type: "日报", createTime: "2025-07-11 10:00", creator: "系统自动", status: "done", size: "1.2 MB" },
  { id: "R002", name: "2025年第28周 周报", type: "周报", createTime: "2025-07-07 08:00", creator: "张三", status: "done", size: "3.5 MB" },
  { id: "R003", name: "2025年6月 月报", type: "月报", createTime: "2025-07-01 09:00", creator: "系统自动", status: "done", size: "8.7 MB" },
  { id: "R004", name: "化工园区专项执法报告", type: "专项", createTime: "2025-07-10 17:30", creator: "李四", status: "generating", size: "—" },
];

const statusCfg = {
  done: { label: "已完成", color: "rgba(0, 205, 135, 1)", bg: "rgba(0, 50, 35, 0.75)", icon: CheckCircle },
  generating: { label: "生成中", color: "rgba(0, 210, 240, 1)", bg: "rgba(0, 50, 82, 0.75)", icon: RefreshCw },
  failed: { label: "失败", color: "rgba(255, 80, 80, 1)", bg: "rgba(78, 8, 8, 0.75)", icon: Clock },
};

const inputStyle: React.CSSProperties = {
  padding: "6px 9px",
  border: "1px solid rgba(0, 110, 170, 0.38)",
  borderRadius: "4px",
  fontSize: "11px",
  outline: "none",
  color: "rgba(155, 205, 245, 1)",
  background: "rgba(4, 16, 46, 1)",
};

function formatDateRange(from: string, to: string) {
  return `自 ${from.replace(/-/g, "/")} 至 ${to.replace(/-/g, "/")}`;
}

const thTd = { border: "1px solid #ccc", padding: "6px 8px", textAlign: "left" as const };

const ReportGeneration: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("daily");
  const [dateFrom, setDateFrom] = useState("2025-07-11");
  const [dateTo, setDateTo] = useState("2025-07-11");
  const [customPdfFile, setCustomPdfFile] = useState<File | null>(null);
  const [customTemplateName, setCustomTemplateName] = useState("");
  const [reports, setReports] = useState<ReportRecord[]>(initialReports);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewReport, setPreviewReport] = useState<ReportRecord | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(-1);
  const [downloadWithRange, setDownloadWithRange] = useState<{ dateFrom: string; dateTo: string; filename: string } | null>(null);
  const reportContentRef = useRef<HTMLDivElement>(null);

  const templateOptions = useMemo(() => {
    const list = [...reportTemplates];
    if (customPdfFile) list.push({ id: "custom", label: customTemplateName || "自定义(已上传)" });
    return list;
  }, [customPdfFile, customTemplateName]);

  const reportDateFrom = downloadWithRange?.dateFrom ?? (previewOpen && previewReport?.dateFrom ? previewReport.dateFrom : dateFrom);
  const reportDateTo = downloadWithRange?.dateTo ?? (previewOpen && previewReport?.dateTo ? previewReport.dateTo : dateTo);

  const filteredCases = useMemo(() => {
    const from = reportDateFrom.replace(/-/g, "");
    const to = reportDateTo.replace(/-/g, "");
    return violationResultsCases.filter((c) => {
      const t = (c.time || "").replace(/-|\s|:/g, "").slice(0, 8);
      return t >= from && t <= to;
    });
  }, [reportDateFrom, reportDateTo]);

  const overview = useMemo(() => {
    const total = filteredCases.length;
    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = {};
    filteredCases.forEach((c) => {
      const s = c.caseType || "其他";
      byStatus[s] = (byStatus[s] || 0) + 1;
      byType[c.type] = (byType[c.type] || 0) + 1;
    });
    const typeDist = Object.entries(byType)
      .sort((a, b) => b[1] - a[1])
      .map(([name, n]) => `${name}${Math.round((n / total) * 100)}%`)
      .join("、");
    return { total, byStatus, typeDist };
  }, [filteredCases]);

  const handleGenerate = () => {
    const name =
      selectedTemplate === "custom"
        ? `自定义报告 ${new Date().toLocaleString("zh-CN", { dateStyle: "short", timeStyle: "short" })}`
        : selectedTemplate === "daily"
          ? `${dateFrom} 日报`
          : selectedTemplate === "weekly"
            ? `${dateFrom} 周报`
            : selectedTemplate === "monthly"
              ? `${dateFrom.slice(0, 7)} 月报`
              : `专项报告 ${dateFrom}`;
    const newRecord: ReportRecord = {
      id: "R" + Date.now(),
      name,
      type: templateOptions.find((t) => t.id === selectedTemplate)?.label ?? selectedTemplate,
      createTime: new Date().toLocaleString("zh-CN", { dateStyle: "short", timeStyle: "short" }).replace(/\//g, "-"),
      creator: "当前用户",
      status: "done",
      size: "—",
      dateFrom,
      dateTo,
    };
    setReports((prev) => [newRecord, ...prev]);
  };

  const handlePreview = (r: ReportRecord) => {
    setPreviewReport(r);
    setPreviewOpen(true);
  };

  const handleDownload = async (r: ReportRecord) => {
    if (selectedTemplate === "custom" && customPdfFile) {
      setDownloadProgress(0);
      await new Promise((res) => setTimeout(res, 300));
      const url = URL.createObjectURL(customPdfFile);
      const a = document.createElement("a");
      a.href = url;
      a.download = customPdfFile.name || "自定义报告.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setDownloadProgress(100);
      setTimeout(() => setDownloadProgress(-1), 500);
      return;
    }
    setDownloadProgress(0);
    setDownloadWithRange({ dateFrom: r.dateFrom ?? dateFrom, dateTo: r.dateTo ?? dateTo, filename: r.name });
  };

  useEffect(() => {
    if (!downloadWithRange || !reportContentRef.current) return;
    const el = reportContentRef.current;
    let t1: ReturnType<typeof setTimeout>, t2: ReturnType<typeof setTimeout>;
    const run = async () => {
      t1 = setTimeout(() => setDownloadProgress(40), 200);
      t2 = setTimeout(() => setDownloadProgress(70), 600);
      const opt = {
        margin: 10,
        filename: `${downloadWithRange.filename}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };
      try {
        await html2pdf().set(opt).from(el).save();
        setDownloadProgress(100);
      } finally {
        clearTimeout(t1);
        clearTimeout(t2);
        setTimeout(() => { setDownloadProgress(-1); setDownloadWithRange(null); }, 400);
      }
    };
    run();
  }, [downloadWithRange]);

  const reportHtml = (
    <div
      style={{
        background: "#fff",
        color: "#111",
        padding: "24px",
        fontFamily: "Microsoft YaHei, sans-serif",
        fontSize: "12px",
        maxWidth: "210mm",
      }}
    >
      <h1 style={{ textAlign: "center", fontSize: "18px", marginBottom: "8px" }}>AI识别事件列表统计报告</h1>
      <p style={{ textAlign: "center", fontSize: "11px", color: "#444", marginBottom: "20px" }}>
        报告周期: {formatDateRange(reportDateFrom, reportDateTo)} · 生成时间: {new Date().toLocaleDateString("zh-CN")} · 数据来源: 无人机智能巡检系统
      </p>

      <h2 style={{ fontSize: "14px", marginTop: "20px", marginBottom: "8px" }}>一、报告概览</h2>
      <p style={{ marginBottom: "10px", lineHeight: 1.6 }}>
        本报告统计了在选定周期内，无人机自动识别并上报的各类事件的总体情况。
      </p>
      <ul style={{ marginLeft: "20px", marginBottom: "16px" }}>
        <li>事件总数: {overview.total} 起</li>
        <li>
          按处置状态统计:{" "}
          {Object.entries(overview.byStatus)
            .map(([k, v]) => `${k}: ${v} 起`)
            .join("，")}
        </li>
        <li>主要事件类型分布:（{overview.typeDist || "—"}）</li>
      </ul>

      <h2 style={{ fontSize: "14px", marginTop: "20px", marginBottom: "8px" }}>二、详细事件列表</h2>
      <p style={{ marginBottom: "10px" }}>以下表格列出了所有识别到的事件的详细信息。</p>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "8px", fontSize: "11px" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={thTd}>序号</th>
            <th style={thTd}>事件编号</th>
            <th style={thTd}>事件名称</th>
            <th style={thTd}>任务/设备</th>
            <th style={thTd}>车牌</th>
            <th style={thTd}>处置状态</th>
            <th style={thTd}>事件地址</th>
            <th style={thTd}>时间</th>
            <th style={thTd}>类型</th>
            <th style={thTd}>经纬度</th>
          </tr>
        </thead>
        <tbody>
          {filteredCases.map((c, i) => (
            <tr key={c.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={thTd}>{i + 1}</td>
              <td style={thTd}>{c.caseNo}</td>
              <td style={thTd}>{c.type}</td>
              <td style={thTd}>{c.algo || "—"}</td>
              <td style={thTd}>{c.plate}</td>
              <td style={thTd}>{c.caseType || "—"}</td>
              <td style={thTd}>{c.location}</td>
              <td style={thTd}>{c.time}</td>
              <td style={thTd}>{c.type}</td>
              <td style={thTd}>—</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredCases.map((c, i) => (
        <div key={c.id} style={{ marginTop: "16px", pageBreakInside: "avoid" }}>
          <div style={{ fontSize: "11px", color: "#333", marginBottom: "4px" }}>
            事件 {i + 1}（{c.caseNo}）违法成果图
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {Array.from({ length: c.evidence }, (_, j) => (
              <div
                key={j}
                style={{
                  width: "120px",
                  height: "90px",
                  background: "#e8e8e8",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#888",
                  fontSize: "10px",
                }}
              >
                证据 {j + 1}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "rgba(200, 232, 255, 1)", margin: 0 }}>报告生成</h2>
        <p style={{ fontSize: "11px", color: "rgba(70, 138, 200, 1)", margin: "3px 0 0" }}>自动生成执法统计报告</p>
      </div>

      <div className="enf-card" style={{ padding: "18px" }}>
        <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(140, 188, 228, 1)", marginBottom: "12px" }}>新建报告</div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: "180px" }}>
            <label style={{ fontSize: "10px", color: "rgba(65, 128, 190, 1)", display: "block", marginBottom: "5px" }}>报告类型</label>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {templateOptions.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  style={{
                    padding: "6px 10px",
                    fontSize: "11px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    background: selectedTemplate === t.id ? "rgba(0, 110, 170, 0.55)" : "rgba(4, 16, 46, 1)",
                    color: selectedTemplate === t.id ? "rgba(0, 210, 240, 1)" : "rgba(90, 155, 215, 1)",
                    border: selectedTemplate === t.id ? "1px solid rgba(0, 185, 225, 0.52)" : "1px solid rgba(0, 110, 170, 0.32)",
                    fontWeight: selectedTemplate === t.id ? 600 : 400,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: "10px", color: "rgba(65, 128, 190, 1)", display: "block", marginBottom: "5px" }}>上传自定义模板（PDF）</label>
            <label style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "6px 12px", fontSize: "11px", background: "rgba(4, 16, 46, 1)", border: "1px solid rgba(0, 110, 170, 0.38)", borderRadius: "4px", cursor: "pointer", color: "rgba(155, 205, 245, 1)" }}>
              <Upload size={12} /> 选择文件
              <input
                type="file"
                accept=".pdf,application/pdf"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setCustomPdfFile(f);
                    setCustomTemplateName(f.name.replace(/\.pdf$/i, "") || "自定义(已上传)");
                  }
                }}
              />
            </label>
            {customPdfFile && <span style={{ marginLeft: "8px", fontSize: "10px", color: "rgba(90, 155, 215, 1)" }}>{customPdfFile.name}</span>}
          </div>
          <div>
            <label style={{ fontSize: "10px", color: "rgba(65, 128, 190, 1)", display: "block", marginBottom: "5px" }}>时间范围</label>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={inputStyle} />
              <span style={{ color: "rgba(50, 95, 158, 1)", fontSize: "11px" }}>-</span>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => {
                handleGenerate();
              }}
              style={{
                padding: "7px 18px",
                background: "rgba(0, 110, 170, 0.65)",
                color: "rgba(0, 210, 240, 1)",
                border: "1px solid rgba(0, 185, 225, 0.52)",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <FileText size={13} /> 立即生成
            </button>
          </div>
        </div>
      </div>

      {downloadProgress >= 0 && (
        <div className="enf-card" style={{ padding: "12px 16px" }}>
          <div style={{ fontSize: "11px", color: "rgba(140, 188, 228, 1)", marginBottom: "6px" }}>下载进度</div>
          <RadixProgress.Root value={downloadProgress === -1 ? 100 : downloadProgress} style={{ height: "8px", background: "rgba(0, 50, 82, 0.6)", borderRadius: "4px", overflow: "hidden" }}>
            <RadixProgress.Indicator style={{ height: "100%", background: "rgba(0, 210, 240, 0.9)", width: `${downloadProgress === -1 ? 100 : downloadProgress}%`, transition: "width 0.2s" }} />
          </RadixProgress.Root>
        </div>
      )}

      <div className="enf-card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "11px 16px", borderBottom: "1px solid rgba(0, 110, 170, 0.22)", fontSize: "12px", fontWeight: 600, color: "rgba(140, 188, 228, 1)" }}>历史报告</div>
        <div style={{ display: "flex", padding: "7px 16px", background: "rgba(4, 14, 40, 1)", fontSize: "10px", color: "rgba(65, 128, 190, 1)", fontWeight: 600 }}>
          <span style={{ flex: 2 }}>报告名称</span>
          <span style={{ flex: 1 }}>类型</span>
          <span style={{ flex: 2 }}>创建时间</span>
          <span style={{ flex: 1 }}>创建人</span>
          <span style={{ flex: 1 }}>大小</span>
          <span style={{ flex: 1 }}>状态</span>
          <span style={{ width: "90px" }}>操作</span>
        </div>
        {reports.map((r, idx) => {
          const cfg = statusCfg[r.status];
          const Icon = cfg.icon;
          return (
            <div
              key={r.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 16px",
                borderBottom: idx < reports.length - 1 ? "1px solid rgba(0, 80, 130, 0.15)" : "none",
                background: idx % 2 === 0 ? "rgba(8, 24, 60, 1)" : "rgba(6, 18, 50, 1)",
                fontSize: "11px",
              }}
            >
              <div style={{ flex: 2, display: "flex", alignItems: "center", gap: "7px" }}>
                <FileText size={13} style={{ color: "rgba(255, 80, 80, 0.72)", flexShrink: 0 }} />
                <span style={{ color: "rgba(155, 205, 245, 1)" }}>{r.name}</span>
              </div>
              <span style={{ flex: 1 }}>
                <span style={{ padding: "1px 6px", background: "rgba(0, 55, 100, 0.55)", color: "rgba(0, 185, 225, 1)", borderRadius: "2px", fontSize: "10px" }}>{r.type}</span>
              </span>
              <span style={{ flex: 2, color: "rgba(65, 128, 190, 1)", fontFamily: "monospace", fontSize: "10px" }}>{r.createTime}</span>
              <span style={{ flex: 1, color: "rgba(110, 172, 228, 1)" }}>{r.creator}</span>
              <span style={{ flex: 1, color: "rgba(65, 128, 190, 1)" }}>{r.size}</span>
              <div style={{ flex: 1 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", padding: "1px 6px", background: cfg.bg, color: cfg.color, borderRadius: "2px", fontSize: "10px" }}>
                  <Icon size={10} className={r.status === "generating" ? "spin" : ""} />
                  {cfg.label}
                </span>
              </div>
              <div style={{ width: "90px", display: "flex", gap: "4px" }}>
                {r.status === "done" && (
                  <>
                    <button onClick={() => handlePreview(r)} style={{ padding: "3px 7px", fontSize: "10px", background: "rgba(0, 55, 100, 0.42)", color: "rgba(0, 185, 225, 1)", border: "none", borderRadius: "3px", cursor: "pointer", display: "flex", alignItems: "center", gap: "2px" }}>
                      <Eye size={10} /> 预览
                    </button>
                    <button onClick={() => handleDownload(r)} style={{ padding: "3px 7px", fontSize: "10px", background: "rgba(0, 55, 40, 0.42)", color: "rgba(0, 185, 135, 1)", border: "none", borderRadius: "3px", cursor: "pointer" }}>
                      <Download size={10} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {previewOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setPreviewOpen(false)}>
          <div style={{ background: "rgba(8, 24, 60, 1)", border: "1px solid rgba(0, 185, 225, 0.4)", borderRadius: "8px", maxWidth: "90vw", maxHeight: "90vh", overflow: "auto", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button type="button" style={{ position: "sticky", top: "8px", left: "100%", marginLeft: "8px", float: "right", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "4px", color: "#fff", cursor: "pointer", padding: "4px" }} onClick={() => setPreviewOpen(false)}>
              <X size={18} />
            </button>
            <div style={{ padding: "16px", clear: "both" }}>
              {previewReport && selectedTemplate === "custom" && customPdfFile ? (
                <iframe title="自定义模板预览" src={URL.createObjectURL(customPdfFile)} style={{ width: "800px", height: "600px", border: "none" }} />
              ) : (
                reportHtml
              )}
            </div>
          </div>
        </div>
      )}

      {/* 用于 PDF 生成的隐藏内容（与预览一致） */}
      <div ref={reportContentRef} style={{ position: "absolute", left: "-9999px", top: 0 }} aria-hidden="true">
        {reportHtml}
      </div>
    </div>
  );
};

export default ReportGeneration;
