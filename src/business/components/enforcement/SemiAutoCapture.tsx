import React, { useState, useMemo } from "react";
import { Camera, Square, Save, Maximize2, Server, Activity, Cpu, ChevronDown } from "lucide-react";
import { BOUND_SCHEDULED_ALGOS, AlgoOption } from "./algoFromSystem";

const typeIcon = { cloud: Server, edge: Activity, air: Cpu };
const typeColor = { cloud: "rgba(0, 210, 240, 1)", edge: "rgba(0, 205, 135, 1)", air: "rgba(255, 185, 0, 1)" };

interface AlgoSwitch extends AlgoOption {
  enabled: boolean;
}

const SemiAutoCapture: React.FC = () => {
  const [algos, setAlgos] = useState<AlgoSwitch[]>(() =>
    BOUND_SCHEDULED_ALGOS.filter((a) => a.enabled).map((a) => ({ ...a, enabled: true }))
  );
  const [algoComboOpen, setAlgoComboOpen] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [captureCount, setCaptureCount] = useState(7);

  const allAlgosFromSystem = useMemo(() => BOUND_SCHEDULED_ALGOS, []);
  const toggleAlgo = (id: string) =>
    setAlgos((prev) => {
      const has = prev.find((a) => a.id === id);
      if (has) return prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a));
      const algo = allAlgosFromSystem.find((a) => a.id === id);
      if (algo) return [...prev, { ...algo, enabled: true }];
      return prev;
    });
  const comboLabel = algos.filter((a) => a.enabled).length
    ? algos.filter((a) => a.enabled).map((a) => a.name).join("、")
    : "请选择算法（同步算法管理绑定与调度）";

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "7px 11px",
    border: "1px solid rgba(0, 110, 170, 0.42)",
    borderRadius: "4px",
    fontSize: "12px",
    background: "rgba(4, 16, 46, 1)",
    color: "rgba(170, 215, 248, 1)",
    outline: "none",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "rgba(200, 232, 255, 1)", margin: 0 }}>半自动化非现抓拍</h2>
        <p style={{ fontSize: "11px", color: "rgba(70, 138, 200, 1)", margin: "3px 0 0" }}>实时图传画面，配合AI算法检测，支持人工精准介入抓拍</p>
      </div>

      <div className="enf-card" style={{ padding: "12px 16px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "160px" }}>
            <label style={{ fontSize: "11px", color: "rgba(70, 138, 200, 1)", display: "block", marginBottom: "4px" }}>设备选择</label>
            <select style={inputStyle}>
              <option>侦察小蜂 (D003) — 执行中</option>
              <option>高空瞭望1号 (D001) — 待机</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
            <label style={{ fontSize: "11px", color: "rgba(70, 138, 200, 1)", display: "block", marginBottom: "4px" }}>算法组合（同步系统支撑平台-算法管理-绑定与调度分发）</label>
            <div
              style={{ ...inputStyle, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
              onClick={() => setAlgoComboOpen((o) => !o)}
            >
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{comboLabel}</span>
              <ChevronDown size={13} style={{ color: "rgba(70, 138, 200, 1)", flexShrink: 0 }} />
            </div>
            {algoComboOpen && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: "2px", background: "rgba(8, 24, 60, 1)", border: "1px solid rgba(0, 110, 170, 0.42)", borderRadius: "4px", padding: "8px", zIndex: 20, maxHeight: "200px", overflowY: "auto" }}>
                {allAlgosFromSystem.map((a) => {
                  const on = algos.find((x) => x.id === a.id)?.enabled ?? false;
                  return (
                    <label key={a.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 0", cursor: "pointer", fontSize: "11px", color: "rgba(170, 215, 248, 1)" }}>
                      <input type="checkbox" checked={on} onChange={() => toggleAlgo(a.id)} />
                      {a.name}（{a.type === "cloud" ? "云端" : a.type === "edge" ? "边缘" : "机载"}）
                    </label>
                  );
                })}
              </div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: "120px" }}>
            <label style={{ fontSize: "11px", color: "rgba(70, 138, 200, 1)", display: "block", marginBottom: "4px" }}>人工接管</label>
            <button style={{ width: "100%", padding: "7px 0", background: "rgba(78, 8, 8, 0.42)", color: "rgba(255, 100, 100, 1)", border: "1px solid rgba(255, 60, 60, 0.32)", borderRadius: "4px", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>
              🕹 申请接管控制
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "14px" }}>
        <div className="enf-card" style={{ flex: 2, minHeight: "360px", position: "relative", overflow: "hidden", background: "rgba(2, 8, 22, 1)" }}>
          <div className="scanline" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 600 360">
            <rect x="80"  y="175" width="120" height="80" fill="none" stroke="rgba(0,205,135,1)" strokeWidth="1.5" />
            <text x="82"  y="170" fontSize="10" fill="rgba(0,205,135,1)" fontFamily="monospace">车辆 99.2%</text>
            <rect x="350" y="135" width="55"  height="120" fill="none" stroke="rgba(0,210,240,1)" strokeWidth="1.5" />
            <text x="352" y="130" fontSize="10" fill="rgba(0,210,240,1)" fontFamily="monospace">行人 95.7%</text>
            <rect x="78" y="253" width="68" height="17" fill="rgba(255,60,60,0.82)" rx="2" />
            <text x="82" y="265" fontSize="9" fill="rgba(255,255,255,1)" fontFamily="monospace">违规停车</text>
            <line x1="297" y1="177" x2="297" y2="190" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line x1="291" y1="183" x2="303" y2="183" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          </svg>
          <div style={{ position: "absolute", top: "10px", left: "10px", right: "10px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              <div className="blink" style={{ padding: "3px 8px", background: "rgba(255,55,55,0.88)", color: "rgba(255,255,255,1)", borderRadius: "3px", fontSize: "10px", fontWeight: 700, letterSpacing: "1px" }}>● LIVE</div>
              <div style={{ padding: "3px 8px", background: "rgba(0,0,0,0.58)", color: "rgba(140,205,248,1)", borderRadius: "3px", fontSize: "10px" }}>侦察小蜂 D003</div>
            </div>
            <button style={{ background: "rgba(0,0,0,0.52)", border: "none", cursor: "pointer", padding: "3px", borderRadius: "3px" }}>
              <Maximize2 size={13} style={{ color: "rgba(140,205,248,1)" }} />
            </button>
          </div>
          <div style={{ position: "absolute", bottom: "8px", left: "10px", right: "10px", display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: "9px", color: "rgba(90,165,225,0.72)", fontFamily: "monospace" }}>GPS: 30.2741°N 120.1551°E | ALT: 120m | SPD: 5.2m/s</div>
            <div style={{ fontSize: "9px", color: "rgba(90,165,225,0.72)", fontFamily: "monospace" }}>延迟: 128ms</div>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
          <div className="enf-card" style={{ padding: "12px 14px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(140, 188, 228, 1)", marginBottom: "10px" }}>算法检测结果（成熟算法）</div>
            {allAlgosFromSystem.map((algo) => {
              const sw = algos.find((a) => a.id === algo.id);
              const enabled = sw?.enabled ?? false;
              const Icon = typeIcon[algo.type];
              const color = typeColor[algo.type];
              return (
                <div key={algo.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 0", borderBottom: "1px solid rgba(0, 88, 142, 0.22)" }}>
                  <Icon size={13} style={{ color: enabled ? color : "rgba(55, 92, 148, 1)", flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: "12px", color: enabled ? "rgba(175, 218, 248, 1)" : "rgba(55, 92, 148, 1)" }}>{algo.name}</span>
                  <span style={{ fontSize: "10px", color: enabled ? color : "rgba(55, 92, 148, 1)", marginRight: "5px" }}>{enabled ? "开启" : "关闭"}</span>
                  <div onClick={() => toggleAlgo(algo.id)} style={{ width: "32px", height: "18px", borderRadius: "9px", background: enabled ? "rgba(0, 145, 185, 0.85)" : "rgba(20, 45, 90, 1)", position: "relative", cursor: "pointer" }}>
                    <div style={{ position: "absolute", top: "2px", left: enabled ? "16px" : "2px", width: "14px", height: "14px", borderRadius: "50%", background: enabled ? "rgba(0, 225, 248, 1)" : "rgba(75, 120, 185, 1)", transition: "left 0.2s" }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="enf-card" style={{ padding: "12px 14px" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "rgba(90, 155, 215, 1)", marginBottom: "7px" }}>本次抓拍统计</div>
            {[
              { label: "已抓拍",  value: captureCount, color: "rgba(0, 210, 240, 1)" },
              { label: "违规确认", value: 3,           color: "rgba(255, 80, 80, 1)" },
              { label: "待复核",  value: 4,            color: "rgba(255, 185, 0, 1)" },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "11px" }}>
                <span style={{ color: "rgba(65, 128, 190, 1)" }}>{s.label}</span>
                <span style={{ fontWeight: 700, color: s.color }}>{s.value} 张</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="enf-card" style={{ padding: "12px 16px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => { setCapturing(!capturing); if (!capturing) setCaptureCount((n) => n + 1); }}
          style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 18px", background: capturing ? "rgba(78, 8, 8, 0.65)" : "rgba(0, 110, 170, 0.65)", color: capturing ? "rgba(255, 80, 80, 1)" : "rgba(0, 210, 240, 1)", border: `1px solid ${capturing ? "rgba(255,60,60,0.42)" : "rgba(0,185,225,0.52)"}`, borderRadius: "4px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
        >
          <Camera size={13} />{capturing ? "抓拍中..." : "开始抓拍"}
        </button>
        <button style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 18px", background: "rgba(78, 8, 8, 0.32)", color: "rgba(255, 100, 100, 1)", border: "1px solid rgba(255, 60, 60, 0.32)", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>
          <Square size={13} /> 停止抓拍
        </button>
        <button style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 18px", background: "rgba(6, 22, 62, 1)", color: "rgba(110, 172, 228, 1)", border: "1px solid rgba(0, 110, 170, 0.36)", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>
          <Save size={13} /> 保存记录
        </button>
      </div>
    </div>
  );
};

export default SemiAutoCapture;
