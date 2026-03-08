import React, { useState } from "react";
import { AlertTriangle, Info, AlertCircle, Search, CheckCircle } from "lucide-react";

type AlertLevel = "blue" | "yellow" | "red";
type AlertStatus = "unhandled" | "handling" | "closed";

interface AlertItem {
  id: string;
  level: AlertLevel;
  type: string;
  deviceId: string;
  time: string;
  status: AlertStatus;
  description: string;
}

const alertData: AlertItem[] = [
  { id: "ALT-001", level: "red", type: "信号丢失", deviceId: "UAV-004", time: "14:32:15", status: "unhandled", description: "设备失联超过30秒" },
  { id: "ALT-002", level: "yellow", type: "低电量警告", deviceId: "PL-001", time: "14:28:40", status: "handling", description: "电量低于20%，请注意返航" },
  { id: "ALT-003", level: "yellow", type: "低电量警告", deviceId: "UAV-002", time: "14:25:18", status: "unhandled", description: "电量低于30%，建议准备返航" },
  { id: "ALT-004", level: "blue", type: "保养提醒", deviceId: "AP-001", time: "14:20:00", status: "unhandled", description: "机场设备已达保养周期" },
  { id: "ALT-005", level: "blue", type: "飞行记录", deviceId: "UAV-001", time: "14:15:33", status: "closed", description: "任务T-2022已完成，请确认" },
  { id: "ALT-006", level: "red", type: "资质过期", deviceId: "飞手-012", time: "14:10:00", status: "unhandled", description: "飞手执照有效期已届满" },
  { id: "ALT-007", level: "blue", type: "系统通知", deviceId: "SYS", time: "13:58:22", status: "closed", description: "系统已完成日志归档" },
  { id: "ALT-008", level: "yellow", type: "维保提醒", deviceId: "UAV-003", time: "13:45:00", status: "unhandled", description: "飞行累计时间超过100小时，需维保" },
  { id: "ALT-009", level: "red", type: "电子围栏告警", deviceId: "UAV-001", time: "13:30:12", status: "closed", description: "飞行轨迹接近禁飞区边界" },
  { id: "ALT-010", level: "blue", type: "任务变更", deviceId: "T-2024", time: "13:20:05", status: "closed", description: "任务优先级已调整" },
];

const levelConfig = {
  blue: { color: "rgb(0, 180, 255)", bg: "rgba(0, 180, 255, 0.08)", icon: Info, label: "提示" },
  yellow: { color: "rgb(255, 200, 0)", bg: "rgba(255, 200, 0, 0.08)", icon: AlertTriangle, label: "警告" },
  red: { color: "rgb(255, 80, 80)", bg: "rgba(255, 80, 80, 0.08)", icon: AlertCircle, label: "紧急" },
};

const statusConfig = {
  unhandled: { label: "未处理", color: "rgb(255, 80, 80)" },
  handling: { label: "处理中", color: "rgb(255, 200, 0)" },
  closed: { label: "已闭环", color: "rgb(120, 130, 140)" },
};

/**
 * CommandAlerts - Device alert list with filtering panel
 */
const CommandAlerts: React.FC = () => {
  const [filterLevel, setFilterLevel] = useState<AlertLevel | "all">("all");
  const [searchText, setSearchText] = useState("");

  console.log("CommandAlerts rendered, filter:", filterLevel);

  const filtered = alertData.filter(a => {
    const matchLevel = filterLevel === "all" || a.level === filterLevel;
    const matchSearch = searchText === "" ||
      a.type.includes(searchText) || a.deviceId.includes(searchText) || a.description.includes(searchText);
    return matchLevel && matchSearch;
  });

  const counts = { red: alertData.filter(a => a.level === "red").length, yellow: alertData.filter(a => a.level === "yellow").length, blue: alertData.filter(a => a.level === "blue").length };

  return (
    <div data-cmp="CommandAlerts" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Filter bar */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
        {([
          { key: "all", label: "全部", color: "rgba(0, 200, 220, 1)" },
          { key: "red", label: `紧急(${counts.red})`, color: levelConfig.red.color },
          { key: "yellow", label: `警告(${counts.yellow})`, color: levelConfig.yellow.color },
          { key: "blue", label: `提示(${counts.blue})`, color: levelConfig.blue.color },
        ] as { key: AlertLevel | "all"; label: string; color: string }[]).map(f => (
          <button
            key={f.key}
            onClick={() => setFilterLevel(f.key)}
            style={{
              padding: "3px 10px",
              border: `1px solid ${filterLevel === f.key ? f.color : "rgba(0, 150, 200, 0.2)"}`,
              borderRadius: "2px",
              background: filterLevel === f.key ? `${f.color.replace("rgb(", "rgba(").replace(")", ", 0.15)")}` : "rgba(0, 15, 45, 0.6)",
              color: filterLevel === f.key ? f.color : "rgba(0, 180, 220, 0.45)",
              fontSize: "11px", fontFamily: "monospace",
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            {f.label}
          </button>
        ))}

        {/* Search */}
        <div style={{ flex: 1, position: "relative", minWidth: "100px" }}>
          <Search size={11} style={{ position: "absolute", left: "7px", top: "50%", transform: "translateY(-50%)", color: "rgba(0, 180, 220, 0.4)" }} />
          <input
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="搜索告警..."
            style={{ width: "100%", padding: "3px 8px 3px 22px", background: "rgba(0, 15, 45, 0.6)", border: "1px solid rgba(0, 150, 200, 0.2)", borderRadius: "2px", color: "rgb(180, 230, 255)", fontSize: "11px", fontFamily: "monospace", outline: "none", boxSizing: "border-box" }}
          />
        </div>
      </div>

      {/* Alert list */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: "5px" }}>
        {filtered.map((alert, i) => {
          const lc = levelConfig[alert.level];
          const sc = statusConfig[alert.status];
          const AlertIcon = lc.icon;

          return (
            <div
              key={alert.id}
              style={{
                background: i < 3 && alert.status === "unhandled"
                  ? `linear-gradient(90deg, ${lc.bg}, rgba(0, 8, 25, 0.9))`
                  : "rgba(0, 8, 25, 0.75)",
                border: `1px solid ${i < 3 && alert.status === "unhandled" ? lc.color.replace("rgb(", "rgba(").replace(")", ", 0.3)") : "rgba(0, 120, 170, 0.18)"}`,
                borderRadius: "3px",
                padding: "7px 10px",
                borderLeft: `3px solid ${lc.color}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <AlertIcon size={12} style={{ color: lc.color, flexShrink: 0 }} />
                <span style={{ fontSize: "11px", color: lc.color, fontFamily: "'Microsoft YaHei', sans-serif", fontWeight: "600", flexShrink: 0 }}>{alert.type}</span>
                <span style={{ fontSize: "10px", color: "rgba(0, 180, 220, 0.5)", fontFamily: "monospace", flex: 1 }}>{alert.deviceId}</span>
                <span style={{ fontSize: "10px", color: "rgba(0, 180, 220, 0.4)", fontFamily: "monospace", flexShrink: 0 }}>{alert.time}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "3px", flexShrink: 0 }}>
                  {alert.status === "closed" && <CheckCircle size={9} style={{ color: sc.color }} />}
                  <span style={{ fontSize: "10px", color: sc.color, fontFamily: "monospace" }}>{sc.label}</span>
                </div>
              </div>
              <div style={{ marginTop: "3px", fontSize: "10px", color: "rgba(0, 180, 220, 0.45)", fontFamily: "'Microsoft YaHei', sans-serif", paddingLeft: "19px" }}>{alert.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommandAlerts;