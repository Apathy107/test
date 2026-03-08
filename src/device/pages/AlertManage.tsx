import React, { useState } from "react";
import { Plus, Bell, CheckCircle, Clock, Settings } from "lucide-react";
import AlertRuleModal from "@device/components/AlertRuleModal";
import StatusBadge from "@device/components/StatusBadge";

const AlertManage: React.FC = () => {
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"realtime" | "rules" | "history">("realtime");
  console.log("AlertManage page rendered");

  const [alerts, setAlerts] = useState([
    { id: "A001", level: "red", device: "高空瞭望3号", sn: "DJI-M300-2023002", msg: "电池电量低于10%，须立即返航", time: "09:38", status: "unhandled", receiver: "刘洋", unit: "南区分局" },
    { id: "A002", level: "yellow", device: "农业巡检1号", sn: "XAG-P100-2023001", msg: "累计飞行时长超1200小时，需执行大修保养", time: "08:15", status: "handling", receiver: "陈刚", unit: "郊区管理站" },
    { id: "A003", level: "yellow", device: "侦查小蜂", sn: "DJI-MINI4-2024003", msg: "季度保养逾期未执行，已标记带病运行", time: "昨天 16:00", status: "handling", receiver: "王芳", unit: "西城分局" },
    { id: "A004", level: "blue", device: "巡逻一号", sn: "DJI-M300-2024001", msg: "下次保养预计15天后到期，请提前安排", time: "今天 08:00", status: "handled", receiver: "张伟", unit: "市局直属队" },
  ]);

  const levelConfig: Record<string, { color: string; label: string }> = {
    red: { color: "rgba(239,68,68,1)", label: "红色" },
    yellow: { color: "rgba(255,202,40,1)", label: "黄色" },
    blue: { color: "rgba(41,182,246,1)", label: "蓝色" },
  };

  const statusConfig: Record<string, { color: string; label: string }> = {
    unhandled: { color: "rgba(239,68,68,1)", label: "未处置" },
    handling: { color: "rgba(255,167,38,1)", label: "处置中" },
    handled: { color: "rgba(76,175,80,1)", label: "已处置" },
  };

  const rules = [
    { name: "单兵电量低预警", condition: "电池电量 < 20%", level: "yellow", deviceType: "多旋翼", pushMethods: "站内信、APP", enabled: true },
    { name: "电量极低红色预警", condition: "电池电量 < 10%", level: "red", deviceType: "全部", pushMethods: "站内信、短信、APP、大屏", enabled: true },
    { name: "机库温度预警", condition: "机库舱温 > 40°C", level: "yellow", deviceType: "机库", pushMethods: "站内信、APP", enabled: true },
    { name: "保养逾期预警", condition: "保养逾期天数 > 7天", level: "yellow", deviceType: "全部", pushMethods: "APP、短信", enabled: false },
  ];

  const [feedbackTarget, setFeedbackTarget] = useState<(typeof alerts)[number] | null>(null);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackHandler, setFeedbackHandler] = useState("");
  const [feedbackTime, setFeedbackTime] = useState("");

  return (
    <div style={{ padding: "20px 24px", minHeight: "100%" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button className="btn-primary-blue" onClick={() => setShowRuleModal(true)} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
          <Plus size={13} /> 新建预警规则
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[
          { label: "实时预警", value: 3, color: "rgba(239,68,68,1)", sub: "红色1 黄色2" },
          { label: "待处置", value: 1, color: "rgba(255,167,38,1)", sub: "超30min未响应" },
          { label: "处置中", value: 2, color: "rgba(30,136,229,1)", sub: "等待反馈" },
          { label: "今日已闭环", value: 5, color: "rgba(76,175,80,1)", sub: "平均处置15min" },
          { label: "预警规则数", value: 4, color: "rgba(38,198,218,1)", sub: "启用3条" },
        ].map((s) => (
          <div key={s.label} className="panel-card" style={{ flex: 1, padding: "14px 16px" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "rgba(160,185,215,1)", marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: "rgba(100,130,170,1)", marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(30,50,80,1)", marginBottom: 16 }}>
        {([["realtime", "实时预警"], ["rules", "预警规则"], ["history", "处置记录"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: "8px 20px", background: "none", border: "none",
              borderBottom: activeTab === key ? "2px solid rgba(30,136,229,1)" : "2px solid transparent",
              color: activeTab === key ? "rgba(100,181,246,1)" : "rgba(120,145,180,1)",
              cursor: "pointer", fontSize: 13, fontWeight: activeTab === key ? 600 : 400, marginBottom: -1,
            }}
          >
            {label}
            {key === "realtime" && <span style={{ marginLeft: 6, background: "rgba(239,68,68,1)", color: "rgba(255,255,255,1)", borderRadius: 10, padding: "0 5px", fontSize: 10 }}>3</span>}
          </button>
        ))}
      </div>

      {/* Realtime alerts */}
      {activeTab === "realtime" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {alerts.map((a) => {
            const lc = levelConfig[a.level];
            const sc = statusConfig[a.status];
            return (
              <div
                key={a.id}
                className="panel-card"
                style={{ padding: "14px 20px", borderLeft: `4px solid ${lc.color}` }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 3, background: `${lc.color}20`, color: lc.color, border: `1px solid ${lc.color}40`, fontWeight: 600 }}>
                        {lc.label}预警
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(220,228,240,1)" }}>{a.device}</span>
                      <span style={{ fontSize: 11, color: "rgba(100,130,170,1)", fontFamily: "monospace" }}>{a.sn}</span>
                      <span style={{ fontSize: 11, color: "rgba(100,130,170,1)" }}>{a.unit}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "rgba(200,220,240,1)", marginBottom: 6 }}>{a.msg}</div>
                    <div style={{ display: "flex", gap: 16 }}>
                      <span style={{ fontSize: 11, color: "rgba(80,110,150,1)" }}>接收人：{a.receiver}</span>
                      <span style={{ fontSize: 11, color: "rgba(80,110,150,1)" }}>触发时间：{a.time}</span>
                      <span style={{ fontSize: 11, color: sc.color }}>状态：{sc.label}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
                    {a.status !== "handled" && (
                      <button
                        className="btn-primary"
                        style={{ fontSize: 11 }}
                        onClick={() => {
                          const now = new Date();
                          const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
                            now.getDate()
                          ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(
                            now.getMinutes()
                          ).padStart(2, "0")}`;
                          setFeedbackTarget(a);
                          setFeedbackContent("");
                          setFeedbackHandler(a.receiver);
                          setFeedbackTime(ts);
                        }}
                      >
                        处置反馈
                      </button>
                    )}
                    {a.status === "handled" && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(76,175,80,1)", fontSize: 12 }}>
                        <CheckCircle size={14} /> 已闭环
                      </div>
                    )}
                    <button className="btn-secondary" style={{ fontSize: 11 }}>详情</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rules */}
      {activeTab === "rules" && (
        <div className="panel-card" style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr className="table-header">
                {["规则名称", "触发条件", "预警级别", "适用设备", "推送方式", "状态", "操作"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", borderBottom: "1px solid rgba(30,50,80,1)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rules.map((r, i) => (
                <tr key={i} className="table-row">
                  <td style={{ padding: "10px 14px", color: "rgba(220,228,240,1)", fontWeight: 500 }}>{r.name}</td>
                  <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "rgba(160,185,215,1)" }}>{r.condition}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 3, background: `${levelConfig[r.level].color}20`, color: levelConfig[r.level].color }}>
                      {levelConfig[r.level].label}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{r.deviceType}</td>
                  <td style={{ padding: "10px 14px", fontSize: 11, color: "rgba(120,145,180,1)" }}>{r.pushMethods}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 3, background: r.enabled ? "rgba(76,175,80,0.15)" : "rgba(120,145,180,0.15)", color: r.enabled ? "rgba(129,199,132,1)" : "rgba(120,145,180,1)" }}>
                      {r.enabled ? "启用" : "停用"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn-secondary" style={{ fontSize: 10, padding: "3px 8px" }}>编辑</button>
                      <button style={{ fontSize: 10, padding: "3px 8px", background: r.enabled ? "rgba(239,68,68,0.1)" : "rgba(76,175,80,0.1)", color: r.enabled ? "rgba(239,83,80,1)" : "rgba(76,175,80,1)", border: `1px solid ${r.enabled ? "rgba(239,68,68,0.3)" : "rgba(76,175,80,0.3)"}`, borderRadius: 3, cursor: "pointer" }}>
                        {r.enabled ? "停用" : "启用"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* History */}
      {activeTab === "history" && (
        <div className="panel-card" style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr className="table-header">
                {["预警ID", "级别", "设备", "预警内容", "触发时间", "处置人", "处置结果", "耗时", "状态"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", borderBottom: "1px solid rgba(30,50,80,1)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { id: "A004", level: "blue", device: "巡逻一号", msg: "保养即将到期提醒", time: "2025-07-11 08:00", handler: "张伟", result: "已安排保养计划", duration: "8分钟", status: "handled" },
                { id: "A003", level: "yellow", device: "机库A01", msg: "机库温度超40°C", time: "2025-07-10 14:22", handler: "赵磊", result: "开启散热，温度恢复正常", duration: "23分钟", status: "handled" },
              ].map((h) => (
                <tr key={h.id} className="table-row">
                  <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "rgba(100,181,246,1)" }}>{h.id}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: 11, padding: "1px 6px", borderRadius: 2, background: `${levelConfig[h.level].color}20`, color: levelConfig[h.level].color }}>
                      {levelConfig[h.level].label}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", color: "rgba(200,220,240,1)" }}>{h.device}</td>
                  <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{h.msg}</td>
                  <td style={{ padding: "10px 14px", color: "rgba(120,145,180,1)", fontSize: 11 }}>{h.time}</td>
                  <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)" }}>{h.handler}</td>
                  <td style={{ padding: "10px 14px", color: "rgba(160,185,215,1)", fontSize: 11 }}>{h.result}</td>
                  <td style={{ padding: "10px 14px", color: "rgba(76,175,80,1)" }}>{h.duration}</td>
                  <td style={{ padding: "10px 14px" }}><StatusBadge status="completed" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {feedbackTarget && (
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
          onClick={(e) => e.target === e.currentTarget && setFeedbackTarget(null)}
        >
          <div
            className="panel-card"
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
                预警处置反馈 - {feedbackTarget.device}
              </div>
              <button
                className="btn-secondary"
                style={{ fontSize: 11, padding: "4px 10px" }}
                onClick={() => setFeedbackTarget(null)}
              >
                关闭
              </button>
            </div>
            <div style={{ marginBottom: 12, fontSize: 12, color: "rgba(160,185,215,1)" }}>
              {feedbackTarget.msg}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label className="form-label">处置内容 *</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="记录具体处置措施、过程和结果"
                  style={{ resize: "vertical" }}
                  value={feedbackContent}
                  onChange={(e) => setFeedbackContent(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">处置人 *</label>
                  <input
                    className="form-input"
                    value={feedbackHandler}
                    onChange={(e) => setFeedbackHandler(e.target.value)}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">处置时间 *</label>
                  <input
                    className="form-input"
                    value={feedbackTime}
                    onChange={(e) => setFeedbackTime(e.target.value)}
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
              <button className="btn-secondary" onClick={() => setFeedbackTarget(null)}>
                取消
              </button>
              <button
                className="btn-primary-blue"
                onClick={() => {
                  setAlerts((prev) =>
                    prev.map((al) =>
                      al.id === feedbackTarget.id ? { ...al, status: "handled" } : al
                    )
                  );
                  console.log("Submit alert feedback", {
                    id: feedbackTarget.id,
                    content: feedbackContent,
                    handler: feedbackHandler,
                    time: feedbackTime,
                  });
                  setFeedbackTarget(null);
                }}
              >
                提交反馈
              </button>
            </div>
          </div>
        </div>
      )}

      {showRuleModal && <AlertRuleModal open={showRuleModal} onClose={() => setShowRuleModal(false)} />}
    </div>
  );
};

export default AlertManage;