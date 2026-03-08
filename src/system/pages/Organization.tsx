import React, { useMemo, useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  MoreVertical,
  Key,
  RadioReceiver,
  UserPlus,
  FolderPlus,
  Edit2,
  Trash2,
} from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import { useAudit } from '@/contexts/AuditContext';

type BoundResource = {
  id: string;
  type: 'DRONE' | 'PILOT';
  name: string;
  statusLabel: string;
  statusTone: 'online' | 'offline';
};

type OrgUnit = {
  id: string;
  name: string;
  owner: string;
  phone: string;
};

/** 下属部门：设备/飞手只能从当前组织已绑定的资源中选择 */
type Department = {
  id: string;
  name: string;
  deviceIds: string[];
  pilotIds: string[];
};

type OrgResources = {
  devices: BoundResource[];
  pilots: BoundResource[];
};

const DEVICE_CANDIDATES = [
  { id: 'd1', label: '巡逻一号（DJI-M300-2024001）' },
  { id: 'd2', label: '应急响应2号（DJI-M30T-2024002）' },
  { id: 'd3', label: '侦查小蜂（DJI-MINI4-2024003）' },
  { id: 'd4', label: '农业巡检1号（XAG-P100-2023001）' },
];

const PILOT_CANDIDATES = [
  { id: 'p1', label: '李建斌（高级飞手）' },
  { id: 'p2', label: '王伟（指挥飞手）' },
  { id: 'p3', label: '赵磊（外勤飞手）' },
];

const initialOrgResources: Record<string, OrgResources> = {
  'GX-001': {
    devices: [
      { id: 'br-drone-1', type: 'DRONE', name: 'M30T-旗舰版  SN: 1A3B5', statusLabel: '在线就绪', statusTone: 'online' },
    ],
    pilots: [
      { id: 'br-pilot-1', type: 'PILOT', name: '李建斌（高级飞手）', statusLabel: '离线', statusTone: 'offline' },
    ],
  },
  'LJ-002': {
    devices: [],
    pilots: [],
  },
};

const Organization: React.FC = () => {
  const { addLog } = useAudit();
  const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([
    { id: 'GX-001', name: '高新园区派出所', owner: '王建国', phone: '138-0000-0000' },
    { id: 'LJ-002', name: '临江交警大队', owner: '李明', phone: '138-0000-0001' },
  ]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('GX-001');
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [showDevicePicker, setShowDevicePicker] = useState(false);
  const [showPilotPicker, setShowPilotPicker] = useState(false);
  const [showTakeover, setShowTakeover] = useState(false);
  const [showAttr, setShowAttr] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [selectedPilots, setSelectedPilots] = useState<string[]>([]);
  const [orgResources, setOrgResources] = useState<Record<string, OrgResources>>(initialOrgResources);
  const [departments, setDepartments] = useState<Record<string, Department[]>>({
    'GX-001': [{ id: 'dept-gx-1', name: '巡逻中队', deviceIds: [], pilotIds: [] }],
    'LJ-002': [],
  });
  const [newOrgForm, setNewOrgForm] = useState<OrgUnit>({ id: '', name: '', owner: '', phone: '' });
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [deptFormName, setDeptFormName] = useState('');
  const [showDeptDevicePicker, setShowDeptDevicePicker] = useState<string | null>(null);
  const [showDeptPilotPicker, setShowDeptPilotPicker] = useState<string | null>(null);
  const [deptPickerDeviceIds, setDeptPickerDeviceIds] = useState<string[]>([]);
  const [deptPickerPilotIds, setDeptPickerPilotIds] = useState<string[]>([]);

  const currentOrg = orgUnits.find((o) => o.id === selectedOrgId) ?? orgUnits[0];
  const currentResources = orgResources[selectedOrgId] ?? { devices: [], pilots: [] };
  const currentDepartments = departments[selectedOrgId] ?? [];
  const boundResources = useMemo(() => [...currentResources.devices, ...currentResources.pilots], [currentResources]);

  return (
    <AdminLayout>
      <div className="h-full flex flex-col max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">组织架构与资源管理</h2>
            <p className="text-sm text-muted-foreground mt-1">建立多级树状架构（市局-分局-派出所），灵活绑定下属设备与人员权限。</p>
          </div>
          <button
            className="bg-primary/20 border border-primary text-primary px-4 py-2 rounded-md font-medium text-sm flex items-center hover:bg-primary hover:text-primary-foreground transition-all shadow-[0_0_15px_rgba(0,195,255,0.2)]"
            onClick={() => {
              setNewOrgForm({
                id: '',
                name: '',
                owner: '',
                phone: '',
              });
              setShowCreateOrg(true);
            }}
          >
            <Plus size={16} className="mr-2" /> 新建组织单元
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-[600px] mb-8">
          {/* 左侧架构树 */}
          <div className="w-full lg:w-80 bg-card tech-border rounded-xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary/50">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="检索组织名称 / 编码..."
                  className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-slate-600 transition"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <div className="space-y-1">
                <div className="flex items-center px-3 py-2 text-sm text-white font-medium cursor-pointer hover:bg-secondary rounded">
                  <Building2 size={16} className="mr-2 text-primary" />
                  市公安局 (行政中心)
                </div>
                <div className="pl-6 space-y-1">
                  <div className="flex items-center px-3 py-2 text-sm text-white cursor-pointer hover:bg-secondary rounded">
                    <Building2 size={16} className="mr-2 text-primary/70" />
                    东部分局
                  </div>
                  <div className="pl-6 space-y-1 relative">
                    <div className="absolute left-2.5 top-0 bottom-0 w-px bg-border"></div>
                    {orgUnits.map((org) => {
                      const active = currentOrg && currentOrg.id === org.id;
                      return (
                        <div
                          key={org.id}
                          className={`flex items-center px-3 py-2 text-sm cursor-pointer rounded transition relative z-10 ${
                            active
                              ? 'bg-primary/20 text-primary font-medium border border-primary/30 tech-glow'
                              : 'text-muted-foreground hover:bg-secondary hover:text-white'
                          }`}
                          onClick={() => setSelectedOrgId(org.id)}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-3 ${
                              active ? 'bg-primary shadow-[0_0_5px_#00c3ff]' : 'bg-slate-600'
                            }`}
                          ></span>
                          {org.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="pl-6 space-y-1">
                  <div className="flex items-center px-3 py-2 text-sm text-white cursor-pointer hover:bg-secondary rounded">
                    <Building2 size={16} className="mr-2 text-primary/70" />
                    西部分局
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧详情面板 */}
          <div className="flex-1 bg-card tech-border rounded-xl flex flex-col relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="p-6 border-b border-border flex items-center justify-between relative z-10">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center tracking-wide">
                  {currentOrg ? currentOrg.name : '未选择组织'}
                  <span className="ml-4 text-xs px-2 py-0.5 bg-secondary text-primary rounded border border-primary/30">
                    自动继承属地高级权限
                  </span>
                </h3>
                {currentOrg && (
                  <p className="text-sm text-muted-foreground mt-2 font-mono">
                    ORG-CODE: {currentOrg.id} <span className="mx-2">|</span> 负责人: {currentOrg.owner}
                  </p>
                )}
              </div>
              <button className="text-muted-foreground hover:text-white p-2 border border-border bg-secondary rounded outline-none transition">
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="p-0 border-b border-border bg-background/50">
              <div className="flex space-x-8 px-8 pt-4">
                <button className="pb-3 border-b-2 border-primary text-primary font-medium text-sm tracking-wide">
                  配置下属资源
                </button>
                <button
                  className="pb-3 border-b-2 border-transparent text-muted-foreground hover:text-white font-medium text-sm"
                  onClick={() => setShowAttr(true)}
                >
                  组织属性
                </button>
                <button className="pb-3 border-b-2 border-transparent text-muted-foreground hover:text-white font-medium text-sm">
                  层级继承管理
                </button>
              </div>
            </div>

            <div className="p-6 flex-1 bg-transparent relative z-10 overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <button
                  type="button"
                  onClick={() => setShowDevicePicker(true)}
                  className="bg-secondary/30 p-5 rounded-lg border border-border flex flex-col items-center justify-center text-center hover:border-blue-400 hover:bg-secondary transition cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-background border border-blue-500/30 rounded-full flex items-center justify-center mb-4">
                    <RadioReceiver size={22} className="text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-white text-sm tracking-widest">硬件设备</h4>
                  <p className="text-xs text-muted-foreground mt-1.5">将无人机与机巢签发至本单位</p>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPilotPicker(true)}
                  className="bg-secondary/30 p-5 rounded-lg border border-border flex flex-col items-center justify-center text-center hover:border-emerald-400 hover:bg-secondary transition cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-background border border-emerald-500/30 rounded-full flex items-center justify-center mb-4">
                    <UserPlus size={22} className="text-emerald-400" />
                  </div>
                  <h4 className="font-semibold text-white text-sm tracking-widest">飞手名单</h4>
                  <p className="text-xs text-muted-foreground mt-1.5">圈定管辖范围内的许可操作员</p>
                </button>

                <button
                  type="button"
                  onClick={() => setShowTakeover(true)}
                  className="bg-secondary/30 p-5 rounded-lg border border-border flex flex-col items-center justify-center text-center hover:border-purple-400 hover:bg-secondary transition cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-background border border-purple-500/30 rounded-full flex items-center justify-center mb-4">
                    <Key size={22} className="text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-white text-sm tracking-widest">接管权限</h4>
                  <p className="text-xs text-muted-foreground mt-1.5">向指挥长申请飞行控制权</p>
                </button>
              </div>

              <div className="mt-10">
                <h4 className="text-sm font-semibold text-white mb-4 border-l-2 border-primary pl-2 tracking-wide">已绑定清单 (实时展现)</h4>
                <div className="border border-border rounded-lg overflow-hidden text-sm bg-background">
                  <table className="w-full text-left table-auto">
                    <thead className="bg-secondary border-b border-border text-muted-foreground">
                      <tr>
                        <th className="p-3 font-medium font-mono">TYPE</th>
                        <th className="p-3 font-medium">名称识标</th>
                        <th className="p-3 font-medium">网络状况</th>
                        <th className="p-3 font-medium text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-white">
                      {boundResources.length === 0 ? (
                        <tr>
                          <td className="p-4 text-center text-xs text-muted-foreground" colSpan={4}>
                            暂无绑定资源，可通过上方卡片绑定硬件设备或飞手。
                          </td>
                        </tr>
                      ) : (
                        boundResources.map((item) => (
                          <tr key={item.id} className="hover:bg-secondary/50">
                            <td className="p-3 text-muted-foreground font-mono">{item.type}</td>
                            <td className="p-3 font-medium">{item.name}</td>
                            <td className="p-3">
                              {item.statusTone === 'online' ? (
                                <span className="px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs rounded">
                                  {item.statusLabel}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 border border-slate-500/30 bg-slate-500/10 text-slate-400 text-xs rounded">
                                  {item.statusLabel}
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                className="text-red-400 hover:text-red-300 text-xs"
                                onClick={() => {
                                  if (!currentOrg) return;
                                  const oid = currentOrg.id;
                                  setOrgResources((prev) => {
                                    const next = { ...prev };
                                    const existing = next[oid] ?? { devices: [], pilots: [] };
                                    next[oid] = {
                                      devices: existing.devices.filter((d) => d.id !== item.id),
                                      pilots: existing.pilots.filter((p) => p.id !== item.id),
                                    };
                                    return next;
                                  });
                                }}
                              >
                                解绑
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-10">
                <h4 className="text-sm font-semibold text-white mb-3 border-l-2 border-primary pl-2 tracking-wide">下属部门</h4>
                <p className="text-xs text-muted-foreground mb-3">下属部门的设备、飞手只能从本组织已绑定资源中选择，不可跨组织。</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground">共 {currentDepartments.length} 个下属部门</span>
                  <button
                    type="button"
                    className="text-primary border border-primary/50 px-3 py-1.5 rounded text-xs flex items-center hover:bg-primary/10"
                    onClick={() => {
                      setEditingDeptId(null);
                      setDeptFormName('');
                      setShowDeptForm(true);
                    }}
                  >
                    <FolderPlus size={14} className="mr-1.5" /> 新增下属部门
                  </button>
                </div>
                <div className="border border-border rounded-lg overflow-hidden text-sm bg-background">
                  {currentDepartments.length === 0 ? (
                    <div className="p-6 text-center text-xs text-muted-foreground">暂无下属部门，点击「新增下属部门」创建。</div>
                  ) : (
                    <table className="w-full text-left table-auto">
                      <thead className="bg-secondary border-b border-border text-muted-foreground">
                        <tr>
                          <th className="p-3 font-medium">部门名称</th>
                          <th className="p-3 font-medium">设备</th>
                          <th className="p-3 font-medium">飞手</th>
                          <th className="p-3 font-medium text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-white">
                        {currentDepartments.map((dept) => (
                          <tr key={dept.id} className="hover:bg-secondary/50">
                            <td className="p-3 font-medium">{dept.name}</td>
                            <td className="p-3 text-xs text-muted-foreground">
                              {dept.deviceIds.length
                                ? currentResources.devices.filter((d) => dept.deviceIds.includes(d.id)).map((d) => d.name).join('、') || '—'
                                : '—'}
                            </td>
                            <td className="p-3 text-xs text-muted-foreground">
                              {dept.pilotIds.length
                                ? currentResources.pilots.filter((p) => dept.pilotIds.includes(p.id)).map((p) => p.name).join('、') || '—'
                                : '—'}
                            </td>
                            <td className="p-3 text-right text-xs">
                              <button className="text-blue-400 hover:underline mr-2" onClick={() => { setShowDeptDevicePicker(dept.id); setDeptPickerDeviceIds([...dept.deviceIds]); }}>设备配置</button>
                              <button className="text-emerald-400 hover:underline mr-2" onClick={() => { setShowDeptPilotPicker(dept.id); setDeptPickerPilotIds([...dept.pilotIds]); }}>飞手配置</button>
                              <button className="text-muted-foreground hover:underline mr-2" onClick={() => { setEditingDeptId(dept.id); setDeptFormName(dept.name); setShowDeptForm(true); }}>编辑</button>
                              <button className="text-red-400 hover:underline" onClick={() => { if (window.confirm(`确定删除下属部门「${dept.name}」？`)) setDepartments((prev) => ({ ...prev, [selectedOrgId]: (prev[selectedOrgId] ?? []).filter((d) => d.id !== dept.id) })); }}>删除</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 新建组织单元弹窗 */}
      {showCreateOrg && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
          <div className="bg-[#050816] border border-primary/30 rounded-xl w-full max-w-xl p-6 shadow-2xl text-sm">
            <h3 className="text-lg font-semibold text-white mb-4">新建组织单元</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-muted-foreground mb-1">组织 ID</label>
                  <input
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                    value={newOrgForm.id}
                    onChange={(e) => setNewOrgForm((f) => ({ ...f, id: e.target.value }))}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-muted-foreground mb-1">组织名称</label>
                  <input
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                    value={newOrgForm.name}
                    onChange={(e) => setNewOrgForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-muted-foreground mb-1">负责人</label>
                  <input
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                    value={newOrgForm.owner}
                    onChange={(e) => setNewOrgForm((f) => ({ ...f, owner: e.target.value }))}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-muted-foreground mb-1">联系电话</label>
                  <input
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                    value={newOrgForm.phone}
                    onChange={(e) => setNewOrgForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">* 硬件设备与飞手名单可在右侧「配置下属资源」中继续补充绑定。</p>
            </div>
            <div className="mt-6 flex justify-end gap-3 text-xs">
              <button
                className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white hover:bg-secondary"
                onClick={() => setShowCreateOrg(false)}
              >
                取消
              </button>
              <button
                className="px-4 py-2 rounded border border-primary bg-primary/80 text-primary-foreground"
                onClick={() => {
                  if (newOrgForm.name.trim()) {
                    const id = newOrgForm.id || `org-${Date.now()}`;
                    const isEdit = orgUnits.some((o) => o.id === id);
                    setOrgUnits((prev) => (isEdit ? prev.map((o) => (o.id === id ? { ...newOrgForm, id } : o)) : [...prev, { ...newOrgForm, id }]));
                    if (!isEdit) {
                      setOrgResources((prev) => ({ ...prev, [id]: { devices: [], pilots: [] } }));
                      setDepartments((prev) => ({ ...prev, [id]: [] }));
                    }
                    addLog({ actionType: isEdit ? '修改' : '新增', module: '组织管理', targetObject: `组织单元「${newOrgForm.name}」`, detailSummary: `${isEdit ? '编辑' : '新建'}组织单元：${newOrgForm.name}，负责人 ${newOrgForm.owner}` });
                  }
                  setShowCreateOrg(false);
                }}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 组织属性弹窗 */}
      {showAttr && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
          <div className="bg-[#050816] border border-border rounded-xl w-full max-w-md p-6 shadow-2xl text-sm">
            <h3 className="text-lg font-semibold text-white mb-4">组织属性</h3>
            <div className="space-y-3 text-slate-100">
              <div className="flex justify-between">
                <span className="text-muted-foreground">组织名称</span>
                <span className="font-medium">{currentOrg?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">组织编码</span>
                <span className="font-mono text-primary">{currentOrg?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">负责人</span>
                <span>{currentOrg?.owner}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">联系电话</span>
                <span>{currentOrg?.phone}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end text-xs">
              <button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white hover:bg-secondary" onClick={() => setShowAttr(false)}>
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 硬件设备选择弹窗 */}
      {showDevicePicker && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
          <div className="bg-[#050816] border border-blue-500/40 rounded-xl w-full max-w-lg p-6 shadow-2xl text-sm">
            <h3 className="text-lg font-semibold text-white mb-4">选择硬件设备</h3>
            <div className="space-y-2 max-h-64 overflow-auto">
              {DEVICE_CANDIDATES.map((d) => {
                const checked = selectedDevices.includes(d.id);
                return (
                  <label key={d.id} className="flex items-center justify-between px-3 py-2 rounded border border-border bg-background/60 hover:border-blue-400 cursor-pointer">
                    <span className="text-slate-100 text-xs">{d.label}</span>
                    <input
                      type="checkbox"
                      className="accent-sky-500"
                      checked={checked}
                      onChange={() =>
                        setSelectedDevices((prev) => (prev.includes(d.id) ? prev.filter((x) => x !== d.id) : [...prev, d.id]))
                      }
                    />
                  </label>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end gap-3 text-xs">
              <button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white hover:bg-secondary" onClick={() => setShowDevicePicker(false)}>
                取消
              </button>
              <button
                className="px-4 py-2 rounded border border-blue-500 bg-blue-600/80 text-white"
                onClick={() => {
                  const picked = DEVICE_CANDIDATES.filter((d) => selectedDevices.includes(d.id));
                  if (picked.length && currentOrg) {
                    const oid = currentOrg.id;
                    setOrgResources((prev) => {
                      const next = { ...prev };
                      const existing = next[oid] ?? { devices: [], pilots: [] };
                      const existingIds = new Set(existing.devices.map((d) => d.id));
                      const toAdd = picked
                        .filter((p) => !existingIds.has(`drone-${p.id}`))
                        .map<BoundResource>((p) => ({ id: `drone-${p.id}`, type: 'DRONE', name: p.label, statusLabel: '在线就绪', statusTone: 'online' }));
                      next[oid] = { ...existing, devices: [...existing.devices, ...toAdd] };
                      return next;
                    });
                    addLog({ actionType: '修改', module: '组织管理', targetObject: '设备绑定', detailSummary: `绑定设备到当前组织：${picked.map((p) => p.label).join('、')}` });
                  }
                  setShowDevicePicker(false);
                }}
              >
                绑定到本组织
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 飞手选择弹窗 */}
      {showPilotPicker && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
          <div className="bg-[#050816] border border-emerald-500/40 rounded-xl w-full max-w-lg p-6 shadow-2xl text-sm">
            <h3 className="text-lg font-semibold text-white mb-4">选择飞手名单</h3>
            <div className="space-y-2 max-h-64 overflow-auto">
              {PILOT_CANDIDATES.map((p) => {
                const checked = selectedPilots.includes(p.id);
                return (
                  <label key={p.id} className="flex items-center justify-between px-3 py-2 rounded border border-border bg-background/60 hover:border-emerald-400 cursor-pointer">
                    <span className="text-slate-100 text-xs">{p.label}</span>
                    <input
                      type="checkbox"
                      className="accent-emerald-500"
                      checked={checked}
                      onChange={() =>
                        setSelectedPilots((prev) => (prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id]))
                      }
                    />
                  </label>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end gap-3 text-xs">
              <button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white hover:bg-secondary" onClick={() => setShowPilotPicker(false)}>
                取消
              </button>
              <button
                className="px-4 py-2 rounded border border-emerald-500 bg-emerald-600/80 text-white"
                onClick={() => {
                  const picked = PILOT_CANDIDATES.filter((p) => selectedPilots.includes(p.id));
                  if (picked.length && currentOrg) {
                    const oid = currentOrg.id;
                    setOrgResources((prev) => {
                      const next = { ...prev };
                      const existing = next[oid] ?? { devices: [], pilots: [] };
                      const existingIds = new Set(existing.pilots.map((p) => p.id));
                      const toAdd = picked
                        .filter((p) => !existingIds.has(`pilot-${p.id}`))
                        .map<BoundResource>((p) => ({ id: `pilot-${p.id}`, type: 'PILOT', name: p.label, statusLabel: '离线', statusTone: 'offline' }));
                      next[oid] = { ...existing, pilots: [...existing.pilots, ...toAdd] };
                      return next;
                    });
                    addLog({ actionType: '修改', module: '组织管理', targetObject: '飞手绑定', detailSummary: `绑定飞手到当前组织：${picked.map((p) => p.label).join('、')}` });
                  }
                  setShowPilotPicker(false);
                }}
              >
                绑定到本组织
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 接管权限弹窗 */}
      {showTakeover && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
          <div className="bg-[#050816] border border-purple-500/40 rounded-xl w-full max-w-md p-6 shadow-2xl text-sm">
            <h3 className="text-lg font-semibold text-white mb-4">申请飞行控制权</h3>
            <p className="text-xs text-slate-200 leading-relaxed mb-4">
              将向当前辖区指挥长发起“接管飞行控制权”申请，请在审批通过后再下发跨组织飞行任务指令。
            </p>
            <div className="mt-2 flex justify-end gap-3 text-xs">
              <button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white hover:bg-secondary" onClick={() => setShowTakeover(false)}>
                取消
              </button>
              <button className="px-4 py-2 rounded border border-purple-500 bg-purple-600/80 text-white" onClick={() => setShowTakeover(false)}>
                提交申请
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新增/编辑下属部门 */}
      {showDeptForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
          <div className="bg-[#050816] border border-primary/30 rounded-xl w-full max-w-md p-6 shadow-2xl text-sm">
            <h3 className="text-lg font-semibold text-white mb-4">{editingDeptId ? '编辑下属部门' : '新增下属部门'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">部门名称</label>
                <input
                  className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                  value={deptFormName}
                  onChange={(e) => setDeptFormName(e.target.value)}
                  placeholder="如：巡逻中队"
                />
              </div>
              <p className="text-xs text-muted-foreground">保存后可在下方列表中为该部门配置设备、飞手（仅可从本组织已绑定资源中选择）。</p>
            </div>
            <div className="mt-6 flex justify-end gap-3 text-xs">
              <button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white hover:bg-secondary" onClick={() => setShowDeptForm(false)}>
                取消
              </button>
              <button
                className="px-4 py-2 rounded border border-primary bg-primary/80 text-primary-foreground"
                onClick={() => {
                  if (!deptFormName.trim() || !currentOrg) return;
                  const oid = currentOrg.id;
                  if (editingDeptId) {
                    setDepartments((prev) => ({
                      ...prev,
                      [oid]: (prev[oid] ?? []).map((d) => (d.id === editingDeptId ? { ...d, name: deptFormName.trim() } : d)),
                    }));
                    addLog({ actionType: '修改', module: '组织管理', targetObject: '下属部门', detailSummary: `编辑下属部门：${deptFormName.trim()}` });
                  } else {
                    const newDept: Department = { id: `dept-${Date.now()}`, name: deptFormName.trim(), deviceIds: [], pilotIds: [] };
                    setDepartments((prev) => ({ ...prev, [oid]: [...(prev[oid] ?? []), newDept] }));
                    addLog({ actionType: '新增', module: '组织管理', targetObject: '下属部门', detailSummary: `新增下属部门：${deptFormName.trim()}` });
                  }
                  setShowDeptForm(false);
                }}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 下属部门-设备配置（仅展示本组织已绑定设备） */}
      {showDeptDevicePicker && currentOrg && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
          <div className="bg-[#050816] border border-blue-500/40 rounded-xl w-full max-w-lg p-6 shadow-2xl text-sm">
            <h3 className="text-lg font-semibold text-white mb-2">为下属部门配置设备</h3>
            <p className="text-xs text-muted-foreground mb-4">仅可从当前组织「{currentOrg.name}」已绑定的设备中选择，不可跨组织。</p>
            <div className="space-y-2 max-h-64 overflow-auto">
              {currentResources.devices.length === 0 ? (
                <p className="text-xs text-muted-foreground">本组织暂无已绑定设备，请先在「硬件设备」中绑定。</p>
              ) : (
                currentResources.devices.map((d) => {
                  const checked = deptPickerDeviceIds.includes(d.id);
                  return (
                    <label key={d.id} className="flex items-center justify-between px-3 py-2 rounded border border-border bg-background/60 hover:border-blue-400 cursor-pointer">
                      <span className="text-slate-100 text-xs">{d.name}</span>
                      <input
                        type="checkbox"
                        className="accent-sky-500"
                        checked={checked}
                        onChange={() => setDeptPickerDeviceIds((prev) => (checked ? prev.filter((x) => x !== d.id) : [...prev, d.id]))}
                      />
                    </label>
                  );
                })
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3 text-xs">
              <button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white hover:bg-secondary" onClick={() => setShowDeptDevicePicker(null)}>
                取消
              </button>
              <button
                className="px-4 py-2 rounded border border-blue-500 bg-blue-600/80 text-white"
                onClick={() => {
                  setDepartments((prev) => ({
                    ...prev,
                    [currentOrg.id]: (prev[currentOrg.id] ?? []).map((d) => (d.id === showDeptDevicePicker ? { ...d, deviceIds: [...deptPickerDeviceIds] } : d)),
                  }));
                  addLog({ actionType: '修改', module: '组织管理', targetObject: '下属部门设备', detailSummary: `为下属部门配置设备` });
                  setShowDeptDevicePicker(null);
                }}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 下属部门-飞手配置（仅展示本组织已绑定飞手） */}
      {showDeptPilotPicker && currentOrg && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
          <div className="bg-[#050816] border border-emerald-500/40 rounded-xl w-full max-w-lg p-6 shadow-2xl text-sm">
            <h3 className="text-lg font-semibold text-white mb-2">为下属部门配置飞手</h3>
            <p className="text-xs text-muted-foreground mb-4">仅可从当前组织「{currentOrg.name}」已绑定的飞手中选择，不可跨组织。</p>
            <div className="space-y-2 max-h-64 overflow-auto">
              {currentResources.pilots.length === 0 ? (
                <p className="text-xs text-muted-foreground">本组织暂无已绑定飞手，请先在「飞手名单」中绑定。</p>
              ) : (
                currentResources.pilots.map((p) => {
                  const checked = deptPickerPilotIds.includes(p.id);
                  return (
                    <label key={p.id} className="flex items-center justify-between px-3 py-2 rounded border border-border bg-background/60 hover:border-emerald-400 cursor-pointer">
                      <span className="text-slate-100 text-xs">{p.name}</span>
                      <input
                        type="checkbox"
                        className="accent-emerald-500"
                        checked={checked}
                        onChange={() => setDeptPickerPilotIds((prev) => (checked ? prev.filter((x) => x !== p.id) : [...prev, p.id]))}
                      />
                    </label>
                  );
                })
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3 text-xs">
              <button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white hover:bg-secondary" onClick={() => setShowDeptPilotPicker(null)}>
                取消
              </button>
              <button
                className="px-4 py-2 rounded border border-emerald-500 bg-emerald-600/80 text-white"
                onClick={() => {
                  setDepartments((prev) => ({
                    ...prev,
                    [currentOrg.id]: (prev[currentOrg.id] ?? []).map((d) => (d.id === showDeptPilotPicker ? { ...d, pilotIds: [...deptPickerPilotIds] } : d)),
                  }));
                  addLog({ actionType: '修改', module: '组织管理', targetObject: '下属部门飞手', detailSummary: `为下属部门配置飞手` });
                  setShowDeptPilotPicker(null);
                }}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Organization;
