import React, { useState, useMemo, useRef } from 'react';
import Layout from '../components/layout/Layout';
import DataWorkspace, { ViewMode } from '../components/layout/DataWorkspace';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { Box, Download, FolderPlus, FolderOpen, ChevronLeft, Upload, Eye, Pencil, Trash2 } from 'lucide-react';
import JSZip from 'jszip';

export interface DsmFolder {
  id: string;
  name: string;
  count: number;
  date: string;
}

export interface DsmItem {
  id: string;
  folderId: string | null;
  name: string;
  status: string;
  time: string;
  size: string;
  file?: File;
}

const INITIAL_FOLDERS: DsmFolder[] = [
  { id: 'df1', name: 'XX区DSM_20240520', count: 1, date: '2024-05-20' },
  { id: 'df2', name: '工业园区DSM_20240615', count: 1, date: '2024-06-15' },
];

const INITIAL_ITEMS: DsmItem[] = [
  { id: 'd1', folderId: 'df1', name: 'XX区数字表面模型_20240520.tif', status: '成功', time: '2024-05-20', size: '320.5 MB' },
  { id: 'd2', folderId: 'df2', name: '工业园区DSM_20240615.tif', status: '成功', time: '2024-06-15', size: '580.2 MB' },
];

export default function DsmResult() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [folders, setFolders] = useState<DsmFolder[]>(INITIAL_FOLDERS);
  const [items, setItems] = useState<DsmItem[]>(INITIAL_ITEMS);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [moveToFolderOpen, setMoveToFolderOpen] = useState(false);
  const [moveTargetFolderId, setMoveTargetFolderId] = useState<string | null>(null);
  const [filterName, setFilterName] = useState('');
  const [filterTimeStart, setFilterTimeStart] = useState('');
  const [filterTimeEnd, setFilterTimeEnd] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [previewItem, setPreviewItem] = useState<DsmItem | null>(null);
  const [editItem, setEditItem] = useState<DsmItem | null>(null);
  const [editForm, setEditForm] = useState({ name: '', status: '', time: '', size: '' });

  const currentFolder = currentFolderId ? folders.find((f) => f.id === currentFolderId) : null;
  const filteredItems = useMemo(() => {
    let list = currentFolderId ? items.filter((i) => i.folderId === currentFolderId) : items;
    if (filterName.trim()) {
      const q = filterName.trim().toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q));
    }
    if (filterTimeStart) list = list.filter((i) => i.time >= filterTimeStart);
    if (filterTimeEnd) list = list.filter((i) => i.time <= filterTimeEnd);
    if (filterStatus) list = list.filter((i) => i.status === filterStatus);
    return list;
  }, [items, currentFolderId, filterName, filterTimeStart, filterTimeEnd, filterStatus]);

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
    else setSelectedIds(new Set(filteredItems.map((i) => i.id)));
  };

  const handleNewFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    const id = 'df-' + Date.now();
    const date = new Date().toISOString().slice(0, 10);
    setFolders((prev) => [...prev, { id, name, count: 0, date }]);
    setNewFolderName('');
    setNewFolderOpen(false);
  };

  const handleMoveToFolder = () => {
    if (!moveTargetFolderId || selectedIds.size === 0) return;
    setItems((prev) => prev.map((i) => (selectedIds.has(i.id) ? { ...i, folderId: moveTargetFolderId } : i)));
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id !== moveTargetFolderId) return f;
        const inFolder = items.filter((x) => x.folderId === f.id).length;
        const moving = items.filter((x) => selectedIds.has(x.id) && x.folderId !== f.id).length;
        return { ...f, count: inFolder + moving };
      })
    );
    setSelectedIds(new Set());
    setMoveToFolderOpen(false);
    setMoveTargetFolderId(null);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected?.length) return;
    const date = new Date().toISOString().slice(0, 10);
    const added: DsmItem[] = [];
    for (let i = 0; i < selected.length; i++) {
      const file = selected[i];
      added.push({
        id: 'd-import-' + Date.now() + '-' + i,
        folderId: currentFolderId,
        name: file.name,
        status: '成功',
        time: date,
        size: file.size >= 1024 * 1024 * 1024 ? (file.size / 1024 / 1024 / 1024).toFixed(2) + ' GB' : (file.size / 1024 / 1024).toFixed(1) + ' MB',
        file,
      });
    }
    setItems((prev) => [...prev, ...added]);
    if (currentFolderId) {
      setFolders((prev) => prev.map((f) => (f.id === currentFolderId ? { ...f, count: f.count + added.length } : f)));
    }
    e.target.value = '';
  };

  const handleImportFolder = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected?.length) return;
    const date = new Date().toISOString().slice(0, 10);
    const added: DsmItem[] = [];
    for (let i = 0; i < selected.length; i++) {
      const file = selected[i];
      added.push({
        id: 'd-import-' + Date.now() + '-' + i,
        folderId: currentFolderId,
        name: file.name,
        status: '成功',
        time: date,
        size: file.size >= 1024 * 1024 * 1024 ? (file.size / 1024 / 1024 / 1024).toFixed(2) + ' GB' : (file.size / 1024 / 1024).toFixed(1) + ' MB',
        file,
      });
    }
    setItems((prev) => [...prev, ...added]);
    if (currentFolderId) {
      setFolders((prev) => prev.map((f) => (f.id === currentFolderId ? { ...f, count: f.count + added.length } : f)));
    }
    e.target.value = '';
  };

  const handleDownloadOne = (item: DsmItem) => {
    if (item.file) {
      const url = URL.createObjectURL(item.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.name;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob(['placeholder'], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDeleteOne = (item: DsmItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    if (item.folderId) {
      setFolders((prev) => prev.map((f) => (f.id === item.folderId ? { ...f, count: Math.max(0, f.count - 1) } : f)));
    }
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(item.id); return n; });
  };

  const handleBatchDelete = () => {
    if (selectedIds.size === 0) return;
    const folderUpdates = new Map<string, number>();
    items.forEach((i) => {
      if (selectedIds.has(i.id) && i.folderId) folderUpdates.set(i.folderId, (folderUpdates.get(i.folderId) ?? 0) + 1);
    });
    setItems((prev) => prev.filter((i) => !selectedIds.has(i.id)));
    setFolders((prev) => prev.map((f) => ({ ...f, count: Math.max(0, f.count - (folderUpdates.get(f.id) ?? 0)) })));
    setSelectedIds(new Set());
  };

  const handleExportZip = async () => {
    const toExport = items.filter((i) => selectedIds.has(i.id));
    if (toExport.length === 0) {
      alert('请先勾选要导出的记录。');
      return;
    }
    const zip = new JSZip();
    for (const item of toExport) {
      const folderName = item.folderId ? folders.find((f) => f.id === item.folderId)?.name ?? '' : '';
      const path = folderName ? `${folderName}/${item.name}` : item.name;
      if (item.file) zip.file(path, item.file);
      else zip.file(path, 'placeholder');
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `数字表面模型_${new Date().toISOString().slice(0, 10)}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openEdit = (item: DsmItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditItem(item);
    setEditForm({ name: item.name, status: item.status, time: item.time, size: item.size });
  };

  const handleEditSave = () => {
    if (!editItem) return;
    setItems((prev) => prev.map((i) => (i.id === editItem.id ? { ...i, ...editForm } : i)));
    setEditItem(null);
  };

  const breadcrumbs = [
    { label: '数据智能中心', path: '/data' },
    { label: '数据资产库', path: '/data/raw' },
    { label: '数字表面模型', path: currentFolderId ? '/data/dsm' : undefined },
    ...(currentFolder ? [{ label: currentFolder.name } as { label: string; path?: string }] : []),
  ];

  const actions = (
    <>
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleImport} />
      <input ref={folderInputRef} type="file" className="hidden" onChange={handleImportFolder} {...({ webkitDirectory: true } as React.InputHTMLAttributes<HTMLInputElement>)} />
      <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 text-xs rounded border border-border bg-secondary hover:bg-secondary/80 text-foreground flex items-center gap-1.5">
        <Upload size={14} /> 导入文件
      </button>
      <button type="button" onClick={() => folderInputRef.current?.click()} className="px-3 py-1.5 text-xs rounded border border-border bg-secondary hover:bg-secondary/80 text-foreground flex items-center gap-1.5">
        <Upload size={14} /> 导入文件夹
      </button>
      <button type="button" onClick={handleExportZip} className="px-3 py-1.5 text-xs rounded border border-border bg-secondary hover:bg-secondary/80 text-foreground flex items-center gap-1.5">
        <Download size={14} /> 导出
      </button>
    </>
  );

  const filters = (
    <>
      <input type="text" placeholder="文件名检索" value={filterName} onChange={(e) => setFilterName(e.target.value)} className="text-xs rounded border border-border bg-background/80 px-2 py-1.5 text-foreground min-w-[120px]" />
      <input type="date" value={filterTimeStart} onChange={(e) => setFilterTimeStart(e.target.value)} className="text-xs rounded border border-border bg-background/80 px-2 py-1.5 text-foreground" />
      <span className="text-muted-foreground text-xs">至</span>
      <input type="date" value={filterTimeEnd} onChange={(e) => setFilterTimeEnd(e.target.value)} className="text-xs rounded border border-border bg-background/80 px-2 py-1.5 text-foreground" />
      <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-xs rounded border border-border bg-background/80 px-2 py-1.5 text-foreground">
        <option value="">全部状态</option>
        <option value="成功">成功</option>
        <option value="失败">失败</option>
      </select>
    </>
  );

  const batchBar = selectedIds.size > 0 ? (
    <>
      <span className="text-sm text-foreground">已选 {selectedIds.size} 项</span>
      <div className="flex gap-2 flex-wrap">
        <button type="button" onClick={() => setMoveToFolderOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs rounded text-foreground hover:bg-secondary/80">放入分组</button>
        <button type="button" onClick={handleExportZip} className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs rounded text-foreground hover:bg-secondary/80">
          <Download size={14} /> 导出 ZIP
        </button>
        <button type="button" onClick={handleBatchDelete} className="flex items-center gap-1.5 px-3 py-1.5 border border-destructive/50 text-destructive text-xs rounded hover:bg-destructive/10">
          <Trash2 size={14} /> 批量删除
        </button>
      </div>
    </>
  ) : null;

  const pagination = <div className="text-sm text-muted-foreground">第 1 页，共 1 页（{filteredItems.length} 条）</div>;

  return (
    <Layout>
      <DataWorkspace breadcrumbs={breadcrumbs} actions={actions} viewMode={viewMode} onViewModeChange={setViewMode} hideMapButton filters={filters} batchBar={batchBar} pagination={pagination}>
        <div className="space-y-6">
          {currentFolderId && (
            <button type="button" onClick={() => setCurrentFolderId(null)} className="flex items-center gap-1.5 text-sm text-primary hover:underline">
              <ChevronLeft size={16} /> 返回上一级
            </button>
          )}
          {!currentFolderId && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">任务分组</h3>
                <button type="button" onClick={() => setNewFolderOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border border-primary/50 text-primary hover:bg-primary/10">
                  <FolderPlus size={14} /> 新建任务分组
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {folders.map((f) => {
                  const count = items.filter((x) => x.folderId === f.id).length;
                  return (
                    <div key={f.id} onClick={() => setCurrentFolderId(f.id)} className="rounded-lg border border-border bg-card/50 p-4 hover:border-primary/50 transition-colors cursor-pointer flex items-center gap-3">
                      <FolderOpen className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-foreground truncate" title={f.name}>{f.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{count} 个文件 · {f.date}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">{currentFolderId ? `${currentFolder?.name} - 数据列表` : '全部数据'}</h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground">
                <input type="checkbox" checked={filteredItems.length > 0 && selectedIds.size === filteredItems.length} onChange={toggleSelectAll} className="rounded border-border" />
                全选本页
              </label>
            </div>
            {viewMode === 'list' ? (
              <div className="rounded border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30 text-muted-foreground text-left">
                    <tr>
                      <th className="w-8 px-3 py-2"></th>
                      <th className="px-3 py-2">文件名</th>
                      <th className="px-3 py-2">状态</th>
                      <th className="px-3 py-2">时间</th>
                      <th className="px-3 py-2">大小</th>
                      <th className="px-3 py-2">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="border-t border-border hover:bg-muted/20">
                        <td className="px-3 py-2">
                          <input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => toggleSelect(item.id)} className="rounded border-border" />
                        </td>
                        <td className="px-3 py-2 font-medium text-foreground">{item.name}</td>
                        <td className="px-3 py-2 text-muted-foreground">{item.status}</td>
                        <td className="px-3 py-2 text-muted-foreground">{item.time}</td>
                        <td className="px-3 py-2 text-muted-foreground">{item.size}</td>
                        <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => setPreviewItem(item)} className="text-primary hover:underline text-xs flex items-center gap-1" title="预览">
                              <Eye size={12} /> 预览
                            </button>
                            <button type="button" onClick={() => handleDownloadOne(item)} className="text-muted-foreground hover:underline text-xs flex items-center gap-1" title="下载">
                              <Download size={12} /> 下载
                            </button>
                            <button type="button" onClick={(e) => openEdit(item, e)} className="text-primary hover:underline text-xs flex items-center gap-1" title="编辑">
                              <Pencil size={12} /> 编辑
                            </button>
                            <button type="button" onClick={(e) => handleDeleteOne(item, e)} className="text-destructive hover:underline text-xs flex items-center gap-1" title="删除">
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
                {filteredItems.map((item) => (
                  <div key={item.id} className="relative rounded-lg border border-border bg-card/50 overflow-hidden hover:border-primary/50 transition-colors">
                    <div className="absolute top-2 left-2 z-10">
                      <input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => toggleSelect(item.id)} className="rounded border-border" />
                    </div>
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <Box size={32} className="text-muted-foreground" />
                    </div>
                    <div className="p-3 border-t border-border">
                      <div className="text-sm font-medium text-foreground truncate" title={item.name}>{item.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{item.status} · {item.time} · {item.size}</div>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <button type="button" onClick={() => setPreviewItem(item)} className="text-primary hover:underline text-xs flex items-center gap-1"><Eye size={12} /> 预览</button>
                        <button type="button" onClick={() => handleDownloadOne(item)} className="text-muted-foreground hover:underline text-xs flex items-center gap-1"><Download size={12} /> 下载</button>
                        <button type="button" onClick={(e) => openEdit(item, e)} className="text-primary hover:underline text-xs flex items-center gap-1"><Pencil size={12} /> 编辑</button>
                        <button type="button" onClick={(e) => handleDeleteOne(item, e)} className="text-destructive hover:underline text-xs flex items-center gap-1"><Trash2 size={12} /> 删除</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </DataWorkspace>
      <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>新建任务分组</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="输入任务分组名称" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" />
          </div>
          <DialogFooter>
            <button type="button" onClick={() => setNewFolderOpen(false)} className="px-4 py-2 text-sm rounded border border-border hover:bg-secondary">取消</button>
            <button type="button" onClick={handleNewFolder} className="px-4 py-2 text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90">创建</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={moveToFolderOpen} onOpenChange={setMoveToFolderOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>放入分组</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">将已选 {selectedIds.size} 项移动到：</p>
            <select value={moveTargetFolderId ?? ''} onChange={(e) => setMoveTargetFolderId(e.target.value || null)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
              <option value="">请选择分组</option>
              {folders.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
            </select>
          </div>
          <DialogFooter>
            <button type="button" onClick={() => setMoveToFolderOpen(false)} className="px-4 py-2 text-sm rounded border border-border hover:bg-secondary">取消</button>
            <button type="button" onClick={handleMoveToFolder} className="px-4 py-2 text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90">确定</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewItem} onOpenChange={(open) => !open && setPreviewItem(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>预览 - {previewItem?.name}</DialogTitle></DialogHeader>
          {previewItem && (
            <div className="rounded-lg border border-border bg-muted/30 p-6 flex flex-col items-center justify-center min-h-[200px]">
              <Box size={48} className="text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">数字表面模型预览（可接入专业 viewer）</p>
              <p className="text-xs text-muted-foreground mt-1">{previewItem.name} · {previewItem.size}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>编辑文件信息</DialogTitle></DialogHeader>
          {editItem && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground">文件名</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground">状态</label>
                <select value={editForm.status} onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                  <option value="成功">成功</option>
                  <option value="失败">失败</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground">时间</label>
                <input type="date" value={editForm.time} onChange={(e) => setEditForm((p) => ({ ...p, time: e.target.value }))} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground">大小</label>
                <input type="text" value={editForm.size} onChange={(e) => setEditForm((p) => ({ ...p, size: e.target.value }))} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" />
              </div>
            </div>
          )}
          <DialogFooter>
            <button type="button" onClick={() => setEditItem(null)} className="px-4 py-2 text-sm rounded border border-border hover:bg-secondary">取消</button>
            <button type="button" onClick={handleEditSave} className="px-4 py-2 text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90">保存</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
