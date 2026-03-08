import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'audit_log_entries';
const MAX_ITEMS = 2000;

export type ActionType = '新增' | '修改' | '删除' | '查询' | '导出' | '登录' | '权限变更';
export type ModuleType = '空域管理' | 'API网关' | '第三方推送' | '用户管理' | '组织管理' | '算法管理' | '系统设置' | '菜单管理' | '字典管理' | 'IP白名单' | '服务监控' | '组织管理';

export interface ChangeItem {
  field: string;
  oldValue: string;
  newValue: string;
}

export interface AuditLogItem {
  id: string;
  eventId: string;
  time: string;
  durationMs?: number;
  operator: string;
  operatorId: string;
  department: string;
  actionType: string;
  module: string;
  targetObject: string;
  detailSummary: string;
  sourceIp: string;
  userAgent: string;
  status: '成功' | '失败';
  isHighRisk: boolean;
  changes: ChangeItem[];
  requestMethod: string;
  requestPath: string;
  requestParams: string;
  responseCode: number;
  responseMessage: string;
  riskLevel?: string;
}

export interface AuditLogPayload {
  actionType: string;
  module: string;
  targetObject: string;
  detailSummary: string;
  operator?: string;
  operatorId?: string;
  department?: string;
  status?: '成功' | '失败';
  isHighRisk?: boolean;
  changes?: ChangeItem[];
  requestMethod?: string;
  requestPath?: string;
  requestParams?: string;
  responseCode?: number;
  responseMessage?: string;
  riskLevel?: string;
  durationMs?: number;
}

function nowStr() {
  const d = new Date();
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

function createEventId() {
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function defaultSeed(): AuditLogItem[] {
  const t = nowStr();
  return [
    { id: 'seed-1', eventId: 'evt-seed-001', time: t, operator: '系统', operatorId: 'sys', department: '-', actionType: '登录', module: '用户管理', targetObject: '-', detailSummary: '审计日志已启用，后续操作将自动记录', sourceIp: '-', userAgent: '-', status: '成功', isHighRisk: false, changes: [], requestMethod: '-', requestPath: '-', requestParams: '-', responseCode: 200, responseMessage: 'OK' },
  ];
}

function loadFromStorage(): AuditLogItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : defaultSeed();
    }
  } catch (_) {}
  return defaultSeed();
}

function saveToStorage(items: AuditLogItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch (_) {}
}

const defaultOperator = { operator: '当前用户', operatorId: 'local', department: '系统' };

interface AuditContextValue {
  logs: AuditLogItem[];
  addLog: (payload: AuditLogPayload) => void;
}

const AuditContext = createContext<AuditContextValue | null>(null);

export function AuditProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<AuditLogItem[]>(() => loadFromStorage());

  useEffect(() => {
    saveToStorage(logs);
  }, [logs]);

  const addLog = useCallback((payload: AuditLogPayload) => {
    const time = nowStr();
    const entry: AuditLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      eventId: createEventId(),
      time,
      durationMs: payload.durationMs,
      operator: payload.operator ?? defaultOperator.operator,
      operatorId: payload.operatorId ?? defaultOperator.operatorId,
      department: payload.department ?? defaultOperator.department,
      actionType: payload.actionType,
      module: payload.module,
      targetObject: payload.targetObject,
      detailSummary: payload.detailSummary,
      sourceIp: typeof window !== 'undefined' && navigator.userAgent ? '-' : '-',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '-',
      status: payload.status ?? '成功',
      isHighRisk: payload.isHighRisk ?? (payload.actionType === '删除' || payload.actionType === '权限变更'),
      changes: payload.changes ?? [],
      requestMethod: payload.requestMethod ?? '-',
      requestPath: payload.requestPath ?? '-',
      requestParams: payload.requestParams ?? '-',
      responseCode: payload.responseCode ?? 200,
      responseMessage: payload.responseMessage ?? 'OK',
      riskLevel: payload.riskLevel,
    };
    setLogs((prev) => [entry, ...prev].slice(0, MAX_ITEMS));
  }, []);

  return (
    <AuditContext.Provider value={{ logs, addLog }}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const ctx = useContext(AuditContext);
  if (!ctx) throw new Error('useAudit must be used within AuditProvider');
  return ctx;
}
