import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Cpu, AlertTriangle, Wrench, CheckCircle,
  Activity, Bell
} from "lucide-react";
import StatCard from "@device/components/StatCard";
import { deviceOverviewStats, deviceTypeData } from "@/data/command-center/deviceOverview";
import { deviceAlertsForDeviceModule } from "@/data/command-center/realtimeAlerts";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const alerts = deviceAlertsForDeviceModule;
  const stats = deviceOverviewStats;

  const levelColor: Record<string, string> = {
    red: "rgba(239,68,68,1)",
    yellow: "rgba(255,202,40,1)",
    blue: "rgba(41,182,246,1)",
  };

  const pendingOps = [
    { type: "维修工单", content: "高空瞭望3号 — 主控模块故障", status: "待诊断", time: "2025-07-10" },
    { type: "借用申请", content: "东城分局 → 南区分局 应急响应2号", status: "待审批", time: "2025-07-11" },
    { type: "报废申请", content: "农业巡检1号 — 超龄服役", status: "审核中", time: "2025-07-09" },
    { type: "保养工单", content: "侦查小蜂 — 季度例行保养", status: "待执行", time: "2025-07-08" },
  ];

  return (
    <div style={{ padding: "24px", minHeight: "100%" }}>
      {/* Stat Cards */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, marginTop: 8 }}>
        <div style={{ flex: 1 }}>
          <StatCard title="设备总数" value={stats.total} unit="台" icon={Cpu} trend={5} color="rgba(30,136,229,1)" subValue="本月新增 2 台" />
        </div>
        <div style={{ flex: 1 }}>
          <StatCard title="在线设备" value={stats.online} unit="台" icon={Activity} trend={3} color="rgba(76,175,80,1)" subValue={`在线率 ${stats.total ? Math.round((stats.online / stats.total) * 1000) / 10 : 0}%`} />
        </div>
        <div style={{ flex: 1 }}>
          <StatCard title="待处置告警" value={alerts.filter((a) => a.level === "red" || a.level === "yellow").length} unit="条" icon={Bell} trend={-20} trendLabel="较昨日" color="rgba(239,68,68,1)" subValue={`红色 ${alerts.filter((a) => a.level === "red").length} / 黄色 ${alerts.filter((a) => a.level === "yellow").length}`} />
        </div>
        <div style={{ flex: 1 }}>
          <StatCard title="本月保养完成" value={12} unit="次" icon={CheckCircle} trend={8} color="rgba(38,198,218,1)" subValue="逾期 1 台" />
        </div>
        <div style={{ flex: 1 }}>
          <StatCard title="待维修设备" value={stats.maintenance} unit="台" icon={Wrench} color="rgba(255,167,38,1)" subValue="维修中 1 / 待诊断 1" />
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        {/* Alert list */}
        <div className="panel-card" style={{ flex: 1.4, padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(220,228,240,1)" }}>实时预警动态</div>
            <span style={{ fontSize: 11, color: "rgba(100,181,246,1)", cursor: "pointer" }}>查看全部 →</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {alerts.map((a, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "10px 14px",
                  background: `${levelColor[a.level]}08`,
                  border: `1px solid ${levelColor[a.level]}30`,
                  borderLeft: `3px solid ${levelColor[a.level]}`,
                  borderRadius: 4,
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: levelColor[a.level], marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "rgba(200,220,240,1)", marginBottom: 2 }}>{a.msg}</div>
                  <div style={{ fontSize: 11, color: "rgba(100,130,170,1)" }}>{a.device}</div>
                </div>
                <div style={{ fontSize: 11, color: "rgba(80,110,150,1)", whiteSpace: "nowrap", marginTop: 2 }}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Device type breakdown */}
        <div className="panel-card" style={{ flex: 1, padding: "16px 20px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(220,228,240,1)", marginBottom: 14 }}>
            设备类型分布
          </div>
          {deviceTypeData.map((dt) => (
            <div key={dt.type} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: "rgba(160,185,215,1)" }}>{dt.type}</span>
                <span style={{ fontSize: 12, color: "rgba(200,220,240,1)" }}>
                  {dt.online}/{dt.count} 在线
                </span>
              </div>
              <div style={{ background: "rgba(24,34,58,1)", borderRadius: 3, height: 6, overflow: "hidden" }}>
                <div style={{ width: `${(dt.online / dt.count) * 100}%`, height: "100%", background: dt.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Pending operations */}
        <div className="panel-card" style={{ flex: 1, padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(220,228,240,1)" }}>待处理事项</div>
            <span style={{ background: "rgba(239,68,68,0.2)", color: "rgba(239,83,80,1)", fontSize: 10, padding: "1px 7px", borderRadius: 10, fontWeight: 700 }}>
              {pendingOps.length}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pendingOps.map((op, i) => (
              <div key={i} style={{ padding: "9px 12px", background: "rgba(18,26,44,1)", border: "1px solid rgba(30,50,80,1)", borderRadius: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 11, background: "rgba(30,136,229,0.12)", color: "rgba(100,181,246,1)", padding: "1px 6px", borderRadius: 2 }}>{op.type}</span>
                  <span style={{ fontSize: 10, color: "rgba(255,167,38,1)" }}>{op.status}</span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(180,200,230,1)" }}>{op.content}</div>
                <div style={{ fontSize: 11, color: "rgba(80,110,150,1)", marginTop: 3 }}>{op.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="panel-card" style={{ padding: "16px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(220,228,240,1)", marginBottom: 14 }}>快速操作入口</div>
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { label: "新增设备建档", path: "/device/device-archive" },
            { label: "批量导入设备", path: "/device/device-archive" },
            { label: "新建维修工单", path: "/device/fault-repair" },
            { label: "制定保养计划", path: "/device/maintenance" },
            { label: "发起借用申请", path: "/device/device-loan" },
            { label: "新建定损记录", path: "/device/damage-assess" },
          ].map((btn) => (
            <button
              key={btn.label}
              className="btn-secondary"
              onClick={() => navigate(btn.path)}
              style={{ flex: 1, textAlign: "center", padding: "8px 4px", fontSize: 12 }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;