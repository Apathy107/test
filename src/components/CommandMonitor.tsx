import React, { useState } from "react";
import { Maximize2, Pause, RotateCcw, ArrowDown, Users2, Swords, Radio, MapPin, Battery } from "lucide-react";

interface VideoFeed {
  id: string;
  uavName: string;
  taskName: string;
  battery: number;
  altitude: number;
  status: "active" | "standby";
  startTime: string;
}

const videoFeeds: VideoFeed[] = [
  { id: "UAV-001", uavName: "大疆M30T-01", taskName: "城区巡检-北区", battery: 78, altitude: 120, status: "active", startTime: "13:45" },
  { id: "UAV-002", uavName: "大疆M30T-02", taskName: "目标跟踪-A区", battery: 65, altitude: 85, status: "active", startTime: "14:02" },
  { id: "UAV-003", uavName: "御3T-01", taskName: "安保任务-广场", battery: 90, altitude: 60, status: "standby", startTime: "14:15" },
  { id: "PL-001", uavName: "三光吊舱-01", taskName: "侦察任务-南区", battery: 55, altitude: 100, status: "active", startTime: "13:58" },
];

const controlButtons: { label: string; icon: React.ElementType; color: string; bg: string }[] = [
  { label: "暂停任务", icon: Pause, color: "rgb(255, 200, 0)", bg: "rgba(255, 200, 0, 0.12)" },
  { label: "强制返航", icon: RotateCcw, color: "rgb(0, 180, 255)", bg: "rgba(0, 180, 255, 0.12)" },
  { label: "紧急降落", icon: ArrowDown, color: "rgb(255, 80, 80)", bg: "rgba(255, 80, 80, 0.12)" },
  { label: "移交控制", icon: Users2, color: "rgb(160, 100, 255)", bg: "rgba(160, 100, 255, 0.12)" },
  { label: "强制接管", icon: Swords, color: "rgb(255, 120, 0)", bg: "rgba(255, 120, 0, 0.12)" },
];

/**
 * VideoPanel - Single video feed tile
 */
const VideoPanel: React.FC<{
  feed: VideoFeed;
  isMain?: boolean;
  onExpand?: () => void;
}> = ({ feed, isMain = false, onExpand }) => {
  const scanLinePos = React.useRef(0);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(160deg, rgba(0, 18, 45, 0.98) 0%, rgba(0, 8, 28, 0.98) 100%)",
        border: `1px solid ${feed.status === "active" ? "rgba(0, 150, 200, 0.35)" : "rgba(60, 70, 90, 0.4)"}`,
        borderRadius: "3px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Fake video content - noise grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0, 180, 255, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 180, 255, 0.025) 1px, transparent 1px)", backgroundSize: isMain ? "30px 30px" : "15px 15px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 40% 45%, rgba(0, 60, 120, 0.15) 0%, transparent 70%)" }} />

      {/* Simulated UAV silhouette */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: 0.08 }}>
        <svg width={isMain ? "120" : "60"} height={isMain ? "80" : "40"} viewBox="0 0 48 32" fill="none">
          <line x1="24" y1="16" x2="8" y2="8" stroke="rgba(0, 212, 255, 1)" strokeWidth="1.5" />
          <line x1="24" y1="16" x2="40" y2="8" stroke="rgba(0, 212, 255, 1)" strokeWidth="1.5" />
          <line x1="24" y1="16" x2="8" y2="24" stroke="rgba(0, 212, 255, 1)" strokeWidth="1.5" />
          <line x1="24" y1="16" x2="40" y2="24" stroke="rgba(0, 212, 255, 1)" strokeWidth="1.5" />
          <ellipse cx="8" cy="8" rx="6" ry="2.5" fill="rgba(0, 212, 255, 0.5)" />
          <ellipse cx="40" cy="8" rx="6" ry="2.5" fill="rgba(0, 212, 255, 0.5)" />
          <ellipse cx="8" cy="24" rx="6" ry="2.5" fill="rgba(0, 212, 255, 0.5)" />
          <ellipse cx="40" cy="24" rx="6" ry="2.5" fill="rgba(0, 212, 255, 0.5)" />
          <rect x="20" y="12" width="8" height="8" rx="1.5" fill="rgba(0, 212, 255, 0.7)" />
        </svg>
      </div>

      {/* Scan line animation */}
      {feed.status === "active" && (
        <div
          className="animate-scan"
          style={{ position: "absolute", left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent 0%, rgba(0, 212, 255, 0.4) 40%, rgba(0, 212, 255, 0.8) 50%, rgba(0, 212, 255, 0.4) 60%, transparent 100%)`, zIndex: 5, pointerEvents: "none" }}
        />
      )}

      {/* Top bar: UAV name + expand */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMain ? "8px 10px" : "4px 6px", zIndex: 6, background: "linear-gradient(180deg, rgba(0, 8, 28, 0.85) 0%, transparent 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          {feed.status === "active" && (
            <div className="animate-glow-pulse" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgb(255, 60, 60)", boxShadow: "0 0 4px rgb(255, 60, 60)" }} />
          )}
          <span style={{ fontSize: isMain ? "12px" : "10px", color: "rgb(200, 235, 255)", fontFamily: "'Microsoft YaHei', sans-serif", fontWeight: "600" }}>{feed.uavName}</span>
          {feed.status === "active" && <span style={{ fontSize: "9px", color: "rgb(255, 60, 60)", fontFamily: "monospace" }}>● LIVE</span>}
        </div>
        {onExpand && (
          <button onClick={onExpand} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(0, 200, 220, 0.5)", padding: "0" }}>
            <Maximize2 size={isMain ? 13 : 10} />
          </button>
        )}
      </div>

      {/* Center: RECORDING indicator */}
      {feed.status === "active" && isMain && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", zIndex: 4 }}>
          <div style={{ fontSize: "10px", color: "rgba(0, 180, 220, 0.3)", fontFamily: "monospace", letterSpacing: "0.3em" }}>VIDEO FEED</div>
          <div className="animate-glow-pulse" style={{ fontSize: "11px", color: "rgba(0, 180, 220, 0.2)", fontFamily: "monospace", letterSpacing: "0.2em" }}>STREAMING</div>
        </div>
      )}

      {/* Bottom bar: telemetry data */}
      <div style={{ marginTop: "auto", padding: isMain ? "6px 10px" : "3px 6px", background: "linear-gradient(0deg, rgba(0, 8, 28, 0.9) 0%, transparent 100%)", zIndex: 6 }}>
        <div style={{ display: "flex", gap: isMain ? "12px" : "6px", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <Battery size={isMain ? 11 : 9} style={{ color: feed.battery > 60 ? "rgb(0, 220, 150)" : "rgb(255, 180, 0)" }} />
            <span style={{ fontSize: isMain ? "10px" : "9px", color: feed.battery > 60 ? "rgb(0, 220, 150)" : "rgb(255, 180, 0)", fontFamily: "monospace" }}>{feed.battery}%</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <MapPin size={isMain ? 11 : 9} style={{ color: "rgba(0, 200, 220, 0.6)" }} />
            <span style={{ fontSize: isMain ? "10px" : "9px", color: "rgba(0, 200, 220, 0.6)", fontFamily: "monospace" }}>{feed.altitude}m</span>
          </div>
          <span style={{ fontSize: isMain ? "10px" : "9px", color: "rgba(0, 180, 220, 0.5)", fontFamily: "monospace", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{feed.taskName}</span>
          <span style={{ fontSize: "9px", color: "rgba(0, 180, 220, 0.4)", fontFamily: "monospace", flexShrink: 0 }}>↑{feed.startTime}</span>
        </div>
      </div>

      {/* Corner accents */}
      {[{ top: 0, left: 0 }, { top: 0, right: 0 }, { bottom: 0, left: 0 }, { bottom: 0, right: 0 }].map((pos, i) => (
        <div key={i} style={{ position: "absolute", ...pos, pointerEvents: "none", zIndex: 7 }}>
          <div style={{ position: "absolute", ...("top" in pos ? { top: 0 } : { bottom: 0 }), ...("left" in pos ? { left: 0 } : { right: 0 }), width: "10px", height: "1px", background: "rgba(0, 212, 255, 0.45)" }} />
          <div style={{ position: "absolute", ...("top" in pos ? { top: 0 } : { bottom: 0 }), ...("left" in pos ? { left: 0 } : { right: 0 }), width: "1px", height: "10px", background: "rgba(0, 212, 255, 0.45)" }} />
        </div>
      ))}
    </div>
  );
};

/**
 * CommandMonitor - Video monitoring and dispatch control panel
 */
const CommandMonitor: React.FC = () => {
  const [mainFeedId, setMainFeedId] = useState("UAV-001");
  const [gridLayout, setGridLayout] = useState<"2x2" | "3x3">("2x2");

  console.log("CommandMonitor rendered, mainFeed:", mainFeedId);

  const mainFeed = videoFeeds.find(f => f.id === mainFeedId) || videoFeeds[0];
  const sideFeedCount = gridLayout === "2x2" ? 4 : 9;

  return (
    <div data-cmp="CommandMonitor" style={{ height: "100%", display: "flex", gap: "10px" }}>
      {/* LEFT: Main video + controls */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
        {/* Main video */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <VideoPanel feed={mainFeed} isMain onExpand={() => console.log("Expand main feed")} />
        </div>

        {/* Control panel */}
        <div style={{ flexShrink: 0, background: "rgba(0, 10, 30, 0.8)", border: "1px solid rgba(0, 150, 200, 0.2)", borderRadius: "3px", padding: "8px 10px" }}>
          <div style={{ fontSize: "10px", color: "rgba(0, 180, 220, 0.45)", fontFamily: "monospace", marginBottom: "7px", letterSpacing: "0.15em" }}>飞行控制面板 — {mainFeed.uavName}</div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {controlButtons.map(btn => {
              const BtnIcon = btn.icon;
              return (
                <button
                  key={btn.label}
                  onClick={() => console.log("Control action:", btn.label, "for", mainFeedId)}
                  style={{
                    display: "flex", alignItems: "center", gap: "5px",
                    padding: "5px 10px",
                    border: `1px solid ${btn.color.replace("rgb(", "rgba(").replace(")", ", 0.4)")}`,
                    borderRadius: "3px",
                    background: btn.bg,
                    color: btn.color,
                    fontSize: "11px", fontFamily: "'Microsoft YaHei', sans-serif",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = btn.color.replace("rgb(", "rgba(").replace(")", ", 0.22)"); e.currentTarget.style.boxShadow = `0 0 10px ${btn.color.replace("rgb(", "rgba(").replace(")", ", 0.3)")}`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = btn.bg; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <BtnIcon size={11} />
                  <span>{btn.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: Grid feeds + task list */}
      <div style={{ width: "200px", display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
        {/* Layout toggle */}
        <div style={{ display: "flex", gap: "4px" }}>
          {(["2x2", "3x3"] as const).map(layout => (
            <button
              key={layout}
              onClick={() => setGridLayout(layout)}
              style={{
                flex: 1, padding: "3px 0", fontSize: "10px", fontFamily: "monospace",
                border: `1px solid ${gridLayout === layout ? "rgba(0, 200, 255, 0.5)" : "rgba(0, 150, 200, 0.2)"}`,
                borderRadius: "2px",
                background: gridLayout === layout ? "rgba(0, 150, 220, 0.15)" : "rgba(0, 15, 45, 0.6)",
                color: gridLayout === layout ? "rgb(0, 200, 255)" : "rgba(0, 180, 220, 0.4)",
                cursor: "pointer",
              }}
            >
              {layout}
            </button>
          ))}
        </div>

        {/* Grid feeds */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: `repeat(${gridLayout === "2x2" ? 2 : 3}, 1fr)`,
            gap: "4px",
            overflow: "hidden",
          }}
        >
          {Array.from({ length: sideFeedCount }, (_, i) => {
            const feed = videoFeeds[i % videoFeeds.length];
            const isMain = feed.id === mainFeedId && i < videoFeeds.length;
            return (
              <div
                key={i}
                onClick={() => { if (i < videoFeeds.length) setMainFeedId(feed.id); }}
                style={{
                  cursor: "pointer",
                  outline: isMain ? "1px solid rgba(0, 212, 255, 0.7)" : "none",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <VideoPanel feed={feed} isMain={false} />
              </div>
            );
          })}
        </div>

        {/* Active task list */}
        <div style={{ flexShrink: 0, background: "rgba(0, 8, 25, 0.85)", border: "1px solid rgba(0, 150, 200, 0.2)", borderRadius: "3px", padding: "8px" }}>
          <div style={{ fontSize: "10px", color: "rgba(0, 180, 220, 0.45)", fontFamily: "monospace", marginBottom: "7px", letterSpacing: "0.12em" }}>执行中任务</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {videoFeeds.filter(f => f.status === "active").map(feed => (
              <div
                key={feed.id}
                onClick={() => setMainFeedId(feed.id)}
                style={{
                  padding: "5px 7px",
                  background: mainFeedId === feed.id ? "rgba(0, 130, 200, 0.15)" : "rgba(0, 15, 45, 0.6)",
                  border: `1px solid ${mainFeedId === feed.id ? "rgba(0, 200, 255, 0.4)" : "rgba(0, 120, 170, 0.2)"}`,
                  borderRadius: "2px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: "10px", color: "rgb(180, 230, 255)", fontFamily: "'Microsoft YaHei', sans-serif", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{feed.taskName}</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "9px", color: "rgba(0, 180, 220, 0.5)", fontFamily: "monospace" }}>{feed.id}</span>
                  <span style={{ fontSize: "9px", color: "rgba(0, 180, 220, 0.4)", fontFamily: "monospace" }}>{feed.startTime}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Assign button */}
          <button
            onClick={() => console.log("Assign task clicked")}
            style={{ width: "100%", marginTop: "7px", padding: "5px", border: "1px solid rgba(0, 180, 220, 0.3)", borderRadius: "2px", background: "rgba(0, 40, 80, 0.4)", color: "rgba(0, 200, 230, 0.7)", fontSize: "11px", fontFamily: "'Microsoft YaHei', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0, 60, 120, 0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0, 40, 80, 0.4)"; }}
          >
            <Radio size={11} />
            <span>指派任务</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommandMonitor;