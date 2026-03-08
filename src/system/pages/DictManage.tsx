import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import { useAudit } from '@/contexts/AuditContext';

interface DictItem {
  id: string;
  dictType: string;
  code: string;
  label: string;
  value: string;
  sortOrder: number;
}

const DictManage: React.FC = () => {
  const { addLog } = useAudit();
  const [list, setList] = useState<DictItem[]>([
    { id: '1', dictType: 'device_status', code: 'online', label: '在线', value: '1', sortOrder: 1 },
    { id: '2', dictType: 'device_status', code: 'offline', label: '离线', value: '0', sortOrder: 2 },
    { id: '3', dictType: 'task_status', code: 'pending', label: '待执行', value: 'pending', sortOrder: 1 },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DictItem>({ id: '', dictType: '', code: '', label: '', value: '', sortOrder: 0 });
  const [filterType, setFilterType] = useState('');

  const dictTypes = Array.from(new Set(list.map((d) => d.dictType)));
  const filtered = filterType ? list.filter((d) => d.dictType === filterType) : list;

  const handleSave = () => {
    if (!form.dictType.trim() || !form.code.trim() || !form.label.trim()) return;
    if (editingId) {
      setList((prev) => prev.map((x) => (x.id === editingId ? { ...form, id: x.id } : x)));
      addLog({ actionType: '修改', module: '字典管理', targetObject: `字典 ${form.dictType}`, detailSummary: `编辑字典项：${form.dictType} / ${form.code}（${form.label}）` });
    } else {
      setList((prev) => [...prev, { ...form, id: `d-${Date.now()}` }]);
      addLog({ actionType: '新增', module: '字典管理', targetObject: `字典 ${form.dictType}`, detailSummary: `新增字典项：${form.dictType} / ${form.code}（${form.label}）` });
    }
    setShowModal(false);
    setEditingId(null);
    setForm({ id: '', dictType: '', code: '', label: '', value: '', sortOrder: 0 });
  };

  const openEdit = (item: DictItem) => {
    setEditingId(item.id);
    setForm({ ...item });
    setShowModal(true);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({ id: '', dictType: filterType || '', code: '', label: '', value: '', sortOrder: list.length + 1 });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    const item = list.find((x) => x.id === id);
    if (item) addLog({ actionType: '删除', module: '字典管理', targetObject: `字典 ${item.dictType}`, detailSummary: `删除字典项：${item.dictType} / ${item.code}`, isHighRisk: true });
    setList((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto flex flex-col pb-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">字典管理</h2>
            <p className="text-sm text-muted-foreground mt-1">支持系统字典的增删改查，用于下拉选项与枚举展示。</p>
          </div>
          <button
            className="bg-primary/20 border border-primary text-primary px-4 py-2 rounded-md text-sm flex items-center hover:bg-primary hover:text-primary-foreground"
            onClick={openAdd}
          >
            <Plus size={16} className="mr-2" /> 新增字典项
          </button>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">字典类型：</span>
          <select
            className="px-3 py-1.5 bg-background border border-border rounded text-white text-xs"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">全部</option>
            {dictTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="bg-card tech-border rounded-xl overflow-hidden">
          <div className="border border-border rounded-lg overflow-hidden bg-background/40 text-sm">
            <table className="w-full text-left">
              <thead className="bg-secondary border-b border-border text-muted-foreground text-xs">
                <tr>
                  <th className="px-4 py-2">字典类型</th>
                  <th className="px-4 py-2">编码</th>
                  <th className="px-4 py-2">标签（展示名）</th>
                  <th className="px-4 py-2">值</th>
                  <th className="px-4 py-2">排序</th>
                  <th className="px-4 py-2 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-slate-100 text-xs">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/40">
                    <td className="px-4 py-2 font-mono">{item.dictType}</td>
                    <td className="px-4 py-2 font-mono">{item.code}</td>
                    <td className="px-4 py-2">{item.label}</td>
                    <td className="px-4 py-2 text-muted-foreground">{item.value}</td>
                    <td className="px-4 py-2">{item.sortOrder}</td>
                    <td className="px-4 py-2 text-right">
                      <button type="button" className="text-primary hover:underline mr-2" onClick={() => openEdit(item)}>编辑</button>
                      <button type="button" className="text-red-400 hover:underline" onClick={() => handleDelete(item.id)}>删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
            <div className="bg-[#050816] border border-primary/40 rounded-xl w-full max-w-md p-6 shadow-2xl text-sm">
              <h3 className="text-lg font-semibold text-white mb-4">{editingId ? '编辑字典' : '新增字典项'}</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">字典类型</label>
                  <input
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs font-mono"
                    value={form.dictType}
                    onChange={(e) => setForm((p) => ({ ...p, dictType: e.target.value }))}
                    placeholder="如：device_status"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">编码（code）</label>
                  <input
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs font-mono"
                    value={form.code}
                    onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                    placeholder="如：online"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">标签（用户侧展示名）</label>
                  <input
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                    value={form.label}
                    onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                    placeholder="如：在线"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">值（value）</label>
                  <input
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                    value={form.value}
                    onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
                    placeholder="存储或接口使用的值"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">排序</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                    value={form.sortOrder}
                    onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button className="px-4 py-2 rounded border border-border text-muted-foreground hover:text-white" onClick={() => { setShowModal(false); setEditingId(null); }}>取消</button>
                <button className="px-4 py-2 rounded border border-primary bg-primary/80 text-primary-foreground" onClick={handleSave}>保存</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DictManage;
