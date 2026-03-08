import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@device/components/Sidebar";
import ModuleTopBar from "@/components/ModuleTopBar";

/** 子模块表头主标题（图中红框对应内容） */
const deviceTitleMap: Record<string, string> = {
  "/device": "设备运维总览",
  "/device/device-archive": "设备建档管理",
  "/device/remote-monitor": "设备远程运维",
  "/device/alert-manage": "异常预警与处置",
  "/device/device-loan": "设备借用",
  "/device/maintenance": "维护保养",
  "/device/fault-repair": "故障维修管理",
  "/device/damage-assess": "设备定损",
  "/device/scrapping": "报废处置",
};

/** 子模块表头副标题（图中红框描述） */
const deviceSubtitleMap: Record<string, string> = {
  "/device/device-archive": "管理所有在册无人机设备档案信息",
  "/device/remote-monitor": "实时监控 · 固件管理 · 远程调试",
  "/device/alert-manage": "预警规则配置 · 实时推送 · 处置闭环管理",
  "/device/device-loan": "单位内借用 · 跨单位借调 · 专项任务调配",
  "/device/maintenance": "保养计划 · 工单执行 · 履历追溯 · 逾期管控",
  "/device/fault-repair": "报修受理 · 远程诊断 · 维修记录",
  "/device/damage-assess": "整机定损 · 部件定损 · 定损记录归档",
  "/device/scrapping": "报废申请 · 多级审批 · 残值处理 · 环保处置 · 档案封存",
};

const DeviceLayout: React.FC = () => {
  const location = useLocation();
  const isOverview = location.pathname === "/device";
  const title = isOverview ? "" : (deviceTitleMap[location.pathname] || "设备运维管理");
  const subtitle = isOverview ? "" : (deviceSubtitleMap[location.pathname] ?? "实时监控 · 固件管理 · 远程调试");
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        maxWidth: "1920px",
        minHeight: "100vh",
        margin: "0 auto",
        background: "rgba(10, 14, 26, 1)",
      }}
    >
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <ModuleTopBar title={title} subtitle={subtitle} />
        <main style={{ flex: 1, overflow: "auto", padding: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DeviceLayout;
