import React, { useState } from "react";
import StatusBadge from "@mission/components/StatusBadge";
import StatCard from "@mission/components/StatCard";
import {
  AlertTriangle,
  Shield,
  Zap,
  Thermometer,
  Wind,
  Radio,
  RotateCcw,
  Settings,
} from "lucide-react";
import AlertRuleModal, {
  AlertRuleConfig,
} from "@device/components/AlertRuleModal";

type AlertLevel = "red" | "yellow" | "blue";

interface AlertRecord {
  id: string;
  level: AlertLevel;
  title: string;
  device: string;
  taskName: string;
  time: string;
  status: "pending" | "handling" | "resolved";
  rule: string;
}

const initialAlerts: AlertRecord[] = [
  { id: "ALT-001", level: "red",    title: "设备电量低于10%，须立即返航",     device: "高空瞭望3号 (D005)", taskName: "滨江大道日常巡检",     time: "09:45:12", status: "pending",  rule: "电量 < 10%" },
  { id: "ALT-002", level: "red",    title: "信号丢失超过30秒，设备失联",       device: "侦察小蜂 (D003)",   taskName: "化工园区泄漏应急响应",  time: "09:42:35", status: "handling", rule: "信号丢失 > 10s" },
  { id: "ALT-003", level: "yellow", title: "风速超过10m/s，建议中止任务",      device: "巡逻一号 (D001)",   taskName: "森林防火预警侦察",      time: "09:38:00", status: "pending",  rule: "风速 > 10m/s" },
  { id: "ALT-004", level: "yellow", title: "任务执行超时30分钟，请关注",       device: "农业巡检1号 (D004)", taskName: "水库大坝专项检测",     time: "09:20:00", status: "handling", rule: "任务超时" },
  { id: "ALT-005", level: "yellow", title: "降雨量超过2mm/h，建议暂停任务",   device: "消费级无人机 (D006)", taskName: "港口码头周界检查",      time: "09:10:22", status: "resolved", rule: "降雨 > 2mm/h" },
  { id: "ALT-006", level: "blue",   title: "算法置信度0.76 < 0.80，触发人工复核", device: "侦察小蜂 (D003)", taskName: "化工园区泄漏应急响应", time: "09:05:44", status: "resolved", rule: "置信度 < 0.80" },
  { id: "ALT-007", level: "blue",   title: "设备电量低于20%，请注意续航",     device: "高空瞭望1号 (D002)", taskName: "南环快速路例行巡检",   time: "08:55:18", status: "resolved", rule: "电量 < 20%" },
];

const STATUS_LABEL: Record<string, string> = {
  pending: "待处置",
  handling: "处置中",
  resolved: "已处置",
};

const STATUS_COLOR: Record<string, string> = {
  pending:  "rgba(255,80,80,1)",
  handling: "rgba(255,200,0,1)",
  resolved: "rgba(0,200,120,1)",
};

const AlertCenter: React.FC = () => {
  const [filterLevel, setFilterLevel] = useState<"all" | AlertLevel>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "handling" | "resolved">("all");
  const [alerts, setAlerts] = useState<AlertRecord[]>(initialAlerts);
  const [handleTarget, setHandleTarget] = useState<AlertRecord | null>(null);
  const [handleContent, setHandleContent] = useState("");
  const [handlePerson, setHandlePerson] = useState("");
  const [handleTime, setHandleTime] = useState("");
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [rules, setRules] = useState<AlertRuleConfig[]>([
    {
      name: "电量 < 20%",
      condition: "电池电量 < 20%",
      level: "yellow",
      deviceType: "全部设备",
      pushMethods: "预警提醒",
    },
    {
      name: "电量 < 10%",
      condition: "电池电量 < 10%",
      level: "red",
      deviceType: "全部设备",
      pushMethods: "一键返航",
    },
    {
      name: "信号丢失 > 10s",
      condition: "信号丢失 > 10s",
      level: "red",
      deviceType: "全部设备",
      pushMethods: "告警通知",
    },
    {
      name: "任务超时",
      condition: "任务超时",
      level: "yellow",
      deviceType: "全部设备",
      pushMethods: "预警提醒",
    },
    {
      name: "风速 > 10m/s",
      condition: "风速 > 10m/s",
      level: "yellow",
      deviceType: "全部设备",
      pushMethods: "建议暂停",
    },
    {
      name: "降雨 > 2mm/h",
      condition: "降雨 > 2mm/h",
      level: "yellow",
      deviceType: "全部设备",
      pushMethods: "建议中止",
    },
  ]);
  const [pushChannels, setPushChannels] = useState<string[]>([
    "站内信",
    "短信",
    "APP弹窗",
    "指挥中心大屏",
  ]);

  const filtered = alerts.filter((a) => {
    const levelOk = filterLevel === "all" || a.level === filterLevel;
    const statusOk = filterStatus === "all" || a.status === filterStatus;
    return levelOk && statusOk;
  });

  console.log("AlertCenter rendered, filtered count:", filtered.length);

  const redCount    = alerts.filter((a) => a.level === "red").length;
  const yellowCount = alerts.filter((a) => a.level === "yellow").length;
  const blueCount   = alerts.filter((a) => a.level === "blue").length;
  const pendingCount = alerts.filter((a) => a.status === "pending").length;

  return (
    <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
          {/* Stat cards */}
          <div style={{ display: "flex", gap: "14px", marginBottom: "20px" }}>
            <div style={{ flex: 1 }}>
              <StatCard title="今日预警总数" value={alerts.length} unit="条" sub="较昨日 +2" trend="2" trendUp={false} icon={AlertTriangle} iconColor="rgba(255,80,80,1)" iconBg="rgba(120,20,20,0.4)" />
            </div>
            <div style={{ flex: 1 }}>
              <StatCard title="红色预警" value={redCount} unit="条" sub="需立即处置" icon={Shield} iconColor="rgba(255,59,59,1)" iconBg="rgba(120,10,10,0.4)" />
            </div>
            <div style={{ flex: 1 }}>
              <StatCard title="黄色预警" value={yellowCount} unit="条" sub="需关注处理" icon={Zap} iconColor="rgba(255,200,0,1)" iconBg="rgba(120,80,0,0.4)" />
            </div>
            <div style={{ flex: 1 }}>
              <StatCard title="蓝色预警" value={blueCount} unit="条" sub="一般提示" icon={Radio} iconColor="rgba(0,180,255,1)" iconBg="rgba(0,60,120,0.4)" />
            </div>
            <div style={{ flex: 1 }}>
              <StatCard title="待处置" value={pendingCount} unit="条" highlight="需处理" icon={AlertTriangle} iconColor="rgba(255,140,0,1)" iconBg="rgba(100,50,0,0.4)" />
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            {/* Alert list */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="tech-card" style={{ borderRadius: "6px" }}>
                {/* Header + filters */}
                <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(0,80,140,0.2)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "rgba(200,230,255,1)" }}>预警记录</span>
                    <span style={{ fontSize: "12px", color: "rgba(80,120,170,1)" }}>共 {filtered.length} 条</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {(["all", "red", "yellow", "blue"] as const).map((l) => (
                      <button
                        key={l}
                        onClick={() => setFilterLevel(l)}
                        style={{
                          padding: "3px 12px",
                          fontSize: "12px",
                          borderRadius: "3px",
                          cursor: "pointer",
                          background: filterLevel === l ? "rgba(0,100,160,0.5)" : "rgba(0,30,70,0.3)",
                          color: filterLevel === l ? "rgba(0,212,255,1)" : "rgba(120,160,210,1)",
                          border: filterLevel === l ? "1px solid rgba(0,180,255,0.4)" : "1px solid rgba(0,60,120,0.25)",
                        }}
                      >
                        {l === "all" ? "全部" : l === "red" ? "🔴 红色" : l === "yellow" ? "🟡 黄色" : "🔵 蓝色"}
                      </button>
                    ))}
                    <div style={{ height: "1px", background: "transparent", flex: 1 }} />
                    {(["all", "pending", "handling", "resolved"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        style={{
                          padding: "3px 12px",
                          fontSize: "12px",
                          borderRadius: "3px",
                          cursor: "pointer",
                          background: filterStatus === s ? "rgba(0,60,120,0.5)" : "rgba(0,20,50,0.3)",
                          color: filterStatus === s ? "rgba(180,220,255,1)" : "rgba(100,140,190,1)",
                          border: filterStatus === s ? "1px solid rgba(0,120,180,0.4)" : "1px solid rgba(0,50,100,0.25)",
                        }}
                      >
                        {s === "all" ? "全部状态" : STATUS_LABEL[s]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Alert rows */}
                {filtered.map((alert, idx) => {
                  const levelColors = {
                    red:    { border: "rgba(255,59,59,1)", dot: "rgba(255,59,59,1)", glow: "rgba(255,59,59,0.08)" },
                    yellow: { border: "rgba(255,200,0,1)", dot: "rgba(255,200,0,1)", glow: "rgba(255,200,0,0.06)" },
                    blue:   { border: "rgba(0,160,255,1)", dot: "rgba(0,160,255,1)", glow: "rgba(0,160,255,0.06)" },
                  }[alert.level];

                  return (
                    <div
                      key={alert.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        borderBottom: idx < filtered.length - 1 ? "1px solid rgba(0,60,120,0.12)" : "none",
                        background: alert.status === "pending" ? levelColors.glow : "transparent",
                        borderLeft: `3px solid ${alert.status === "pending" ? levelColors.border : "rgba(0,60,120,0.3)"}`,
                      }}
                    >
                      <div style={{ flexShrink: 0 }}>
                        <div
                          className={alert.level === "red" && alert.status === "pending" ? "blink" : ""}
                          style={{ width: "8px", height: "8px", borderRadius: "50%", background: levelColors.dot, boxShadow: `0 0 6px ${levelColors.dot}` }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                        <div style={{ fontSize: "13px", color: "rgba(200,225,255,1)", fontWeight: 500, marginBottom: "3px", wordBreak: "break-word" }}>
                          {alert.title}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", fontSize: "11px", color: "rgba(80,120,170,1)", alignItems: "baseline" }}>
                          <span>设备：{alert.device}</span>
                          <span>·</span>
                          <span>任务：{alert.taskName}</span>
                          <span>·</span>
                          <span>触发规则：{alert.rule}</span>
                        </div>
                      </div>
                      <div style={{ flexShrink: 0, textAlign: "right" }}>
                        <div
                          style={{
                            fontSize: "11px",
                            color: STATUS_COLOR[alert.status],
                            background: `${STATUS_COLOR[alert.status]}14`,
                            padding: "2px 8px",
                            borderRadius: "3px",
                            border: `1px solid ${STATUS_COLOR[alert.status]}35`,
                            marginBottom: "4px",
                            display: "inline-block",
                          }}
                        >
                          {STATUS_LABEL[alert.status]}
                        </div>
                        <div style={{ fontSize: "11px", color: "rgba(60,100,150,1)" }}>{alert.time}</div>
                      </div>
                      <div style={{ flexShrink: 0, display: "flex", gap: "6px" }}>
                        {alert.status !== "resolved" && (
                          <>
                            {alert.level === "red" && (
                              <button style={{ padding: "4px 10px", fontSize: "11px", background: "rgba(120,20,20,0.5)", color: "rgba(255,100,100,1)", border: "1px solid rgba(200,50,50,0.4)", borderRadius: "3px", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}>
                                <RotateCcw size={11} /> 一键返航
                              </button>
                            )}
                            <button
                              style={{ padding: "4px 10px", fontSize: "11px", background: "rgba(0,60,120,0.4)", color: "rgba(0,180,255,1)", border: "1px solid rgba(0,120,180,0.35)", borderRadius: "3px", cursor: "pointer" }}
                              onClick={() => {
                                const now = new Date();
                                const ts = `${now.getFullYear()}-${String(
                                  now.getMonth() + 1
                                ).padStart(2, "0")}-${String(now.getDate()).padStart(
                                  2,
                                  "0"
                                )} ${String(now.getHours()).padStart(2, "0")}:${String(
                                  now.getMinutes()
                                ).padStart(2, "0")}`;
                                setHandleTarget(alert);
                                setHandleContent("");
                                setHandlePerson(alert.device.split(" ")[0] || "值班人员");
                                setHandleTime(ts);
                              }}
                            >
                              处置
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: rule config */}
            <div style={{ width: "280px", flexShrink: 0 }}>
              <div className="tech-card" style={{ borderRadius: "6px" }}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(0,80,140,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(200,230,255,1)" }}>预警规则配置</span>
                  <button
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    onClick={() => setShowRuleModal(true)}
                    title="配置预警规则"
                  >
                    <Settings size={13} style={{ color: "rgba(0,150,200,0.9)" }} />
                  </button>
                </div>
                <div style={{ padding: "14px" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "rgba(80,120,170,1)",
                      marginBottom: "10px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    内置通用规则
                  </div>
                  {rules.map((r) => {
                    const Icon =
                      r.name.includes("信号") || r.condition.includes("信号")
                        ? Radio
                        : r.name.includes("风速") || r.condition.includes("风速")
                        ? Wind
                        : r.name.includes("降雨") || r.condition.includes("降雨")
                        ? Thermometer
                        : r.name.includes("任务超时") || r.condition.includes("任务超时")
                        ? AlertTriangle
                        : Zap;
                    const lc =
                      r.level === "red"
                        ? "rgba(255,59,59,1)"
                        : r.level === "yellow"
                        ? "rgba(255,200,0,1)"
                        : "rgba(0,160,255,1)";
                    return (
                      <div
                        key={r.name + r.condition}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "7px 10px",
                          borderRadius: "4px",
                          background: "rgba(0,30,70,0.3)",
                          marginBottom: "5px",
                          border: "1px solid rgba(0,60,120,0.2)",
                        }}
                      >
                        <Icon size={13} style={{ color: lc, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "11px",
                              color: "rgba(160,200,240,1)",
                            }}
                          >
                            {r.name}
                          </div>
                          <div
                            style={{
                              fontSize: "10px",
                              color: "rgba(80,120,170,1)",
                            }}
                          >
                            {r.condition}
                          </div>
                        </div>
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: lc,
                            flexShrink: 0,
                          }}
                        />
                      </div>
                    );
                  })}

                  <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid rgba(0,60,120,0.2)" }}>
                    <div style={{ fontSize: "11px", color: "rgba(80,120,170,1)", marginBottom: "8px" }}>推送方式</div>
                    {["站内信", "短信", "APP弹窗", "指挥中心大屏"].map((ch) => {
                      const enabled = pushChannels.includes(ch);
                      return (
                        <div
                          key={ch}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "6px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "12px",
                              color: enabled
                                ? "rgba(140,220,240,1)"
                                : "rgba(100,130,170,1)",
                            }}
                          >
                            {ch}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setPushChannels((prev) =>
                                prev.includes(ch)
                                  ? prev.filter((x) => x !== ch)
                                  : [...prev, ch]
                              )
                            }
                            style={{
                              width: "32px",
                              height: "16px",
                              borderRadius: "8px",
                              background: enabled
                                ? "rgba(0,150,210,0.85)"
                                : "rgba(10,30,60,0.9)",
                              cursor: "pointer",
                              position: "relative",
                              border: "1px solid rgba(0,120,200,0.6)",
                              padding: 0,
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                top: "1px",
                                left: enabled ? "16px" : "1px",
                                width: "12px",
                                height: "12px",
                                borderRadius: "50%",
                                background: enabled
                                  ? "rgba(0,212,255,1)"
                                  : "rgba(80,110,150,1)",
                                transition: "left 0.15s ease",
                              }}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    style={{
                      width: "100%",
                      marginTop: "10px",
                      padding: "8px",
                      fontSize: "12px",
                      background: "rgba(0,80,140,0.4)",
                      color: "rgba(0,180,255,1)",
                      border: "1px solid rgba(0,150,200,0.35)",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowRuleModal(true)}
                  >
                    + 新增自定义规则
                  </button>
                </div>
              </div>
            </div>
          </div>
      {/* 预警处置弹窗 */}
      {handleTarget && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={(e) => e.target === e.currentTarget && setHandleTarget(null)}
        >
          <div
            className="tech-card"
            style={{ width: 520, maxWidth: "90%", padding: "20px 24px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(220,228,240,1)" }}>
                异常预警处置 - {handleTarget.device}
              </div>
              <button
                className="btn-secondary"
                style={{ fontSize: 11, padding: "4px 10px" }}
                onClick={() => setHandleTarget(null)}
              >
                关闭
              </button>
            </div>
            <div style={{ marginBottom: 12, fontSize: 12, color: "rgba(160,185,215,1)" }}>
              {handleTarget.title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label className="form-label">处置情况 *</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="记录具体处置措施、过程和结果"
                  style={{ resize: "vertical" }}
                  value={handleContent}
                  onChange={(e) => setHandleContent(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">处置人 *</label>
                  <input
                    className="form-input"
                    value={handlePerson}
                    onChange={(e) => setHandlePerson(e.target.value)}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">处置时间 *</label>
                  <input
                    className="form-input"
                    value={handleTime}
                    onChange={(e) => setHandleTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 16,
              }}
            >
              <button className="btn-secondary" onClick={() => setHandleTarget(null)}>
                取消
              </button>
              <button
                className="btn-primary-blue"
                onClick={() => {
                  setAlerts((prev) =>
                    prev.map((al) =>
                      al.id === handleTarget.id ? { ...al, status: "resolved" } : al
                    )
                  );
                  console.log("Submit alert handling", {
                    id: handleTarget.id,
                    content: handleContent,
                    handler: handlePerson,
                    time: handleTime,
                  });
                  setHandleTarget(null);
                }}
              >
                提交处置
              </button>
            </div>
          </div>
        </div>
      )}
      {showRuleModal && (
        <AlertRuleModal
          open={showRuleModal}
          onClose={() => setShowRuleModal(false)}
          onSaveRule={(rule) => {
            setRules((prev) => [...prev, rule]);
          }}
        />
      )}
    </div>
  );
};

export default AlertCenter;
