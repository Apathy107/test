import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ClipboardList, Plus } from "lucide-react";
import { jsPDF } from "jspdf";
import WorkOrderList from "../components/WorkOrderList";
import WorkOrderDetail from "../components/WorkOrderDetail";
import {
  getUrbanWorkOrders,
  addWorkOrder,
  updateWorkOrder,
  type UrbanWorkOrder,
  type WorkOrderSource,
  type WorkOrderType,
} from "../data/urbanWorkOrders";

/** 将工单列表导出为 PDF */
function exportOrdersToPdf(orders: UrbanWorkOrder[], filename: string) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const colWidths = [22, 35, 18, 12, 35, 18];
  const headers = ["工单编号", "工单名称", "事件类型", "工单类型", "位置", "状态"];
  let y = 14;
  doc.setFontSize(14);
  doc.text("工单报告", 14, y);
  y += 8;
  doc.setFontSize(10);
  doc.text(`生成时间：${new Date().toLocaleString("zh-CN")}  共 ${orders.length} 条`, 14, y);
  y += 10;
  doc.setFontSize(9);
  headers.forEach((h, i) => {
    const x = 14 + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
    doc.text(h, x, y);
  });
  y += 6;
  orders.forEach((o, idx) => {
    if (y > 270) {
      doc.addPage();
      y = 14;
    }
    const row = [
      o.id,
      o.name.length > 12 ? o.name.slice(0, 12) + "…" : o.name,
      o.eventType,
      o.orderType ?? "—",
      o.location.length > 14 ? o.location.slice(0, 14) + "…" : o.location,
      o.statusLabel,
    ];
    row.forEach((cell, i) => {
      const x = 14 + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
      doc.text(String(cell), x, y);
    });
    y += 6;
  });
  doc.save(filename);
}

const defaultOrders: UrbanWorkOrder[] = [
  {
    id: "WO202506130001",
    name: "T001-违建识别-20250613",
    eventType: "违建",
    orderType: "日常巡查",
    thumbnail: "https://picsum.photos/seed/wo1/400/240",
    location: "解放路28号",
    coords: "31.2304°N, 121.4737°E",
    status: "pending",
    statusLabel: "未下发",
    createdAt: "2025-06-13 10:45",
    assignee: "城管队-第3组",
    source: "AI识别",
    reporter: "系统",
    handler: "—",
    processType: "巡查发现",
  },
  {
    id: "WO202506130002",
    name: "T002-垃圾识别-20250613",
    eventType: "垃圾堆放",
    orderType: "专项处置",
    thumbnail: "https://picsum.photos/seed/wo2/400/240",
    location: "人民广场东侧",
    coords: "31.2296°N, 121.4736°E",
    status: "active",
    statusLabel: "已下发",
    createdAt: "2025-06-13 10:30",
    assignee: "城管队-第3组",
    source: "AI识别",
    reporter: "系统",
    handler: "城管队-第3组",
    processType: "现场处置",
  },
  {
    id: "WO202506130003",
    name: "T003-车流统计-20250613",
    eventType: "占道经营",
    orderType: "日常巡查",
    thumbnail: "https://picsum.photos/seed/wo3/400/240",
    location: "中山北路路口",
    coords: "31.2318°N, 121.4728°E",
    status: "active",
    statusLabel: "处置中",
    createdAt: "2025-06-13 10:15",
    assignee: "交通队-执法组",
    source: "人工识别",
    reporter: "市民举报",
    handler: "交通队-执法组",
    processType: "执法处置",
  },
  {
    id: "WO202506130004",
    name: "T004-水质分析-20250613",
    eventType: "水质污染",
    orderType: "专项处置",
    thumbnail: "https://picsum.photos/seed/wo4/400/240",
    location: "苏州河段A-3",
    coords: "31.2258°N, 121.4810°E",
    status: "done",
    statusLabel: "已办结",
    createdAt: "2025-06-13 09:45",
    assignee: "环保局",
    source: "第三方推送",
    reporter: "环保平台",
    handler: "环保局",
    processType: "专项治理",
  },
];

function mergeOrders(fromStorage: UrbanWorkOrder[], defaults: UrbanWorkOrder[]): UrbanWorkOrder[] {
  const ids = new Set(fromStorage.map((o) => o.id));
  const combined = [...fromStorage];
  defaults.forEach((o) => {
    if (!ids.has(o.id)) {
      combined.push(o);
      ids.add(o.id);
    }
  });
  return combined.length ? combined : defaults;
}

const WorkOrder: React.FC = () => {
  const location = useLocation();
  const highlightId = (location.state as { highlightId?: string })?.highlightId;
  const fromStorage = useMemo(() => getUrbanWorkOrders(), []);
  const orders = useMemo(() => mergeOrders(fromStorage, defaultOrders), [fromStorage]);
  const [orderList, setOrderList] = useState<UrbanWorkOrder[]>(orders);
  const [selectedOrder, setSelectedOrder] = useState<UrbanWorkOrder>(
    () => orders.find((o) => o.id === highlightId) || orders[0]
  );
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [editOrder, setEditOrder] = useState<UrbanWorkOrder | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [mediaModal, setMediaModal] = useState<{ type: "image" | "video"; url: string } | null>(null);
  const [newForm, setNewForm] = useState<Partial<UrbanWorkOrder>>({
    name: "",
    eventType: "违建",
    orderType: "日常巡查",
    location: "",
    coords: "",
    source: "AI识别",
    reporter: "",
    handler: "",
    processType: "巡查发现",
    status: "pending",
    statusLabel: "未下发",
    assignee: "—",
    thumbnail: "https://picsum.photos/seed/wo/400/240",
    evidenceImages: [],
    evidenceVideos: [],
  });

  const handleCreateOrder = () => {
    if (!newForm.name?.trim() || !newForm.location?.trim()) return;
    const added = addWorkOrder({
      name: newForm.name.trim(),
      eventType: newForm.eventType || "违建",
      orderType: (newForm.orderType as WorkOrderType) || "日常巡查",
      thumbnail: newForm.thumbnail || "https://picsum.photos/seed/wo/400/240",
      location: newForm.location.trim(),
      coords: newForm.coords?.trim() || "—",
      status: "pending",
      statusLabel: "未下发",
      assignee: newForm.assignee || "—",
      source: (newForm.source as WorkOrderSource) || "AI识别",
      reporter: newForm.reporter?.trim() || "—",
      handler: newForm.handler?.trim() || "—",
      processType: newForm.processType?.trim() || "—",
      evidenceImages: newForm.evidenceImages ?? [],
      evidenceVideos: newForm.evidenceVideos ?? [],
      desc: newForm.desc,
    });
    setOrderList((prev) => [...prev, added]);
    setSelectedOrder(added);
    setNewOrderOpen(false);
    setNewForm({
      name: "",
      eventType: "违建",
      orderType: "日常巡查",
      location: "",
      coords: "",
      source: "AI识别",
      reporter: "",
      handler: "",
      processType: "巡查发现",
      status: "pending",
      statusLabel: "未下发",
      assignee: "—",
      thumbnail: "https://picsum.photos/seed/wo/400/240",
      evidenceImages: [],
      evidenceVideos: [],
    });
  };

  const handleSaveEdit = () => {
    if (!editOrder) return;
    updateWorkOrder(editOrder.id, { ...editOrder });
    setOrderList((prev) => prev.map((o) => (o.id === editOrder.id ? editOrder : o)));
    setSelectedOrder(editOrder);
    setEditOrder(null);
  };

  const handleExportSelected = () => {
    const toExport = orderList.filter((o) => selectedIds.has(o.id));
    if (toExport.length === 0) return;
    const blob = new Blob([JSON.stringify(toExport, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `工单导出_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /** 生成报告：将选中的工单记录导出为 PDF */
  const handleGenerateReportPdf = () => {
    const toExport = orderList.filter((o) => selectedIds.has(o.id));
    if (toExport.length === 0) return;
    exportOrdersToPdf(toExport, `工单报告_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleArchiveCurrent = () => {
    updateWorkOrder(selectedOrder.id, { status: "done", statusLabel: "已办结" });
    setOrderList((prev) => prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: "done", statusLabel: "已办结" } : o)));
    setSelectedOrder((prev) => ({ ...prev, status: "done", statusLabel: "已办结" }));
  };

  const handleUploadEvidence = (files: File[]) => {
    if (files.length) alert(`已选择 ${files.length} 个文件（可接入实际上传接口）`);
  };

  const handleGenerateReportCurrent = () => {
    exportOrdersToPdf([selectedOrder], `工单_${selectedOrder.id}.pdf`);
  };

  return (
    <div
      className="flex flex-col"
      style={{ height: "100%", background: "rgb(8,18,38)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-3"
        style={{
          borderBottom: "1px solid rgba(0,212,255,0.2)",
          background: "rgba(10,24,54,0.8)",
          flexShrink: 0,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-1 rounded-full"
            style={{
              height: "24px",
              background: "rgb(0,212,255)",
              boxShadow: "0 0 8px rgba(0,212,255,0.6)",
            }}
          />
          <div>
            <h1
              className="text-base font-bold"
              style={{ color: "rgb(0,212,255)" }}
            >
              工单管理
            </h1>
            <div className="text-xs" style={{ color: "rgb(80,130,160)" }}>
              Work Order Management
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {[
            { label: "今日新增", value: "8", color: "rgb(0,212,255)" },
            { label: "处置中", value: "5", color: "rgb(255,180,0)" },
            { label: "已办结", value: "3", color: "rgb(80,230,180)" },
            { label: "超时预警", value: "1", color: "rgb(255,80,100)" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex flex-col items-center text-xs">
              <span className="text-lg font-bold" style={{ color }}>
                {value}
              </span>
              <span style={{ color: "rgb(80,130,160)" }}>{label}</span>
            </div>
          ))}
          <button
            onClick={() => setNewOrderOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded text-sm ml-4"
            style={{
              background: "rgba(0,212,255,0.15)",
              border: "1px solid rgba(0,212,255,0.4)",
              color: "rgb(0,212,255)",
            }}
          >
            <Plus size={16} />
            新建工单
          </button>
        </div>
      </div>

      {/* Sync indicator */}
      <div
        className="flex items-center gap-3 px-6 py-1.5"
        style={{
          borderBottom: "1px solid rgba(0,212,255,0.1)",
          background: "rgba(0,212,255,0.03)",
          flexShrink: 0,
        }}
      >
        <div className="flex items-center gap-1.5 text-xs">
          <ClipboardList size={12} style={{ color: "rgb(80,230,180)" }} />
          <span style={{ color: "rgb(80,130,160)" }}>
            已与一网统管平台同步 · 最后同步:
          </span>
          <span style={{ color: "rgb(80,230,180)" }}>
            2025-06-13 10:58:32
          </span>
        </div>
        <div
          className="rounded-full"
          style={{
            width: "6px",
            height: "6px",
            background: "rgb(80,230,180)",
            boxShadow: "0 0 4px rgba(80,230,180,0.8)",
          }}
        />
        <span className="text-xs" style={{ color: "rgb(80,230,180)" }}>
          实时同步中
        </span>
      </div>

      {/* 多选批量操作栏 */}
      {selectedIds.size > 0 && (
        <div
          className="flex items-center gap-4 px-6 py-2 flex-wrap"
          style={{
            borderBottom: "1px solid rgba(0,212,255,0.15)",
            background: "rgba(0,212,255,0.06)",
            flexShrink: 0,
          }}
        >
          <span className="text-sm" style={{ color: "rgb(200,235,255)" }}>
            已选 {selectedIds.size} 条
          </span>
          <button
            onClick={handleGenerateReportPdf}
            className="text-xs px-3 py-1.5 rounded flex items-center gap-1.5"
            style={{
              background: "rgba(0,212,255,0.15)",
              border: "1px solid rgba(0,212,255,0.4)",
              color: "rgb(0,212,255)",
            }}
          >
            生成报告
          </button>
          <button
            onClick={handleExportSelected}
            className="text-xs px-3 py-1.5 rounded flex items-center gap-1.5"
            style={{
              background: "rgba(80,230,180,0.15)",
              border: "1px solid rgba(80,230,180,0.4)",
              color: "rgb(80,230,180)",
            }}
          >
            导出选中
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-xs px-3 py-1.5 rounded"
            style={{
              background: "transparent",
              border: "1px solid rgba(148,163,184,0.5)",
              color: "rgb(148,163,184)",
            }}
          >
            取消选择
          </button>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-1 min-h-0">
        {/* Work Order List */}
        <div
          className="flex-1 overflow-hidden"
          style={{ borderRight: "1px solid rgba(0,212,255,0.15)" }}
        >
          <WorkOrderList
            orders={orderList}
            selectedId={selectedOrder.id}
            onSelect={(o) => setSelectedOrder(o)}
            selectedIds={selectedIds}
            onToggleSelect={(id) => {
              setSelectedIds((prev) => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
              });
            }}
            onToggleSelectAll={(checked) => {
              if (checked) setSelectedIds(new Set(orderList.map((o) => o.id)));
              else setSelectedIds(new Set());
            }}
            onEdit={(o) => setEditOrder({ ...o })}
            onImageClick={(url) => setMediaModal({ type: "image", url })}
            onVideoClick={(url) => setMediaModal({ type: "video", url })}
          />
        </div>

        {/* Work Order Detail */}
        <div
          className="flex flex-col overflow-hidden"
          style={{
            width: "320px",
            minWidth: "320px",
            background: "rgba(10,24,54,0.5)",
          }}
        >
          <WorkOrderDetail
            orderId={selectedOrder.id}
            orderName={selectedOrder.name}
            eventType={selectedOrder.eventType}
            orderType={selectedOrder.orderType}
            status={selectedOrder.status}
            statusLabel={selectedOrder.statusLabel}
            location={selectedOrder.location}
            coords={selectedOrder.coords}
            createdAt={selectedOrder.createdAt}
            assignee={selectedOrder.assignee}
            thumbnail={selectedOrder.thumbnail}
            source={selectedOrder.source}
            reporter={selectedOrder.reporter}
            handler={selectedOrder.handler}
            processType={selectedOrder.processType}
            evidenceImages={selectedOrder.evidenceImages}
            evidenceVideos={selectedOrder.evidenceVideos}
            desc={selectedOrder.desc}
            onUploadEvidence={handleUploadEvidence}
            onArchive={handleArchiveCurrent}
            onApprove={() => {}}
            onReject={() => {}}
            onGenerateReport={handleGenerateReportCurrent}
          />
        </div>
      </div>

      {/* 图片/视频大图弹窗 */}
      {mediaModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
          }}
          onClick={() => setMediaModal(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            {mediaModal.type === "image" ? (
              <img
                src={mediaModal.url}
                alt="大图"
                style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }}
              />
            ) : (
              <div
                className="rounded flex items-center justify-center"
                style={{
                  width: "min(640px, 90vw)",
                  height: "360px",
                  background: "rgba(0,30,70,0.9)",
                  border: "1px solid rgba(0,212,255,0.3)",
                }}
              >
                <video
                  src={mediaModal.url}
                  controls
                  autoPlay
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
                {!mediaModal.url && (
                  <span style={{ color: "rgb(120,180,210)" }}>视频播放（可接入真实视频 URL）</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 编辑工单弹窗 */}
      {editOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "rgb(15,25,45)",
              border: "1px solid rgba(0,212,255,0.3)",
              borderRadius: "8px",
              padding: "24px",
              width: "440px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div className="text-base font-semibold mb-4" style={{ color: "rgb(0,212,255)" }}>
              编辑工单
            </div>
            <div className="space-y-3 text-sm">
              {[
                { key: "name" as const, label: "工单名称", value: editOrder.name },
                { key: "eventType" as const, label: "事件类型", value: editOrder.eventType },
                { key: "orderType" as const, label: "工单类型", value: editOrder.orderType ?? "日常巡查" },
                { key: "location" as const, label: "位置", value: editOrder.location },
                { key: "coords" as const, label: "经纬度", value: editOrder.coords },
                { key: "source" as const, label: "工单来源", value: editOrder.source },
                { key: "reporter" as const, label: "上报人", value: editOrder.reporter },
                { key: "handler" as const, label: "处理人", value: editOrder.handler },
                { key: "processType" as const, label: "处理类型", value: editOrder.processType },
                { key: "statusLabel" as const, label: "工单状态", value: editOrder.statusLabel },
              ].map(({ key, label, value }) => (
                <div key={key}>
                  <label className="block mb-1" style={{ color: "rgb(80,130,160)" }}>{label}</label>
                  {key === "eventType" || key === "orderType" || key === "source" ? (
                    <select
                      value={String(value ?? "")}
                      onChange={(e) => setEditOrder((o) => o ? { ...o, [key]: e.target.value } : null)}
                      className="w-full px-3 py-2 rounded border outline-none"
                      style={{ background: "rgba(0,30,70,0.5)", borderColor: "rgba(0,100,160,0.35)", color: "rgb(200,235,255)" }}
                    >
                      {key === "orderType"
                        ? (["日常巡查", "专项处置", "应急响应", "其他"] as const).map((t) => <option key={t} value={t}>{t}</option>)
                        : key === "source"
                        ? (["AI识别", "人工识别", "第三方推送"] as const).map((t) => <option key={t} value={t}>{t}</option>)
                        : ["违建", "垃圾堆放", "占道经营", "水质污染", "绿化破坏"].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  ) : (
                    <input
                      value={String(value ?? "")}
                      onChange={(e) => setEditOrder((o) => o ? { ...o, [key]: e.target.value } : null)}
                      className="w-full px-3 py-2 rounded border outline-none"
                      style={{ background: "rgba(0,30,70,0.5)", borderColor: "rgba(0,100,160,0.35)", color: "rgb(200,235,255)" }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditOrder(null)}
                className="px-4 py-2 rounded text-sm"
                style={{ background: "rgba(0,40,90,0.5)", color: "rgb(140,180,220)", border: "1px solid rgba(0,80,140,0.35)" }}
              >
                取消
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded text-sm"
                style={{ background: "rgba(0,120,180,0.7)", color: "rgb(220,245,255)", border: "1px solid rgba(0,212,255,0.5)" }}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新建工单 弹窗 */}
      {newOrderOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "rgb(15,25,45)",
              border: "1px solid rgba(0,212,255,0.3)",
              borderRadius: "8px",
              padding: "24px",
              width: "420px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div className="text-base font-semibold mb-4" style={{ color: "rgb(0,212,255)" }}>
              新建工单
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block mb-1" style={{ color: "rgb(80,130,160)" }}>工单名称 *</label>
                <input
                  value={newForm.name ?? ""}
                  onChange={(e) => setNewForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded border outline-none"
                  style={{ background: "rgba(0,30,70,0.5)", borderColor: "rgba(0,100,160,0.35)", color: "rgb(200,235,255)" }}
                  placeholder="请输入工单名称"
                />
              </div>
              <div>
                <label className="block mb-1" style={{ color: "rgb(80,130,160)" }}>事件类型</label>
                <select
                  value={newForm.eventType ?? "违建"}
                  onChange={(e) => setNewForm((f) => ({ ...f, eventType: e.target.value }))}
                  className="w-full px-3 py-2 rounded border outline-none"
                  style={{ background: "rgba(0,30,70,0.5)", borderColor: "rgba(0,100,160,0.35)", color: "rgb(200,235,255)" }}
                >
                  {["违建", "垃圾堆放", "占道经营", "水质污染", "绿化破坏"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1" style={{ color: "rgb(80,130,160)" }}>工单类型</label>
                <select
                  value={newForm.orderType ?? "日常巡查"}
                  onChange={(e) => setNewForm((f) => ({ ...f, orderType: e.target.value as WorkOrderType }))}
                  className="w-full px-3 py-2 rounded border outline-none"
                  style={{ background: "rgba(0,30,70,0.5)", borderColor: "rgba(0,100,160,0.35)", color: "rgb(200,235,255)" }}
                >
                  {(["日常巡查", "专项处置", "应急响应", "其他"] as const).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1" style={{ color: "rgb(80,130,160)" }}>位置 *</label>
                <input
                  value={newForm.location ?? ""}
                  onChange={(e) => setNewForm((f) => ({ ...f, location: e.target.value }))}
                  className="w-full px-3 py-2 rounded border outline-none"
                  style={{ background: "rgba(0,30,70,0.5)", borderColor: "rgba(0,100,160,0.35)", color: "rgb(200,235,255)" }}
                  placeholder="请输入位置"
                />
              </div>
              <div>
                <label className="block mb-1" style={{ color: "rgb(80,130,160)" }}>经纬度</label>
                <input
                  value={newForm.coords ?? ""}
                  onChange={(e) => setNewForm((f) => ({ ...f, coords: e.target.value }))}
                  className="w-full px-3 py-2 rounded border outline-none"
                  style={{ background: "rgba(0,30,70,0.5)", borderColor: "rgba(0,100,160,0.35)", color: "rgb(200,235,255)" }}
                  placeholder="如 31.2304°N, 121.4737°E"
                />
              </div>
              <div>
                <label className="block mb-1" style={{ color: "rgb(80,130,160)" }}>工单来源</label>
                <select
                  value={newForm.source ?? "AI识别"}
                  onChange={(e) => setNewForm((f) => ({ ...f, source: e.target.value as WorkOrderSource }))}
                  className="w-full px-3 py-2 rounded border outline-none"
                  style={{ background: "rgba(0,30,70,0.5)", borderColor: "rgba(0,100,160,0.35)", color: "rgb(200,235,255)" }}
                >
                  <option value="AI识别">AI识别</option>
                  <option value="人工识别">人工识别</option>
                  <option value="第三方推送">第三方推送</option>
                </select>
              </div>
              <div>
                <label className="block mb-1" style={{ color: "rgb(80,130,160)" }}>上报人</label>
                <input
                  value={newForm.reporter ?? ""}
                  onChange={(e) => setNewForm((f) => ({ ...f, reporter: e.target.value }))}
                  className="w-full px-3 py-2 rounded border outline-none"
                  style={{ background: "rgba(0,30,70,0.5)", borderColor: "rgba(0,100,160,0.35)", color: "rgb(200,235,255)" }}
                  placeholder="请输入上报人"
                />
              </div>
              <div>
                <label className="block mb-1" style={{ color: "rgb(80,130,160)" }}>处理人</label>
                <input
                  value={newForm.handler ?? ""}
                  onChange={(e) => setNewForm((f) => ({ ...f, handler: e.target.value }))}
                  className="w-full px-3 py-2 rounded border outline-none"
                  style={{ background: "rgba(0,30,70,0.5)", borderColor: "rgba(0,100,160,0.35)", color: "rgb(200,235,255)" }}
                  placeholder="请输入处理人"
                />
              </div>
              <div>
                <label className="block mb-1" style={{ color: "rgb(80,130,160)" }}>处理类型</label>
                <input
                  value={newForm.processType ?? ""}
                  onChange={(e) => setNewForm((f) => ({ ...f, processType: e.target.value }))}
                  className="w-full px-3 py-2 rounded border outline-none"
                  style={{ background: "rgba(0,30,70,0.5)", borderColor: "rgba(0,100,160,0.35)", color: "rgb(200,235,255)" }}
                  placeholder="如 巡查发现、现场处置"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setNewOrderOpen(false)}
                className="px-4 py-2 rounded text-sm"
                style={{ background: "rgba(0,40,90,0.5)", color: "rgb(140,180,220)", border: "1px solid rgba(0,80,140,0.35)" }}
              >
                取消
              </button>
              <button
                onClick={handleCreateOrder}
                className="px-4 py-2 rounded text-sm"
                style={{ background: "rgba(0,120,180,0.7)", color: "rgb(220,245,255)", border: "1px solid rgba(0,212,255,0.5)" }}
              >
                保存并生成工单
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkOrder;