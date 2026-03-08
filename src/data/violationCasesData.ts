/**
 * 交通非现执法 - 违法成果 共享数据，供【业务应用中心-交通非现执法-违法成果】与【数据智能中心-非现业务成果】同步使用
 */
export type DataSourceType = '自动化抓拍' | '半自动化抓拍' | '人工抓拍';
export type CaseType = '预警' | '执法';

export interface ViolationCaseRecord {
  id: string;
  caseNo: string;
  type: string;
  violationCode: string;
  location: string;
  /** 违法时间（时分秒） */
  time: string;
  /** 违法日期（用于时间段筛选，格式 YYYY-MM-DD） */
  date?: string;
  plate: string;
  evidence: number;
  status: 'submitted' | 'unsubmitted';
  algo: string;
  thumb?: string;
  sectionCode?: string;
  roadCode?: string;
  caseType?: CaseType;
  region?: string;
  dataSource?: DataSourceType;
  uploadStatus?: string;
}

export const violationCasesList: ViolationCaseRecord[] = [
  { id: '1', caseNo: 'VIO-2025-0711-001', type: '违规停车', violationCode: '1039', location: '主干道东段 K2+300', time: '09:15:32', date: '2025-07-11', plate: '浙A·12345', evidence: 3, status: 'submitted', algo: '车辆识别', sectionCode: 'S001', roadCode: 'R002', caseType: '执法', region: '杭州市西湖区', dataSource: '自动化抓拍', uploadStatus: '已上传' },
  { id: '2', caseNo: 'VIO-2025-0711-002', type: '闯红灯', violationCode: '1625', location: '环城北路交叉口', time: '09:25:08', date: '2025-07-11', plate: '浙B·67890', evidence: 2, status: 'submitted', algo: '车辆识别', sectionCode: 'S002', roadCode: 'R001', caseType: '执法', region: '杭州市西湖区', dataSource: '自动化抓拍', uploadStatus: '已上传' },
  { id: '3', caseNo: 'VIO-2025-0711-003', type: '行人违规', violationCode: '3001', location: '商业区西门', time: '09:18:44', date: '2025-07-10', plate: '—', evidence: 1, status: 'unsubmitted', algo: '人员识别', sectionCode: 'S003', roadCode: 'R003', caseType: '预警', region: '杭州市滨江区', dataSource: '半自动化抓拍', uploadStatus: '未上传' },
  { id: '4', caseNo: 'VIO-2025-0711-004', type: '非法焚烧', violationCode: '6002', location: '工业园区B区', time: '09:31:27', date: '2025-07-12', plate: '—', evidence: 4, status: 'unsubmitted', algo: '烟火检测', sectionCode: 'S004', roadCode: 'R005', caseType: '预警', region: '杭州市萧山区', dataSource: '人工抓拍', uploadStatus: '未上传' },
  { id: '5', caseNo: 'VIO-2025-0711-005', type: '非法占道', violationCode: '1042', location: '步行街南段', time: '09:28:53', date: '2025-07-11', plate: '—', evidence: 2, status: 'unsubmitted', algo: '人员识别', sectionCode: 'S005', roadCode: 'R004', caseType: '执法', region: '杭州市上城区', dataSource: '人工抓拍', uploadStatus: '未上传' },
];
