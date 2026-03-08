import React, { useState, useEffect } from "react";
import { RefreshCw, User, ChevronDown } from "lucide-react";
import { NotificationBellDropdown } from "@/components/NotificationBellDropdown";

const TopNav: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = currentTime.toLocaleTimeString("zh-CN", { hour12: false });
  const dateStr = currentTime.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });

  return (
    <header
      data-cmp="TopNav"
      style={{
        background: "rgba(2, 8, 22, 0.97)",
        borderBottom: "1px solid rgba(0, 180, 220, 0.3)",
        position: "relative",
        height: "52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        flexShrink: 0,
      }}
    >
      {/* Animated top border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, transparent 0%, rgba(0,150,220,0.4) 15%, rgba(0,210,255,1) 40%, rgba(0,255,200,0.8) 60%, rgba(0,180,255,0.5) 80%, transparent 100%)",
          boxShadow: "0 0 12px rgba(0,210,255,0.6)",
        }}
      />

      {/* Bottom subtle line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "10%",
          right: "10%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(0,180,220,0.3), transparent)",
        }}
      />

      {/* Left section - 仅保留时间 */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", width: "400px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "20px",
              fontWeight: 700,
              color: "rgba(0, 220, 255, 1)",
              letterSpacing: "0.12em",
              lineHeight: 1,
              textShadow: "0 0 12px rgba(0,210,255,0.9), 0 0 30px rgba(0,210,255,0.4)",
            }}
          >
            {timeStr}
          </span>
          <span
            style={{
              fontSize: "10px",
              color: "rgba(60, 150, 200, 0.9)",
              letterSpacing: "0.05em",
              marginTop: "1px",
            }}
          >
            {dateStr}
          </span>
        </div>
      </div>

      {/* Center title */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ width: "40px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,210,255,0.6))" }} />
            <div style={{ display: "flex", gap: "3px" }}>
              {[1, 1, 1].map((_, i) => (
                <div key={i} style={{ width: "3px", height: "3px", background: "rgba(0,210,255,0.7)", borderRadius: "50%" }} />
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              className="rotate-slow"
              style={{
                width: "22px",
                height: "22px",
                border: "1.5px solid rgba(0,210,255,0.8)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 10px rgba(0,210,255,0.4)",
              }}
            >
              <div style={{ width: "6px", height: "6px", background: "rgba(0,210,255,1)", borderRadius: "50%" }} />
            </div>

            <h1
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "20px",
                fontWeight: 700,
                color: "rgba(210, 245, 255, 1)",
                letterSpacing: "0.3em",
                textShadow: "0 0 16px rgba(0,210,255,0.7), 0 0 40px rgba(0,210,255,0.25)",
                whiteSpace: "nowrap",
              }}
            >
              综合指挥中心
            </h1>

            <div
              className="rotate-slow-reverse"
              style={{
                width: "22px",
                height: "22px",
                border: "1.5px solid rgba(0,255,180,0.7)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 10px rgba(0,255,180,0.3)",
              }}
            >
              <div style={{ width: "6px", height: "6px", background: "rgba(0,255,180,1)", borderRadius: "50%" }} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ display: "flex", gap: "3px" }}>
              {[1, 1, 1].map((_, i) => (
                <div key={i} style={{ width: "3px", height: "3px", background: "rgba(0,210,255,0.7)", borderRadius: "50%" }} />
              ))}
            </div>
            <div style={{ width: "40px", height: "1px", background: "linear-gradient(90deg, rgba(0,210,255,0.6), transparent)" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "2px" }}>
          {["UAV COMMAND", "REAL-TIME MONITOR", "INTELLIGENT DISPATCH"].map((tag, i) => (
            <span
              key={i}
              style={{
                fontSize: "9px",
                color: "rgba(0, 160, 200, 0.65)",
                letterSpacing: "0.12em",
                fontFamily: "monospace",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right section：统一为 刷新、通知、用户 */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, width: "400px", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={() => window.location.reload()}
          title="刷新"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            border: "1px solid rgba(0, 150, 200, 0.3)",
            borderRadius: 4,
            background: "transparent",
            color: "rgba(0, 212, 255, 0.85)",
            cursor: "pointer",
          }}
        >
          <RefreshCw size={16} />
        </button>
        <NotificationBellDropdown
          buttonStyle={{
            position: "relative",
            width: 32,
            height: 32,
            padding: 0,
            background: "transparent",
            border: "1px solid rgba(0, 150, 200, 0.3)",
            borderRadius: 4,
            color: "rgba(0, 212, 255, 0.85)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "4px 10px",
            background: "rgba(0, 50, 100, 0.35)",
            border: "1px solid rgba(0, 160, 220, 0.3)",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(0,120,200,0.8), rgba(0,60,120,0.9))",
              border: "1px solid rgba(0,210,255,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={13} style={{ color: "rgba(0, 210, 255, 1)" }} />
          </div>
          <span style={{ fontSize: "11px", color: "rgba(160, 215, 240, 1)" }}>当前用户</span>
          <ChevronDown size={11} style={{ color: "rgba(0, 160, 200, 0.7)" }} />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
