import React from "react";
import { useLocation } from "react-router-dom";
import { Bell, Search, User, Settings, ChevronRight, Wifi } from "lucide-react";

// /device 为设备运维模块的根路径
const BASE = "/device";

const breadcrumbMap: Record<string, string[]> = {
  [BASE]: ["设备运维管理", "运维总览"],
  [`${BASE}/device-archive`]: ["设备运维管理", "设备建档"],
  [`${BASE}/remote-monitor`]: ["设备运维管理", "设备远程运维"],
  [`${BASE}/alert-manage`]: ["设备运维管理", "异常预警与处置"],
  [`${BASE}/device-loan`]: ["设备运维管理", "设备借用"],
  [`${BASE}/maintenance`]: ["设备运维管理", "维护保养"],
  [`${BASE}/fault-repair`]: ["设备运维管理", "故障维修管理"],
  [`${BASE}/damage-assess`]: ["设备运维管理", "设备定损"],
  [`${BASE}/scrapping`]: ["设备运维管理", "报废处置"],
};

const TopNav: React.FC = () => {
  const location = useLocation();
  const crumbs = breadcrumbMap[location.pathname] || ["设备运维管理"];

  return (
    <div
      data-cmp="TopNav"
      style={{
        height: 56,
        background: "rgba(14, 20, 36, 1)",
        borderBottom: "1px solid rgba(30, 50, 80, 1)",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 16,
        flexShrink: 0,
      }}
    >
      {/* Breadcrumb */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
        {crumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ChevronRight size={12} color="rgba(80, 110, 150, 1)" />}
            <span
              style={{
                fontSize: 13,
                color: i === crumbs.length - 1 ? "rgba(220, 228, 240, 1)" : "rgba(100, 130, 170, 1)",
                fontWeight: i === crumbs.length - 1 ? 600 : 400,
              }}
            >
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Status indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(76, 175, 80, 1)" }} />
        <span style={{ fontSize: 12, color: "rgba(100, 160, 100, 1)" }}>系统运行正常</span>
      </div>

      <div style={{ width: 1, height: 20, background: "rgba(40, 58, 90, 1)" }} />

      {/* Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(18, 26, 44, 1)",
          border: "1px solid rgba(40, 58, 90, 1)",
          borderRadius: 4,
          padding: "5px 12px",
          width: 200,
        }}
      >
        <Search size={14} color="rgba(80, 110, 150, 1)" />
        <input
          placeholder="搜索设备 SN / 名称..."
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 12,
            color: "rgba(180, 200, 230, 1)",
            width: "100%",
          }}
        />
      </div>

      {/* Alert bell */}
      <div style={{ position: "relative", cursor: "pointer" }}>
        <Bell size={18} color="rgba(120, 145, 180, 1)" />
        <span
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            background: "rgba(239, 68, 68, 1)",
            color: "rgba(255,255,255,1)",
            fontSize: 9,
            fontWeight: 700,
            width: 14,
            height: 14,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          3
        </span>
      </div>

      <Settings size={16} color="rgba(120, 145, 180, 1)" style={{ cursor: "pointer" }} />

      {/* User */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "rgba(30, 136, 229, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <User size={14} color="rgba(100, 181, 246, 1)" />
        </div>
        <div>
          <div style={{ fontSize: 12, color: "rgba(200, 220, 240, 1)", lineHeight: 1.2 }}>管理员</div>
          <div style={{ fontSize: 10, color: "rgba(80, 110, 150, 1)" }}>市局设备管理处</div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;

