import React from "react";
import StatCard from "@personnel/components/StatCard";
import AlertItem from "@personnel/components/AlertItem";
import StatusBadge from "@personnel/components/StatusBadge";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Clock,
  AlertTriangle,
  CheckCircle,
  UserX,
  BarChart2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { personnelMetrics, pilotQualificationMetrics } from "@/data/command-center/personnelMetrics";

const pendingItems = [
  { type: "升级申请", label: "待终审", title: "李明 — 超视距执照升级申请", date: "2025-07-13", status: "pending" as const },
  { type: "离职申请", label: "待审批", title: "王强 — 主动辞职申请", date: "2025-07-12", status: "warning" as const },
  { type: "调动申请", label: "待确认", title: "赵磊 → 南区分队 借调申请", date: "2025-07-11", status: "info" as const },
  { type: "复审提醒", label: "逾期未处", title: "陈峰 — 超视距执照复审逾期", date: "2025-07-09", status: "danger" as const },
];

const recentAlerts = [
  { level: "red" as const, content: "张伟 超视距执照已过期，任务派单已自动冻结", target: "张伟 (P012) · 西城分队", time: "30分钟前" },
  { level: "red" as const, content: "刘洋 CAAC 执照将于 7 天后到期，请立即处理", target: "刘洋 (P008) · 北郊中队", time: "1小时前" },
  { level: "yellow" as const, content: "赵磊 视距内执照 30 天内到期，请安排复审", target: "赵磊 (P021) · 东城分队", time: "3小时前" },
  { level: "yellow" as const, content: "本季度理论考核合格率低于 80%，请关注", target: "南区分队 (3人未通过)", time: "今天" },
  { level: "blue" as const, content: "陈峰 超视距执照 90 天后到期，请提前安排", target: "陈峰 (P005) · 应急响应队", time: "昨天" },
];

const topPilots = [
  { name: "李明", unit: "东城分队", score: 98, tasks: 42, status: "active" as const },
  { name: "周强", unit: "北郊中队", score: 95, tasks: 38, status: "active" as const },
  { name: "吴雪", unit: "西城分队", score: 93, tasks: 35, status: "active" as const },
  { name: "郑宇", unit: "应急响应", score: 91, tasks: 31, status: "active" as const },
  { name: "孙杰", unit: "南区分队", score: 89, tasks: 29, status: "active" as const },
];

const Dashboard: React.FC = () => {
  const stats = personnelMetrics;
  const certTotal = pilotQualificationMetrics.certifiedTotal;
  const certRate = stats.total ? Math.round((certTotal / stats.total) * 10000) / 100 : 0;
  return (
    <>
      {/* Stats row - 与综合指挥中心「人员指标」同步 */}
      <div className="flex gap-4 mb-5" style={{ flexWrap: "nowrap" }}>
        <div className="flex-1 min-w-0">
          <StatCard title="在册飞手总数" value={String(stats.total)} unit="人" subInfo="本月新增 5 人" trend={4} icon={Users}
            iconColor="rgba(0, 212, 255, 1)" iconBg="rgba(0, 80, 120, 0.35)" />
        </div>
        <div className="flex-1 min-w-0">
          <StatCard title="有效持证飞手" value={String(stats.certified)} unit="人" subInfo={`持证率 ${certRate}%`} trend={2} icon={ShieldCheck}
            iconColor="rgba(0, 220, 150, 1)" iconBg="rgba(0, 120, 80, 0.3)" />
        </div>
        <div className="flex-1 min-w-0">
          <StatCard title="待处理预警" value="7" unit="条" subInfo="红色 2 / 黄色 3 / 蓝色 2" trend={-15} icon={ShieldAlert}
            iconColor="rgba(255, 150, 0, 1)" iconBg="rgba(180, 80, 0, 0.25)" alert />
        </div>
        <div className="flex-1 min-w-0">
          <StatCard title="本月证书到期" value={String(stats.certExpiringThisMonth)} unit="本" subInfo="其中 3 本已逾期未续" trend={8} icon={Clock}
            iconColor="rgba(255, 200, 0, 1)" iconBg="rgba(180, 130, 0, 0.25)" alert />
        </div>
        <div className="flex-1 min-w-0">
          <StatCard title="冻结派单飞手" value={String(stats.frozen)} unit="人" subInfo="因资质失效自动冻结" trend={0} icon={UserX}
            iconColor="rgba(255, 80, 80, 1)" iconBg="rgba(160, 30, 30, 0.25)" />
        </div>
        <div className="flex-1 min-w-0">
          <StatCard title="本月培训完成" value={String(stats.trainingCompletedThisMonth)} unit="人次" subInfo="合格率 91.7%" trend={12} icon={CheckCircle}
            iconColor="rgba(0, 200, 255, 1)" iconBg="rgba(0, 100, 160, 0.25)" />
        </div>
      </div>

      {/* Middle row */}
      <div className="flex gap-4 mb-5">
        {/* Alert panel */}
        <div className="flex-1 min-w-0 tech-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} style={{ color: "rgba(255, 150, 0, 1)" }} />
              <span className="text-sm font-semibold" style={{ color: "rgba(200, 220, 240, 1)" }}>
                实时预警动态
              </span>
            </div>
            <Link
              to="/qualification-monitor"
              className="text-xs flex items-center gap-1 hover:opacity-80 transition-opacity"
              style={{ color: "rgba(0, 212, 255, 0.8)" }}
            >
              查看全部 <ArrowRight size={11} />
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {recentAlerts.map((a, i) => (
              <AlertItem key={i} level={a.level} content={a.content} target={a.target} time={a.time} />
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="w-[320px] flex-shrink-0 flex flex-col gap-4">
          {/* Pending items */}
          <div className="tech-card rounded-lg p-4 flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: "rgba(200, 220, 240, 1)" }}>
                待处理事项
              </span>
              <span
                className="w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold"
                style={{ background: "rgba(255, 80, 80, 1)", color: "rgba(255, 255, 255, 1)" }}
              >
                {pendingItems.length}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {pendingItems.map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    background: "rgba(16, 38, 76, 0.6)",
                    border: "1px solid rgba(0, 100, 150, 0.3)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: "rgba(100, 140, 180, 1)" }}>{item.type}</span>
                    <StatusBadge status={item.status} label={item.label} dot={false} />
                  </div>
                  <div className="text-xs" style={{ color: "rgba(180, 210, 240, 1)" }}>{item.title}</div>
                  <div className="text-xs mt-1" style={{ color: "rgba(80, 120, 160, 1)" }}>{item.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex gap-4">
        {/* Qualification distribution */}
        <div className="tech-card rounded-lg p-4 flex-1">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={15} style={{ color: "rgba(0, 212, 255, 1)" }} />
            <span className="text-sm font-semibold" style={{ color: "rgba(200, 220, 240, 1)" }}>
              证书类型分布
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: "视距内执照 (VLOS)", count: pilotQualificationMetrics.vlos, total: pilotQualificationMetrics.certifiedTotal, color: "rgba(0, 212, 255, 1)" },
              { label: "超视距执照 (BVLOS)", count: pilotQualificationMetrics.bvlos, total: pilotQualificationMetrics.certifiedTotal, color: "rgba(0, 220, 150, 1)" },
              { label: "教员执照 (Instructor)", count: pilotQualificationMetrics.instructor, total: pilotQualificationMetrics.certifiedTotal, color: "rgba(180, 160, 255, 1)" },
              { label: "农业植保专项", count: pilotQualificationMetrics.agriculture, total: pilotQualificationMetrics.certifiedTotal, color: "rgba(255, 200, 0, 1)" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: "rgba(140, 180, 210, 1)" }}>{item.label}</span>
                  <span className="text-xs font-medium" style={{ color: item.color }}>
                    {item.count} 人
                  </span>
                </div>
                <div
                  className="w-full rounded-full h-2"
                  style={{ background: "rgba(16, 38, 76, 1)" }}
                >
                  <div
                    className="h-2 rounded-full progress-glow transition-all"
                    style={{
                      width: `${(item.count / item.total) * 100}%`,
                      background: item.color,
                      boxShadow: `0 0 6px ${item.color}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top pilots */}
        <div className="tech-card rounded-lg p-4 w-[300px] flex-shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={15} style={{ color: "rgba(0, 220, 150, 1)" }} />
            <span className="text-sm font-semibold" style={{ color: "rgba(200, 220, 240, 1)" }}>
              绩效排行 TOP 5
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {topPilots.map((p, i) => (
              <div
                key={p.name}
                className="flex items-center gap-3 p-2 rounded"
                style={{ background: "rgba(16, 38, 76, 0.5)" }}
              >
                <span
                  className="w-6 h-6 flex items-center justify-center rounded text-xs font-bold flex-shrink-0"
                  style={{
                    background: i === 0 ? "rgba(255, 200, 0, 0.2)" : i === 1 ? "rgba(180, 200, 220, 0.2)" : "rgba(200, 120, 60, 0.15)",
                    color: i === 0 ? "rgba(255, 200, 0, 1)" : i === 1 ? "rgba(180, 200, 220, 1)" : "rgba(200, 120, 60, 1)",
                  }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium" style={{ color: "rgba(200, 220, 240, 1)" }}>{p.name}</div>
                  <div className="text-xs" style={{ color: "rgba(80, 120, 160, 1)" }}>{p.unit}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold" style={{ color: "rgba(0, 212, 255, 1)" }}>{p.score}分</div>
                  <div className="text-xs" style={{ color: "rgba(80, 120, 160, 1)" }}>{p.tasks}单</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="tech-card rounded-lg p-4 w-[260px] flex-shrink-0">
          <span className="text-sm font-semibold block mb-4" style={{ color: "rgba(200, 220, 240, 1)" }}>
            快速操作入口
          </span>
          <div className="flex flex-col gap-2">
            {[
              { label: "新增飞手建档", to: "/pilot-archive", color: "rgba(0, 212, 255, 1)" },
              { label: "发起资质升级申请", to: "/qualification-upgrade", color: "rgba(0, 220, 150, 1)" },
              { label: "查看预警列表", to: "/qualification-monitor", color: "rgba(255, 150, 0, 1)" },
              { label: "制定培训计划", to: "/training", color: "rgba(180, 160, 255, 1)" },
              { label: "发起调动申请", to: "/pilot-transfer", color: "rgba(255, 200, 0, 1)" },
              { label: "查看绩效报表", to: "/performance", color: "rgba(100, 200, 255, 1)" },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium transition-colors hover:opacity-80"
                style={{
                  background: "rgba(16, 38, 76, 0.7)",
                  border: `1px solid ${action.color}33`,
                  color: action.color,
                }}
              >
                {action.label}
                <ArrowRight size={12} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;