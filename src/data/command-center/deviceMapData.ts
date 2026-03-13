/**
 * 综合指挥中心 + 设备运维管理 地图设备点位与覆盖范围
 * 与【设备运维管理】设备远程运维（RemoteMonitor）设备列表一致
 */

/** 飞机实时状态码 → 中文文案（设备实时列表状态数据源） */
export const AIRCRAFT_STATUS_MAP: Record<string, string> = {
  "0": "待机",
  "1": "起飞准备",
  "2": "起飞准备完毕",
  "3": "手动飞行",
  "4": "自动起飞",
  "5": "航线飞行",
  "6": "全景拍照",
  "7": "智能跟随",
  "8": "ADS-B 躲避",
  "9": "自动返航",
  "10": "自动降落",
  "11": "强制降落",
  "12": "三桨叶降落",
  "13": "升级中",
  "14": "未连接",
  "15": "APAS",
  "16": "虚拟摇杆状态",
  "17": "指令飞行",
  "18": "空中 RTK 收敛模式",
  "19": "机场选址中",
  "20": "POI环绕",
  "21": "进离场航线飞行过程中",
};

export type DeviceTaskStatus = "执行任务" | "待命" | "返航" | "充电" | "异常";
/** 设备类型：单兵飞机 / 机场(机库) */
export type DeviceMapType = "uav" | "dock";

export interface DeviceMapItem {
  id: string;
  /** 设备名称（如 巡逻一号） */
  name: string;
  /** 设备 SN / 编号（如 DRN-001） */
  sn: string;
  /** 设备类型，用于地图图标区分 */
  deviceType: DeviceMapType;
  lat: number;
  lng: number;
  /** 覆盖半径（米） */
  coverageRadius: number;
  taskName: string;
  /** 飞机实时状态码（0-21），展示时用 AIRCRAFT_STATUS_MAP 转成中文 */
  statusCode: number;
  /** @deprecated 保留兼容，展示优先用 statusCode + AIRCRAFT_STATUS_MAP */
  taskStatus?: DeviceTaskStatus;
  battery: number;
  signal: number;
  /** 飞行轨迹点（仅飞机，用于实时轨迹）[lat, lng][] */
  trajectory?: [number, number][];
  /** 飞行方向/航向角（度，0=北） */
  heading?: number;
}

/** 与设备运维管理设备远程运维一致的点位；覆盖半径用于地图圆形；状态使用飞机实时状态码 0-21 */
export const deviceMapData: DeviceMapItem[] = [
  { id: "D001", name: "巡逻一号", sn: "DRN-001", deviceType: "uav", lat: 39.9093, lng: 116.3974, coverageRadius: 800, taskName: "区域A巡检", statusCode: 5, battery: 78, signal: 4, trajectory: [[39.908, 116.395], [39.9085, 116.396], [39.909, 116.397], [39.9093, 116.3974]], heading: 45 },
  { id: "D002", name: "应急响应2号", sn: "DRN-002", deviceType: "uav", lat: 39.9289, lng: 116.4074, coverageRadius: 600, taskName: "物资投送", statusCode: 5, battery: 62, signal: 3, trajectory: [[39.927, 116.406], [39.928, 116.4065], [39.9289, 116.4074]], heading: 90 },
  { id: "D003", name: "侦查小蜂", sn: "DRN-003", deviceType: "uav", lat: 39.8893, lng: 116.3374, coverageRadius: 500, taskName: "低电返回", statusCode: 9, battery: 14, signal: 2, trajectory: [[39.890, 116.338], [39.8895, 116.3375], [39.8893, 116.3374]], heading: 225 },
  { id: "D004", name: "农业巡检1号", sn: "DRN-004", deviceType: "uav", lat: 39.7893, lng: 116.2374, coverageRadius: 700, taskName: "—", statusCode: 0, battery: 95, signal: 5, heading: 0 },
  { id: "D005", name: "高空瞭望3号", sn: "DRN-005", deviceType: "uav", lat: 39.8593, lng: 116.5074, coverageRadius: 1000, taskName: "目标追踪", statusCode: 7, battery: 45, signal: 3, trajectory: [[39.858, 116.506], [39.8585, 116.5065], [39.8593, 116.5074]], heading: 135 },
  { id: "D006", name: "机库A01", sn: "TDR-001", deviceType: "dock", lat: 39.9193, lng: 116.4274, coverageRadius: 1200, taskName: "定点监控", statusCode: 5, battery: 100, signal: 5 },
];
