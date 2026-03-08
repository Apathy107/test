import React, { Suspense, lazy } from "react";
import PlatformLayout from "@/components/PlatformLayout";
import TopNav from "@/components/command-center/TopNav";
import LeftPanel from "@/components/command-center/LeftPanel";
import RightPanel from "@/components/command-center/RightPanel";
import VideoWall from "@/components/command-center/VideoWall";
import { CommandCenterProvider, useCommandCenter } from "@/components/command-center/CommandCenterContext";
import { deviceMapData } from "@/data/command-center/deviceMapData";

const MapCenter = lazy(() => import("@/components/command-center/MapCenter"));

function CommandCenterCenterSlot() {
  const { layoutMode } = useCommandCenter();
  if (layoutMode === "videoMain") {
    return <VideoWall mode="mainOnly" />;
  }
  return (
    <Suspense fallback={<div style={{ flex: 1, minHeight: 200, background: "rgba(0, 25, 60, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(0, 180, 220, 0.6)", fontSize: "14px" }}>加载地图中…</div>}>
      <MapCenter />
    </Suspense>
  );
}

/**
 * CommandCenter - 综合指挥中心，使用新上传的 Dashboard 布局（TopNav + 左中右三栏）
 */
const CommandCenter: React.FC = () => {
  return (
    <PlatformLayout activeModule="综合指挥中心" defaultSidebarCollapsed hideHeader>
      <CommandCenterProvider devices={deviceMapData}>
      <div
        style={{
          width: "100%",
          height: "100%",
          minHeight: 0,
          background: "rgba(2, 6, 18, 1)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {/* Deep space background gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0, 40, 100, 0.4) 0%, rgba(0, 10, 30, 0) 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "200px",
            background: "radial-gradient(ellipse 100% 80% at 50% 100%, rgba(0, 60, 150, 0.25) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(0, 160, 220, 0.10) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "320px",
            height: "320px",
            background: "radial-gradient(circle at 0% 0%, rgba(0, 100, 200, 0.18) 0%, transparent 65%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "320px",
            height: "320px",
            background: "radial-gradient(circle at 100% 0%, rgba(0, 80, 180, 0.14) 0%, transparent 65%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "280px",
            height: "280px",
            background: "radial-gradient(circle at 0% 100%, rgba(0, 60, 140, 0.14) 0%, transparent 65%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Top navigation */}
        <div style={{ position: "relative", zIndex: 10, flexShrink: 0 }}>
          <TopNav />
        </div>

        {/* Main content: Left + Map + Right */}
        <div
          style={{
            position: "relative",
            zIndex: 5,
            flex: 1,
            display: "flex",
            gap: "6px",
            padding: "6px 8px 8px 8px",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <LeftPanel />
          <div style={{ flex: 1, minWidth: 0, minHeight: 200, display: "flex", flexDirection: "column" }}>
            <CommandCenterCenterSlot />
          </div>
          <RightPanel />
        </div>
      </div>
      </CommandCenterProvider>
    </PlatformLayout>
  );
};

export default CommandCenter;
