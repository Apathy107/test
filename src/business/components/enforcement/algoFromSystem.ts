/**
 * 与【系统支撑平台】-【算法管理】- 绑定与调度分发 中已绑定、可调度的成熟算法同步。
 * 实际项目中可从 API 或全局状态获取，此处为静态同步数据。
 */
export interface AlgoOption {
  id: string;
  name: string;
  type: "cloud" | "edge" | "air";
  enabled: boolean;
}

export const BOUND_SCHEDULED_ALGOS: AlgoOption[] = [
  { id: "a1", name: "机微型车辆追踪", type: "air", enabled: true },
  { id: "a2", name: "违停及禁停网格分析", type: "cloud", enabled: true },
  { id: "a3", name: "路口多端融合边缘推演", type: "edge", enabled: true },
];
