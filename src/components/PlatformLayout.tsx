import React, { useState } from "react";
import {
  Shield, Plane, Wrench, Users, CalendarClock, AppWindow,
  BrainCircuit, Server, LogOut, ChevronRight, LayoutDashboard, Radio, Home,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavItem {
  id: number;
  label: string;
  labelEn: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 1, label: "综合指挥中心", labelEn: "COMMAND CENTER", icon: Shield, path: "/command" },
  { id: 2, label: "飞行控制中心", labelEn: "FLIGHT CONTROL", icon: Plane, path: "/fly" },
  { id: 3, label: "设备运维管理", labelEn: "DEVICE OPS", icon: Wrench, path: "/device" },
  { id: 4, label: "人员资质管理", labelEn: "PERSONNEL MGMT", icon: Users, path: "/personnel" },
  { id: 5, label: "任务调度中心", labelEn: "MISSION", icon: CalendarClock, path: "/mission" },
  { id: 6, label: "业务应用中心", labelEn: "BUSINESS", icon: AppWindow, path: "/business" },
  { id: 7, label: "数据智能中心", labelEn: "DATA & AI", icon: BrainCircuit, path: "/data" },
  { id: 8, label: "系统支撑平台", labelEn: "SYSTEM", icon: Server, path: "/system" },
];

const moduleTitles: Record<string, { title: string; subtitle: string; icon: React.ElementType }> = {
  "综合指挥中心": { title: "综合指挥中心", subtitle: "COMMAND CENTER", icon: Shield },
  "飞行控制中心": { title: "飞行控制中心", subtitle: "FLIGHT CONTROL", icon: Plane },
  "设备运维管理": { title: "设备运维管理", subtitle: "DEVICE OPS", icon: Wrench },
  "人员资质管理": { title: "人员资质管理", subtitle: "PERSONNEL MGMT", icon: Users },
  "任务调度中心": { title: "任务调度中心", subtitle: "MISSION", icon: CalendarClock },
  "业务应用中心": { title: "业务应用中心", subtitle: "BUSINESS", icon: AppWindow },
  "数据智能中心": { title: "数据智能中心", subtitle: "DATA & AI", icon: BrainCircuit },
  "系统支撑平台": { title: "系统支撑平台", subtitle: "SYSTEM", icon: Server },
};

interface PlatformLayoutProps {
  children: React.ReactNode;
  activeModule?: string;
  /** 综合指挥中心等页面可设为 true，侧边栏默认折叠为仅图标 */
  defaultSidebarCollapsed?: boolean;
  /** 为 true 时隐藏顶部标头（平台名、当前模块、系统在线、退出等），用于综合指挥中心全屏布局 */
  hideHeader?: boolean;
}

/**
 * PlatformLayout - Shared layout with collapsible sidebar for all platform modules
 */
const PlatformLayout: React.FC<PlatformLayoutProps> = ({
  children,
  activeModule = "综合指挥中心",
  defaultSidebarCollapsed = false,
  hideHeader = false,
}) => {
  const [collapsed, setCollapsed] = useState(defaultSidebarCollapsed);
  const navigate = useNavigate();
  const location = useLocation();

  const SIDEBAR_W = collapsed ? 64 : 220;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1920px",
        minHeight: "100vh",
        height: hideHeader ? "100vh" : undefined,
        margin: "0 auto",
        background: "rgb(1, 5, 18)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        boxSizing: "border-box",
        overflow: hideHeader ? "hidden" : undefined,
      }}
    >
      {!hideHeader && (
        <>
          {/* TOP HEADER */}
          <header
            style={{
              height: "56px",
              background: "linear-gradient(180deg, rgba(0, 18, 55, 0.95) 0%, rgba(0, 10, 38, 0.95) 100%)",
              borderBottom: "1px solid rgba(0, 160, 210, 0.22)",
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
              zIndex: 30,
              flexShrink: 0,
              position: "relative",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <button
                onClick={() => navigate("/hub")}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "4px 12px", border: "1px solid rgba(0, 180, 220, 0.3)",
                  borderRadius: "3px", background: "rgba(0, 40, 80, 0.4)",
                  color: "rgba(0, 212, 255, 0.8)", fontSize: "12px",
                  cursor: "pointer", fontFamily: "'Microsoft YaHei', sans-serif",
                  letterSpacing: "0.08em", transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0, 80, 140, 0.5)"; e.currentTarget.style.borderColor = "rgba(0, 212, 255, 0.6)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0, 40, 80, 0.4)"; e.currentTarget.style.borderColor = "rgba(0, 180, 220, 0.3)"; }}
              >
                <Home size={12} />
                <span>导航主页</span>
              </button>
              <div style={{ width: "1px", height: "22px", background: "rgba(0, 180, 220, 0.25)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "28px", height: "28px", border: "1px solid rgba(0, 212, 255, 0.4)", borderRadius: "4px", background: "rgba(0, 60, 130, 0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LayoutDashboard size={14} style={{ color: "rgb(0, 212, 255)" }} />
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "rgb(200, 235, 255)", fontFamily: "'Microsoft YaHei', sans-serif", letterSpacing: "0.12em", textShadow: "0 0 10px rgba(0, 212, 255, 0.4)" }}>
                    无人机综合管控平台
                  </div>
                </div>
              </div>
            </div>
            <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "28px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.6))" }} />
              <span style={{ fontSize: "16px", fontWeight: "700", color: "rgb(210, 245, 255)", fontFamily: "'Microsoft YaHei', sans-serif", letterSpacing: "0.25em", textShadow: "0 0 12px rgba(0, 212, 255, 0.6)" }}>
                {activeModule}
              </span>
              <div style={{ width: "28px", height: "1px", background: "linear-gradient(90deg, rgba(0, 212, 255, 0.6), transparent)" }} />
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div className="animate-glow-pulse" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgb(0, 255, 140)", boxShadow: "0 0 5px rgb(0, 255, 140)" }} />
                <span style={{ fontSize: "11px", color: "rgba(0, 200, 220, 0.6)", fontFamily: "monospace", letterSpacing: "0.08em" }}>系统在线</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Radio size={11} style={{ color: "rgba(0, 180, 220, 0.5)" }} />
                <LiveClock />
              </div>
              <button
                onClick={() => navigate("/")}
                style={{ display: "flex", alignItems: "center", gap: "5px", padding: "4px 14px", border: "1px solid rgba(255, 80, 80, 0.35)", borderRadius: "3px", background: "rgba(80, 20, 20, 0.3)", color: "rgba(255, 120, 120, 0.8)", fontSize: "12px", cursor: "pointer", fontFamily: "'Microsoft YaHei', sans-serif", letterSpacing: "0.08em", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(120, 30, 30, 0.45)"; e.currentTarget.style.borderColor = "rgba(255, 80, 80, 0.6)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(80, 20, 20, 0.3)"; e.currentTarget.style.borderColor = "rgba(255, 80, 80, 0.35)"; }}
              >
                <LogOut size={11} />
                <span>退出</span>
              </button>
            </div>
            <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.4), transparent)" }} />
          </header>
        </>
      )}

      {/* BODY */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* SIDEBAR - 人员资质管理风格：模块标题 + 英文副标题，导航项带 labelEn，默认可折叠 */}
        <aside
          style={{
            width: `${SIDEBAR_W}px`,
            flexShrink: 0,
            background: "rgba(6, 14, 30, 1)",
            borderRight: "1px solid rgba(0, 150, 200, 0.3)",
            display: "flex",
            flexDirection: "column",
            transition: "width 0.3s ease",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* 模块标题区：点击图标/标题可展开或收起侧边栏 */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setCollapsed((c) => !c)}
            onKeyDown={(e) => e.key === "Enter" && setCollapsed((c) => !c)}
            title={collapsed ? "展开侧边栏" : "收起侧边栏"}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "16px 8px 12px",
              flexShrink: 0,
              borderBottom: "1px solid rgba(0, 150, 200, 0.2)",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%" }}>
              {(function () {
                const mod = moduleTitles[activeModule] ?? { title: activeModule, subtitle: "", icon: LayoutDashboard };
                const Icon = mod.icon;
                return (
                  <>
                    <Icon size={20} style={{ color: "rgba(0, 212, 255, 1)", flexShrink: 0 }} />
                    {!collapsed && (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden" }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(0, 212, 255, 1)", textShadow: "0 0 10px rgba(0, 212, 255, 0.4)" }}>
                          {mod.title}
                        </div>
                        <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: "rgba(0, 150, 200, 0.7)" }}>
                          {mod.subtitle}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
            <div style={{ width: "100%", height: "1px", marginTop: 10, background: "linear-gradient(90deg, transparent, rgba(0, 210, 255, 0.5), transparent)", opacity: 0.6 }} />
          </div>

          <nav style={{ padding: "8px 0", flex: 1, position: "relative", zIndex: 1, overflow: "hidden" }}>
            <button
              onClick={() => navigate("/hub")}
              title="导航主页"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: collapsed ? "10px 12px" : "10px 16px",
                marginBottom: 2,
                borderRadius: 5,
                justifyContent: collapsed ? "center" : "flex-start",
                background: location.pathname === "/hub" ? "rgba(0, 150, 200, 0.18)" : "transparent",
                borderLeft: location.pathname === "/hub" ? "2px solid rgba(0, 212, 255, 1)" : "2px solid transparent",
                border: "none",
                cursor: "pointer",
                color: location.pathname === "/hub" ? "rgba(0, 212, 255, 1)" : "rgba(140, 180, 210, 1)",
                fontSize: 13,
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== "/hub") {
                  e.currentTarget.style.background = "rgba(0, 150, 200, 0.12)";
                  e.currentTarget.style.borderLeft = "2px solid rgba(0, 212, 255, 0.5)";
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== "/hub") {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderLeft = "2px solid transparent";
                }
              }}
            >
              <Home size={18} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <>
                  <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                    <div style={{ fontSize: "12px", fontWeight: 500 }}>导航主页</div>
                    <div style={{ fontSize: "9px", letterSpacing: "0.08em", color: "rgba(80, 120, 160, 1)" }}>HOME</div>
                  </div>
                  {location.pathname === "/hub" && <ChevronRight size={12} style={{ color: "rgba(0, 212, 255, 0.6)" }} />}
                </>
              )}
            </button>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  title={collapsed ? `${item.label} (${item.labelEn})` : undefined}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: collapsed ? "10px 12px" : "10px 16px",
                    marginBottom: 2,
                    borderRadius: 5,
                    justifyContent: collapsed ? "center" : "flex-start",
                    background: isActive ? "rgba(0, 150, 200, 0.18)" : "transparent",
                    borderLeft: isActive ? "2px solid rgba(0, 212, 255, 1)" : "2px solid transparent",
                    border: "none",
                    cursor: "pointer",
                    color: isActive ? "rgba(0, 212, 255, 1)" : "rgba(140, 180, 210, 1)",
                    fontSize: 13,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(0, 150, 200, 0.12)";
                      e.currentTarget.style.borderLeft = "2px solid rgba(0, 212, 255, 0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderLeft = "2px solid transparent";
                    }
                  }}
                >
                  <IconComp size={18} style={{ flexShrink: 0 }} />
                  {!collapsed && (
                    <>
                      <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                        <div style={{ fontSize: "12px", fontWeight: 500 }}>{item.label}</div>
                        <div style={{ fontSize: "9px", letterSpacing: "0.08em", color: isActive ? "rgba(0, 212, 255, 0.6)" : "rgba(80, 120, 160, 1)" }}>
                          {item.labelEn}
                        </div>
                      </div>
                      {item.badge != null && item.badge > 0 && (
                        <span style={{ minWidth: 18, height: 18, borderRadius: "50%", background: "rgba(255, 65, 80, 1)", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight size={12} style={{ color: "rgba(0, 212, 255, 0.6)" }} />}
                    </>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom version */}
          <div style={{ padding: "12px", borderTop: "1px solid rgba(0, 150, 200, 0.2)", textAlign: "center", position: "relative", zIndex: 1 }}>
            <span style={{ fontSize: "10px", color: "rgba(0, 150, 190, 0.35)", fontFamily: "monospace", letterSpacing: "0.1em" }}>
              {collapsed ? "v2.4" : "v2.4.1 · XIEN UAV"}
            </span>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main
          style={{
            flex: 1,
            minHeight: 0,
            overflow: hideHeader ? "hidden" : "auto",
            background: hideHeader ? "transparent" : "radial-gradient(ellipse at 30% 20%, rgba(0, 40, 100, 0.12) 0%, transparent 50%), rgb(1, 5, 18)",
            backgroundImage: hideHeader ? "none" : "linear-gradient(rgba(0, 180, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 180, 255, 0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            position: "relative",
          }}
        >
          {children}
        </main>
      </div>

      {/* Left accent line */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "2px", background: "linear-gradient(180deg, transparent 0%, rgba(0, 212, 255, 0.35) 25%, rgba(0, 212, 255, 0.55) 50%, rgba(0, 212, 255, 0.35) 75%, transparent 100%)", zIndex: 20, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "2px", background: "linear-gradient(180deg, transparent 0%, rgba(0, 212, 255, 0.35) 25%, rgba(0, 212, 255, 0.55) 50%, rgba(0, 212, 255, 0.35) 75%, transparent 100%)", zIndex: 20, pointerEvents: "none" }} />
    </div>
  );
};

/**
 * LiveClock - Shows current time updated every second
 */
const LiveClock: React.FC = () => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const dateStr = `${time.getFullYear()}-${pad(time.getMonth() + 1)}-${pad(time.getDate())}`;
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;

  return (
    <span style={{ fontSize: "11px", color: "rgba(0, 200, 220, 0.55)", fontFamily: "monospace", letterSpacing: "0.05em" }}>
      {dateStr} {timeStr}
    </span>
  );
};

export default PlatformLayout;