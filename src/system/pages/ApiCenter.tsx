import React, { useState } from 'react';
import { Plus, RefreshCw, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import { useAudit } from '@/contexts/AuditContext';

// ---------- 空域数据对接 ----------
interface DataSourceItem {
  id: string;
  name: string;
  type: string;
  protocol: string;
  syncFreq: string;
  lastSyncTime: string;
  status: 'normal' | 'error';
  detail?: string;
}

// ---------- 第三方推送 ----------
type PushChannelType = 'grid' | 'police' | 'other';
interface PushChannel {
  id: string;
  type: PushChannelType;
  name: string;
  url: string;
  format: 'JSON' | 'XML';
  enabled: boolean;
  lastPushTime: string;
}

// ---------- API 网关 ----------
interface GatewayApp {
  id: string;
  name: string;
  appKey: string;
  owner: string;
  status: 'normal' | 'frozen';
  createdAt: string;
}

const ApiCenter: React.FC = () => {
  const { addLog } = useAudit();
  const [activeTab, setActiveTab] = useState<'airspace' | 'push' | 'gateway'>('airspace');

  // 空域数据对接
  const [dataSources, setDataSources] = useState<DataSourceItem[]>([
    { id: '1', name: '民航局空域数据', type: '民航局', protocol: 'HTTPS', syncFreq: '每15分钟', lastSyncTime: '2024-03-06 10:30:00', status: 'normal', detail: '边界范围: 东经116°-118°，北纬39°-41°' },
    { id: '2', name: '空军管制区', type: '空军', protocol: 'FTP', syncFreq: '每日00:00', lastSyncTime: '2024-03-05 00:02:15', status: 'error', detail: '最近一次同步超时' },
  ]);
  const [syncStatus, setSyncStatus] = useState<{ lastTime: string; success: boolean }>({ lastTime: '2024-03-06 10:30:00', success: true });
  const [expandedSourceId, setExpandedSourceId] = useState<string | null>(null);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);
  const [sourceForm, setSourceForm] = useState({
    name: '',
    type: '民航局',
    ip: '',
    port: '',
    account: '',
    password: '',
    cert: '',
    syncMode: 'full' as 'full' | 'increment',
    cronExpr: '0 */15 * * * ?',
  });

  // 第三方推送配置
  const [pushTypeTab, setPushTypeTab] = useState<PushChannelType | 'all'>('all');
  const [channels, setChannels] = useState<PushChannel[]>([
    { id: 'c1', type: 'grid', name: '城市网格化平台', url: 'https://grid.city.gov/webhook', format: 'JSON', enabled: true, lastPushTime: '2024-03-06 10:28:00' },
    { id: 'c2', type: 'police', name: '110接处警系统', url: 'https://110.api.gov/push', format: 'XML', enabled: true, lastPushTime: '2024-03-06 09:15:00' },
    { id: 'c3', type: 'other', name: '应急指挥中心', url: 'https://emergency.gov/callback', format: 'JSON', enabled: false, lastPushTime: '-' },
  ]);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [editingChannelId, setEditingChannelId] = useState<string | null>(null);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [channelForm, setChannelForm] = useState({
    name: '',
    type: 'grid' as PushChannelType,
    webhookUrl: '',
    format: 'JSON' as 'JSON' | 'XML',
    authType: 'apikey' as 'apikey' | 'oauth2' | 'basic',
    apiKey: '',
    headers: '',
    retryCount: 3,
    retryInterval: 5,
    templateAlarm: '{"event":"alarm","data":{}}',
    templateTakeoff: '{"event":"takeoff","data":{}}',
    templateLand: '{"event":"land","data":{}}',
  });

  // API 网关管理
  const [gatewayApps, setGatewayApps] = useState<GatewayApp[]>([
    { id: 'a1', name: '综合指挥大屏', appKey: 'ak_****8f2a', owner: '指挥中心', status: 'normal', createdAt: '2024-01-10' },
    { id: 'a2', name: '交警支队接口', appKey: 'ak_****3b1c', owner: '交警部门', status: 'normal', createdAt: '2024-02-01' },
  ]);
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState<'all' | 'normal' | 'frozen'>('all');
  const [showPermDrawer, setShowPermDrawer] = useState(false);
  const [permAppId, setPermAppId] = useState<string | null>(null);
  const [apiList] = useState([{ id: 'api1', name: '视频流拉取', limit: 100 }, { id: 'api2', name: '实时位置', limit: 200 }, { id: 'api3', name: '任务下发', limit: 50 }]);
  const [appPerms, setAppPerms] = useState<Record<string, { enabled: boolean; limit: number }>>({ api1: { enabled: true, limit: 100 }, api2: { enabled: true, limit: 200 }, api3: { enabled: false, limit: 50 } });

  const filteredChannels = pushTypeTab === 'all' ? channels : channels.filter((c) => c.type === pushTypeTab);
  const filteredApps = gatewayApps.filter((a) => {
    if (appSearch && !a.name.toLowerCase().includes(appSearch.toLowerCase())) return false;
    if (appStatusFilter === 'normal' && a.status !== 'normal') return false;
    if (appStatusFilter === 'frozen' && a.status !== 'frozen') return false;
    return true;
  });
  const selectedChannel = channels.find((c) => c.id === selectedChannelId);

  const openSourceEdit = (item?: DataSourceItem) => {
    if (item) {
      setEditingSourceId(item.id);
      setSourceForm({ name: item.name, type: item.type, ip: '', port: '', account: '', password: '', cert: '', syncMode: 'full', cronExpr: '0 */15 * * * ?' });
    } else {
      setEditingSourceId(null);
      setSourceForm({ name: '', type: '民航局', ip: '', port: '', account: '', password: '', cert: '', syncMode: 'full', cronExpr: '0 */15 * * * ?' });
    }
    setShowSourceModal(true);
  };

  const saveSource = () => {
    if (!sourceForm.name.trim()) return;
    if (editingSourceId) {
      setDataSources((prev) => prev.map((s) => (s.id === editingSourceId ? { ...s, name: sourceForm.name, type: sourceForm.type } : s)));
      addLog({ actionType: '修改', module: '空域管理', targetObject: `数据源「${sourceForm.name}」`, detailSummary: `编辑空域数据源：${sourceForm.name}（${sourceForm.type}）` });
    } else {
      setDataSources((prev) => [...prev, { id: `ds-${Date.now()}`, name: sourceForm.name, type: sourceForm.type, protocol: 'HTTPS', syncFreq: '每15分钟', lastSyncTime: '-', status: 'normal' }]);
      addLog({ actionType: '新增', module: '空域管理', targetObject: `数据源「${sourceForm.name}」`, detailSummary: `新增空域数据源：${sourceForm.name}（${sourceForm.type}）` });
    }
    setShowSourceModal(false);
  };

  const deleteSource = (row: DataSourceItem) => {
    addLog({ actionType: '删除', module: '空域管理', targetObject: `数据源「${row.name}」`, detailSummary: `删除数据源：${row.name}`, isHighRisk: true });
    setDataSources((p) => p.filter((s) => s.id !== row.id));
  };

  const openChannelEdit = (c?: PushChannel) => {
    if (c) {
      setEditingChannelId(c.id);
      setChannelForm({ ...channelForm, name: c.name, type: c.type, webhookUrl: c.url, format: c.format });
    } else {
      setEditingChannelId(null);
      setChannelForm({ name: '', type: 'grid', webhookUrl: '', format: 'JSON', authType: 'apikey', apiKey: '', headers: '', retryCount: 3, retryInterval: 5, templateAlarm: '{"event":"alarm","data":{}}', templateTakeoff: '{"event":"takeoff","data":{}}', templateLand: '{"event":"land","data":{}}' });
    }
    setShowChannelModal(true);
  };

  const saveChannel = () => {
    if (!channelForm.name.trim() || !channelForm.webhookUrl.trim()) return;
    if (editingChannelId) {
      setChannels((prev) => prev.map((c) => (c.id === editingChannelId ? { ...c, name: channelForm.name, type: channelForm.type, url: channelForm.webhookUrl, format: channelForm.format } : c)));
      addLog({ actionType: '修改', module: '第三方推送', targetObject: `推送通道「${channelForm.name}」`, detailSummary: `编辑推送通道：${channelForm.name}` });
    } else {
      setChannels((prev) => [...prev, { id: `ch-${Date.now()}`, type: channelForm.type, name: channelForm.name, url: channelForm.webhookUrl, format: channelForm.format, enabled: true, lastPushTime: '-' }]);
      addLog({ actionType: '新增', module: '第三方推送', targetObject: `推送通道「${channelForm.name}」`, detailSummary: `创建推送通道：${channelForm.name}，地址 ${channelForm.webhookUrl}` });
    }
    setShowChannelModal(false);
    setEditingChannelId(null);
  };

  const openPermDrawer = (appId: string) => {
    setPermAppId(appId);
    setShowPermDrawer(true);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto flex flex-col pb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white tracking-wide">接口中心</h2>
          <p className="text-sm text-muted-foreground mt-1">空域数据对接、第三方推送配置与 API 网关管理。</p>
        </div>

        <div className="bg-card tech-border rounded-xl min-h-[600px] flex flex-col">
          <div className="flex border-b border-border px-4 bg-secondary/30 rounded-t-xl">
            <button onClick={() => setActiveTab('airspace')} className={`px-5 py-4 font-medium text-sm transition border-b-2 ${activeTab === 'airspace' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-white'}`}>
              空域数据对接
            </button>
            <button onClick={() => setActiveTab('push')} className={`px-5 py-4 font-medium text-sm transition border-b-2 ${activeTab === 'push' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-white'}`}>
              第三方推送配置
            </button>
            <button onClick={() => setActiveTab('gateway')} className={`px-5 py-4 font-medium text-sm transition border-b-2 ${activeTab === 'gateway' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-white'}`}>
              API 网关管理
            </button>
          </div>

          <div className="p-6 flex-1 bg-background/30">
            {/* ========== 空域数据对接 ========== */}
            {activeTab === 'airspace' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button className="bg-primary/20 border border-primary text-primary px-4 py-2 rounded text-sm flex items-center hover:bg-primary hover:text-primary-foreground" onClick={() => openSourceEdit()}>
                      <Plus size={16} className="mr-2" /> 新增数据源
                    </button>
                    <button className="border border-border text-slate-200 px-4 py-2 rounded text-sm flex items-center hover:bg-secondary" onClick={() => { addLog({ actionType: '执行', module: '空域管理', targetObject: '空域数据', detailSummary: '手动触发空域数据同步' }); setSyncStatus((s) => ({ ...s, lastTime: new Date().toLocaleString('sv-SE').replace('T', ' ') })); }}>
                      <RefreshCw size={16} className="mr-2" /> 手动同步
                    </button>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border rounded px-3 py-1.5 bg-background/60">
                      <span>同步状态：</span>
                      <span className={syncStatus.success ? 'text-emerald-400' : 'text-red-400'}>{syncStatus.success ? '成功' : '失败'}</span>
                      <span>上次同步：{syncStatus.lastTime}</span>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-lg overflow-hidden bg-background/40 text-sm">
                  <table className="w-full text-left">
                    <thead className="bg-secondary border-b border-border text-muted-foreground text-xs">
                      <tr>
                        <th className="px-3 py-2 w-8" />
                        <th className="px-3 py-2">数据源名称</th>
                        <th className="px-3 py-2">对接协议</th>
                        <th className="px-3 py-2">同步频率</th>
                        <th className="px-3 py-2">最后同步时间</th>
                        <th className="px-3 py-2">状态</th>
                        <th className="px-3 py-2 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-slate-100 text-xs">
                      {dataSources.map((row) => (
                        <React.Fragment key={row.id}>
                          <tr className="hover:bg-secondary/40">
                            <td className="px-3 py-2">
                              <button type="button" onClick={() => setExpandedSourceId(expandedSourceId === row.id ? null : row.id)} className="text-muted-foreground">
                                {expandedSourceId === row.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </button>
                            </td>
                            <td className="px-3 py-2 font-medium">{row.name}</td>
                            <td className="px-3 py-2 font-mono">{row.protocol}</td>
                            <td className="px-3 py-2">{row.syncFreq}</td>
                            <td className="px-3 py-2 font-mono text-muted-foreground">{row.lastSyncTime}</td>
                            <td className="px-3 py-2">
                              <span className={row.status === 'normal' ? 'text-emerald-400' : 'text-red-400'}>{row.status === 'normal' ? '正常' : '异常'}</span>
                            </td>
                            <td className="px-3 py-2 text-right">
                              <button className="text-primary hover:underline mr-2" onClick={() => openSourceEdit(row)}>编辑</button>
                              <button className="text-red-400 hover:underline mr-2" onClick={() => deleteSource(row)}>删除</button>
                              <button className="text-muted-foreground hover:text-white" onClick={() => setExpandedSourceId(expandedSourceId === row.id ? null : row.id)}>查看日志</button>
                            </td>
                          </tr>
                          {expandedSourceId === row.id && (
                            <tr className="bg-secondary/30">
                              <td colSpan={7} className="px-4 py-3 text-muted-foreground text-xs">
                                {row.detail || '暂无边界数据或日志'}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========== 第三方推送配置 ========== */}
            {activeTab === 'push' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {(['all', 'grid', 'police', 'other'] as const).map((t) => (
                      <button key={t} onClick={() => setPushTypeTab(t)} className={`px-3 py-1.5 rounded text-xs border ${pushTypeTab === t ? 'border-primary bg-primary/20 text-primary' : 'border-border text-muted-foreground hover:text-white'}`}>
                        {t === 'all' ? '全部' : t === 'grid' ? '城市网格化' : t === 'police' ? '110接处警' : '其他'}
                      </button>
                    ))}
                  </div>
                  <button className="bg-primary/20 border border-primary text-primary px-4 py-2 rounded text-sm flex items-center" onClick={() => openChannelEdit()}>
                    <Plus size={16} className="mr-2" /> 创建推送通道
                  </button>
                </div>

                <div className="flex gap-6">
                  <div className="flex-1 border border-border rounded-lg overflow-hidden bg-background/40">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-secondary border-b border-border text-muted-foreground">
                        <tr>
                          <th className="px-3 py-2">接入方名称</th>
                          <th className="px-3 py-2">推送地址</th>
                          <th className="px-3 py-2">数据格式</th>
                          <th className="px-3 py-2">状态</th>
                          <th className="px-3 py-2">最后推送时间</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-slate-100">
                        {filteredChannels.map((c) => (
                          <tr key={c.id} className={`hover:bg-secondary/40 cursor-pointer ${selectedChannelId === c.id ? 'bg-primary/10' : ''}`} onClick={() => setSelectedChannelId(c.id)}>
                            <td className="px-3 py-2 font-medium">{c.name}</td>
                            <td className="px-3 py-2 font-mono text-muted-foreground truncate max-w-[180px]">{c.url}</td>
                            <td className="px-3 py-2">{c.format}</td>
                            <td className="px-3 py-2">{c.enabled ? <span className="text-emerald-400">启用</span> : <span className="text-slate-500">禁用</span>}</td>
                            <td className="px-3 py-2 font-mono text-muted-foreground">{c.lastPushTime}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {selectedChannel && (
                    <div className="w-[360px] border border-border rounded-lg bg-background/60 p-4 text-xs space-y-4 overflow-y-auto max-h-[400px]">
                      <h4 className="text-white font-semibold border-b border-border pb-2">配置详情</h4>
                      <div>
                        <span className="text-muted-foreground">目标系统 / Webhook：</span>
                        <p className="text-slate-200 font-mono mt-0.5 break-all">{selectedChannel.url}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">认证方式：</span>
                        <p className="text-slate-200 mt-0.5">API Key / OAuth2 / Basic Auth 配置区</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">消息模板（报警/起飞/降落）：</span>
                        <pre className="mt-1 p-2 bg-background rounded border border-border text-[11px] text-slate-300 overflow-x-auto">{"{ \"event\": \"alarm\", \"data\": {} }"}</pre>
                      </div>
                      <div>
                        <span className="text-muted-foreground">重试机制：</span>
                        <p className="text-slate-200 mt-0.5">失败重试 3 次，间隔 5 秒</p>
                      </div>
                      <button className="text-primary hover:underline" onClick={() => openChannelEdit(selectedChannel)}>编辑此通道</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========== API 网关管理 ========== */}
            {activeTab === 'gateway' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-secondary/40 border border-border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">12,580</div>
                    <div className="text-xs text-muted-foreground mt-1">今日调用量</div>
                  </div>
                  <div className="bg-secondary/40 border border-border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">1,256,000</div>
                    <div className="text-xs text-muted-foreground mt-1">总调用次数</div>
                  </div>
                  <div className="bg-secondary/40 border border-border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-400">8</div>
                    <div className="text-xs text-muted-foreground mt-1">在线应用数</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a href="/api-docs" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 rounded border border-primary bg-primary/20 text-primary text-sm hover:bg-primary hover:text-primary-foreground">
                    <BookOpen size={16} className="mr-2" /> 查看 API 文档
                  </a>
                  <input type="text" placeholder="按应用名称搜索" className="px-3 py-1.5 bg-background border border-border rounded text-white text-xs w-40" value={appSearch} onChange={(e) => setAppSearch(e.target.value)} />
                  <select className="px-3 py-1.5 bg-background border border-border rounded text-white text-xs" value={appStatusFilter} onChange={(e) => setAppStatusFilter(e.target.value as 'all' | 'normal' | 'frozen')}>
                    <option value="all">全部状态</option>
                    <option value="normal">正常</option>
                    <option value="frozen">冻结</option>
                  </select>
                </div>

                <div className="border border-border rounded-lg overflow-hidden bg-background/40 text-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-secondary border-b border-border text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2">应用名称</th>
                        <th className="px-4 py-2">AppKey</th>
                        <th className="px-4 py-2">拥有者/部门</th>
                        <th className="px-4 py-2">状态</th>
                        <th className="px-4 py-2">创建时间</th>
                        <th className="px-4 py-2 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-slate-100">
                      {filteredApps.map((app) => (
                        <tr key={app.id} className="hover:bg-secondary/40">
                          <td className="px-4 py-2 font-medium">{app.name}</td>
                          <td className="px-4 py-2 font-mono text-muted-foreground">{app.appKey}</td>
                          <td className="px-4 py-2">{app.owner}</td>
                          <td className="px-4 py-2">{app.status === 'normal' ? <span className="text-emerald-400">正常</span> : <span className="text-amber-400">冻结</span>}</td>
                          <td className="px-4 py-2">{app.createdAt}</td>
                          <td className="px-4 py-2 text-right">
                            <button className="text-primary hover:underline mr-2" onClick={() => openPermDrawer(app.id)}>查看详情</button>
                            <button className="text-muted-foreground hover:text-white mr-2">重置密钥</button>
                            <button className="text-amber-400 hover:underline">冻结</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 数据源 新增/编辑 模态框 */}
      {showSourceModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
          <div className="bg-[#050816] border border-primary/40 rounded-xl w-full max-w-lg p-6 shadow-2xl text-sm max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">{editingSourceId ? '编辑数据源' : '新增数据源'}</h3>
            <div className="space-y-4">
              <h4 className="text-xs text-primary font-semibold border-l-2 border-primary pl-2">基础配置</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">数据源名称</label>
                  <input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={sourceForm.name} onChange={(e) => setSourceForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">类型</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={sourceForm.type} onChange={(e) => setSourceForm((p) => ({ ...p, type: e.target.value }))}>
                    <option>民航局</option>
                    <option>空军</option>
                  </select>
                </div>
              </div>
              <h4 className="text-xs text-primary font-semibold border-l-2 border-primary pl-2 mt-3">连接配置</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">IP 地址</label>
                  <input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs font-mono" value={sourceForm.ip} onChange={(e) => setSourceForm((p) => ({ ...p, ip: e.target.value }))} placeholder="192.168.1.1" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">端口</label>
                  <input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={sourceForm.port} onChange={(e) => setSourceForm((p) => ({ ...p, port: e.target.value }))} placeholder="443" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-muted-foreground mb-1">认证账号 / 密码</label>
                  <div className="flex gap-2">
                    <input className="flex-1 px-3 py-2 bg-background border border-border rounded text-white text-xs" placeholder="账号" value={sourceForm.account} onChange={(e) => setSourceForm((p) => ({ ...p, account: e.target.value }))} />
                    <input type="password" className="flex-1 px-3 py-2 bg-background border border-border rounded text-white text-xs" placeholder="密码" value={sourceForm.password} onChange={(e) => setSourceForm((p) => ({ ...p, password: e.target.value }))} />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-muted-foreground mb-1">证书上传</label>
                  <input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" placeholder="选择文件或粘贴路径" value={sourceForm.cert} onChange={(e) => setSourceForm((p) => ({ ...p, cert: e.target.value }))} />
                </div>
              </div>
              <h4 className="text-xs text-primary font-semibold border-l-2 border-primary pl-2 mt-3">同步策略</h4>
              <div className="space-y-2">
                <div className="flex gap-3 text-xs text-slate-200">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="syncMode" checked={sourceForm.syncMode === 'full'} onChange={() => setSourceForm((p) => ({ ...p, syncMode: 'full' }))} className="accent-primary" />
                    全量同步
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="syncMode" checked={sourceForm.syncMode === 'increment'} onChange={() => setSourceForm((p) => ({ ...p, syncMode: 'increment' }))} className="accent-primary" />
                    增量同步
                  </label>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">定时任务（Cron 表达式）</label>
                  <input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs font-mono" value={sourceForm.cronExpr} onChange={(e) => setSourceForm((p) => ({ ...p, cronExpr: e.target.value }))} placeholder="0 */15 * * * ?" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white" onClick={() => setShowSourceModal(false)}>取消</button>
              <button className="px-4 py-2 rounded border border-primary bg-primary/80 text-primary-foreground" onClick={saveSource}>保存</button>
            </div>
          </div>
        </div>
      )}

      {/* 推送通道 新增/编辑 模态框 */}
      {showChannelModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
          <div className="bg-[#050816] border border-primary/40 rounded-xl w-full max-w-2xl p-6 shadow-2xl text-sm max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">{editingChannelId ? '编辑推送通道' : '创建推送通道'}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">目标系统名称</label>
                  <input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={channelForm.name} onChange={(e) => setChannelForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Webhook 地址</label>
                  <input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs font-mono" value={channelForm.webhookUrl} onChange={(e) => setChannelForm((p) => ({ ...p, webhookUrl: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">数据格式</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={channelForm.format} onChange={(e) => setChannelForm((p) => ({ ...p, format: e.target.value as 'JSON' | 'XML' }))}>
                    <option value="JSON">JSON</option>
                    <option value="XML">XML</option>
                  </select>
                </div>
              </div>
              <h4 className="text-xs text-primary font-semibold border-l-2 border-primary pl-2">认证方式</h4>
              <div className="flex gap-3 text-xs">
                {(['apikey', 'oauth2', 'basic'] as const).map((t) => (
                  <label key={t} className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" checked={channelForm.authType === t} onChange={() => setChannelForm((p) => ({ ...p, authType: t }))} className="accent-primary" />
                    {t === 'apikey' ? 'API Key' : t === 'oauth2' ? 'OAuth2.0' : 'Basic Auth'}
                  </label>
                ))}
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">请求头（Headers）</label>
                <textarea rows={2} className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs font-mono resize-none" value={channelForm.headers} onChange={(e) => setChannelForm((p) => ({ ...p, headers: e.target.value }))} placeholder="Content-Type: application/json" />
              </div>
              <h4 className="text-xs text-primary font-semibold border-l-2 border-primary pl-2">消息模板</h4>
              <div className="space-y-2">
                {(['templateAlarm', 'templateTakeoff', 'templateLand'] as const).map((key, i) => (
                  <div key={key}>
                    <label className="block text-xs text-muted-foreground mb-1">{['报警', '起飞', '降落'][i]} 事件</label>
                    <textarea rows={2} className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs font-mono resize-none" value={channelForm[key]} onChange={(e) => setChannelForm((p) => ({ ...p, [key]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <h4 className="text-xs text-primary font-semibold border-l-2 border-primary pl-2">重试机制</h4>
              <div className="flex gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">失败重试次数</label>
                  <input type="number" min={0} className="w-20 px-3 py-2 bg-background border border-border rounded text-white text-xs" value={channelForm.retryCount} onChange={(e) => setChannelForm((p) => ({ ...p, retryCount: Number(e.target.value) || 0 }))} />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">间隔时间（秒）</label>
                  <input type="number" min={0} className="w-20 px-3 py-2 bg-background border border-border rounded text-white text-xs" value={channelForm.retryInterval} onChange={(e) => setChannelForm((p) => ({ ...p, retryInterval: Number(e.target.value) || 0 }))} />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white" onClick={() => setShowChannelModal(false)}>取消</button>
              <button className="px-4 py-2 rounded border border-primary bg-primary/80 text-primary-foreground" onClick={saveChannel}>保存</button>
            </div>
          </div>
        </div>
      )}

      {/* 接口权限 抽屉 */}
      {showPermDrawer && permAppId && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPermDrawer(false)} />
          <div className="relative w-full max-w-md bg-[#050816] border-l border-primary/40 shadow-2xl p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">接口权限管理</h3>
            <p className="text-xs text-muted-foreground mb-4">为选中的应用分配可访问的接口及调用频率限制。</p>
            <div className="space-y-3">
              {apiList.map((api) => (
                <div key={api.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-background/40">
                  <div>
                    <div className="text-white font-medium text-sm">{api.name}</div>
                    <div className="text-xs text-muted-foreground">限制：{appPerms[api.id]?.limit ?? api.limit} 次/分钟</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-xs cursor-pointer">
                      <input type="checkbox" checked={appPerms[api.id]?.enabled ?? false} onChange={(e) => setAppPerms((p) => ({ ...p, [api.id]: { ...p[api.id], enabled: e.target.checked, limit: p[api.id]?.limit ?? api.limit } }))} className="accent-primary" />
                      启用
                    </label>
                    <input type="number" min={1} className="w-16 px-2 py-1 bg-background border border-border rounded text-white text-xs" value={appPerms[api.id]?.limit ?? api.limit} onChange={(e) => setAppPerms((p) => ({ ...p, [api.id]: { ...p[api.id], enabled: p[api.id]?.enabled ?? false, limit: Number(e.target.value) || 100 } }))} />
                    <span className="text-xs text-muted-foreground">/分钟</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button className="px-4 py-2 rounded border border-primary bg-primary/80 text-primary-foreground text-sm" onClick={() => setShowPermDrawer(false)}>完成</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ApiCenter;
