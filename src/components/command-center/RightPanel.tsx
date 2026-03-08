import React, { Suspense, lazy } from "react";
import VideoWall from "./VideoWall";
import DeviceTable from "./DeviceTable";
import EmergencyControls from "./EmergencyControls";
import { useCommandCenter } from "./CommandCenterContext";

const MapCenter = lazy(() => import("./MapCenter"));

const RightPanel: React.FC = () => {
  const { layoutMode } = useCommandCenter();
  return (
    <div
      data-cmp="RightPanel"
      style={{
        width: "310px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        height: "100%",
        minHeight: 0,
      }}
    >
      {layoutMode === "videoMain" && (
        <div style={{ flexShrink: 0, height: "180px", minHeight: 180 }}>
          <Suspense fallback={<div style={{ height: "100%", background: "rgba(0,25,60,0.8)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(0,180,220,0.6)", fontSize: 12 }}>地图…</div>}>
            <MapCenter compact />
          </Suspense>
        </div>
      )}
      <VideoWall mode={layoutMode === "videoMain" ? "thumbsOnly" : "full"} />
      <DeviceTable />
      <EmergencyControls />
    </div>
  );
};

export default RightPanel;
