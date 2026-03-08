import React, { useState } from 'react';
import { Server, Cpu, HardDrive, Plus, AlertTriangle } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import { useAudit } from '@/contexts/AuditContext';

interface MicroService {
  id: string;
  name: string;
  status: string;
  endpoint: string;
  version: string;
}

interface ServerItem {
  id: string;
  name: string;
  cpuPercent: number;
  storagePercent: number;
  storageUsed: string;
  storageTotal: string;
}

interface AlertRule {
  id: string;
  target: 'cpu' | 'storage';
  operator: 'gt' | 'lt';
  value: number;
  enabled: boolean;
}

const ServiceMonitor: React.FC = () => {
  const { addLog } = useAudit();
  const [activeTab, setActiveTab] = useState<'micro' | 'server'>('micro');
  const [services, setServices] = useState<MicroService[]>([
    { id: 's1', name: 'mission-service', status: '运行中', endpoint: 'http://10.0.0.11:8080', version: '1.2.0' },
    { id: 's2', name: 'device-service', status: '运行中', endpoint: 'http://10.0.0.12:8080', version: '1.1.0' },
  ]);
  const [servers, setServers] = useState<ServerItem[]>([
    { id: 'h1', name: '应用服务器-01', cpuPercent: 45, storagePercent: 72, storageUsed: '360GB', storageTotal: '500GB' },
    { id: 'h2', name: '应用服务器-02', cpuPercent: 62, storagePercent: 88, storageTotal: '500GB', storageUsed: '440GB' },
  ]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    { id: 'r1', target: 'storage', operator: 'gt', value: 80, enabled: true },
    { id: 'r2', target: 'cpu', operator: 'gt', value: 90, enabled: true },
  ]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState({ name: '', endpoint: '', version: '' });
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [ruleForm, setRuleForm] = useState<AlertRule>({ id: '', target: 'storage', operator: 'gt', value: 80, enabled: true });

  const handleSaveService = () => {
    if (!serviceForm.name.trim()) return;
    if (editingServiceId) {
      setServices((prev) => prev.map((s) => (s.id === editingServiceId ? { ...s, ...serviceForm, status: s.status } : s)));
      addLog({ actionType: '修改', module: '服务监控', targetObject: `微服务「${serviceForm.name}」`, detailSummary: `编辑微服务：${serviceForm.name}，端点 ${serviceForm.endpoint}` });
    } else {
      setServices((prev) => [...prev, { id: `s-${Date.now()}`, ...serviceForm, status: '运行中' }]);
      addLog({ actionType: '新增', module: '服务监控', targetObject: `微服务「${serviceForm.name}」`, detailSummary: `注册微服务：${serviceForm.name}，端点 ${serviceForm.endpoint}` });
    }
    setShowServiceModal(false);
    setEditingServiceId(null);
    setServiceForm({ name: '', endpoint: '', version: '' });
  };

  const handleDeleteService = (id: string) => {
    const s = services.find((x) => x.id === id);
    if (s) addLog({ actionType: '删除', module: '服务监控', targetObject: `微服务「${s.name}」`, detailSummary: `删除微服务：${s.name}`, isHighRisk: true });
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSaveRule = () => {
    if (ruleForm.id) {
      setAlertRules((prev) => prev.map((r) => (r.id === ruleForm.id ? ruleForm : r)));
      addLog({ actionType: '修改', module: '服务监控', targetObject: '预警规则', detailSummary: `编辑预警规则：${ruleForm.target} ${ruleForm.operator} ${ruleForm.value}%` });
    } else {
      setAlertRules((prev) => [...prev, { ...ruleForm, id: `r-${Date.now()}` }]);
      addLog({ actionType: '新增', module: '服务监控', targetObject: '预警规则', detailSummary: `新增预警规则：${ruleForm.target} ${ruleForm.operator} ${ruleForm.value}%` });
    }
    setShowRuleModal(false);
    setRuleForm({ id: '', target: 'storage', operator: 'gt', value: 80, enabled: true });
  };

  const alerts = servers.flatMap((s) => {
    const out: { server: string; message: string }[] = [];
    alertRules.filter((r) => r.enabled).forEach((r) => {
      if (r.target === 'storage' && r.operator === 'gt' && s.storagePercent >= r.value) {
        out.push({ server: s.name, message: `存储占用量超过 ${r.value}%，当前 ${s.storagePercent}%` });
      }
      if (r.target === 'cpu' && r.operator === 'gt' && s.cpuPercent >= r.value) {
        out.push({ server: s.name, message: `CPU 使用率超过 ${r.value}%，当前 ${s.cpuPercent}%` });
      }
    });
    return out;
  });

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto flex flex-col pb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white tracking-wide">服务监控</h2>
          <p className="text-sm text-muted-foreground mt-1">微服务注册与运行状态、服务器硬件监控与预警规则。</p>
        </div>

        <div className="bg-card tech-border rounded-xl min-h-[500px] flex flex-col">
          <div className="flex border-b border-border px-4 bg-secondary/30 rounded-t-xl">
            <button
              onClick={() => setActiveTab('micro')}
              className={`px-5 py-4 font-medium text-sm transition border-b-2 ${
                activeTab === 'micro' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-white'
              }`}
            >
              微服务监控
            </button>
            <button
              onClick={() => setActiveTab('server')}
              className={`px-5 py-4 font-medium text-sm transition border-b-2 ${
                activeTab === 'server' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-white'
              }`}
            >
              服务器监控
            </button>
          </div>

          <div className="p-6 flex-1 bg-background/30">
            {activeTab === 'micro' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="border-l-2 border-primary pl-2 text-white font-semibold">微服务列表</h3>
                  <button
                    className="bg-primary/20 border border-primary text-primary px-3 py-1.5 rounded text-sm flex items-center"
                    onClick={() => { setEditingServiceId(null); setServiceForm({ name: '', endpoint: '', version: '' }); setShowServiceModal(true); }}
                  >
                    <Plus size={14} className="mr-1" /> 注册新微服务
                  </button>
                </div>
                <div className="border border-border rounded-lg overflow-hidden bg-background/40 text-sm">
                  <table className="w-full text-left">
                    <thead className="bg-secondary border-b border-border text-muted-foreground text-xs">
                      <tr>
                        <th className="px-4 py-2">服务名称</th>
                        <th className="px-4 py-2">状态</th>
                        <th className="px-4 py-2">端点</th>
                        <th className="px-4 py-2">版本</th>
                        <th className="px-4 py-2 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-slate-100 text-xs">
                      {services.map((s) => (
                        <tr key={s.id} className="hover:bg-secondary/40">
                          <td className="px-4 py-2 font-medium">{s.name}</td>
                          <td className="px-4 py-2"><span className="text-emerald-400">{s.status}</span></td>
                          <td className="px-4 py-2 font-mono text-muted-foreground">{s.endpoint}</td>
                          <td className="px-4 py-2">{s.version}</td>
                          <td className="px-4 py-2 text-right">
                            <button className="text-primary hover:underline mr-2" onClick={() => { setEditingServiceId(s.id); setServiceForm({ name: s.name, endpoint: s.endpoint, version: s.version }); setShowServiceModal(true); }}>编辑</button>
                            <button className="text-red-400 hover:underline" onClick={() => handleDeleteService(s.id)}>删除</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'server' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {alerts.length > 0 && (
                  <div className="border border-amber-500/40 bg-amber-500/10 rounded-lg p-4 flex items-start gap-2">
                    <AlertTriangle className="text-amber-400 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <h4 className="text-amber-200 font-semibold text-sm mb-1">预警提醒</h4>
                      <ul className="text-xs text-amber-100/90 space-y-1">
                        {alerts.map((a, i) => (
                          <li key={i}>{a.server}: {a.message}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <h3 className="border-l-2 border-primary pl-2 text-white font-semibold">服务器硬件运行情况</h3>
                  <button
                    className="bg-primary/20 border border-primary text-primary px-3 py-1.5 rounded text-sm flex items-center"
                    onClick={() => { setRuleForm({ id: '', target: 'storage', operator: 'gt', value: 80, enabled: true }); setShowRuleModal(true); }}
                  >
                    新增预警规则
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servers.map((s) => (
                    <div key={s.id} className="bg-secondary/40 border border-border rounded-lg p-4">
                      <h4 className="text-white font-medium mb-3">{s.name}</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">CPU 使用率</span>
                          <span className={s.cpuPercent >= 90 ? 'text-red-400' : ''}>{s.cpuPercent}%</span>
                        </div>
                        <div className="h-2 bg-background rounded overflow-hidden">
                          <div className="h-full bg-primary/60 rounded" style={{ width: `${s.cpuPercent}%` }} />
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="text-muted-foreground">存储占用量</span>
                          <span className={s.storagePercent >= 80 ? 'text-amber-400' : ''}>{s.storageUsed} / {s.storageTotal} ({s.storagePercent}%)</span>
                        </div>
                        <div className="h-2 bg-background rounded overflow-hidden">
                          <div className={`h-full rounded ${s.storagePercent >= 80 ? 'bg-amber-500/60' : 'bg-primary/60'}`} style={{ width: `${s.storagePercent}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-2">当前预警规则</h4>
                  <div className="border border-border rounded-lg overflow-hidden bg-background/40 text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-secondary border-b border-border text-muted-foreground">
                        <tr>
                          <th className="px-4 py-2">监控项</th>
                          <th className="px-4 py-2">条件</th>
                          <th className="px-4 py-2">阈值</th>
                          <th className="px-4 py-2">启用</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-slate-100">
                        {alertRules.map((r) => (
                          <tr key={r.id} className="hover:bg-secondary/40">
                            <td className="px-4 py-2">{r.target === 'cpu' ? 'CPU 使用率' : '存储占用量'}</td>
                            <td className="px-4 py-2">{r.operator === 'gt' ? '超过' : '低于'}</td>
                            <td className="px-4 py-2">{r.value}%</td>
                            <td className="px-4 py-2">{r.enabled ? '是' : '否'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {showServiceModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
            <div className="bg-[#050816] border border-primary/40 rounded-xl w-full max-w-md p-6 shadow-2xl text-sm">
              <h3 className="text-lg font-semibold text-white mb-4">{editingServiceId ? '编辑微服务' : '注册新微服务'}</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">服务名称</label>
                  <input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={serviceForm.name} onChange={(e) => setServiceForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">端点</label>
                  <input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs font-mono" value={serviceForm.endpoint} onChange={(e) => setServiceForm((p) => ({ ...p, endpoint: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">版本</label>
                  <input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={serviceForm.version} onChange={(e) => setServiceForm((p) => ({ ...p, version: e.target.value }))} />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white" onClick={() => setShowServiceModal(false)}>取消</button>
                <button className="px-4 py-2 rounded border border-primary bg-primary/80 text-primary-foreground" onClick={handleSaveService}>保存</button>
              </div>
            </div>
          </div>
        )}

        {showRuleModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
            <div className="bg-[#050816] border border-primary/40 rounded-xl w-full max-w-md p-6 shadow-2xl text-sm">
              <h3 className="text-lg font-semibold text-white mb-4">预警规则</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">监控项</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={ruleForm.target} onChange={(e) => setRuleForm((p) => ({ ...p, target: e.target.value as 'cpu' | 'storage' }))}>
                    <option value="storage">存储占用量</option>
                    <option value="cpu">CPU 使用率</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">条件</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={ruleForm.operator} onChange={(e) => setRuleForm((p) => ({ ...p, operator: e.target.value as 'gt' | 'lt' }))}>
                    <option value="gt">超过</option>
                    <option value="lt">低于</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">阈值 (%)</label>
                  <input type="number" min={0} max={100} className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={ruleForm.value} onChange={(e) => setRuleForm((p) => ({ ...p, value: Number(e.target.value) || 0 }))} />
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-200">
                  <input type="checkbox" className="accent-primary" checked={ruleForm.enabled} onChange={(e) => setRuleForm((p) => ({ ...p, enabled: e.target.checked }))} />
                  启用
                </label>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white" onClick={() => setShowRuleModal(false)}>取消</button>
                <button className="px-4 py-2 rounded border border-primary bg-primary/80 text-primary-foreground" onClick={handleSaveRule}>保存</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ServiceMonitor;
