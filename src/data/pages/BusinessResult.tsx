import React, { useState, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import DataWorkspace, { ViewMode } from '../components/layout/DataWorkspace';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { FileCheck, Download, Eye, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { violationCasesList, type ViolationCaseRecord } from '../violationCasesData';
import type { CaseType } from '../violationCasesData';

const statusCfg: Record<string, { label: string; color: string; bg: string }> = {
  submitted: { label: '已提交', color: 'rgba(0, 210, 240, 1)', bg: 'rgba(0, 50, 82, 0.85)' },
  unsubmitted: { label: '未提交', color: 'rgba(255, 185, 0, 1)', bg: 'rgba(58, 38, 0, 0.85)' },
};

export default function BusinessResult() {
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCaseType, setFilterCaseType] = useState<CaseType | ''>('');
  const [filterTimeStart, setFilterTimeStart] = useState('');
  const [filterTimeEnd, setFilterTimeEnd] = useState('');
  const [filterAddress, setFilterAddress] = useState('');
  const [filterKeyword, setFilterKeyword] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [items, setItems] = useState<ViolationCaseRecord[]>(() => [...violationCasesList]);
  const [editCase, setEditCase] = useState<ViolationCaseRecord | null>(null);
  const [editForm, setEditForm] = useState<ViolationCaseRecord | null>(null);
  const [photoLightbox, setPhotoLightbox] = useState<{ caseId: string; index: number } | null>(null);

  const filteredItems = useMemo(() => {
    let list = [...items];
    if (filterType) list = list.filter((c) => c.type === filterType);
    if (filterStatus) list = list.filter((c) => (filterStatus === '已提交' ? c.status === 'submitted' : c.status === 'unsubmitted'));
    if (filterCaseType) list = list.filter((c) => c.caseType === filterCaseType);
    const getDateStr = (c: ViolationCaseRecord) => {
      if (c.date) return c.date;
      const m = c.caseNo.match(/^VIO-(\d{4})-(\d{2})-(\d{2})-/);
      return m ? `${m[1]}-${m[2]}-${m[3]}` : '';
    };
    if (filterTimeStart) list = list.filter((c) => getDateStr(c) >= filterTimeStart);
    if (filterTimeEnd) list = list.filter((c) => getDateStr(c) <= filterTimeEnd);
    if (filterAddress.trim()) {
      const q = filterAddress.trim().toLowerCase();
      list = list.filter((c) => c.location.toLowerCase().includes(q));
    }
    if (filterKeyword.trim()) {
      const q = filterKeyword.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.caseNo.toLowerCase().includes(q) ||
          c.plate.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.type.toLowerCase().includes(q) ||
          (c.caseType && c.caseType.toLowerCase().includes(q)) ||
          (c.violationCode && c.violationCode.toLowerCase().includes(q))
      );
    }
    return list;
  }, [items, filterType, filterStatus, filterCaseType, filterTimeStart, filterTimeEnd, filterAddress, filterKeyword]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredItems.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredItems.map((c) => c.id)));
  };

  const handleDownloadOne = (c: ViolationCaseRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const blob = new Blob([JSON.stringify(c, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${c.caseNo}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBatchExport = () => {
    const toExport = items.filter((c) => selectedIds.has(c.id));
    if (toExport.length === 0) return;
    const blob = new Blob([JSON.stringify(toExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `非现业务成果_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedCase = selectedId ? items.find((c) => c.id === selectedId) || null : null;

  const handleSaveEdit = () => {
    if (editForm) {
      setItems((prev) => prev.map((c) => (c.id === editForm.id ? editForm : c)));
      setSelectedId(editForm.id);
      setEditCase(null);
      setEditForm(null);
    }
  };

  const handleDelete = (c: ViolationCaseRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) => prev.filter((i) => i.id !== c.id));
    if (selectedId === c.id) setSelectedId(null);
  };

  const breadcrumbs = [
    { label: '数据智能中心', path: '/data' },
    { label: '数据资产库', path: '/data/raw' },
    { label: '非现业务成果' },
  ];

  const actions = (
    <span className="text-xs text-muted-foreground">
      同步自「业务应用中心」-「交通非现执法」-「违法成果」
    </span>
  );

  const filters = (
    <>
      <input
        type="text"
        placeholder="关键字模糊搜索"
        value={filterKeyword}
        onChange={(e) => setFilterKeyword(e.target.value)}
        className="text-xs rounded border border-border bg-background/80 px-2 py-1.5 text-foreground min-w-[140px]"
      />
      <input type="date" value={filterTimeStart} onChange={(e) => setFilterTimeStart(e.target.value)} className="text-xs rounded border border-border bg-background/80 px-2 py-1.5 text-foreground" />
      <span className="text-muted-foreground text-xs">至</span>
      <input type="date" value={filterTimeEnd} onChange={(e) => setFilterTimeEnd(e.target.value)} className="text-xs rounded border border-border bg-background/80 px-2 py-1.5 text-foreground" />
      <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="text-xs rounded border border-border bg-background/80 px-2 py-1.5 text-foreground">
        <option value="">全部违法类型</option>
        {Array.from(new Set(items.map((c) => c.type))).map((t: string) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="违法地址"
        value={filterAddress}
        onChange={(e) => setFilterAddress(e.target.value)}
        className="text-xs rounded border border-border bg-background/80 px-2 py-1.5 text-foreground min-w-[100px]"
      />
      <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-xs rounded border border-border bg-background/80 px-2 py-1.5 text-foreground">
        <option value="">提交状态</option>
        <option value="已提交">已提交</option>
        <option value="未提交">未提交</option>
      </select>
      <select value={filterCaseType} onChange={(e) => setFilterCaseType((e.target.value || '') as CaseType | '')} className="text-xs rounded border border-border bg-background/80 px-2 py-1.5 text-foreground">
        <option value="">类型</option>
        <option value="预警">预警</option>
        <option value="执法">执法</option>
      </select>
    </>
  );

  const batchBar = selectedIds.size > 0 ? (
    <>
      <span className="text-sm text-foreground">已选 {selectedIds.size} 项</span>
      <button type="button" onClick={handleBatchExport} className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs rounded text-foreground hover:bg-secondary/80">
        <Download size={14} /> 批量导出
      </button>
    </>
  ) : null;

  const pagination = <div className="text-sm text-muted-foreground">共 {filteredItems.length} 条（与违法成果数据同步）</div>;

  const detailRows = (c: ViolationCaseRecord): [string, string][] => [
    ['案件编号', c.caseNo],
    ['违法类型', c.type],
    ['违法代码', c.violationCode],
    ['违法地址', c.location],
    ['路段代码', c.sectionCode ?? '—'],
    ['道路代码', c.roadCode ?? '—'],
    ['违法时间', c.time],
    ['类型', c.caseType ?? '—'],
    ['行政区划', c.region ?? '—'],
    ['数据来源', c.dataSource ?? '—'],
    ['上传状态', c.uploadStatus ?? (c.status === 'submitted' ? '已上传' : '未上传')],
  ];

  return (
    <Layout>
      <DataWorkspace
        breadcrumbs={breadcrumbs}
        actions={actions}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        hideMapButton
        filters={filters}
        batchBar={batchBar}
        pagination={pagination}
      >
        <div className="flex gap-4" style={{ minHeight: 400 }}>
          <div className="flex-1 min-w-0">
            {viewMode === 'list' ? (
              <div className="rounded border border-border overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">列表</span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground">
                    <input type="checkbox" checked={filteredItems.length > 0 && selectedIds.size === filteredItems.length} onChange={toggleSelectAll} className="rounded border-border" />
                    全选本页
                  </label>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-muted/30 text-muted-foreground text-left">
                    <tr>
                      <th className="w-8 px-3 py-2"></th>
                      <th className="px-3 py-2">案件编号</th>
                      <th className="px-3 py-2">违法类型</th>
                      <th className="px-3 py-2">类型</th>
                      <th className="px-3 py-2">违法地址</th>
                      <th className="px-3 py-2">违法时间</th>
                      <th className="px-3 py-2">车牌/对象</th>
                      <th className="px-3 py-2">提交状态</th>
                      <th className="px-3 py-2">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedId(c.id)}
                        className={`border-t border-border hover:bg-muted/20 cursor-pointer ${selectedId === c.id ? 'bg-primary/10' : ''}`}
                      >
                        <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggleSelect(c.id)} className="rounded border-border" />
                        </td>
                        <td className="px-3 py-2 font-mono text-primary">{c.caseNo}</td>
                        <td className="px-3 py-2 text-foreground">{c.type}</td>
                        <td className="px-3 py-2 text-muted-foreground">{c.caseType ?? '—'}</td>
                        <td className="px-3 py-2 text-muted-foreground truncate max-w-[200px]" title={c.location}>{c.location}</td>
                        <td className="px-3 py-2 text-muted-foreground">{c.time}</td>
                        <td className="px-3 py-2 text-muted-foreground">{c.plate}</td>
                        <td className="px-3 py-2">
                          <span className={c.status === 'submitted' ? 'text-primary' : 'text-amber-500'}>{statusCfg[c.status]?.label ?? c.status}</span>
                        </td>
                        <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => setSelectedId(c.id)} className="text-primary hover:underline text-xs flex items-center gap-1" title="预览">
                              <Eye size={12} /> 预览
                            </button>
                            <button type="button" onClick={(e) => handleDownloadOne(c, e)} className="text-muted-foreground hover:underline text-xs flex items-center gap-1" title="下载">
                              <Download size={12} /> 下载
                            </button>
                            <button type="button" onClick={() => { setEditCase(c); setEditForm({ ...c }); }} className="text-primary hover:underline text-xs flex items-center gap-1" title="编辑">
                              <Pencil size={12} /> 编辑
                            </button>
                            <button type="button" onClick={(e) => handleDelete(c, e)} className="text-destructive hover:underline text-xs flex items-center gap-1" title="删除">
                              <Trash2 size={12} /> 删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="col-span-full flex justify-end">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground">
                    <input type="checkbox" checked={filteredItems.length > 0 && selectedIds.size === filteredItems.length} onChange={toggleSelectAll} className="rounded border-border" />
                    全选本页
                  </label>
                </div>
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`relative rounded-lg border overflow-hidden transition-colors cursor-pointer ${
                      selectedId === item.id ? 'border-primary bg-primary/10' : 'border-border bg-card/50 hover:border-primary/50'
                    }`}
                  >
                    <div className="absolute top-2 left-2 z-10">
                      <input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => toggleSelect(item.id)} onClick={(e) => e.stopPropagation()} className="rounded border-border" />
                    </div>
                    <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                      <FileCheck size={32} className="text-muted-foreground" />
                    </div>
                    <div className="p-3 border-t border-border">
                      <div className="text-sm font-medium text-foreground">车牌：{item.plate}</div>
                      <div className="text-xs text-muted-foreground mt-1">{item.type} · {item.caseType ?? '—'} · {item.time}</div>
                      <div className="text-xs text-muted-foreground truncate" title={item.location}>{item.location}</div>
                      <div className="text-xs mt-1">
                        <span className={item.status === 'submitted' ? 'text-primary' : 'text-amber-500'}>{statusCfg[item.status]?.label}</span>
                        <span className="text-muted-foreground ml-1">· {item.caseNo}</span>
                      </div>
                      <div className="flex gap-2 mt-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                        <button type="button" onClick={() => setSelectedId(item.id)} className="text-primary hover:underline text-xs flex items-center gap-1"><Eye size={12} /> 预览</button>
                        <button type="button" onClick={(e) => handleDownloadOne(item, e)} className="text-muted-foreground hover:underline text-xs flex items-center gap-1"><Download size={12} /> 下载</button>
                        <button type="button" onClick={() => { setEditCase(item); setEditForm({ ...item }); }} className="text-primary hover:underline text-xs flex items-center gap-1"><Pencil size={12} /> 编辑</button>
                        <button type="button" onClick={(e) => handleDelete(item, e)} className="text-destructive hover:underline text-xs flex items-center gap-1"><Trash2 size={12} /> 删除</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-[300px] flex-shrink-0 flex flex-col gap-3">
            {selectedCase ? (
              <>
                <div className="rounded-lg border border-border bg-card/50 p-4">
                  <div className="text-sm font-semibold text-primary mb-3">案件详情</div>
                  <div className="flex flex-col gap-2 text-xs">
                    {detailRows(selectedCase).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2">
                        <span className="text-muted-foreground flex-shrink-0">{k}</span>
                        <span className="text-foreground font-medium text-right break-all">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <span
                      className="inline-block px-2 py-1 rounded text-[10px] font-semibold"
                      style={{ background: statusCfg[selectedCase.status]?.bg, color: statusCfg[selectedCase.status]?.color }}
                    >
                      提交状态：{statusCfg[selectedCase.status]?.label}
                    </span>
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-card/50 p-4">
                  <div className="text-sm font-semibold text-primary mb-2">违法照片（点击查看大图）</div>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: selectedCase.evidence }, (_, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setPhotoLightbox({ caseId: selectedCase.id, index: i })}
                        className="w-[72px] h-[56px] rounded border border-border bg-muted flex items-center justify-center text-lg hover:border-primary/50 transition-colors cursor-pointer"
                      >
                        {selectedCase.type.includes('车') ? '🚗' : '🚶'}
                      </button>
                    ))}
                  </div>
                </div>
                {selectedCase.status === 'unsubmitted' && (
                  <button
                    type="button"
                    onClick={() => { setEditCase(selectedCase); setEditForm({ ...selectedCase }); }}
                    className="w-full py-2 rounded border border-primary/50 bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center gap-2 hover:bg-primary/20"
                  >
                    <Pencil size={14} /> 编辑
                  </button>
                )}
              </>
            ) : (
              <div className="rounded-lg border border-border bg-card/50 flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <AlertTriangle size={28} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">点击左侧记录查看详情</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DataWorkspace>

      <Dialog open={!!photoLightbox} onOpenChange={(open) => !open && setPhotoLightbox(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>违法照片 - 大图</DialogTitle></DialogHeader>
          {photoLightbox && (() => {
            const c = items.find((x) => x.id === photoLightbox.caseId);
            return (
              <div className="rounded-lg border border-border bg-muted/30 p-8 flex flex-col items-center justify-center min-h-[280px]">
                <div className="text-6xl mb-2">{c?.type.includes('车') ? '🚗' : '🚶'}</div>
                <p className="text-sm text-muted-foreground">违法照片 第 {photoLightbox.index + 1} 张（可接入真实图片预览）</p>
                {c && <p className="text-xs text-muted-foreground mt-1">{c.caseNo}</p>}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editCase} onOpenChange={(open) => !open && (setEditCase(null), setEditForm(null))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>编辑案件</DialogTitle></DialogHeader>
          {editForm && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                {(['caseNo', 'type', 'violationCode', 'location', 'time', 'plate', 'dataSource'] as const).map((key) => (
                  <div key={key}>
                    <label className="text-muted-foreground block mb-1">{key === 'caseNo' ? '案件编号' : key === 'type' ? '违法类型' : key === 'violationCode' ? '违法代码' : key === 'location' ? '违法地址' : key === 'time' ? '违法时间' : key === 'plate' ? '车牌' : '数据来源'}</label>
                    <input
                      type="text"
                      value={editForm[key] ?? ''}
                      onChange={(e) => setEditForm((f) => f ? { ...f, [key]: e.target.value } : null)}
                      className="w-full rounded border border-border bg-transparent px-2 py-1.5 text-xs"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-muted-foreground block mb-1">类型</label>
                  <select
                    value={editForm.caseType ?? ''}
                    onChange={(e) => setEditForm((f) => f ? { ...f, caseType: (e.target.value || undefined) as CaseType } : null)}
                    className="w-full rounded border border-border bg-transparent px-2 py-1.5 text-xs"
                  >
                    <option value="">—</option>
                    <option value="预警">预警</option>
                    <option value="执法">执法</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <button type="button" onClick={() => (setEditCase(null), setEditForm(null))} className="px-4 py-2 text-sm rounded border border-border hover:bg-secondary">取消</button>
            <button type="button" onClick={handleSaveEdit} className="px-4 py-2 text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90">保存</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}