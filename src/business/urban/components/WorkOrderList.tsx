import React, { useState } from "react";
import { Filter, Download, Printer, Search, ChevronUp, ChevronDown, Video, Pencil } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { UrbanWorkOrder } from "../data/urbanWorkOrders";

interface WorkOrderListProps {
  orders?: UrbanWorkOrder[];
  selectedId?: string;
  onSelect?: (order: UrbanWorkOrder) => void;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: (checked: boolean) => void;
  onEdit?: (order: UrbanWorkOrder) => void;
  onImageClick?: (url: string) => void;
  onVideoClick?: (url: string) => void;
}

const WorkOrderList: React.FC<WorkOrderListProps> = ({
  orders = [],
  selectedId,
  onSelect,
  selectedIds = new Set(),
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onImageClick,
  onVideoClick,
}) => {
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [typeFilter, setTypeFilter] = useState("全部");
  const [sourceFilter, setSourceFilter] = useState("全部");
  const [processTypeFilter, setProcessTypeFilter] = useState("全部");
  const [orderTypeFilter, setOrderTypeFilter] = useState("全部");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");

  const filtered = (orders || []).filter((o) => {
    const matchStatus = statusFilter === "全部" || o.statusLabel === statusFilter;
    const matchType = typeFilter === "全部" || o.eventType === typeFilter;
    const matchSource = sourceFilter === "全部" || o.source === sourceFilter;
    const matchProcessType = processTypeFilter === "全部" || o.processType === processTypeFilter;
    const matchOrderType = orderTypeFilter === "全部" || (o.orderType ?? "日常巡查") === orderTypeFilter;
    const matchSearch = search === "" || o.id.includes(search) || o.location.includes(search) || o.name.includes(search);
    const oDate = o.createdAt.slice(0, 10).replace(/-/g, "");
    const matchTimeStart = !timeStart || oDate >= timeStart.replace(/-/g, "");
    const matchTimeEnd = !timeEnd || oDate <= timeEnd.replace(/-/g, "");
    return matchStatus && matchType && matchSearch && matchSource && matchProcessType && matchOrderType && matchTimeStart && matchTimeEnd;
  });

  const toggleSort = (field: string) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  const SortIcon = ({ field }: { field: string }) =>
    sortField === field ? (
      sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />
    ) : (
      <ChevronDown size={12} style={{ opacity: 0.3 }} />
    );

  const typeColors: Record<string, string> = {
    违建: "rgba(255,80,100,0.15)",
    垃圾堆放: "rgba(255,180,0,0.12)",
    占道经营: "rgba(0,212,255,0.12)",
    水质污染: "rgba(80,160,255,0.12)",
  };

  return (
    <div data-cmp="WorkOrderList" className="flex flex-col h-full">
      {/* Filters: 工单来源、处理类型、工单状态、工单类型、时间段 */}
      <div
        className="flex items-center gap-2 px-4 py-2 flex-wrap"
        style={{ borderBottom: "1px solid rgba(0,212,255,0.15)" }}
      >
        <div className="relative flex items-center">
          <Search size={12} className="absolute left-2" style={{ color: "rgb(80,130,160)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="工单编号/位置..."
            className="text-xs pl-6 pr-2 py-1 rounded outline-none"
            style={{
              background: "rgba(0,212,255,0.06)",
              border: "1px solid rgba(0,212,255,0.15)",
              color: "rgb(200,235,255)",
              width: "140px",
            }}
          />
        </div>
        <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="text-xs px-2 py-1 rounded outline-none" style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)", color: "rgb(0,212,255)" }}>
          <option value="全部">工单来源</option>
          <option value="AI识别">AI识别</option>
          <option value="人工识别">人工识别</option>
          <option value="第三方推送">第三方推送</option>
        </select>
        <select value={processTypeFilter} onChange={(e) => setProcessTypeFilter(e.target.value)} className="text-xs px-2 py-1 rounded outline-none" style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)", color: "rgb(0,212,255)" }}>
          <option value="全部">处理类型</option>
          <option value="巡查发现">巡查发现</option>
          <option value="现场处置">现场处置</option>
          <option value="执法处置">执法处置</option>
          <option value="专项治理">专项治理</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-xs px-2 py-1 rounded outline-none" style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)", color: "rgb(0,212,255)" }}>
          <option value="全部">工单状态</option>
          <option value="未下发">未下发</option>
          <option value="已下发">已下发</option>
          <option value="处置中">处置中</option>
          <option value="已办结">已办结</option>
        </select>
        <select value={orderTypeFilter} onChange={(e) => setOrderTypeFilter(e.target.value)} className="text-xs px-2 py-1 rounded outline-none" style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)", color: "rgb(0,212,255)" }}>
          <option value="全部">工单类型</option>
          <option value="日常巡查">日常巡查</option>
          <option value="专项处置">专项处置</option>
          <option value="应急响应">应急响应</option>
          <option value="其他">其他</option>
        </select>
        <input type="date" value={timeStart} onChange={(e) => setTimeStart(e.target.value)} className="text-xs px-2 py-1 rounded outline-none" style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)", color: "rgb(200,235,255)" }} title="开始日期" />
        <span className="text-xs" style={{ color: "rgb(80,130,160)" }}>至</span>
        <input type="date" value={timeEnd} onChange={(e) => setTimeEnd(e.target.value)} className="text-xs px-2 py-1 rounded outline-none" style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)", color: "rgb(200,235,255)" }} title="结束日期" />
        <div className="flex-1" />
        <button className="flex items-center gap-1 text-xs px-2 py-1 rounded" style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)", color: "rgb(120,180,210)" }}>
          <Download size={12} />导出
        </button>
        <button className="flex items-center gap-1 text-xs px-2 py-1 rounded" style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)", color: "rgb(120,180,210)" }}>
          <Printer size={12} />打印
        </button>
      </div>

      {/* Table Header */}
      <div
        className="flex items-center gap-2 px-4 py-2 text-xs"
        style={{ borderBottom: "1px solid rgba(0,212,255,0.12)", background: "rgba(6,14,32,0.6)" }}
      >
        <div style={{ minWidth: "32px" }}>
          <input
            type="checkbox"
            checked={filtered.length > 0 && filtered.every((o) => selectedIds.has(o.id))}
            onChange={(e) => onToggleSelectAll?.(e.target.checked)}
            className="rounded border-border"
          />
        </div>
        {[
          { label: "图片", w: "52px", field: "" },
          { label: "视频", w: "40px", field: "" },
          { label: "工单信息", w: "160px", field: "name" },
          { label: "经纬度", w: "100px", field: "" },
          { label: "位置", w: "110px", field: "location" },
          { label: "工单来源", w: "76px", field: "" },
          { label: "上报人", w: "70px", field: "" },
          { label: "处理人", w: "70px", field: "" },
          { label: "处理类型", w: "72px", field: "" },
          { label: "工单状态", w: "72px", field: "status" },
          { label: "创建时间", w: "100px", field: "createdAt" },
          { label: "操作", w: "auto", field: "" },
        ].map(({ label, w, field }) => (
          <div
            key={label}
            className="flex items-center gap-0.5 cursor-pointer select-none"
            style={{ minWidth: w, color: "rgb(80,130,160)", flexShrink: 0 }}
            onClick={() => field && toggleSort(field)}
          >
            {label}
            {field && <SortIcon field={field} />}
          </div>
        ))}
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-auto">
        {filtered.map((order) => (
          <div
            key={order.id}
            onClick={() => onSelect?.(order)}
            className="flex items-center gap-2 px-4 py-2.5 cursor-pointer transition-all"
            style={{
              borderBottom: "1px solid rgba(0,212,255,0.07)",
              background: selectedId === order.id ? "rgba(0,212,255,0.08)" : "transparent",
            }}
          >
            <div style={{ minWidth: "32px" }} onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={selectedIds.has(order.id)}
                onChange={() => onToggleSelect?.(order.id)}
                className="rounded border-border"
              />
            </div>
            {/* 图片缩略图 - 可点击大图 */}
            <div style={{ minWidth: "52px", width: "52px" }}>
              <button
                type="button"
                className="rounded overflow-hidden block w-full cursor-pointer border-0 p-0"
                style={{ width: "44px", height: "32px", background: "rgba(0,0,0,0.3)" }}
                onClick={(e) => {
                  e.stopPropagation();
                  const url = order.evidenceImages?.[0] || order.thumbnail;
                  onImageClick?.(url);
                }}
              >
                <img src={order.thumbnail} alt="" className="w-full h-full object-cover" />
              </button>
            </div>

            {/* 视频缩略图 - 可点击播放 */}
            <div style={{ minWidth: "40px", width: "40px" }}>
              {order.evidenceVideos?.length ? (
                <button
                  type="button"
                  className="rounded flex items-center justify-center cursor-pointer border-0 w-full"
                  style={{ width: "36px", height: "28px", background: "rgba(0,212,255,0.1)" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onVideoClick?.(order.evidenceVideos![0] || "#");
                  }}
                >
                  <Video size={14} style={{ color: "rgb(0,212,255)" }} />
                </button>
              ) : (
                <div className="rounded flex items-center justify-center" style={{ width: "36px", height: "28px", background: "rgba(80,130,160,0.15)" }}>
                  <span className="text-[9px]" style={{ color: "rgb(80,130,160)" }}>—</span>
                </div>
              )}
            </div>

            {/* 工单信息 */}
            <div style={{ minWidth: "160px", width: "160px" }}>
              <div className="text-xs font-medium" style={{ color: "rgb(0,212,255)", fontSize: "10px" }}>
                {order.id}
              </div>
              <div className="text-xs truncate" style={{ color: "rgb(200,235,255)" }}>
                {order.name}
              </div>
            </div>

            {/* 经纬度 */}
            <div style={{ minWidth: "100px", width: "100px" }}>
              <span className="text-xs truncate block" style={{ color: "rgb(120,180,210)", fontSize: "9px" }} title={order.coords}>
                {order.coords}
              </span>
            </div>

            {/* 位置 */}
            <div style={{ minWidth: "110px", width: "110px" }}>
              <span className="text-xs truncate block" style={{ color: "rgb(200,235,255)" }} title={order.location}>
                {order.location}
              </span>
            </div>

            {/* 工单来源 */}
            <div style={{ minWidth: "76px", width: "76px" }}>
              <span className="text-xs" style={{ color: "rgb(200,235,255)", fontSize: "10px" }}>
                {(order as UrbanWorkOrder).source ?? "—"}
              </span>
            </div>

            {/* 上报人 */}
            <div style={{ minWidth: "70px", width: "70px" }}>
              <span className="text-xs truncate block" style={{ color: "rgb(200,235,255)", fontSize: "10px" }}>
                {(order as UrbanWorkOrder).reporter ?? "—"}
              </span>
            </div>

            {/* 处理人 */}
            <div style={{ minWidth: "70px", width: "70px" }}>
              <span className="text-xs truncate block" style={{ color: "rgb(200,235,255)", fontSize: "10px" }}>
                {(order as UrbanWorkOrder).handler ?? "—"}
              </span>
            </div>

            {/* 处理类型 */}
            <div style={{ minWidth: "72px", width: "72px" }}>
              <span className="text-xs truncate block" style={{ color: "rgb(120,180,210)", fontSize: "10px" }}>
                {(order as UrbanWorkOrder).processType ?? "—"}
              </span>
            </div>

            {/* 工单状态 */}
            <div style={{ minWidth: "72px", width: "72px" }}>
              <StatusBadge status={order.status} label={order.statusLabel} />
            </div>

            {/* 创建时间 */}
            <div style={{ minWidth: "100px", width: "100px" }}>
              <span className="text-xs" style={{ color: "rgb(120,180,210)" }}>
                {order.createdAt}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
              <button
                className="text-xs px-1.5 py-0.5 rounded whitespace-nowrap flex items-center gap-0.5"
                style={{
                  background: "rgba(0,212,255,0.08)",
                  border: "1px solid rgba(0,212,255,0.2)",
                  color: "rgb(0,212,255)",
                  fontSize: "10px",
                }}
                onClick={() => onEdit?.(order)}
              >
                <Pencil size={10} /> 编辑
              </button>
              <button
                className="text-xs px-1.5 py-0.5 rounded whitespace-nowrap"
                style={{
                  background: "rgba(0,212,255,0.08)",
                  border: "1px solid rgba(0,212,255,0.2)",
                  color: "rgb(0,212,255)",
                  fontSize: "10px",
                }}
                onClick={() => {}}
              >
                处置
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderTop: "1px solid rgba(0,212,255,0.15)", background: "rgba(6,14,32,0.5)" }}
      >
        <span className="text-xs" style={{ color: "rgb(80,130,160)" }}>
          共 {filtered.length} 条记录
        </span>
        <div className="flex items-center gap-1">
          {["上一页", "1", "2", "3", "下一页"].map((p) => (
            <button
              key={p}
              className="text-xs px-2 py-1 rounded"
              style={{
                background: p === "1" ? "rgba(0,212,255,0.15)" : "rgba(0,212,255,0.05)",
                border: `1px solid ${p === "1" ? "rgba(0,212,255,0.4)" : "rgba(0,212,255,0.1)"}`,
                color: p === "1" ? "rgb(0,212,255)" : "rgb(120,180,210)",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkOrderList;