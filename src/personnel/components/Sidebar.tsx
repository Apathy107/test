import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Home,
  Users,
  LayoutDashboard,
  UserSquare,
  ShieldAlert,
  TrendingUp,
  ArrowLeftRight,
  GraduationCap,
  ClipboardList,
  LogOut,
  BarChart3,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  labelEn: string;
  icon: React.ElementType;
  badge?: number;
}

const BASE = "/personnel";

const navItems: NavItem[] = [
  { path: BASE, label: "人员资质总览", labelEn: "OVERVIEW", icon: LayoutDashboard },
  { path: `${BASE}/pilot-archive`, label: "飞手建档", labelEn: "PILOT ARCHIVE", icon: UserSquare },
  { path: `${BASE}/qualification-monitor`, label: "资质动态监控", labelEn: "QUAL MONITOR", icon: ShieldAlert, badge: 7 },
  { path: `${BASE}/qualification-upgrade`, label: "资质升级与复审", labelEn: "UPGRADE & REVIEW", icon: TrendingUp, badge: 3 },
  { path: `${BASE}/pilot-transfer`, label: "飞手调动", labelEn: "TRANSFER", icon: ArrowLeftRight, badge: 2 },
  { path: `${BASE}/training`, label: "培训与考核", labelEn: "TRAINING", icon: GraduationCap },
  { path: `${BASE}/pilot-tasks`, label: "飞手任务", labelEn: "PILOT TASKS", icon: ClipboardList },
  { path: `${BASE}/pilot-resignation`, label: "飞手离职", labelEn: "RESIGNATION", icon: LogOut, badge: 1 },
  { path: `${BASE}/performance`, label: "绩效统计", labelEn: "PERFORMANCE", icon: BarChart3 },
];

const SIDEBAR_EXPANDED_W = 210;
const SIDEBAR_COLLAPSED_W = 64;

const sideBarBg = "rgba(6, 14, 30, 1)";
const sideBarBorder = "1px solid rgba(0, 150, 200, 0.3)";
const sideBarBorderBottom = "1px solid rgba(0, 150, 200, 0.2)";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const isHub = location.pathname === "/hub";

  return (
    <aside
      data-cmp="Sidebar"
      className="min-h-screen flex-shrink-0 flex flex-col transition-[width] duration-200"
      style={{
        width: collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W,
        background: sideBarBg,
        borderRight: sideBarBorder,
      }}
    >
      {/* 模块标题：折叠时仅显示导航页卡片同款图标 (Users) */}
      <div
        className="flex flex-col items-center px-2 py-4 flex-shrink-0 cursor-pointer"
        style={{ borderBottom: sideBarBorderBottom }}
        onClick={() => setCollapsed(!collapsed)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setCollapsed((c) => !c)}
        title={collapsed ? "展开侧栏" : "收起侧栏"}
      >
        <div className="flex items-center justify-center gap-2 w-full">
          <Users size={20} style={{ color: "rgba(0, 212, 255, 1)", flexShrink: 0 }} />
          {!collapsed && (
            <div className="flex flex-col items-center overflow-hidden">
              <div className="text-base font-bold tracking-widest text-glow" style={{ color: "rgba(0, 212, 255, 1)" }}>
                人员资质管理
              </div>
              <div className="text-xs tracking-[0.2em]" style={{ color: "rgba(0, 150, 200, 0.7)" }}>
                PERSONNEL MGMT
              </div>
            </div>
          )}
        </div>
        <div className="highlight-line w-full mt-3" style={{ opacity: 0.6 }} />
      </div>

      {/* 仅保留导航功能项：导航主页 + 子模块 */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {/* 导航主页：使用主页图标 */}
        <Link
          to="/hub"
          className="flex items-center gap-3 py-3 mx-2 my-0.5 rounded transition-all duration-200 relative group"
          style={{
            paddingLeft: collapsed ? 12 : 16,
            paddingRight: collapsed ? 12 : 16,
            background: isHub ? "rgba(0, 150, 200, 0.18)" : "transparent",
            borderLeft: isHub ? "2px solid rgba(0, 212, 255, 1)" : "2px solid transparent",
            color: isHub ? "rgba(0, 212, 255, 1)" : "rgba(140, 180, 210, 1)",
            justifyContent: collapsed ? "center" : undefined,
          }}
          title="导航主页"
        >
          {isHub && (
            <div className="absolute inset-0 rounded pointer-events-none" style={{ boxShadow: "inset 0 0 12px rgba(0, 212, 255, 0.08)" }} />
          )}
          <Home size={18} style={{ flexShrink: 0 }} />
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">导航主页</div>
                <div className="text-[9px] tracking-wider truncate" style={{ color: isHub ? "rgba(0, 212, 255, 0.6)" : "rgba(80, 120, 160, 1)" }}>
                  HOME
                </div>
              </div>
              {isHub && <ChevronRight size={12} style={{ color: "rgba(0, 212, 255, 0.6)" }} />}
            </>
          )}
        </Link>

        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== BASE && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 py-3 mx-2 my-0.5 rounded transition-all duration-200 relative group"
              style={{
                paddingLeft: collapsed ? 12 : 16,
                paddingRight: collapsed ? 12 : 16,
                background: isActive ? "rgba(0, 150, 200, 0.18)" : "transparent",
                borderLeft: isActive ? "2px solid rgba(0, 212, 255, 1)" : "2px solid transparent",
                color: isActive ? "rgba(0, 212, 255, 1)" : "rgba(140, 180, 210, 1)",
                justifyContent: collapsed ? "center" : undefined,
              }}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <div className="absolute inset-0 rounded pointer-events-none" style={{ boxShadow: "inset 0 0 12px rgba(0, 212, 255, 0.08)" }} />
              )}
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{item.label}</div>
                    <div
                      className="text-[9px] tracking-wider truncate"
                      style={{ color: isActive ? "rgba(0, 212, 255, 0.6)" : "rgba(80, 120, 160, 1)" }}
                    >
                      {item.labelEn}
                    </div>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: "rgba(255, 100, 80, 1)", color: "rgba(255, 255, 255, 1)", minWidth: "18px", textAlign: "center" }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {!item.badge && isActive && <ChevronRight size={12} style={{ color: "rgba(0, 212, 255, 0.6)" }} />}
                </>
              )}
              {collapsed && item.badge !== undefined && item.badge > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1 rounded-full"
                  style={{ background: "rgba(255, 100, 80, 1)", color: "#fff", minWidth: "14px", textAlign: "center" }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
