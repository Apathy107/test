/**
 * 人员指标数据 - 与【人员资质管理】同步
 * 人员资质管理 Dashboard 的统计与证书分布来源于此；综合指挥中心「人员指标」+ 飞手资质
 */
export interface PersonnelMetrics {
  total: number;
  onDuty: number;
  offDuty: number;
  trend: number;
  /** 有效持证飞手 */
  certified: number;
  /** 冻结派单飞手 */
  frozen: number;
  /** 本月证书到期 */
  certExpiringThisMonth: number;
  /** 本月培训完成人次 */
  trainingCompletedThisMonth: number;
}

/** 飞手资质指标（与人员资质管理「证书类型分布」一致） */
export interface PilotQualificationMetrics {
  vlos: number;       // 视距内执照 (VLOS)
  bvlos: number;     // 超视距执照 (BVLOS)
  instructor: number; // 教员执照
  agriculture: number; // 农业植保专项
  certifiedTotal: number; // 持证总人数（用于比例）
}

export const personnelMetrics: PersonnelMetrics = {
  total: 128,
  onDuty: 104,
  offDuty: 24,
  trend: 12,
  certified: 104,
  frozen: 3,
  certExpiringThisMonth: 12,
  trainingCompletedThisMonth: 24,
};

export const pilotQualificationMetrics: PilotQualificationMetrics = {
  vlos: 68,
  bvlos: 42,
  instructor: 18,
  agriculture: 25,
  certifiedTotal: 104,
};
