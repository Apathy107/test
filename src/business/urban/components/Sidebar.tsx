import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Map,
  FileSearch,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

const BASE = "/business/urban";
const navItems: NavItem[] = [
  { path: BASE, label: "城市巡查", icon: Map },
  { path: `${BASE}/event-review`, label: "事件审核", icon: FileSearch },
  { path: `${BASE}/work-order`, label: "工单管理", icon: ClipboardList },
  { path: `${BASE}/emergency`, label: "应急应用", icon: AlertTriangle },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", gap: 0, marginTop: "2px" }}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            type="button"
            onClick={() => navigate(item.path)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "10px 18px",
              fontSize: "12px",
              fontWeight: isActive ? 700 : 400,
              color: isActive ? "rgba(0, 220, 240, 1)" : "rgba(90, 155, 210, 1)",
              background: isActive ? "rgba(0, 80, 130, 0.35)" : "transparent",
              border: "none",
              borderBottom: isActive ? "2px solid rgba(0, 220, 240, 1)" : "2px solid transparent",
              borderTop: isActive ? "1px solid rgba(0, 150, 200, 0.25)" : "1px solid transparent",
              borderLeft: isActive ? "1px solid rgba(0, 150, 200, 0.2)" : "1px solid transparent",
              borderRight: isActive ? "1px solid rgba(0, 150, 200, 0.2)" : "1px solid transparent",
              cursor: "pointer",
              whiteSpace: "nowrap",
              marginBottom: "-1px",
              transition: "all 0.15s",
              borderRadius: isActive ? "4px 4px 0 0" : "0",
            }}
          >
            <Icon size={13} style={{ color: isActive ? "rgba(0, 220, 240, 1)" : "rgba(70, 135, 195, 1)" }} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default Sidebar;
