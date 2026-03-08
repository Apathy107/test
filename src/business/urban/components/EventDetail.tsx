import React, { useState, useRef } from "react";
import { CheckCircle, XCircle, Edit3, Upload, ZoomIn } from "lucide-react";
import StatusBadge from "./StatusBadge";

const EVIDENCE_STORAGE_KEY = "urban_event_evidence";

interface EventDetailProps {
  eventId?: string;
  location?: string;
  coords?: string;
  time?: string;
  algo?: string;
  taskId?: string;
  desc?: string;
  status?: "pending" | "active" | "done" | "error";
  thumbnail?: string;
  /** 审核状态：已驳回 | 已通过 */
  auditStatus?: "已驳回" | "已通过";
  onApprove?: () => void;
  onReject?: () => void;
}

const EventDetail: React.FC<EventDetailProps> = ({
  eventId = "EV2025001",
  location = "解放路28号",
  coords = "31.2304°N, 121.4737°E",
  time = "2025-06-13 10:32:15",
  algo = "违建识别v3.2",
  taskId = "T001",
  desc = "AI检测到疑似违规搭建，面积约15㎡，位于楼顶区域，需要人工审核确认。",
  status = "pending",
  thumbnail = "https://picsum.photos/seed/ev1/400/240",
  auditStatus,
  onApprove,
  onReject,
}) => {
  const [eventType, setEventType] = useState("违建");
  const [annotation, setAnnotation] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadEvidence = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    try {
      const raw = window.localStorage.getItem(EVIDENCE_STORAGE_KEY);
      const map: Record<string, string[]> = raw ? JSON.parse(raw) : {};
      const list = map[eventId] || [];
      for (let i = 0; i < files.length; i++) {
        list.push(files[i].name);
      }
      map[eventId] = list;
      window.localStorage.setItem(EVIDENCE_STORAGE_KEY, JSON.stringify(map));
      alert(`已上传 ${files.length} 个附件到本地（模拟入库）`);
    } catch (err) {
      console.warn(err);
      alert("上传失败");
    }
    e.target.value = "";
  };

  console.log("EventDetail rendered for event:", eventId);

  return (
    <div data-cmp="EventDetail" className="flex flex-col h-full">
      {/* Image Preview */}
      <div
        className="relative"
        style={{ background: "rgb(5,15,35)" }}
      >
        <img
          src={thumbnail}
          alt="event"
          className="w-full object-cover"
          style={{ height: "180px" }}
        />
        {/* Simulated AI annotation box */}
        <div
          className="absolute"
          style={{
            top: "30%",
            left: "25%",
            width: "40%",
            height: "35%",
            border: "2px solid rgb(255,180,0)",
            boxShadow: "0 0 8px rgba(255,180,0,0.4)",
          }}
        >
          <span
            className="absolute top-0 left-0 text-xs px-1"
            style={{
              background: "rgb(255,180,0)",
              color: "rgb(8,18,38)",
              fontSize: "9px",
            }}
          >
            违建 92.4%
          </span>
        </div>
        <button
          className="absolute bottom-2 right-2 flex items-center gap-1 text-xs px-2 py-1 rounded"
          style={{
            background: "rgba(8,18,38,0.8)",
            border: "1px solid rgba(0,212,255,0.3)",
            color: "rgb(0,212,255)",
            fontSize: "10px",
          }}
        >
          <ZoomIn size={11} />
          放大查看
        </button>
      </div>

      {/* Info */}
      <div className="flex-1 overflow-auto px-4 py-3 space-y-3">
        {/* Basic Info */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium" style={{ color: "rgb(0,212,255)" }}>
              {eventId}
            </span>
            <div className="flex items-center gap-2">
              {auditStatus && (
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    background: auditStatus === "已驳回" ? "rgba(255,80,100,0.15)" : "rgba(80,230,180,0.15)",
                    color: auditStatus === "已驳回" ? "rgb(255,80,100)" : "rgb(80,230,180)",
                  }}
                >
                  {auditStatus}
                </span>
              )}
              <StatusBadge status={status} />
            </div>
          </div>
          <div className="space-y-1.5">
            {[
              ["位置", location],
              ["坐标", coords],
              ["时间", time],
              ["算法", algo],
              ["任务ID", taskId],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start gap-2 text-xs">
                <span className="flex-shrink-0" style={{ color: "rgb(80,130,160)", width: "36px" }}>
                  {k}
                </span>
                <span style={{ color: "rgb(200,235,255)" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Description */}
        <div
          className="rounded p-3"
          style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)" }}
        >
          <div className="text-xs mb-1.5" style={{ color: "rgb(0,212,255)" }}>
            🤖 AI 描述
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "rgb(200,235,255)" }}>
            {desc}
          </p>
        </div>

        {/* Manual Review */}
        <div>
          <div className="text-xs mb-2 flex items-center gap-1" style={{ color: "rgb(120,180,210)" }}>
            <Edit3 size={11} />
            人工审核
          </div>
          <div className="mb-2">
            <div className="text-xs mb-1" style={{ color: "rgb(80,130,160)" }}>事件类型</div>
            <div className="flex flex-wrap gap-1.5">
              {["违建", "垃圾堆放", "占道经营", "水质污染", "绿化破坏"].map((type) => (
                <button
                  key={type}
                  onClick={() => setEventType(type)}
                  className="text-xs px-2.5 py-1 rounded"
                  style={{
                    background: eventType === type ? "rgba(0,212,255,0.2)" : "rgba(0,212,255,0.05)",
                    border: `1px solid ${eventType === type ? "rgba(0,212,255,0.5)" : "rgba(0,212,255,0.15)"}`,
                    color: eventType === type ? "rgb(0,212,255)" : "rgb(120,180,210)",
                    fontSize: "10px",
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={annotation}
            onChange={(e) => setAnnotation(e.target.value)}
            placeholder="补充备注（可选）..."
            className="w-full text-xs p-2 rounded resize-none outline-none"
            rows={2}
            style={{
              background: "rgba(0,212,255,0.05)",
              border: "1px solid rgba(0,212,255,0.15)",
              color: "rgb(200,235,255)",
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div
        className="px-4 py-3 flex gap-2"
        style={{ borderTop: "1px solid rgba(0,212,255,0.15)" }}
      >
        <button
          onClick={onReject}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded text-sm"
          style={{
            background: "rgba(255,60,80,0.1)",
            border: "1px solid rgba(255,60,80,0.3)",
            color: "rgb(255,80,100)",
          }}
        >
          <XCircle size={15} />
          驳回
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
          onChange={onFileChange}
        />
        <button
          onClick={handleUploadEvidence}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded text-sm"
          style={{
            background: "rgba(0,212,255,0.08)",
            border: "1px solid rgba(0,212,255,0.25)",
            color: "rgb(0,212,255)",
          }}
        >
          <Upload size={15} />
          上传证据
        </button>
        <button
          onClick={onApprove}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded text-sm"
          style={{
            background: "rgba(80,230,180,0.12)",
            border: "1px solid rgba(80,230,180,0.35)",
            color: "rgb(80,230,180)",
          }}
        >
          <CheckCircle size={15} />
          通过并建单
        </button>
      </div>
    </div>
  );
};

export default EventDetail;