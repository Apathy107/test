import React from "react";
import { CheckCircle, Clock, AlertCircle, Wrench } from "lucide-react";

interface TimelineEvent {
  date: string;
  type: "completed" | "overdue" | "upcoming" | "inprogress";
  title: string;
  operator: string;
  detail: string;
  workOrder?: string;
}

interface MaintenanceTimelineProps {
  deviceName?: string;
  events?: TimelineEvent[];
}

const defaultEvents: TimelineEvent[] = [
  { date: "2025-07-01", type: "completed", title: "定期保养（季度）", operator: "陈技师", detail: "全面检查，更换桨叶，清洁传感器，电子签名完成", workOrder: "WO-2025-0701" },
  { date: "2025-05-15", type: "completed", title: "按需保养", operator: "王工", detail: "因累计飞行达300小时触发，更换电机散热硅脂", workOrder: "WO-2025-0515" },
  { date: "2025-04-01", type: "completed", title: "定期保养（季度）", operator: "陈技师", detail: "全面检查，测试所有传感器，校准IMU", workOrder: "WO-2025-0401" },
  { date: "2025-09-30", type: "upcoming", title: "定期保养（季度）", operator: "待分配", detail: "预计用时4小时，请提前预约场地" },
];

const typeConfig = {
  completed: { icon: CheckCircle, color: "rgba(76,175,80,1)", label: "已完成" },
  overdue: { icon: AlertCircle, color: "rgba(239,68,68,1)", label: "已逾期" },
  upcoming: { icon: Clock, color: "rgba(30,136,229,1)", label: "待执行" },
  inprogress: { icon: Wrench, color: "rgba(255,167,38,1)", label: "进行中" },
};

const MaintenanceTimeline: React.FC<MaintenanceTimelineProps> = ({
  deviceName = "巡逻一号",
  events = defaultEvents,
}) => {
  return (
    <div data-cmp="MaintenanceTimeline">
      <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(180,200,230,1)", marginBottom: 16 }}>
        {deviceName} — 保养履历
      </div>
      <div style={{ position: "relative" }}>
        {/* Vertical line */}
        <div style={{ position: "absolute", left: 18, top: 0, bottom: 0, width: 1, background: "rgba(30,50,80,1)" }} />

        {events.map((ev, i) => {
          const cfg = typeConfig[ev.type];
          const Icon = cfg.icon;
          return (
            <div key={i} style={{ display: "flex", gap: 16, marginBottom: 20, position: "relative" }}>
              {/* Icon */}
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${cfg.color}20`, border: `2px solid ${cfg.color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                <Icon size={14} color={cfg.color} />
              </div>
              {/* Content */}
              <div style={{ flex: 1, background: "rgba(16,22,38,1)", border: "1px solid rgba(30,50,80,1)", borderRadius: 6, padding: "12px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(220,228,240,1)" }}>{ev.title}</span>
                    <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 2, background: `${cfg.color}20`, color: cfg.color, border: `1px solid ${cfg.color}40` }}>
                      {cfg.label}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: "rgba(80,110,150,1)" }}>{ev.date}</span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(160,185,215,1)", marginBottom: 4 }}>{ev.detail}</div>
                <div style={{ display: "flex", gap: 16 }}>
                  <span style={{ fontSize: 11, color: "rgba(100,130,170,1)" }}>操作人：{ev.operator}</span>
                  {ev.workOrder && <span style={{ fontSize: 11, color: "rgba(100,181,246,1)" }}>工单：{ev.workOrder}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MaintenanceTimeline;