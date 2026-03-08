/**
 * 设备概览数据 - 与【设备运维管理】同步
 * 设备运维管理 Dashboard 的统计与设备类型分布来源于此
 */
export interface DeviceOverviewStats {
  total: number;
  online: number;
  offline: number;
  maintenance: number;
  healthScore: number;
}

export const deviceOverviewStats: DeviceOverviewStats = {
  total: 36,
  online: 28,
  offline: 6,
  maintenance: 2,
  healthScore: 87,
};

/** 设备类型分布（与设备运维管理「设备类型分布」一致） */
export const deviceTypeData = [
  { type: "多旋翼", count: 18, online: 14, color: "rgba(30,136,229,1)" },
  { type: "机库", count: 6, online: 6, color: "rgba(38,198,218,1)" },
  { type: "农业植保", count: 4, online: 3, color: "rgba(102,187,106,1)" },
  { type: "消费级", count: 8, online: 5, color: "rgba(255,167,38,1)" },
];
