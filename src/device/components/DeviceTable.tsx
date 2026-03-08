import React, { useState, useMemo, forwardRef, useImperativeHandle, useRef } from "react";
import StatusBadge from "./StatusBadge";
import { Eye, Edit2, LayoutGrid, List, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export interface Device {
  id: string;
  sn: string;
  name: string;
  type: string;
  model: string;
  firmware: string;
  status: "online" | "offline" | "fault" | "maintenance";
  unit: string;
  responsible: string;
  purchaseDate: string;
  flightHours: number;
}

export interface DeviceTableRef {
  getSelectedDevices: () => Device[];
  getSortedDevices: () => Device[];
}

const STATUS_LABELS: Record<string, string> = { online: "在线", offline: "离线", fault: "故障", maintenance: "维护中" };

interface DeviceTableProps {
  devices?: Device[];
  viewMode?: "table" | "card";
  typeFilter?: string;
  searchKeyword?: string;
  unitFilter?: string;
  statusFilter?: string;
  dateStart?: string;
  dateEnd?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  onView?: (device: Device) => void;
  onEdit?: (device: Device) => void;
  onSort?: (field: string, order: "asc" | "desc") => void;
}

const defaultDevices: Device[] = [
  { id: "D001", sn: "DJI-M300-2024001", name: "巡逻一号", type: "单兵无人机", model: "M300 RTK", firmware: "v07.00.0120", status: "online", unit: "市局直属队", responsible: "张伟", purchaseDate: "2024-01-15", flightHours: 342 },
  { id: "D002", sn: "DJI-M30T-2024002", name: "应急响应2号", type: "单兵无人机", model: "M30T", firmware: "v07.01.0050", status: "online", unit: "东城分局", responsible: "李明", purchaseDate: "2024-02-20", flightHours: 156 },
  { id: "D003", sn: "DJI-MINI4-2024003", name: "侦查小蜂", type: "单兵无人机", model: "Mini 4 Pro", firmware: "v01.01.0200", status: "offline", unit: "西城分局", responsible: "王芳", purchaseDate: "2024-03-10", flightHours: 89 },
  { id: "D004", sn: "XAG-P100-2023001", name: "农业巡检1号", type: "负载", model: "P100", firmware: "v3.2.1", status: "maintenance", unit: "郊区管理站", responsible: "陈刚", purchaseDate: "2023-06-08", flightHours: 1205 },
  { id: "D005", sn: "DJI-M300-2023002", name: "高空瞭望3号", type: "单兵无人机", model: "M300 RTK", firmware: "v06.01.0120", status: "fault", unit: "南区分局", responsible: "刘洋", purchaseDate: "2023-08-22", flightHours: 768 },
  { id: "D006", sn: "DJI-DOCK-2024001", name: "机库A01", type: "机场", model: "DJI Dock 2", firmware: "v10.01.0030", status: "online", unit: "市局直属队", responsible: "赵磊", purchaseDate: "2024-04-01", flightHours: 0 },
  { id: "D007", sn: "DJI-DOCK-2024002", name: "机库B02", type: "机场", model: "DJI Dock 2", firmware: "v10.01.0030", status: "online", unit: "东城分局", responsible: "李明", purchaseDate: "2024-05-10", flightHours: 0 },
  { id: "D008", sn: "XAG-P100-2023002", name: "农业巡检2号", type: "负载", model: "P100", firmware: "v3.2.1", status: "online", unit: "郊区管理站", responsible: "陈刚", purchaseDate: "2023-07-01", flightHours: 980 },
  { id: "D009", sn: "MONITOR-001", name: "监控点1", type: "监控设备", model: "球机", firmware: "v1.0", status: "online", unit: "市局直属队", responsible: "赵磊", purchaseDate: "2024-01-01", flightHours: 0 },
  { id: "D010", sn: "PART-001", name: "电池组A", type: "配件", model: "TB65", firmware: "-", status: "online", unit: "东城分局", responsible: "李明", purchaseDate: "2024-02-01", flightHours: 0 },
];

const SORT_FIELDS: { key: string; label: string }[] = [
  { key: "name", label: "设备名称" },
  { key: "sn", label: "SN序列号" },
  { key: "type", label: "类型" },
  { key: "purchaseDate", label: "采购日期" },
  { key: "flightHours", label: "飞行时长" },
  { key: "status", label: "状态" },
];

const DeviceTable = forwardRef<DeviceTableRef, DeviceTableProps>(({
  devices: propDevices,
  viewMode = "table",
  typeFilter = "全部",
  searchKeyword = "",
  unitFilter = "",
  statusFilter = "",
  dateStart = "",
  dateEnd = "",
  sortField = "name",
  sortOrder = "asc",
  onView = (d) => console.log("View device:", d.sn),
  onEdit = (d) => console.log("Edit device:", d.sn),
  onSort,
}, ref) => {
  const [selected, setSelected] = useState<string[]>([]);
  const devices = propDevices ?? defaultDevices;
  const sortedRef = useRef<Device[]>([]);

  const filtered = useMemo(() => {
    let list = devices;
    if (typeFilter && typeFilter !== "全部") list = list.filter((d) => d.type === typeFilter);
    const kw = (searchKeyword || "").trim().toLowerCase();
    if (kw) list = list.filter((d) => d.sn.toLowerCase().includes(kw) || d.name.toLowerCase().includes(kw));
    if (unitFilter && unitFilter !== "全部单位") list = list.filter((d) => d.unit === unitFilter);
    if (statusFilter && statusFilter !== "全部") {
      const wantStatus = Object.entries(STATUS_LABELS).find(([, v]) => v === statusFilter)?.[0];
      if (wantStatus) list = list.filter((d) => d.status === wantStatus);
    }
    if (dateStart) list = list.filter((d) => d.purchaseDate >= dateStart);
    if (dateEnd) list = list.filter((d) => d.purchaseDate <= dateEnd);
    return list;
  }, [devices, typeFilter, searchKeyword, unitFilter, statusFilter, dateStart, dateEnd]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortField];
      const bVal = (b as unknown as Record<string, unknown>)[sortField];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortOrder === "asc" ? 1 : -1;
      if (bVal == null) return sortOrder === "asc" ? -1 : 1;
      const cmp = typeof aVal === "string" && typeof bVal === "string"
        ? aVal.localeCompare(bVal, "zh-CN")
        : Number(aVal) - Number(bVal);
      return sortOrder === "asc" ? cmp : -cmp;
    });
    sortedRef.current = list;
    return list;
  }, [filtered, sortField, sortOrder]);

  useImperativeHandle(ref, () => ({
    getSelectedDevices: () => sortedRef.current.filter((d) => selected.includes(d.id)),
    getSortedDevices: () => [...sortedRef.current],
  }), [selected]);

  const toggleAll = () => {
    setSelected(selected.length === sorted.length ? [] : sorted.map((d) => d.id));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const handleSort = (field: string) => {
    if (!onSort) return;
    const next = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    onSort(field, next);
  };

  const renderSortIcon = (colKey: string) => {
    if (!onSort) return null;
    const active = sortField === colKey;
    return (
      <span
        onClick={(e) => { e.stopPropagation(); handleSort(colKey); }}
        style={{ marginLeft: 4, cursor: "pointer", display: "inline-flex", verticalAlign: "middle", color: active ? "rgba(100,181,246,1)" : "rgba(120,145,180,0.8)" }}
        title="排序"
      >
        {active ? (sortOrder === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} />}
      </span>
    );
  };

  const actionButtons = (device: Device) => (
    <div style={{ display: "flex", gap: 6 }}>
      <button
        onClick={() => onView(device)}
        title="详情"
        style={{ background: "rgba(30,136,229,0.15)", border: "1px solid rgba(30,136,229,0.3)", color: "rgba(100,181,246,1)", padding: "6px", borderRadius: 3, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
      >
        <Eye size={14} />
      </button>
      <button
        onClick={() => onEdit(device)}
        title="编辑"
        style={{ background: "rgba(18,26,44,1)", border: "1px solid rgba(40,58,90,1)", color: "rgba(160,185,215,1)", padding: "6px", borderRadius: 3, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
      >
        <Edit2 size={14} />
      </button>
    </div>
  );

  const cols = [
    { key: "", label: "", width: 40 },
    { key: "id", label: "设备ID", width: 70 },
    { key: "sn", label: "SN序列号", width: 160 },
    { key: "name", label: "设备名称", width: 120 },
    { key: "type", label: "类型", width: 90 },
    { key: "model", label: "型号", width: 110 },
    { key: "firmware", label: "固件版本", width: 110 },
    { key: "status", label: "状态", width: 90 },
    { key: "unit", label: "所属单位", width: 110 },
    { key: "responsible", label: "责任人", width: 80 },
    { key: "purchaseDate", label: "采购日期", width: 100 },
    { key: "flightHours", label: "飞行时长(h)", width: 100 },
    { key: "action", label: "操作", width: 90 },
  ];

  return (
    <div data-cmp="DeviceTable" style={{ overflowX: "auto" }}>
      {viewMode === "card" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, padding: 16 }}>
          {sorted.map((device) => (
            <div
              key={device.id}
              className="panel-card"
              style={{
                padding: 16,
                border: "1px solid rgba(30,50,80,1)",
                borderRadius: 6,
                background: "rgba(18,26,44,0.6)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 600, color: "rgba(220,228,240,1)", fontSize: 14, marginBottom: 2 }}>{device.name}</div>
                  <div style={{ fontSize: 11, color: "rgba(100,181,246,1)", fontFamily: "monospace" }}>{device.sn}</div>
                </div>
                <StatusBadge status={device.status} />
              </div>
              <div style={{ fontSize: 12, color: "rgba(160,185,215,1)", marginBottom: 8 }}>
                <span style={{ background: "rgba(30,136,229,0.1)", color: "rgba(100,181,246,1)", padding: "2px 6px", borderRadius: 3 }}>{device.type}</span>
                <span style={{ marginLeft: 6 }}>{device.model}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", fontSize: 11, color: "rgba(120,145,180,1)", marginBottom: 12 }}>
                <span>所属单位</span>
                <span>{device.unit}</span>
                <span>责任人</span>
                <span>{device.responsible}</span>
                <span>采购日期</span>
                <span>{device.purchaseDate}</span>
                <span>飞行时长</span>
                <span>{device.flightHours > 0 ? `${device.flightHours}h` : "-"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, paddingTop: 8, borderTop: "1px solid rgba(30,50,80,1)" }}>
                {actionButtons(device)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr className="table-header">
              {cols.map((col, i) => (
                <th
                  key={i}
                  style={{
                    padding: "10px 12px",
                    textAlign: "left",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    width: col.width,
                    borderBottom: "1px solid rgba(30, 50, 80, 1)",
                  }}
                >
                  {i === 0 ? (
                    <input
                      type="checkbox"
                      checked={sorted.length > 0 && selected.length === sorted.length}
                      onChange={toggleAll}
                      style={{ accentColor: "rgba(30,136,229,1)" }}
                    />
                  ) : col.key === "action" ? (
                    col.label
                  ) : (
                    <>
                      {col.label}
                      {col.key !== "" && SORT_FIELDS.some((f) => f.key === col.key) && renderSortIcon(col.key)}
                    </>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((device) => (
              <tr key={device.id} className="table-row">
                <td style={{ padding: "10px 12px" }}>
                  <input
                    type="checkbox"
                    checked={selected.includes(device.id)}
                    onChange={() => toggleOne(device.id)}
                    style={{ accentColor: "rgba(30,136,229,1)" }}
                  />
                </td>
                <td style={{ padding: "10px 12px", color: "rgba(100,181,246,1)", fontFamily: "monospace" }}>{device.id}</td>
                <td style={{ padding: "10px 12px", color: "rgba(180,200,230,1)", fontFamily: "monospace", fontSize: 12 }}>{device.sn}</td>
                <td style={{ padding: "10px 12px", color: "rgba(220,228,240,1)", fontWeight: 500 }}>{device.name}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{ fontSize: 11, background: "rgba(30,136,229,0.1)", color: "rgba(100,181,246,1)", padding: "2px 8px", borderRadius: 3 }}>{device.type}</span>
                </td>
                <td style={{ padding: "10px 12px", color: "rgba(180,200,230,1)" }}>{device.model}</td>
                <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 12, color: "rgba(150,170,200,1)" }}>{device.firmware}</td>
                <td style={{ padding: "10px 12px" }}><StatusBadge status={device.status} /></td>
                <td style={{ padding: "10px 12px", color: "rgba(160,185,215,1)" }}>{device.unit}</td>
                <td style={{ padding: "10px 12px", color: "rgba(160,185,215,1)" }}>{device.responsible}</td>
                <td style={{ padding: "10px 12px", color: "rgba(120,145,180,1)", fontSize: 12 }}>{device.purchaseDate}</td>
                <td style={{ padding: "10px 12px", color: "rgba(180,200,230,1)", textAlign: "center" }}>{device.flightHours > 0 ? device.flightHours : "-"}</td>
                <td style={{ padding: "10px 12px" }}>{actionButtons(device)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
});

DeviceTable.displayName = "DeviceTable";

export default DeviceTable;
