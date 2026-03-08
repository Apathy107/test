import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import { useAudit, type AuditLogItem } from '@/contexts/AuditContext';

type LogStatus = '成功' | '失败';

const ACTION_OPTIONS = ['新增', '修改', '删除', '查询', '导出', '登录', '权限变更'] as const;
const MODULE_OPTIONS = ['空域管理', 'API网关', '第三方推送', '用户管理', '组织管理', '算法管理', '系统设置', '菜单管理', '字典管理', 'IP白名单', '服务监控'];

const getActionTagClass = (a: string) => {
  if (a === '删除' || a === '权限变更') return 'bg-red-500/20 text-red-400 border-red-500/40';
  if (a === '新增') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
  if (a === '查询' || a === '导出') return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
  if (a === '修改') return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
  return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
};

function getTimeRange(preset: string): { from: string; to: string } {
  const now = new Date();
  const to = now.toISOString().slice(0, 19).replace('T', ' ');
  let from: string;
  if (preset === 'today') {
    from = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().slice(0, 19).replace('T', ' ');
  } else if (preset === '7d') {
    const d = new Date(now); d.setDate(d.getDate() - 7);
    from = d.toISOString().slice(0, 19).replace('T', ' ');
  } else if (preset === '30d') {
    const d = new Date(now); d.setDate(d.getDate() - 30);
    from = d.toISOString().slice(0, 19).replace('T', ' ');
  } else {
    from = '';
  }
  return { from, to };
}

const AuditLog: React.FC = () => {
  const { logs, addLog } = useAudit();
  const [timePreset, setTimePreset] = useState<string>('7d');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [filterOperator, setFilterOperator] = useState('');
  const [filterActionTypes, setFilterActionTypes] = useState<string[]>([]);
  const [filterModule, setFilterModule] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<LogStatus | ''>('');
  const [filterTarget, setFilterTarget] = useState('');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailLog, setDetailLog] = useState<AuditLogItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');

  const timeRange = useMemo(() => getTimeRange(timePreset), [timePreset]);
  const effectiveFrom = timeFrom || timeRange.from;
  const effectiveTo = timeTo || timeRange.to;

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      if (effectiveFrom && l.time < effectiveFrom) return false;
      if (effectiveTo && l.time > effectiveTo) return false;
      if (filterOperator && !l.operator.toLowerCase().includes(filterOperator.toLowerCase()) && !l.operatorId.toLowerCase().includes(filterOperator.toLowerCase())) return false;
      if (filterActionTypes.length > 0 && !filterActionTypes.includes(l.actionType)) return false;
      if (filterModule && l.module !== filterModule) return false;
      if (filterStatus && l.status !== filterStatus) return false;
      if (filterTarget && !l.targetObject.toLowerCase().includes(filterTarget.toLowerCase()) && !l.detailSummary.toLowerCase().includes(filterTarget.toLowerCase())) return false;
      return true;
    }).sort((a, b) => (b.time > a.time ? 1 : -1));
  }, [logs, effectiveFrom, effectiveTo, filterOperator, filterActionTypes, filterModule, filterStatus, filterTarget]);

  const resetFilters = () => {
    setTimePreset('7d');
    setTimeFrom('');
    setTimeTo('');
    setFilterOperator('');
    setFilterActionTypes([]);
    setFilterModule('');
    setFilterStatus('');
    setFilterTarget('');
  };

  const openDetail = (log: AuditLogItem) => {
    setDetailLog(log);
    setDrawerOpen(true);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((l) => l.id)));
  };

  const handleBatchExport = () => {
    const toExport = selectedIds.size ? filtered.filter((l) => selectedIds.has(l.id)) : filtered;
    const headers = ['操作时间', '操作人', '操作人ID', '操作类型', '操作模块', '操作对象', '操作详情', '来源IP', '状态', '事件ID'];
    const rows = toExport.map((l) => [l.time, l.operator, l.operatorId, l.actionType, l.module, l.targetObject, l.detailSummary, l.sourceIp, l.status, l.eventId]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `审计日志_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addLog({ actionType: '导出', module: '审计日志', targetObject: '审计日志', detailSummary: `批量导出审计日志，共 ${toExport.length} 条` });
  };

  const exportSingle = (log: AuditLogItem) => {
    const csv = [`事件ID,${log.eventId}`, `操作时间,${log.time}`, `操作人,${log.operator}`, `操作类型,${log.actionType}`, `操作模块,${log.module}`, `操作对象,${log.targetObject}`, `操作详情,${log.detailSummary}`, `来源IP,${log.sourceIp}`, `状态,${log.status}`].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `审计日志_${log.eventId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addLog({ actionType: '导出', module: '审计日志', targetObject: '审计日志', detailSummary: `导出单条审计日志：${log.eventId}` });
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto flex flex-col pb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white tracking-wide">审计日志</h2>
          <p className="text-sm text-muted-foreground mt-1">操作日志组合查询与详情审计，支持批量导出；日志不可篡改。</p>
        </div>

        {/* 顶部筛选区 */}
        <div className="bg-card tech-border rounded-xl border border-border overflow-hidden">
          <div className="p-4 bg-secondary/30 border-b border-border">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-muted-foreground shrink-0">时间范围 <span className="text-red-400">*</span></span>
              <div className="flex gap-2">
                {[
                  { value: 'today', label: '今天' },
                  { value: '7d', label: '最近7天' },
                  { value: '30d', label: '最近30天' },
                ].map((p) => (
                  <button key={p.value} onClick={() => setTimePreset(p.value)} className={`px-3 py-1.5 rounded text-xs border ${timePreset === p.value ? 'border-primary bg-primary/20 text-primary' : 'border-border text-muted-foreground hover:text-white'}`}>
                    {p.label}
                  </button>
                ))}
              </div>
              <input type="datetime-local" className="px-2 py-1.5 bg-background border border-border rounded text-white text-xs font-mono w-40" value={timeFrom || timeRange.from} onChange={(e) => setTimeFrom(e.target.value.slice(0, 19).replace('T', ' '))} />
              <span className="text-muted-foreground">至</span>
              <input type="datetime-local" className="px-2 py-1.5 bg-background border border-border rounded text-white text-xs font-mono w-40" value={timeTo || timeRange.to} onChange={(e) => setTimeTo(e.target.value.slice(0, 19).replace('T', ' '))} />
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <input type="text" placeholder="操作人（用户名或ID）" className="px-3 py-1.5 bg-background border border-border rounded text-white text-xs w-40" value={filterOperator} onChange={(e) => setFilterOperator(e.target.value)} />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">操作类型</span>
                <select className="px-2 py-1.5 bg-background border border-border rounded text-white text-xs max-w-[140px]" value="" onChange={(e) => { const v = e.target.value; if (v && !filterActionTypes.includes(v)) setFilterActionTypes((p) => [...p, v]); e.target.value = ''; }}>
                  <option value="">多选...</option>
                  {ACTION_OPTIONS.filter((a) => !filterActionTypes.includes(a)).map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                {filterActionTypes.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/20 text-primary text-xs border border-primary/40">
                    {a}<button type="button" className="hover:text-white" onClick={() => setFilterActionTypes((p) => p.filter((x) => x !== a))}>×</button>
                  </span>
                ))}
              </div>
              <select className="px-3 py-1.5 bg-background border border-border rounded text-white text-xs" value={filterModule} onChange={(e) => setFilterModule(e.target.value)}>
                <option value="">操作模块</option>
                {MODULE_OPTIONS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select className="px-3 py-1.5 bg-background border border-border rounded text-white text-xs" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as LogStatus | '')}>
                <option value="">操作状态</option>
                <option value="成功">成功</option>
                <option value="失败">失败</option>
              </select>
              <input type="text" placeholder="操作对象（资源名称）" className="px-3 py-1.5 bg-background border border-border rounded text-white text-xs w-36" value={filterTarget} onChange={(e) => setFilterTarget(e.target.value)} />
              <button className="px-4 py-1.5 rounded border border-primary bg-primary/20 text-primary text-xs flex items-center hover:bg-primary hover:text-primary-foreground" onClick={() => {}}>
                <Search size={14} className="mr-1" /> 搜索
              </button>
              <button className="px-3 py-1.5 rounded border border-border text-muted-foreground text-xs flex items-center hover:text-white" onClick={resetFilters}>
                <RotateCcw size={14} className="mr-1" /> 重置
              </button>
              <button className="px-3 py-1.5 rounded border border-border text-muted-foreground text-xs flex items-center" onClick={() => setAdvancedOpen(!advancedOpen)}>
                {advancedOpen ? <ChevronUp size={14} className="mr-1" /> : <ChevronDown size={14} className="mr-1" />} 高级搜索
              </button>
              <div className="ml-auto flex items-center gap-2">
                <select className="px-2 py-1.5 bg-background border border-border rounded text-white text-xs" value={exportFormat} onChange={(e) => setExportFormat(e.target.value as 'csv' | 'pdf')}>
                  <option value="csv">CSV</option>
                  <option value="pdf">PDF</option>
                </select>
                <button className="px-4 py-1.5 rounded border border-primary bg-primary/20 text-primary text-xs flex items-center" onClick={handleBatchExport}>
                  <Download size={14} className="mr-1" /> 批量导出
                </button>
              </div>
            </div>
            {advancedOpen && (
              <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                高级条件预留（如：请求路径、响应码范围、风险等级等）
              </div>
            )}
          </div>

          {/* 结果列表 */}
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary border-b border-border text-muted-foreground text-xs">
                <tr>
                  <th className="px-3 py-2 w-8"><input type="checkbox" checked={filtered.length > 0 && selectedIds.size === filtered.length} onChange={toggleSelectAll} className="accent-primary" /></th>
                  <th className="px-3 py-2">操作时间</th>
                  <th className="px-3 py-2">操作人</th>
                  <th className="px-3 py-2">操作类型</th>
                  <th className="px-3 py-2">操作模块/对象</th>
                  <th className="px-3 py-2">操作详情</th>
                  <th className="px-3 py-2">来源IP/设备</th>
                  <th className="px-3 py-2">状态</th>
                  <th className="px-3 py-2 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-slate-100 text-xs">
                {filtered.map((log) => (
                  <tr
                    key={log.id}
                    className={`hover:bg-secondary/40 cursor-pointer ${log.isHighRisk ? 'bg-red-500/5 border-l-2 border-red-500/50' : ''}`}
                    onClick={() => openDetail(log)}
                  >
                    <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={selectedIds.has(log.id)} onChange={() => toggleSelect(log.id)} className="accent-primary" />
                    </td>
                    <td className="px-3 py-2 font-mono">{log.time}</td>
                    <td className="px-3 py-2">
                      <span className="text-white">{log.operator}</span>
                      <span className="text-muted-foreground ml-1">({log.operatorId})</span>
                      {log.isHighRisk && <AlertTriangle size={12} className="inline-block ml-1 text-red-400" />}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 rounded border ${getActionTagClass(log.actionType)}`}>{log.actionType}</span>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{log.targetObject}</td>
                    <td className="px-3 py-2 max-w-[200px] truncate" title={log.detailSummary}>{log.detailSummary}</td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">{log.sourceIp} / {log.userAgent}</td>
                    <td className="px-3 py-2">
                      {log.status === '成功' ? <CheckCircle2 size={14} className="text-emerald-400 inline" /> : <XCircle size={14} className="text-red-400 inline" />}
                      <span className={log.status === '成功' ? 'text-emerald-400' : 'text-red-400'}>{log.status}</span>
                    </td>
                    <td className="px-3 py-2 text-right" onClick={(e) => e.stopPropagation()}>
                      <button className="text-primary hover:underline mr-2" onClick={() => openDetail(log)}>详情</button>
                      <button className="text-muted-foreground hover:text-white" onClick={() => exportSingle(log)}>导出</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>共 {filtered.length} 条</span>
            <span className="flex items-center gap-1"><ShieldCheck size={12} /> 日志已上链，不可篡改</span>
          </div>
        </div>
      </div>

      {/* 右侧详情抽屉 */}
      {drawerOpen && detailLog && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#050816] border-l border-primary/40 shadow-2xl overflow-y-auto flex flex-col max-h-full">
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-[#050816] z-10">
              <h3 className="text-lg font-semibold text-white">审计详情</h3>
              <button className="text-muted-foreground hover:text-white p-1" onClick={() => setDrawerOpen(false)}>×</button>
            </div>
            <div className="p-6 space-y-6 text-sm">
              {/* 基础信息区 */}
              <div className="bg-secondary/30 border border-border rounded-lg p-4">
                <h4 className="text-xs font-semibold text-primary border-b border-border pb-2 mb-3">基础信息</h4>
                <div className="space-y-2 text-xs">
                  <div><span className="text-muted-foreground">事件ID：</span><span className="font-mono text-slate-200">{detailLog.eventId}</span></div>
                  <div><span className="text-muted-foreground">操作时间：</span>{detailLog.time} {detailLog.durationMs != null && <span className="text-muted-foreground">（耗时 {detailLog.durationMs}ms）</span>}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">操作人：</span>
                    <span className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center text-[10px] text-primary">{detailLog.operator.slice(0, 1)}</span>
                    <span className="text-white">{detailLog.operator}</span>
                    <span className="text-muted-foreground">({detailLog.operatorId}) · {detailLog.department}</span>
                  </div>
                  <div><span className="text-muted-foreground">来源IP：</span>{detailLog.sourceIp}</div>
                  <div><span className="text-muted-foreground">User-Agent：</span><span className="text-slate-300">{detailLog.userAgent}</span></div>
                </div>
              </div>

              {/* 变更详情区 */}
              {detailLog.changes.length > 0 && (
                <div className="bg-secondary/30 border border-border rounded-lg p-4">
                  <h4 className="text-xs font-semibold text-primary border-b border-border pb-2 mb-3">变更详情</h4>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-muted-foreground border-b border-border">
                        <th className="text-left py-1.5">字段</th>
                        <th className="text-left py-1.5">旧值</th>
                        <th className="text-left py-1.5">新值</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-200">
                      {detailLog.changes.map((c, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="py-1.5">{c.field}</td>
                          <td className="py-1.5 text-red-300/90 line-through">{c.oldValue}</td>
                          <td className="py-1.5 text-emerald-300">{c.newValue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 上下文信息区 */}
              <div className="bg-secondary/30 border border-border rounded-lg p-4">
                <h4 className="text-xs font-semibold text-primary border-b border-border pb-2 mb-3">上下文信息</h4>
                <div className="space-y-2 text-xs font-mono">
                  <div><span className="text-muted-foreground">请求：</span><span className="text-slate-200">{detailLog.requestMethod} {detailLog.requestPath}</span></div>
                  <div><span className="text-muted-foreground">请求参数：</span><span className="text-slate-300 break-all">（敏感字段已脱敏）{detailLog.requestParams.replace(/password|secret|key|token/gi, (m) => m + ':****')}</span></div>
                  <div><span className="text-muted-foreground">响应：</span><span className="text-slate-200">{detailLog.responseCode} {detailLog.responseMessage}</span></div>
                  {detailLog.riskLevel && (
                    <div><span className="text-muted-foreground">风险等级：</span><span className={detailLog.riskLevel === '高危' ? 'text-red-400' : detailLog.riskLevel === '中危' ? 'text-amber-400' : 'text-slate-400'}>{detailLog.riskLevel}</span></div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-4 py-2 rounded border border-primary bg-primary/20 text-primary text-xs" onClick={() => exportSingle(detailLog)}>导出本条</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AuditLog;
