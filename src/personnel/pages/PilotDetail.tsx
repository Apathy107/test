import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import StatusBadge from "@personnel/components/StatusBadge";
import { ArrowLeft, Download } from "lucide-react";

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

const PILOTS_STORAGE_KEY = "personnel.pilots.v1";

export default function PilotDetail() {
  const navigate = useNavigate();
  const { pilotId } = useParams();
  const [exportSections, setExportSections] = useState({
    basic: true,
    qualification: true,
    attachments: true,
    tasks: true,
    training: true,
  });

  const pilot = useMemo(() => {
    if (!pilotId) return null;
    try {
      const raw = localStorage.getItem(PILOTS_STORAGE_KEY);
      if (!raw) return null;
      const arr = JSON.parse(raw) as Pilot[];
      const id = decodeURIComponent(pilotId);
      return arr.find((p) => p.id === id) ?? null;
    } catch {
      return null;
    }
  }, [pilotId]);

  const handleExportDetailPdf = () => {
    if (!pilot) return;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const left = 48;
    let y = 56;

    doc.setFontSize(16);
    doc.text(`飞手详情 - ${pilot.name}（${pilot.id}）`, left, y);
    y += 22;
    doc.setFontSize(10);
    doc.text(`所属单位：${pilot.unit}`, left, y);
    y += 18;

    const addSection = (title: string, lines: string[]) => {
      doc.setFontSize(12);
      doc.text(title, left, y);
      y += 16;
      doc.setFontSize(10);
      for (const line of lines) {
        doc.text(line, left, y);
        y += 14;
        if (y > 760) {
          doc.addPage();
          y = 56;
        }
      }
      y += 8;
    };

    if (exportSections.basic) {
      addSection("基础信息", [
        `性别：${pilot.gender}`,
        `联系方式：${pilot.phone}`,
        `身份证号：${pilot.idCard}`,
        `所属单位：${pilot.unit}`,
      ]);
    }
    if (exportSections.qualification) {
      addSection("资质信息", [
        `持证状态：${pilot.certStatus}`,
        `证书到期：${pilot.certExpiry}`,
      ]);
    }
    if (exportSections.attachments) addSection("附件材料", ["（演示）附件材料导出占位"]);
    if (exportSections.training) addSection("培训记录", ["（演示）培训记录导出占位"]);
    if (exportSections.tasks) addSection("任务记录", ["（演示）任务记录导出占位"]);

    doc.save(`飞手详情_${pilot.id}_${pilot.name}.pdf`);
  };

  if (!pilot) {
    return (
      <div className="tech-card rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => navigate("/personnel/pilot-archive")}
            className="flex items-center gap-2 px-3 py-1 rounded text-sm"
            style={{
              background: "rgba(16,38,76,0.8)",
              border: "1px solid rgba(0,150,200,0.35)",
              color: "rgba(160,200,230,1)",
            }}
          >
            <ArrowLeft size={16} />
            返回列表
          </button>
        </div>
        <div className="text-sm" style={{ color: "rgba(160,190,220,1)" }}>
          未找到该飞手数据（可能尚未导入/保存）。
        </div>
      </div>
    );
  }

  return (
    <div className="tech-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/personnel/pilot-archive")}
            className="flex items-center gap-2 px-3 py-1 rounded text-sm"
            style={{
              background: "rgba(16,38,76,0.8)",
              border: "1px solid rgba(0,150,200,0.35)",
              color: "rgba(160,200,230,1)",
            }}
          >
            <ArrowLeft size={16} />
            返回列表
          </button>
          <div>
            <div className="text-base font-bold" style={{ color: "rgba(200, 220, 240, 1)" }}>
              {pilot.name}
            </div>
            <div className="text-xs" style={{ color: "rgba(80, 120, 160, 1)" }}>
              {pilot.id} · {pilot.unit}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportDetailPdf}
          className="flex items-center gap-2 text-xs px-3 py-1 rounded"
          style={{
            background: "rgba(0, 60, 110, 0.9)",
            color: "rgba(210,230,250,1)",
            border: "1px solid rgba(0, 150, 220, 0.6)",
          }}
        >
          <Download size={14} />
          导出 PDF
        </button>
      </div>

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

      {/* Basic info section with avatar on top-right (red box area) */}
      <div
        className="rounded-lg p-4 mb-4"
        style={{
          background: "rgba(10, 22, 48, 0.55)",
          border: "1px solid rgba(0, 150, 200, 0.25)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 110,
            height: 140,
            borderRadius: 10,
            overflow: "hidden",
            border: "1px solid rgba(0,150,200,0.45)",
            background: "rgba(15, 23, 42, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="飞手一寸照"
        >
          {pilot.avatarUrl ? (
            <img
              src={pilot.avatarUrl}
              alt={pilot.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ color: "rgba(100, 140, 180, 1)", fontSize: 12 }}>
              未上传一寸照
            </div>
          )}
        </div>

        <div style={{ paddingRight: 140 }}>
          <div className="text-xs font-semibold mb-3" style={{ color: "rgba(0, 212, 255, 1)" }}>
            基础信息
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs">
            <div className="flex gap-2">
              <span style={{ color: "rgba(80, 120, 160, 1)" }}>性别：</span>
              <span style={{ color: "rgba(200, 220, 240, 1)" }}>{pilot.gender}</span>
            </div>
            <div className="flex gap-2">
              <span style={{ color: "rgba(80, 120, 160, 1)" }}>身份证号：</span>
              <span style={{ color: "rgba(200, 220, 240, 1)" }}>{pilot.idCard}</span>
            </div>
            <div className="flex gap-2">
              <span style={{ color: "rgba(80, 120, 160, 1)" }}>联系方式：</span>
              <span style={{ color: "rgba(200, 220, 240, 1)" }}>{pilot.phone}</span>
            </div>
            <div className="flex gap-2">
              <span style={{ color: "rgba(80, 120, 160, 1)" }}>所属单位：</span>
              <span style={{ color: "rgba(200, 220, 240, 1)" }}>{pilot.unit}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="rounded-lg p-4"
        style={{
          background: "rgba(10, 22, 48, 0.55)",
          border: "1px solid rgba(0, 150, 200, 0.25)",
        }}
      >
        <div className="text-xs font-semibold mb-3" style={{ color: "rgba(0, 212, 255, 1)" }}>
          资质信息
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          <StatusBadge
            status={pilot.certStatus === "持证" ? "active" : pilot.certStatus === "已过期" ? "expired" : "warning"}
            label={pilot.certStatus}
          />
          <StatusBadge
            status={pilot.taskStatus === "在岗" ? "normal" : pilot.taskStatus === "任务中" ? "info" : pilot.taskStatus === "休假" ? "pending" : "frozen"}
            label={pilot.taskStatus}
          />
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs">
          <div className="flex gap-2">
            <span style={{ color: "rgba(80, 120, 160, 1)" }}>证书到期：</span>
            <span style={{ color: "rgba(200, 220, 240, 1)" }}>{pilot.certExpiry}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

