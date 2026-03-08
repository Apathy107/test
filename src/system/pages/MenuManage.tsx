import React, { useMemo, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import { useAudit } from '@/contexts/AuditContext';
import { PLATFORM_MENUS } from '@/config/platformMenus';

export interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
  parentId: string;
  sortOrder: number;
}

function getDescendantIds(list: MenuItem[], parentId: string): string[] {
  const children = list.filter((m) => m.parentId === parentId);
  let ids = children.map((c) => c.id);
  children.forEach((c) => {
    ids = ids.concat(getDescendantIds(list, c.id));
  });
  return ids;
}

/** 按树形顺序与层级生成父级选项（用于多级菜单下拉），排除自身及子孙 */
function buildParentOptions(list: MenuItem[], editingId: string | null): { id: string; name: string; level: number }[] {
  const exclude = new Set(editingId ? [editingId, ...getDescendantIds(list, editingId)] : []);
  const byParent = list.reduce<Record<string, MenuItem[]>>((acc, m) => {
    const p = m.parentId;
    const key = p === '' ? '_root' : p;
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});
  const result: { id: string; name: string; level: number }[] = [{ id: '', name: '无（一级菜单）', level: 0 }];
  function walk(parentKey: string, level: number) {
    const children = (byParent[parentKey] || []).sort((a, b) => a.sortOrder - b.sortOrder);
    children.forEach((m) => {
      if (exclude.has(m.id)) return;
      result.push({ id: m.id, name: m.name, level });
      walk(m.id, level + 1);
    });
  }
  walk('_root', 0);
  return result;
}

const MenuManage: React.FC = () => {
  const { addLog } = useAudit();
  const [list, setList] = useState<MenuItem[]>(() => [...PLATFORM_MENUS]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MenuItem>({ id: '', name: '', path: '', parentId: '', sortOrder: 0 });
  const [formError, setFormError] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const parentOptions = useMemo(() => buildParentOptions(list, editingId), [list, editingId]);

  const handleSave = () => {
    setFormError('');
    if (!form.name.trim() || !form.path.trim()) {
      setFormError('请填写菜单名称和路径');
      return;
    }
    if (editingId) {
      setList((prev) => prev.map((x) => (x.id === editingId ? { ...form, id: x.id } : x)));
      addLog({ actionType: '修改', module: '菜单管理', targetObject: `菜单「${form.name}」`, detailSummary: `编辑菜单：${form.name}，路径 ${form.path}` });
    } else {
      const newId = `m-${Date.now()}`;
      const newRecord: MenuItem = { ...form, id: newId };
      setList((prev) => [...prev, newRecord]);
      addLog({ actionType: '新增', module: '菜单管理', targetObject: `菜单「${form.name}」`, detailSummary: `新增菜单：${form.name}，路径 ${form.path}` });
      setSaveSuccessMsg(`已添加菜单「${form.name}」`);
      setTimeout(() => setSaveSuccessMsg(''), 2500);
    }
    setShowModal(false);
    setEditingId(null);
    setForm({ id: '', name: '', path: '', parentId: '', sortOrder: 0 });
  };

  const openEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setFormError('');
    setForm({ ...item });
    setShowModal(true);
  };

  const openAdd = () => {
    setEditingId(null);
    setFormError('');
    const maxOrder = list.length ? Math.max(...list.map((m) => m.sortOrder), 0) : 0;
    setForm({ id: '', name: '', path: '', parentId: '', sortOrder: maxOrder + 1 });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    const item = list.find((x) => x.id === id);
    if (item) addLog({ actionType: '删除', module: '菜单管理', targetObject: `菜单「${item.name}」`, detailSummary: `删除菜单：${item.name}（${item.path}）`, isHighRisk: true });
    setList((prev) => prev.filter((x) => x.id !== id));
  };

  /** 从平台路由配置读取最新菜单目录并刷新列表 */
  const syncFromPlatform = () => {
    setList([...PLATFORM_MENUS]);
    addLog({ actionType: '修改', module: '菜单管理', targetObject: '菜单列表', detailSummary: '从平台路由更新菜单列表' });
  };

  /** 表格行按树形顺序排列 */
  const sortedList = useMemo(() => {
    const byParent = list.reduce<Record<string, MenuItem[]>>((acc, m) => {
      const key = m.parentId === '' ? '_root' : m.parentId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(m);
      return acc;
    }, {});
    const out: MenuItem[] = [];
    function walk(parentKey: string) {
      (byParent[parentKey] || []).sort((a, b) => a.sortOrder - b.sortOrder).forEach((m) => {
        out.push(m);
        walk(m.id);
      });
    }
    walk('_root');
    return out;
  }, [list]);

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto flex flex-col pb-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">菜单管理</h2>
            <p className="text-sm text-muted-foreground mt-1">囊括全平台路由；支持多级菜单的增删改查。</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-2 rounded border border-border text-muted-foreground hover:text-white text-sm flex items-center"
              onClick={syncFromPlatform}
            >
              <RefreshCw size={14} className="mr-1.5" /> 从平台路由更新
            </button>
            <button
              className="bg-primary/20 border border-primary text-primary px-4 py-2 rounded-md text-sm flex items-center hover:bg-primary hover:text-primary-foreground"
              onClick={openAdd}
            >
              <Plus size={16} className="mr-2" /> 新增菜单
            </button>
          </div>
        </div>

        <div className="bg-card tech-border rounded-xl overflow-hidden">
          <div className="border border-border rounded-lg overflow-hidden bg-background/40 text-sm">
            <table className="w-full text-left">
              <thead className="bg-secondary border-b border-border text-muted-foreground text-xs">
                <tr>
                  <th className="px-4 py-2">序号</th>
                  <th className="px-4 py-2">菜单名称</th>
                  <th className="px-4 py-2">路径</th>
                  <th className="px-4 py-2">父级</th>
                  <th className="px-4 py-2">排序</th>
                  <th className="px-4 py-2 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-slate-100 text-xs">
                {sortedList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-secondary/40">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2 font-medium">
                      {item.parentId ? (
                        <span className="text-muted-foreground pl-4">├ {item.name}</span>
                      ) : (
                        item.name
                      )}
                    </td>
                    <td className="px-4 py-2 font-mono text-muted-foreground">{item.path}</td>
                    <td className="px-4 py-2">{item.parentId ? list.find((p) => p.id === item.parentId)?.name || '-' : '-'}</td>
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
              <h3 className="text-lg font-semibold text-white mb-4">{editingId ? '编辑菜单' : '新增菜单'}</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">菜单名称</label>
                  <input
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="如：运维中心"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">路径</label>
                  <input
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs font-mono"
                    value={form.path}
                    onChange={(e) => setForm((p) => ({ ...p, path: e.target.value }))}
                    placeholder="如：/system 或 /system/organization"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">父级菜单（支持多级）</label>
                  <select
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                    value={form.parentId}
                    onChange={(e) => setForm((p) => ({ ...p, parentId: e.target.value }))}
                  >
                    {parentOptions.map((opt) => (
                      <option key={opt.id === '' ? '_root' : opt.id} value={opt.id}>
                        {opt.level > 0 ? '　'.repeat(opt.level) + '├ ' + opt.name : opt.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">可选任意层级作为父级，形成多级菜单。</p>
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
                {formError && (
                  <p className="text-red-400 text-xs">{formError}</p>
                )}
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

export default MenuManage;
