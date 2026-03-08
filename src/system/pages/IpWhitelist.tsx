import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import { useAudit } from '@/contexts/AuditContext';

interface WhitelistItem {
  id: string;
  ip: string;
  remark: string;
  createdAt: string;
}

const IpWhitelist: React.FC = () => {
  const { addLog } = useAudit();
  const [list, setList] = useState<WhitelistItem[]>([
    { id: '1', ip: '192.168.1.0/24', remark: '内网网段', createdAt: '2024-01-15' },
    { id: '2', ip: '10.0.0.100', remark: '运维跳板机', createdAt: '2024-02-01' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ip: '', remark: '' });

  const handleSave = () => {
    if (!form.ip.trim()) return;
    if (editingId) {
      setList((prev) => prev.map((x) => (x.id === editingId ? { ...x, ...form, createdAt: x.createdAt } : x)));
      addLog({ actionType: '修改', module: 'IP白名单', targetObject: form.ip, detailSummary: `编辑白名单：${form.ip}（${form.remark || '无备注'}）` });
      setEditingId(null);
    } else {
      setList((prev) => [...prev, { id: `w-${Date.now()}`, ...form, createdAt: new Date().toISOString().slice(0, 10) }]);
      addLog({ actionType: '新增', module: 'IP白名单', targetObject: form.ip, detailSummary: `新增白名单：${form.ip}（${form.remark || '无备注'}）` });
    }
    setShowModal(false);
    setForm({ ip: '', remark: '' });
  };

  const openEdit = (item: WhitelistItem) => {
    setEditingId(item.id);
    setForm({ ip: item.ip, remark: item.remark });
    setShowModal(true);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({ ip: '', remark: '' });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    const item = list.find((x) => x.id === id);
    if (item) addLog({ actionType: '删除', module: 'IP白名单', targetObject: item.ip, detailSummary: `删除白名单：${item.ip}`, isHighRisk: true });
    setList((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto flex flex-col pb-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">IP 白名单</h2>
            <p className="text-sm text-muted-foreground mt-1">配置允许访问系统接口的 IP 或网段，支持增删改查。</p>
          </div>
          <button
            className="bg-primary/20 border border-primary text-primary px-4 py-2 rounded-md text-sm flex items-center hover:bg-primary hover:text-primary-foreground"
            onClick={openAdd}
          >
            <Plus size={16} className="mr-2" /> 新增白名单
          </button>
        </div>

        <div className="bg-card tech-border rounded-xl overflow-hidden">
          <div className="border border-border rounded-lg overflow-hidden bg-background/40 text-sm">
            <table className="w-full text-left">
              <thead className="bg-secondary border-b border-border text-muted-foreground text-xs">
                <tr>
                  <th className="px-4 py-2">IP / 网段</th>
                  <th className="px-4 py-2">备注</th>
                  <th className="px-4 py-2">创建时间</th>
                  <th className="px-4 py-2 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-slate-100 text-xs">
                {list.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/40">
                    <td className="px-4 py-2 font-mono">{item.ip}</td>
                    <td className="px-4 py-2 text-muted-foreground">{item.remark}</td>
                    <td className="px-4 py-2">{item.createdAt}</td>
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
              <h3 className="text-lg font-semibold text-white mb-4">{editingId ? '编辑白名单' : '新增白名单'}</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">IP / 网段</label>
                  <input
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs font-mono"
                    placeholder="例如 192.168.1.0/24 或 10.0.0.1"
                    value={form.ip}
                    onChange={(e) => setForm((p) => ({ ...p, ip: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">备注</label>
                  <input
                    className="w-full px-3 py-2 bg-background border border-border rounded text-white text-xs"
                    value={form.remark}
                    onChange={(e) => setForm((p) => ({ ...p, remark: e.target.value }))}
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

export default IpWhitelist;
