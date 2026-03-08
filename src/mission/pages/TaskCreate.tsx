import React, { useState } from "react";
import {
  Info,
  Link2,
  Paperclip,
  Users,
  ChevronRight,
  Save,
  Send,
  AlertTriangle,
  Plus,
  Trash2,
} from "lucide-react";
import { syncTaskFromMission } from "@/business/urban/data/urbanPatrolTasks";

type TabKey = "basic" | "relation" | "attachment" | "collab";

const TabConfig: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "basic",      label: "基础信息配置", icon: Info },
  { key: "relation",   label: "关联配置",     icon: Link2 },
  { key: "attachment", label: "附件上传",     icon: Paperclip },
  { key: "collab",     label: "协作单位",     icon: Users },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  background: "rgba(0, 30, 70, 0.5)",
  border: "1px solid rgba(0, 100, 160, 0.35)",
  borderRadius: "4px",
  color: "rgba(180, 210, 240, 1)",
  fontSize: "13px",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "rgba(100, 150, 200, 1)",
  marginBottom: "6px",
  display: "block",
};

const requiredDot = (
  <span style={{ color: "rgba(255, 80, 80, 1)", marginLeft: "2px" }}>*</span>
);

const TaskCreate: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [priority, setPriority] = useState("medium");
  const [timeMode, setTimeMode] = useState("periodic"); // Changed default to show specific req
  const [taskType, setTaskType] = useState("inspection"); // inspection | emergency | security | special | dispatch | city_normal | city_special | city_emergency
  const [taskName, setTaskName] = useState("");
  const [taskNo, setTaskNo] = useState("RW-XJ-2025-0043");
  
  // Specific feature: Multiple periodic times
  const [periodicTimes, setPeriodicTimes] = useState([{ freq: "每天", start: "09:00", end: "10:00" }]);
  
  // Specific feature: Modal for expired pilot
  const [showPilotWarningModal, setShowPilotWarningModal] = useState(false);
  const [selectedPilot, setSelectedPilot] = useState<string>("");
  const [collabSearch, setCollabSearch] = useState("");
  const [collabUnits, setCollabUnits] = useState<string[]>([]);
  const [taskRecords, setTaskRecords] = useState<
    { id: string; name: string; approvalStatus: "未审批" | "审批中" }[]
  >([]);

  console.log("TaskCreate rendered, tab:", activeTab);

  const addPeriodicTime = () => {
    setPeriodicTimes([...periodicTimes, { freq: "每周一", start: "14:00", end: "15:00" }]);
  };

  const removePeriodicTime = (index: number) => {
    setPeriodicTimes(periodicTimes.filter((_, i) => i !== index));
  };

  const simulatePilotSelect = () => {
    // Simulate selecting a pilot and the system detecting expired certification
    setSelectedPilot("刘洋");
    setShowPilotWarningModal(true);
  };

  const buildTaskRecord = (approvalStatus: "未审批" | "审批中") => {
    const record = {
      id: taskNo || "RW-TASK-TEMP",
      name: taskName || "未命名任务",
      approvalStatus,
    };
    setTaskRecords((prev) => [...prev, record]);
    console.log("Create task record:", record);

    // 同步到任务台账（使用 localStorage 作为简单共享存储）
    if (typeof window !== "undefined") {
      const STORAGE_KEY = "mission_custom_tasks";
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const list = raw ? JSON.parse(raw) : [];
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        const startTime = `${String(now.getHours()).padStart(
          2,
          "0"
        )}:${String(now.getMinutes()).padStart(2, "0")}`;
        const typeMap: Record<string, string> = {
          inspection: "常态化巡检",
          emergency: "紧急任务",
          security: "安保任务",
          special: "专项任务",
          dispatch: "调度任务",
          city_normal: "城市常态化巡查",
          city_special: "城市专项巡查",
          city_emergency: "城市应急处置",
        };
        const typeLabel = typeMap[taskType] || "常态化巡检";
        const timeModeLabel =
          timeMode === "immediate"
            ? "立即执行"
            : timeMode === "scheduled"
            ? "定时执行"
            : "周期执行";
        const stored = {
          id: record.id,
          name: record.name,
          type: typeLabel,
          date: dateStr,
          priority,
          status: "pending",
          approvalStatus: record.approvalStatus,
          device: "待分配设备",
          pilot: selectedPilot || "待分配飞手",
          startTime,
          duration: "待执行",
          timeMode: timeModeLabel,
          planStart: `${dateStr} ${startTime}`,
          planEnd: "",
          route: "待规划航线",
          autoPlan: "—",
          devices: [],
          pilots: selectedPilot ? [selectedPilot] : [],
          algorithms: [],
          attachments: [],
          partners: collabUnits,
        };
        const next = Array.isArray(list) ? [...list, stored] : [stored];
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

        // 当任务类型为「城市常态化巡查」时，同步至【城市综合治理】-【常态化巡查】
        if (taskType === "city_normal") {
          try {
            syncTaskFromMission({
              id: record.id,
              name: record.name,
              date: dateStr,
              priority,
              status: "pending",
              startTime,
              planStart: `${dateStr} ${startTime}`,
              device: "待分配设备",
              pilot: selectedPilot || undefined,
            });
          } catch (e) {
            console.warn("Failed to sync task to urban patrol", e);
          }
        }
      } catch (e) {
        console.warn("Failed to sync task to dashboard storage", e);
      }
    }
  };

  const handleSaveDraft = () => {
    buildTaskRecord("未审批");
    alert("已保存草稿（当前为前端模拟记录，可与审批模块对接）");
  };

  const handleSubmitApproval = () => {
    buildTaskRecord("审批中");
    alert("已提交审批（当前为前端模拟，实际接入后将进入审批流程）");
  };

  const pilotWarningModal = showPilotWarningModal ? (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0, 0, 0, 0.7)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}>
      <div className="border-glow-yellow shadow-custom" style={{
        background: "rgba(15, 25, 45, 0.95)",
        padding: "24px 32px",
        borderRadius: "8px",
        width: "420px",
        boxShadow: "0 0 30px rgba(255,180,0,0.2)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,180,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertTriangle size={20} style={{ color: "rgba(255,180,0,1)" }} />
          </div>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "rgba(255,200,0,1)" }}>飞手资质异常提醒</div>
        </div>
        <div style={{ fontSize: "13px", color: "rgba(200,220,240,1)", lineHeight: "1.6", marginBottom: "24px" }}>
          您选择的飞手 <strong style={{ color: "rgba(255,255,255,1)" }}>「刘洋」</strong> 的相关飞行资质证书已过期，系统标记为不合规状态。
          <br /><br />
          <span style={{ color: "rgba(255,140,0,1)" }}>请核查是否仍需由其执行本次任务？如果执意指派，本次操作将被记录在安全审计日志中。</span>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button
            onClick={() => setShowPilotWarningModal(false)}
            style={{ padding: "8px 16px", fontSize: "13px", background: "transparent", color: "rgba(140,180,220,1)", border: "1px solid rgba(100,150,200,0.4)", borderRadius: "4px", cursor: "pointer" }}
          >
            重新选择飞手
          </button>
          <button
            onClick={() => setShowPilotWarningModal(false)}
            style={{ padding: "8px 16px", fontSize: "13px", background: "rgba(180,100,0,0.2)", color: "rgba(255,180,0,1)", border: "1px solid rgba(255,180,0,0.5)", borderRadius: "4px", cursor: "pointer" }}
          >
            确认指派 (需上报)
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto", position: "relative" }}>
          {/* Step tabs */}
          <div
            style={{
              display: "flex",
              marginBottom: "20px",
              background: "rgba(4, 12, 30, 0.8)",
              borderRadius: "6px",
              border: "1px solid rgba(0, 100, 160, 0.25)",
              overflow: "hidden",
            }}
          >
            {TabConfig.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <React.Fragment key={tab.key}>
                  <button
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "12px",
                      fontSize: "13px",
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "rgba(0, 212, 255, 1)" : "rgba(100, 150, 200, 1)",
                      background: isActive ? "rgba(0, 80, 140, 0.4)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      borderBottom: isActive ? "2px solid rgba(0, 212, 255, 1)" : "2px solid transparent",
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: isActive ? "rgba(0, 212, 255, 0.2)" : "rgba(0, 60, 120, 0.3)",
                        border: `1px solid ${isActive ? "rgba(0,212,255,0.6)" : "rgba(0,80,140,0.4)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        color: isActive ? "rgba(0,212,255,1)" : "rgba(100,150,200,1)",
                      }}
                    >
                      {idx + 1}
                    </div>
                    <Icon size={14} />
                    {tab.label}
                  </button>
                  {idx < TabConfig.length - 1 && (
                    <ChevronRight
                      size={14}
                      style={{ color: "rgba(60,100,150,1)", alignSelf: "center", flexShrink: 0 }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Form area */}
          <div className="tech-card" style={{ borderRadius: "6px", padding: "24px" }}>

            {/* === BASIC INFO TAB === */}
            <div style={{ display: activeTab === "basic" ? "block" : "none" }}>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "rgba(0,212,255,1)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Info size={15} /> 基础信息配置
              </div>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                {/* Left column */}
                <div style={{ flex: 1, minWidth: "280px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>任务名称 {requiredDot}</label>
                    <input
                      style={inputStyle}
                      placeholder="请输入任务名称"
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>任务编号 {requiredDot}</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        style={{ ...inputStyle, flex: 1 }}
                        value={taskNo}
                        onChange={(e) => setTaskNo(e.target.value)}
                      />
                      <button
                        style={{ padding: "8px 12px", background: "rgba(0,60,120,0.4)", color: "rgba(0,212,255,1)", border: "1px solid rgba(0,150,200,0.35)", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                        onClick={() => {
                          const now = new Date();
                          const autoNo = `RW-${taskType === "emergency" ? "JJ" : "XJ"}-${now.getFullYear()}-${String(
                            taskRecords.length + 43
                          ).padStart(4, "0")}`;
                          setTaskNo(autoNo);
                        }}
                      >
                        自动生成
                      </button>
                    </div>
                    <div style={{ fontSize: "11px", color: "rgba(80,120,170,1)", marginTop: "4px" }}>格式：RW-类型-年份-序号</div>
                  </div>
                  <div>
                    <label style={labelStyle}>任务类型 {requiredDot}</label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {[
                        { v: "inspection",   l: "常态化巡检" },
                        { v: "emergency",    l: "紧急" },
                        { v: "security",     l: "安保" },
                        { v: "special",      l: "专项" },
                        { v: "dispatch",     l: "调度" },
                        { v: "city_normal",  l: "城市常态化巡查" },
                        { v: "city_special", l: "城市专项巡查" },
                        { v: "city_emergency", l: "城市应急处置" },
                      ].map((t) => (
                        <button
                          key={t.v}
                          onClick={() => setTaskType(t.v)}
                          style={{
                            padding: "5px 14px",
                            fontSize: "12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            background: taskType === t.v ? "rgba(0,120,180,0.5)" : "rgba(0,30,70,0.4)",
                            color: taskType === t.v ? "rgba(0,212,255,1)" : "rgba(120,170,220,1)",
                            border: taskType === t.v ? "1px solid rgba(0,212,255,0.5)" : "1px solid rgba(0,80,140,0.3)",
                          }}
                        >
                          {t.l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div style={{ flex: 1, minWidth: "280px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>优先级 {requiredDot}</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[
                        { v: "urgent", l: "紧急", c: "rgba(255,59,59,1)" },
                        { v: "high",   l: "高",   c: "rgba(255,120,0,1)" },
                        { v: "medium", l: "中",   c: "rgba(255,200,0,1)" },
                        { v: "low",    l: "低",   c: "rgba(80,180,80,1)" },
                      ].map((p) => (
                        <button
                          key={p.v}
                          onClick={() => setPriority(p.v)}
                          style={{
                            flex: 1,
                            padding: "6px",
                            fontSize: "12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            background: priority === p.v ? `${p.c}22` : "rgba(0,30,70,0.4)",
                            color: priority === p.v ? p.c : "rgba(120,170,220,1)",
                            border: priority === p.v ? `1px solid ${p.c}88` : "1px solid rgba(0,80,140,0.3)",
                            fontWeight: priority === p.v ? 600 : 400,
                          }}
                        >
                          {p.l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>执行时间 {requiredDot}</label>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                      {[
                        { v: "immediate", l: "立即执行" },
                        { v: "scheduled", l: "定时执行" },
                        { v: "periodic",  l: "周期执行" },
                      ].map((t) => (
                        <button
                          key={t.v}
                          onClick={() => setTimeMode(t.v)}
                          style={{
                            flex: 1,
                            padding: "5px",
                            fontSize: "12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            background: timeMode === t.v ? "rgba(0,100,160,0.5)" : "rgba(0,30,70,0.4)",
                            color: timeMode === t.v ? "rgba(0,212,255,1)" : "rgba(120,170,220,1)",
                            border: timeMode === t.v ? "1px solid rgba(0,200,255,0.4)" : "1px solid rgba(0,80,140,0.3)",
                          }}
                        >
                          {t.l}
                        </button>
                      ))}
                    </div>
                    {/* Specific Requirement: Multi-period setup for periodic tasks */}
                    {timeMode === "periodic" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", background: "rgba(0,40,80,0.3)", padding: "12px", borderRadius: "4px", border: "1px solid rgba(0,80,140,0.3)" }}>
                        <div style={{ fontSize: "12px", color: "rgba(100,150,200,1)", marginBottom: "4px", display: "flex", justifyContent: "space-between" }}>
                          <span>配置执行频次与时段</span>
                          <button onClick={addPeriodicTime} style={{ background: "none", border: "none", color: "rgba(0,212,255,1)", cursor: "pointer", display: "flex", alignItems: "center", gap: "2px", fontSize: "11px" }}>
                            <Plus size={12} /> 添加时段
                          </button>
                        </div>
                        {periodicTimes.map((pt, idx) => (
                          <div key={idx} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <select style={{ ...inputStyle, width: "100px", padding: "6px" }} value={pt.freq}>
                              <option>每天</option>
                              <option>每周一</option>
                              <option>每周三</option>
                              <option>每月1日</option>
                            </select>
                            <input type="time" style={{ ...inputStyle, padding: "6px" }} defaultValue={pt.start} />
                            <span style={{ color: "rgba(100,150,200,1)" }}>-</span>
                            <input type="time" style={{ ...inputStyle, padding: "6px" }} defaultValue={pt.end} />
                            {periodicTimes.length > 1 && (
                              <button onClick={() => removePeriodicTime(idx)} style={{ background: "none", border: "none", color: "rgba(255,80,80,0.8)", cursor: "pointer", padding: "4px" }}>
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {timeMode === "scheduled" && (
                       <input type="datetime-local" style={{ ...inputStyle, flex: 1 }} />
                    )}
                  </div>
                  <div>
                    <label style={labelStyle}>任务描述</label>
                    <textarea
                      rows={3}
                      style={{ ...inputStyle, resize: "vertical" }}
                      placeholder="请输入任务说明、背景及注意事项..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* === RELATION TAB === */}
            <div style={{ display: activeTab === "relation" ? "block" : "none" }}>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "rgba(0,212,255,1)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Link2 size={15} /> 关联配置
              </div>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "280px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>关联航线 {requiredDot}</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input style={{ ...inputStyle, flex: 1 }} placeholder="搜索或选择航线" />
                      <button style={{ padding: "8px 14px", background: "rgba(0,80,140,0.4)", color: "rgba(0,212,255,1)", border: "1px solid rgba(0,150,200,0.35)", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>
                        选择
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>关联设备 {requiredDot}</label>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                      <button style={{ padding: "5px 12px", fontSize: "12px", background: "rgba(0,60,120,0.4)", color: "rgba(0,212,255,1)", border: "1px solid rgba(0,120,180,0.4)", borderRadius: "4px", cursor: "pointer" }}>
                        手动选择
                      </button>
                      <button style={{ padding: "5px 12px", fontSize: "12px", background: "rgba(0,100,60,0.3)", color: "rgba(0,200,120,1)", border: "1px solid rgba(0,180,100,0.4)", borderRadius: "4px", cursor: "pointer" }}>
                        ✦ 智能推荐
                      </button>
                    </div>
                    <div style={{ padding: "10px", background: "rgba(0,40,80,0.3)", borderRadius: "4px", border: "1px solid rgba(0,80,140,0.25)" }}>
                      <div style={{ fontSize: "12px", color: "rgba(0,200,120,1)", marginBottom: "6px" }}>智能推荐结果</div>
                      {["高空瞭望3号 (D005) — 距任务区最近，电量95%", "侦察小蜂 (D003) — 擅长低空侦察，电量88%"].map((d) => (
                        <div key={d} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(0,60,120,0.2)", fontSize: "12px", color: "rgba(160,200,240,1)" }}>
                          <span>{d}</span>
                          <button style={{ padding: "2px 8px", fontSize: "11px", background: "rgba(0,80,140,0.4)", color: "rgba(0,212,255,1)", border: "1px solid rgba(0,150,200,0.35)", borderRadius: "3px", cursor: "pointer" }}>
                            添加
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: "280px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>关联飞手 {requiredDot}</label>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                      <input style={{ ...inputStyle, flex: 1 }} value={selectedPilot} placeholder="搜索飞手姓名/工号" readOnly={!!selectedPilot} />
                      <button
                        onClick={simulatePilotSelect} // Trigger the new modal warning here
                        style={{ padding: "8px 14px", background: "rgba(0,80,140,0.4)", color: "rgba(0,212,255,1)", border: "1px solid rgba(0,150,200,0.35)", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                      >
                        选择
                      </button>
                      {selectedPilot && (
                        <button onClick={() => setSelectedPilot("")} style={{ padding: "8px 10px", background: "transparent", color: "rgba(255,80,80,1)", border: "1px solid rgba(255,80,80,0.35)", borderRadius: "4px", cursor: "pointer" }}>
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>关联算法</label>
                    <select style={inputStyle}>
                      <option>目标检测算法 v2.3（置信度阈值：0.80）</option>
                      <option>人员识别算法 v1.8（置信度阈值：0.85）</option>
                      <option>火灾烟雾识别算法 v3.1（置信度阈值：0.90）</option>
                    </select>
                    <div style={{ fontSize: "11px", color: "rgba(255,180,0,0.8)", marginTop: "4px" }}>
                      ⚠ 置信度 &lt; 0.80 时将触发人工复核流程
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>自动规划作业关联</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input style={{ ...inputStyle, flex: 1 }} placeholder="关联自动规划作业编号" />
                      <button style={{ padding: "8px 14px", background: "rgba(0,80,140,0.4)", color: "rgba(0,212,255,1)", border: "1px solid rgba(0,150,200,0.35)", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>
                        关联
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* === ATTACHMENT TAB === */}
            <div style={{ display: activeTab === "attachment" ? "block" : "none" }}>
               {/* 保持原有结构 */}
              <div style={{ fontSize: "15px", fontWeight: 600, color: "rgba(0,212,255,1)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Paperclip size={15} /> 附件上传
              </div>
              <div
                style={{
                  border: "2px dashed rgba(0,150,200,0.4)",
                  borderRadius: "8px",
                  padding: "40px",
                  textAlign: "center",
                  background: "rgba(0,40,90,0.2)",
                  cursor: "pointer",
                  marginBottom: "16px",
                }}
              >
                <Paperclip size={32} style={{ color: "rgba(0,150,200,0.6)", margin: "0 auto 12px" }} />
                <div style={{ fontSize: "14px", color: "rgba(120,170,220,1)", marginBottom: "6px" }}>
                  点击或拖拽文件至此区域上传
                </div>
                <div style={{ fontSize: "12px", color: "rgba(80,120,170,1)" }}>
                  支持巡检图纸、应急预案、任务说明等文件，单文件最大 50MB
                </div>
              </div>
            </div>

            {/* === COLLAB TAB === */}
            <div style={{ display: activeTab === "collab" ? "block" : "none" }}>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "rgba(0,212,255,1)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Users size={15} /> 协作单位选择
              </div>
              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>搜索协作单位</label>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <input
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="输入单位名称并添加"
                      value={collabSearch}
                      onChange={(e) => setCollabSearch(e.target.value)}
                    />
                    <button
                      style={{
                        padding: "8px 12px",
                        fontSize: "12px",
                        background: "rgba(0,80,140,0.5)",
                        color: "rgba(0,212,255,1)",
                        border: "1px solid rgba(0,150,200,0.5)",
                        borderRadius: "4px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                      onClick={() => {
                        const name = collabSearch.trim();
                        if (!name) return;
                        setCollabUnits((prev) =>
                          prev.includes(name) ? prev : [...prev, name]
                        );
                        setCollabSearch("");
                      }}
                    >
                      添加
                    </button>
                  </div>
                  <div style={{ fontSize: "12px", color: "rgba(80,120,170,1)", marginBottom: "8px" }}>可选协作单位</div>
                  {["消防救援支队", "公安交警大队", "生态环境局监察大队"].map((u) => (
                    <div key={u} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(0,30,70,0.3)", borderRadius: "4px", marginBottom: "5px", border: "1px solid rgba(0,60,120,0.25)" }}>
                      <span style={{ fontSize: "12px", color: "rgba(160,200,240,1)" }}>{u}</span>
                      <button
                        style={{ padding: "2px 10px", fontSize: "11px", background: "rgba(0,80,140,0.4)", color: "rgba(0,212,255,1)", border: "1px solid rgba(0,150,200,0.35)", borderRadius: "3px", cursor: "pointer" }}
                        onClick={() =>
                          setCollabUnits((prev) =>
                            prev.includes(u) ? prev : [...prev, u]
                          )
                        }
                      >
                        添加
                      </button>
                    </div>
                  ))}
                  {collabUnits.length > 0 && (
                    <div style={{ marginTop: "10px" }}>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "rgba(80,120,170,1)",
                          marginBottom: "4px",
                        }}
                      >
                        已选协作单位
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {collabUnits.map((u) => (
                          <span
                            key={u}
                            style={{
                              fontSize: "11px",
                              color: "rgba(180,220,255,1)",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              background: "rgba(0,60,100,0.6)",
                              border: "1px solid rgba(0,150,200,0.5)",
                            }}
                          >
                            {u}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          {/* Form actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
            <button style={{ padding: "8px 20px", fontSize: "13px", background: "rgba(0,40,90,0.5)", color: "rgba(140,180,220,1)", border: "1px solid rgba(0,80,140,0.35)", borderRadius: "4px", cursor: "pointer" }}>
              取消
            </button>
            <button
              style={{ padding: "8px 20px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", background: "rgba(0,60,120,0.5)", color: "rgba(0,180,255,1)", border: "1px solid rgba(0,150,200,0.4)", borderRadius: "4px", cursor: "pointer" }}
              onClick={handleSaveDraft}
            >
              <Save size={13} /> 保存草稿
            </button>
            <button
              style={{ padding: "8px 24px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", background: "rgba(0,120,180,0.7)", color: "rgba(220,245,255,1)", border: "1px solid rgba(0,212,255,0.5)", borderRadius: "4px", cursor: "pointer", fontWeight: 600 }}
              onClick={handleSubmitApproval}
            >
              <Send size={13} /> 提交审批
            </button>
          </div>
        </div>

      {pilotWarningModal}
    </div>
  );
};

export default TaskCreate;
