/**
 * 业务应用中心 - 无人机/抓拍/违法相关类型
 */

export interface CaptureRecord {
  id: string;
  imgUrl: string;
  gps: string;
  time: string;
  algorithm: string;
  source: string;
  status: 'uploaded' | 'pending' | 'failed' | string;
}

export interface ViolationData {
  id: string;
  plate: string;
  deviceId: string;
  address: string;
  type: string;
  code: string;
  time: string;
  status: 'reported' | 'processing' | 'warned' | 'closed' | string;
}
