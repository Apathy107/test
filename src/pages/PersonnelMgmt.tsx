import React, { useState } from "react";
import {
  Users,
  BadgeCheck,
  AlertCircle,
  BarChart2,
  Search,
  Plus,
  RefreshCw,
} from "lucide-react";
import PlatformLayout from "@/components/PlatformLayout";
import KpiCard from "@/components/personnel/KpiCard";
import FilterPanel from "@/components/personnel/FilterPanel";
import PilotTable from "@/components/personnel/PilotTable";
import AlertPanel from "@/components/personnel/AlertPanel";

/**
 * PersonnelMgmt - 人员资质管理（飞手资质管理系统）
 * 使用 personreact 上传的 Dashboard 布局
 */
const PersonnelMgmt: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <PlatformLayout activeModule="人员资质管理">
      <div
        style={{
          width: "100%",
          minHeight: "calc(100vh - 56px)",
          margin: 0,
          background: "rgba(15, 17, 23, 1)",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {/* Top header bar */}
        <div
          style={{
            padding: "0 28px",
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(18, 22, 30, 1)",
            borderBottom: "1px solid rgba(40, 48, 66, 1)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(24, 144, 255, 1)" }}>
              <BadgeCheck size={18} style={{ color: "rgba(255,255,255,1)" }} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: "rgba(224, 228, 236, 1)" }}>
              无人机飞手资质管理系统
            </span>
            <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 4, background: "rgba(24, 144, 255, 0.15)", color: "rgba(24, 144, 255, 1)" }}>
              SaaS v2.4
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: "rgba(120, 130, 150, 1)" }}>数据更新于：2025-06-15 09:42</span>
            <button
              onClick={() => {}}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, padding: "6px 12px", borderRadius: 8, background: "rgba(30, 36, 50, 1)", color: "rgba(180, 188, 204, 1)", border: "1px solid rgba(40, 48, 66, 1)", cursor: "pointer" }}
            >
              <RefreshCw size={12} />
              刷新
            </button>
            <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, background: "rgba(24, 144, 255, 1)", color: "rgba(255,255,255,1)" }}>
              管
            </div>
          </div>
        </div>

        {/* KPI cards row */}
        <div style={{ padding: "20px 28px 0 28px", display: "flex", gap: 16, flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <KpiCard title="飞手总数" value="248" unit="人" icon={Users} iconBg="rgba(24, 144, 255, 0.15)" trend={8} highlight="none" subtitle="较上月新增 18 人" />
          </div>
          <div style={{ flex: 1 }}>
            <KpiCard title="持证率" value="87.5" unit="%" icon={BadgeCheck} iconBg="rgba(82, 196, 26, 0.15)" trend={3} highlight="blue" subtitle="共 217 人持有有效执照" />
          </div>
          <div style={{ flex: 1 }}>
            <KpiCard title="即将过期预警" value="31" unit="人" icon={AlertCircle} iconBg="rgba(255, 77, 79, 0.15)" trend={-12} highlight="red" subtitle="其中已过期 12 人" />
          </div>
          <div style={{ flex: 1 }}>
            <KpiCard title="本月平均绩效分" value="4.1" unit="/ 5.0" icon={BarChart2} iconBg="rgba(250, 173, 20, 0.15)" trend={5} highlight="none" subtitle="优秀飞手 63 人" />
          </div>
        </div>

        {/* Main content area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
            margin: "20px 28px 20px 28px",
            borderRadius: 12,
            border: "1px solid rgba(40, 48, 66, 1)",
            background: "rgba(22, 26, 35, 1)",
            minHeight: 0,
          }}
        >
          <FilterPanel />

          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(40, 48, 66, 1)", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(224, 228, 236, 1)" }}>飞手列表</span>
                <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 999, background: "rgba(24, 144, 255, 0.12)", color: "rgba(24, 144, 255, 1)" }}>共 248 条</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ position: "relative" }}>
                  <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(120, 130, 150, 1)", pointerEvents: "none" }} />
                  <input
                    type="text"
                    placeholder="搜索飞手姓名..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{
                      paddingLeft: 32,
                      paddingRight: 12,
                      paddingTop: 6,
                      paddingBottom: 6,
                      background: "rgba(30, 36, 50, 1)",
                      border: "1px solid rgba(40, 48, 66, 1)",
                      borderRadius: 8,
                      color: "rgba(224, 228, 236, 1)",
                      fontSize: 13,
                      outline: "none",
                      width: 200,
                    }}
                  />
                </div>
                <button
                  onClick={() => {}}
                  style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, padding: "6px 16px", borderRadius: 8, fontWeight: 500, background: "rgba(24, 144, 255, 1)", color: "rgba(255, 255, 255, 1)", border: "none", cursor: "pointer" }}
                >
                  <Plus size={15} />
                  新增飞手
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflow: "auto" }}>
              <PilotTable />
            </div>

            <div style={{ padding: "12px 18px", borderTop: "1px solid rgba(40, 48, 66, 1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <span style={{ fontSize: 12, color: "rgba(120, 130, 150, 1)" }}>显示第 1-8 条，共 248 条记录</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {["上一页", "1", "2", "3", "...", "31", "下一页"].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {}}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 500,
                      border: "none",
                      cursor: "pointer",
                      ...(item === "1" ? { background: "rgba(24, 144, 255, 1)", color: "rgba(255, 255, 255, 1)" } : { background: "rgba(30, 36, 50, 1)", color: "rgba(180, 188, 204, 1)", border: "1px solid rgba(40, 48, 66, 1)" }),
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <AlertPanel />
        </div>
      </div>
    </PlatformLayout>
  );
};

export default PersonnelMgmt;
