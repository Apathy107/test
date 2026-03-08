import React, { useState, useRef, useEffect } from "react";
import { Plus, Upload, Download, Filter, Search, QrCode, RefreshCw, LayoutGrid, List, KeyRound } from "lucide-react";
import DeviceTable, { type DeviceTableRef, type Device } from "@device/components/DeviceTable";
import DeviceDetailModal from "@device/components/DeviceDetailModal";
import FileUpload from "@device/components/FileUpload";

type TabType = "list" | "form" | "import" | "transfer" | "alert" | "maintenance" | "fault" | "damage" | "scrap";
type ListViewMode = "table" | "card";

/** 设备类型枚举 */
const DEVICE_TYPES = ["单兵无人机", "机场", "负载", "系留", "机器狗", "机器人", "监控设备", "配件", "其他"] as const;
type DeviceTypeTab = "全部" | (typeof DEVICE_TYPES)[number];

const INIT_FILTER: { search: string; type: string; unit: string; status: string; dateStart: string; dateEnd: string } = { search: "", type: "全部", unit: "全部单位", status: "全部", dateStart: "", dateEnd: "" };

const DeviceArchive: React.FC = () => {
  const [tab, setTab] = useState<TabType>("list");
  const [showDetail, setShowDetail] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<{ name: string; sn: string } | null>(null);
  const [deviceTypeTab, setDeviceTypeTab] = useState<DeviceTypeTab>("全部");
  const [listViewMode, setListViewMode] = useState<ListViewMode>("table");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const deviceTableRef = useRef<DeviceTableRef>(null);
  const [filterForm, setFilterForm] = useState(INIT_FILTER);
  const [appliedFilter, setAppliedFilter] = useState(INIT_FILTER);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [formBasic, setFormBasic] = useState({ sn: "", name: "", type: "", model: "", vendor: "", firmware: "", purchaseDate: "", warrantyEnd: "", adaptModel: "" });
  const [formOwnership, setFormOwnership] = useState({ unit: "", responsible: "", lng: "", lat: "", address: "" });
  const [bindingInfo, setBindingInfo] = useState<{ orgId: string; orgName: string; mqttUrl: string; mqttUser: string; mqttPwd: string; bindingCode: string } | null>(null);

  useEffect(() => {
    if (editingDevice) {
      setFormBasic({ sn: editingDevice.sn, name: editingDevice.name, type: editingDevice.type, model: editingDevice.model, vendor: "大疆", firmware: editingDevice.firmware, purchaseDate: editingDevice.purchaseDate, warrantyEnd: "", adaptModel: "" });
      setFormOwnership({ unit: editingDevice.unit, responsible: editingDevice.responsible, lng: "", lat: "", address: "" });
    } else {
      setFormBasic({ sn: "", name: "", type: "", model: "", vendor: "", firmware: "", purchaseDate: "", warrantyEnd: "", adaptModel: "" });
      setFormOwnership({ unit: "", responsible: "", lng: "", lat: "", address: "" });
    }
    setBindingInfo(null);
  }, [editingDevice]);

  const generateBindingCode = () => {
    const code = "BND-" + Math.random().toString(36).slice(2, 10).toUpperCase();
    setBindingInfo({
      orgId: "ORG-" + Math.floor(1000 + Math.random() * 9000),
      orgName: formOwnership.unit || "市局直属队",
      mqttUrl: "mqtts://fly.example.com:8883",
      mqttUser: "device_" + formBasic.sn?.replace(/-/g, "_") || "device_001",
      mqttPwd: Math.random().toString(36).slice(2, 14),
      bindingCode: code,
    });
  };

  const handleBatchExport = () => {
    const selectedList = deviceTableRef.current?.getSelectedDevices() ?? [];
    const list = selectedList.length > 0 ? selectedList : (deviceTableRef.current?.getSortedDevices?.() ?? []);
    if (list.length === 0) return;
    const statusMap: Record<string, string> = { online: "在线", offline: "离线", fault: "故障", maintenance: "维护中" };
    const headers = ["设备ID", "SN序列号", "设备名称", "类型", "型号", "固件版本", "状态", "所属单位", "责任人", "采购日期", "飞行时长(h)"];
    const rows = list.map((d) => [
      d.id, d.sn, d.name, d.type, d.model, d.firmware, statusMap[d.status] ?? d.status, d.unit, d.responsible, d.purchaseDate, String(d.flightHours ?? ""),
    ]);
    const BOM = "\uFEFF";
    const csv = BOM + [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `设备列表_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  console.log("DeviceArchive page rendered, tab:", tab);

  const tabs = [
    { key: "list", label: "设备列表" },
    { key: "form", label: "新增建档" },
    { key: "import", label: "批量导入" },
    { key: "transfer", label: "权属变更记录" },
    { key: "alert", label: "设备预警记录" },
    { key: "maintenance", label: "维护保养记录" },
    { key: "fault", label: "故障维修记录" },
    { key: "damage", label: "设备定损记录" },
    { key: "scrap", label: "报废处置记录" },
  ] as const;

  const filterFields = [
    { label: "设备类型", options: ["全部", ...DEVICE_TYPES] },
    { label: "所属单位", options: ["全部单位", "市局直属队", "东城分局", "西城分局", "南区分局", "郊区管理站"] },
    { label: "状态", options: ["全部", "在线", "离线", "故障", "维护中"] },
  ];

  const transferRecords = [
    { sn: "DJI-M300-2024001", name: "巡逻一号", from: "东城分局", to: "市局直属队", time: "2024-06-01", operator: "张伟", approval: "AP-20240601", reason: "任务调拨" },
    { sn: "DJI-MINI4-2024003", name: "侦查小蜂", from: "市局直属队", to: "西城分局", time: "2024-08-15", operator: "李明", approval: "AP-20240815", reason: "专项任务借调" },
  ];

  const alertRecords = [
    { id: "ALT-2024-001", name: "巡逻一号", sn: "DJI-M300-2024001", unit: "市局直属队", triggerTime: "2024-07-10 09:22", level: "黄色", content: "电池电量低于20%", handler: "张伟", result: "已更换电池", status: "已完成" },
    { id: "ALT-2024-002", name: "机库A01", sn: "DJI-DOCK-2024001", unit: "市局直属队", triggerTime: "2024-07-11 14:35", level: "红色", content: "机库舱温超40°C", handler: "赵磊", result: "-", status: "处置中" },
    { id: "ALT-2024-003", name: "应急响应2号", sn: "DJI-M30T-2024002", unit: "东城分局", triggerTime: "2024-07-12 08:10", level: "蓝色", content: "固件可升级", handler: "-", result: "-", status: "待处置" },
  ];

  const maintenanceRecords = [
    { planId: "MP-2024-001", name: "巡逻一号", sn: "DJI-M300-2024001", type: "定期保养", lastTime: "2024-06-15", cycle: "90天", nextTime: "2024-09-13", status: "正常" },
    { planId: "MP-2024-002", name: "高空瞭望3号", sn: "DJI-M300-2023002", type: "大修保养", lastTime: "2024-05-20", cycle: "180天", nextTime: "2024-11-16", status: "即将到期" },
    { planId: "MP-2024-003", name: "农业巡检1号", sn: "XAG-P100-2023001", type: "专项保养", lastTime: "2024-04-01", cycle: "60天", nextTime: "2024-05-31", status: "逾期未保养" },
    { planId: "MP-2024-004", name: "机库A01", sn: "DJI-DOCK-2024001", type: "定期保养", lastTime: "2024-07-01", cycle: "30天", nextTime: "2024-07-31", status: "紧急" },
  ];

  const faultRecords = [
    { repairId: "FR-2024-001", name: "高空瞭望3号", sn: "DJI-M300-2023002", faultType: "电机异常", desc: "起飞时异响", reporter: "刘洋", repairTime: "2024-07-08", engineer: "王工", status: "已完成" },
    { repairId: "FR-2024-002", name: "农业巡检1号", sn: "XAG-P100-2023001", faultType: "电池故障", desc: "续航骤降", reporter: "陈刚", repairTime: "-", engineer: "-", status: "维修中" },
    { repairId: "FR-2024-003", name: "侦查小蜂", sn: "DJI-MINI4-2024003", faultType: "图传异常", desc: "画面卡顿", reporter: "王芳", repairTime: "-", engineer: "-", status: "待诊断" },
  ];

  const damageRecords = [
    { id: "DS-2024-001", name: "巡逻一号", sn: "DJI-M300-2024001", type: "部件定损", reason: "桨叶撞击损坏", time: "2024-06-20", operator: "张伟" },
    { id: "DS-2024-002", name: "应急响应2号", sn: "DJI-M30T-2024002", type: "整机定损", reason: "坠机全损", time: "2024-07-05", operator: "李明" },
  ];

  const scrapRecords = [
    { archiveId: "SC-2023-001", name: "旧机M200", sn: "DJI-M200-2019001", scrapTime: "2024-01-15", reason: "技术淘汰", method: "拆解回收", value: "0", archiveUnit: "市局直属队" },
    { archiveId: "SC-2024-001", name: "损坏机库", sn: "DOCK-2019001", scrapTime: "2024-06-10", reason: "严重损坏无法修复", method: "委托机构环保处置", value: "5000", archiveUnit: "东城分局" },
  ];

  return (
    <div style={{ padding: "20px 24px", minHeight: "100%" }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, flexWrap: "wrap", borderBottom: "1px solid rgba(30,50,80,1)", marginBottom: 20 }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "10px 20px",
              background: "none",
              border: "none",
              borderBottom: tab === t.key ? "2px solid rgba(30,136,229,1)" : "2px solid transparent",
              color: tab === t.key ? "rgba(100,181,246,1)" : "rgba(120,145,180,1)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: tab === t.key ? 600 : 400,
              marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: List */}
      {tab === "list" && (
        <div>
          {/* 筛选：设备类型、所属单位、状态、时间段；SN/设备名称搜索 */}
          <div className="panel-card" style={{ padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ flex: "0 0 200px" }}>
                <label className="form-label" style={{ display: "block", marginBottom: 4, fontSize: 12, color: "rgba(120,145,180,1)" }}>SN/设备名称</label>
                <div style={{ position: "relative" }}>
                  <Search size={13} color="rgba(80,110,150,1)" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    className="form-input"
                    placeholder="搜索"
                    style={{ paddingLeft: 30 }}
                    value={filterForm.search}
                    onChange={(e) => setFilterForm((f) => ({ ...f, search: e.target.value }))}
                  />
                </div>
              </div>
              <div style={{ flex: "0 0 140px" }}>
                <label className="form-label" style={{ display: "block", marginBottom: 4, fontSize: 12, color: "rgba(120,145,180,1)" }}>设备类型</label>
                <select className="form-input" style={{ appearance: "none", fontSize: 12 }} value={filterForm.type} onChange={(e) => setFilterForm((f) => ({ ...f, type: e.target.value }))}>
                  {["全部", ...DEVICE_TYPES].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ flex: "0 0 140px" }}>
                <label className="form-label" style={{ display: "block", marginBottom: 4, fontSize: 12, color: "rgba(120,145,180,1)" }}>所属单位</label>
                <select className="form-input" style={{ appearance: "none", fontSize: 12 }} value={filterForm.unit} onChange={(e) => setFilterForm((f) => ({ ...f, unit: e.target.value }))}>
                  {["全部单位", "市局直属队", "东城分局", "西城分局", "南区分局", "郊区管理站"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ flex: "0 0 140px" }}>
                <label className="form-label" style={{ display: "block", marginBottom: 4, fontSize: 12, color: "rgba(120,145,180,1)" }}>状态</label>
                <select className="form-input" style={{ appearance: "none", fontSize: 12 }} value={filterForm.status} onChange={(e) => setFilterForm((f) => ({ ...f, status: e.target.value }))}>
                  {["全部", "在线", "离线", "故障", "维护中"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ flex: "0 0 220px" }}>
                <label className="form-label" style={{ display: "block", marginBottom: 4, fontSize: 12, color: "rgba(120,145,180,1)" }}>时间段</label>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input className="form-input" type="date" style={{ fontSize: 11 }} value={filterForm.dateStart} onChange={(e) => setFilterForm((f) => ({ ...f, dateStart: e.target.value }))} />
                  <span style={{ color: "rgba(80,110,150,1)", fontSize: 12 }}>至</span>
                  <input className="form-input" type="date" style={{ fontSize: 11 }} value={filterForm.dateEnd} onChange={(e) => setFilterForm((f) => ({ ...f, dateEnd: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, alignSelf: "flex-end", paddingBottom: 2 }}>
                <button className="btn-primary-blue" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4, height: 32, padding: "0 14px" }} onClick={() => setAppliedFilter({ ...filterForm })}>
                  <Filter size={12} /> 查询
                </button>
                <button className="btn-secondary" style={{ fontSize: 12, height: 32, padding: "0 14px" }} onClick={() => { setFilterForm({ ...INIT_FILTER }); setAppliedFilter({ ...INIT_FILTER }); }}>重置</button>
              </div>
            </div>
          </div>

          {/* Summary bar：左侧统计；右侧 批量导出/导入/新增设备 + 排序/布局/刷新 */}
          <div style={{ display: "flex", gap: 16, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "rgba(120,145,180,1)" }}>共 <span style={{ color: "rgba(220,228,240,1)", fontWeight: 600 }}>36</span> 台设备</span>
            <span style={{ fontSize: 12, color: "rgba(76,175,80,1)" }}>在线 28</span>
            <span style={{ fontSize: 12, color: "rgba(120,145,180,1)" }}>离线 5</span>
            <span style={{ fontSize: 12, color: "rgba(255,167,38,1)" }}>维护中 1</span>
            <span style={{ fontSize: 12, color: "rgba(239,68,68,1)" }}>故障 2</span>
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
<button className="btn-secondary" onClick={handleBatchExport} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
              <Download size={13} /> 批量导出
            </button>
              <button className="btn-secondary" onClick={() => setTab("import")} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                <Upload size={13} /> 批量导入
              </button>
              <button
                onClick={() => { setEditingDevice(null); setTab("form"); }}
                style={{
                  display: "flex", alignItems: "center", gap: 5, fontSize: 12,
                  background: "rgba(30,136,229,1)", color: "#fff", border: "none",
                  padding: "8px 14px", borderRadius: 4, cursor: "pointer", fontWeight: 500,
                }}
              >
                <Plus size={13} /> 新增设备
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "rgba(120,145,180,1)" }}>排序</span>
              <select
                value={`${sortField}-${sortOrder}`}
                onChange={(e) => { const v = e.target.value; const [f, o] = v.split("-"); setSortField(f); setSortOrder(o as "asc" | "desc"); }}
                className="form-input"
                style={{ fontSize: 11, padding: "4px 8px", width: 130 }}
              >
                <option value="name-asc">设备名称 升序</option>
                <option value="name-desc">设备名称 降序</option>
                <option value="sn-asc">SN 升序</option>
                <option value="sn-desc">SN 降序</option>
                <option value="purchaseDate-desc">采购日期 降序</option>
                <option value="purchaseDate-asc">采购日期 升序</option>
                <option value="flightHours-desc">飞行时长 降序</option>
                <option value="flightHours-asc">飞行时长 升序</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 12, color: "rgba(120,145,180,1)", marginRight: 4 }}>布局</span>
              <button
                onClick={() => setListViewMode("table")}
                style={{
                  padding: "4px 8px", borderRadius: 3, border: "1px solid " + (listViewMode === "table" ? "rgba(30,136,229,1)" : "rgba(40,58,90,1)"),
                  background: listViewMode === "table" ? "rgba(30,136,229,0.2)" : "transparent", color: listViewMode === "table" ? "rgba(100,181,246,1)" : "rgba(120,145,180,1)", cursor: "pointer", fontSize: 11,
                }}
                title="表格"
              >
                <List size={14} />
              </button>
              <button
                onClick={() => setListViewMode("card")}
                style={{
                  padding: "4px 8px", borderRadius: 3, border: "1px solid " + (listViewMode === "card" ? "rgba(30,136,229,1)" : "rgba(40,58,90,1)"),
                  background: listViewMode === "card" ? "rgba(30,136,229,0.2)" : "transparent", color: listViewMode === "card" ? "rgba(100,181,246,1)" : "rgba(120,145,180,1)", cursor: "pointer", fontSize: 11,
                }}
                title="卡片"
              >
                <LayoutGrid size={14} />
              </button>
            </div>
            <button className="btn-secondary" style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
              <RefreshCw size={11} /> 刷新
            </button>
          </div>

          {/* Device type tabs (embedded) */}
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(30,50,80,1)", marginBottom: 12, flexWrap: "wrap" }}>
            {(["全部", ...DEVICE_TYPES] as DeviceTypeTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setDeviceTypeTab(t)}
                style={{
                  padding: "8px 16px",
                  background: "none",
                  border: "none",
                  borderBottom: deviceTypeTab === t ? "2px solid rgba(30,136,229,1)" : "2px solid transparent",
                  color: deviceTypeTab === t ? "rgba(100,181,246,1)" : "rgba(120,145,180,1)",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: deviceTypeTab === t ? 600 : 400,
                  marginBottom: -1,
                }}
              >
                {t === "全部" ? "全部设备" : t}
              </button>
            ))}
          </div>

          <div className="panel-card" style={{ padding: 0, overflow: "hidden" }}>
            <DeviceTable
              ref={deviceTableRef}
              viewMode={listViewMode}
              typeFilter={deviceTypeTab}
              searchKeyword={appliedFilter.search}
              unitFilter={appliedFilter.unit}
              statusFilter={appliedFilter.status}
              dateStart={appliedFilter.dateStart}
              dateEnd={appliedFilter.dateEnd}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={(field, order) => { setSortField(field); setSortOrder(order); }}
              onView={(d) => { setSelectedDevice({ name: d.name, sn: d.sn }); setShowDetail(true); }}
              onEdit={(d) => { setEditingDevice(d); setTab("form"); }}
            />
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, marginTop: 14 }}>
            <span style={{ fontSize: 12, color: "rgba(100,130,170,1)" }}>共 36 条，每页 10 条</span>
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                style={{
                  width: 28, height: 28,
                  borderRadius: 3,
                  border: p === 1 ? "1px solid rgba(30,136,229,1)" : "1px solid rgba(40,58,90,1)",
                  background: p === 1 ? "rgba(30,136,229,0.2)" : "transparent",
                  color: p === 1 ? "rgba(100,181,246,1)" : "rgba(120,145,180,1)",
                  cursor: "pointer", fontSize: 12,
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Form */}
      {tab === "form" && (
        <div style={{ display: "flex", gap: 20 }}>
          <div className="panel-card" style={{ flex: 1, padding: "20px 24px" }}>
            {editingDevice && <div style={{ fontSize: 12, color: "rgba(100,181,246,1)", marginBottom: 12 }}>正在编辑：{editingDevice.name}（{editingDevice.sn}）</div>}
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(180,200,230,1)", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid rgba(30,50,80,1)" }}>
              基础信息
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              <div style={{ width: "calc(33.33% - 11px)" }}><label className="form-label">SN序列号 *</label><input className="form-input" placeholder="输入设备序列号" value={formBasic.sn} onChange={(e) => setFormBasic((f) => ({ ...f, sn: e.target.value }))} /></div>
              <div style={{ width: "calc(33.33% - 11px)" }}><label className="form-label">设备名称 *</label><input className="form-input" placeholder="如：巡逻一号" value={formBasic.name} onChange={(e) => setFormBasic((f) => ({ ...f, name: e.target.value }))} /></div>
              <div style={{ width: "calc(33.33% - 11px)" }}><label className="form-label">设备类型 *</label><select className="form-input" style={{ appearance: "none" }} value={formBasic.type} onChange={(e) => setFormBasic((f) => ({ ...f, type: e.target.value }))}>{DEVICE_TYPES.map((o) => <option key={o}>{o}</option>)}</select></div>
              <div style={{ width: "calc(33.33% - 11px)" }}><label className="form-label">设备型号 *</label><input className="form-input" placeholder="如：M300 RTK" value={formBasic.model} onChange={(e) => setFormBasic((f) => ({ ...f, model: e.target.value }))} /></div>
              <div style={{ width: "calc(33.33% - 11px)" }}><label className="form-label">厂商 *</label><input className="form-input" placeholder="输入厂商名称" value={formBasic.vendor} onChange={(e) => setFormBasic((f) => ({ ...f, vendor: e.target.value }))} /></div>
              <div style={{ width: "calc(33.33% - 11px)" }}><label className="form-label">固件版本</label><input className="form-input" placeholder="如：v07.00.0120" value={formBasic.firmware} onChange={(e) => setFormBasic((f) => ({ ...f, firmware: e.target.value }))} /></div>
              <div style={{ width: "calc(33.33% - 11px)" }}><label className="form-label">采购日期 *</label><input className="form-input" type="date" value={formBasic.purchaseDate} onChange={(e) => setFormBasic((f) => ({ ...f, purchaseDate: e.target.value }))} /></div>
              <div style={{ width: "calc(33.33% - 11px)" }}><label className="form-label">质保截止日期</label><input className="form-input" type="date" value={formBasic.warrantyEnd} onChange={(e) => setFormBasic((f) => ({ ...f, warrantyEnd: e.target.value }))} /></div>
              <div style={{ width: "calc(33.33% - 11px)" }}><label className="form-label">适配机型</label><input className="form-input" placeholder="如：M300系列" value={formBasic.adaptModel} onChange={(e) => setFormBasic((f) => ({ ...f, adaptModel: e.target.value }))} /></div>
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(180,200,230,1)", margin: "24px 0 16px", paddingTop: 16, borderTop: "1px solid rgba(30,50,80,1)" }}>
              飞行控制信息
            </div>
            <div style={{ marginBottom: 20 }}>
              <button type="button" className="btn-primary-blue" style={{ display: "inline-flex", alignItems: "center", gap: 6 }} onClick={generateBindingCode}>
                <KeyRound size={14} /> 绑定码
              </button>
              {bindingInfo && (
                <div style={{ marginTop: 16, padding: 16, background: "rgba(18,26,44,1)", border: "1px solid rgba(40,58,90,1)", borderRadius: 6 }}>
                  <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 280px" }}>
                      <div style={{ fontSize: 12, color: "rgba(120,145,180,1)", marginBottom: 8 }}>绑定信息</div>
                      <div style={{ display: "grid", gap: 6, fontSize: 12 }}>
                        <div style={{ display: "flex" }}><span style={{ width: 90, color: "rgba(120,145,180,1)" }}>组织ID</span><span style={{ color: "rgba(220,228,240,1)", fontFamily: "monospace" }}>{bindingInfo.orgId}</span></div>
                        <div style={{ display: "flex" }}><span style={{ width: 90, color: "rgba(120,145,180,1)" }}>组织名称</span><span style={{ color: "rgba(220,228,240,1)" }}>{bindingInfo.orgName}</span></div>
                        <div style={{ display: "flex" }}><span style={{ width: 90, color: "rgba(120,145,180,1)" }}>MQTT网址</span><span style={{ color: "rgba(180,200,230,1)", fontFamily: "monospace", wordBreak: "break-all" }}>{bindingInfo.mqttUrl}</span></div>
                        <div style={{ display: "flex" }}><span style={{ width: 90, color: "rgba(120,145,180,1)" }}>MQTT用户名</span><span style={{ color: "rgba(220,228,240,1)", fontFamily: "monospace" }}>{bindingInfo.mqttUser}</span></div>
                        <div style={{ display: "flex" }}><span style={{ width: 90, color: "rgba(120,145,180,1)" }}>MQTT密码</span><span style={{ color: "rgba(220,228,240,1)", fontFamily: "monospace" }}>{bindingInfo.mqttPwd}</span></div>
                        <div style={{ display: "flex" }}><span style={{ width: 90, color: "rgba(120,145,180,1)" }}>绑定码</span><span style={{ color: "rgba(100,181,246,1)", fontFamily: "monospace", fontWeight: 600 }}>{bindingInfo.bindingCode}</span></div>
                      </div>
                    </div>
                    <div style={{ flex: "0 0 auto", textAlign: "center" }}>
                      <div style={{ fontSize: 12, color: "rgba(120,145,180,1)", marginBottom: 6 }}>手机扫码绑定</div>
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(JSON.stringify(bindingInfo))}`} alt="绑定码二维码" style={{ width: 160, height: 160, background: "#fff", borderRadius: 6, padding: 8 }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(180,200,230,1)", margin: "24px 0 16px", paddingTop: 16, borderTop: "1px solid rgba(30,50,80,1)" }}>
              权属信息
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              <div style={{ width: "calc(33.33% - 11px)" }}><label className="form-label">所属单位 *</label><select className="form-input" style={{ appearance: "none" }} value={formOwnership.unit} onChange={(e) => setFormOwnership((f) => ({ ...f, unit: e.target.value }))}>{["市局直属队", "东城分局", "西城分局", "南区分局", "郊区管理站"].map((o) => <option key={o}>{o}</option>)}</select></div>
              <div style={{ width: "calc(33.33% - 11px)" }}><label className="form-label">责任人 *</label><input className="form-input" placeholder="输入责任人姓名" value={formOwnership.responsible} onChange={(e) => setFormOwnership((f) => ({ ...f, responsible: e.target.value }))} /></div>
              <div style={{ width: "calc(33.33% - 11px)" }}><label className="form-label">部署经度</label><input className="form-input" placeholder="如：116.3974" value={formOwnership.lng} onChange={(e) => setFormOwnership((f) => ({ ...f, lng: e.target.value }))} /></div>
              <div style={{ width: "calc(33.33% - 11px)" }}><label className="form-label">部署纬度</label><input className="form-input" placeholder="如：39.9093" value={formOwnership.lat} onChange={(e) => setFormOwnership((f) => ({ ...f, lat: e.target.value }))} /></div>
              <div style={{ width: "100%" }}><label className="form-label">部署地址</label><input className="form-input" placeholder="详细部署地址" value={formOwnership.address} onChange={(e) => setFormOwnership((f) => ({ ...f, address: e.target.value }))} /></div>
            </div>

            <div style={{ marginTop: 24 }}>
              <FileUpload label="附件管理（采购合同、合格证、备案材料）" files={[]} />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24, paddingTop: 16, borderTop: "1px solid rgba(30,50,80,1)" }}>
              <button className="btn-secondary" onClick={() => { setTab("list"); setEditingDevice(null); }}>取消</button>
              <button className="btn-secondary" onClick={() => console.log("Save draft")}>保存草稿</button>
              <button className="btn-primary-blue" onClick={() => { console.log("Submit device", editingDevice ? "update" : "create"); setTab("list"); setEditingDevice(null); }}>提交建档</button>
            </div>
          </div>

          {/* Right: QR preview */}
          <div style={{ width: 200 }}>
            <div className="panel-card" style={{ padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "rgba(120,145,180,1)", marginBottom: 12 }}>唯一标识二维码</div>
              <div style={{ fontSize: 11, color: "rgba(80,110,150,1)", marginBottom: 12 }}>
                保存后自动生成，可打印粘贴于机身
              </div>
              <div style={{ background: "rgba(24,34,58,1)", border: "2px dashed rgba(40,58,90,1)", borderRadius: 6, padding: 24, color: "rgba(80,110,150,1)", fontSize: 11 }}>
                <QrCode size={40} style={{ margin: "0 auto 8px" }} color="rgba(60,80,110,1)" />
                提交后生成
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Import */}
      {tab === "import" && (
        <div className="panel-card" style={{ padding: "24px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(180,200,230,1)", marginBottom: 20 }}>批量导入设备</div>
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 16, padding: 14, background: "rgba(30,136,229,0.06)", border: "1px solid rgba(30,136,229,0.2)", borderRadius: 5 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(100,181,246,1)", marginBottom: 8 }}>使用说明</div>
                <div style={{ fontSize: 12, color: "rgba(160,185,215,1)", lineHeight: 1.8 }}>
                  1. 下载标准 Excel 模板，按要求填写设备信息<br />
                  2. 必填字段：SN序列号（全局唯一）、设备名称、类型、型号、厂商、采购日期、所属单位、责任人<br />
                  3. 日期格式：YYYY-MM-DD<br />
                  4. 上传后系统自动校验字段，错误行高亮提示<br />
                  5. 校验通过后确认导入，系统自动生成设备ID和二维码
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <button className="btn-secondary" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 5 }} onClick={() => console.log("Download template")}>
                  <Download size={13} /> 下载标准模板（Excel）
                </button>
              </div>
              <FileUpload label="上传填写好的 Excel 文件" files={[]} accept=".xlsx,.xls,.csv" />
            </div>
            <div style={{ width: 300 }}>
              <div style={{ fontSize: 12, color: "rgba(120,145,180,1)", marginBottom: 10 }}>字段校验规则</div>
              {[
                { field: "SN序列号", rule: "全局唯一，不可重复", status: "required" },
                { field: "设备名称", rule: "不超过50字符", status: "required" },
                { field: "设备类型", rule: "必须为预设类型之一", status: "required" },
                { field: "采购日期", rule: "格式 YYYY-MM-DD", status: "required" },
                { field: "所属单位", rule: "必须为系统内已有单位", status: "required" },
                { field: "责任人", rule: "不超过20字符", status: "required" },
                { field: "经纬度", rule: "数字格式，可选", status: "optional" },
              ].map((r) => (
                <div key={r.field} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid rgba(20,32,54,1)" }}>
                  <span style={{ fontSize: 12, color: "rgba(180,200,230,1)", width: 80 }}>{r.field}</span>
                  <span style={{ fontSize: 11, color: "rgba(120,145,180,1)", flex: 1 }}>{r.rule}</span>
                  <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 2, background: r.status === "required" ? "rgba(239,68,68,0.15)" : "rgba(120,145,180,0.15)", color: r.status === "required" ? "rgba(239,83,80,1)" : "rgba(120,145,180,1)" }}>
                    {r.status === "required" ? "必填" : "选填"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Transfer */}
      {tab === "transfer" && (
        <div className="panel-card" style={{ padding: "0", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(30,50,80,1)", fontSize: 13, fontWeight: 600, color: "rgba(180,200,230,1)" }}>
            权属变更记录
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr className="table-header">
                {["SN序列号", "设备名称", "原属单位", "变更至", "变更时间", "操作人", "审批单号", "变更原因"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 500, borderBottom: "1px solid rgba(30,50,80,1)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transferRecords.map((r, i) => (
                <tr key={i} className="table-row">
                  <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 12, color: "rgba(100,181,246,1)" }}>{r.sn}</td>
                  <td style={{ padding: "10px 14px", color: "rgba(220,228,240,1)" }}>{r.name}</td>
                  <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{r.from}</td>
                  <td style={{ padding: "10px 14px", color: "rgba(100,181,246,1)" }}>{r.to}</td>
                  <td style={{ padding: "10px 14px", color: "rgba(120,145,180,1)", fontSize: 12 }}>{r.time}</td>
                  <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{r.operator}</td>
                  <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 11, color: "rgba(100,181,246,1)" }}>{r.approval}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: 11, background: "rgba(30,136,229,0.1)", color: "rgba(100,181,246,1)", padding: "2px 8px", borderRadius: 3 }}>{r.reason}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: 设备预警记录 */}
      {tab === "alert" && (
        <div className="panel-card" style={{ padding: "0", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(30,50,80,1)", fontSize: 13, fontWeight: 600, color: "rgba(180,200,230,1)" }}>
            设备预警记录
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr className="table-header">
                  {["预警ID", "设备名称", "设备编号", "所属单位", "触发时间", "级别", "预警内容", "处置人", "处置结果", "状态"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 500, borderBottom: "1px solid rgba(30,50,80,1)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alertRecords.map((r, i) => (
                  <tr key={i} className="table-row">
                    <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 12, color: "rgba(100,181,246,1)" }}>{r.id}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(220,228,240,1)" }}>{r.name}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 12, color: "rgba(180,200,230,1)" }}>{r.sn}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{r.unit}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(120,145,180,1)", fontSize: 12 }}>{r.triggerTime}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{
                        fontSize: 11, padding: "2px 8px", borderRadius: 3,
                        background: r.level === "蓝色" ? "rgba(30,136,229,0.2)" : r.level === "黄色" ? "rgba(255,167,38,0.2)" : "rgba(239,68,68,0.2)",
                        color: r.level === "蓝色" ? "rgba(100,181,246,1)" : r.level === "黄色" ? "rgba(255,193,7,1)" : "rgba(239,83,80,1)",
                      }}>{r.level}</span>
                    </td>
                    <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{r.content}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{r.handler}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(120,145,180,1)" }}>{r.result}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ fontSize: 11, background: "rgba(30,136,229,0.1)", color: "rgba(100,181,246,1)", padding: "2px 8px", borderRadius: 3 }}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: 维护保养记录 */}
      {tab === "maintenance" && (
        <div className="panel-card" style={{ padding: "0", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(30,50,80,1)", fontSize: 13, fontWeight: 600, color: "rgba(180,200,230,1)" }}>
            维护保养记录
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr className="table-header">
                  {["计划ID", "设备名称", "设备编号", "保养类型", "本次保养时间", "周期", "下次保养时间", "状态"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 500, borderBottom: "1px solid rgba(30,50,80,1)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {maintenanceRecords.map((r, i) => (
                  <tr key={i} className="table-row">
                    <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 12, color: "rgba(100,181,246,1)" }}>{r.planId}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(220,228,240,1)" }}>{r.name}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 12, color: "rgba(180,200,230,1)" }}>{r.sn}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{r.type}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(120,145,180,1)", fontSize: 12 }}>{r.lastTime}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(120,145,180,1)" }}>{r.cycle}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(120,145,180,1)", fontSize: 12 }}>{r.nextTime}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{
                        fontSize: 11, padding: "2px 8px", borderRadius: 3,
                        background: r.status === "正常" ? "rgba(76,175,80,0.2)" : r.status === "紧急" ? "rgba(239,68,68,0.2)" : r.status === "逾期未保养" ? "rgba(239,68,68,0.2)" : "rgba(255,167,38,0.2)",
                        color: r.status === "正常" ? "rgba(76,175,80,1)" : r.status === "紧急" || r.status === "逾期未保养" ? "rgba(239,83,80,1)" : "rgba(255,193,7,1)",
                      }}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: 故障维修记录 */}
      {tab === "fault" && (
        <div className="panel-card" style={{ padding: "0", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(30,50,80,1)", fontSize: 13, fontWeight: 600, color: "rgba(180,200,230,1)" }}>
            故障维修记录
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr className="table-header">
                  {["报修ID", "设备名称", "设备编号", "故障类型", "故障描述", "上报人", "维修时间", "维修工程师", "状态"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 500, borderBottom: "1px solid rgba(30,50,80,1)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {faultRecords.map((r, i) => (
                  <tr key={i} className="table-row">
                    <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 12, color: "rgba(100,181,246,1)" }}>{r.repairId}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(220,228,240,1)" }}>{r.name}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 12, color: "rgba(180,200,230,1)" }}>{r.sn}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{r.faultType}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{r.desc}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{r.reporter}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(120,145,180,1)", fontSize: 12 }}>{r.repairTime}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{r.engineer}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ fontSize: 11, background: "rgba(30,136,229,0.1)", color: "rgba(100,181,246,1)", padding: "2px 8px", borderRadius: 3 }}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: 设备定损记录 */}
      {tab === "damage" && (
        <div className="panel-card" style={{ padding: "0", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(30,50,80,1)", fontSize: 13, fontWeight: 600, color: "rgba(180,200,230,1)" }}>
            设备定损记录
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr className="table-header">
                  {["定损ID", "设备名称", "设备编号", "定损类型", "定损原因", "定损时间", "操作人"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 500, borderBottom: "1px solid rgba(30,50,80,1)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {damageRecords.map((r, i) => (
                  <tr key={i} className="table-row">
                    <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 12, color: "rgba(100,181,246,1)" }}>{r.id}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(220,228,240,1)" }}>{r.name}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 12, color: "rgba(180,200,230,1)" }}>{r.sn}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{r.type}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{r.reason}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(120,145,180,1)", fontSize: 12 }}>{r.time}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{r.operator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: 报废处置记录 */}
      {tab === "scrap" && (
        <div className="panel-card" style={{ padding: "0", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(30,50,80,1)", fontSize: 13, fontWeight: 600, color: "rgba(180,200,230,1)" }}>
            报废处置记录
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr className="table-header">
                  {["档案ID", "设备名称", "设备编号", "报废时间", "报废原因", "处置方式", "残值", "归档单位"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 500, borderBottom: "1px solid rgba(30,50,80,1)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scrapRecords.map((r, i) => (
                  <tr key={i} className="table-row">
                    <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 12, color: "rgba(100,181,246,1)" }}>{r.archiveId}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(220,228,240,1)" }}>{r.name}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 12, color: "rgba(180,200,230,1)" }}>{r.sn}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(120,145,180,1)", fontSize: 12 }}>{r.scrapTime}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{r.reason}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{r.method}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(180,200,230,1)" }}>{r.value}</td>
                    <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{r.archiveUnit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Device detail modal */}
      {showDetail && selectedDevice && (
        <DeviceDetailModal
          open={showDetail}
          onClose={() => setShowDetail(false)}
          deviceName={selectedDevice.name}
          deviceSN={selectedDevice.sn}
        />
      )}
    </div>
  );
};

export default DeviceArchive;