import React from "react";
import { AppWindow, Camera, Truck, Leaf, Building, Flame } from "lucide-react";
import ModulePageLayout from "@/components/ModulePageLayout";

const COLOR = "rgb(100, 215, 255)";
const GLOW = "rgba(100, 215, 255, 0.4)";

/**
 * BusinessCenter - 业务应用中心 page
 */
const BusinessCenter: React.FC = () => {
  console.log("BusinessCenter page rendered");

  const apps = [
    { name: "航拍测绘", icon: Camera, desc: "高精度航拍与地图测绘解决方案，支持正射、倾斜摄影", count: "128次", trend: "+12%" },
    { name: "物流配送", icon: Truck, desc: "无人机末端配送，覆盖城市及偏远地区快递运输", count: "342次", trend: "+28%" },
    { name: "农业植保", icon: Leaf, desc: "智能农田喷洒作业，精准施药降低农药使用量", count: "215次", trend: "+8%" },
    { name: "城市巡检", icon: Building, desc: "市政设施、建筑外立面及桥梁安全巡检服务", count: "89次", trend: "+5%" },
    { name: "应急救援", icon: Flame, desc: "火灾、洪涝等灾害现场态势感知与物资投送", count: "23次", trend: "+45%" },
    { name: "安防监控", icon: AppWindow, desc: "重点区域24小时智能安防巡逻与监控", count: "567次", trend: "+18%" },
  ];

  return (
    <ModulePageLayout title="业务应用中心" subtitle="BUSINESS APPLICATION CENTER" icon={AppWindow} color={COLOR} glowColor={GLOW}>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "12px", color: "rgba(0, 180, 220, 0.5)", fontFamily: "monospace", letterSpacing: "0.25em", marginBottom: "20px" }}>— APPLICATION MODULES —</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {apps.map((app, i) => (
          <div
            key={i}
            style={{
              width: "calc(33.33% - 14px)",
              background: "linear-gradient(135deg, rgba(0, 30, 80, 0.85) 0%, rgba(0, 15, 55, 0.85) 100%)",
              border: `1px solid ${GLOW}`,
              borderRadius: "4px",
              padding: "24px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = `0 8px 30px ${GLOW}`;
              e.currentTarget.style.borderColor = COLOR;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = GLOW;
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent, ${COLOR}, transparent)` }} />
            <div className="flex items-start justify-between mb-4">
              <div style={{ width: "48px", height: "48px", border: `1px solid ${GLOW}`, borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0, 60, 130, 0.4)" }}>
                <app.icon size={22} style={{ color: COLOR }} />
              </div>
              <span style={{ fontSize: "12px", color: "rgb(0, 210, 120)", fontFamily: "monospace" }}>{app.trend}</span>
            </div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "rgb(210, 240, 255)", fontFamily: "'Microsoft YaHei', sans-serif", marginBottom: "8px", letterSpacing: "0.08em" }}>{app.name}</div>
            <div style={{ fontSize: "12px", color: "rgba(0, 170, 210, 0.55)", fontFamily: "'Microsoft YaHei', sans-serif", lineHeight: "1.6", marginBottom: "14px" }}>{app.desc}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "11px", color: "rgba(0, 160, 200, 0.5)", fontFamily: "monospace" }}>本月执行</span>
              <span style={{ fontSize: "14px", fontWeight: "700", color: COLOR, fontFamily: "monospace" }}>{app.count}</span>
            </div>
          </div>
        ))}
      </div>
    </ModulePageLayout>
  );
};

export default BusinessCenter;