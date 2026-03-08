import React, { useState, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import DataWorkspace, { ViewMode } from '../components/layout/DataWorkspace';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Image,
  FileVideo,
  Download,
  Trash2,
  Cloud,
  FolderPlus,
  Upload,
  FolderOpen,
  ChevronLeft,
  X,
  MapPin,
  Pencil,
} from 'lucide-react';
import JSZip from 'jszip';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../components/ui/sheet';

export type RawFileType = 'image' | 'video';

export interface RawFolder {
  id: string;
  name: string;
  count: number;
  date: string;
  /** 用户新建为 true；航线任务自动创建为 false（命名规则：任务名称_执行时间） */
  isUserCreated?: boolean;
}

export interface RawFileItem {
  key: string;
  folderId: string | null;
  taskName: string;
  name: string;
  payload: string;
  type: string;
  time: string;
  size: string;
  fileType: RawFileType;
  /** 本地上传时的 File，用于导出 zip */
  file?: File;
  /** 经纬度（用于地图显示） */
  latitude?: number;
  longitude?: number;
}

const INITIAL_FOLDERS: RawFolder[] = [
  { id: 'f1', name: 'XX区交通巡检_20240520', count: 2, date: '2024-05-20', isUserCreated: false },
  { id: 'f2', name: '工业园区测绘_20240615', count: 2, date: '2024-06-15', isUserCreated: false },
  { id: 'f3', name: '北部山区地灾前线_20241024', count: 1, date: '2024-10-24', isUserCreated: false },
];

const INITIAL_FILES: RawFileItem[] = [
  { key: 'raw-1', folderId: 'f1', taskName: 'XX区交通巡检_20240520', name: 'DJI_0041.JPG', payload: 'M4TD', type: 'JPG', time: '2024-05-20 14:00', size: '12.4 MB', fileType: 'image', latitude: 31.2304, longitude: 121.4737 },
  { key: 'raw-2', folderId: 'f1', taskName: 'XX区交通巡检_20240520', name: 'DJI_0042.JPG', payload: 'M4TD', type: 'JPG', time: '2024-05-20 14:01', size: '11.8 MB', fileType: 'image', latitude: 31.231, longitude: 121.474 },
  { key: 'raw-3', folderId: 'f2', taskName: '工业园区测绘_20240615', name: 'VID_01.MP4', payload: 'M30T', type: 'MP4', time: '2024-06-15 09:30', size: '450.2 MB', fileType: 'video', latitude: 31.235, longitude: 121.478 },
  { key: 'raw-4', folderId: 'f2', taskName: '工业园区测绘_20240615', name: 'DJI_0102.JPG', payload: 'M4TD', type: 'RAW', time: '2024-06-15 11:20', size: '14.1 MB', fileType: 'image', latitude: 31.236, longitude: 121.479 },
  { key: 'raw-5', folderId: 'f3', taskName: '北部山区地灾前线_20241024', name: 'DJI_0103.JPG', payload: 'M30T', type: 'JPG', time: '2024-10-24 10:21', size: '13.9 MB', fileType: 'image', latitude: 30.5728, longitude: 104.0668 },
];

function parseTimeToSort(t: string): number {
  const s = t.replace(/[-:\s]/g, '');
  return parseInt(s.slice(0, 14) || '0', 10) || 0;
}

export default function RawMaterial() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromModeling = (location.state as { fromModeling?: boolean } | null)?.fromModeling ?? false;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [folders, setFolders] = useState<RawFolder[]>(INITIAL_FOLDERS);
  const [files, setFiles] = useState<RawFileItem[]>(INITIAL_FILES);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedFolderIds, setSelectedFolderIds] = useState<Set<string>>(new Set());
  const [modelingOpen, setModelingOpen] = useState(false);
  const [modelingTaskName, setModelingTaskName] = useState('');
  const [modelingResolution, setModelingResolution] = useState('高');
  const [modelingCoord, setModelingCoord] = useState('CGCS2000 / 3度带 120E (EPSG:4549)');

  // 新建分组
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  // 移动到分组（选择目标分组）
  const [moveToFolderOpen, setMoveToFolderOpen] = useState(false);
  const [moveTargetFolderId, setMoveTargetFolderId] = useState<string | null>(null);
  // 筛选
  const [filterTaskName, setFilterTaskName] = useState('');
  const [filterTimeStart, setFilterTimeStart] = useState('');
  const [filterTimeEnd, setFilterTimeEnd] = useState('');
  const [filterFileType, setFilterFileType] = useState('');
  // 详情侧边栏（右侧）
  const [detailItem, setDetailItem] = useState<RawFileItem | null>(null);
  const [detailImageUrl, setDetailImageUrl] = useState<string | null>(null);
  // 大图
  const [lightboxItem, setLightboxItem] = useState<RawFileItem | null>(null);
  const [lightboxObjectUrl, setLightboxObjectUrl] = useState<string | null>(null);
  // 编辑
  const [editItem, setEditItem] = useState<RawFileItem | null>(null);
  const [editName, setEditName] = useState('');
  // 地图面板（勾选后在航线规划地图显示）
  const [mapPanelOpen, setMapPanelOpen] = useState(false);

  const currentFolder = currentFolderId ? folders.find((f) => f.id === currentFolderId) : null;

  const filteredFiles = useMemo(() => {
    let list = currentFolderId
      ? files.filter((f) => f.folderId === currentFolderId)
      : files.filter((f) => !f.folderId || folders.some((fo) => fo.id === f.folderId));
    if (filterTaskName.trim()) {
      const q = filterTaskName.trim().toLowerCase();
      list = list.filter((f) => f.taskName.toLowerCase().includes(q) || f.name.toLowerCase().includes(q));
    }
    if (filterTimeStart) {
      list = list.filter((f) => parseTimeToSort(f.time) >= parseTimeToSort(filterTimeStart + ' 00:00'));
    }
    if (filterTimeEnd) {
      list = list.filter((f) => parseTimeToSort(f.time) <= parseTimeToSort(filterTimeEnd + ' 23:59'));
    }
    if (filterFileType) {
      list = list.filter((f) => f.type === filterFileType);
    }
    return list;
  }, [files, currentFolderId, folders, filterTaskName, filterTimeStart, filterTimeEnd, filterFileType]);

  const photoCount = useMemo(
    () => filteredFiles.filter((f) => selectedIds.has(f.key) && f.fileType === 'image').length,
    [filteredFiles, selectedIds]
  );

  const toggleSelect = (key: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredFiles.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredFiles.map((f) => f.key)));
  };

  const handleCloudModeling = () => {
    if (photoCount === 0) {
      alert('请先勾选至少一张照片。');
      return;
    }
    setModelingTaskName(`新建建模任务（${photoCount} 张照片）`);
    setModelingOpen(true);
  };

  const confirmModeling = () => {
    setModelingOpen(false);
    navigate('/fly/modeling', {
      state: {
        newTaskFromPhotos: photoCount,
        taskName: modelingTaskName.trim() || `新建建模任务（${photoCount} 张照片）`,
      },
    });
  };

  const handleNewFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    const id = 'f-' + Date.now();
    const date = new Date().toISOString().slice(0, 10);
    setFolders((prev) => [...prev, { id, name, count: 0, date, isUserCreated: true }]);
    setNewFolderName('');
    setNewFolderOpen(false);
  };

  const handleMoveToFolder = () => {
    if (!moveTargetFolderId || selectedIds.size === 0) return;
    setFiles((prev) =>
      prev.map((f) => (selectedIds.has(f.key) ? { ...f, folderId: moveTargetFolderId } : f))
    );
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id !== moveTargetFolderId) return f;
        const inFolder = files.filter((x) => x.folderId === f.id).length;
        const moving = files.filter((x) => selectedIds.has(x.key) && x.folderId !== f.id).length;
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
    const date = new Date();
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    const added: RawFileItem[] = [];
    for (let i = 0; i < selected.length; i++) {
      const file = selected[i];
      const key = 'import-' + Date.now() + '-' + i;
      const ext = (file.name.split('.').pop() || '').toUpperCase();
      const fileType: RawFileType = /^(MP4|MOV|AVI|MKV|WEBM)$/i.test(ext) ? 'video' : 'image';
      const size = file.size >= 1024 * 1024 ? (file.size / 1024 / 1024).toFixed(1) + ' MB' : (file.size / 1024).toFixed(1) + ' KB';
      added.push({
        key,
        folderId: currentFolderId,
        taskName: '本地上传',
        name: file.name,
        payload: '—',
        type: ext || 'FILE',
        time: dateStr,
        size,
        fileType,
        file,
        latitude: undefined,
        longitude: undefined,
      });
    }
    setFiles((prev) => [...prev, ...added]);
    if (currentFolderId) {
      setFolders((prev) =>
        prev.map((f) => (f.id === currentFolderId ? { ...f, count: f.count + added.length } : f))
      );
    }
    e.target.value = '';
  };

  const handleImportFolder = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected?.length) return;
    const date = new Date();
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    const added: RawFileItem[] = [];
    for (let i = 0; i < selected.length; i++) {
      const file = selected[i];
      const key = 'import-' + Date.now() + '-' + i;
      const ext = (file.name.split('.').pop() || '').toUpperCase();
      const fileType: RawFileType = /^(MP4|MOV|AVI|MKV|WEBM)$/i.test(ext) ? 'video' : 'image';
      const size = file.size >= 1024 * 1024 ? (file.size / 1024 / 1024).toFixed(1) + ' MB' : (file.size / 1024).toFixed(1) + ' KB';
      added.push({
        key,
        folderId: currentFolderId,
        taskName: '本地上传',
        name: file.name,
        payload: '—',
        type: ext || 'FILE',
        time: dateStr,
        size,
        fileType,
        file,
        latitude: undefined,
        longitude: undefined,
      });
    }
    setFiles((prev) => [...prev, ...added]);
    if (currentFolderId) {
      setFolders((prev) =>
        prev.map((f) => (f.id === currentFolderId ? { ...f, count: f.count + added.length } : f))
      );
    }
    e.target.value = '';
  };

  const toggleFolderSelect = (folderId: string) => {
    setSelectedFolderIds((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  const handleExportZip = async () => {
    const fromSelected = files.filter((f) => selectedIds.has(f.key));
    const fromSelectedFolders =
      currentFolderId ? [] : files.filter((f) => f.folderId && selectedFolderIds.has(f.folderId));
    const toExportIds = new Set([
      ...fromSelected.map((x) => x.key),
      ...fromSelectedFolders.map((x) => x.key),
    ]);
    const toExportDedup = files.filter((f) => toExportIds.has(f.key));
    if (toExportDedup.length === 0) {
      alert('请先勾选要导出的素材或勾选文件夹后点击导出。');
      return;
    }
    const zip = new JSZip();
    for (const item of toExportDedup) {
      const folderName = item.folderId ? folders.find((f) => f.id === item.folderId)?.name || '' : '';
      const path = folderName ? `${folderName}/${item.name}` : item.name;
      if (item.file) {
        zip.file(path, item.file);
      } else {
        zip.file(path, 'placeholder');
      }
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `原始素材_${new Date().toISOString().slice(0, 10)}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openLightbox = (item: RawFileItem) => {
    if (item.fileType !== 'image') return;
    if (item.file) {
      const url = URL.createObjectURL(item.file);
      setLightboxObjectUrl(url);
    } else {
      setLightboxObjectUrl(null);
    }
    setLightboxItem(item);
  };

  const closeLightbox = () => {
    if (lightboxObjectUrl) URL.revokeObjectURL(lightboxObjectUrl);
    setLightboxObjectUrl(null);
    setLightboxItem(null);
  };

  const openDetail = (item: RawFileItem) => {
    if (detailImageUrl) URL.revokeObjectURL(detailImageUrl);
    setDetailImageUrl(null);
    setDetailItem(item);
    if (item.fileType === 'image' && item.file) {
      setDetailImageUrl(URL.createObjectURL(item.file));
    }
  };

  const closeDetail = () => {
    if (detailImageUrl) URL.revokeObjectURL(detailImageUrl);
    setDetailImageUrl(null);
    setDetailItem(null);
  };

  const handleBatchDelete = () => {
    if (selectedIds.size === 0) return;
    const toRemove = new Set(selectedIds);
    const folderUpdates = new Map<string, number>();
    files.forEach((f) => {
      if (toRemove.has(f.key) && f.folderId) {
        folderUpdates.set(f.folderId, (folderUpdates.get(f.folderId) ?? 0) + 1);
      }
    });
    setFiles((prev) => prev.filter((f) => !toRemove.has(f.key)));
    setFolders((prev) =>
      prev.map((f) => {
        const dec = folderUpdates.get(f.id) ?? 0;
        return { ...f, count: Math.max(0, f.count - dec) };
      })
    );
    setSelectedIds(new Set());
  };

  const handleDownloadOne = (item: RawFileItem) => {
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

  const handleDeleteOne = (item: RawFileItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles((prev) => prev.filter((f) => f.key !== item.key));
    if (item.folderId) {
      setFolders((prev) =>
        prev.map((f) => (f.id === item.folderId ? { ...f, count: Math.max(0, f.count - 1) } : f))
      );
    }
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(item.key);
      return next;
    });
    if (detailItem?.key === item.key) closeDetail();
  };

  const openEdit = (item: RawFileItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditItem(item);
    setEditName(item.name);
  };

  const handleEditSave = () => {
    if (!editItem) return;
    const name = editName.trim();
    if (!name) return;
    setFiles((prev) => prev.map((f) => (f.key === editItem.key ? { ...f, name } : f)));
    setEditItem(null);
    if (detailItem?.key === editItem.key) setDetailItem((prev) => (prev ? { ...prev, name } : null));
  };

  /** 勾选的素材+勾选文件夹下的全部素材，用于地图显示 */
  const itemsForMap = useMemo(() => {
    const fromSelected = files.filter((f) => selectedIds.has(f.key));
    const fromFolders = currentFolderId
      ? []
      : files.filter((f) => f.folderId && selectedFolderIds.has(f.folderId));
    const keys = new Set([...fromSelected.map((x) => x.key), ...fromFolders.map((x) => x.key)]);
    return files.filter((f) => keys.has(f.key) && f.latitude != null && f.longitude != null);
  }, [files, selectedIds, selectedFolderIds, currentFolderId]);

  const breadcrumbs = [
    { label: '数据智能中心', path: '/data' },
    { label: '数据资产库', path: '/data/raw' },
    { label: '原始素材', path: currentFolderId ? '/data/raw' : undefined },
    ...(currentFolder ? [{ label: currentFolder.name } as { label: string; path?: string }] : []),
  ];

  const actions = (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleImport}
      />
      <input
        ref={folderInputRef}
        type="file"
        // @ts-expect-error webkitdirectory is supported in modern browsers
        webkitdirectory=""
        className="hidden"
        onChange={handleImportFolder}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="px-3 py-1.5 text-xs rounded border border-border bg-secondary hover:bg-secondary/80 text-foreground flex items-center gap-1.5"
      >
        <Upload size={14} /> 导入文件
      </button>
      <button
        type="button"
        onClick={() => folderInputRef.current?.click()}
        className="px-3 py-1.5 text-xs rounded border border-border bg-secondary hover:bg-secondary/80 text-foreground flex items-center gap-1.5"
      >
        <Upload size={14} /> 导入文件夹
      </button>
      <button
        type="button"
        onClick={handleExportZip}
        className="px-3 py-1.5 text-xs rounded border border-border bg-secondary hover:bg-secondary/80 text-foreground flex items-center gap-1.5"
      >
        <Download size={14} /> 导出
      </button>
    </>
  );

  const filters = (
    <>
      <input
        type="text"
        placeholder="任务名称模糊检索"
        value={filterTaskName}
        onChange={(e) => setFilterTaskName(e.target.value)}
        className="text-xs rounded border border-border bg-background/80 px-2 py-1.5 text-foreground min-w-[140px]"
      />
      <input
        type="date"
        value={filterTimeStart}
        onChange={(e) => setFilterTimeStart(e.target.value)}
        className="text-xs rounded border border-border bg-background/80 px-2 py-1.5 text-foreground"
      />
      <span className="text-muted-foreground text-xs">至</span>
      <input
        type="date"
        value={filterTimeEnd}
        onChange={(e) => setFilterTimeEnd(e.target.value)}
        className="text-xs rounded border border-border bg-background/80 px-2 py-1.5 text-foreground"
      />
      <select
        value={filterFileType}
        onChange={(e) => setFilterFileType(e.target.value)}
        className="text-xs rounded border border-border bg-background/80 px-2 py-1.5 text-foreground"
      >
        <option value="">全部类型</option>
        <option value="JPG">JPG</option>
        <option value="RAW">RAW</option>
        <option value="MP4">MP4</option>
        <option value="MOV">MOV</option>
      </select>
    </>
  );

  const hasSelection = selectedIds.size > 0 || selectedFolderIds.size > 0;
  const batchBar =
    hasSelection ? (
      <>
        <span className="text-sm text-foreground">
          已选 {selectedIds.size} 项
          {selectedFolderIds.size > 0 && ` / ${selectedFolderIds.size} 个文件夹`}
          {photoCount > 0 && `（照片 ${photoCount} 张）`}
        </span>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setMapPanelOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-primary/50 text-primary text-xs rounded hover:bg-primary/10"
          >
            <MapPin size={14} /> 在航线规划地图显示
          </button>
          <button
            type="button"
            onClick={() => setNewFolderOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs rounded text-foreground hover:bg-secondary/80"
          >
            <FolderPlus size={14} /> 新建任务分组
          </button>
          <button
            type="button"
            onClick={() => setMoveToFolderOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs rounded text-foreground hover:bg-secondary/80"
          >
            放入分组
          </button>
          {photoCount > 0 && (
            <button
              type="button"
              onClick={handleCloudModeling}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 border border-primary/50 text-primary text-xs rounded hover:bg-primary/30"
            >
              <Cloud size={14} /> 云端建模
            </button>
          )}
          <button
            type="button"
            onClick={handleExportZip}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs rounded text-foreground hover:bg-secondary/80"
          >
            <Download size={14} /> 批量下载 (ZIP)
          </button>
          <button
            type="button"
            onClick={handleBatchDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-destructive/50 text-destructive text-xs rounded hover:bg-destructive/10"
          >
            <Trash2 size={14} /> 批量删除
          </button>
        </div>
      </>
    ) : null;

  const pagination = (
    <div className="flex gap-2 text-sm text-muted-foreground">
      <button type="button" className="px-3 py-1 rounded border border-border disabled:opacity-50">
        上一页
      </button>
      <span>第 1 页，共 1 页（{filteredFiles.length} 条）</span>
      <button type="button" className="px-3 py-1 rounded border border-border disabled:opacity-50">
        下一页
      </button>
    </div>
  );

  return (
    <Layout>
      {fromModeling && (
        <div className="mb-4 rounded-lg border border-primary/50 bg-primary/10 px-4 py-2 text-sm text-primary">
          来自【云端建模】新建任务：请勾选照片后点击「云端建模」，在弹窗中配置分辨率、坐标系后提交任务。
        </div>
      )}
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
        <div className="space-y-6">
          {/* 当前在文件夹内时显示返回 */}
          {currentFolderId && (
            <button
              type="button"
              onClick={() => setCurrentFolderId(null)}
              className="flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <ChevronLeft size={16} /> 返回上一级
            </button>
          )}

          {/* 新建任务分组入口（不在文件夹内时显示） */}
          {!currentFolderId && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">任务分组</h3>
                <button
                  type="button"
                  onClick={() => setNewFolderOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border border-primary/50 text-primary hover:bg-primary/10"
                >
                  <FolderPlus size={14} /> 新建任务分组
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {folders.map((f) => {
                  const count = files.filter((x) => x.folderId === f.id).length;
                  return (
                    <div
                      key={f.id}
                      className="rounded-lg border border-border bg-card/50 p-4 hover:border-primary/50 transition-colors flex items-center gap-3"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFolderIds.has(f.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleFolderSelect(f.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-border flex-shrink-0"
                      />
                      <div
                        className="min-w-0 flex-1 cursor-pointer flex items-center gap-3"
                        onClick={() => setCurrentFolderId(f.id)}
                      >
                        <FolderOpen className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-foreground truncate" title={f.name}>
                            {f.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {count} 个文件 · {f.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">
                {currentFolderId ? `${currentFolder?.name} - 文件列表` : '全部文件'}
              </h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={filteredFiles.length > 0 && selectedIds.size === filteredFiles.length}
                  onChange={toggleSelectAll}
                  className="rounded border-border"
                />
                全选本页
              </label>
            </div>

            {viewMode === 'list' ? (
              <div className="rounded border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30 text-muted-foreground text-left">
                    <tr>
                      <th className="w-8 px-3 py-2"></th>
                      <th className="px-3 py-2">缩略图</th>
                      <th className="px-3 py-2">文件名 / 任务名</th>
                      <th className="px-3 py-2">拍摄负载</th>
                      <th className="px-3 py-2">文件类型</th>
                      <th className="px-3 py-2">采集时间 / 大小</th>
                      <th className="px-3 py-2">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map((f) => (
                      <tr
                        key={f.key}
                        className="border-t border-border hover:bg-muted/20 cursor-pointer"
                        onClick={() => openDetail(f)}
                      >
                        <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(f.key)}
                            onChange={() => toggleSelect(f.key)}
                            className="rounded border-border"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            className="w-12 h-9 rounded bg-muted flex items-center justify-center hover:ring-2 ring-primary/50"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (f.fileType === 'image') openLightbox(f);
                            }}
                          >
                            {f.fileType === 'video' ? (
                              <FileVideo size={16} className="text-muted-foreground" />
                            ) : (
                              <Image size={16} className="text-muted-foreground" />
                            )}
                          </button>
                        </td>
                        <td className="px-3 py-2">
                          <div className="font-medium text-foreground">{f.name}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[180px]">{f.taskName}</div>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{f.payload}</td>
                        <td className="px-3 py-2 text-muted-foreground">{f.type}</td>
                        <td className="px-3 py-2 text-muted-foreground">{f.time} / {f.size}</td>
                        <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-1">
                            <button type="button" className="p-1 rounded hover:bg-primary/20 text-primary" title="下载" onClick={() => handleDownloadOne(f)}>
                              <Download size={14} />
                            </button>
                            <button type="button" className="p-1 rounded hover:bg-destructive/20 text-destructive" title="删除" onClick={(e) => handleDeleteOne(f, e)}>
                              <Trash2 size={14} />
                            </button>
                            <button type="button" className="p-1 rounded hover:bg-primary/20 text-primary" title="编辑" onClick={(e) => openEdit(f, e)}>
                              <Pencil size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredFiles.map((f) => (
                  <div
                    key={f.key}
                    className="relative rounded-lg border border-border bg-card/50 overflow-hidden group hover:border-primary/50 transition-all"
                  >
                    <div className="absolute top-2 left-2 z-10" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(f.key)}
                        onChange={() => toggleSelect(f.key)}
                        className="rounded border-border"
                      />
                    </div>
                    <button
                      type="button"
                      className="block w-full text-left"
                      onClick={() => openDetail(f)}
                    >
                      <div
                        className="aspect-[4/3] bg-muted relative flex items-center justify-center cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (f.fileType === 'image') openLightbox(f);
                        }}
                      >
                        {f.fileType === 'video' ? (
                          <FileVideo size={32} className="text-muted-foreground" />
                        ) : (
                          <Image size={32} className="text-muted-foreground" />
                        )}
                      </div>
                      <div className="p-2 border-t border-border">
                        <div className="text-xs font-medium text-foreground truncate" title={f.name}>{f.name}</div>
                        <div className="text-[10px] text-muted-foreground">{f.taskName}</div>
                        <div className="text-[10px] text-muted-foreground mt-1">{f.time} · {f.size}</div>
                      </div>
                    </button>
                    <div className="flex gap-2 mt-2 px-2 pb-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                      <button type="button" className="text-primary hover:underline text-[10px]" onClick={() => handleDownloadOne(f)}>
                        下载
                      </button>
                      <button type="button" className="text-destructive hover:underline text-[10px]" onClick={(e) => handleDeleteOne(f, e)}>
                        删除
                      </button>
                      <button type="button" className="text-primary hover:underline text-[10px]" onClick={(e) => openEdit(f, e)}>
                        编辑
                      </button>
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
          <DialogHeader>
            <DialogTitle>新建任务分组</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">分组名称</label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="输入任务分组名称（如：任务名称_执行时间）"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <button type="button" onClick={() => setNewFolderOpen(false)} className="px-4 py-2 text-sm rounded border border-border hover:bg-secondary">
              取消
            </button>
            <button type="button" onClick={handleNewFolder} className="px-4 py-2 text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90">
              创建
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 放入分组 */}
      <Dialog open={moveToFolderOpen} onOpenChange={setMoveToFolderOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>放入分组</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">将已选 {selectedIds.size} 项移动到：</p>
            <select
              value={moveTargetFolderId ?? ''}
              onChange={(e) => setMoveTargetFolderId(e.target.value || null)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              <option value="">请选择分组</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <button type="button" onClick={() => setMoveToFolderOpen(false)} className="px-4 py-2 text-sm rounded border border-border hover:bg-secondary">
              取消
            </button>
            <button type="button" onClick={handleMoveToFolder} className="px-4 py-2 text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90">
              确定
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑文件名 */}
      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>编辑文件名</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">文件名</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <button type="button" onClick={() => setEditItem(null)} className="px-4 py-2 text-sm rounded border border-border hover:bg-secondary">取消</button>
            <button type="button" onClick={handleEditSave} className="px-4 py-2 text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90">保存</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 航线规划地图：勾选素材/文件夹在右侧面板显示 */}
      <Sheet open={mapPanelOpen} onOpenChange={setMapPanelOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <MapPin size={18} /> 航线规划地图
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-auto mt-4 rounded-lg border border-border bg-muted/30 min-h-[400px]">
            {itemsForMap.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                请勾选包含经纬度的素材或文件夹，其点位将显示在地图上。
              </div>
            ) : (
              <div className="p-4">
                <div className="text-xs text-muted-foreground mb-3">共 {itemsForMap.length} 个点位（含经纬度）</div>
                <div className="rounded border border-border overflow-hidden bg-background/80" style={{ minHeight: 360 }}>
                  {/* 简易地图：用 SVG 按经纬度缩放绘制点位 */}
                  <svg viewBox="0 0 400 300" className="w-full h-[300px]" preserveAspectRatio="xMidYMid meet">
                    {(() => {
                      const lats = itemsForMap.map((x) => x.latitude!);
                      const lngs = itemsForMap.map((x) => x.longitude!);
                      const minLat = Math.min(...lats);
                      const maxLat = Math.max(...lats);
                      const minLng = Math.min(...lngs);
                      const maxLng = Math.max(...lngs);
                      const pad = 0.1;
                      const rangeLat = maxLat - minLat || 0.01;
                      const rangeLng = maxLng - minLng || 0.01;
                      const scaleLat = (v: number) => 280 - ((v - minLat) / rangeLat) * 260;
                      const scaleLng = (v: number) => 20 + ((v - minLng) / rangeLng) * 360;
                      return (
                        <>
                          <rect width={400} height={300} fill="rgba(0,20,50,0.6)" />
                          {itemsForMap.map((item, i) => {
                            const x = scaleLng(item.longitude!);
                            const y = scaleLat(item.latitude!);
                            return (
                              <g key={item.key}>
                                <circle cx={x} cy={y} r={6} fill="rgba(0, 212, 255, 0.9)" stroke="rgba(0, 180, 255, 1)" strokeWidth={2} />
                                <title>{item.name} ({item.latitude?.toFixed(4)}, {item.longitude?.toFixed(4)})</title>
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>
                </div>
                <ul className="mt-3 space-y-1 text-xs text-muted-foreground max-h-32 overflow-auto">
                  {itemsForMap.map((item) => (
                    <li key={item.key} className="truncate">
                      {item.name} — {item.latitude?.toFixed(4)}, {item.longitude?.toFixed(4)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* 素材详情右侧侧边栏：排版优化，图片 + 基本信息 + 经纬度 */}
      <Sheet open={!!detailItem} onOpenChange={(open) => !open && closeDetail()}>
        <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col">
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle className="text-base">素材详情</SheetTitle>
          </SheetHeader>
          {detailItem && (
            <div className="flex-1 overflow-auto pt-4 pr-2 space-y-5">
              {/* 图片区块 */}
              <div className="rounded-xl border border-border overflow-hidden bg-muted/50">
                <div className="px-3 py-2 border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground">预览</div>
                {detailItem.fileType === 'image' ? (
                  detailImageUrl ? (
                    <img src={detailImageUrl} alt={detailItem.name} className="w-full aspect-video object-contain bg-black/20" />
                  ) : (
                    <div className="w-full aspect-video flex items-center justify-center bg-muted/30">
                      <Image size={56} className="text-muted-foreground/60" />
                    </div>
                  )
                ) : (
                  <div className="w-full aspect-video flex items-center justify-center bg-muted/30">
                    <FileVideo size={56} className="text-muted-foreground/60" />
                  </div>
                )}
              </div>

              {/* 文件基本信息：表格式两列 */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-3 py-2 border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground">文件基本信息</div>
                <dl className="divide-y divide-border">
                  {[
                    { label: '文件名', value: detailItem.name },
                    { label: '任务名称', value: detailItem.taskName },
                    { label: '拍摄负载', value: detailItem.payload },
                    { label: '文件类型', value: detailItem.type },
                    { label: '采集时间', value: detailItem.time },
                    { label: '文件大小', value: detailItem.size },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between gap-4 px-3 py-2.5 text-sm">
                      <dt className="text-muted-foreground flex-shrink-0">{label}</dt>
                      <dd className="text-foreground font-medium text-right break-all min-w-0">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* 经纬度 */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-3 py-2 border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground">经纬度</div>
                <div className="px-3 py-3">
                  {detailItem.latitude != null && detailItem.longitude != null ? (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={16} className="text-primary flex-shrink-0" />
                      <span className="font-mono text-foreground">{detailItem.latitude.toFixed(6)}, {detailItem.longitude.toFixed(6)}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">暂无经纬度信息</p>
                  )}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2 pt-1">
                <button type="button" className="flex-1 px-3 py-2 text-xs rounded-lg border border-border hover:bg-secondary transition-colors" onClick={() => handleDownloadOne(detailItem)}>
                  下载
                </button>
                <button type="button" className="flex-1 px-3 py-2 text-xs rounded-lg border border-primary/50 text-primary hover:bg-primary/10 transition-colors" onClick={(e) => openEdit(detailItem, e)}>
                  编辑
                </button>
                <button type="button" className="flex-1 px-3 py-2 text-xs rounded-lg border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors" onClick={(e) => { handleDeleteOne(detailItem, e); closeDetail(); }}>
                  删除
                </button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* 缩略图大图 */}
      <Dialog open={!!lightboxItem} onOpenChange={(open) => !open && closeLightbox()}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden">
          {lightboxItem && (
            <div className="relative flex items-center justify-center min-h-[60vh] bg-black/90">
              {lightboxObjectUrl ? (
                <img src={lightboxObjectUrl} alt={lightboxItem.name} className="max-w-full max-h-[80vh] object-contain" />
              ) : (
                <div className="text-muted-foreground py-12">暂无预览图</div>
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                <button type="button" onClick={closeLightbox} className="p-2 rounded bg-black/50 text-white hover:bg-black/70">
                  <X size={20} />
                </button>
              </div>
              <div className="absolute bottom-2 left-2 right-2 text-center text-sm text-white/80 truncate">
                {lightboxItem.name}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 云端建模参数弹窗 */}
      <Dialog open={modelingOpen} onOpenChange={setModelingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>发起云端建模</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">任务名称</label>
              <input
                type="text"
                value={modelingTaskName}
                onChange={(e) => setModelingTaskName(e.target.value)}
                placeholder="输入任务名称"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">分辨率</label>
              <select
                value={modelingResolution}
                onChange={(e) => setModelingResolution(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option>高</option>
                <option>中</option>
                <option>低</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">坐标系</label>
              <select
                value={modelingCoord}
                onChange={(e) => setModelingCoord(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option>CGCS2000 / 3度带 120E (EPSG:4549)</option>
                <option>WGS84 (EPSG:4326)</option>
                <option>CGCS2000 / 6度带 (EPSG:4490)</option>
              </select>
            </div>
            <p className="text-xs text-muted-foreground">已选 {photoCount} 张照片</p>
          </div>
          <DialogFooter>
            <button type="button" onClick={() => setModelingOpen(false)} className="px-4 py-2 text-sm rounded border border-border hover:bg-secondary">
              取消
            </button>
            <button type="button" onClick={confirmModeling} className="px-4 py-2 text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90">
              提交任务
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
