import React, { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import ModuleTopBar from "@/components/ModuleTopBar";
import AutoCapture from "../components/enforcement/AutoCapture";
import SemiAutoCapture from "../components/enforcement/SemiAutoCapture";
import CaptureRecords from "../components/enforcement/CaptureRecords";
import ViolationUpload from "../components/enforcement/ViolationUpload";
import ViolationResults from "../components/enforcement/ViolationResults";
import ViolationStats from "../components/enforcement/ViolationStats";
import ReportGeneration from "../components/enforcement/ReportGeneration";
import { Shield, Camera, FileText, Upload, Award, BarChart2, BookOpen, Activity, LayoutDashboard, Video, Building2, Lightbulb, Plane } from "lucide-react";

const SIDEBAR_EXPANDED_W = 240;
const SIDEBAR_COLLAPSED_W = 72;

const menuItems = [
  { path: "/business", icon: LayoutDashboard, cname: "业务应用总览" },
  { path: "/business/traffic", icon: Video, cname: "交通非现执法" },
  { path: "/business/urban", icon: Building2, cname: "城市综合治理" },
  { path: "/business/emergency", icon: Lightbulb, cname: "通用应急应用" },
];

type TabKey = "auto" | "semi" | "records" | "upload" | "results" | "stats" | "report";

const tabs: { key: TabKey; label: string; icon: React.ElementType; badge?: number }[] = [
  { key: "auto",    label: "自动化抓拍",   icon: Camera },
  { key: "semi",    label: "半自动化抓拍", icon: Activity },
  { key: "records", label: "抓拍记录",     icon: FileText, badge: 6 },
  { key: "upload",  label: "违法上传",     icon: Upload,   badge: 3 },
  { key: "results", label: "违法成果",     icon: Award,    badge: 2 },
  { key: "stats",   label: "违法统计",     icon: BarChart2 },
  { key: "report",  label: "报告生成",     icon: BookOpen },
];

const TrafficEnforcement: React.FC = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("stats");
  const [uploadMode, setUploadMode] = useState<"queue" | "add">("queue");

  useEffect(() => {
    const tab = searchParams.get("tab");
    const add = searchParams.get("add");
    const batchRecords = searchParams.get("batchRecords");
    if (tab === "upload") setActiveTab("upload");
    if (add === "1" || searchParams.get("from") === "records" || batchRecords) setUploadMode("add");
  }, [searchParams]);

  const renderContent = () => {
    switch (activeTab) {
      case "auto":    return <AutoCapture />;
      case "semi":    return <SemiAutoCapture />;
      case "records": return <CaptureRecords />;
      case "upload":
        return (
          <ViolationUpload
            mode={uploadMode}
            initialBatchRecordIds={searchParams.get("batchRecords")?.split(",").filter(Boolean) ?? undefined}
            onModeChange={(m) => {
              setUploadMode(m);
              if (m === "queue") {
                setSearchParams((p) => {
                  const next = new URLSearchParams(p);
                  next.delete("add");
                  next.delete("from");
                  next.delete("fromRecord");
                  return next;
                });
              }
            }}
          />
        );
      case "results": return <ViolationResults />;
      case "stats":   return <ViolationStats />;
      case "report":  return <ReportGeneration />;
      default:        return null;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        margin: 0,
        background: "rgba(6, 18, 48, 1)",
        overflow: "hidden",
      }}
    >
      {/* 左侧导航栏 - 与业务应用中心一致 */}
      <aside
        style={{
          width: collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          background: "rgb(15, 23, 42)",
          borderRight: "1px solid rgba(30, 41, 59, 0.8)",
          transition: "width 0.2s",
          zIndex: 10,
        }}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => setCollapsed(!collapsed)}
          onKeyDown={(e) => e.key === "Enter" && setCollapsed((c) => !c)}
          style={{
            padding: collapsed ? "20px 14px" : "20px 24px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
            borderBottom: "1px solid rgba(51, 65, 85, 0.6)",
            minHeight: 64,
          }}
          title={collapsed ? "展开侧栏" : "收起侧栏"}
        >
          <Plane size={28} style={{ color: "rgb(34, 211, 238)", flexShrink: 0 }} />
          {!collapsed && (
            <span style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "0.05em", color: "rgb(34, 211, 238)", textTransform: "uppercase" }}>
              DRONEOPS
            </span>
          )}
        </div>
        {!collapsed && (
          <div style={{ padding: "16px 24px 8px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", color: "rgba(148, 163, 184, 1)", textTransform: "uppercase" }}>
            MAIN MODULES
          </div>
        )}
        <nav style={{ flex: 1, padding: "8px 12px", overflowY: "auto" }}>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: collapsed ? "14px 10px" : "12px 16px",
                  marginBottom: 4,
                  borderRadius: 8,
                  textDecoration: "none",
                  background: active ? "rgba(30, 58, 138, 0.5)" : "transparent",
                  color: active ? "rgb(34, 211, 238)" : "rgba(148, 163, 184, 1)",
                  justifyContent: collapsed ? "center" : "flex-start",
                  transition: "background 0.2s, color 0.2s",
                }}
                title={collapsed ? item.cname : undefined}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "rgba(51, 65, 85, 0.4)";
                    e.currentTarget.style.color = "rgba(203, 213, 225, 1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(148, 163, 184, 1)";
                  }
                }}
              >
                <Icon size={20} style={{ flexShrink: 0, color: "inherit" }} />
                {!collapsed && <span style={{ fontSize: "14px", fontWeight: 500 }}>{item.cname}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 主内容区 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
      {/* 顶部状态栏：刷新、通知、用户（与业务应用中心一致） */}
      <ModuleTopBar title="交通非现执法" subtitle="业务应用中心" />

      {/* Background grid pattern */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0, 160, 220, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 160, 220, 0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Background radial glow */}
      <div
        style={{
          position: "fixed",
          top: "-200px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "500px",
          background: "radial-gradient(ellipse, rgba(0, 120, 200, 0.14) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ===== MODULE HEADER ===== */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          background: "rgba(4, 14, 42, 0.97)",
          borderBottom: "1px solid rgba(0, 140, 210, 0.28)",
          padding: "0 28px",
          flexShrink: 0,
        }}
      >
        {/* Title row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            paddingTop: "14px",
            paddingBottom: "10px",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, rgba(0, 200, 240, 1), rgba(0, 100, 210, 1))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px rgba(0, 210, 240, 0.45)",
              flexShrink: 0,
            }}
          >
            <Shield size={20} style={{ color: "rgba(255, 255, 255, 1)" }} />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <span style={{ fontSize: "18px", fontWeight: 700, color: "rgba(210, 240, 255, 1)", letterSpacing: "0.5px" }}>
                交通非现执法
              </span>
              <span style={{ fontSize: "10px", color: "rgba(0, 180, 220, 0.7)", letterSpacing: "2px", fontWeight: 400 }}>
                TRAFFIC NON-PRESENT ENFORCEMENT SYSTEM
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "rgba(70, 140, 200, 1)", marginTop: "2px" }}>
              无人机综合管控平台 &nbsp;/&nbsp; 交通执法 &nbsp;/&nbsp;
              <span style={{ color: "rgba(0, 210, 240, 1)" }}>非现执法</span>
            </div>
          </div>

          {/* Right: quick stats */}
          <div style={{ marginLeft: "auto", display: "flex", gap: "0", alignItems: "stretch" }}>
            {[
              { label: "今日抓拍", value: "1,284", color: "rgba(0, 210, 240, 1)", trend: "↑12%", trendColor: "rgba(0, 210, 140, 1)" },
              { label: "待上传",   value: "45",    color: "rgba(255, 185, 0, 1)",  trend: "↓5%",  trendColor: "rgba(255, 100, 100, 1)" },
              { label: "已预警",   value: "326",   color: "rgba(255, 80, 80, 1)",  trend: "↑2%",  trendColor: "rgba(0, 210, 140, 1)" },
              { label: "转化率",   value: "86.5%", color: "rgba(0, 210, 140, 1)",  trend: "",      trendColor: "rgba(0, 210, 140, 1)" },
            ].map((s, idx) => (
              <div
                key={s.label}
                style={{
                  textAlign: "center",
                  padding: "6px 22px",
                  borderLeft: idx > 0 ? "1px solid rgba(0, 110, 170, 0.22)" : "none",
                }}
              >
                <div style={{ fontSize: "20px", fontWeight: 700, color: s.color, fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>
                  {s.value}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", marginTop: "2px" }}>
                  <span style={{ fontSize: "10px", color: "rgba(70, 140, 200, 1)" }}>{s.label}</span>
                  {s.trend && (
                    <span style={{ fontSize: "9px", color: s.trendColor, fontWeight: 600 }}>{s.trend}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* System status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "4px 12px",
              background: "rgba(0, 50, 35, 0.7)",
              border: "1px solid rgba(0, 190, 110, 0.28)",
              borderRadius: "14px",
              fontSize: "11px",
              color: "rgba(0, 210, 140, 1)",
              flexShrink: 0,
            }}
          >
            <div className="blink" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(0, 210, 140, 1)", boxShadow: "0 0 6px rgba(0, 210, 140, 0.8)" }} />
            系统运行正常
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: "0", marginTop: "2px" }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
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
                {tab.label}
                {tab.badge !== undefined && (
                  <span
                    style={{
                      fontSize: "10px",
                      padding: "1px 5px",
                      background: isActive ? "rgba(255, 55, 55, 0.9)" : "rgba(8, 30, 75, 1)",
                      color: isActive ? "rgba(255, 255, 255, 1)" : "rgba(90, 155, 210, 1)",
                      borderRadius: "8px",
                      fontWeight: 700,
                      border: isActive ? "none" : "1px solid rgba(0, 100, 160, 0.3)",
                      minWidth: "18px",
                      textAlign: "center",
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ flex: 1, padding: "18px 28px 24px", overflowY: "auto", position: "relative", zIndex: 1, minHeight: 0 }}>
        {renderContent()}
      </div>
      </div>
    </div>
  );
};

export default TrafficEnforcement;
