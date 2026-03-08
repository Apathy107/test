import React, { useState, useRef } from "react";
import { CheckCircle, Upload, Archive, FileText, XCircle } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface WorkOrderDetailProps {
  orderId?: string;
  orderName?: string;
  eventType?: string;
  orderType?: string;
  status?: "pending" | "active" | "done" | "paused";
  statusLabel?: string;
  location?: string;
  coords?: string;
  createdAt?: string;
  assignee?: string;
  desc?: string;
  thumbnail?: string;
  source?: string;
  reporter?: string;
  handler?: string;
  processType?: string;
  evidenceImages?: string[];
  evidenceVideos?: string[];
  /** 上传证据（选择文件夹后回调） */
  onUploadEvidence?: (files: File[]) => void;
  /** 归档完成闭环 */
  onArchive?: () => void;
  /** 审核通过 */
  onApprove?: () => void;
  /** 驳回 */
  onReject?: () => void;
  /** 生成报告（当前工单导出 PDF） */
  onGenerateReport?: () => void;
}

/** 处置流程步骤（参考设计图：任务接收与处置、结果自审、三方复核、闭环归档） */
interface ProcessStep {
  title: string;
  status: "done" | "active" | "pending"; // 绿 / 蓝 / 灰
  operator: string;
  time: string;
  result?: string;
  disposalDesc?: string;
  reviewComment?: string;
  disposalPhotos?: string[];
  hasVideo?: boolean;
}

const defaultProcessSteps: ProcessStep[] = [
  {
    title: "任务接收与处置",
    status: "done",
    operator: "韩兆君",
    time: "2025-12-25 13:30",
    result: "已完成清理",
    disposalDesc: "到达现场后发现为一空纸箱，已移除至应急车道外，路面恢复畅通。",
    disposalPhotos: ["https://picsum.photos/seed/wo1/400/240"],
    hasVideo: true,
  },
  {
    title: "结果自审",
    status: "done",
    operator: "韩兆君",
    time: "2025-12-25 13:45",
    reviewComment: "处置过程规范，照片清晰，确认已闭环。",
  },
  {
    title: "三方复核",
    status: "active",
    operator: "质检员01",
    time: "处理中...",
    reviewComment: "等待最终确认...",
  },
  {
    title: "闭环归档",
    status: "pending",
    operator: "—",
    time: "—",
  },
];

const WorkOrderDetail: React.FC<WorkOrderDetailProps> = ({
  orderId = "WO202506130001",
  orderName = "T001-违建识别-20250613",
  eventType = "违建",
  orderType = "日常巡查",
  status = "pending",
  statusLabel = "未下发",
  location = "解放路28号",
  coords = "31.2304°N, 121.4737°E",
  createdAt = "2025-06-13 10:45",
  assignee = "城管队-第3组",
  desc = "发现疑似违规搭建，面积约15㎡，位于楼顶区域，需要尽快处理。",
  thumbnail = "https://picsum.photos/seed/wo1/400/240",
  source = "AI识别",
  reporter = "—",
  handler = "—",
  processType = "—",
  evidenceImages = [],
  evidenceVideos = [],
  onUploadEvidence,
  onArchive,
  onApprove,
  onReject,
  onGenerateReport,
}) => {
  const [activeSection, setActiveSection] = useState<"info" | "process" | "evidence">("info");
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(defaultProcessSteps);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadEvidence = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const list = Array.from(files);
    onUploadEvidence?.(list);
    e.target.value = "";
  };

  const handleArchive = () => {
    setProcessSteps((prev) =>
      prev.map((s, i) =>
        i === prev.length - 1
          ? { ...s, status: "done" as const, operator: "系统", time: new Date().toISOString().slice(0, 16).replace("T", " ") }
          : s
      )
    );
    onArchive?.();
  };

  console.log("WorkOrderDetail rendered for order:", orderId);

  return (
    <div data-cmp="WorkOrderDetail" className="flex flex-col h-full">
      {/* Order Header */}
      <div
        className="px-4 py-3"
        style={{ borderBottom: "1px solid rgba(0,212,255,0.15)", background: "rgba(6,14,32,0.5)" }}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold" style={{ color: "rgb(0,212,255)" }}>
            {orderId}
          </span>
          <StatusBadge status={status} label={statusLabel} />
        </div>
        <div className="text-xs" style={{ color: "rgb(200,235,255)" }}>
          {orderName}
        </div>
      </div>

      {/* Section Tabs */}
      <div
        className="flex"
        style={{ borderBottom: "1px solid rgba(0,212,255,0.15)" }}
      >
        {[
          { key: "info" as const, label: "基础信息" },
          { key: "process" as const, label: "处置流程" },
          { key: "evidence" as const, label: "证据材料" },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className="flex-1 py-2.5 text-xs transition-all"
            style={{
              background: activeSection === s.key ? "rgba(0,212,255,0.08)" : "transparent",
              borderBottom: activeSection === s.key ? "2px solid rgb(0,212,255)" : "2px solid transparent",
              color: activeSection === s.key ? "rgb(0,212,255)" : "rgb(80,130,160)",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 py-3">
        {/* Info Section - 含基础信息 + 原始证据 */}
        <div style={{ display: activeSection === "info" ? "block" : "none" }}>
          <div className="space-y-2">
            {[
              ["事件类型", eventType],
              ["工单类型", orderType ?? "—"],
              ["事件位置", location],
              ["坐标信息", coords],
              ["工单来源", source],
              ["上报人", reporter],
              ["处理人", handler],
              ["处理类型", processType],
              ["创建时间", createdAt],
              ["责任人员", assignee],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start gap-3 text-xs">
                <span className="flex-shrink-0 w-20" style={{ color: "rgb(80,130,160)" }}>{k}</span>
                <span style={{ color: "rgb(200,235,255)" }}>{v}</span>
              </div>
            ))}
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(0,212,255,0.1)" }}>
              <div className="text-xs mb-1" style={{ color: "rgb(80,130,160)" }}>事件描述</div>
              <p className="text-xs leading-relaxed" style={{ color: "rgb(200,235,255)" }}>{desc}</p>
            </div>
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(0,212,255,0.1)" }}>
              <div className="text-xs mb-2" style={{ color: "rgb(120,180,210)" }}>原始证据</div>
              <div className="flex flex-wrap gap-2">
                {evidenceImages?.length ? (
                  evidenceImages.map((url, i) => (
                    <div key={i} className="rounded overflow-hidden" style={{ width: "80px", height: "56px", background: "rgba(0,0,0,0.3)" }}>
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))
                ) : (
                  <div className="rounded overflow-hidden" style={{ width: "120px", height: "80px", background: "rgba(0,0,0,0.3)" }}>
                    <img src={thumbnail} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                {evidenceVideos?.length ? (
                  evidenceVideos.map((_, i) => (
                    <div key={`v-${i}`} className="rounded flex items-center justify-center" style={{ width: "80px", height: "56px", background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)" }}>
                      <span className="text-xs" style={{ color: "rgb(0,212,255)" }}>视频{i + 1}</span>
                    </div>
                  ))
                ) : null}
                {(!evidenceImages?.length && !evidenceVideos?.length) && !thumbnail ? (
                  <span className="text-xs" style={{ color: "rgb(80,130,160)" }}>暂无原始证据</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Process Section - 处置流程：任务接收与处置、结果自审、三方复核、闭环归档 */}
        <div style={{ display: activeSection === "process" ? "block" : "none" }}>
          <div className="space-y-4">
            {processSteps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className="rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      width: "22px",
                      height: "22px",
                      background:
                        step.status === "done"
                          ? "rgba(80,230,180,0.2)"
                          : step.status === "active"
                          ? "rgba(0,212,255,0.2)"
                          : "rgba(80,130,160,0.2)",
                      border: `1px solid ${
                        step.status === "done"
                          ? "rgba(80,230,180,0.6)"
                          : step.status === "active"
                          ? "rgba(0,212,255,0.6)"
                          : "rgba(80,130,160,0.4)"
                      }`,
                    }}
                  >
                    {step.status === "done" ? (
                      <CheckCircle size={12} style={{ color: "rgb(80,230,180)" }} />
                    ) : (
                      <span
                        className="text-xs"
                        style={{
                          color: step.status === "active" ? "rgb(0,212,255)" : "rgb(80,130,160)",
                          fontSize: "9px",
                        }}
                      >
                        {i + 1}
                      </span>
                    )}
                  </div>
                  {i < processSteps.length - 1 && (
                    <div
                      className="flex-1 w-px my-1"
                      style={{
                        background:
                          step.status === "done" ? "rgba(80,230,180,0.3)" : "rgba(0,212,255,0.1)",
                        minHeight: "8px",
                      }}
                    />
                  )}
                </div>
                <div className="flex-1 pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-xs font-medium"
                      style={{
                        color:
                          step.status === "done"
                            ? "rgb(80,230,180)"
                            : step.status === "active"
                            ? "rgb(0,212,255)"
                            : "rgb(120,180,210)",
                      }}
                    >
                      {step.title}
                    </span>
                    <span className="text-xs" style={{ color: "rgb(80,130,160)", fontSize: "10px" }}>
                      {step.time}
                    </span>
                  </div>
                  <div className="text-xs mb-1" style={{ color: "rgb(120,180,210)" }}>
                    {step.operator}
                  </div>
                  {step.result && (
                    <div className="text-xs mb-1.5" style={{ color: "rgb(200,235,255)" }}>
                      结果: {step.result}
                    </div>
                  )}
                  {step.disposalDesc && (
                    <div className="rounded p-2 mb-2" style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.12)" }}>
                      <div className="text-[10px] mb-1" style={{ color: "rgb(0,212,255)" }}>现场处置描述</div>
                      <p className="text-xs leading-relaxed" style={{ color: "rgb(200,235,255)" }}>{step.disposalDesc}</p>
                    </div>
                  )}
                  {step.disposalPhotos && step.disposalPhotos.length > 0 && (
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <span className="text-[10px] w-full" style={{ color: "rgb(80,130,160)" }}>现场处置照片</span>
                      {step.disposalPhotos.map((url, j) => (
                        <div key={j} className="rounded overflow-hidden" style={{ width: "64px", height: "48px" }}>
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <div className="rounded flex items-center justify-center text-[10px]" style={{ width: "80px", height: "48px", background: "rgba(0,212,255,0.06)", border: "1px dashed rgba(0,212,255,0.2)", color: "rgb(80,130,160)" }}>
                        现场处置
                      </div>
                    </div>
                  )}
                  {step.hasVideo && (
                    <div className="flex items-center gap-1.5 text-[10px] mb-2" style={{ color: "rgb(0,212,255)" }}>
                      <span className="rounded px-2 py-1" style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)" }}>
                        视频记录
                      </span>
                    </div>
                  )}
                  {step.reviewComment !== undefined && (
                    <div className="flex items-start gap-1.5 mt-1">
                      <span className="text-[10px]" style={{ color: "rgb(80,130,160)" }}>审核意见</span>
                      <p className="text-xs flex-1" style={{ color: "rgb(200,235,255)" }}>{step.reviewComment}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence Section - 现场处置证据等 */}
        <div style={{ display: activeSection === "evidence" ? "block" : "none" }}>
          <div className="mb-3">
            <div className="text-xs mb-2" style={{ color: "rgb(120,180,210)" }}>关联证据（证据材料）</div>
            <img
              src={thumbnail}
              alt="evidence"
              className="w-full rounded object-cover"
              style={{ height: "140px", border: "1px solid rgba(0,212,255,0.2)" }}
            />
          </div>
          <div>
            <div className="text-xs mb-2" style={{ color: "rgb(120,180,210)" }}>现场处置证据</div>
            <div
              className="rounded flex items-center justify-center cursor-pointer"
              style={{
                height: "80px",
                background: "rgba(0,212,255,0.03)",
                border: "1px dashed rgba(0,212,255,0.2)",
              }}
              onClick={handleUploadEvidence}
            >
              <div className="text-center">
                <Upload size={20} style={{ color: "rgba(0,212,255,0.3)", margin: "0 auto 4px" }} />
                <div className="text-xs" style={{ color: "rgba(0,212,255,0.4)", fontSize: "10px" }}>
                  处置完成后上传证据（点击选择文件夹）
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 隐藏：选择文件夹上传 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        {...({ webkitdirectory: true, directory: true } as React.InputHTMLAttributes<HTMLInputElement>)}
        onChange={onFileChange}
      />

      {/* Actions */}
      <div
        className="px-4 py-3 flex gap-2 flex-wrap"
        style={{ borderTop: "1px solid rgba(0,212,255,0.15)" }}
      >
        <button
          type="button"
          onClick={handleUploadEvidence}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded"
          style={{
            background: "rgba(0,212,255,0.1)",
            border: "1px solid rgba(0,212,255,0.3)",
            color: "rgb(0,212,255)",
          }}
        >
          <Upload size={12} />上传证据
        </button>
        <button
          type="button"
          onClick={onApprove}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded"
          style={{
            background: "rgba(80,230,180,0.1)",
            border: "1px solid rgba(80,230,180,0.3)",
            color: "rgb(80,230,180)",
          }}
        >
          <CheckCircle size={12} />审核通过
        </button>
        <button
          type="button"
          onClick={onReject}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded"
          style={{
            background: "rgba(255,80,100,0.1)",
            border: "1px solid rgba(255,80,100,0.3)",
            color: "rgb(255,80,100)",
          }}
        >
          <XCircle size={12} />驳回
        </button>
        <button
          type="button"
          onClick={handleArchive}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded"
          style={{
            background: "rgba(255,180,0,0.1)",
            border: "1px solid rgba(255,180,0,0.3)",
            color: "rgb(255,180,0)",
          }}
        >
          <Archive size={12} />归档
        </button>
        <button
          type="button"
          onClick={onGenerateReport}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded ml-auto"
          style={{
            background: "rgba(0,212,255,0.07)",
            border: "1px solid rgba(0,212,255,0.2)",
            color: "rgb(120,180,210)",
          }}
        >
          <FileText size={12} />生成报告
        </button>
      </div>
    </div>
  );
};

export default WorkOrderDetail;