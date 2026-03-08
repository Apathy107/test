import React, { useState } from 'react';
import {
  Server,
  Activity,
  Database,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Copy,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Check,
} from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import { useAudit } from '@/contexts/AuditContext';

type AlgoType = 'cloud' | 'edge' | 'air';
type AlertMethod = 'video' | 'frame';

interface FieldConfigItem {
  field: string;
  enumValues: string;
}

type StrategyType = 'evidence' | 'traffic' | 'custom';

interface Strategy {
  id: string;
  name: string;
  description: string;
  strategyType: StrategyType;
  enabled: boolean;
  validFrom: string;
  validTo: string;
  algos: string;
  algoIds: string[];
  serviceUrl?: string;
  createdAt: string;
  // 证据链
  drawElements?: string[];
  // 电警推送
  apiUrl?: string;
  requestHeaders?: Record<string, string>;
  requestBodyTemplate?: string;
  // 自定义
  customFile?: string;
  customUniqueKey?: string;
  customParams?: { name: string; type: string; defaultValue: string }[];
}

interface AlgoItem {
  id: string;
  name: string;
  type: AlgoType;
  desc: string;
  version: string;
  enabled?: boolean;
  alertMethod?: AlertMethod;
  [key: string]: unknown;
}

type AlgoRunStatus = 'running' | 'stopped' | 'error';

interface AlgoMonitorItem {
  id: string;
  status: AlgoRunStatus;
  alertMessage?: string; // 异常时如 "机载算法内存溢出"
  gpuUtil?: number;    // 云端 GPU 利用率 %
  memoryPercent?: number; // 边缘 内存占用率 %
  inferenceMs?: number;  // 机载 推理延迟 ms
}

interface DeviceBinding {
  id: string;
  deviceIds: string[];
  deviceNames: string[];
  algoId: string;
  algoName: string;
  strategyId: string;
  strategyName: string;
}

interface AlgoLog {
  id: string;
  time: string;
  input: string;
  output: string;
  taskId?: string;
  algoId: string;
  algoName: string;
  algoType: AlgoType;
}

const DEVICE_LIST = [
  { id: 'd1', name: 'DJI M300 - 高新一号' },
  { id: 'd2', name: 'DJI M350 - 高新二号' },
  { id: 'd3', name: '边缘盒子 - GPU Box #01' },
];

function AlgoDetailView({
  algo,
  onSave,
  onCancel,
  onToggleEnabled,
}: {
  algo: AlgoItem;
  onSave: (a: AlgoItem) => void;
  onCancel: () => void;
  onToggleEnabled: (id: string) => void;
}) {
  const [form, setForm] = useState({ name: algo.name, version: algo.version || '', desc: algo.desc || '' });
  const enabled = algo.enabled ?? true;
  const handleSave = () => {
    onSave({ ...algo, ...form });
  };
  const apiUrl = (algo as Record<string, unknown>).apiUrl as string | undefined;
  const apiKey = (algo as Record<string, unknown>).apiKey as string | undefined;
  const serviceUrl = (algo as Record<string, unknown>).serviceUrl as string | undefined;
  const pushUrl = (algo as Record<string, unknown>).pushUrl as string | undefined;
  const pullUrl = (algo as Record<string, unknown>).pullUrl as string | undefined;
  const imageUrl = (algo as Record<string, unknown>).imageUrl as string | undefined;
  const gpu = (algo as Record<string, unknown>).gpu as string | undefined;
  const memory = (algo as Record<string, unknown>).memory as string | undefined;
  return (
    <div className="bg-card border border-border rounded-xl p-6 max-w-2xl">
      <h3 className="text-lg font-semibold text-white mb-4">算法详情（同算法接入配置）</h3>
      <div className="space-y-4">
        <h4 className="text-xs text-primary font-semibold border-l-2 border-primary pl-2">基础信息</h4>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">启用状态</span>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => onToggleEnabled(algo.id)}
            className={`relative inline-flex items-center h-5 w-10 rounded-full border transition-colors ${
              enabled ? 'bg-emerald-500/20 border-emerald-400' : 'bg-slate-700 border-slate-500'
            }`}
          >
            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transform transition-transform ${enabled ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">算法名称</label>
          <input
            className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">类型</label>
          <p className="text-xs text-slate-300">{algo.type === 'cloud' ? '云端' : algo.type === 'air' ? '机载' : '边缘'}</p>
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">版本号</label>
          <input
            className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
            value={form.version}
            onChange={(e) => setForm((p) => ({ ...p, version: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">描述</label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs resize-none"
            value={form.desc}
            onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))}
          />
        </div>
        <p className="text-xs text-muted-foreground">算法ID: <span className="font-mono text-slate-300">{algo.id}</span></p>
      </div>
      <div className="mt-4 pt-4 border-t border-border space-y-2">
        <h4 className="text-xs text-primary font-semibold border-l-2 border-primary pl-2">接入参数</h4>
        <div className="grid grid-cols-1 gap-2 text-xs">
          {(apiUrl || serviceUrl) && <div><span className="text-muted-foreground">API/服务地址：</span><span className="font-mono text-slate-300 break-all">{apiUrl || serviceUrl || '—'}</span></div>}
          {apiKey && <div><span className="text-muted-foreground">认证密钥：</span><span className="font-mono text-slate-300">****</span></div>}
          {pushUrl && <div><span className="text-muted-foreground">推流地址：</span><span className="font-mono text-slate-300 break-all">{pushUrl}</span></div>}
          {pullUrl && <div><span className="text-muted-foreground">拉流地址：</span><span className="font-mono text-slate-300 break-all">{pullUrl}</span></div>}
          {imageUrl && <div><span className="text-muted-foreground">镜像/部署包：</span><span className="font-mono text-slate-300 break-all">{imageUrl}</span></div>}
          {!apiUrl && !serviceUrl && !apiKey && !pushUrl && !pullUrl && !imageUrl && <p className="text-muted-foreground">暂无接入参数</p>}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border space-y-2">
        <h4 className="text-xs text-primary font-semibold border-l-2 border-primary pl-2">资源需求</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div><span className="text-muted-foreground">GPU 显存：</span><span className="text-slate-300">{gpu || '—'}</span></div>
          <div><span className="text-muted-foreground">内存占用：</span><span className="text-slate-300">{memory || '—'}</span></div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2 text-xs">
        <button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white" onClick={onCancel}>返回列表</button>
        <button className="px-4 py-2 rounded border border-primary bg-primary/80 text-primary-foreground" onClick={handleSave}>保存</button>
      </div>
    </div>
  );
}

const AlgorithmManager: React.FC = () => {
  const { addLog } = useAudit();
  const [activeTab, setActiveTab] = useState<'pool' | 'monitor' | 'config' | 'strategy' | 'log'>('pool');

  // 算法接入弹窗
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [algoType, setAlgoType] = useState<AlgoType>('cloud');
  const [algoForm, setAlgoForm] = useState({
    name: '',
    deviceModels: '',
    desc: '',
    version: '',
    gpu: '',
    memory: '',
    sensors: [] as string[],
    apiUrl: '',
    apiKey: '',
    imageUrl: '',
    launchArgs: '',
    otaPath: '',
    // 云端算法
    pushUrl: '',
    pullUrl: '',
    serviceUrl: '',
    fieldConfig: [] as FieldConfigItem[],
    // 机载算法
    modelFile: '',
    modelQuantPhoto: '',
    recognizeTypeValue: '',
    recognizeTypeLabel: '',
    // 告警与置信度
    alertMethod: 'video' as AlertMethod,
    confidence: 75,
  });
  // 智能算法资源池列表（含新增同步）
  const [algorithms, setAlgorithms] = useState<AlgoItem[]>([
    { id: 'a1', name: '机微型车辆追踪', type: 'air', desc: '运行于飞机内建芯片，轻量化模型压缩实现画幅内的特定移动对象跟踪。', version: 'V2.1.0', enabled: true, alertMethod: 'video' },
    { id: 'a2', name: '违停及禁停网格分析', type: 'cloud', desc: '调用极高算力云农提供支持，回传监控视频流分析目标事件。', version: 'V1.0', enabled: true, alertMethod: 'frame' },
    { id: 'a3', name: '路口多端融合边缘推演', type: 'edge', desc: '下发至机巢旁搭载的 GPU Box，自动通过容器化拉起服务。', version: 'V1.2', enabled: true, alertMethod: 'video' },
  ]);
  const [poolFilterName, setPoolFilterName] = useState('');
  const [poolFilterType, setPoolFilterType] = useState<AlgoType | ''>('');
  const [poolFilterAlert, setPoolFilterAlert] = useState<AlertMethod | ''>('');
  const [selectedAlgoId, setSelectedAlgoId] = useState<string | null>(null);
  const [showAlgoDetail, setShowAlgoDetail] = useState(false);

  // 绑定设备弹窗与绑定列表（向导式）
  const [showBindModal, setShowBindModal] = useState(false);
  const [bindWizardStep, setBindWizardStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [deployParams, setDeployParams] = useState({ version: '', launchArgs: '', envVars: '' });
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [bindAlgoId, setBindAlgoId] = useState('');
  const [bindStrategyId, setBindStrategyId] = useState('');
  const [bindings, setBindings] = useState<DeviceBinding[]>([]);

  // 后处理策略
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: 's1',
      name: '违停证据链拼接',
      description: '违停证据链生成策略',
      strategyType: 'evidence',
      enabled: true,
      validFrom: '2024-01-01',
      validTo: '2025-12-31',
      algos: '违停分析, 路口融合推演',
      algoIds: ['a1', 'a2'],
      createdAt: '2024-01-15',
      drawElements: ['车牌框', '违停框', '时间戳'],
    },
    {
      id: 's2',
      name: '电警数据推送策略',
      description: '推送至电警平台',
      strategyType: 'traffic',
      enabled: false,
      validFrom: '2024-06-01',
      validTo: '2025-06-01',
      algos: '机微型车辆追踪',
      algoIds: ['a1'],
      createdAt: '2024-02-20',
      apiUrl: 'https://traffic.api.gov/push',
      requestBodyTemplate: '{"plate":"${plate}","time":"${time}"}',
    },
  ]);
  const [showStrategyModal, setShowStrategyModal] = useState(false);
  const [editingStrategyId, setEditingStrategyId] = useState<string | null>(null);
  const [strategyDetailId, setStrategyDetailId] = useState<string | null>(null);
  const [strategyFilterName, setStrategyFilterName] = useState('');
  const [strategyFilterType, setStrategyFilterType] = useState<StrategyType | ''>('');
  const [strategyFilterEnabled, setStrategyFilterEnabled] = useState<boolean | ''>('');
  const [strategyForm, setStrategyForm] = useState({
    name: '',
    description: '',
    strategyType: 'evidence' as StrategyType,
    validFrom: '',
    validTo: '',
    algos: '',
    algoIds: [] as string[],
    serviceAddress: '',
    enabled: true,
    drawElements: [] as string[],
    apiUrl: '',
    requestHeaders: {} as Record<string, string>,
    requestBodyTemplate: '',
    customFile: '',
    customUniqueKey: '',
    customParams: [] as { name: string; type: string; defaultValue: string }[],
  });
  const [strategyConfigTab, setStrategyConfigTab] = useState<'evidence' | 'traffic' | 'custom'>('evidence');
  const [showVariableHelper, setShowVariableHelper] = useState(false);
  const [showDrawPreview, setShowDrawPreview] = useState(true);

  // 实时状态监控（算法运行状态 + 资源占用）
  const [algoMonitors, setAlgoMonitors] = useState<AlgoMonitorItem[]>([
    { id: 'a1', status: 'running', inferenceMs: 42 },
    { id: 'a2', status: 'running', gpuUtil: 68 },
    { id: 'a3', status: 'error', memoryPercent: 92, alertMessage: '边缘算法内存占用过高' },
  ]);

  // 日志监控（支持删改查、筛选）
  const [logs, setLogs] = useState<AlgoLog[]>([
    { id: 'log-1', time: '2024-03-01 10:12:33', input: 'image_20240301_101233_0001.jpg', output: '检测到目标: 违停车辆 x2', taskId: 'TASK-20240301-0008', algoId: 'a2', algoName: '违停及禁停网格分析', algoType: 'cloud' },
    { id: 'log-2', time: '2024-03-01 10:15:02', input: 'image_20240301_101502_0005.jpg', output: '检测到目标: 人员聚集(>15人)', taskId: 'TASK-20240301-0009', algoId: 'a2', algoName: '违停及禁停网格分析', algoType: 'cloud' },
    { id: 'log-3', time: '2024-03-01 09:58:11', input: 'stream_001', output: '跟踪目标丢失', taskId: 'TASK-20240301-0007', algoId: 'a1', algoName: '机微型车辆追踪', algoType: 'air' },
  ]);
  const [logFilterName, setLogFilterName] = useState('');
  const [logFilterType, setLogFilterType] = useState<AlgoType | ''>('');
  const [logFilterTimeFrom, setLogFilterTimeFrom] = useState('');
  const [logFilterTimeTo, setLogFilterTimeTo] = useState('');
  const [editingLog, setEditingLog] = useState<AlgoLog | null>(null);
  const [logEditForm, setLogEditForm] = useState<Pick<AlgoLog, 'time' | 'input' | 'output' | 'taskId' | 'algoName' | 'algoType'>>({ time: '', input: '', output: '', taskId: '', algoName: '', algoType: 'cloud' });
  const [selectedLogIds, setSelectedLogIds] = useState<Set<string>>(new Set());

  const toggleSensor = (sensor: string) => {
    setAlgoForm((prev) => ({
      ...prev,
      sensors: prev.sensors.includes(sensor)
        ? prev.sensors.filter((s) => s !== sensor)
        : [...prev.sensors, sensor],
    }));
  };

  const handleSaveAlgo = () => {
    if (!algoForm.name.trim()) return;
    const id = `a-${Date.now()}`;
    const newAlgo: AlgoItem = {
      id,
      name: algoForm.name.trim(),
      type: algoType,
      desc: algoForm.desc || '',
      version: algoForm.version || '',
      enabled: true,
      alertMethod: algoForm.alertMethod,
      ...algoForm,
    };
    setAlgorithms((prev) => [...prev, newAlgo]);
    setAlgoMonitors((prev) => [
      ...prev,
      {
        id,
        status: 'running',
        ...(algoType === 'cloud' && { gpuUtil: 0 }),
        ...(algoType === 'edge' && { memoryPercent: 0 }),
        ...(algoType === 'air' && { inferenceMs: 0 }),
      },
    ]);
    addLog({ actionType: '新增', module: '算法管理', targetObject: `算法「${newAlgo.name}」`, detailSummary: `新增算法接入：${newAlgo.name}（${algoType === 'cloud' ? '云端' : algoType === 'air' ? '机载' : '边缘'}）` });
    setShowAccessModal(false);
    setAlgoForm({
      name: '',
      deviceModels: '',
      desc: '',
      version: '',
      gpu: '',
      memory: '',
      sensors: [],
      apiUrl: '',
      apiKey: '',
      imageUrl: '',
      launchArgs: '',
      otaPath: '',
      pushUrl: '',
      pullUrl: '',
      serviceUrl: '',
      fieldConfig: [],
      modelFile: '',
      modelQuantPhoto: '',
      recognizeTypeValue: '',
      recognizeTypeLabel: '',
      alertMethod: 'video',
      confidence: 75,
    });
  };

  const handleToggleStrategy = (id: string) => {
    setStrategies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    );
  };

  const filteredStrategies = useMemo(() => {
    return strategies.filter((s) => {
      if (strategyFilterName && !s.name.toLowerCase().includes(strategyFilterName.toLowerCase())) return false;
      if (strategyFilterType && s.strategyType !== strategyFilterType) return false;
      if (strategyFilterEnabled !== '' && s.enabled !== strategyFilterEnabled) return false;
      return true;
    });
  }, [strategies, strategyFilterName, strategyFilterType, strategyFilterEnabled]);

  const handleSaveStrategy = () => {
    if (!strategyForm.name.trim()) return;
    const payload: Strategy = {
      id: editingStrategyId || `s-${Date.now()}`,
      name: strategyForm.name.trim(),
      description: strategyForm.description,
      strategyType: strategyForm.strategyType,
      enabled: strategyForm.enabled,
      validFrom: strategyForm.validFrom || '立即生效',
      validTo: strategyForm.validTo || '长期有效',
      algos: strategyForm.algoIds.length ? strategyForm.algoIds.map((id) => algorithms.find((a) => a.id === id)?.name ?? id).join(', ') : strategyForm.algos || '未指定',
      algoIds: strategyForm.algoIds,
      serviceUrl: strategyForm.serviceAddress || undefined,
      createdAt: editingStrategyId ? strategies.find((s) => s.id === editingStrategyId)!.createdAt : new Date().toISOString().slice(0, 10),
      drawElements: strategyForm.strategyType === 'evidence' ? strategyForm.drawElements : undefined,
      apiUrl: strategyForm.strategyType === 'traffic' ? strategyForm.apiUrl : undefined,
      requestHeaders: strategyForm.strategyType === 'traffic' ? strategyForm.requestHeaders : undefined,
      requestBodyTemplate: strategyForm.strategyType === 'traffic' ? strategyForm.requestBodyTemplate : undefined,
      customFile: strategyForm.strategyType === 'custom' ? strategyForm.customFile : undefined,
      customUniqueKey: strategyForm.strategyType === 'custom' ? strategyForm.customUniqueKey : undefined,
      customParams: strategyForm.strategyType === 'custom' ? strategyForm.customParams : undefined,
    };
    if (editingStrategyId) {
      setStrategies((prev) => prev.map((s) => (s.id === editingStrategyId ? payload : s)));
      addLog({ actionType: '修改', module: '算法管理', targetObject: `后处理策略「${payload.name}」`, detailSummary: `编辑后处理策略：${payload.name}` });
    } else {
      setStrategies((prev) => [...prev, payload]);
      addLog({ actionType: '新增', module: '算法管理', targetObject: `后处理策略「${payload.name}」`, detailSummary: `创建后处理策略：${payload.name}` });
    }
    setShowStrategyModal(false);
    setEditingStrategyId(null);
    setStrategyForm({ name: '', description: '', strategyType: 'evidence', validFrom: '', validTo: '', algos: '', algoIds: [], serviceAddress: '', enabled: true, drawElements: [], apiUrl: '', requestHeaders: {}, requestBodyTemplate: '', customFile: '', customUniqueKey: '', customParams: [] });
  };

  const handleCopyStrategy = (s: Strategy) => {
    setStrategyForm({
      name: `${s.name}（副本）`,
      description: s.description,
      strategyType: s.strategyType,
      validFrom: s.validFrom,
      validTo: s.validTo,
      algos: s.algos,
      algoIds: s.algoIds || [],
      serviceAddress: s.serviceUrl || '',
      enabled: s.enabled,
      drawElements: s.drawElements || [],
      apiUrl: s.apiUrl || '',
      requestHeaders: s.requestHeaders || {},
      requestBodyTemplate: s.requestBodyTemplate || '',
      customFile: s.customFile || '',
      customUniqueKey: s.customUniqueKey || '',
      customParams: s.customParams || [],
    });
    setEditingStrategyId(null);
    setStrategyConfigTab(s.strategyType);
    setShowStrategyModal(true);
  };

  const openStrategyEdit = (s: Strategy) => {
    setStrategyForm({
      name: s.name,
      description: s.description,
      strategyType: s.strategyType,
      validFrom: s.validFrom,
      validTo: s.validTo,
      algos: s.algos,
      algoIds: s.algoIds || [],
      serviceAddress: s.serviceUrl || '',
      enabled: s.enabled,
      drawElements: s.drawElements || [],
      apiUrl: s.apiUrl || '',
      requestHeaders: s.requestHeaders || {},
      requestBodyTemplate: s.requestBodyTemplate || '',
      customFile: s.customFile || '',
      customUniqueKey: s.customUniqueKey || '',
      customParams: s.customParams || [],
    });
    setEditingStrategyId(s.id);
    setStrategyConfigTab(s.strategyType);
    setShowStrategyModal(true);
  };

  const toggleDevice = (id: string) => {
    setSelectedDevices((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const filteredAlgorithms = algorithms.filter((a) => {
    if (poolFilterName && !a.name.toLowerCase().includes(poolFilterName.toLowerCase())) return false;
    if (poolFilterType && a.type !== poolFilterType) return false;
    if (poolFilterAlert && (a.alertMethod || 'video') !== poolFilterAlert) return false;
    return true;
  });

  const filteredLogs = logs.filter((log) => {
    if (logFilterName && !log.algoName.toLowerCase().includes(logFilterName.toLowerCase())) return false;
    if (logFilterType && log.algoType !== logFilterType) return false;
    if (logFilterTimeFrom && log.time < logFilterTimeFrom) return false;
    if (logFilterTimeTo && log.time > logFilterTimeTo) return false;
    return true;
  });

  const handleDeleteLog = (id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const openEditLog = (log: AlgoLog) => {
    setEditingLog(log);
    setLogEditForm({
      time: log.time,
      input: log.input,
      output: log.output,
      taskId: log.taskId || '',
      algoName: log.algoName,
      algoType: log.algoType,
    });
  };

  const handleSaveLogEdit = () => {
    if (!editingLog) return;
    setLogs((prev) =>
      prev.map((l) =>
        l.id === editingLog.id
          ? { ...l, ...logEditForm, taskId: logEditForm.taskId || undefined }
          : l,
      ),
    );
    setEditingLog(null);
  };

  const toggleLogSelect = (id: string) => {
    setSelectedLogIds((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const toggleAllLogs = () => {
    if (selectedLogIds.size === filteredLogs.length) setSelectedLogIds(new Set());
    else setSelectedLogIds(new Set(filteredLogs.map((l) => l.id)));
  };

  const handleExportLogs = () => {
    const toExport = selectedLogIds.size ? filteredLogs.filter((l) => selectedLogIds.has(l.id)) : filteredLogs;
    const headers = ['算法名称', '算法ID', '算法类型', '触发时间', '输入数据', '输出结果', '关联任务ID'];
    const rows = toExport.map((l) => [
      l.algoName,
      l.algoId,
      l.algoType === 'cloud' ? '云端' : l.algoType === 'air' ? '机载' : '边缘',
      l.time,
      l.input,
      l.output,
      l.taskId || '',
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `算法日志_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpdateAlgo = (updated: AlgoItem) => {
    setAlgorithms((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    addLog({ actionType: '修改', module: '算法管理', targetObject: `算法「${updated.name}」`, detailSummary: `保存算法详情：${updated.name}` });
    setShowAlgoDetail(false);
    setSelectedAlgoId(null);
  };

  const handleDeleteAlgo = (id: string) => {
    const algo = algorithms.find((a) => a.id === id);
    if (!algo || !window.confirm(`确定删除算法「${algo.name}」？`)) return;
    setAlgorithms((prev) => prev.filter((a) => a.id !== id));
    setAlgoMonitors((prev) => prev.filter((m) => m.id !== id));
    setBindings((prev) => prev.filter((b) => b.algoId !== id));
    addLog({ actionType: '删除', module: '算法管理', targetObject: `算法「${algo.name}」`, detailSummary: `删除算法：${algo.name}`, isHighRisk: true });
    if (selectedAlgoId === id) { setShowAlgoDetail(false); setSelectedAlgoId(null); }
  };

  const handleToggleAlgoEnabled = (id: string) => {
    setAlgorithms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !(a.enabled ?? true) } : a)),
    );
  };

  const handleSaveBind = () => {
    if (selectedDevices.length === 0 || !bindAlgoId || !bindStrategyId) return;
    const algo = algorithms.find((a) => a.id === bindAlgoId);
    const strategy = strategies.find((s) => s.id === bindStrategyId);
    if (!algo || !strategy) return;
    setBindings((prev) => [
      ...prev,
      {
        id: `b-${Date.now()}`,
        deviceIds: selectedDevices,
        deviceNames: selectedDevices.map((id) => DEVICE_LIST.find((d) => d.id === id)?.name ?? id),
        algoId: bindAlgoId,
        algoName: algo.name,
        strategyId: bindStrategyId,
        strategyName: strategy.name,
      },
    ]);
    addLog({ actionType: '修改', module: '算法管理', targetObject: '绑定与调度', detailSummary: `保存设备绑定：算法「${algo.name}」+ 策略「${strategy.name}」绑定设备 ${selectedDevices.length} 台` });
    setShowBindModal(false);
    setSelectedDevices([]);
    setBindAlgoId('');
    setBindStrategyId('');
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto flex flex-col pb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white tracking-wide">空地协同算法挂载中心</h2>
          <p className="text-sm text-muted-foreground mt-1">
            负责设备端、云端与边缘容器运算引擎的注入、模型量化管理及后处理联动推传。
          </p>
        </div>

        <div className="bg-card tech-border rounded-xl min-h-[600px] flex flex-col">
          {/* 配置 Tab页 */}
          <div className="flex border-b border-border px-4 bg-secondary/30 rounded-t-xl">
            <button
              onClick={() => setActiveTab('pool')}
              className={`px-5 py-4 font-medium text-sm transition border-b-2 ${
                activeTab === 'pool' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-white'
              }`}
            >
              智能算法资源池
            </button>
            <button
              onClick={() => setActiveTab('strategy')}
              className={`px-5 py-4 font-medium text-sm transition border-b-2 ${
                activeTab === 'strategy' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-white'
              }`}
            >
              后处理策略
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`px-5 py-4 font-medium text-sm transition border-b-2 ${
                activeTab === 'config' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-white'
              }`}
            >
              绑定与调度分发
            </button>
            <button
              onClick={() => setActiveTab('monitor')}
              className={`px-5 py-4 font-medium text-sm transition border-b-2 ${
                activeTab === 'monitor' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-white'
              }`}
            >
              实时状态监控
            </button>
            <button
              onClick={() => setActiveTab('log')}
              className={`px-5 py-4 font-medium text-sm transition border-b-2 ${
                activeTab === 'log' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-white'
              }`}
            >
              日志监控
            </button>
          </div>

          <div className="p-6 flex-1 bg-background/30">
            {/* 智能算法资源池 */}
            {activeTab === 'pool' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {showAlgoDetail && selectedAlgoId ? (
                  <>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        className="text-sm text-muted-foreground hover:text-white"
                        onClick={() => { setShowAlgoDetail(false); setSelectedAlgoId(null); }}
                      >
                        ← 返回列表
                      </button>
                    </div>
                    <AlgoDetailView
                      algo={algorithms.find((a) => a.id === selectedAlgoId)!}
                      onSave={handleUpdateAlgo}
                      onCancel={() => { setShowAlgoDetail(false); setSelectedAlgoId(null); }}
                      onToggleEnabled={handleToggleAlgoEnabled}
                    />
                  </>
                ) : (
                  <>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h3 className="border-l-2 border-primary pl-2 text-white font-semibold">
                    异构算法列表
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="text"
                      placeholder="算法名称"
                      className="px-2 py-1.5 bg-background border border-border rounded text-white text-xs w-28"
                      value={poolFilterName}
                      onChange={(e) => setPoolFilterName(e.target.value)}
                    />
                    <select
                      className="px-2 py-1.5 bg-background border border-border rounded text-white text-xs"
                      value={poolFilterType}
                      onChange={(e) => setPoolFilterType((e.target.value || '') as AlgoType | '')}
                    >
                      <option value="">全部类型</option>
                      <option value="cloud">云端</option>
                      <option value="edge">边缘</option>
                      <option value="air">机载</option>
                    </select>
                    <select
                      className="px-2 py-1.5 bg-background border border-border rounded text-white text-xs"
                      value={poolFilterAlert}
                      onChange={(e) => setPoolFilterAlert((e.target.value || '') as AlertMethod | '')}
                    >
                      <option value="">全部告警方式</option>
                      <option value="video">视频告警</option>
                      <option value="frame">截帧告警</option>
                    </select>
                    <button
                      className="bg-primary/20 border border-primary text-primary px-3 py-1.5 rounded text-sm flex items-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => setShowAccessModal(true)}
                    >
                      <Plus size={14} className="mr-1" />
                      新增算法
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {filteredAlgorithms.map((algo) => {
                    const typeLabel = algo.type === 'cloud' ? 'CLOUD API' : algo.type === 'air' ? 'AERIAL EDGE' : 'DOCKER K8S';
                    const Icon = algo.type === 'cloud' ? Server : algo.type === 'air' ? Activity : Database;
                    return (
                      <div
                        key={algo.id}
                        role="button"
                        tabIndex={0}
                        className="bg-secondary/40 border border-border rounded-lg p-5 hover:border-slate-500 transition relative overflow-hidden cursor-pointer"
                        onClick={() => { setSelectedAlgoId(algo.id); setShowAlgoDetail(true); }}
                        onKeyDown={(e) => e.key === 'Enter' && (setSelectedAlgoId(algo.id), setShowAlgoDetail(true))}
                      >
                        <div
                          className="absolute top-0 right-0 text-[10px] font-mono px-2 py-1 rounded-bl"
                          style={algo.type === 'cloud' ? { backgroundColor: 'rgba(168,85,247,0.1)', borderWidth: '0 0 1px 1px', borderColor: 'rgba(168,85,247,0.3)', color: '#c084fc' } : algo.type === 'air' ? { backgroundColor: 'rgba(59,130,246,0.1)', borderWidth: '0 0 1px 1px', borderColor: 'rgba(59,130,246,0.3)', color: '#60a5fa' } : { backgroundColor: 'rgba(16,185,129,0.1)', borderWidth: '0 0 1px 1px', borderColor: 'rgba(16,185,129,0.3)', color: '#34d399' }}
                        >
                          {typeLabel}
                        </div>
                        <div className="flex items-center mb-3">
                          <Icon
                            className={`text-white mr-3 p-1.5 rounded ${algo.type === 'cloud' ? 'bg-purple-900' : algo.type === 'air' ? 'bg-slate-700' : 'bg-emerald-900'}`}
                            size={28}
                          />
                          <h4 className="text-base font-bold text-white">{algo.name}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{algo.desc}</p>
                        <div className="flex gap-2 flex-wrap mb-3">
                          <span className="text-[10px] border border-border text-slate-400 px-1.5 rounded">版本: {algo.version || '-'}</span>
                          <span className="text-[10px] border border-border text-slate-400 px-1.5 rounded">{algo.type === 'cloud' ? '云端' : algo.type === 'air' ? '机载' : '边缘'}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-border" onClick={(e) => e.stopPropagation()}>
                          <button type="button" className="text-xs px-2 py-1 rounded border border-primary text-primary hover:bg-primary/20 flex items-center gap-1" onClick={() => { setSelectedAlgoId(algo.id); setShowAlgoDetail(true); }}><Edit2 size={12} /> 编辑</button>
                          <button type="button" className="text-xs px-2 py-1 rounded border border-border text-muted-foreground hover:text-white flex items-center gap-1" onClick={() => { setSelectedAlgoId(algo.id); setShowAlgoDetail(true); }}><Eye size={12} /> 查看详情</button>
                          <button type="button" className="text-xs px-2 py-1 rounded border border-red-500/50 text-red-400 hover:bg-red-500/20 flex items-center gap-1" onClick={() => handleDeleteAlgo(algo.id)}><Trash2 size={12} /> 删除</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                  </>
                )}
              </div>
            )}

            {/* 后处理策略 */}
            {activeTab === 'strategy' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h3 className="border-l-2 border-primary pl-2 text-white font-semibold">
                    后处理策略管理
                  </h3>
                  <button
                    className="bg-primary/20 border border-primary text-primary px-3 py-1.5 rounded text-sm flex items-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => {
                      setEditingStrategyId(null);
                      setStrategyForm({ name: '', description: '', strategyType: 'evidence', validFrom: '', validTo: '', algos: '', algoIds: [], serviceAddress: '', enabled: true, drawElements: [], apiUrl: '', requestHeaders: {}, requestBodyTemplate: '', customFile: '', customUniqueKey: '', customParams: [] });
                      setStrategyConfigTab('evidence');
                      setShowStrategyModal(true);
                    }}
                  >
                    <Plus size={14} className="mr-1" />
                    创建新策略
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                  <input placeholder="策略名称搜索" className="px-3 py-1.5 bg-background border border-border rounded text-white text-xs w-40" value={strategyFilterName} onChange={(e) => setStrategyFilterName(e.target.value)} />
                  <select className="px-3 py-1.5 bg-background border border-border rounded text-white text-xs" value={strategyFilterType} onChange={(e) => setStrategyFilterType((e.target.value || '') as StrategyType | '')}>
                    <option value="">策略类型</option>
                    <option value="evidence">证据链生成</option>
                    <option value="traffic">电警数据推送</option>
                    <option value="custom">自定义</option>
                  </select>
                  <select className="px-3 py-1.5 bg-background border border-border rounded text-white text-xs" value={strategyFilterEnabled === '' ? '' : strategyFilterEnabled ? '1' : '0'} onChange={(e) => setStrategyFilterEnabled(e.target.value === '' ? '' : e.target.value === '1')}>
                    <option value="">状态</option>
                    <option value="1">启用</option>
                    <option value="0">禁用</option>
                  </select>
                </div>
                <div className="border border-border rounded-lg overflow-hidden bg-background/40">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-secondary border-b border-border text-xs text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2">策略名称</th>
                        <th className="px-4 py-2">策略类型</th>
                        <th className="px-4 py-2">关联算法</th>
                        <th className="px-4 py-2">状态</th>
                        <th className="px-4 py-2">创建时间</th>
                        <th className="px-4 py-2 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-xs text-slate-100">
                      {filteredStrategies.map((s) => (
                        <tr key={s.id} className="hover:bg-secondary/40">
                          <td className="px-4 py-2">{s.name}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${s.strategyType === 'evidence' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' : s.strategyType === 'traffic' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-500/20 text-slate-400 border border-slate-500/40'}`}>
                              {s.strategyType === 'evidence' ? '证据链' : s.strategyType === 'traffic' ? '电警推送' : '自定义'}
                            </span>
                          </td>
                          <td className="px-4 py-2">{s.algos}</td>
                          <td className="px-4 py-2">
                            <button
                              type="button"
                              onClick={() => handleToggleStrategy(s.id)}
                              className={`relative inline-flex items-center h-5 w-10 rounded-full border transition-colors ${s.enabled ? 'bg-emerald-500/20 border-emerald-400' : 'bg-slate-700 border-slate-500'}`}
                            >
                              <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transform transition-transform ${s.enabled ? 'translate-x-5' : 'translate-x-1'}`} />
                            </button>
                          </td>
                          <td className="px-4 py-2 font-mono text-muted-foreground">{s.createdAt}</td>
                          <td className="px-4 py-2 text-right">
                            <button className="text-primary hover:underline mr-2" onClick={() => openStrategyEdit(s)}>编辑</button>
                            <button className="text-red-400 hover:underline mr-2" onClick={() => { if (window.confirm('确定删除该策略？')) { setStrategies((p) => p.filter((x) => x.id !== s.id)); addLog({ actionType: '删除', module: '算法管理', targetObject: `后处理策略「${s.name}」`, detailSummary: `删除策略：${s.name}`, isHighRisk: true }); } }}>删除</button>
                            <button className="text-muted-foreground hover:underline mr-2" onClick={() => handleCopyStrategy(s)}><Copy size={12} className="inline mr-0.5" />复制</button>
                            <button className="text-muted-foreground hover:underline" onClick={() => setStrategyDetailId(s.id)}>查看详情</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {strategyDetailId && (() => {
                  const sd = strategies.find((s) => s.id === strategyDetailId);
                  if (!sd) return null;
                  return (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40" onClick={() => setStrategyDetailId(null)}>
                      <div className="bg-[#050816] border border-border rounded-xl w-full max-w-lg p-6 text-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h4 className="text-lg font-semibold text-white mb-4">策略详情</h4>
                        <div className="space-y-2 text-xs">
                          <div><span className="text-muted-foreground">策略名称：</span><span className="text-slate-200">{sd.name}</span></div>
                          <div><span className="text-muted-foreground">类型：</span><span className="text-slate-200">{sd.strategyType === 'evidence' ? '证据链生成' : sd.strategyType === 'traffic' ? '电警数据推送' : '自定义'}</span></div>
                          <div><span className="text-muted-foreground">关联算法：</span><span className="text-slate-200">{sd.algos}</span></div>
                          <div><span className="text-muted-foreground">状态：</span><span className={sd.enabled ? 'text-emerald-400' : 'text-muted-foreground'}>{sd.enabled ? '启用' : '禁用'}</span></div>
                          <div><span className="text-muted-foreground">创建时间：</span><span className="text-slate-200 font-mono">{sd.createdAt}</span></div>
                        </div>
                        <div className="mt-4 flex justify-end"><button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white" onClick={() => setStrategyDetailId(null)}>关闭</button></div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* 绑定与调度分发 - 向导式 */}
            {activeTab === 'config' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="border-l-2 border-primary pl-2 text-white font-semibold">
                    绑定与调度分发
                  </h3>
                  <button
                    className="bg-primary/20 border border-primary text-primary px-3 py-1.5 rounded text-sm flex items-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => { setShowBindModal(true); setBindWizardStep(1); setDeployParams({ version: '', launchArgs: '', envVars: '' }); }}
                  >
                    <Plus size={14} className="mr-1" />
                    新建部署
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">通过向导完成：选择设备 → 选择算法 → 选择后处理策略 → 配置参数 → 确认部署。</p>
                {bindings.length === 0 ? (
                  <div className="bg-card border border-border rounded-lg p-8 text-center">
                    <p className="text-muted-foreground text-sm">暂无部署记录</p>
                    <p className="text-xs text-muted-foreground mt-1">点击「新建部署」按向导完成设备与算法、策略的绑定与部署。</p>
                  </div>
                ) : (
                  <div className="border border-border rounded-lg overflow-hidden bg-background/40 text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-secondary border-b border-border text-muted-foreground">
                        <tr>
                          <th className="px-3 py-2">设备</th>
                          <th className="px-3 py-2">绑定算法</th>
                          <th className="px-3 py-2">后处理策略</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-slate-100">
                        {bindings.map((b) => (
                          <tr key={b.id} className="hover:bg-secondary/40">
                            <td className="px-3 py-2">{b.deviceNames.join('、')}</td>
                            <td className="px-3 py-2">{b.algoName}</td>
                            <td className="px-3 py-2">{b.strategyName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 实时状态监控 - 卡片展示 */}
            {activeTab === 'monitor' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="border-l-2 border-primary pl-2 text-white font-semibold">
                  算法运行状态与资源占用
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {algorithms.map((algo) => {
                    const mon = algoMonitors.find((m) => m.id === algo.id) ?? { id: algo.id, status: 'stopped' as AlgoRunStatus };
                    const statusLabel = mon.status === 'running' ? '运行中' : mon.status === 'error' ? '异常' : '停止';
                    const statusClass = mon.status === 'running' ? 'text-emerald-400' : mon.status === 'error' ? 'text-red-400' : 'text-slate-400';
                    const boundDevices = bindings.filter((b) => b.algoId === algo.id).flatMap((b) => b.deviceNames);
                    const resourceText = algo.type === 'cloud'
                      ? `GPU 利用率: ${mon?.gpuUtil ?? 0}%`
                      : algo.type === 'edge'
                        ? `内存占用率: ${mon?.memoryPercent ?? 0}%`
                        : `推理延迟: ${mon?.inferenceMs ?? 0} ms`;
                    return (
                      <div key={algo.id} className="bg-secondary/40 border border-border rounded-lg p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-semibold text-sm">{algo.name}</h4>
                          <span className={`text-xs font-medium ${statusClass}`}>{statusLabel}</span>
                        </div>
                        <div className="text-xs space-y-1.5">
                          <div>
                            <span className="text-muted-foreground">绑定设备：</span>
                            <span className="text-slate-200">{boundDevices.length ? boundDevices.join('、') : '暂无'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">资源占用：</span>
                            <span className="text-slate-200">{resourceText}</span>
                          </div>
                          {mon.status === 'error' && mon.alertMessage && (
                            <div className="text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-1 rounded text-[11px]">
                              {mon.alertMessage}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 日志监控 */}
            {activeTab === 'log' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h3 className="border-l-2 border-primary pl-2 text-white font-semibold">
                    算法调用日志
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      共 {filteredLogs.length} / {logs.length} 条
                    </span>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded border border-primary bg-primary/20 text-primary text-xs hover:bg-primary hover:text-primary-foreground"
                      onClick={handleExportLogs}
                    >
                      {selectedLogIds.size ? `导出选中 (${selectedLogIds.size})` : '导出筛选结果'}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center text-xs">
                  <span className="text-muted-foreground">筛选：</span>
                  <input
                    type="text"
                    placeholder="算法名称"
                    className="px-2 py-1.5 bg-background border border-border rounded text-white w-32"
                    value={logFilterName}
                    onChange={(e) => setLogFilterName(e.target.value)}
                  />
                  <select
                    className="px-2 py-1.5 bg-background border border-border rounded text-white"
                    value={logFilterType}
                    onChange={(e) => setLogFilterType((e.target.value || '') as AlgoType | '')}
                  >
                    <option value="">全部类型</option>
                    <option value="cloud">云端</option>
                    <option value="edge">边缘</option>
                    <option value="air">机载</option>
                  </select>
                  <input
                    type="text"
                    placeholder="触发时间起"
                    className="px-2 py-1.5 bg-background border border-border rounded text-white w-36 font-mono"
                    value={logFilterTimeFrom}
                    onChange={(e) => setLogFilterTimeFrom(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="触发时间止"
                    className="px-2 py-1.5 bg-background border border-border rounded text-white w-36 font-mono"
                    value={logFilterTimeTo}
                    onChange={(e) => setLogFilterTimeTo(e.target.value)}
                  />
                </div>

                <div className="border border-border rounded-lg overflow-hidden bg-background/40 text-xs text-slate-100">
                  <table className="w-full text-left">
                    <thead className="bg-secondary border-b border-border text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 w-10">
                          <input type="checkbox" checked={filteredLogs.length > 0 && selectedLogIds.size === filteredLogs.length} onChange={toggleAllLogs} className="accent-primary" />
                        </th>
                        <th className="px-3 py-2">算法名称</th>
                        <th className="px-3 py-2">算法ID</th>
                        <th className="px-3 py-2">算法类型</th>
                        <th className="px-3 py-2">触发时间</th>
                        <th className="px-3 py-2">输入数据</th>
                        <th className="px-3 py-2">输出结果</th>
                        <th className="px-3 py-2">关联任务 ID</th>
                        <th className="px-3 py-2 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-secondary/40">
                          <td className="px-3 py-2">
                            <input type="checkbox" checked={selectedLogIds.has(log.id)} onChange={() => toggleLogSelect(log.id)} className="accent-primary" />
                          </td>
                          <td className="px-3 py-2">{log.algoName}</td>
                          <td className="px-3 py-2 font-mono text-[11px]">{log.algoId}</td>
                          <td className="px-3 py-2">{log.algoType === 'cloud' ? '云端' : log.algoType === 'air' ? '机载' : '边缘'}</td>
                          <td className="px-3 py-2 font-mono text-[11px]">{log.time}</td>
                          <td className="px-3 py-2">{log.input}</td>
                          <td className="px-3 py-2">{log.output}</td>
                          <td className="px-3 py-2">
                            {log.taskId ? (
                              <span className="text-primary cursor-pointer hover:underline">{log.taskId}</span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button
                              type="button"
                              className="text-primary hover:underline mr-2"
                              onClick={() => openEditLog(log)}
                            >
                              编辑
                            </button>
                            <button
                              type="button"
                              className="text-red-400 hover:underline"
                              onClick={() => handleDeleteLog(log.id)}
                            >
                              删除
                            </button>
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

        {/* 算法接入弹窗 */}
        {showAccessModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
            <div className="bg-[#050816] border border-primary/40 rounded-xl w-full max-w-3xl p-6 shadow-2xl text-sm">
              <h3 className="text-lg font-semibold text-white mb-4">算法接入配置</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 基础信息 */}
                <div className="space-y-3">
                  <h4 className="text-xs text-primary font-semibold border-l-2 border-primary pl-2">
                    基础信息
                  </h4>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      算法名称
                    </label>
                    <input
                      className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                      value={algoForm.name}
                      onChange={(e) =>
                        setAlgoForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      类型（云端 / 边缘 / 机载）
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={`flex-1 px-2 py-1 rounded border text-xs ${
                          algoType === 'cloud'
                            ? 'border-primary bg-primary/20 text-primary'
                            : 'border-border text-muted-foreground'
                        }`}
                        onClick={() => setAlgoType('cloud')}
                      >
                        云端算法
                      </button>
                      <button
                        type="button"
                        className={`flex-1 px-2 py-1 rounded border text-xs ${
                          algoType === 'edge'
                            ? 'border-primary bg-primary/20 text-primary'
                            : 'border-border text-muted-foreground'
                        }`}
                        onClick={() => setAlgoType('edge')}
                      >
                        边缘算法
                      </button>
                      <button
                        type="button"
                        className={`flex-1 px-2 py-1 rounded border text-xs ${
                          algoType === 'air'
                            ? 'border-primary bg-primary/20 text-primary'
                            : 'border-border text-muted-foreground'
                        }`}
                        onClick={() => setAlgoType('air')}
                      >
                        机载算法
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      适用设备型号（如 DJI M300 / M350）
                    </label>
                    <input
                      className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                      value={algoForm.deviceModels}
                      onChange={(e) =>
                        setAlgoForm((prev) => ({ ...prev, deviceModels: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      版本号
                    </label>
                    <input
                      className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                      value={algoForm.version}
                      onChange={(e) =>
                        setAlgoForm((prev) => ({ ...prev, version: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      算法描述
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs resize-none"
                      value={algoForm.desc}
                      onChange={(e) =>
                        setAlgoForm((prev) => ({ ...prev, desc: e.target.value }))
                      }
                    />
                  </div>
                </div>

                {/* 资源需求 & 接入参数 */}
                <div className="space-y-3">
                  <h4 className="text-xs text-primary font-semibold border-l-2 border-primary pl-2">
                    资源需求
                  </h4>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs text-muted-foreground mb-1">
                        算力要求（如 GPU 显存 ≥ 4GB）
                      </label>
                      <input
                        className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                        value={algoForm.gpu}
                        onChange={(e) =>
                          setAlgoForm((prev) => ({ ...prev, gpu: e.target.value }))
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-muted-foreground mb-1">
                        内存占用
                      </label>
                      <input
                        className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                        value={algoForm.memory}
                        onChange={(e) =>
                          setAlgoForm((prev) => ({ ...prev, memory: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      支持的传感器类型
                    </label>
                    <div className="flex gap-3 text-xs text-slate-200">
                      {['可见光相机', '红外相机', '双光云台'].map((s) => (
                        <label key={s} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            className="accent-sky-500"
                            checked={algoForm.sensors.includes(s)}
                            onChange={() => toggleSensor(s)}
                          />
                          <span>{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <h4 className="text-xs text-primary font-semibold border-l-2 border-primary pl-2 mt-3">
                    接入参数（随算法类型变化）
                  </h4>

                  {algoType === 'cloud' && (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">推流地址</label>
                        <input
                          className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                          value={algoForm.pushUrl}
                          onChange={(e) => setAlgoForm((prev) => ({ ...prev, pushUrl: e.target.value }))}
                          placeholder="rtmp://..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">拉流地址</label>
                        <input
                          className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                          value={algoForm.pullUrl}
                          onChange={(e) => setAlgoForm((prev) => ({ ...prev, pullUrl: e.target.value }))}
                          placeholder="rtmp://..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">服务地址</label>
                        <input
                          className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                          value={algoForm.serviceUrl}
                          onChange={(e) => setAlgoForm((prev) => ({ ...prev, serviceUrl: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">密钥</label>
                        <input
                          className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                          value={algoForm.apiKey}
                          onChange={(e) => setAlgoForm((prev) => ({ ...prev, apiKey: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">字段配置（字段及枚举值）</label>
                        {algoForm.fieldConfig.map((fc, idx) => (
                          <div key={idx} className="flex gap-2 mb-2">
                            <input
                              className="flex-1 px-3 py-1.5 bg-background border border-border rounded text-white text-xs"
                              placeholder="字段名"
                              value={fc.field}
                              onChange={(e) => {
                                const next = [...algoForm.fieldConfig];
                                next[idx] = { ...next[idx], field: e.target.value };
                                setAlgoForm((prev) => ({ ...prev, fieldConfig: next }));
                              }}
                            />
                            <input
                              className="flex-1 px-3 py-1.5 bg-background border border-border rounded text-white text-xs"
                              placeholder="枚举值，逗号分隔"
                              value={fc.enumValues}
                              onChange={(e) => {
                                const next = [...algoForm.fieldConfig];
                                next[idx] = { ...next[idx], enumValues: e.target.value };
                                setAlgoForm((prev) => ({ ...prev, fieldConfig: next }));
                              }}
                            />
                            <button
                              type="button"
                              className="px-2 py-1 border border-border rounded text-muted-foreground hover:text-white text-xs"
                              onClick={() =>
                                setAlgoForm((prev) => ({
                                  ...prev,
                                  fieldConfig: prev.fieldConfig.filter((_, i) => i !== idx),
                                }))
                              }
                            >
                              删除
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="text-xs text-primary border border-primary/50 px-2 py-1 rounded hover:bg-primary/10"
                          onClick={() =>
                            setAlgoForm((prev) => ({
                              ...prev,
                              fieldConfig: [...prev.fieldConfig, { field: '', enumValues: '' }],
                            }))
                          }
                        >
                          + 添加字段
                        </button>
                      </div>
                    </div>
                  )}

                  {algoType === 'edge' && (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">
                          容器镜像地址 / 部署包
                        </label>
                        <input
                          className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                          value={algoForm.imageUrl}
                          onChange={(e) =>
                            setAlgoForm((prev) => ({ ...prev, imageUrl: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">
                          启动参数
                        </label>
                        <input
                          className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                          value={algoForm.launchArgs}
                          onChange={(e) =>
                            setAlgoForm((prev) => ({ ...prev, launchArgs: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                  )}

                  {algoType === 'air' && (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">模型文件</label>
                        <input
                          className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                          value={algoForm.modelFile}
                          onChange={(e) => setAlgoForm((prev) => ({ ...prev, modelFile: e.target.value }))}
                          placeholder="模型文件路径或 URL"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">模型量化照片</label>
                        <input
                          className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                          value={algoForm.modelQuantPhoto}
                          onChange={(e) => setAlgoForm((prev) => ({ ...prev, modelQuantPhoto: e.target.value }))}
                          placeholder="量化校准用照片路径或 URL"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">识别类型（枚举值 + 用户侧名称）</label>
                        <div className="flex gap-2">
                          <input
                            className="flex-1 px-3 py-2 bg-background border border-border rounded text-white text-xs"
                            placeholder="枚举值，如 vehicle"
                            value={algoForm.recognizeTypeValue}
                            onChange={(e) => setAlgoForm((prev) => ({ ...prev, recognizeTypeValue: e.target.value }))}
                          />
                          <input
                            className="flex-1 px-3 py-2 bg-background border border-border rounded text-white text-xs"
                            placeholder="用户侧名称，如 车辆识别"
                            value={algoForm.recognizeTypeLabel}
                            onChange={(e) => setAlgoForm((prev) => ({ ...prev, recognizeTypeLabel: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">OTA 升级包路径（可选）</label>
                        <input
                          className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                          value={algoForm.otaPath}
                          onChange={(e) => setAlgoForm((prev) => ({ ...prev, otaPath: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-3 border-t border-border pt-4">
                <h4 className="text-xs text-primary font-semibold border-l-2 border-primary pl-2">告警与置信度</h4>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">告警方式</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`flex-1 px-2 py-1.5 rounded border text-xs ${
                        algoForm.alertMethod === 'video'
                          ? 'border-primary bg-primary/20 text-primary'
                          : 'border-border text-muted-foreground'
                      }`}
                      onClick={() => setAlgoForm((prev) => ({ ...prev, alertMethod: 'video' }))}
                    >
                      视频告警
                    </button>
                    <button
                      type="button"
                      className={`flex-1 px-2 py-1.5 rounded border text-xs ${
                        algoForm.alertMethod === 'frame'
                          ? 'border-primary bg-primary/20 text-primary'
                          : 'border-border text-muted-foreground'
                      }`}
                      onClick={() => setAlgoForm((prev) => ({ ...prev, alertMethod: 'frame' }))}
                    >
                      截帧告警
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">置信度调整（0–100）</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      className="w-16 px-2 py-1.5 bg-background border border-border rounded text-white text-xs"
                      value={algoForm.confidence}
                      onChange={(e) => {
                        const v = Math.min(100, Math.max(0, Number(e.target.value) || 0));
                        setAlgoForm((prev) => ({ ...prev, confidence: v }));
                      }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      className="flex-1 accent-primary"
                      value={algoForm.confidence}
                      onChange={(e) =>
                        setAlgoForm((prev) => ({ ...prev, confidence: Number(e.target.value) }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 text-xs">
                <button
                  className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white hover:bg-secondary"
                  onClick={() => setShowAccessModal(false)}
                >
                  取消
                </button>
                <button
                  className="px-4 py-2 rounded border border-primary bg-primary/80 text-primary-foreground"
                  onClick={handleSaveAlgo}
                >
                  保存接入配置
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 绑定与调度分发 - 向导式弹窗 */}
        {showBindModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 overflow-y-auto py-8">
            <div className="bg-[#050816] border border-primary/40 rounded-xl w-full max-w-2xl p-6 shadow-2xl text-sm my-auto">
              <h3 className="text-lg font-semibold text-white mb-2">部署向导</h3>
              <p className="text-xs text-muted-foreground mb-4">按步骤完成设备绑定与算法、策略的部署</p>
              {/* 步骤指示 */}
              <div className="flex items-center justify-between mb-6">
                {[
                  { step: 1, label: '绑定设备' },
                  { step: 2, label: '选择算法' },
                  { step: 3, label: '后处理策略' },
                  { step: 4, label: '配置参数' },
                  { step: 5, label: '确认部署' },
                ].map(({ step, label }, i) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${bindWizardStep >= step ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground border border-border'}`}>
                        {bindWizardStep > step ? <Check size={14} /> : step}
                      </div>
                      <span className={`text-[10px] mt-1 ${bindWizardStep >= step ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
                    </div>
                    {i < 4 && <div className={`flex-1 h-0.5 mx-1 max-w-[24px] ${bindWizardStep > step ? 'bg-primary' : 'bg-border'}`} />}
                  </React.Fragment>
                ))}
              </div>
              {/* 步骤内容 */}
              <div className="min-h-[240px] border border-border rounded-lg p-5 bg-background/40">
                {bindWizardStep === 1 && (
                  <>
                    <h4 className="text-xs text-primary font-semibold mb-3 border-l-2 border-primary pl-2">步骤 1：绑定设备</h4>
                    <p className="text-xs text-muted-foreground mb-3">选择要部署到的设备</p>
                    <div className="space-y-2 max-h-48 overflow-auto">
                      {DEVICE_LIST.map((d) => {
                        const checked = selectedDevices.includes(d.id);
                        return (
                          <label key={d.id} className="flex items-center justify-between px-3 py-2 rounded border border-border bg-background/60 hover:border-primary/60 cursor-pointer text-xs text-slate-100">
                            <span>{d.name}</span>
                            <input type="checkbox" className="accent-primary" checked={checked} onChange={() => toggleDevice(d.id)} />
                          </label>
                        );
                      })}
                    </div>
                  </>
                )}
                {bindWizardStep === 2 && (
                  <>
                    <h4 className="text-xs text-primary font-semibold mb-3 border-l-2 border-primary pl-2">步骤 2：选择算法</h4>
                    <p className="text-xs text-muted-foreground mb-3">从算法资源池中选择要分发的算法</p>
                    <select className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={bindAlgoId} onChange={(e) => setBindAlgoId(e.target.value)}>
                      <option value="">请选择算法</option>
                      {algorithms.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}（{a.type === 'cloud' ? '云端' : a.type === 'air' ? '机载' : '边缘'}）</option>
                      ))}
                    </select>
                  </>
                )}
                {bindWizardStep === 3 && (
                  <>
                    <h4 className="text-xs text-primary font-semibold mb-3 border-l-2 border-primary pl-2">步骤 3：选择后处理策略</h4>
                    <p className="text-xs text-muted-foreground mb-3">从后处理策略中选择要分发的策略</p>
                    <select className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={bindStrategyId} onChange={(e) => setBindStrategyId(e.target.value)}>
                      <option value="">请选择后处理策略</option>
                      {strategies.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </>
                )}
                {bindWizardStep === 4 && (
                  <>
                    <h4 className="text-xs text-primary font-semibold mb-3 border-l-2 border-primary pl-2">步骤 4：配置参数</h4>
                    <p className="text-xs text-muted-foreground mb-3">配置部署参数，如版本、启动参数等</p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">版本（可选）</label>
                        <input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={deployParams.version} onChange={(e) => setDeployParams((p) => ({ ...p, version: e.target.value }))} placeholder="如：1.0.0" />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">启动参数（可选）</label>
                        <input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs font-mono" value={deployParams.launchArgs} onChange={(e) => setDeployParams((p) => ({ ...p, launchArgs: e.target.value }))} placeholder="如：--gpu 0 --batch 4" />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">环境变量（可选，KEY=VALUE 每行一个）</label>
                        <textarea rows={2} className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs font-mono resize-none" value={deployParams.envVars} onChange={(e) => setDeployParams((p) => ({ ...p, envVars: e.target.value }))} placeholder="LOG_LEVEL=info" />
                      </div>
                    </div>
                  </>
                )}
                {bindWizardStep === 5 && (
                  <>
                    <h4 className="text-xs text-primary font-semibold mb-3 border-l-2 border-primary pl-2">步骤 5：确认部署</h4>
                    <p className="text-xs text-muted-foreground mb-3">请确认部署摘要，确认后执行部署</p>
                    <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-muted-foreground">绑定设备：</span><span className="text-slate-200">{selectedDevices.length ? selectedDevices.map((id) => DEVICE_LIST.find((d) => d.id === id)?.name ?? id).join('、') : '—'}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">选择算法：</span><span className="text-slate-200">{bindAlgoId ? algorithms.find((a) => a.id === bindAlgoId)?.name ?? bindAlgoId : '—'}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">后处理策略：</span><span className="text-slate-200">{bindStrategyId ? strategies.find((s) => s.id === bindStrategyId)?.name ?? bindStrategyId : '—'}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">版本：</span><span className="text-slate-200">{deployParams.version || '默认'}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">启动参数：</span><span className="text-slate-200 font-mono break-all">{deployParams.launchArgs || '—'}</span></div>
                      {deployParams.envVars && <div className="flex justify-between"><span className="text-muted-foreground">环境变量：</span><span className="text-slate-200 font-mono text-[11px] break-all">{deployParams.envVars}</span></div>}
                    </div>
                  </>
                )}
              </div>
              <div className="mt-6 flex justify-between gap-3 text-xs">
                <button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white hover:bg-secondary" onClick={() => setShowBindModal(false)}>取消</button>
                <div className="flex gap-2">
                  {bindWizardStep > 1 && (
                    <button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white flex items-center gap-1" onClick={() => setBindWizardStep((bindWizardStep - 1) as 1 | 2 | 3 | 4 | 5)}><ChevronLeft size={14} /> 上一步</button>
                  )}
                  {bindWizardStep < 5 ? (
                    <button
                      className="px-4 py-2 rounded border border-primary bg-primary/80 text-primary-foreground flex items-center gap-1"
                      onClick={() => setBindWizardStep((bindWizardStep + 1) as 1 | 2 | 3 | 4 | 5)}
                    >
                      下一步 <ChevronRight size={14} />
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 rounded border border-primary bg-primary text-primary-foreground flex items-center gap-1"
                      onClick={() => { handleSaveBind(); setShowBindModal(false); setBindWizardStep(1); }}
                    >
                      <Check size={14} /> 执行部署
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 后处理策略创建/编辑弹窗（三类型 Tabs） */}
        {showStrategyModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 overflow-y-auto py-8">
            <div className="bg-[#050816] border border-primary/40 rounded-xl w-full max-w-2xl p-6 shadow-2xl text-sm my-auto">
              <h3 className="text-lg font-semibold text-white mb-4">{editingStrategyId ? '编辑后处理策略' : '创建新策略'}</h3>
              <div className="space-y-4">
                <h4 className="text-xs text-primary font-semibold border-l-2 border-primary pl-2">基础信息</h4>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">策略名称</label>
                  <input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={strategyForm.name} onChange={(e) => setStrategyForm((p) => ({ ...p, name: e.target.value }))} placeholder="如：违停证据链生成策略" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">策略描述</label>
                  <textarea rows={2} className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs resize-none" value={strategyForm.description} onChange={(e) => setStrategyForm((p) => ({ ...p, description: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">关联算法（多选，从算法资源池选择）</label>
                  <select
                    multiple
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs min-h-[80px]"
                    value={strategyForm.algoIds}
                    onChange={(e) => {
                      const opts = Array.from(e.target.selectedOptions, (o) => o.value);
                      setStrategyForm((p) => ({ ...p, algoIds: opts }));
                    }}
                  >
                    {algorithms.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-amber-400/90 mt-1">若该算法不支持后处理，请选择支持后处理的算法。</p>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">策略类型</label>
                  <div className="flex gap-2">
                    {(['evidence', 'traffic', 'custom'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`px-3 py-1.5 rounded border text-xs ${strategyForm.strategyType === t ? 'border-primary bg-primary/20 text-primary' : 'border-border text-muted-foreground hover:text-white'}`}
                        onClick={() => { setStrategyForm((p) => ({ ...p, strategyType: t })); setStrategyConfigTab(t); }}
                      >
                        {t === 'evidence' ? '证据链生成' : t === 'traffic' ? '电警数据推送' : '自定义'}
                      </button>
                    ))}
                  </div>
                </div>

                <h4 className="text-xs text-primary font-semibold border-l-2 border-primary pl-2 mt-4">后处理逻辑配置</h4>
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="flex border-b border-border">
                    {(['evidence', 'traffic', 'custom'] as const).map((t) => (
                      <button key={t} type="button" className={`px-4 py-2 text-xs ${strategyConfigTab === t ? 'bg-primary/20 text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-white'}`} onClick={() => setStrategyConfigTab(t)}>
                        {t === 'evidence' ? '证据链生成服务' : t === 'traffic' ? '电警数据推送服务' : '自定义逻辑'}
                      </button>
                    ))}
                  </div>
                  <div className="p-4 bg-background/40">
                    {strategyConfigTab === 'evidence' && (
                      <>
                        <p className="text-xs text-muted-foreground mb-2">配置可配置绘制要素（勾选需在图片上绘制的要素）：</p>
                        <div className="flex flex-wrap gap-3 mb-3">
                          {['车牌框', '违停框', '时间戳', '违法类型', '地点'].map((el) => (
                            <label key={el} className="flex items-center gap-2 text-xs cursor-pointer">
                              <input type="checkbox" className="accent-primary" checked={strategyForm.drawElements.includes(el)} onChange={(e) => setStrategyForm((p) => ({ ...p, drawElements: e.target.checked ? [...p.drawElements, el] : p.drawElements.filter((x) => x !== el) }))} />
                              {el}
                            </label>
                          ))}
                        </div>
                        {showDrawPreview && (
                          <div className="mt-2 p-3 rounded border border-border bg-secondary/30">
                            <p className="text-[11px] text-muted-foreground mb-2">实时预览（勾选后效果）：</p>
                            <div className="w-full h-24 rounded bg-slate-800/80 border border-dashed border-slate-600 flex items-center justify-center text-xs text-slate-500 relative">
                              {strategyForm.drawElements.length === 0 ? '未勾选绘制要素' : strategyForm.drawElements.map((e) => <span key={e} className="absolute px-1.5 py-0.5 rounded bg-primary/30 text-primary text-[10px] border border-primary/50" style={{ left: `${strategyForm.drawElements.indexOf(e) * 18 + 8}%`, top: '40%' }}>{e}</span>)}
                            </div>
                          </div>
                        )}
                        <p className="text-[11px] text-muted-foreground mt-3">启用后，算法输出结果将自动调用此服务生成最终证据图。</p>
                      </>
                    )}
                    {strategyConfigTab === 'traffic' && (
                      <>
                        <div className="space-y-2 mb-3">
                          <label className="block text-xs text-muted-foreground">接口地址</label>
                          <input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs font-mono" value={strategyForm.apiUrl} onChange={(e) => setStrategyForm((p) => ({ ...p, apiUrl: e.target.value }))} placeholder="https://..." />
                        </div>
                        <div className="space-y-2 mb-3">
                          <label className="block text-xs text-muted-foreground">请求头（键值对）</label>
                          <textarea rows={2} className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs font-mono" value={Object.entries(strategyForm.requestHeaders).map(([k, v]) => `${k}: ${v}`).join('\n')} onChange={(e) => { const lines = e.target.value.split('\n'); const obj: Record<string, string> = {}; lines.forEach((line) => { const i = line.indexOf(':'); if (i > 0) obj[line.slice(0, i).trim()] = line.slice(i + 1).trim(); }); setStrategyForm((p) => ({ ...p, requestHeaders: obj })); }} placeholder="Content-Type: application/json" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs text-muted-foreground">请求体模板（支持变量如 ${'${plate}'}、${'${time}'}）</label>
                            <button type="button" className="text-xs text-primary border border-primary/50 px-2 py-1 rounded hover:bg-primary/10 flex items-center gap-1" onClick={() => setShowVariableHelper(!showVariableHelper)}><HelpCircle size={12} /> 变量助手</button>
                          </div>
                          {showVariableHelper && (
                            <div className="p-2 rounded bg-secondary/50 border border-border text-[11px] text-slate-300 mb-2">
                              可用变量：<code className="mx-1 text-primary">${'${plate}'}</code> <code className="mx-1 text-primary">${'${time}'}</code> <code className="mx-1 text-primary">${'${location}'}</code> <code className="mx-1 text-primary">${'${taskName}'}</code> <code className="mx-1 text-primary">${'${deviceId}'}</code> — 点击复制到模板
                            </div>
                          )}
                          <textarea rows={4} className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs font-mono" value={strategyForm.requestBodyTemplate} onChange={(e) => setStrategyForm((p) => ({ ...p, requestBodyTemplate: e.target.value }))} placeholder='{"plate":"${plate}","time":"${time}"}' />
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-2">生成证据链后将根据配置的电警地址自动触发推送。</p>
                      </>
                    )}
                    {strategyConfigTab === 'custom' && (
                      <>
                        <div className="space-y-2 mb-3">
                          <label className="block text-xs text-muted-foreground">上传策略文件（.py / .jar 或特定格式）</label>
                          <input type="text" className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={strategyForm.customFile} onChange={(e) => setStrategyForm((p) => ({ ...p, customFile: e.target.value }))} placeholder="选择文件或拖拽到此处" readOnly />
                          <button type="button" className="text-xs px-2 py-1 rounded border border-border text-muted-foreground hover:text-white">选择文件</button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">策略ID</label>
                            <input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={strategyForm.name} onChange={(e) => setStrategyForm((p) => ({ ...p, name: e.target.value }))} />
                          </div>
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">唯一值（用于去重）</label>
                            <input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={strategyForm.customUniqueKey} onChange={(e) => setStrategyForm((p) => ({ ...p, customUniqueKey: e.target.value }))} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">参数定义</label>
                          <div className="border border-border rounded overflow-hidden text-xs">
                            <table className="w-full">
                              <thead className="bg-secondary text-muted-foreground"><tr><th className="px-2 py-1.5 text-left">参数名</th><th className="px-2 py-1.5 text-left">类型</th><th className="px-2 py-1.5 text-left">默认值</th><th className="w-8" /></tr></thead>
                              <tbody className="text-slate-200">
                                {strategyForm.customParams.map((param, idx) => (
                                  <tr key={idx} className="border-t border-border">
                                    <td className="px-2 py-1.5"><input className="w-full bg-background border border-border rounded px-1.5 py-1 text-white" value={param.name} onChange={(e) => { const n = [...strategyForm.customParams]; n[idx] = { ...n[idx], name: e.target.value }; setStrategyForm((p) => ({ ...p, customParams: n })); }} /></td>
                                    <td className="px-2 py-1.5"><input className="w-full bg-background border border-border rounded px-1.5 py-1 text-white" value={param.type} onChange={(e) => { const n = [...strategyForm.customParams]; n[idx] = { ...n[idx], type: e.target.value }; setStrategyForm((p) => ({ ...p, customParams: n })); }} placeholder="string/number" /></td>
                                    <td className="px-2 py-1.5"><input className="w-full bg-background border border-border rounded px-1.5 py-1 text-white" value={param.defaultValue} onChange={(e) => { const n = [...strategyForm.customParams]; n[idx] = { ...n[idx], defaultValue: e.target.value }; setStrategyForm((p) => ({ ...p, customParams: n })); }} /></td>
                                    <td><button type="button" className="text-red-400 hover:underline" onClick={() => setStrategyForm((p) => ({ ...p, customParams: p.customParams.filter((_, i) => i !== idx) }))}>删</button></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <button type="button" className="w-full py-1.5 border-t border-border text-primary text-xs hover:bg-primary/10" onClick={() => setStrategyForm((p) => ({ ...p, customParams: [...p.customParams, { name: '', type: 'string', defaultValue: '' }] }))}>+ 添加参数</button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground border border-border rounded p-2 bg-secondary/30">系统将自动记录所有后处理操作的日志（发送时间、通道、接收人、发送状态），可在消息审计模块查看。</p>
              </div>
              <div className="mt-6 flex justify-end gap-3 text-xs">
                <button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white hover:bg-secondary" onClick={() => { setShowStrategyModal(false); setEditingStrategyId(null); }}>取消</button>
                <button className="px-4 py-2 rounded border border-amber-500/50 text-amber-400 hover:bg-amber-500/20" onClick={() => window.alert('测试：模拟算法输出，验证后处理逻辑')}>测试</button>
                <button className="px-4 py-2 rounded border border-primary bg-primary/80 text-primary-foreground" onClick={handleSaveStrategy}>保存</button>
              </div>
            </div>
          </div>
        )}

        {/* 日志编辑弹窗 */}
        {editingLog && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
            <div className="bg-[#050816] border border-primary/40 rounded-xl w-full max-w-lg p-6 shadow-2xl text-sm">
              <h3 className="text-lg font-semibold text-white mb-4">编辑日志</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">算法名称</label>
                  <input
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                    value={logEditForm.algoName}
                    onChange={(e) => setLogEditForm((p) => ({ ...p, algoName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">算法类型</label>
                  <select
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                    value={logEditForm.algoType}
                    onChange={(e) => setLogEditForm((p) => ({ ...p, algoType: e.target.value as AlgoType }))}
                  >
                    <option value="cloud">云端</option>
                    <option value="edge">边缘</option>
                    <option value="air">机载</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">触发时间</label>
                  <input
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs font-mono"
                    value={logEditForm.time}
                    onChange={(e) => setLogEditForm((p) => ({ ...p, time: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">输入数据</label>
                  <input
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                    value={logEditForm.input}
                    onChange={(e) => setLogEditForm((p) => ({ ...p, input: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">输出结果</label>
                  <input
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                    value={logEditForm.output}
                    onChange={(e) => setLogEditForm((p) => ({ ...p, output: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">关联任务 ID</label>
                  <input
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                    value={logEditForm.taskId}
                    onChange={(e) => setLogEditForm((p) => ({ ...p, taskId: e.target.value }))}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3 text-xs">
                <button
                  className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white hover:bg-secondary"
                  onClick={() => setEditingLog(null)}
                >
                  取消
                </button>
                <button
                  className="px-4 py-2 rounded border border-primary bg-primary/80 text-primary-foreground"
                  onClick={handleSaveLogEdit}
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AlgorithmManager;

