import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Navigation,
  ClipboardList,
  Database,
  BarChart2,
  Settings,
  Shield,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface NavGroup {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: { label: string; path: string; active?: boolean }[];
}

const navGroups: NavGroup[] = [
  { label: "飞行管理", icon: Navigation, path: "/fly" },
  { label: "任务管理", icon: ClipboardList, path: "/mission" },
  { label: "数据中心", icon: Database, path: "/data" },
  { label: "统计分析", icon: BarChart2, path: "/data/statistics" },
  { label: "系统设置", icon: Settings, path: "/system/settings" },
  {
    label: "交通执法",
    icon: Shield,
    children: [
      { label: "非现执法", path: "/business/traffic", active: true },
      { label: "违法查询", path: "/business/traffic" },
    ],
  },
];

interface EnforcementSidebarProps {
  collapsed?: boolean;
}

const EnforcementSidebar: React.FC<EnforcementSidebarProps> = ({ collapsed = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState<string>("交通执法");

  return (
    <div
      data-cmp="EnforcementSidebar"
      style={{
        width: collapsed ? "56px" : "200px",
        minWidth: collapsed ? "56px" : "200px",
        background: "rgba(12, 28, 65, 1)",
        height: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(35, 65, 130, 1)",
        transition: "width 0.2s",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 14px",
          borderBottom: "1px solid rgba(35, 65, 130, 1)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "6px",
            background: "rgba(200, 30, 30, 1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Shield size={16} style={{ color: "rgba(255,255,255,1)" }} />
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,1)" }}>
              执法管控平台
            </div>
            <div style={{ fontSize: "10px", color: "rgba(140, 170, 220, 1)", letterSpacing: "1px" }}>
              UAV ENFORCEMENT
            </div>
          </div>
        )}
      </div>

      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {navGroups.map((group) => {
          const Icon = group.icon;
          const isActive = group.path === location.pathname;
          const isGroupExpanded = expanded === group.label;

          if (group.children) {
            return (
              <div key={group.label}>
                <button
                  onClick={() => setExpanded(isGroupExpanded ? "" : group.label)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    background: isGroupExpanded ? "rgba(25, 55, 110, 1)" : "transparent",
                    color: isGroupExpanded ? "rgba(255,255,255,1)" : "rgba(160, 190, 230, 1)",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "13px",
                    textAlign: "left",
                  }}
                >
                  <Icon size={16} style={{ flexShrink: 0 }} />
                  {!collapsed && (
                    <>
                      <span style={{ flex: 1 }}>{group.label}</span>
                      {isGroupExpanded ? (
                        <ChevronDown size={13} />
                      ) : (
                        <ChevronRight size={13} />
                      )}
                    </>
                  )}
                </button>
                {isGroupExpanded && !collapsed && (
                  <div>
                    {group.children.map((child) => {
                      const childActive = location.pathname === child.path;
                      return (
                        <button
                          key={child.path + child.label}
                          onClick={() => navigate(child.path)}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 14px 8px 38px",
                            background: childActive
                              ? "rgba(200, 30, 30, 0.2)"
                              : "rgba(18, 40, 85, 0.6)",
                            color: childActive ? "rgba(255, 180, 180, 1)" : "rgba(140, 170, 220, 1)",
                            borderLeft: childActive
                              ? "3px solid rgba(200, 30, 30, 1)"
                              : "3px solid transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "12px",
                            textAlign: "left",
                          }}
                        >
                          <span
                            style={{
                              width: "5px",
                              height: "5px",
                              borderRadius: "50%",
                              background: childActive
                                ? "rgba(200, 30, 30, 1)"
                                : "rgba(100, 140, 200, 1)",
                              flexShrink: 0,
                            }}
                          />
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={group.label}
              onClick={() => group.path && navigate(group.path)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                background: isActive ? "rgba(25, 55, 110, 1)" : "transparent",
                color: isActive ? "rgba(255,255,255,1)" : "rgba(160, 190, 230, 1)",
                borderLeft: isActive
                  ? "3px solid rgba(60, 120, 220, 1)"
                  : "3px solid transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                textAlign: "left",
              }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{group.label}</span>}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div
          style={{
            padding: "12px 14px",
            borderTop: "1px solid rgba(35, 65, 130, 1)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "rgba(15, 60, 140, 1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,1)", fontWeight: 600 }}>
              执
            </span>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "rgba(200, 215, 240, 1)", fontWeight: 500 }}>
              执法员 张三
            </div>
            <div style={{ fontSize: "10px", color: "rgba(100, 140, 200, 1)" }}>超级管理员</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnforcementSidebar;
