import React, { useState, useMemo } from "react";
import { Maximize2, Camera, Circle, Search, MapPin, Video } from "lucide-react";
import { useCommandCenter } from "./CommandCenterContext";

interface VideoFeed {
  id: string;
  name: string;
  status: "live" | "offline" | "recording";
}

const feeds: VideoFeed[] = [
  { id: "V1", name: "DRN-001 主视角", status: "live" },
  { id: "V2", name: "DRN-002 俯视", status: "recording" },
  { id: "V3", name: "DRN-005 侧视", status: "live" },
  { id: "V4", name: "基地监控 C1", status: "live" },
  { id: "V5", name: "DRN-006 全景", status: "recording" },
  { id: "V6", name: "DRN-003 夜视", status: "live" },
  { id: "V7", name: "东区监控 A2", status: "offline" },
  { id: "V8", name: "DRN-004 红外", status: "recording" },
];

type VideoWallMode = "full" | "mainOnly" | "thumbsOnly";

interface VideoWallProps {
  mode?: VideoWallMode;
}

const VideoWall: React.FC<VideoWallProps> = ({ mode = "full" }) => {
  const [keyword, setKeyword] = useState("");
  const { setLayoutMode, selectedVideoId: selectedMain, setSelectedVideoId: setSelectedMain } = useCommandCenter();

  const filteredFeeds = useMemo(() => {
    if (!keyword.trim()) return feeds;
    const k = keyword.trim().toLowerCase();
    return feeds.filter((f) => f.name.toLowerCase().includes(k));
  }, [keyword]);

  const mainFeed = feeds.find((f) => f.id === selectedMain) || feeds[0];
  const thumbFeeds = mode === "full" ? feeds.filter((f) => f.id !== selectedMain) : filteredFeeds;

  const showMain = mode === "full" || mode === "mainOnly";
  const showThumbs = mode === "full" || mode === "thumbsOnly";

  return (
    <div
      data-cmp="VideoWall"
      className="fui-panel"
      style={{ borderRadius: "4px", padding: "8px", flexShrink: 0, flex: mode === "thumbsOnly" ? 1 : undefined, minHeight: 0, display: "flex", flexDirection: "column" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div
            style={{
              width: "18px",
              height: "18px",
              background: "rgba(0, 40, 80, 0.6)",
              border: "1px solid rgba(0, 180, 220, 0.35)",
              borderRadius: "3px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Camera size={11} style={{ color: "rgba(0, 210, 255, 1)" }} />
          </div>
          <span className="fui-title">视频监控</span>
        </div>
        {showMain && (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Circle size={7} className="blink-alert" style={{ color: "rgba(255, 65, 80, 1)", fill: "rgba(255, 65, 80, 1)" }} />
            <span style={{ fontSize: "10px", color: "rgba(255, 65, 80, 1)", fontWeight: 700, letterSpacing: "0.1em" }}>REC</span>
          </div>
        )}
      </div>

      {showMain && (
      <div
        style={{
          position: "relative",
          aspectRatio: mode === "mainOnly" ? "16/9" : "16/9",
          background: "rgba(1, 5, 16, 0.95)",
          border: "1px solid rgba(0, 170, 220, 0.4)",
          borderRadius: "3px",
          overflow: "hidden",
          marginBottom: "5px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(160deg, rgba(0,15,35,1) 0%, rgba(0,30,60,0.85) 40%, rgba(0,10,25,1) 100%)",
          }}
        />

        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.35 }}>
          <line x1="0" y1="58%" x2="100%" y2="54%" stroke="rgba(0,160,220,0.5)" strokeWidth="1" />
          <line x1="0" y1="64%" x2="100%" y2="60%" stroke="rgba(0,130,190,0.3)" strokeWidth="0.5" />
          <rect x="22%" y="28%" width="18%" height="25%" fill="rgba(0,50,90,0.45)" rx="2" />
          <rect x="50%" y="35%" width="10%" height="18%" fill="rgba(0,40,75,0.5)" rx="1" />
          <rect x="65%" y="42%" width="14%" height="14%" fill="rgba(0,35,65,0.4)" rx="1" />
          <line x1="0" y1="72%" x2="100%" y2="72%" stroke="rgba(0,80,130,0.2)" strokeWidth="0.5" />
        </svg>

        <div style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "36px", height: "36px" }}>
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "rgba(0,255,180,0.75)" }} />
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", background: "rgba(0,255,180,0.75)" }} />
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "8px", height: "8px",
              borderRadius: "50%",
              border: "1px solid rgba(0,255,180,0.9)",
              boxShadow: "0 0 5px rgba(0,255,180,0.5)",
            }} />
          </div>

          {[
            { top: "8px", left: "8px", bt: "top", bl: "left" },
            { top: "8px", right: "8px", bt: "top", bl: "right" },
            { bottom: "8px", left: "8px", bt: "bottom", bl: "left" },
            { bottom: "8px", right: "8px", bt: "bottom", bl: "right" },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                ...pos,
                width: "14px",
                height: "14px",
                borderTop: (pos.bt === "top") ? "1.5px solid rgba(0,200,255,0.75)" : "none",
                borderBottom: (pos.bt === "bottom") ? "1.5px solid rgba(0,200,255,0.75)" : "none",
                borderLeft: (pos.bl === "left") ? "1.5px solid rgba(0,200,255,0.75)" : "none",
                borderRight: (pos.bl === "right") ? "1.5px solid rgba(0,200,255,0.75)" : "none",
              } as React.CSSProperties}
            />
          ))}

          <div style={{ position: "absolute", top: "8px", left: "8px", display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div className="blink-alert" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(255,65,80,1)", boxShadow: "0 0 5px rgba(255,65,80,0.8)" }} />
              <span style={{ fontSize: "9px", color: "rgba(0,210,255,1)", background: "rgba(2,8,22,0.8)", padding: "1px 5px", borderRadius: "2px", fontFamily: "monospace" }}>
                {mainFeed.name}
              </span>
            </div>
          </div>

          <div style={{
            position: "absolute",
            bottom: "6px",
            left: "8px",
            right: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}>
            <div style={{ fontFamily: "monospace", fontSize: "8px", color: "rgba(0,200,255,0.85)", lineHeight: 1.5 }}>
              <div>ALT: 120.5m | SPD: 8.2m/s | HDG: 245°</div>
              <div>LAT: 39.912° | LON: 116.391° | BAT: 78%</div>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "8px", color: "rgba(0,200,255,0.6)", textAlign: "right" }}>
              <div>2024-06-15</div>
              <div>12:35:22</div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setLayoutMode(mode === "mainOnly" ? "mapMain" : "videoMain")}
          title={mode === "mainOnly" ? "切换到主视角" : "切换到核心区"}
          style={{
            position: "absolute",
            top: "6px",
            right: "6px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "3px 6px",
            fontSize: "10px",
            background: "rgba(3, 12, 30, 0.85)",
            border: "1px solid rgba(0, 170, 220, 0.4)",
            borderRadius: "3px",
            color: "rgba(0, 210, 255, 1)",
            cursor: "pointer",
          }}
        >
          {mode === "mainOnly" ? <Video size={12} /> : <MapPin size={12} />}
          {mode === "mainOnly" ? "返回" : "核心区"}
        </button>
      </div>
      )}

      {showThumbs && (
      <>
      {mode === "thumbsOnly" && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", flexShrink: 0 }}>
          <Search size={12} style={{ color: "rgba(0, 180, 220, 0.8)" }} />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="关键字搜索..."
            style={{
              flex: 1,
              padding: "4px 8px",
              fontSize: "11px",
              background: "rgba(0, 25, 55, 0.8)",
              border: "1px solid rgba(0, 140, 200, 0.35)",
              borderRadius: "3px",
              color: "rgba(0, 210, 255, 1)",
            }}
          />
          <button
            type="button"
            style={{
              padding: "4px 8px",
              fontSize: "10px",
              background: "rgba(0, 100, 160, 0.4)",
              border: "1px solid rgba(0, 170, 220, 0.4)",
              borderRadius: "3px",
              color: "rgba(0, 210, 255, 1)",
              cursor: "pointer",
            }}
          >
            检索
          </button>
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: "4px",
          flexDirection: mode === "thumbsOnly" ? "column" : "row",
          flex: mode === "thumbsOnly" ? 1 : undefined,
          minHeight: 0,
          overflowY: mode === "thumbsOnly" ? "auto" : undefined,
          overflowX: mode === "full" ? "auto" : mode === "thumbsOnly" ? "hidden" : undefined,
          flexWrap: mode === "full" ? "nowrap" : undefined,
        }}
      >
        {thumbFeeds.map((feed) => (
          <button
            key={feed.id}
            type="button"
            onClick={() => {
              setSelectedMain(feed.id);
              if (mode === "thumbsOnly") setLayoutMode("videoMain");
            }}
            style={{
              flex: mode === "thumbsOnly" ? "0 0 auto" : mode === "full" ? "0 0 72px" : 1,
              minWidth: mode === "thumbsOnly" ? undefined : mode === "full" ? 72 : 0,
              position: "relative",
              aspectRatio: "16/9",
              width: mode === "thumbsOnly" ? "100%" : undefined,
              maxWidth: mode === "thumbsOnly" ? "100%" : undefined,
              background: "rgba(1, 5, 16, 0.95)",
              border: `1px solid ${selectedMain === feed.id ? "rgba(0,210,255,0.8)" : "rgba(0,100,140,0.3)"}`,
              borderRadius: "2px",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,12,28,1), rgba(0,25,55,0.7))" }} />
            <div style={{
              position: "absolute",
              top: "3px",
              right: "3px",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: feed.status === "live" ? "rgba(0,255,140,1)" : feed.status === "recording" ? "rgba(255,65,80,1)" : "rgba(80,80,80,1)",
              boxShadow: feed.status === "live" ? "0 0 4px rgba(0,255,140,0.8)" : "none",
            }} />
            <div style={{
              position: "absolute",
              bottom: "2px",
              left: "2px",
              right: "2px",
              fontSize: "7px",
              color: "rgba(0, 170, 220, 0.85)",
              background: "rgba(2,8,20,0.85)",
              padding: "1px 3px",
              borderRadius: "1px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              fontFamily: "monospace",
            }}>
              {feed.name}
            </div>
          </button>
        ))}
      </div>
      </>
      )}
    </div>
  );
};

export default VideoWall;
