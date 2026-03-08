import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@personnel/components/Sidebar";
import ModuleTopBar from "@/components/ModuleTopBar";

const ROUTE_TITLES: Record<string, { title: string; subtitle?: string }> = {
  "/personnel": { title: "人员资质管理总览", subtitle: "统计范围：全市所有在册飞手" },
  "/personnel/pilot-archive": { title: "飞手建档管理", subtitle: "飞手信息录入、档案维护与资质管理" },
  "/personnel/qualification-monitor": { title: "资质动态监控", subtitle: "证书有效期与预警" },
  "/personnel/qualification-upgrade": { title: "资质升级与复审", subtitle: "升级申请与复审流程" },
  "/personnel/pilot-transfer": { title: "飞手调动", subtitle: "跨单位调动与审批" },
  "/personnel/training": { title: "培训与考核", subtitle: "培训计划与考核记录" },
  "/personnel/pilot-tasks": { title: "飞手任务", subtitle: "任务分配与完成情况" },
  "/personnel/pilot-resignation": { title: "飞手离职", subtitle: "离职申请与档案处理" },
  "/personnel/performance": { title: "绩效统计", subtitle: "绩效排行与统计报表" },
};

const PersonnelLayout: React.FC = () => {
  const location = useLocation();
  const exact = ROUTE_TITLES[location.pathname];
  const fallback = Object.entries(ROUTE_TITLES).find(([path]) => path !== "/personnel" && location.pathname.startsWith(path));
  const meta = exact || (fallback ? ROUTE_TITLES[fallback[0]] : null) || { title: "人员资质管理", subtitle: "统计范围：全市所有在册飞手" };

  return (
    <div
      data-cmp="PersonnelLayout"
      className="flex min-h-screen w-full grid-bg"
      style={{ background: "rgba(8, 18, 38, 1)" }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <ModuleTopBar title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PersonnelLayout;
