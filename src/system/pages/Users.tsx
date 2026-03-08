import React, { useMemo, useState } from 'react';
import { Plus, Upload, Search, Edit3, Trash2 } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';

type UserStatus = 'active' | 'inactive';

interface User {
  id: string;
  name: string;
  account: string;
  role: string;
  org: string;
  status: UserStatus;
  createdAt: string;
  mobile?: string;
}

const initialUsers: User[] = [
  {
    id: '1',
    name: '王伟',
    account: 'wangwei.admin',
    role: '超级管理员',
    org: '市公安局',
    status: 'active',
    createdAt: '2023-11-01 09:12',
    mobile: '13800000001',
  },
  {
    id: '2',
    name: '李强',
    account: 'liqiang.cmd',
    role: '指挥员',
    org: '高新园区派出所',
    status: 'active',
    createdAt: '2023-11-01 10:05',
    mobile: '13800000002',
  },
  {
    id: '3',
    name: '赵铁柱',
    account: 'zhaot.pilot',
    role: '外勤飞手',
    org: '交警大队',
    status: 'inactive',
    createdAt: '2023-10-30 16:30',
    mobile: '13800000003',
  },
  {
    id: '4',
    name: 'AI巡检服务',
    account: 'sys.ai_auditor',
    role: 'AI 审核员',
    org: '云端节点',
    status: 'active',
    createdAt: '2023-10-01 00:00',
  },
  // 新增 5 个角色账号（飞手、AI审核员、指挥员、超级管理员、飞手）
  {
    id: '5',
    name: '张飞手',
    account: 'pilot1',
    role: '外勤飞手',
    org: '交警大队',
    status: 'active',
    createdAt: '2025-03-08 10:00',
    mobile: '13800000005',
  },
  {
    id: '6',
    name: '李审核',
    account: 'ai_auditor1',
    role: 'AI 审核员',
    org: '云端节点',
    status: 'active',
    createdAt: '2025-03-08 10:01',
    mobile: '13800000006',
  },
  {
    id: '7',
    name: '王指挥',
    account: 'commander1',
    role: '指挥员',
    org: '高新园区派出所',
    status: 'active',
    createdAt: '2025-03-08 10:02',
    mobile: '13800000007',
  },
  {
    id: '8',
    name: '赵超管',
    account: 'super_admin1',
    role: '超级管理员',
    org: '市公安局',
    status: 'active',
    createdAt: '2025-03-08 10:03',
    mobile: '13800000008',
  },
  {
    id: '9',
    name: '刘飞手',
    account: 'pilot2',
    role: '外勤飞手',
    org: '应急管理局',
    status: 'active',
    createdAt: '2025-03-08 10:04',
    mobile: '13800000009',
  },
];

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<{
    role: string;
    status: string;
    startDate: string;
    endDate: string;
    org: string;
  }>({
    role: 'all',
    status: 'all',
    startDate: '',
    endDate: '',
    org: '',
  });
  const [showEditor, setShowEditor] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<{
    name: string;
    mobile: string;
    org: string;
    role: string;
    status: UserStatus;
  }>({
    name: '',
    mobile: '',
    org: '',
    role: '',
    status: 'active',
  });

  const allSelected = users.length > 0 && selectedIds.length === users.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((u) => u.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleToggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u,
      ),
    );
  };

  const handleDeleteOne = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const handleBatchDelete = () => {
    if (!selectedIds.length) return;
    setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
    setSelectedIds([]);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (search.trim()) {
        const kw = search.trim().toLowerCase();
        if (
          !u.name.toLowerCase().includes(kw) &&
          !u.account.toLowerCase().includes(kw) &&
          !u.org.toLowerCase().includes(kw)
        ) {
          return false;
        }
      }

      if (filter.role !== 'all' && filter.role && u.role !== filter.role) {
        return false;
      }

      if (filter.status === 'active' && u.status !== 'active') return false;
      if (filter.status === 'inactive' && u.status !== 'inactive') return false;

      if (filter.org.trim()) {
        const orgKw = filter.org.trim().toLowerCase();
        if (!u.org.toLowerCase().includes(orgKw)) return false;
      }

      if (filter.startDate || filter.endDate) {
        const ts = new Date(u.createdAt.replace(/-/g, '/'));
        if (Number.isNaN(ts.getTime())) {
          return false;
        }
        if (filter.startDate) {
          const start = new Date(filter.startDate);
          if (ts < start) return false;
        }
        if (filter.endDate) {
          const end = new Date(filter.endDate);
          if (ts > end) return false;
        }
      }

      return true;
    });
  }, [users, search, filter]);

  const openCreateModal = () => {
    setEditingUser(null);
    setForm({
      name: '',
      mobile: '',
      org: '',
      role: '',
      status: 'active',
    });
    setShowEditor(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      mobile: user.mobile ?? '',
      org: user.org,
      role: user.role,
      status: user.status,
    });
    setShowEditor(true);
  };

  const handleSaveUser = () => {
    if (!form.name.trim()) return;

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: form.name.trim(),
                mobile: form.mobile,
                org: form.org,
                role: form.role || u.role,
                status: form.status,
              }
            : u,
        ),
      );
    } else {
      const now = new Date();
      const createdAt = `${now.getFullYear()}-${String(
        now.getMonth() + 1,
      ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(
        now.getHours(),
      ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const id = String(Date.now());
      const account = `${form.name.replace(/\s+/g, '')}.${id.slice(-4)}`;

      const newUser: User = {
        id,
        name: form.name.trim(),
        account,
        role: form.role || '普通用户',
        org: form.org || '未分配单位',
        status: form.status,
        createdAt,
        mobile: form.mobile,
      };

      setUsers((prev) => [...prev, newUser]);
    }

    setShowEditor(false);
    setEditingUser(null);
  };

  const resetFilter = () => {
    setFilter({
      role: 'all',
      status: 'all',
      startDate: '',
      endDate: '',
      org: '',
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto mb-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">全域用户管理</h2>
            <p className="text-sm text-muted-foreground mt-1">
              跨组织搜索、管理与批量导入系统平台的操作账号。
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-secondary border border-border text-white px-4 py-2 rounded-md font-medium text-sm flex items-center hover:bg-border transition">
              <Upload size={16} className="mr-2" /> Excel 批量接入
            </button>
            {selectedIds.length > 0 && (
              <button
                onClick={handleBatchDelete}
                className="bg-red-500/10 border border-red-500/60 text-red-400 px-4 py-2 rounded-md font-medium text-sm hover:bg-red-500/20 transition"
              >
                批量删除（{selectedIds.length}）
              </button>
            )}
            <button
              className="bg-primary/20 border border-primary text-primary px-4 py-2 rounded-md font-medium text-sm flex items-center hover:bg-primary hover:text-primary-foreground transition shadow-[0_0_10px_rgba(0,195,255,0.2)]"
              onClick={openCreateModal}
            >
              <Plus size={16} className="mr-2" /> 注册用户
            </button>
          </div>
        </div>

        {/* 筛选区域（常显） */}
        <div className="bg-card tech-border rounded-xl flex flex-col">
          <div className="p-4 border-b border-border flex flex-wrap gap-4 items-end bg-secondary/50 rounded-t-xl">
            <div className="relative w-64">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="姓名 / 账号 / 单位 模糊检索..."
                className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
              />
            </div>

            <div className="flex flex-col text-xs text-slate-200">
              <span className="mb-1 text-muted-foreground">角色</span>
              <select
                className="border border-border bg-background text-white rounded-md text-sm py-2 px-3 focus:outline-none focus:border-primary outline-none"
                value={filter.role}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    role: e.target.value,
                  }))
                }
              >
                <option value="all">所有角色</option>
                <option value="超级管理员">超级管理员</option>
                <option value="指挥员">指挥员</option>
                <option value="外勤飞手">外勤飞手</option>
                <option value="AI 审核员">AI 审核员</option>
              </select>
            </div>

            <div className="flex flex-col text-xs text-slate-200">
              <span className="mb-1 text-muted-foreground">用户状态</span>
              <select
                className="border border-border bg-background text-white rounded-md text-sm py-2 px-3 focus:outline-none focus:border-primary outline-none"
                value={filter.status}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
              >
                <option value="all">所有用户状态</option>
                <option value="active">启用</option>
                <option value="inactive">停用</option>
              </select>
            </div>

            <div className="flex flex-col text-xs text-slate-200">
              <span className="mb-1 text-muted-foreground">所属单位</span>
              <input
                type="text"
                className="bg-background border border-border rounded px-2 py-2 text-sm text-white"
                value={filter.org}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    org: e.target.value,
                  }))
                }
                placeholder="按所属单位过滤..."
              />
            </div>

            <div className="flex flex-col text-xs text-slate-200">
              <span className="mb-1 text-muted-foreground">创建时间起</span>
              <input
                type="date"
                className="bg-background border border-border rounded px-2 py-1 text-sm text-white"
                value={filter.startDate}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-col text-xs text-slate-200">
              <span className="mb-1 text-muted-foreground">创建时间止</span>
              <input
                type="date"
                className="bg-background border border-border rounded px-2 py-1 text-sm text-white"
                value={filter.endDate}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
              />
            </div>

            <button
              className="ml-auto px-3 py-2 rounded border border-border text-xs text-muted-foreground hover:text-white hover:bg-secondary"
              onClick={resetFilter}
            >
              重置筛选
            </button>
          </div>

          {/* 表格 */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#0b1220] border-b border-border text-muted-foreground uppercase text-xs tracking-wider font-mono">
                <tr>
                  <th className="px-4 py-4 font-semibold">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="accent-sky-500"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                      />
                      <span className="ml-2">序号</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 font-semibold">凭证信息 USER_ID</th>
                  <th className="px-6 py-4 font-semibold">所属单位</th>
                  <th className="px-6 py-4 font-semibold">角色</th>
                  <th className="px-6 py-4 font-semibold">用户状态</th>
                  <th className="px-6 py-4 font-semibold">创建时间</th>
                  <th className="px-6 py-4 font-semibold text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background/50">
                {filteredUsers.map((user, index) => {
                  const checked = selectedIds.includes(user.id);
                  return (
                    <tr key={user.id} className="hover:bg-secondary/40 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="accent-sky-500"
                            checked={checked}
                            onChange={() => toggleSelectOne(user.id)}
                          />
                          <span className="ml-2 text-xs text-muted-foreground">
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-white tracking-wide">{user.name}</span>
                          <span className="text-muted-foreground font-mono text-xs mt-1">
                            {user.account}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{user.org}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs border border-primary/30 bg-primary/10 text-primary">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user.id)}
                          className={`relative inline-flex items-center h-6 w-11 rounded-full border transition-colors ${
                            user.status === 'active'
                              ? 'bg-emerald-500/20 border-emerald-400'
                              : 'bg-slate-700 border-slate-500'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
                              user.status === 'active' ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                          <span className="sr-only">切换用户状态</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs font-mono">
                        {user.createdAt}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center text-primary hover:text-blue-300"
                          title="编辑用户"
                          onClick={() => openEditModal(user)}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center text-red-400 hover:text-red-300"
                          title="删除用户"
                          onClick={() => handleDeleteOne(user.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-border flex items-center justify-between bg-secondary/30 rounded-b-xl">
            <span className="text-sm text-muted-foreground">
              共 {users.length} 个用户，当前展示 {filteredUsers.length} 条
            </span>
            <div className="flex items-center space-x-1">
              <button className="px-3 py-1 border border-border bg-background text-slate-500 rounded text-sm disabled:opacity-50">
                上页
              </button>
              <button className="px-3 py-1 border border-primary bg-primary text-primary-foreground rounded text-sm font-bold">
                1
              </button>
              <button className="px-3 py-1 border border-border bg-background text-slate-300 hover:bg-secondary rounded text-sm">
                2
              </button>
              <button className="px-3 py-1 border border-border bg-background text-slate-300 hover:bg-secondary rounded text-sm">
                下页
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 注册 / 编辑 用户弹窗 */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
          <div className="bg-[#050816] border border-primary/40 rounded-xl w-full max-w-lg p-6 shadow-2xl text-sm">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingUser ? '编辑用户' : '注册用户'}
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-muted-foreground mb-1">用户名</label>
                  <input
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-muted-foreground mb-1">手机号</label>
                  <input
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                    value={form.mobile}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        mobile: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-muted-foreground mb-1">所属单位</label>
                  <input
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                    value={form.org}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        org: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-muted-foreground mb-1">用户角色</label>
                  <input
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                    value={form.role}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        role: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">启用状态</span>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      status: prev.status === 'active' ? 'inactive' : 'active',
                    }))
                  }
                  className={`relative inline-flex items-center h-6 w-11 rounded-full border transition-colors ${
                    form.status === 'active'
                      ? 'bg-emerald-500/20 border-emerald-400'
                      : 'bg-slate-700 border-slate-500'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
                      form.status === 'active' ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                  <span className="sr-only">切换启用状态</span>
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                * 创建时间对新用户将以当前系统时间自动记录，账号 ID 自动生成；编辑时仅修改基础信息。
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-3 text-xs">
              <button
                className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white hover:bg-secondary"
                onClick={() => {
                  setShowEditor(false);
                  setEditingUser(null);
                }}
              >
                取消
              </button>
              <button
                className="px-4 py-2 rounded border border-primary bg-primary/80 text-primary-foreground"
                onClick={handleSaveUser}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Users;

