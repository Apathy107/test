import React, { useState } from "react";
import AlertItem from "@personnel/components/AlertItem";
import StatusBadge from "@personnel/components/StatusBadge";
import { Bell, AlertTriangle, Clock, ShieldOff } from "lucide-react";

type LevelFilter = "all" | "red" | "yellow" | "blue";

const warningData = [
  { id: "W001", pilotId: "P012", name: "张伟", unit: "西城分队", certType: "超视距执照", expiry: "2025-07-10", daysLeft: -4, level: "red" as const, status: "已冻结", notified: true },
  { id: "W002", pilotId: "P008", name: "刘洋", unit: "北郊中队", certType: "CAAC 视距内执照", expiry: "2025-07-21", daysLeft: 7, level: "red" as const, status: "待续期", notified: true },
  { id: "W003", pilotId: "P021", name: "赵磊", unit: "东城分队", certType: "视距内执照", expiry: "2025-08-14", daysLeft: 31, level: "yellow" as const, status: "处理中", notified: true },
  { id: "W004", pilotId: "P033", name: "钱鑫", unit: "南区分队", certType: "农业植保证书", expiry: "2025-08-20", daysLeft: 37, level: "yellow" as const, status: "待提醒", notified: false },
  { id: "W005", pilotId: "P005", name: "陈峰", unit: "应急响应", certType: "超视距执照", expiry: "2025-10-15", daysLeft: 93, level: "blue" as const, status: "待提醒", notified: false },
  { id: "W006", pilotId: "P016", name: "孙亮", unit: "西城分队", certType: "教员执照", expiry: "2025-10-28", daysLeft: 106, level: "blue" as const, status: "待提醒", notified: false },
  { id: "W007", pilotId: "P009", name: "周红", unit: "北郊中队", certType: "CAAC 视距内执照", expiry: "2025-07-15", daysLeft: 1, level: "red" as const, status: "预警失效", notified: true },
];

const QualificationMonitor: React.FC = () => {
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showPushModal, setShowPushModal] = useState(false);
  const [pushChannels, setPushChannels] = useState<string[]>(["站内信"]);
  console.log("QualificationMonitor page rendered");

  const filtered = warningData.filter((w) => levelFilter === "all" || w.level === levelFilter);
  const redCount = warningData.filter((w) => w.level === "red").length;
  const frozenCount = warningData.filter((w) => w.status === "已冻结").length;
  const yellowCount = warningData.filter((w) => w.level === "yellow").length;
  const blueCount = warningData.filter((w) => w.level === "blue").length;

  const getLevelConfig = (level: string) => {
    if (level === "red") return { color: "rgba(255, 80, 80, 1)", label: "紧急（≤30天）", bg: "rgba(200, 40, 40, 0.15)" };
    if (level === "yellow") return { color: "rgba(255, 200, 0, 1)", label: "警告（31-60天）", bg: "rgba(200, 150, 0, 0.12)" };
    return { color: "rgba(0, 212, 255, 1)", label: "提示（61-90天）", bg: "rgba(0, 150, 200, 0.12)" };
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAllCurrent = () => {
    setSelectedIds(filtered.map((w) => w.id));
  };

  return (
    <>
      {/* Stats */}
      <div className="flex gap-4 mb-5">
        {[
          { label: "预警总数", value: warningData.length, color: "rgba(200, 220, 240, 1)", icon: Bell },
          { label: "紧急（红色）", value: redCount, color: "rgba(255, 80, 80, 1)", icon: AlertTriangle },
          { label: "警告（黄色）", value: yellowCount, color: "rgba(255, 200, 0, 1)", icon: Clock },
          { label: "提示（蓝色）", value: blueCount, color: "rgba(0, 212, 255, 1)", icon: Bell },
          { label: "已冻结飞手", value: 3, color: "rgba(180, 100, 255, 1)", icon: ShieldOff },
        ].map((s) => {
          const Ic = s.icon;
          return (
            <div
              key={s.label}
              className="flex-1 tech-card rounded-lg p-4 flex items-center gap-3"
            >
              <Ic size={22} style={{ color: s.color }} />
              <div>
                <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs" style={{ color: "rgba(100, 140, 180, 1)" }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Level tabs */}
      <div className="flex gap-2 mb-4">
        {([
          { key: "all", label: "全部预警", count: warningData.length },
          { key: "red", label: "红色预警", count: redCount },
          { key: "yellow", label: "黄色预警", count: yellowCount },
          { key: "blue", label: "蓝色提示", count: blueCount },
        ] as { key: LevelFilter; label: string; count: number }[]).map((tab) => {
          const active = levelFilter === tab.key;
          const tabColors: Record<string, string> = { all: "rgba(200, 220, 240, 1)", red: "rgba(255, 80, 80, 1)", yellow: "rgba(255, 200, 0, 1)", blue: "rgba(0, 212, 255, 1)" };
          return (
            <button
              key={tab.key}
              onClick={() => setLevelFilter(tab.key)}
              className="flex items-center gap-2 px-4 py-2 rounded text-xs font-medium transition-colors"
              style={{
                background: active ? "rgba(0, 80, 130, 0.3)" : "rgba(16, 38, 76, 0.5)",
                border: active ? `1px solid ${tabColors[tab.key]}` : "1px solid rgba(0, 100, 150, 0.2)",
                color: active ? tabColors[tab.key] : "rgba(100, 140, 180, 1)",
              }}
            >
              {tab.label}
              <span
                className="px-1.5 rounded-full text-[10px] font-bold"
                style={{
                  background: active ? `${tabColors[tab.key]}22` : "rgba(0, 60, 100, 0.5)",
                  color: active ? tabColors[tab.key] : "rgba(80, 120, 160, 1)",
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
        <div className="flex-1" />
        <button
          className="px-4 py-2 rounded text-xs font-medium"
          style={{
            background: "rgba(0, 100, 150, 0.2)",
            border: "1px solid rgba(0, 212, 255, 0.4)",
            color: "rgba(0, 212, 255, 1)",
          }}
          onClick={() => setShowPushModal(true)}
        >
          批量推送提醒
        </button>
      </div>

      {/* Warning list */}
      <div className="tech-card rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: "rgba(0, 60, 100, 0.3)", borderBottom: "1px solid rgba(0, 150, 200, 0.3)" }}>
              <th className="px-3 py-3 text-left font-medium" style={{ color: "rgba(0, 212, 255, 0.85)" }}>
                <span className="inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedIds.length === filtered.length}
                    onChange={selectAllCurrent}
                  />
                  序号
                </span>
              </th>
              {["预警编号", "飞手", "所属单位", "证书类型", "到期日期", "剩余天数", "预警级别", "处理状态", "推送状态", "操作"].map((h) => (
                <th key={h} className="px-3 py-3 text-left font-medium" style={{ color: "rgba(0, 212, 255, 0.85)", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((w, idx) => {
              const cfg = getLevelConfig(w.level);
              return (
                <tr
                  key={w.id}
                  className="table-row-hover transition-colors"
                  style={{ borderBottom: "1px solid rgba(0, 80, 120, 0.2)" }}
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(w.id)}
                      onChange={() => toggleSelect(w.id)}
                      style={{ marginRight: 6, verticalAlign: "middle" }}
                    />
                    <span style={{ color: "rgba(100,140,180,1)" }}>{idx + 1}</span>
                  </td>
                  <td className="px-3 py-3" style={{ color: "rgba(0, 212, 255, 0.7)", fontFamily: "monospace" }}>{w.id}</td>
                  <td className="px-3 py-3">
                    <div className="font-medium" style={{ color: "rgba(200, 220, 240, 1)" }}>{w.name}</div>
                    <div style={{ color: "rgba(80, 120, 160, 1)" }}>{w.pilotId}</div>
                  </td>
                  <td className="px-3 py-3" style={{ color: "rgba(140, 180, 210, 1)" }}>{w.unit}</td>
                  <td className="px-3 py-3" style={{ color: "rgba(180, 210, 240, 1)" }}>{w.certType}</td>
                  <td className="px-3 py-3" style={{ color: "rgba(180, 210, 240, 1)", fontFamily: "monospace" }}>{w.expiry}</td>
                  <td className="px-3 py-3">
                    <span
                      className="font-bold"
                      style={{ color: w.daysLeft < 0 ? "rgba(255, 80, 80, 1)" : w.daysLeft <= 30 ? "rgba(255, 100, 60, 1)" : w.daysLeft <= 60 ? "rgba(255, 200, 0, 1)" : "rgba(0, 212, 255, 1)" }}
                    >
                      {w.daysLeft < 0 ? `已逾期 ${Math.abs(w.daysLeft)} 天` : `${w.daysLeft} 天`}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        color: cfg.color,
                        background: cfg.bg,
                        border: `1px solid ${cfg.color}44`,
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge
                      status={w.status === "已冻结" ? "frozen" : w.status === "处理中" ? "pending" : w.status === "预警失效" ? "rejected" : "warning"}
                      label={w.status}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={w.notified ? "active" : "info"} label={w.notified ? "已推送" : "未推送"} />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button
                        className="px-2 py-1 rounded text-xs"
                        style={{ background: "rgba(0, 80, 120, 0.2)", border: "1px solid rgba(0, 150, 200, 0.3)", color: "rgba(0, 212, 255, 0.9)" }}
                        onClick={() => console.log("Handle warning:", w.id)}
                      >
                        处理
                      </button>
                      <button
                        className="px-2 py-1 rounded text-xs"
                        style={{ background: "rgba(60, 60, 120, 0.2)", border: "1px solid rgba(120, 100, 200, 0.3)", color: "rgba(180, 160, 255, 0.9)" }}
                        onClick={() => console.log("Send reminder:", w.id)}
                      >
                        推送
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Frozen pilots notice */}
      <div
        className="mt-5 p-4 rounded-lg flex items-start gap-3"
        style={{ background: "rgba(180, 50, 50, 0.1)", border: "1px solid rgba(255, 80, 80, 0.25)" }}
      >
        <ShieldOff size={16} style={{ color: "rgba(255, 80, 80, 1)", flexShrink: 0 }} />
        <div>
          <div className="text-xs font-semibold mb-1" style={{ color: "rgba(255, 80, 80, 1)" }}>
            资质失效控制说明
          </div>
          <div className="text-xs" style={{ color: "rgba(180, 140, 140, 1)" }}>
            当前共 {redCount} 名飞手处于紧急（红色）预警，其中 {frozenCount} 名因证书过期已被自动冻结派单权限，仅保留续期申请入口。本月因资质失效导致的任务延误已纳入绩效扣分记录。
          </div>
        </div>
      </div>

      {showPushModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(4,10,24,0.85)" }}
          onClick={() => setShowPushModal(false)}
        >
          <div
            className="tech-card rounded-lg p-5 w-[520px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="text-sm font-semibold" style={{ color: "rgba(210,230,250,1)" }}>批量推送提醒</div>
                <div className="text-[11px]" style={{ color: "rgba(130,160,200,1)" }}>
                  已选择 {selectedIds.length || filtered.length} 条预警记录，请选择推送方式。
                </div>
              </div>
              <button
                className="text-xs px-2 py-1 rounded"
                style={{ background: "rgba(10,30,60,1)", color: "rgba(140,180,210,1)" }}
                onClick={() => setShowPushModal(false)}
              >
                关闭
              </button>
            </div>
            <div className="mb-3 text-xs" style={{ color: "rgba(160,190,220,1)" }}>
              推送方式（可多选）：
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-4" style={{ color: "rgba(180,210,240,1)" }}>
              {["站内信", "短信", "APP推送", "指挥中心大屏弹窗", "推送分管领导"].map((ch) => (
                <label key={ch} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={pushChannels.includes(ch)}
                    onChange={() =>
                      setPushChannels((prev) =>
                        prev.includes(ch) ? prev.filter((x) => x !== ch) : [...prev, ch]
                      )
                    }
                  />
                  {ch}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 text-xs">
              <button
                className="px-3 py-1.5 rounded"
                style={{ background: "rgba(16,38,76,1)", color: "rgba(140,180,210,1)" }}
                onClick={() => setShowPushModal(false)}
              >
                取消
              </button>
              <button
                className="px-4 py-1.5 rounded"
                style={{ background: "rgba(0,130,200,0.9)", color: "#fff" }}
                onClick={() => {
                  const targets = (selectedIds.length ? warningData.filter((w) => selectedIds.includes(w.id)) : filtered);
                  console.log("Batch push", { targets, channels: pushChannels });
                  setShowPushModal(false);
                }}
              >
                确认推送
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QualificationMonitor;