import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { DeviceMapItem, DeviceCategory } from "@/data/command-center/deviceMapData";

export type LayoutMode = "mapMain" | "videoMain";

/** 已处置告警同步到消息管理的记录（消息管理可消费） */
export interface DisposalMessageRecord {
  alertId: number;
  message: string;
  device: string;
  time: string;
  level: string;
  feedback: string;
  resolvedAt: string;
}

interface CommandCenterState {
  /** 原始设备列表 */
  devices: DeviceMapItem[];
  /** 按类别过滤后的设备列表 */
  filteredDevices: DeviceMapItem[];
  flyToDeviceId: string | null;
  setFlyToDeviceId: (id: string | null) => void;
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  selectedVideoId: string;
  setSelectedVideoId: (id: string) => void;
  /** 设备类别筛选：全部 / 警用 / 政务 / 民用 */
  deviceCategoryFilter: "全部" | DeviceCategory;
  setDeviceCategoryFilter: (c: "全部" | DeviceCategory) => void;
  /** 已处置的告警 id 集合，实时告警列表不展示 */
  resolvedAlertIds: Set<number>;
  /** 标记告警已处置并同步到消息管理 */
  addResolvedAlert: (alertId: number, feedback: string, alert: { message: string; device: string; time: string; level: string }) => void;
  /** 已处置记录（同步至消息管理用） */
  disposalRecords: DisposalMessageRecord[];
}

const CommandCenterContext = createContext<CommandCenterState | null>(null);

export function CommandCenterProvider({
  children,
  devices,
}: {
  children: React.ReactNode;
  devices: DeviceMapItem[];
}) {
  const [flyToDeviceId, setFlyToDeviceId] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("mapMain");
  const [selectedVideoId, setSelectedVideoId] = useState<string>("V1");
  const [resolvedAlertIds, setResolvedAlertIds] = useState<Set<number>>(new Set());
  const [disposalRecords, setDisposalRecords] = useState<DisposalMessageRecord[]>([]);
  const [deviceCategoryFilter, setDeviceCategoryFilter] = useState<"全部" | DeviceCategory>("全部");

  const filteredDevices = useMemo(
    () =>
      deviceCategoryFilter === "全部"
        ? devices
        : devices.filter((d) => d.category === deviceCategoryFilter),
    [devices, deviceCategoryFilter]
  );

  const addResolvedAlert = useCallback(
    (alertId: number, feedback: string, alert: { message: string; device: string; time: string; level: string }) => {
      setResolvedAlertIds((prev) => new Set(prev).add(alertId));
      setDisposalRecords((prev) => [
        ...prev,
        {
          alertId,
          message: alert.message,
          device: alert.device,
          time: alert.time,
          level: alert.level,
          feedback,
          resolvedAt: new Date().toLocaleString("zh-CN"),
        },
      ]);
    },
    []
  );

  return (
    <CommandCenterContext.Provider
      value={{
        devices,
        filteredDevices,
        flyToDeviceId,
        setFlyToDeviceId,
        layoutMode,
        setLayoutMode,
        selectedVideoId,
        setSelectedVideoId,
        deviceCategoryFilter,
        setDeviceCategoryFilter,
        resolvedAlertIds,
        addResolvedAlert,
        disposalRecords,
      }}
    >
      {children}
    </CommandCenterContext.Provider>
  );
}

export function useCommandCenter() {
  const ctx = useContext(CommandCenterContext);
  if (!ctx) throw new Error("useCommandCenter must be used within CommandCenterProvider");
  return ctx;
}
