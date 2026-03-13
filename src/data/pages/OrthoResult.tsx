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
import { Button } from '../components/ui/button';
import { LayoutGrid, List, Download, Trash2, Eye, FolderPlus, FolderOpen, Upload, Pencil, X, ZoomIn, ZoomOut, Share2, Copy } from 'lucide-react';

export interface OrthoFolder {
  id: string;
  name: string;
  count: number;
  date: string;
}

export interface OrthoItem {
  id: string;
  folderId: string | null;
  name: string;
  status: string;
  time: string;
  size: string;
  file?: File;
}

const INITIAL_FOLDERS: OrthoFolder[] = [
  { id: 'of1', name: 'XX区正射_20240520', count: 1, date: '2024-05-20' },
  { id: 'of2', name: '工业园区正射_20240615', count: 1, date: '2024-06-15' },
  { id: 'of3', name: '北部山区正射_20241024', count: 1, date: '2024-10-24' },
];

const INITIAL_ITEMS: OrthoItem[] = [
  { id: 'o1', folderId: 'of1', name: 'XX区正射影像_20240520.tif', status: '成功', time: '2024-05-20', size: '661.1 MB' },
  { id: 'o2', folderId: 'of2', name: '工业园区正射_20240615.tif', status: '成功', time: '2024-06-15', size: '1.2 GB' },
  { id: 'o3', folderId: 'of3', name: '北部山区正射_20241024.tif', status: '建模中', time: '2024-10-24', size: '—' },
];

export default function OrthoResult() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [folders, setFolders] = useState<OrthoFolder[]>(INITIAL_FOLDERS);
  const [items, setItems] = useState<OrthoItem[]>(INITIAL_ITEMS);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [moveToFolderOpen, setMoveToFolderOpen] = useState(false);
  const [moveTargetFolderId, setMoveTargetFolderId] = useState<string | null>(null);

  // 筛选：状态、时间段、文件名模糊检索
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTimeStart, setFilterTimeStart] = useState('');
  const [filterTimeEnd, setFilterTimeEnd] = useState('');
  const [filterFileName, setFilterFileName] = useState('');

  // 预览弹窗（支持缩放、拖动）
  const [previewItem, setPreviewItem] = useState<OrthoItem | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [previewTranslate, setPreviewTranslate] = useState({ x: 0, y: 0 });
  const previewDragRef = useRef({ isDown: false, startX: 0, startY: 0, startTx: 0, startTy: 0 });

  // 编辑
  const [editItem, setEditItem] = useState<OrthoItem | null>(null);
  const [editForm, setEditForm] = useState({ name: '', status: '', time: '', size: '' });

  // 分享（效果参考云端建模）
  type ShareExpiry = '1d' | '7d' | '1m' | '3m' | 'permanent' | 'custom';
  const [shareItem, setShareItem] = useState<OrthoItem | null>(null);
  const [shareExpiry, setShareExpiry] = useState<ShareExpiry>('7d');
  const [shareCustomExpiry, setShareCustomExpiry] = useState('');
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const openShare = (item: OrthoItem) => {
    setShareItem(item);
    setShareLink(null);
    setShareCopied(false);
    setShareExpiry('7d');
    setShareCustomExpiry('');
  };
  const getShareExpiryDate = (): Date | null => {
    if (shareExpiry === 'permanent') return null;
    if (shareExpiry === 'custom') {
      if (!shareCustomExpiry.trim()) return null;
      const d = new Date(shareCustomExpiry);
      return isNaN(d.getTime()) ? null : d;
    }
    const now = new Date();
    if (shareExpiry === '1d') now.setDate(now.getDate() + 1);
    else if (shareExpiry === '7d') now.setDate(now.getDate() + 7);
    else if (shareExpiry === '1m') now.setMonth(now.getMonth() + 1);
    else if (shareExpiry === '3m') now.setMonth(now.getMonth() + 3);
    return now;
  };
  const generateShareLink = () => {
    if (!shareItem) return;
    const expires = getShareExpiryDate();
    const base = window.location.origin;
    const params = new URLSearchParams({ type: 'ortho', id: shareItem.id, name: shareItem.name });
    if (expires) params.set('expires', expires.toISOString());
    setShareLink(`${base}/share/data?${params.toString()}`);
  };
  const copyShareLink = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const currentFolder = currentFolderId ? folders.find((f) => f.id === currentFolderId) : null;
  const filteredItems = useMemo(() => {
    let list = currentFolderId ? items.filter((i) => i.folderId === currentFolderId) : items;
    if (filterStatus) list = list.filter((i) => i.status === filterStatus);
    if (filterTimeStart) list = list.filter((i) => i.time >= filterTimeStart);
    if (filterTimeEnd) list = list.filter((i) => i.time <= filterTimeEnd);
    if (filterFileName.trim()) {
      const q = filterFileName.trim().toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q));
    }
    return list;
  }, [items, currentFolderId, filterStatus, filterTimeStart, filterTimeEnd, filterFileName]);

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
    const id = 'of-' + Date.now();
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

  const openPreview = (item: OrthoItem) => {
    setPreviewItem(item);
    setPreviewScale(1);
    setPreviewTranslate({ x: 0, y: 0 });
    if (item.file && item.file.type.startsWith('image/')) {
      setPreviewImageUrl(URL.createObjectURL(item.file));
    } else {
      setPreviewImageUrl(null);
    }
  };

  const closePreview = () => {
    if (previewImageUrl) URL.revokeObjectURL(previewImageUrl);
    setPreviewImageUrl(null);
    setPreviewItem(null);
  };

  const handlePreviewWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setPreviewScale((s) => Math.max(0.3, Math.min(5, s + delta)));
  };

  const handlePreviewMouseDown = (e: React.MouseEvent) => {
    previewDragRef.current = { isDown: true, startX: e.clientX, startY: e.clientY, startTx: previewTranslate.x, startTy: previewTranslate.y };
  };

  const handlePreviewMouseMove = (e: React.MouseEvent) => {
    if (!previewDragRef.current.isDown) return;
    setPreviewTranslate({
      x: previewDragRef.current.startTx + e.clientX - previewDragRef.current.startX,
      y: previewDragRef.current.startTy + e.clientY - previewDragRef.current.startY,
    });
  };

  const handlePreviewMouseUp = () => {
    previewDragRef.current.isDown = false;
  };

  const handleDownloadOne = (item: OrthoItem) => {
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

  const openEdit = (item: OrthoItem) => {
    setEditItem(item);
    setEditForm({ name: item.name, status: item.status, time: item.time, size: item.size });
  };

  const handleEditSave = () => {
    if (!editItem) return;
    setItems((prev) =>
      prev.map((i) =>
        i.id === editItem.id ? { ...i, name: editForm.name, status: editForm.status, time: editForm.time, size: editForm.size } : i
      )
    );
    setEditItem(null);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected?.length) return;
    const date = new Date().toISOString().slice(0, 10);
    const added: OrthoItem[] = [];
    for (let i = 0; i < selected.length; i++) {
      const file = selected[i];
      const size = file.size >= 1024 * 1024 * 1024 ? (file.size / 1024 / 1024 / 1024).toFixed(2) + ' GB' : (file.size / 1024 / 1024).toFixed(1) + ' MB';
      added.push({
        id: 'o-import-' + Date.now() + '-' + i,
        folderId: currentFolderId,
        name: file.name,
        status: '成功',
        time: date,
        size,
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
    const added: OrthoItem[] = [];
    for (let i = 0; i < selected.length; i++) {
      const file = selected[i];
      const size = file.size >= 1024 * 1024 * 1024 ? (file.size / 1024 / 1024 / 1024).toFixed(2) + ' GB' : (file.size / 1024 / 1024).toFixed(1) + ' MB';
      added.push({
        id: 'o-import-' + Date.now() + '-' + i,
        folderId: currentFolderId,
        name: file.name,
        status: '成功',
        time: date,
        size,
        file,
      });
    }
    setItems((prev) => [...prev, ...added]);
    if (currentFolderId) {
      setFolders((prev) => prev.map((f) => (f.id === currentFolderId ? { ...f, count: f.count + added.length } : f)));
    }
    e.target.value = '';
  };

  const breadcrumbs = [
    { label: '数据智能中心', path: '/data' },
    { label: '数据资产库', path: '/data/raw' },
    { label: '正射影像', path: currentFolderId ? '/data/ortho' : undefined },
    ...(currentFolder ? [{ label: currentFolder.name } as { label: string; path?: string }] : []),
  ];

  const actions = (
    <>
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleImport} />
      <input
        ref={folderInputRef}
        type="file"
        // @ts-expect-error webkitdirectory
        webkitdirectory=""
        className="hidden"
        onChange={handleImportFolder}
      />
      <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 text-xs rounded border border-border bg-secondary hover:bg-secondary/80 text-foreground flex items-center gap-1.5">
        <Upload size={14} /> 导入文件
      </button>
      <button type="button" onClick={() => folderInputRef.current?.click()} className="px-3 py-1.5 text-xs rounded border border-border bg-secondary hover:bg-secondary/80 text-foreground flex items-center gap-1.5">
        <Upload size={14} /> 导入文件夹
      </button>
      <button type="button" className="px-3 py-1.5 text-xs rounded border border-border bg-secondary hover:bg-secondary/80 text-foreground flex items-center gap-1.5">
        <Download size={14} /> 导出
      </button>
    </>
  );

  const filters = (
    <>
      <input
        type="text"
        placeholder="文件名模糊检索"
        value={filterFileName}
        onChange={(e) => setFilterFileName(e.target.value)}
        className="text-xs rounded border border-border bg-background/80 px-2 py-1.5 text-foreground min-w-[140px]"
      />
      <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-xs rounded border border-border bg-background/80 px-2 py-1.5 text-foreground">
        <option value="">全部状态</option>
        <option value="成功">成功</option>
        <option value="失败">失败</option>
        <option value="建模中">建模中</option>
      </select>
      <input type="date" value={filterTimeStart} onChange={(e) => setFilterTimeStart(e.target.value)} className="text-xs rounded border border-border bg-background/80 px-2 py-1.5 text-foreground" />
      <span className="text-muted-foreground text-xs">至</span>
      <input type="date" value={filterTimeEnd} onChange={(e) => setFilterTimeEnd(e.target.value)} className="text-xs rounded border border-border bg-background/80 px-2 py-1.5 text-foreground" />
    </>
  );

  const batchBar =
    selectedIds.size > 0 ? (
      <>
        <span className="text-sm text-foreground">已选 {selectedIds.size} 项</span>
        <button type="button" onClick={() => setMoveToFolderOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs rounded text-foreground hover:bg-secondary/80">
          放入分组
        </button>
      </>
    ) : null;

  const pagination = <div className="text-sm text-muted-foreground">第 1 页，共 1 页（{filteredItems.length} 条）</div>;

  return (
    <Layout>
      <DataWorkspace breadcrumbs={breadcrumbs} actions={actions} viewMode={viewMode} onViewModeChange={setViewMode} hideMapButton filters={filters} batchBar={batchBar} pagination={pagination}>
        <div className="space-y-6">
          {currentFolderId && (
            <button type="button" onClick={() => setCurrentFolderId(null)} className="flex items-center gap-1.5 text-sm text-primary hover:underline">
              返回上一级
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
                        <td className="px-3 py-2">
                          <div className="flex gap-2">
                            <button type="button" onClick={() => openPreview(item)} className="text-primary hover:underline text-xs flex items-center gap-1">
                              <Eye size={12} /> 预览
                            </button>
                            <button type="button" onClick={() => handleDownloadOne(item)} className="text-muted-foreground hover:underline text-xs flex items-center gap-1">
                              <Download size={12} /> 下载
                            </button>
                            <button type="button" onClick={() => openShare(item)} className="text-primary hover:underline text-xs flex items-center gap-1">
                              <Share2 size={12} /> 分享
                            </button>
                            <button type="button" onClick={() => openEdit(item)} className="text-primary hover:underline text-xs flex items-center gap-1">
                              <Pencil size={12} /> 编辑
                            </button>
                            <button type="button" className="text-destructive hover:underline text-xs flex items-center gap-1">
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
                    <div className="aspect-video bg-muted flex items-center justify-center relative">
                      <LayoutGrid size={32} className="text-muted-foreground" />
                    </div>
                    <div className="p-3 border-t border-border">
                      <div className="text-sm font-medium text-foreground truncate" title={item.name}>{item.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">重建状态：{item.status} · {item.time} · {item.size}</div>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <button type="button" onClick={() => openPreview(item)} className="text-primary hover:underline text-xs flex items-center gap-1">
                          <Eye size={12} /> 预览
                        </button>
                        <button type="button" onClick={() => handleDownloadOne(item)} className="text-muted-foreground hover:underline text-xs flex items-center gap-1">
                          <Download size={12} /> 下载
                        </button>
                        <button type="button" onClick={() => openShare(item)} className="text-primary hover:underline text-xs flex items-center gap-1">
                          <Share2 size={12} /> 分享
                        </button>
                        <button type="button" onClick={() => openEdit(item)} className="text-primary hover:underline text-xs flex items-center gap-1">
                          <Pencil size={12} /> 编辑
                        </button>
                        <button type="button" className="text-destructive hover:underline text-xs flex items-center gap-1">
                          <Trash2 size={12} /> 删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </DataWorkspace>

      {/* 新建任务分组 */}
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

      {/* 放入分组 */}
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

      {/* 预览弹窗：支持缩放、拖动 */}
      <Dialog open={!!previewItem} onOpenChange={(open) => !open && closePreview()}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          {previewItem && (
            <>
              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
                <span className="text-sm font-medium text-foreground truncate">{previewItem.name}</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setPreviewScale((s) => Math.min(5, s + 0.25))} className="p-1.5 rounded border border-border hover:bg-secondary text-foreground">
                    <ZoomIn size={18} />
                  </button>
                  <button type="button" onClick={() => setPreviewScale((s) => Math.max(0.3, s - 0.25))} className="p-1.5 rounded border border-border hover:bg-secondary text-foreground">
                    <ZoomOut size={18} />
                  </button>
                  <button type="button" onClick={closePreview} className="p-1.5 rounded border border-border hover:bg-secondary text-foreground">
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div
                className="flex-1 overflow-hidden bg-black/90 flex items-center justify-center cursor-grab active:cursor-grabbing"
                onWheel={handlePreviewWheel}
                onMouseDown={handlePreviewMouseDown}
                onMouseMove={handlePreviewMouseMove}
                onMouseUp={handlePreviewMouseUp}
                onMouseLeave={handlePreviewMouseUp}
                style={{ minHeight: 400 }}
              >
                {previewImageUrl ? (
                  <img
                    src={previewImageUrl}
                    alt={previewItem.name}
                    draggable={false}
                    style={{
                      transform: `translate(${previewTranslate.x}px, ${previewTranslate.y}px) scale(${previewScale})`,
                      maxWidth: '100%',
                      maxHeight: '70vh',
                      objectFit: 'contain',
                      userSelect: 'none',
                      pointerEvents: 'none',
                    }}
                  />
                ) : (
                  <div className="text-muted-foreground">暂无图像预览（仅支持本地上传的图片格式）</div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 编辑文件信息 */}
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
                  <option value="建模中">建模中</option>
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

      {/* 分享：有效期 1天/7天/1个月/3个月/永久/自定义（参考云端建模） */}
      <Dialog open={!!shareItem} onOpenChange={(open) => !open && setShareItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 size={18} /> 分享成果 - {shareItem?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">分享有效期</label>
              <select className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm" value={shareExpiry} onChange={(e) => setShareExpiry(e.target.value as ShareExpiry)}>
                <option value="1d">1 天</option>
                <option value="7d">7 天</option>
                <option value="1m">1 个月</option>
                <option value="3m">3 个月</option>
                <option value="permanent">永久</option>
                <option value="custom">自定义时间</option>
              </select>
              {shareExpiry === 'custom' && (
                <input type="datetime-local" className="mt-2 w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm" value={shareCustomExpiry} onChange={(e) => setShareCustomExpiry(e.target.value)} />
              )}
            </div>
            {!shareLink ? (
              <Button className="w-full gap-2" onClick={generateShareLink} disabled={shareExpiry === 'custom' && !shareCustomExpiry.trim()}>
                生成分享链接
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">复制以下链接分享给他人：</p>
                <div className="flex gap-2">
                  <input readOnly className="flex-1 px-3 py-2 rounded border border-border bg-muted/50 text-foreground text-xs font-mono" value={shareLink} />
                  <Button variant="outline" size="sm" className="gap-1 shrink-0" onClick={copyShareLink}>
                    <Copy size={14} /> {shareCopied ? '已复制' : '复制'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
