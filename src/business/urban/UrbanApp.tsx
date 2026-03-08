import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { Shield } from "lucide-react";
import Sidebar from "./components/Sidebar";

const queryClient = new QueryClient();

const UrbanApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div
        className="flex flex-col overflow-hidden"
        style={{
          width: "100%",
          flex: 1,
          minHeight: 0,
          background: "rgba(6, 18, 48, 1)",
        }}
      >
        {/* 模块标头：与交通非现执法一致 */}
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
          {/* 标题行：图标 + 标题 + 面包屑 + 统计 + 系统状态 */}
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
                  城市综合治理
                </span>
                <span style={{ fontSize: "10px", color: "rgba(0, 180, 220, 0.7)", letterSpacing: "2px", fontWeight: 400 }}>
                  URBAN MANAGEMENT SYSTEM
                </span>
              </div>
              <div style={{ fontSize: "11px", color: "rgba(70, 140, 200, 1)", marginTop: "2px" }}>
                无人机综合管控平台 &nbsp;/&nbsp; 业务应用 &nbsp;/&nbsp;
                <span style={{ color: "rgba(0, 210, 240, 1)" }}>城市综合治理</span>
              </div>
            </div>
            {/* 右侧统计 */}
            <div style={{ marginLeft: "auto", display: "flex", gap: 0, alignItems: "stretch" }}>
              {[
                { label: "今日任务", value: "12", color: "rgba(0, 210, 240, 1)", trend: "↑8%", trendColor: "rgba(0, 210, 140, 1)" },
                { label: "进行中", value: "4", color: "rgba(255, 185, 0, 1)", trend: "", trendColor: "rgba(0, 210, 140, 1)" },
                { label: "已完成", value: "7", color: "rgba(120, 180, 210, 1)", trend: "", trendColor: "rgba(0, 210, 140, 1)" },
                { label: "异常", value: "1", color: "rgba(255, 80, 80, 1)", trend: "", trendColor: "rgba(255, 100, 100, 1)" },
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
            {/* 系统运行正常 */}
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
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(0, 210, 140, 1)", boxShadow: "0 0 6px rgba(0, 210, 140, 0.8)" }} />
              系统运行正常
            </div>
          </div>
          {/* Tab 栏：与交通非现执法一致 */}
          <Sidebar />
        </div>
        <div
          className="flex-1 overflow-hidden"
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <Outlet />
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default UrbanApp;
