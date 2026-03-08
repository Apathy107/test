/**
 * 实时告警数据 - 与【设备运维管理】「实时预警动态」+【任务调度中心】「实时预警动态」同步
 * 综合指挥中心「实时告警」展示合并后的列表
 */
export type AlertLevel = "red" | "yellow" | "blue";
export type AlertSource = "device" | "mission";

export interface RealtimeAlertItem {
  id: number;
  level: AlertLevel;
  message: string;
  time: string;
  device: string;
  source: AlertSource;
  /** 任务名称（仅 mission 时有） */
  taskName?: string;
}

/** 设备运维管理 - 实时预警动态 */
const deviceAlerts: Omit<RealtimeAlertItem, "id" | "source">[] = [
  { level: "red", message: "电池电量低于10%，须立即返航", time: "3分钟前", device: "高空瞭望3号 (D005)" },
  { level: "yellow", message: "累计飞行时长超1200小时，需执行大修保养", time: "1小时前", device: "农业巡检1号 (D004)" },
  { level: "yellow", message: "季度保养逾期未执行，标记带病运行", time: "2小时前", device: "侦查小蜂 (D003)" },
  { level: "blue", message: "下次保养预计15天后到期，请提前安排", time: "今天", device: "巡逻一号 (D001)" },
];

/** 任务调度中心 - 实时预警动态 */
const missionAlerts: (Omit<RealtimeAlertItem, "id" | "source"> & { taskName?: string })[] = [
  { level: "red", message: "电池电量低于10%，须立即返航", time: "3分钟前", device: "高空瞭望3号 (D005)", taskName: "滨江大道日常巡检" },
  { level: "yellow", message: "任务执行超时 30 分钟，请关注", time: "12分钟前", device: "农业巡检1号 (D004)", taskName: "水库大坝专项检测" },
  { level: "yellow", message: "风速超过10m/s，建议暂停任务", time: "18分钟前", device: "森林防火侦察 (D007)", taskName: "森林防火预警侦察" },
  { level: "blue", message: "信号断联 > 10秒，已自动恢复", time: "35分钟前", device: "巡逻一号 (D001)", taskName: "南环快速路例行巡检" },
  { level: "blue", message: "算法置信度低于阈值，触发人工复核", time: "1小时前", device: "侦察小蜂 (D003)", taskName: "化工园区泄漏应急响应" },
];

let idSeq = 1;
function toAlert(a: Omit<RealtimeAlertItem, "id" | "source">, source: AlertSource): RealtimeAlertItem {
  return { ...a, id: idSeq++, source };
}

/** 合并后的实时告警列表（设备 + 任务），按时间紧迫度排序：红 > 黄 > 蓝，同级别按 id 递增 */
export const realtimeAlerts: RealtimeAlertItem[] = [
  ...deviceAlerts.map((a) => toAlert(a, "device")),
  ...missionAlerts.map((a) => toAlert(a, "mission")),
].sort((x, y) => {
  const order = { red: 0, yellow: 1, blue: 2 };
  return order[x.level] - order[y.level] || x.id - y.id;
});

/** 设备侧展示用（设备运维管理页） */
export const deviceAlertsForDeviceModule = deviceAlerts.map((a, i) => ({
  level: a.level,
  device: a.device,
  msg: a.message,
  time: a.time,
}));

/** 任务侧展示用（任务调度中心页）- 含 taskName */
export const missionAlertsForMissionModule = missionAlerts.map((a) => ({
  level: a.level,
  title: a.message,
  device: a.device,
  taskName: a.taskName,
  time: a.time,
}));
