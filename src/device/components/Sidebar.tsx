import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Home,
  Wrench,
  LayoutDashboard,
  FileText,
  Monitor,
  Bell,
  ArrowLeftRight,
  AlertTriangle,
  ShieldAlert,
  Trash2,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: string;
}

const BASE = "/device";
const SIDEBAR_EXPANDED_W = 210;
const SIDEBAR_COLLAPSED_W = 64;
const sideBarBg = "rgba(6, 14, 30, 1)";
const sideBarBorder = "1px solid rgba(0, 150, 200, 0.3)";
const sideBarBorderBottom = "1px solid rgba(0, 150, 200, 0.2)";

const navItems: NavItem[] = [
  { label: "运维总览", icon: LayoutDashboard, path: BASE },
  { label: "设备建档", icon: FileText, path: `${BASE}/device-archive` },
  { label: "远程运维", icon: Monitor, path: `${BASE}/remote-monitor`, badge: "12" },
  { label: "异常预警", icon: Bell, path: `${BASE}/alert-manage`, badge: "3" },
  { label: "设备借用", icon: ArrowLeftRight, path: `${BASE}/device-loan` },
  { label: "维护保养", icon: Wrench, path: `${BASE}/maintenance`, badge: "5" },
  { label: "故障维修", icon: AlertTriangle, path: `${BASE}/fault-repair` },
  { label: "设备定损", icon: ShieldAlert, path: `${BASE}/damage-assess` },
  { label: "报废处置", icon: Trash2, path: `${BASE}/scrapping` },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const isHub = location.pathname === "/hub";

  return (
    <div
      data-cmp="Sidebar"
      style={{
        width: collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W,
        minHeight: "100vh",
        background: sideBarBg,
        borderRight: sideBarBorder,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s",
        flexShrink: 0,
      }}
    >
      {/* 模块标题：折叠时仅显示导航页卡片同款图标 (Wrench) */}
      <div
        style={{
          padding: "16px 12px",
          borderBottom: sideBarBorderBottom,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: 10,
          cursor: "pointer",
        }}
        onClick={() => setCollapsed(!collapsed)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setCollapsed((c) => !c)}
        title={collapsed ? "展开侧栏" : "收起侧栏"}
      >
        <Wrench size={20} style={{ color: "rgba(0, 212, 255, 1)", flexShrink: 0 }} />
        {!collapsed && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(220, 228, 240, 1)", lineHeight: 1.2 }}>设备运维管理</div>
            <div style={{ fontSize: 10, color: "rgba(100, 140, 180, 1)", letterSpacing: "0.05em" }}>DEVICE OPERATIONS</div>
          </div>
        )}
      </div>

      <nav style={{ flex: 1, padding: "12px 0", overflow: "hidden" }}>
        <Link
          to="/hub"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: collapsed ? "10px 12px" : "10px 16px",
            marginBottom: 2,
            borderRadius: 5,
            background: isHub ? "rgba(0, 150, 200, 0.18)" : "transparent",
            borderLeft: isHub ? "2px solid rgba(0, 212, 255, 1)" : "2px solid transparent",
            color: isHub ? "rgba(0, 212, 255, 1)" : "rgba(140, 180, 210, 1)",
            justifyContent: collapsed ? "center" : "flex-start",
            textDecoration: "none",
            fontSize: 13,
          }}
          title="导航主页"
        >
          <Home size={18} style={{ flexShrink: 0 }} />
          {!collapsed && (
            <>
              <span style={{ flex: 1 }}>导航主页</span>
              {isHub && <ChevronRight size={12} style={{ color: "rgba(0, 212, 255, 0.6)" }} />}
            </>
          )}
        </Link>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path !== BASE && location.pathname.startsWith(item.path));
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: collapsed ? "10px 12px" : "10px 16px",
                marginBottom: 2,
                borderRadius: 5,
                cursor: "pointer",
                background: isActive ? "rgba(0, 150, 200, 0.18)" : "transparent",
                borderLeft: isActive ? "2px solid rgba(0, 212, 255, 1)" : "2px solid transparent",
                color: isActive ? "rgba(0, 212, 255, 1)" : "rgba(140, 180, 210, 1)",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <>
                  <span style={{ flex: 1, fontSize: 13 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{ background: "rgba(239, 68, 68, 1)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10, minWidth: 18, textAlign: "center" }}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
