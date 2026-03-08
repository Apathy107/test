import React, { useCallback } from "react";
import PersonnelCard from "./PersonnelCard";
import DeviceOverview from "./DeviceOverview";
import AlertList from "./AlertList";
import { useCommandCenter } from "./CommandCenterContext";
import { useNotificationsOptional } from "@/contexts/NotificationContext";
import { deviceOverviewStats } from "@/data/command-center/deviceOverview";
import { personnelMetrics, pilotQualificationMetrics } from "@/data/command-center/personnelMetrics";
import { realtimeAlerts } from "@/data/command-center/realtimeAlerts";

const LeftPanel: React.FC = () => {
  const { resolvedAlertIds, addResolvedAlert } = useCommandCenter();
  const notificationContext = useNotificationsOptional();
  const alerts = realtimeAlerts.filter((a) => !resolvedAlertIds.has(a.id));

  const handleResolve = useCallback(
    (alertId: number, feedback: string, alert: { message: string; device: string; time: string; level: string }) => {
      addResolvedAlert(alertId, feedback, alert);
      notificationContext?.addNotification({
        id: `disposal-${alertId}`,
        title: `[已处置] ${alert.message}`,
        summary: `${alert.device} · ${feedback}`,
        category: "业务处置通知",
        time: new Date().toLocaleString("zh-CN"),
        read: false,
        source: "disposal",
      });
    },
    [addResolvedAlert, notificationContext]
  );

  return (
    <div
      data-cmp="LeftPanel"
      style={{
        width: "268px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        height: "100%",
      }}
    >
      <PersonnelCard
        total={personnelMetrics.total}
        certified={personnelMetrics.certified}
        uncertified={personnelMetrics.total - personnelMetrics.certified}
        trend={personnelMetrics.trend}
        pilotQualification={pilotQualificationMetrics}
      />
      <DeviceOverview
        online={deviceOverviewStats.online}
        offline={deviceOverviewStats.offline}
        maintenance={deviceOverviewStats.maintenance}
        healthScore={deviceOverviewStats.healthScore}
      />
      <AlertList alerts={alerts} onResolve={handleResolve} />
    </div>
  );
};

export default LeftPanel;
