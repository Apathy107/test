import React, { useEffect, useMemo, useState } from 'react';
import {
  Send,
  RefreshCw,
  AlertTriangle,
  UserCheck,
  Database,
  ClipboardList,
  FileCheck,
  Inbox,
  ChevronRight,
  Download,
  Search,
  Edit2,
  Trash2,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Smartphone,
  Mail,
  Bell,
  Plus,
  Users,
} from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import { useAudit } from '@/contexts/AuditContext';
import {
  NOTIFICATION_READ_EVENT,
  NOTIFICATION_DELETE_EVENT,
  useNotificationsOptional,
} from '@/contexts/NotificationContext';

type MainTab =
  | 'generate'
  | 'status'
  | 'tier'
  | 'channel'
  | 'template'
  | 'audit';

// ----- 消息生成与分发：卡片源 -----
const SOURCE_CARDS = [
  {
    key: 'device',
    title: '设备预警通知',
    icon: AlertTriangle,
    status: '正常' as const,
    statusTone: 'normal' as const,
    count: 2,
    detail: '设备状态正常/预警，点击查看设备详情',
    link: '/device',
  },
  {
    key: 'qualification',
    title: '人员资质预警',
    icon: UserCheck,
    status: '1条即将过期',
    statusTone: 'warn' as const,
    count: 1,
    detail: '资质过期预警，点击跳转人员管理',
    link: '/personnel',
  },
  {
    key: 'thirdparty',
    title: '第三方数据通知',
    icon: Database,
    status: '已接入',
    statusTone: 'normal' as const,
    count: 3,
    detail: '接入数据源状态',
    link: '/system/api-center',
  },
  {
    key: 'task',
    title: '任务异常通知',
    icon: ClipboardList,
    status: '0 失败',
    statusTone: 'normal' as const,
    count: 0,
    detail: '任务执行失败统计',
    link: '/mission',
  },
  {
    key: 'business',
    title: '业务处置通知',
    icon: FileCheck,
    status: '2 待办',
    statusTone: 'warn' as const,
    count: 2,
    detail: '待办事项通知',
    link: '#',
  },
  {
    key: 'other',
    title: '其他消息通知',
    icon: Inbox,
    status: '—',
    statusTone: 'normal' as const,
    count: 0,
    detail: '其他消息',
    link: '#',
  },
];

// ----- 消息状态 -----
type SendStatus = '成功' | '失败' | '待发送';
interface StatusRow {
  id: string;
  msgType: string;
  title: string;
  receiver: string;
  sendTime: string;
  status: SendStatus;
  retryCount: number;
  read: boolean;
  pushChannels?: string[]; // 推送方式，用于筛选
}

// ----- 分级策略 -----
type TierKey = 'P0' | 'P1' | 'P2' | string; // 支持自定义新增分级
interface TierPolicy {
  key: string;
  label: string;
  color: string;
  channels: string[];
  retryCount: number;
  retryInterval: number; // 分钟
}

// ----- 推送通道 -----
type ChannelType = 'app' | 'sms' | 'inbox';

// ----- 消息模板 -----
type TemplateType = '短信' | '邮件' | '站内信';
interface TemplateRow {
  id: string;
  name: string;
  type: TemplateType;
  createdAt: string;
  enabled: boolean;
  content: string;
}

// ----- 消息审计 -----
interface MessageAuditRow {
  id: string;
  operator: string;
  actionType: string;
  opTime: string;
  messageId: string;
  detail: string;
  result: string;
}

const defaultStatusRows: StatusRow[] = [
  { id: 'msg-1', msgType: '设备预警通知', title: '高空瞭望2号 电量低于安全线', receiver: '指挥长', sendTime: '2024-03-06 10:30:00', status: '成功', retryCount: 0, read: false, pushChannels: ['站内信', '短信'] },
  { id: 'msg-2', msgType: '人员资质预警', title: '飞行人员 [李强] 资质即将到期', receiver: '李强、管理员', sendTime: '2024-03-06 09:15:00', status: '成功', retryCount: 0, read: true, pushChannels: ['站内信'] },
  { id: 'msg-3', msgType: '任务异常通知', title: '东湖巡检 航线执行异常中断', receiver: '值班指挥', sendTime: '2024-03-06 08:02:00', status: '失败', retryCount: 2, read: true, pushChannels: ['站内信', 'APP推送'] },
  { id: 'msg-4', msgType: '业务处置通知', title: '待复核：违停异常事件', receiver: '交警大队审核岗', sendTime: '2024-03-05 18:00:00', status: '待发送', retryCount: 0, read: false, pushChannels: ['站内信'] },
];

const MESSAGE_CATEGORIES = ['设备预警通知', '人员资质预警', '第三方数据通知', '任务异常通知', '业务处置通知', '其他消息通知'] as const;
const PUSH_OPTIONS = ['站内信', '短信', '电话', 'APP推送'];

const defaultTierPolicies: TierPolicy[] = [
  { key: 'P0', label: 'P0级（红色）', color: 'red', channels: ['短信', '电话'], retryCount: 5, retryInterval: 2 },
  { key: 'P1', label: 'P1级（橙色）', color: 'orange', channels: ['站内信', '短信'], retryCount: 3, retryInterval: 5 },
  { key: 'P2', label: 'P2级（黄色）', color: 'yellow', channels: ['站内信'], retryCount: 1, retryInterval: 10 },
];

const defaultTemplates: TemplateRow[] = [
  { id: 't1', name: '设备告警模板', type: '站内信', createdAt: '2024-02-01', enabled: true, content: '设备 {deviceName} 发生 {alarmType}，请及时处理。' },
  { id: 't2', name: '资质到期提醒', type: '短信', createdAt: '2024-02-10', enabled: true, content: '【低空管控】{userName} 的资质将于 {expireDate} 到期，请尽快复审。' },
  { id: 't3', name: '任务异常通知', type: '站内信', createdAt: '2024-03-01', enabled: false, content: '任务 {taskName} 执行异常：{reason}' },
];

const defaultAuditRows: MessageAuditRow[] = [
  { id: 'ma1', operator: '管理员', actionType: '发送', opTime: '2024-03-06 10:30:00', messageId: 'msg-1', detail: '发送设备预警至 指挥长', result: '成功' },
  { id: 'ma2', operator: '系统', actionType: '重发', opTime: '2024-03-06 09:20:00', messageId: 'msg-3', detail: '重发失败消息', result: '成功' },
];

const MessageManager: React.FC = () => {
  const { addLog } = useAudit();
  const notificationContext = useNotificationsOptional();
  const [activeTab, setActiveTab] = useState<MainTab>('generate');

  // Tab1: 消息生成与分发（看板模式：分类标签页 + 筛选）
  const [generateCategory, setGenerateCategory] = useState<string>(MESSAGE_CATEGORIES[0]);
  const [generateFilterType, setGenerateFilterType] = useState<string>('');
  const [generateFilterPush, setGenerateFilterPush] = useState<string>('');
  const [generateFilterRead, setGenerateFilterRead] = useState<'all' | 'read' | 'unread'>('all');
  const [generateTimeFrom, setGenerateTimeFrom] = useState('');
  const [generateTimeTo, setGenerateTimeTo] = useState('');

  // Tab2: 消息状态管理
  const [statusRows, setStatusRows] = useState<StatusRow[]>(defaultStatusRows);
  const [filterMsgId, setFilterMsgId] = useState('');
  const [filterMsgType, setFilterMsgType] = useState('');
  const [filterStatus, setFilterStatus] = useState<SendStatus | ''>('');
  const [filterTimeFrom, setFilterTimeFrom] = useState('');
  const [filterTimeTo, setFilterTimeTo] = useState('');
  const [selectedStatusIds, setSelectedStatusIds] = useState<Set<string>>(new Set());
  const [statusDetailId, setStatusDetailId] = useState<string | null>(null);

  // 手动触发 -> 新建预警弹窗
  const [showNewAlertModal, setShowNewAlertModal] = useState(false);
  const [newAlertSourceKey, setNewAlertSourceKey] = useState('');
  const [newAlertForm, setNewAlertForm] = useState({ title: '', content: '', receiver: '', level: 'P1' as 'P0' | 'P1' | 'P2' });

  // Tab3: 消息分级策略
  const [tierPolicies, setTierPolicies] = useState<TierPolicy[]>(defaultTierPolicies);
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [tierForm, setTierForm] = useState({ channels: [] as string[], retryCount: 3, retryInterval: 5 });
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [newTierForm, setNewTierForm] = useState({ key: '', label: '', color: 'slate', channels: [] as string[], retryCount: 2, retryInterval: 5 });

  // Tab4: 推送通道管理
  const [appConfig, setAppConfig] = useState({ appId: '', appKey: '', secret: '' });
  const [smsConfig, setSmsConfig] = useState({ apiKey: '', sign: '', templateId: '' });
  const [inboxConfig, setInboxConfig] = useState({ callbackUrl: '', authType: 'token' });
  const [channelTestResult, setChannelTestResult] = useState<Record<ChannelType | 'custom', string | null>>({ app: null, sms: null, inbox: null, custom: null });
  // 推送给指定人员
  const [targetPersons, setTargetPersons] = useState<{ id: string; name: string; type: 'user' | 'role' }[]>([]);
  const [targetPersonInput, setTargetPersonInput] = useState('');
  // 自定义推送通道列表
  const [customChannels, setCustomChannels] = useState<{ id: string; name: string; endpoint: string; auth: string }[]>([]);
  const [showAddChannelModal, setShowAddChannelModal] = useState(false);
  const [customChannelForm, setCustomChannelForm] = useState({ name: '', endpoint: '', auth: '' });

  // Tab5: 消息模板与配置
  const [templates, setTemplates] = useState<TemplateRow[]>(defaultTemplates);
  const [templateFilterName, setTemplateFilterName] = useState('');
  const [templateFilterType, setTemplateFilterType] = useState<TemplateType | ''>('');
  const [templateFilterEnabled, setTemplateFilterEnabled] = useState<boolean | ''>('');
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [templateForm, setTemplateForm] = useState({ name: '', type: '站内信' as TemplateType, content: '', enabled: true });
  const [previewVars, setPreviewVars] = useState({ userName: '张三', deviceName: '高空瞭望2号', taskName: '东湖巡检', alarmType: '电量低', expireDate: '2024-04-01', reason: '强风干扰' });

  // Tab6: 消息审计与日志（支持批量导出）
  const [auditRows, setAuditRows] = useState<MessageAuditRow[]>(defaultAuditRows);
  const [auditOperator, setAuditOperator] = useState('');
  const [auditActionType, setAuditActionType] = useState('');
  const [auditTimeFrom, setAuditTimeFrom] = useState('');
  const [auditMsgId, setAuditMsgId] = useState('');
  const [selectedAuditIds, setSelectedAuditIds] = useState<Set<string>>(new Set());

  // 同步所有消息至全局通知（右上角铃铛）
  useEffect(() => {
    if (notificationContext) {
      notificationContext.replaceFromMessageManager(
        statusRows.map((r) => ({
          id: r.id,
          title: r.title,
          msgType: r.msgType,
          sendTime: r.sendTime,
          read: r.read,
          receiver: r.receiver,
        }))
      );
    }
  }, [statusRows, notificationContext]);

  // 监听右上角“标为已读”同步回列表
  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{ ids: string[] }>;
      const ids = ev.detail?.ids;
      if (!ids?.length) return;
      setStatusRows((prev) =>
        prev.map((r) => (ids.includes(r.id) ? { ...r, read: true } : r))
      );
    };
    window.addEventListener(NOTIFICATION_READ_EVENT, handler);
    return () => window.removeEventListener(NOTIFICATION_READ_EVENT, handler);
  }, []);

  // 监听右上角“批量删除”同步回列表
  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{ ids: string[] }>;
      const ids = ev.detail?.ids;
      if (!ids?.length) return;
      setStatusRows((prev) => prev.filter((r) => !ids.includes(r.id)));
    };
    window.addEventListener(NOTIFICATION_DELETE_EVENT, handler);
    return () => window.removeEventListener(NOTIFICATION_DELETE_EVENT, handler);
  }, []);

  const filteredStatus = useMemo(() => {
    return statusRows.filter((r) => {
      if (filterMsgId && !r.id.toLowerCase().includes(filterMsgId.toLowerCase())) return false;
      if (filterMsgType && r.msgType !== filterMsgType) return false;
      if (filterStatus && r.status !== filterStatus) return false;
      if (filterTimeFrom && r.sendTime < filterTimeFrom) return false;
      if (filterTimeTo && r.sendTime > filterTimeTo) return false;
      return true;
    });
  }, [statusRows, filterMsgId, filterMsgType, filterStatus, filterTimeFrom, filterTimeTo]);

  // 消息看板：按分类 + 筛选后的列表
  const boardMessages = useMemo(() => {
    const mainCats: string[] = MESSAGE_CATEGORIES.slice(0, 5) as string[];
    const catFiltered =
      generateCategory === '其他消息通知'
        ? statusRows.filter((r) => !mainCats.includes(r.msgType))
        : statusRows.filter((r) => r.msgType === generateCategory);
    return catFiltered.filter((r) => {
      if (generateFilterType && r.msgType !== generateFilterType) return false;
      if (generateFilterPush && (!r.pushChannels || !r.pushChannels.includes(generateFilterPush))) return false;
      if (generateFilterRead === 'read' && !r.read) return false;
      if (generateFilterRead === 'unread' && r.read) return false;
      if (generateTimeFrom && r.sendTime < generateTimeFrom) return false;
      if (generateTimeTo && r.sendTime > generateTimeTo) return false;
      return true;
    }).sort((a, b) => (b.sendTime > a.sendTime ? 1 : -1));
  }, [statusRows, generateCategory, generateFilterType, generateFilterPush, generateFilterRead, generateTimeFrom, generateTimeTo]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      if (templateFilterName && !t.name.toLowerCase().includes(templateFilterName.toLowerCase())) return false;
      if (templateFilterType && t.type !== templateFilterType) return false;
      if (templateFilterEnabled !== '' && t.enabled !== templateFilterEnabled) return false;
      return true;
    });
  }, [templates, templateFilterName, templateFilterType, templateFilterEnabled]);

  const filteredAudit = useMemo(() => {
    return auditRows.filter((r) => {
      if (auditOperator && !r.operator.toLowerCase().includes(auditOperator.toLowerCase())) return false;
      if (auditActionType && r.actionType !== auditActionType) return false;
      if (auditTimeFrom && r.opTime < auditTimeFrom) return false;
      if (auditMsgId && !r.messageId.toLowerCase().includes(auditMsgId.toLowerCase())) return false;
      return true;
    });
  }, [auditRows, auditOperator, auditActionType, auditTimeFrom, auditMsgId]);

  const handleManualTrigger = (sourceKey: string) => {
    setNewAlertSourceKey(sourceKey);
    setNewAlertForm({
      title: '',
      content: '',
      receiver: '当前用户',
      level: 'P1',
    });
    setShowNewAlertModal(true);
  };

  const submitNewAlert = () => {
    const msgType = SOURCE_CARDS.find((c) => c.key === newAlertSourceKey)?.title ?? newAlertSourceKey;
    const title = newAlertForm.title || `[手动触发] ${newAlertSourceKey} 预警消息`;
    const id = `msg-trigger-${Date.now()}`;
    setStatusRows((prev) => [
      ...prev,
      {
        id,
        msgType,
        title,
        receiver: newAlertForm.receiver || '当前用户',
        sendTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        status: '成功' as const,
        retryCount: 0,
        read: false,
        pushChannels: ['站内信'],
      },
    ]);
    addLog({ actionType: '执行', module: '消息管理', targetObject: '消息生成与分发', detailSummary: `手动触发新建预警：${msgType} - ${title}` });
    setShowNewAlertModal(false);
  };

  const markStatusRead = (id: string, read: boolean) => {
    setStatusRows((prev) => prev.map((r) => (r.id === id ? { ...r, read } : r)));
  };

  const toggleStatusSelect = (id: string) => {
    setSelectedStatusIds((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const batchResend = () => {
    const ids = selectedStatusIds.size ? Array.from(selectedStatusIds) : filteredStatus.filter((r) => r.status === '失败').map((r) => r.id);
    ids.forEach((id) => {
      setStatusRows((prev) => prev.map((r) => (r.id === id && r.status === '失败' ? { ...r, status: '成功' as const, retryCount: r.retryCount + 1 } : r)));
    });
    addLog({ actionType: '修改', module: '消息管理', targetObject: '消息状态', detailSummary: `批量重发消息，共 ${ids.length} 条` });
    setSelectedStatusIds(new Set());
  };

  const statusDetailRow = statusRows.find((r) => r.id === statusDetailId);

  const resendOne = (id: string) => {
    setStatusRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: '成功' as const, retryCount: r.retryCount + 1 } : r)));
    addLog({ actionType: '修改', module: '消息管理', targetObject: '消息状态', detailSummary: `重发单条消息：${id}` });
  };

  const openTierEdit = (key: string) => {
    const p = tierPolicies.find((t) => t.key === key);
    if (p) {
      setTierForm({ channels: [...p.channels], retryCount: p.retryCount, retryInterval: p.retryInterval });
      setEditingTier(key);
    }
  };

  const saveTier = () => {
    if (!editingTier) return;
    setTierPolicies((prev) => prev.map((p) => (p.key === editingTier ? { ...p, ...tierForm } : p)));
    addLog({ actionType: '修改', module: '消息管理', targetObject: '消息分级策略', detailSummary: `编辑 ${editingTier} 策略：${tierForm.channels.join('、')}，重试 ${tierForm.retryCount} 次/间隔 ${tierForm.retryInterval} 分钟` });
    setEditingTier(null);
  };

  const saveNewTier = () => {
    if (!newTierForm.key.trim() || !newTierForm.label.trim()) return;
    const key = newTierForm.key.trim().toUpperCase().replace(/\s/g, '');
    if (tierPolicies.some((p) => p.key === key)) { window.alert('该分级已存在'); return; }
    setTierPolicies((prev) => [
      ...prev,
      {
        key,
        label: newTierForm.label.trim(),
        color: newTierForm.color,
        channels: newTierForm.channels,
        retryCount: newTierForm.retryCount,
        retryInterval: newTierForm.retryInterval,
      },
    ]);
    addLog({ actionType: '新增', module: '消息管理', targetObject: '消息分级策略', detailSummary: `新增分级：${newTierForm.label}` });
    setShowAddTierModal(false);
    setNewTierForm({ key: '', label: '', color: 'slate', channels: [], retryCount: 2, retryInterval: 5 });
  };

  const deleteTier = (key: string) => {
    if (!window.confirm(`确定删除分级 ${key}？`)) return;
    setTierPolicies((prev) => prev.filter((p) => p.key !== key));
    if (editingTier === key) setEditingTier(null);
  };

  const testChannel = (type: ChannelType) => {
    setChannelTestResult((prev) => ({ ...prev, [type]: '连接成功' }));
    setTimeout(() => setChannelTestResult((prev) => ({ ...prev, [type]: null })), 2000);
    addLog({ actionType: '查询', module: '消息管理', targetObject: '推送通道', detailSummary: `测试${type === 'app' ? '移动端' : type === 'sms' ? '短信' : '站内信'}通道连接` });
  };

  const openTemplateEdit = (t?: TemplateRow) => {
    if (t) {
      setTemplateForm({ name: t.name, type: t.type, content: t.content, enabled: t.enabled });
      setEditingTemplateId(t.id);
    } else {
      setTemplateForm({ name: '', type: '站内信', content: '', enabled: true });
      setEditingTemplateId('new');
    }
  };

  const saveTemplate = () => {
    if (editingTemplateId === 'new') {
      const newT: TemplateRow = {
        id: `t-${Date.now()}`,
        name: templateForm.name || '未命名模板',
        type: templateForm.type,
        createdAt: new Date().toISOString().slice(0, 10),
        enabled: templateForm.enabled,
        content: templateForm.content,
      };
      setTemplates((prev) => [...prev, newT]);
      addLog({ actionType: '新增', module: '消息管理', targetObject: '消息模板', detailSummary: `新增模板：${newT.name}` });
    } else if (editingTemplateId) {
      setTemplates((prev) => prev.map((t) => (t.id === editingTemplateId ? { ...t, ...templateForm } : t)));
      addLog({ actionType: '修改', module: '消息管理', targetObject: '消息模板', detailSummary: `编辑模板：${templateForm.name}` });
    }
    setEditingTemplateId(null);
  };

  const toggleTemplateEnabled = (id: string) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)));
    addLog({ actionType: '修改', module: '消息管理', targetObject: '消息模板', detailSummary: `启用/禁用模板：${templates.find((t) => t.id === id)?.name ?? id}` });
  };

  const deleteTemplate = (id: string) => {
    const name = templates.find((t) => t.id === id)?.name ?? id;
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    addLog({ actionType: '删除', module: '消息管理', targetObject: '消息模板', detailSummary: `删除模板：${name}`, isHighRisk: true });
  };

  const previewContent = useMemo(() => {
    let s = templateForm.content;
    Object.entries(previewVars).forEach(([k, v]) => {
      s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    });
    return s;
  }, [templateForm.content, previewVars]);

  const exportMessageAudit = (batchOnly?: boolean) => {
    const toExport = batchOnly && selectedAuditIds.size > 0 ? filteredAudit.filter((r) => selectedAuditIds.has(r.id)) : filteredAudit;
    const headers = ['操作人', '操作类型', '操作时间', '消息ID', '操作详情', '操作结果'];
    const rows = toExport.map((r) => [r.operator, r.actionType, r.opTime, r.messageId, r.detail, r.result]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `消息审计日志_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addLog({ actionType: '导出', module: '消息管理', targetObject: '消息审计与日志', detailSummary: batchOnly && selectedAuditIds.size > 0 ? `批量导出消息审计日志，共 ${toExport.length} 条` : `导出消息审计日志，共 ${toExport.length} 条` });
  };

  const toggleAuditSelect = (id: string) => {
    setSelectedAuditIds((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const toggleAllAuditSelect = () => {
    if (selectedAuditIds.size === filteredAudit.length) setSelectedAuditIds(new Set());
    else setSelectedAuditIds(new Set(filteredAudit.map((r) => r.id)));
  };

  const addCustomChannel = () => {
    if (!customChannelForm.name.trim() || !customChannelForm.endpoint.trim()) return;
    setCustomChannels((prev) => [...prev, { id: `custom-${Date.now()}`, name: customChannelForm.name.trim(), endpoint: customChannelForm.endpoint.trim(), auth: customChannelForm.auth }]);
    setShowAddChannelModal(false);
    setCustomChannelForm({ name: '', endpoint: '', auth: '' });
    addLog({ actionType: '新增', module: '消息管理', targetObject: '推送通道', detailSummary: `新增自定义推送通道：${customChannelForm.name}` });
  };

  const tabs: { key: MainTab; label: string }[] = [
    { key: 'generate', label: '消息生成与分发' },
    { key: 'status', label: '消息状态管理' },
    { key: 'tier', label: '消息分级策略' },
    { key: 'channel', label: '推送通道管理' },
    { key: 'template', label: '消息模板与配置' },
    { key: 'audit', label: '消息审计与日志' },
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto flex flex-col pb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white tracking-wide">消息管理</h2>
          <p className="text-sm text-muted-foreground mt-1">消息生成与分发、状态追踪、分级策略、推送通道、模板配置与审计日志。</p>
        </div>

        <div className="bg-card tech-border rounded-xl border border-border overflow-hidden">
          {/* 一级导航 Tabs */}
          <div className="flex border-b border-border bg-secondary/30 flex-wrap">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-5 py-3.5 font-medium text-sm tracking-wide transition relative ${
                  activeTab === t.key ? 'text-primary' : 'text-muted-foreground hover:text-white hover:bg-secondary'
                }`}
              >
                {t.label}
                {activeTab === t.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_rgba(0,195,255,0.6)]" />}
              </button>
            ))}
          </div>

          <div className="p-6 bg-background/40 min-h-[520px]">
            {/* 1. 消息生成与分发 - 看板模式 */}
            {activeTab === 'generate' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2 border-b border-border pb-2">
                    {MESSAGE_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setGenerateCategory(cat)}
                        className={`px-3 py-1.5 rounded-t text-xs font-medium transition ${
                          generateCategory === cat
                            ? 'bg-primary/20 text-primary border border-b-0 border-primary/50 -mb-px'
                            : 'border border-transparent text-muted-foreground hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="text-xs px-2 py-1 rounded border border-primary text-primary hover:bg-primary/20 flex items-center gap-1"
                    onClick={() => {
                      const card = SOURCE_CARDS.find((c) => c.title === generateCategory) || SOURCE_CARDS[0];
                      handleManualTrigger(card.key);
                    }}
                  >
                    <Play size={12} /> 手动触发
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                  <span className="text-xs text-muted-foreground">消息类型</span>
                  <select className="px-2 py-1.5 bg-background border border-border rounded text-white text-xs" value={generateFilterType} onChange={(e) => setGenerateFilterType(e.target.value)}>
                    <option value="">全部</option>
                    {MESSAGE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <span className="text-xs text-muted-foreground">推送方式</span>
                  <select className="px-2 py-1.5 bg-background border border-border rounded text-white text-xs" value={generateFilterPush} onChange={(e) => setGenerateFilterPush(e.target.value)}>
                    <option value="">全部</option>
                    {PUSH_OPTIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <span className="text-xs text-muted-foreground">阅读状态</span>
                  <select className="px-2 py-1.5 bg-background border border-border rounded text-white text-xs" value={generateFilterRead} onChange={(e) => setGenerateFilterRead(e.target.value as 'all' | 'read' | 'unread')}>
                    <option value="all">全部</option>
                    <option value="read">已读</option>
                    <option value="unread">未读</option>
                  </select>
                  <span className="text-xs text-muted-foreground">时间</span>
                  <input type="datetime-local" className="px-2 py-1.5 bg-background border border-border rounded text-white text-xs font-mono w-40" value={generateTimeFrom} onChange={(e) => setGenerateTimeFrom(e.target.value.slice(0, 19).replace('T', ' '))} />
                  <span className="text-muted-foreground">至</span>
                  <input type="datetime-local" className="px-2 py-1.5 bg-background border border-border rounded text-white text-xs font-mono w-40" value={generateTimeTo} onChange={(e) => setGenerateTimeTo(e.target.value.slice(0, 19).replace('T', ' '))} />
                </div>
                <div className="border border-border rounded-lg overflow-hidden bg-background/40">
                  <div className="divide-y divide-border max-h-[400px] overflow-auto">
                    {boardMessages.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground text-sm">该分类下暂无消息</div>
                    ) : (
                      boardMessages.map((r) => (
                        <div
                          key={r.id}
                          className={`flex items-center justify-between px-4 py-3 hover:bg-secondary/50 cursor-pointer ${!r.read ? 'bg-primary/5' : ''}`}
                          onClick={() => markStatusRead(r.id, true)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${r.read ? 'text-slate-300' : 'text-white font-medium'}`}>{r.title}</span>
                              {!r.read && <span className="text-[10px] text-primary border border-primary/50 px-1 rounded">未读</span>}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                              <span>{r.receiver}</span>
                              <span className="font-mono">{r.sendTime}</span>
                              {r.pushChannels?.length ? <span>{r.pushChannels.join('、')}</span> : null}
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-muted-foreground shrink-0" />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. 消息状态管理 */}
            {activeTab === 'status' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                  <input placeholder="消息ID" className="px-3 py-1.5 bg-background border border-border rounded text-white text-xs w-32" value={filterMsgId} onChange={(e) => setFilterMsgId(e.target.value)} />
                  <input placeholder="消息类型" className="px-3 py-1.5 bg-background border border-border rounded text-white text-xs w-36" value={filterMsgType} onChange={(e) => setFilterMsgType(e.target.value)} />
                  <select className="px-3 py-1.5 bg-background border border-border rounded text-white text-xs" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as SendStatus | '')}>
                    <option value="">发送状态</option>
                    <option value="成功">成功</option>
                    <option value="失败">失败</option>
                    <option value="待发送">待发送</option>
                  </select>
                  <input type="datetime-local" className="px-2 py-1.5 bg-background border border-border rounded text-white text-xs font-mono w-40" value={filterTimeFrom} onChange={(e) => setFilterTimeFrom(e.target.value.slice(0, 19).replace('T', ' '))} />
                  <span className="text-muted-foreground">至</span>
                  <input type="datetime-local" className="px-2 py-1.5 bg-background border border-border rounded text-white text-xs font-mono w-40" value={filterTimeTo} onChange={(e) => setFilterTimeTo(e.target.value.slice(0, 19).replace('T', ' '))} />
                  <button className="px-3 py-1.5 rounded border border-primary bg-primary/20 text-primary text-xs flex items-center" onClick={() => {}}><Search size={14} className="mr-1" /> 搜索</button>
                  <button className="px-3 py-1.5 rounded border border-amber-500/50 text-amber-400 text-xs flex items-center" onClick={batchResend}><RefreshCw size={14} className="mr-1" /> 批量重发失败消息</button>
                </div>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-secondary border-b border-border text-muted-foreground text-xs">
                      <tr>
                        <th className="w-8 px-3 py-2">
                        <input
                          type="checkbox"
                          checked={(() => {
                            const failed = filteredStatus.filter((r) => r.status === '失败');
                            return failed.length > 0 && selectedStatusIds.size === failed.length;
                          })()}
                          onChange={(e) => {
                            const failed = filteredStatus.filter((r) => r.status === '失败');
                            setSelectedStatusIds(e.target.checked ? new Set(failed.map((r) => r.id)) : new Set());
                          }}
                        />
                      </th>
                        <th className="px-3 py-2">消息ID</th>
                        <th className="px-3 py-2">消息标题</th>
                        <th className="px-3 py-2">接收人</th>
                        <th className="px-3 py-2">发送时间</th>
                        <th className="px-3 py-2">发送状态</th>
                        <th className="px-3 py-2">重试次数</th>
                        <th className="px-3 py-2 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-slate-200 text-xs">
                      {filteredStatus.map((r) => (
                        <tr key={r.id} className={`hover:bg-secondary/50 ${!r.read ? 'bg-primary/5' : ''}`}>
                          <td className="px-3 py-2"><input type="checkbox" checked={selectedStatusIds.has(r.id)} onChange={() => toggleStatusSelect(r.id)} disabled={r.status !== '失败'} /></td>
                          <td className="px-3 py-2 font-mono">{r.id}</td>
                          <td className="px-3 py-2">
                            <span className={r.read ? '' : 'font-medium'}>{r.title}</span>
                            {!r.read && <span className="ml-1 text-[10px] text-primary">未读</span>}
                          </td>
                          <td className="px-3 py-2">{r.receiver}</td>
                          <td className="px-3 py-2 font-mono text-muted-foreground">{r.sendTime}</td>
                          <td className="px-3 py-2">
                            {r.status === '成功' && <span className="text-emerald-400 flex items-center gap-1"><CheckCircle size={12} /> 成功</span>}
                            {r.status === '失败' && <span className="text-red-400 flex items-center gap-1"><XCircle size={12} /> 失败</span>}
                            {r.status === '待发送' && <span className="text-amber-400 flex items-center gap-1"><Clock size={12} /> 待发送</span>}
                          </td>
                          <td className="px-3 py-2">{r.retryCount}</td>
                          <td className="px-3 py-2 text-right">
                            {r.status === '失败' && <button className="text-primary hover:underline mr-2" onClick={() => resendOne(r.id)}>重发</button>}
                            <button className="text-muted-foreground hover:text-white mr-2" onClick={() => setStatusDetailId(r.id)}>查看详情</button>
                            {!r.read && <button className="text-primary hover:underline" onClick={() => markStatusRead(r.id, true)}>标为已读</button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {statusDetailRow && (
                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40" onClick={() => setStatusDetailId(null)}>
                    <div className="bg-[#050816] border border-border rounded-xl w-full max-w-md p-6 text-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
                      <h4 className="text-lg font-semibold text-white mb-4">消息详情</h4>
                      <div className="space-y-2 text-xs">
                        <div><span className="text-muted-foreground">消息ID：</span><span className="text-slate-200 font-mono">{statusDetailRow.id}</span></div>
                        <div><span className="text-muted-foreground">标题：</span><span className="text-slate-200">{statusDetailRow.title}</span></div>
                        <div><span className="text-muted-foreground">类型：</span><span className="text-slate-200">{statusDetailRow.msgType}</span></div>
                        <div><span className="text-muted-foreground">接收人：</span><span className="text-slate-200">{statusDetailRow.receiver}</span></div>
                        <div><span className="text-muted-foreground">发送时间：</span><span className="text-slate-200 font-mono">{statusDetailRow.sendTime}</span></div>
                        <div><span className="text-muted-foreground">状态：</span><span className={statusDetailRow.status === '成功' ? 'text-emerald-400' : statusDetailRow.status === '失败' ? 'text-red-400' : 'text-amber-400'}>{statusDetailRow.status}</span></div>
                        <div><span className="text-muted-foreground">重试次数：</span><span className="text-slate-200">{statusDetailRow.retryCount}</span></div>
                        <div><span className="text-muted-foreground">已读状态：</span><span className={statusDetailRow.read ? 'text-emerald-400' : 'text-amber-400'}>{statusDetailRow.read ? '已读' : '未读'}</span></div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white" onClick={() => setStatusDetailId(null)}>关闭</button>
                        <button className="px-4 py-2 rounded border border-primary/50 text-primary" onClick={() => markStatusRead(statusDetailRow.id, !statusDetailRow.read)}>{statusDetailRow.read ? '标为未读' : '标为已读'}</button>
                        {statusDetailRow.status === '失败' && <button className="px-4 py-2 rounded border border-primary bg-primary/80 text-primary-foreground" onClick={() => { resendOne(statusDetailRow.id); setStatusDetailId(null); }}>重发</button>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. 消息分级策略 */}
            {activeTab === 'tier' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">支持自定义新增分级</span>
                  <button type="button" className="px-3 py-1.5 rounded border border-primary text-primary text-xs flex items-center" onClick={() => setShowAddTierModal(true)}><Plus size={14} className="mr-1" /> 新增分级</button>
                </div>
                <div className="grid gap-4">
                  {tierPolicies.map((p) => (
                    <div key={p.key} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                      <div className="flex items-center gap-4">
                        <span className={`font-bold px-2 py-1 rounded text-sm ${
                          p.color === 'red' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                          p.color === 'orange' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                          p.color === 'yellow' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                          'bg-slate-500/20 text-slate-400 border border-slate-500/40'
                        }`}>{p.label}</span>
                        <span className="text-sm text-muted-foreground">推送方式：{p.channels.join('、')}；重试 {p.retryCount} 次，间隔 {p.retryInterval} 分钟</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded border border-primary text-primary text-xs flex items-center" onClick={() => openTierEdit(p.key)}><Edit2 size={12} className="mr-1" /> 编辑</button>
                        {!['P0', 'P1', 'P2'].includes(p.key) && <button className="px-2 py-1 rounded border border-red-500/50 text-red-400 text-xs" onClick={() => deleteTier(p.key)}>删除</button>}
                      </div>
                    </div>
                  ))}
                </div>
                {showAddTierModal && (
                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
                    <div className="bg-[#050816] border border-border rounded-xl w-full max-w-md p-6 text-sm">
                      <h4 className="text-lg font-semibold text-white mb-4">新增分级</h4>
                      <div className="space-y-3">
                        <div><label className="block text-xs text-muted-foreground mb-1">级别标识（如 P3）</label><input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={newTierForm.key} onChange={(e) => setNewTierForm((f) => ({ ...f, key: e.target.value }))} placeholder="P3" /></div>
                        <div><label className="block text-xs text-muted-foreground mb-1">显示名称</label><input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={newTierForm.label} onChange={(e) => setNewTierForm((f) => ({ ...f, label: e.target.value }))} placeholder="P3级（蓝色）" /></div>
                        <div><label className="block text-xs text-muted-foreground mb-1">颜色</label><select className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={newTierForm.color} onChange={(e) => setNewTierForm((f) => ({ ...f, color: e.target.value }))}><option value="red">红色</option><option value="orange">橙色</option><option value="yellow">黄色</option><option value="slate">灰色/自定义</option></select></div>
                        <div><label className="block text-xs text-muted-foreground mb-1">推送渠道</label><div className="flex flex-wrap gap-2">{['短信', '电话', '站内信', 'APP推送'].map((ch) => (<label key={ch} className="flex items-center gap-1.5 text-xs"><input type="checkbox" className="accent-primary" checked={newTierForm.channels.includes(ch)} onChange={(e) => setNewTierForm((f) => ({ ...f, channels: e.target.checked ? [...f.channels, ch] : f.channels.filter((x) => x !== ch) }))} />{ch}</label>))}</div></div>
                        <div className="flex gap-4"><div><label className="block text-xs text-muted-foreground mb-1">重试次数</label><input type="number" min={1} max={10} className="w-20 px-2 py-1.5 bg-background border border-border rounded text-white text-xs" value={newTierForm.retryCount} onChange={(e) => setNewTierForm((f) => ({ ...f, retryCount: Number(e.target.value) || 1 }))} /></div><div><label className="block text-xs text-muted-foreground mb-1">重试间隔（分钟）</label><input type="number" min={1} className="w-20 px-2 py-1.5 bg-background border border-border rounded text-white text-xs" value={newTierForm.retryInterval} onChange={(e) => setNewTierForm((f) => ({ ...f, retryInterval: Number(e.target.value) || 5 }))} /></div></div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2"><button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white" onClick={() => setShowAddTierModal(false)}>取消</button><button className="px-4 py-2 rounded border border-primary bg-primary/80 text-primary-foreground" onClick={saveNewTier}>保存</button></div>
                    </div>
                  </div>
                )}
                {editingTier && (
                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
                    <div className="bg-[#050816] border border-border rounded-xl w-full max-w-md p-6 text-sm">
                      <h4 className="text-lg font-semibold text-white mb-4">编辑分级策略 - {editingTier}</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">推送渠道（多选）</label>
                          <div className="flex flex-wrap gap-2">
                            {['短信', '电话', '站内信', 'APP推送'].map((ch) => (
                              <label key={ch} className="flex items-center gap-1.5 text-xs">
                                <input type="checkbox" className="accent-primary" checked={tierForm.channels.includes(ch)} onChange={(e) => setTierForm((f) => ({ ...f, channels: e.target.checked ? [...f.channels, ch] : f.channels.filter((x) => x !== ch) }))} />
                                {ch}
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">重试次数</label>
                            <input type="number" min={1} max={10} className="w-20 px-2 py-1.5 bg-background border border-border rounded text-white text-xs" value={tierForm.retryCount} onChange={(e) => setTierForm((f) => ({ ...f, retryCount: Number(e.target.value) || 1 }))} />
                          </div>
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">重试间隔（分钟）</label>
                            <input type="number" min={1} className="w-20 px-2 py-1.5 bg-background border border-border rounded text-white text-xs" value={tierForm.retryInterval} onChange={(e) => setTierForm((f) => ({ ...f, retryInterval: Number(e.target.value) || 5 }))} />
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white" onClick={() => setEditingTier(null)}>取消</button>
                        <button className="px-4 py-2 rounded border border-primary bg-primary/80 text-primary-foreground" onClick={saveTier}>保存</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. 推送通道管理 */}
            {activeTab === 'channel' && (
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="text-primary" size={20} />
                    <h4 className="font-semibold text-white">推送给指定人员</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">配置消息推送的接收人（用户或角色）</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {targetPersons.map((t) => (
                      <span key={t.id} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary/60 border border-border text-xs text-slate-200">
                        {t.name}（{t.type === 'user' ? '用户' : '角色'}）
                        <button type="button" className="text-red-400 hover:underline" onClick={() => setTargetPersons((p) => p.filter((x) => x.id !== t.id))}>×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input className="flex-1 px-3 py-2 bg-background border border-border rounded text-white text-xs" value={targetPersonInput} onChange={(e) => setTargetPersonInput(e.target.value)} placeholder="输入用户名或角色名" />
                    <button type="button" className="px-3 py-2 rounded border border-primary text-primary text-xs" onClick={() => { if (targetPersonInput.trim()) { setTargetPersons((p) => [...p, { id: `tp-${Date.now()}`, name: targetPersonInput.trim(), type: 'user' }]); setTargetPersonInput(''); } }}>添加用户</button>
                    <button type="button" className="px-3 py-2 rounded border border-border text-muted-foreground text-xs" onClick={() => { if (targetPersonInput.trim()) { setTargetPersons((p) => [...p, { id: `tp-${Date.now()}`, name: targetPersonInput.trim(), type: 'role' }]); setTargetPersonInput(''); } }}>添加角色</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Smartphone className="text-primary" size={20} />
                    <h4 className="font-semibold text-white">移动端推送</h4>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div><label className="text-muted-foreground block mb-1">App ID</label><input className="w-full px-2 py-1.5 bg-background border border-border rounded text-white" value={appConfig.appId} onChange={(e) => setAppConfig((c) => ({ ...c, appId: e.target.value }))} placeholder="应用ID" /></div>
                    <div><label className="text-muted-foreground block mb-1">App Key</label><input className="w-full px-2 py-1.5 bg-background border border-border rounded text-white" value={appConfig.appKey} onChange={(e) => setAppConfig((c) => ({ ...c, appKey: e.target.value }))} placeholder="密钥" /></div>
                    <div><label className="text-muted-foreground block mb-1">Secret</label><input type="password" className="w-full px-2 py-1.5 bg-background border border-border rounded text-white" value={appConfig.secret} onChange={(e) => setAppConfig((c) => ({ ...c, secret: e.target.value }))} placeholder="Secret" /></div>
                    <button className="w-full py-2 rounded border border-primary text-primary hover:bg-primary/20 flex items-center justify-center gap-2" onClick={() => testChannel('app')}>测试连接</button>
                    {channelTestResult.app && <p className="text-emerald-400 text-xs">{channelTestResult.app}</p>}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="text-primary" size={20} />
                    <h4 className="font-semibold text-white">短信推送</h4>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div><label className="text-muted-foreground block mb-1">API 密钥</label><input className="w-full px-2 py-1.5 bg-background border border-border rounded text-white" value={smsConfig.apiKey} onChange={(e) => setSmsConfig((c) => ({ ...c, apiKey: e.target.value }))} placeholder="API Key" /></div>
                    <div><label className="text-muted-foreground block mb-1">签名</label><input className="w-full px-2 py-1.5 bg-background border border-border rounded text-white" value={smsConfig.sign} onChange={(e) => setSmsConfig((c) => ({ ...c, sign: e.target.value }))} placeholder="短信签名" /></div>
                    <div><label className="text-muted-foreground block mb-1">模板ID</label><input className="w-full px-2 py-1.5 bg-background border border-border rounded text-white" value={smsConfig.templateId} onChange={(e) => setSmsConfig((c) => ({ ...c, templateId: e.target.value }))} placeholder="模板ID" /></div>
                    <button className="w-full py-2 rounded border border-primary text-primary hover:bg-primary/20 flex items-center justify-center gap-2" onClick={() => testChannel('sms')}>测试连接</button>
                    {channelTestResult.sms && <p className="text-emerald-400 text-xs">{channelTestResult.sms}</p>}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Bell className="text-primary" size={20} />
                    <h4 className="font-semibold text-white">站内信推送</h4>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div><label className="text-muted-foreground block mb-1">回调 URL</label><input className="w-full px-2 py-1.5 bg-background border border-border rounded text-white" value={inboxConfig.callbackUrl} onChange={(e) => setInboxConfig((c) => ({ ...c, callbackUrl: e.target.value }))} placeholder="https://..." /></div>
                    <div><label className="text-muted-foreground block mb-1">鉴权方式</label><select className="w-full px-2 py-1.5 bg-background border border-border rounded text-white" value={inboxConfig.authType} onChange={(e) => setInboxConfig((c) => ({ ...c, authType: e.target.value }))}><option value="token">Token</option><option value="basic">Basic</option></select></div>
                    <button className="w-full py-2 rounded border border-primary text-primary hover:bg-primary/20 flex items-center justify-center gap-2" onClick={() => testChannel('inbox')}>测试连接</button>
                    {channelTestResult.inbox && <p className="text-emerald-400 text-xs">{channelTestResult.inbox}</p>}
                  </div>
                </div>
                <div className="md:col-span-3">
                  <div className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-white">自定义推送通道</h4>
                      <button type="button" className="px-3 py-1.5 rounded border border-primary text-primary text-xs flex items-center" onClick={() => setShowAddChannelModal(true)}><Plus size={14} className="mr-1" /> 新增自定义通道</button>
                    </div>
                    {customChannels.length === 0 ? (
                      <p className="text-xs text-muted-foreground">暂无自定义通道，点击上方按钮添加</p>
                    ) : (
                      <div className="space-y-2">
                        {customChannels.map((ch) => (
                          <div key={ch.id} className="flex items-center justify-between px-3 py-2 rounded border border-border bg-background/40 text-xs">
                            <span className="text-slate-200">{ch.name}</span>
                            <span className="font-mono text-muted-foreground truncate max-w-[200px]">{ch.endpoint}</span>
                            <div>
                              <button type="button" className="text-primary hover:underline mr-2" onClick={() => { setChannelTestResult((p) => ({ ...p, custom: '连接成功' })); setTimeout(() => setChannelTestResult((p) => ({ ...p, custom: null })), 2000); }}>测试</button>
                              <button type="button" className="text-red-400 hover:underline" onClick={() => setCustomChannels((p) => p.filter((c) => c.id !== ch.id))}>删除</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                </div>
              </div>
            )}

            {/* 5. 消息模板与配置 */}
            {activeTab === 'template' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                  <input placeholder="模板名称" className="px-3 py-1.5 bg-background border border-border rounded text-white text-xs w-40" value={templateFilterName} onChange={(e) => setTemplateFilterName(e.target.value)} />
                  <select className="px-3 py-1.5 bg-background border border-border rounded text-white text-xs" value={templateFilterType} onChange={(e) => setTemplateFilterType(e.target.value as TemplateType | '')}>
                    <option value="">模板类型</option>
                    <option value="短信">短信</option>
                    <option value="邮件">邮件</option>
                    <option value="站内信">站内信</option>
                  </select>
                  <select className="px-3 py-1.5 bg-background border border-border rounded text-white text-xs" value={templateFilterEnabled === '' ? '' : templateFilterEnabled ? '1' : '0'} onChange={(e) => setTemplateFilterEnabled(e.target.value === '' ? '' : e.target.value === '1')}>
                    <option value="">状态</option>
                    <option value="1">启用</option>
                    <option value="0">禁用</option>
                  </select>
                  <button className="px-3 py-1.5 rounded border border-primary bg-primary/20 text-primary text-xs flex items-center" onClick={() => openTemplateEdit()}><Send size={14} className="mr-1" /> 新增模板</button>
                </div>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-secondary border-b border-border text-muted-foreground text-xs">
                      <tr>
                        <th className="px-3 py-2">模板名称</th>
                        <th className="px-3 py-2">模板类型</th>
                        <th className="px-3 py-2">创建时间</th>
                        <th className="px-3 py-2">状态</th>
                        <th className="px-3 py-2 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-slate-200 text-xs">
                      {filteredTemplates.map((t) => (
                        <tr key={t.id} className="hover:bg-secondary/50">
                          <td className="px-3 py-2">{t.name}</td>
                          <td className="px-3 py-2">{t.type}</td>
                          <td className="px-3 py-2 font-mono text-muted-foreground">{t.createdAt}</td>
                          <td className="px-3 py-2">{t.enabled ? <span className="text-emerald-400">启用</span> : <span className="text-muted-foreground">禁用</span>}</td>
                          <td className="px-3 py-2 text-right">
                            <button className="text-primary hover:underline mr-2" onClick={() => openTemplateEdit(t)}>编辑</button>
                            <button className="text-muted-foreground hover:underline mr-2" onClick={() => toggleTemplateEnabled(t.id)}>{t.enabled ? '禁用' : '启用'}</button>
                            <button className="text-red-400 hover:underline" onClick={() => deleteTemplate(t.id)}>删除</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(editingTemplateId === 'new' || editingTemplateId) && (
                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
                    <div className="bg-[#050816] border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto p-6 text-sm">
                      <h4 className="text-lg font-semibold text-white mb-4">{editingTemplateId === 'new' ? '新增模板' : '编辑模板'}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div><label className="block text-xs text-muted-foreground mb-1">模板名称</label><input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={templateForm.name} onChange={(e) => setTemplateForm((f) => ({ ...f, name: e.target.value }))} /></div>
                          <div><label className="block text-xs text-muted-foreground mb-1">模板类型</label><select className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={templateForm.type} onChange={(e) => setTemplateForm((f) => ({ ...f, type: e.target.value as TemplateType }))}><option value="短信">短信</option><option value="邮件">邮件</option><option value="站内信">站内信</option></select></div>
                          <div><label className="block text-xs text-muted-foreground mb-1">内容（支持变量 {'{userName}'} {'{deviceName}'} {'{taskName}'} 等）</label><textarea rows={6} className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs font-mono" value={templateForm.content} onChange={(e) => setTemplateForm((f) => ({ ...f, content: e.target.value }))} /></div>
                          <label className="flex items-center gap-2 text-xs"><input type="checkbox" className="accent-primary" checked={templateForm.enabled} onChange={(e) => setTemplateForm((f) => ({ ...f, enabled: e.target.checked }))} /> 启用</label>
                        </div>
                        <div>
                          <h5 className="text-xs text-muted-foreground mb-2">实时预览</h5>
                          <div className="p-4 rounded-lg bg-secondary/50 border border-border text-xs text-slate-200 whitespace-pre-wrap min-h-[120px]">{previewContent || '（输入内容后显示预览）'}</div>
                          <div className="mt-3 text-xs text-muted-foreground">预览变量：userName, deviceName, taskName, alarmType, expireDate, reason</div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white" onClick={() => setEditingTemplateId(null)}>取消</button>
                        <button className="px-4 py-2 rounded border border-primary bg-primary/80 text-primary-foreground" onClick={saveTemplate}>保存</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 6. 消息审计与日志 */}
            {activeTab === 'audit' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                  <input placeholder="操作人" className="px-3 py-1.5 bg-background border border-border rounded text-white text-xs w-28" value={auditOperator} onChange={(e) => setAuditOperator(e.target.value)} />
                  <input placeholder="操作类型" className="px-3 py-1.5 bg-background border border-border rounded text-white text-xs w-28" value={auditActionType} onChange={(e) => setAuditActionType(e.target.value)} />
                  <input type="datetime-local" className="px-2 py-1.5 bg-background border border-border rounded text-white text-xs font-mono w-40" value={auditTimeFrom} onChange={(e) => setAuditTimeFrom(e.target.value.slice(0, 19).replace('T', ' '))} />
                  <input placeholder="消息ID" className="px-3 py-1.5 bg-background border border-border rounded text-white text-xs w-32" value={auditMsgId} onChange={(e) => setAuditMsgId(e.target.value)} />
                  <button className="px-3 py-1.5 rounded border border-primary bg-primary/20 text-primary text-xs flex items-center"><Search size={14} className="mr-1" /> 搜索</button>
                  <button className="px-3 py-1.5 rounded border border-primary text-primary text-xs flex items-center" onClick={() => exportMessageAudit(false)}><Download size={14} className="mr-1" /> 导出全部</button>
                  <button className="px-3 py-1.5 rounded border border-amber-500/50 text-amber-400 text-xs flex items-center ml-auto" onClick={() => exportMessageAudit(true)}><Download size={14} className="mr-1" /> 批量导出{selectedAuditIds.size > 0 ? ` (${selectedAuditIds.size})` : ''}</button>
                </div>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-secondary border-b border-border text-muted-foreground text-xs">
                      <tr>
                        <th className="w-8 px-3 py-2"><input type="checkbox" checked={filteredAudit.length > 0 && selectedAuditIds.size === filteredAudit.length} onChange={toggleAllAuditSelect} /></th>
                        <th className="px-3 py-2">操作人</th>
                        <th className="px-3 py-2">操作类型</th>
                        <th className="px-3 py-2">操作时间</th>
                        <th className="px-3 py-2">消息ID</th>
                        <th className="px-3 py-2">操作详情</th>
                        <th className="px-3 py-2">操作结果</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-slate-200 text-xs">
                      {filteredAudit.map((r) => (
                        <tr key={r.id} className="hover:bg-secondary/50">
                          <td className="px-3 py-2"><input type="checkbox" checked={selectedAuditIds.has(r.id)} onChange={() => toggleAuditSelect(r.id)} /></td>
                          <td className="px-3 py-2">{r.operator}</td>
                          <td className="px-3 py-2">{r.actionType}</td>
                          <td className="px-3 py-2 font-mono text-muted-foreground">{r.opTime}</td>
                          <td className="px-3 py-2 font-mono">{r.messageId}</td>
                          <td className="px-3 py-2">{r.detail}</td>
                          <td className="px-3 py-2">{r.result}</td>
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

      {/* 手动触发 - 新建预警消息弹窗 */}
      {showNewAlertModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
          <div className="bg-[#050816] border border-border rounded-xl w-full max-w-md p-6 text-sm shadow-xl">
            <h4 className="text-lg font-semibold text-white mb-4">新建预警消息</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">消息类型</label>
                <p className="text-slate-200 text-xs">{SOURCE_CARDS.find((c) => c.key === newAlertSourceKey)?.title ?? newAlertSourceKey}</p>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">标题</label>
                <input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={newAlertForm.title} onChange={(e) => setNewAlertForm((f) => ({ ...f, title: e.target.value }))} placeholder="预警消息标题" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">内容</label>
                <textarea rows={3} className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs resize-none" value={newAlertForm.content} onChange={(e) => setNewAlertForm((f) => ({ ...f, content: e.target.value }))} placeholder="消息内容" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">接收人</label>
                <input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={newAlertForm.receiver} onChange={(e) => setNewAlertForm((f) => ({ ...f, receiver: e.target.value }))} placeholder="当前用户 或 指定用户/角色" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">级别</label>
                <select className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={newAlertForm.level} onChange={(e) => setNewAlertForm((f) => ({ ...f, level: e.target.value as 'P0' | 'P1' | 'P2' }))}>
                  <option value="P0">P0</option>
                  <option value="P1">P1</option>
                  <option value="P2">P2</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white" onClick={() => setShowNewAlertModal(false)}>取消</button>
              <button className="px-4 py-2 rounded border border-primary bg-primary/80 text-primary-foreground" onClick={submitNewAlert}>发送</button>
            </div>
          </div>
        </div>
      )}

      {/* 新增自定义推送通道弹窗 */}
      {showAddChannelModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
          <div className="bg-[#050816] border border-border rounded-xl w-full max-w-md p-6 text-sm shadow-xl">
            <h4 className="text-lg font-semibold text-white mb-4">新增自定义推送通道</h4>
            <div className="space-y-3">
              <div><label className="block text-xs text-muted-foreground mb-1">通道名称</label><input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={customChannelForm.name} onChange={(e) => setCustomChannelForm((f) => ({ ...f, name: e.target.value }))} placeholder="如：企业微信" /></div>
              <div><label className="block text-xs text-muted-foreground mb-1">接口地址</label><input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs font-mono" value={customChannelForm.endpoint} onChange={(e) => setCustomChannelForm((f) => ({ ...f, endpoint: e.target.value }))} placeholder="https://..." /></div>
              <div><label className="block text-xs text-muted-foreground mb-1">鉴权信息（可选）</label><input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={customChannelForm.auth} onChange={(e) => setCustomChannelForm((f) => ({ ...f, auth: e.target.value }))} placeholder="Token 或 Key" /></div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white" onClick={() => setShowAddChannelModal(false)}>取消</button>
              <button className="px-4 py-2 rounded border border-primary bg-primary/80 text-primary-foreground" onClick={addCustomChannel}>保存</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default MessageManager;
