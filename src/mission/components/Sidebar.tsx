import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Home,
  CalendarClock,
  LayoutDashboard,
  PlusCircle,
  CheckSquare,
  Archive,
  AlertTriangle,
  Cpu,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
}

const BASE = "/mission";
const SIDEBAR_EXPANDED_W = 210;
const SIDEBAR_COLLAPSED_W = 64;
const sideBarBg = "rgba(6, 14, 30, 1)";
const sideBarBorder = "1px solid rgba(0, 150, 200, 0.3)";
const sideBarBorderBottom = "1px solid rgba(0, 150, 200, 0.2)";

const navItems: NavItem[] = [
  { label: "任务执行看板", path: BASE, icon: LayoutDashboard },
  { label: "任务创建", path: `${BASE}/task-create`, icon: PlusCircle },
  { label: "任务审批", path: `${BASE}/task-approval`, icon: CheckSquare, badge: 3 },
  { label: "任务归档", path: `${BASE}/task-archive`, icon: Archive },
  { label: "异常预警处置", path: `${BASE}/alert-center`, icon: AlertTriangle, badge: 5 },
  { label: "智能调度辅助", path: `${BASE}/smart-dispatch`, icon: Cpu },
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
      <div
        role="button"
        tabIndex={0}
        onClick={() => setCollapsed(!collapsed)}
        onKeyDown={(e) => e.key === "Enter" && setCollapsed((c) => !c)}
        style={{
          padding: collapsed ? "16px 12px" : "20px 16px",
          borderBottom: sideBarBorderBottom,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: 10,
        }}
        title={collapsed ? "展开侧栏" : "收起侧栏"}
      >
        <CalendarClock size={20} style={{ color: "rgba(0, 212, 255, 1)", flexShrink: 0 }} />
        {!collapsed && (
          <div>
            <div style={{ fontSize: 10, color: "rgba(100, 160, 220, 1)", letterSpacing: "2px" }}>TASK DISPATCH</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(0, 212, 255, 1)" }}>任务调度中心</div>
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
            padding: collapsed ? "10px 12px" : "11px 16px",
            marginBottom: 2,
            borderLeft: isHub ? "3px solid rgba(0, 212, 255, 1)" : "3px solid transparent",
            background: isHub ? "rgba(0, 120, 180, 0.3)" : "transparent",
            color: isHub ? "rgba(0, 212, 255, 1)" : "rgba(140, 180, 220, 1)",
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
              {isHub && <ChevronRight size={12} />}
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
                padding: collapsed ? "10px 12px" : "11px 16px",
                marginBottom: 2,
                cursor: "pointer",
                borderLeft: isActive ? "3px solid rgba(0, 212, 255, 1)" : "3px solid transparent",
                background: isActive ? "rgba(0, 120, 180, 0.3)" : "transparent",
                color: isActive ? "rgba(0, 212, 255, 1)" : "rgba(140, 180, 220, 1)",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge !== undefined && (
                    <span style={{ background: "rgba(255, 59, 59, 1)", color: "#fff", borderRadius: 10, fontSize: 11, padding: "1px 6px", fontWeight: 600 }}>
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
