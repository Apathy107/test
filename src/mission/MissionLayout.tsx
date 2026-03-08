import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@mission/components/Sidebar";
import ModuleTopBar from "@/components/ModuleTopBar";

const missionTitleMap: Record<string, string> = {
  "/mission": "任务执行看板",
  "/mission/task-create": "任务创建",
  "/mission/task-approval": "任务审批",
  "/mission/task-archive": "任务归档",
  "/mission/alert-center": "异常预警处置",
  "/mission/smart-dispatch": "智能调度辅助",
};

const MissionLayout: React.FC = () => {
  const location = useLocation();
  const title = missionTitleMap[location.pathname] || "任务调度中心";
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "rgba(4, 12, 30, 0.98)",
      }}
    >
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <ModuleTopBar title={title} subtitle="任务调度中心" />
        <main style={{ flex: 1, overflow: "auto", padding: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MissionLayout;
