import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Settings, User, LogOut } from "lucide-react";

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  title = "任务执行看板",
  subtitle = "",
  showBack = false,
}) => {
  const navigate = useNavigate();
  const now = new Date();
  const timeStr = now.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      data-cmp="TopBar"
      style={{
        height: "52px",
        background: "rgba(4, 12, 30, 0.95)",
        borderBottom: "1px solid rgba(0, 150, 200, 0.25)",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: "16px",
        flexShrink: 0,
      }}
    >
      {/* Left: back + title */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "rgba(0, 212, 255, 0.8)",
              fontSize: "13px",
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 0,
            }}
          >
            <ChevronLeft size={16} />
            返回
          </button>
        )}
        <div>
          <span
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "rgba(200, 230, 255, 1)",
            }}
          >
            {title}
          </span>
          {subtitle && (
            <span
              style={{
                marginLeft: "12px",
                fontSize: "12px",
                color: "rgba(100, 150, 200, 1)",
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Middle: breadcrumb path */}
      <div
        style={{
          fontSize: "12px",
          color: "rgba(80, 130, 180, 1)",
          letterSpacing: "1px",
        }}
      >
        无人机管控平台 / 任务调度中心 / {title}
      </div>

      {/* Right: time + actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <span style={{ fontSize: "12px", color: "rgba(100, 150, 200, 1)" }}>
          {timeStr}
        </span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(100, 150, 200, 1)",
              padding: "4px",
            }}
          >
            <Settings size={15} />
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(100, 150, 200, 1)",
              padding: "4px",
            }}
          >
            <User size={15} />
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(100, 150, 200, 0.7)",
              padding: "4px",
            }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
