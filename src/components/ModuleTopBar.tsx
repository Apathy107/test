import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, RefreshCw, LogOut, UserCircle } from "lucide-react";
import { NotificationBellDropdown } from "@/components/NotificationBellDropdown";
import { useCurrentUserOptional } from "@/contexts/UserContext";

/** 保留导出供 MessageManager 等引用（实际由 NotificationContext 发出） */
export { NOTIFICATION_READ_EVENT } from "@/contexts/NotificationContext";

interface ModuleTopBarProps {
  /** 主标题，如「设备运维总览」 */
  title?: string;
  /** 副标题/说明行，如「数据更新时间: 2025-07-11 09:42:36 | 统计范围:全市所有在册设备」 */
  subtitle?: string;
  /** 显示在用户图标后的用户名，不传则显示「当前用户」 */
  userName?: string;
}

const barStyle: React.CSSProperties = {
  height: 56,
  background: "rgba(8, 18, 38, 0.95)",
  borderBottom: "1px solid rgba(0, 150, 200, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 24px",
  flexShrink: 0,
};

const iconBtnStyle: React.CSSProperties = {
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
  fontFamily: "inherit",
};

/**
 * 各子模块统一顶部栏：左侧主标题+副标题，右侧【刷新】【消息】【用户】图标；用户带用户名与下拉（个人中心、退出登录）
 */
const ModuleTopBar: React.FC<ModuleTopBarProps> = ({
  title = "",
  subtitle = "",
  userName = "当前用户",
}) => {
  const navigate = useNavigate();
  const userContext = useCurrentUserOptional();
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userContext && userName && userName !== "当前用户") {
      userContext.setCurrentUser({ ...userContext.currentUser, name: userName });
    }
  }, [userName]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div data-cmp="ModuleTopBar" style={barStyle}>
      <div>
        {title && (
          <h1 style={{ fontSize: 16, fontWeight: 600, color: "rgba(200, 220, 240, 1)", margin: 0 }}>
            {title}
          </h1>
        )}
        {subtitle && (
          <div style={{ fontSize: 12, color: "rgba(80, 120, 160, 1)", marginTop: 2 }}>
            {subtitle}
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
        <button
          type="button"
          style={iconBtnStyle}
          onClick={() => window.location.reload()}
          title="刷新"
        >
          <RefreshCw size={16} />
        </button>
        <NotificationBellDropdown />
        <div ref={userRef} style={{ position: "relative" }}>
          <button
            type="button"
            style={{
              ...iconBtnStyle,
              width: "auto",
              paddingLeft: 8,
              paddingRight: 10,
              gap: 6,
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => setUserOpen((v) => !v)}
            title="用户"
          >
            <User size={16} />
            <span style={{ fontSize: 13, maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {userName}
            </span>
          </button>
          {userOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 4,
                minWidth: 120,
                background: "rgba(8, 18, 38, 0.98)",
                border: "1px solid rgba(0, 150, 200, 0.3)",
                borderRadius: 4,
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                zIndex: 100,
                padding: 4,
              }}
            >
              <button
                type="button"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  color: "rgba(0, 212, 255, 0.9)",
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  borderRadius: 4,
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0, 150, 200, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
                onClick={() => {
                  setUserOpen(false);
                  // 可改为跳转个人中心路由
                }}
              >
                <UserCircle size={14} />
                个人中心
              </button>
              <button
                type="button"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  color: "rgba(255, 150, 150, 0.9)",
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  borderRadius: 4,
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 80, 80, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
                onClick={() => {
                  setUserOpen(false);
                  navigate("/");
                }}
              >
                <LogOut size={14} />
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleTopBar;
