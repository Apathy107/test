import React, { useMemo, useState } from 'react';
import {
  Plus,
  ShieldCheck,
  Edit2,
  Trash2,
  Copy,
  Settings2,
  ChevronRight,
  FolderTree,
  MousePointer,
  Database,
  Zap,
  AlertTriangle,
} from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';

type RoleType = 'builtin' | 'custom';

interface MenuNode {
  id: string;
  label: string;
  children?: MenuNode[];
}

interface DynamicRule {
  id: string;
  trigger: string;
  target: string;
  duration: string;
}

interface EmergencyRule {
  id: string;
  privilegeType: string;
  scenario: string;
  scope: string;
}

interface Role {
  id: string;
  name: string;
  type: RoleType;
  desc: string;
  enabled: boolean;
  menuIds: string[];
  actionIds: string[];
  dataScope: string;
  dynamicRules: DynamicRule[];
  emergencyRules: EmergencyRule[];
}

const MENU_TREE: MenuNode[] = [
  { id: 'sys', label: '系统支撑', children: [{ id: 'org', label: '组织管理' }, { id: 'users', label: '用户管理' }, { id: 'roles', label: '角色管理' }, { id: 'msg', label: '消息管理' }, { id: 'algo', label: '算法管理' }, { id: 'audit', label: '审计日志' }, { id: 'api', label: '接口中心' }, { id: 'ip', label: 'IP白名单' }, { id: 'monitor', label: '服务监控' }, { id: 'menu', label: '菜单管理' }, { id: 'dict', label: '字典管理' }, { id: 'settings', label: '系统设置' }] },
  { id: 'device', label: '设备运维', children: [{ id: 'd-dash', label: '设备总览' }, { id: 'd-archive', label: '设备档案' }, { id: 'd-alert', label: '告警管理' }] },
  { id: 'personnel', label: '人员管理', children: [{ id: 'p-dash', label: '人员总览' }, { id: 'p-pilot', label: '飞手档案' }, { id: 'p-qual', label: '资质监控' }] },
  { id: 'mission', label: '任务管理', children: [{ id: 'm-dash', label: '任务看板' }, { id: 'm-create', label: '任务创建' }, { id: 'm-approval', label: '任务审批' }] },
  { id: 'business', label: '业务应用', children: [{ id: 'b-traffic', label: '交通非现执法' }, { id: 'b-urban', label: '城市综合治理' }, { id: 'b-emergency', label: '通用应急应用' }] },
];

const ACTION_OPTIONS = ['新增', '编辑', '删除', '导出', '审批', '查看', '复制', '权限配置'];

const DATA_SCOPE_OPTIONS = ['全部数据', '本部门数据', '本部门及以下', '仅本人', '自定义范围'];

/** 内置角色模板：新增角色时可选择其一作为基础 */
const BUILTIN_ROLE_TEMPLATES: Pick<Role, 'name' | 'desc' | 'menuIds' | 'actionIds' | 'dataScope' | 'dynamicRules' | 'emergencyRules'>[] = [
  { name: '超级管理员', desc: '全局配置、组织架构管理、角色权限定义、系统日志审计、系统部署与维护', menuIds: ['sys', 'org', 'users', 'roles', 'msg', 'algo', 'audit', 'api', 'ip', 'monitor', 'menu', 'dict', 'settings'], actionIds: ['新增', '编辑', '删除', '导出', '审批', '查看', '复制', '权限配置'], dataScope: '全部数据', dynamicRules: [], emergencyRules: [{ id: 'e1', privilegeType: '强制接管', scenario: '紧急情况', scope: '辖区全部设备' }] },
  { name: '指挥员', desc: '全局态势监控、任务下发/指派、越权接管、多机视频墙控制、指挥中心大屏', menuIds: ['sys', 'org', 'users', 'roles', 'msg', 'device', 'personnel', 'mission'], actionIds: ['新增', '编辑', '查看', '导出', '审批'], dataScope: '本部门及以下', dynamicRules: [{ id: 'd1', trigger: '任务执行中', target: '设备控制权', duration: '任务结束后回收' }], emergencyRules: [{ id: 'e2', privilegeType: '强制接管', scenario: '安全事件', scope: '辖区设备' }] },
  { name: '飞手', desc: '无人机操控、航线规划（限辖区）、任务执行、本地载荷控制、现场作业/远程操控', menuIds: ['mission', 'm-dash', 'm-create', 'device', 'd-dash'], actionIds: ['查看'], dataScope: '仅本人', dynamicRules: [{ id: 'd2', trigger: '任务执行中', target: '设备控制权', duration: '毫秒级回收' }], emergencyRules: [] },
  { name: 'AI审核员', desc: 'AI告警审核、误报标注、样本回传、工单复核、数据处理后台', menuIds: ['sys', 'msg', 'algo', 'device', 'd-alert'], actionIds: ['查看', '编辑'], dataScope: '本部门数据', dynamicRules: [], emergencyRules: [] },
  { name: '业务部门用户', desc: '查看特定区域工单、接收告警推送、流程审批（如环保局、城管局）', menuIds: ['mission', 'm-dash', 'm-approval', 'device', 'd-alert', 'business'], actionIds: ['查看', '审批'], dataScope: '本部门数据', dynamicRules: [], emergencyRules: [] },
];

const defaultRoles: Role[] = [
  { id: 'r1', name: '超级管理员', type: 'builtin', desc: '全局配置、组织架构管理、角色权限定义、系统日志审计、系统部署与维护', enabled: true, menuIds: BUILTIN_ROLE_TEMPLATES[0].menuIds, actionIds: BUILTIN_ROLE_TEMPLATES[0].actionIds, dataScope: BUILTIN_ROLE_TEMPLATES[0].dataScope, dynamicRules: BUILTIN_ROLE_TEMPLATES[0].dynamicRules, emergencyRules: BUILTIN_ROLE_TEMPLATES[0].emergencyRules },
  { id: 'r2', name: '指挥员', type: 'builtin', desc: BUILTIN_ROLE_TEMPLATES[1].desc, enabled: true, menuIds: BUILTIN_ROLE_TEMPLATES[1].menuIds, actionIds: BUILTIN_ROLE_TEMPLATES[1].actionIds, dataScope: BUILTIN_ROLE_TEMPLATES[1].dataScope, dynamicRules: BUILTIN_ROLE_TEMPLATES[1].dynamicRules.map((r) => ({ ...r })), emergencyRules: BUILTIN_ROLE_TEMPLATES[1].emergencyRules.map((r) => ({ ...r })) },
  { id: 'r3', name: '飞手', type: 'builtin', desc: BUILTIN_ROLE_TEMPLATES[2].desc, enabled: true, menuIds: BUILTIN_ROLE_TEMPLATES[2].menuIds, actionIds: BUILTIN_ROLE_TEMPLATES[2].actionIds, dataScope: BUILTIN_ROLE_TEMPLATES[2].dataScope, dynamicRules: BUILTIN_ROLE_TEMPLATES[2].dynamicRules.map((r) => ({ ...r })), emergencyRules: [] },
  { id: 'r4', name: 'AI审核员', type: 'builtin', desc: BUILTIN_ROLE_TEMPLATES[3].desc, enabled: true, menuIds: BUILTIN_ROLE_TEMPLATES[3].menuIds, actionIds: BUILTIN_ROLE_TEMPLATES[3].actionIds, dataScope: BUILTIN_ROLE_TEMPLATES[3].dataScope, dynamicRules: [], emergencyRules: [] },
  { id: 'r5', name: '业务部门用户', type: 'builtin', desc: BUILTIN_ROLE_TEMPLATES[4].desc, enabled: true, menuIds: BUILTIN_ROLE_TEMPLATES[4].menuIds, actionIds: BUILTIN_ROLE_TEMPLATES[4].actionIds, dataScope: BUILTIN_ROLE_TEMPLATES[4].dataScope, dynamicRules: [], emergencyRules: [] },
];

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [filterName, setFilterName] = useState('');
  const [filterType, setFilterType] = useState<RoleType | ''>('');
  const [filterEnabled, setFilterEnabled] = useState<boolean | ''>('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [permTab, setPermTab] = useState<'menu' | 'action' | 'data' | 'dynamic' | 'emergency'>('menu');
  const [showBuiltinWarn, setShowBuiltinWarn] = useState(false);
  const [form, setForm] = useState({
    name: '',
    desc: '',
    type: 'custom' as RoleType,
    enabled: true,
    menuIds: [] as string[],
    actionIds: [] as string[],
    dataScope: '全部数据',
    dynamicRules: [] as DynamicRule[],
    emergencyRules: [] as EmergencyRule[],
  });

  const filteredRoles = useMemo(() => {
    return roles.filter((r) => {
      if (filterName && !r.name.toLowerCase().includes(filterName.toLowerCase())) return false;
      if (filterType && r.type !== filterType) return false;
      if (filterEnabled !== '' && r.enabled !== filterEnabled) return false;
      return true;
    });
  }, [roles, filterName, filterType, filterEnabled]);

  const editingRole = editingRoleId ? roles.find((r) => r.id === editingRoleId) : null;
  const isBuiltin = editingRole?.type === 'builtin';

  const openDrawer = (role: Role | null) => {
    if (role) {
      setEditingRoleId(role.id);
      setForm({
        name: role.name,
        desc: role.desc,
        type: role.type,
        enabled: role.enabled,
        menuIds: [...role.menuIds],
        actionIds: [...role.actionIds],
        dataScope: role.dataScope,
        dynamicRules: role.dynamicRules.map((r) => ({ ...r })),
        emergencyRules: role.emergencyRules.map((r) => ({ ...r })),
      });
      if (role.type === 'builtin') setShowBuiltinWarn(true);
    } else {
      setEditingRoleId(null);
      setForm({
        name: '',
        desc: '',
        type: 'custom',
        enabled: true,
        menuIds: [],
        actionIds: [],
        dataScope: '全部数据',
        dynamicRules: [],
        emergencyRules: [],
      });
      setShowBuiltinWarn(false);
    }
    setPermTab('menu');
    setDrawerOpen(true);
  };

  const saveRole = () => {
    if (!form.name.trim()) return;
    if (editingRoleId) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editingRoleId
            ? {
                ...r,
                name: isBuiltin ? r.name : form.name,
                desc: form.desc,
                type: isBuiltin ? r.type : form.type,
                enabled: form.enabled,
                menuIds: form.menuIds,
                actionIds: form.actionIds,
                dataScope: form.dataScope,
                dynamicRules: form.dynamicRules,
                emergencyRules: form.emergencyRules,
              }
            : r
        )
      );
    } else {
      setRoles((prev) => [
        ...prev,
        {
          id: `r-${Date.now()}`,
          name: form.name.trim(),
          desc: form.desc,
          type: form.type,
          enabled: form.enabled,
          menuIds: form.menuIds,
          actionIds: form.actionIds,
          dataScope: form.dataScope,
          dynamicRules: form.dynamicRules,
          emergencyRules: form.emergencyRules,
        },
      ]);
    }
    setDrawerOpen(false);
  };

  const deleteRole = (r: Role) => {
    if (r.type === 'builtin') return;
    if (!window.confirm(`确定删除角色「${r.name}」？`)) return;
    setRoles((prev) => prev.filter((x) => x.id !== r.id));
  };

  const copyRole = (r: Role) => {
    openDrawer(null);
    setForm({
      name: `${r.name}（副本）`,
      desc: r.desc,
      type: 'custom',
      enabled: r.enabled,
      menuIds: [...r.menuIds],
      actionIds: [...r.actionIds],
      dataScope: r.dataScope,
      dynamicRules: r.dynamicRules.map((x) => ({ ...x, id: `d-${Date.now()}-${x.id}` })),
      emergencyRules: r.emergencyRules.map((x) => ({ ...x, id: `e-${Date.now()}-${x.id}` })),
    });
  };

  const toggleEnabled = (id: string) => {
    setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const toggleMenu = (id: string, checked: boolean) => {
    const collectIds = (nodes: MenuNode[]): string[] => {
      let ids: string[] = [];
      nodes.forEach((n) => {
        ids.push(n.id);
        if (n.children) ids = ids.concat(collectIds(n.children));
      });
      return ids;
    };
    const findNode = (nodes: MenuNode[], targetId: string): MenuNode | null => {
      for (const n of nodes) {
        if (n.id === targetId) return n;
        if (n.children) {
          const found = findNode(n.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };
    const node = findNode(MENU_TREE, id);
    const ids = node ? [node.id, ...(node.children ? collectIds(node.children) : [])] : [id];
    setForm((f) => ({
      ...f,
      menuIds: checked ? [...new Set([...f.menuIds, ...ids])] : f.menuIds.filter((x) => !ids.includes(x)),
    }));
  };

  const isMenuChecked = (id: string) => {
    const node = findNodeById(MENU_TREE, id);
    if (!node) return form.menuIds.includes(id);
    const childIds = node.children ? collectAllIds(node.children) : [];
    const allIds = [id, ...childIds];
    return allIds.every((i) => form.menuIds.includes(i));
  };

  function findNodeById(nodes: MenuNode[], targetId: string): MenuNode | null {
    for (const n of nodes) {
      if (n.id === targetId) return n;
      if (n.children) {
        const found = findNodeById(n.children, targetId);
        if (found) return found;
      }
    }
    return null;
  }
  function collectAllIds(nodes: MenuNode[]): string[] {
    let ids: string[] = [];
    nodes.forEach((n) => {
      ids.push(n.id);
      if (n.children) ids = ids.concat(collectAllIds(n.children));
    });
    return ids;
  }

  const addDynamicRule = () => {
    setForm((f) => ({
      ...f,
      dynamicRules: [...f.dynamicRules, { id: `d-${Date.now()}`, trigger: '任务执行中', target: '设备控制权', duration: '任务结束回收' }],
    }));
  };

  const addEmergencyRule = () => {
    setForm((f) => ({
      ...f,
      emergencyRules: [...f.emergencyRules, { id: `e-${Date.now()}`, privilegeType: '强制接管', scenario: '紧急情况', scope: '辖区内设备' }],
    }));
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto pb-10">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">角色管理</h2>
            <p className="text-sm text-muted-foreground mt-1">配置角色权限：菜单、功能、数据范围、动态权限与应急特权。</p>
          </div>
          <button className="bg-primary/20 border border-primary text-primary px-4 py-2 rounded-md font-medium text-sm flex items-center hover:bg-primary hover:text-primary-foreground transition" onClick={() => openDrawer(null)}>
            <Plus size={16} className="mr-2" /> 新建角色
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border mb-4">
          <input placeholder="角色名称搜索" className="px-3 py-1.5 bg-background border border-border rounded text-white text-xs w-40" value={filterName} onChange={(e) => setFilterName(e.target.value)} />
          <select className="px-3 py-1.5 bg-background border border-border rounded text-white text-xs" value={filterType} onChange={(e) => setFilterType((e.target.value || '') as RoleType | '')}>
            <option value="">角色类型</option>
            <option value="builtin">内置角色</option>
            <option value="custom">自定义角色</option>
          </select>
          <select className="px-3 py-1.5 bg-background border border-border rounded text-white text-xs" value={filterEnabled === '' ? '' : filterEnabled ? '1' : '0'} onChange={(e) => setFilterEnabled(e.target.value === '' ? '' : e.target.value === '1')}>
            <option value="">状态</option>
            <option value="1">启用</option>
            <option value="0">禁用</option>
          </select>
        </div>

        <div className="border border-border rounded-lg overflow-hidden bg-background/40">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary border-b border-border text-muted-foreground text-xs">
              <tr>
                <th className="px-4 py-2">角色名称</th>
                <th className="px-4 py-2">角色类型</th>
                <th className="px-4 py-2">描述</th>
                <th className="px-4 py-2">状态</th>
                <th className="px-4 py-2">动态权限</th>
                <th className="px-4 py-2">应急特权</th>
                <th className="px-4 py-2 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-slate-200 text-xs">
              {filteredRoles.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/50">
                  <td className="px-4 py-2 font-medium text-white">{r.name}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded ${r.type === 'builtin' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' : 'bg-slate-500/20 text-slate-400 border border-slate-500/40'}`}>
                      {r.type === 'builtin' ? '内置' : '自定义'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-muted-foreground max-w-[200px] truncate">{r.desc}</td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={r.enabled}
                      className={`relative inline-flex h-5 w-10 rounded-full border transition-colors ${r.enabled ? 'bg-emerald-500/20 border-emerald-400' : 'bg-slate-700 border-slate-500'}`}
                      onClick={() => toggleEnabled(r.id)}
                    >
                      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transform transition-transform ${r.enabled ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-2 text-muted-foreground max-w-[160px] truncate" title={r.dynamicRules.map((d) => `${d.trigger}→${d.target}`).join('；')}>
                    {r.dynamicRules.length ? r.dynamicRules.map((d) => `${d.trigger}→${d.target}`).join('；') : '—'}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground max-w-[160px] truncate" title={r.emergencyRules.map((e) => e.privilegeType).join('；')}>
                    {r.emergencyRules.length ? r.emergencyRules.map((e) => e.privilegeType).join('；') : '—'}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button className="text-primary hover:underline mr-2" onClick={() => openDrawer(r)}>编辑</button>
                    {r.type === 'custom' && <button className="text-red-400 hover:underline mr-2" onClick={() => deleteRole(r)}>删除</button>}
                    <button className="text-primary hover:underline mr-2" onClick={() => openDrawer(r)}>权限配置</button>
                    <button className="text-muted-foreground hover:underline" onClick={() => copyRole(r)}>复制</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 权限配置抽屉/模态框 */}
        {drawerOpen && (
          <>
            {showBuiltinWarn && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowBuiltinWarn(false)}>
                <div className="bg-[#050816] border border-amber-500/50 rounded-xl p-6 max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2 text-amber-400 mb-2">
                    <AlertTriangle size={20} />
                    <h4 className="font-semibold">提示</h4>
                  </div>
                  <p className="text-sm text-slate-200">修改内置角色权限可能影响系统安全，请谨慎操作。</p>
                  <div className="mt-4 flex justify-end">
                    <button className="px-4 py-2 rounded border border-primary bg-primary/80 text-primary-foreground text-sm" onClick={() => setShowBuiltinWarn(false)}>已知晓</button>
                  </div>
                </div>
              </div>
            )}
            <div className="fixed inset-0 bg-black/60 flex justify-end z-40" onClick={() => setDrawerOpen(false)}>
              <div className="w-full max-w-2xl bg-[#050816] border-l border-border shadow-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{editingRoleId ? '编辑角色与权限' : '新建角色'}</h3>
                  <button className="text-muted-foreground hover:text-white" onClick={() => setDrawerOpen(false)}>×</button>
                </div>
                <div className="flex-1 overflow-auto p-6">
                  {!editingRoleId && (
                    <div className="mb-6">
                      <label className="block text-xs text-muted-foreground mb-1">选择内置角色模板（可选）</label>
                      <select
                        className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                        value=""
                        onChange={(e) => {
                          const idx = e.target.value ? Number(e.target.value) : -1;
                          if (idx >= 0 && BUILTIN_ROLE_TEMPLATES[idx]) {
                            const t = BUILTIN_ROLE_TEMPLATES[idx];
                            setForm((f) => ({
                              ...f,
                              name: t.name,
                              desc: t.desc,
                              menuIds: [...t.menuIds],
                              actionIds: [...t.actionIds],
                              dataScope: t.dataScope,
                              dynamicRules: t.dynamicRules.map((r) => ({ ...r, id: `d-${Date.now()}-${r.id}` })),
                              emergencyRules: t.emergencyRules.map((r) => ({ ...r, id: `e-${Date.now()}-${r.id}` })),
                            }));
                          }
                          e.target.value = '';
                        }}
                      >
                        <option value="">— 请选择模板，将自动填充名称与权限 —</option>
                        {BUILTIN_ROLE_TEMPLATES.map((t, idx) => (
                          <option key={idx} value={idx}>{t.name}：{t.desc.slice(0, 24)}…</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <h4 className="text-xs text-primary font-semibold border-l-2 border-primary pl-2 mb-3">基础信息</h4>
                  <div className="grid grid-cols-1 gap-3 mb-6">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">角色名称</label>
                      <input className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} disabled={isBuiltin} placeholder={isBuiltin ? undefined : '如：超级管理员'} />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">角色描述</label>
                      <textarea rows={2} className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs resize-none" value={form.desc} onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">角色类型</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-xs cursor-pointer">
                          <input type="radio" name="roleType" checked={form.type === 'builtin'} onChange={() => !isBuiltin && setForm((f) => ({ ...f, type: 'builtin' }))} disabled={isBuiltin} className="accent-primary" />
                          内置
                        </label>
                        <label className="flex items-center gap-2 text-xs cursor-pointer">
                          <input type="radio" name="roleType" checked={form.type === 'custom'} onChange={() => !isBuiltin && setForm((f) => ({ ...f, type: 'custom' }))} disabled={isBuiltin} className="accent-primary" />
                          自定义
                        </label>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-xs text-primary font-semibold border-l-2 border-primary pl-2 mb-2">权限配置</h4>
                  <div className="flex border-b border-border mb-4">
                    {(['menu', 'action', 'data', 'dynamic', 'emergency'] as const).map((tab) => (
                      <button key={tab} type="button" className={`px-3 py-2 text-xs ${permTab === tab ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-white'}`} onClick={() => setPermTab(tab)}>
                        {tab === 'menu' && '菜单权限'}
                        {tab === 'action' && '功能权限'}
                        {tab === 'data' && '数据权限'}
                        {tab === 'dynamic' && '动态权限'}
                        {tab === 'emergency' && '应急特权'}
                      </button>
                    ))}
                  </div>

                  {permTab === 'menu' && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground mb-2">勾选父节点可全选子节点</p>
                      {MENU_TREE.map((node) => (
                        <div key={node.id} className="pl-2">
                          <label className="flex items-center gap-2 py-1.5 cursor-pointer">
                            <input type="checkbox" className="accent-primary" checked={isMenuChecked(node.id)} onChange={(e) => toggleMenu(node.id, e.target.checked)} />
                            <ChevronRight size={14} className="text-muted-foreground" />
                            <span className="text-slate-200">{node.label}</span>
                          </label>
                          {node.children && (
                            <div className="pl-6">
                              {node.children.map((c) => (
                                <label key={c.id} className="flex items-center gap-2 py-1 cursor-pointer">
                                  <input type="checkbox" className="accent-primary" checked={form.menuIds.includes(c.id)} onChange={(e) => toggleMenu(c.id, e.target.checked)} />
                                  <span className="text-slate-300 text-xs">{c.label}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {permTab === 'action' && (
                    <div className="flex flex-wrap gap-2">
                      {ACTION_OPTIONS.map((act) => (
                        <label key={act} className="flex items-center gap-2 px-3 py-2 rounded border border-border bg-background/60 cursor-pointer text-xs">
                          <input type="checkbox" className="accent-primary" checked={form.actionIds.includes(act)} onChange={(e) => setForm((f) => ({ ...f, actionIds: e.target.checked ? [...f.actionIds, act] : f.actionIds.filter((x) => x !== act) }))} />
                          {act}
                        </label>
                      ))}
                    </div>
                  )}

                  {permTab === 'data' && (
                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">数据范围</label>
                      <select className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs" value={form.dataScope} onChange={(e) => setForm((f) => ({ ...f, dataScope: e.target.value }))}>
                        {DATA_SCOPE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      {form.dataScope === '自定义范围' && <p className="text-xs text-muted-foreground mt-2">可在后续版本配置具体区域、设备等。</p>}
                    </div>
                  )}

                  {permTab === 'dynamic' && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">触发条件、授权对象、授权时长（如毫秒级回收）</p>
                      {form.dynamicRules.map((rule) => (
                        <div key={rule.id} className="flex flex-wrap gap-2 items-center p-2 rounded border border-border bg-background/40 mb-2 text-xs">
                          <input className="w-28 px-2 py-1 bg-background border border-border rounded text-white" value={rule.trigger} onChange={(e) => setForm((f) => ({ ...f, dynamicRules: f.dynamicRules.map((r) => (r.id === rule.id ? { ...r, trigger: e.target.value } : r)) }))} placeholder="触发条件" />
                          <input className="w-28 px-2 py-1 bg-background border border-border rounded text-white" value={rule.target} onChange={(e) => setForm((f) => ({ ...f, dynamicRules: f.dynamicRules.map((r) => (r.id === rule.id ? { ...r, target: e.target.value } : r)) }))} placeholder="授权对象" />
                          <input className="w-32 px-2 py-1 bg-background border border-border rounded text-white" value={rule.duration} onChange={(e) => setForm((f) => ({ ...f, dynamicRules: f.dynamicRules.map((r) => (r.id === rule.id ? { ...r, duration: e.target.value } : r)) }))} placeholder="授权时长" />
                          <button type="button" className="text-red-400 hover:underline" onClick={() => setForm((f) => ({ ...f, dynamicRules: f.dynamicRules.filter((r) => r.id !== rule.id) }))}>删除</button>
                        </div>
                      ))}
                      <button type="button" className="px-3 py-1.5 rounded border border-primary text-primary text-xs" onClick={addDynamicRule}>+ 新增规则</button>
                    </div>
                  )}

                  {permTab === 'emergency' && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">特权类型、适用场景、生效范围</p>
                      {form.emergencyRules.map((rule) => (
                        <div key={rule.id} className="flex flex-wrap gap-2 items-center p-2 rounded border border-border bg-background/40 mb-2 text-xs">
                          <input className="w-24 px-2 py-1 bg-background border border-border rounded text-white" value={rule.privilegeType} onChange={(e) => setForm((f) => ({ ...f, emergencyRules: f.emergencyRules.map((r) => (r.id === rule.id ? { ...r, privilegeType: e.target.value } : r)) }))} placeholder="特权类型" />
                          <input className="w-24 px-2 py-1 bg-background border border-border rounded text-white" value={rule.scenario} onChange={(e) => setForm((f) => ({ ...f, emergencyRules: f.emergencyRules.map((r) => (r.id === rule.id ? { ...r, scenario: e.target.value } : r)) }))} placeholder="适用场景" />
                          <input className="w-28 px-2 py-1 bg-background border border-border rounded text-white" value={rule.scope} onChange={(e) => setForm((f) => ({ ...f, emergencyRules: f.emergencyRules.map((r) => (r.id === rule.id ? { ...r, scope: e.target.value } : r)) }))} placeholder="生效范围" />
                          <button type="button" className="text-red-400 hover:underline" onClick={() => setForm((f) => ({ ...f, emergencyRules: f.emergencyRules.filter((r) => r.id !== rule.id) }))}>删除</button>
                        </div>
                      ))}
                      <button type="button" className="px-3 py-1.5 rounded border border-primary text-primary text-xs" onClick={addEmergencyRule}>+ 新增应急特权</button>
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-border flex justify-end gap-2">
                  <button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white text-sm" onClick={() => setDrawerOpen(false)}>取消</button>
                  <button className="px-4 py-2 rounded border border-primary bg-primary/80 text-primary-foreground text-sm" onClick={saveRole}>保存</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Roles;
