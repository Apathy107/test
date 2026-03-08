import React, { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

export interface AlertRuleConfig {
  name: string;
  condition: string;
  level: "blue" | "yellow" | "red";
  deviceType: string;
  pushMethods: string;
}

interface AlertRuleModalProps {
  open?: boolean;
  onClose?: () => void;
  onSaveRule?: (rule: AlertRuleConfig) => void;
}

const AlertRuleModal: React.FC<AlertRuleModalProps> = ({
  open = true,
  onClose = () => console.log("Close alert rule modal"),
  onSaveRule,
}) => {
  const [level, setLevel] = useState<"blue" | "yellow" | "red">("yellow");
  const [logic, setLogic] = useState<"and" | "or">("and");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [ruleName, setRuleName] = useState("单兵电量过低预警");
  const [deviceType, setDeviceType] = useState("全部设备");
  const [metric, setMetric] = useState("电池电量");
  const [op, setOp] = useState("<");
  const [value, setValue] = useState("20");
  const unit = "%";
  const allPushMethods = ["站内信", "短信", "APP推送", "指挥中心大屏弹窗", "推送分管领导"];
  const [selectedPushMethods, setSelectedPushMethods] = useState<string[]>([
    "站内信",
    "APP推送",
  ]);

  if (!open) return null;

  const levels = [
    { value: "blue" as const, label: "蓝色预警", color: "rgba(41,182,246,1)" },
    { value: "yellow" as const, label: "黄色预警", color: "rgba(255,202,40,1)" },
    { value: "red" as const, label: "红色预警", color: "rgba(239,68,68,1)" },
  ];

  const pushMethods = allPushMethods;

  return (
    <div
      data-cmp="AlertRuleModal"
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "rgba(16,22,38,1)", border: "1px solid rgba(40,58,90,1)", borderRadius: 8, width: 640, maxHeight: "80vh", overflow: "auto" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(30,50,80,1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "rgba(220,228,240,1)" }}>新建预警规则</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(120,145,180,1)" }}><X size={18} /></button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {/* Rule name */}
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">规则名称 *</label>
            <input
              className="form-input"
              placeholder="如：单兵电量低预警"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">适用设备类型</label>
              <select
                className="form-input"
                style={{ appearance: "none" }}
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
              >
                <option>全部设备</option>
                <option>多旋翼</option>
                <option>机库</option>
                <option>农业植保</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label">所属单位</label>
              <select className="form-input" style={{ appearance: "none" }}>
                <option>全部单位</option>
                <option>市局直属队</option>
                <option>东城分局</option>
              </select>
            </div>
          </div>

          {/* Specific devices */}
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">指定设备（可选，多选）</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
              {[
                "巡逻一号（DJI-M300-2024001）",
                "应急响应2号（DJI-M30T-2024002）",
                "侦查小蜂（DJI-MINI4-2024003）",
                "农业巡检1号（XAG-P100-2023001）",
              ].map((name) => {
                const checked = selectedDevices.includes(name);
                return (
                  <label
                    key={name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "4px 8px",
                      borderRadius: 4,
                      border: `1px solid ${checked ? "rgba(30,136,229,1)" : "rgba(40,58,90,1)"}`,
                      background: checked ? "rgba(30,136,229,0.15)" : "transparent",
                      cursor: "pointer",
                      fontSize: 11,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setSelectedDevices((prev) =>
                          prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
                        )
                      }
                      style={{ accentColor: "rgba(30,136,229,1)" }}
                    />
                    <span style={{ color: "rgba(180,200,230,1)" }}>{name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Alert level */}
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">预警级别</label>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              {levels.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setLevel(l.value)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    border: `1px solid ${level === l.value ? l.color : "rgba(40,58,90,1)"}`,
                    borderRadius: 4,
                    background: level === l.value ? `${l.color}20` : "rgba(18,26,44,1)",
                    color: level === l.value ? l.color : "rgba(120,145,180,1)",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: level === l.value ? 600 : 400,
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conditions */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <label className="form-label" style={{ margin: 0 }}>触发条件</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "rgba(120,145,180,1)" }}>条件逻辑：</span>
                {(["and", "or"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLogic(l)}
                    style={{
                      padding: "2px 10px",
                      border: `1px solid ${logic === l ? "rgba(30,136,229,1)" : "rgba(40,58,90,1)"}`,
                      borderRadius: 3,
                      background: logic === l ? "rgba(30,136,229,0.2)" : "transparent",
                      color: logic === l ? "rgba(100,181,246,1)" : "rgba(120,145,180,1)",
                      cursor: "pointer",
                      fontSize: 11,
                    }}
                  >
                    {l === "and" ? "且（AND）" : "或（OR）"}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <select
                    className="form-input"
                    style={{ flex: 2, appearance: "none" }}
                    value={metric}
                    onChange={(e) => setMetric(e.target.value)}
                  >
                    <option>电池电量</option>
                    <option>机库舱温</option>
                    <option>信号强度</option>
                    <option>累计飞行时长</option>
                    <option>供电电压</option>
                  </select>
                  <select
                    className="form-input"
                    style={{ flex: 1, appearance: "none" }}
                    value={op}
                    onChange={(e) => setOp(e.target.value)}
                  >
                    <option value="<">{"<"} 小于</option>
                    <option value=">">{">"} 大于</option>
                    <option value="=">{"="} 等于</option>
                  </select>
                  <input
                    className="form-input"
                    style={{ flex: 1 }}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                  <span style={{ color: "rgba(120,145,180,1)", fontSize: 12, whiteSpace: "nowrap" }}>{unit}</span>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(120,145,180,1)" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              <button
                style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "1px dashed rgba(40,58,90,1)", borderRadius: 4, padding: "6px 12px", color: "rgba(100,181,246,1)", cursor: "pointer", fontSize: 12 }}
                onClick={() => console.log("Add condition")}
              >
                <Plus size={13} /> 添加条件
              </button>
            </div>
          </div>

          {/* Push methods */}
          <div style={{ marginBottom: 20 }}>
            <label className="form-label">推送方式</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
              {pushMethods.map((m) => (
                <label key={m} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={selectedPushMethods.includes(m)}
                    onChange={() =>
                      setSelectedPushMethods((prev) =>
                        prev.includes(m)
                          ? prev.filter((x) => x !== m)
                          : [...prev, m]
                      )
                    }
                    style={{ accentColor: "rgba(30,136,229,1)" }}
                  />
                  <span style={{ fontSize: 12, color: "rgba(160,185,215,1)" }}>{m}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="btn-secondary" onClick={onClose}>取消</button>
            <button
              className="btn-primary-blue"
              onClick={() => {
                const condition = `${metric} ${op} ${value}${unit}`;
                const pushSummary = selectedPushMethods.join("、") || "站内信";
                onSaveRule?.({
                  name: ruleName.trim() || "新预警规则",
                  condition,
                  level,
                  deviceType,
                  pushMethods: pushSummary,
                });
                onClose();
              }}
            >
              保存规则
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertRuleModal;