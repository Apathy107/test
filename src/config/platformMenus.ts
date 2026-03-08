/**
 * 平台路由对应的菜单目录（与 App 路由保持一致，为菜单管理「从平台路由更新」提供数据源）
 */
export interface PlatformMenuItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
  parentId: string;
  sortOrder: number;
}

export const PLATFORM_MENUS: PlatformMenuItem[] = [
  { id: 'cmd', name: '综合指挥中心', path: '/command', parentId: '', sortOrder: 1 },
  { id: 'fly', name: '飞行控制中心', path: '/fly', parentId: '', sortOrder: 2 },
  { id: 'fly-routes', name: '航线规划', path: '/fly/routes', parentId: 'fly', sortOrder: 1 },
  { id: 'fly-workflows', name: '工作流', path: '/fly/workflows', parentId: 'fly', sortOrder: 2 },
  { id: 'fly-modeling', name: '建模', path: '/fly/modeling', parentId: 'fly', sortOrder: 3 },
  { id: 'device', name: '设备运维管理', path: '/device', parentId: '', sortOrder: 3 },
  { id: 'device-dash', name: '设备总览', path: '/device', parentId: 'device', sortOrder: 1 },
  { id: 'device-archive', name: '设备档案', path: '/device/device-archive', parentId: 'device', sortOrder: 2 },
  { id: 'device-monitor', name: '远程监控', path: '/device/remote-monitor', parentId: 'device', sortOrder: 3 },
  { id: 'device-alert', name: '告警管理', path: '/device/alert-manage', parentId: 'device', sortOrder: 4 },
  { id: 'device-loan', name: '设备借用', path: '/device/device-loan', parentId: 'device', sortOrder: 5 },
  { id: 'device-maintenance', name: '保养计划', path: '/device/maintenance', parentId: 'device', sortOrder: 6 },
  { id: 'device-repair', name: '故障维修', path: '/device/fault-repair', parentId: 'device', sortOrder: 7 },
  { id: 'device-damage', name: '定损评估', path: '/device/damage-assess', parentId: 'device', sortOrder: 8 },
  { id: 'device-scrapping', name: '报废管理', path: '/device/scrapping', parentId: 'device', sortOrder: 9 },
  { id: 'personnel', name: '人员资质管理', path: '/personnel', parentId: '', sortOrder: 4 },
  { id: 'personnel-dash', name: '人员总览', path: '/personnel', parentId: 'personnel', sortOrder: 1 },
  { id: 'personnel-pilot', name: '飞手档案', path: '/personnel/pilot-archive', parentId: 'personnel', sortOrder: 2 },
  { id: 'personnel-qual', name: '资质监控', path: '/personnel/qualification-monitor', parentId: 'personnel', sortOrder: 3 },
  { id: 'personnel-upgrade', name: '资质晋级', path: '/personnel/qualification-upgrade', parentId: 'personnel', sortOrder: 4 },
  { id: 'personnel-transfer', name: '飞手调配', path: '/personnel/pilot-transfer', parentId: 'personnel', sortOrder: 5 },
  { id: 'personnel-training', name: '培训管理', path: '/personnel/training', parentId: 'personnel', sortOrder: 6 },
  { id: 'personnel-tasks', name: '飞手任务', path: '/personnel/pilot-tasks', parentId: 'personnel', sortOrder: 7 },
  { id: 'personnel-resign', name: '离职管理', path: '/personnel/pilot-resignation', parentId: 'personnel', sortOrder: 8 },
  { id: 'personnel-perf', name: '绩效管理', path: '/personnel/performance', parentId: 'personnel', sortOrder: 9 },
  { id: 'mission', name: '任务调度中心', path: '/mission', parentId: '', sortOrder: 5 },
  { id: 'mission-dash', name: '任务看板', path: '/mission', parentId: 'mission', sortOrder: 1 },
  { id: 'mission-create', name: '任务创建', path: '/mission/task-create', parentId: 'mission', sortOrder: 2 },
  { id: 'mission-approval', name: '任务审批', path: '/mission/task-approval', parentId: 'mission', sortOrder: 3 },
  { id: 'mission-archive', name: '任务归档', path: '/mission/task-archive', parentId: 'mission', sortOrder: 4 },
  { id: 'mission-alert', name: '告警中心', path: '/mission/alert-center', parentId: 'mission', sortOrder: 5 },
  { id: 'mission-dispatch', name: '智能调度', path: '/mission/smart-dispatch', parentId: 'mission', sortOrder: 6 },
  { id: 'data', name: '数据智能中心', path: '/data', parentId: '', sortOrder: 6 },
  { id: 'data-mgmt', name: '数据管理', path: '/data/management', parentId: 'data', sortOrder: 1 },
  { id: 'data-stats', name: '数据统计', path: '/data/statistics', parentId: 'data', sortOrder: 2 },
  { id: 'data-raw', name: '原始素材', path: '/data/raw', parentId: 'data', sortOrder: 3 },
  { id: 'data-ortho', name: '正射影像', path: '/data/ortho', parentId: 'data', sortOrder: 4 },
  { id: 'data-dsm', name: '数字表面模型', path: '/data/dsm', parentId: 'data', sortOrder: 5 },
  { id: 'data-model3d', name: '三维模型', path: '/data/model3d', parentId: 'data', sortOrder: 6 },
  { id: 'data-business', name: '非现业务成果', path: '/data/business', parentId: 'data', sortOrder: 7 },
  { id: 'business', name: '业务应用中心', path: '/business', parentId: '', sortOrder: 7 },
  { id: 'business-traffic', name: '交通非现执法', path: '/business/traffic', parentId: 'business', sortOrder: 1 },
  { id: 'business-urban', name: '城市综合治理', path: '/business/urban', parentId: 'business', sortOrder: 2 },
  { id: 'business-emergency', name: '通用应急应用', path: '/business/emergency', parentId: 'business', sortOrder: 3 },
  { id: 'system', name: '系统支撑平台', path: '/system', parentId: '', sortOrder: 8 },
  { id: 'system-dash', name: '运维中心', path: '/system', parentId: 'system', sortOrder: 1 },
  { id: 'system-org', name: '组织管理', path: '/system/organization', parentId: 'system', sortOrder: 2 },
  { id: 'system-users', name: '用户管理', path: '/system/users', parentId: 'system', sortOrder: 3 },
  { id: 'system-roles', name: '角色管理', path: '/system/roles', parentId: 'system', sortOrder: 4 },
  { id: 'system-msg', name: '消息管理', path: '/system/messages', parentId: 'system', sortOrder: 5 },
  { id: 'system-algo', name: '算法管理', path: '/system/algorithms', parentId: 'system', sortOrder: 6 },
  { id: 'system-audit', name: '审计日志', path: '/system/audit-log', parentId: 'system', sortOrder: 7 },
  { id: 'system-api', name: '接口中心', path: '/system/api-center', parentId: 'system', sortOrder: 8 },
  { id: 'system-ip', name: 'IP白名单', path: '/system/ip-whitelist', parentId: 'system', sortOrder: 9 },
  { id: 'system-monitor', name: '服务监控', path: '/system/service-monitor', parentId: 'system', sortOrder: 10 },
  { id: 'system-menu', name: '菜单管理', path: '/system/menu-manage', parentId: 'system', sortOrder: 11 },
  { id: 'system-dict', name: '字典管理', path: '/system/dict-manage', parentId: 'system', sortOrder: 12 },
  { id: 'system-settings', name: '系统设置', path: '/system/settings', parentId: 'system', sortOrder: 13 },
];
