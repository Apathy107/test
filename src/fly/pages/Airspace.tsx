import React, { useState, useRef } from 'react';
import {
  Shield, Plus, Upload, Pencil, Trash2, MapPin, AlertOctagon, Briefcase,
} from 'lucide-react';
import CyberPanel from '../components/CyberPanel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { cn } from '@fly/lib/utils';

export type AirspaceType = 'control' | 'restricted' | 'operation';
const AIRSPACE_TYPE_MAP: Record<AirspaceType, { label: string; icon: typeof MapPin }> = {
  control: { label: '管控区', icon: MapPin },
  restricted: { label: '禁飞区', icon: AlertOctagon },
  operation: { label: '作业区', icon: Briefcase },
};

export type AirspaceSource = 'manual' | 'kml' | 'geojson';

export interface AirspaceItem {
  id: string;
  name: string;
  type: AirspaceType;
  source: AirspaceSource;
  enabled: boolean;
  fileName?: string;
  createdAt: string;
}

const INITIAL_AIRSPACES: AirspaceItem[] = [
  { id: 'AS-001', name: '市政府核心管控区', type: 'control', source: 'manual', enabled: true, createdAt: '2024-01-15' },
  { id: 'AS-002', name: '机场净空禁飞区', type: 'restricted', source: 'kml', enabled: true, fileName: 'airport_nofly.kml', createdAt: '2024-02-20' },
  { id: 'AS-003', name: '南环作业区A', type: 'operation', source: 'geojson', enabled: false, fileName: 'zone_a.geojson', createdAt: '2024-03-10' },
];

function parseFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error('读取文件失败'));
    r.readAsText(file, 'UTF-8');
  });
}

function tryParseGeoJson(text: string): boolean {
  try {
    const j = JSON.parse(text);
    return !!(j.type && (j.coordinates || j.geometries || j.features));
  } catch {
    return false;
  }
}

function tryParseKml(text: string): boolean {
  return text.includes('<kml') || text.includes('<KML') || text.includes('coordinates');
}

export default function AirspacePage() {
  const [list, setList] = useState<AirspaceItem[]>(INITIAL_AIRSPACES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<AirspaceType>('control');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editingItem = editId ? list.find((x) => x.id === editId) : null;
  const isEdit = !!editingItem;

  const openAdd = () => {
    setEditId(null);
    setFormName('');
    setFormType('control');
    setImportFile(null);
    setImportError('');
    setModalOpen(true);
  };

  const openEdit = (item: AirspaceItem) => {
    setEditId(item.id);
    setFormName(item.name);
    setFormType(item.type);
    setImportFile(null);
    setImportError('');
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setImportError('');
    if (!f) {
      setImportFile(null);
      return;
    }
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (ext !== 'kml' && ext !== 'geojson' && ext !== 'json') {
      setImportError('仅支持 .kml / .geojson / .json 文件');
      setImportFile(null);
      return;
    }
    setImportFile(f);
  };

  const submitForm = async () => {
    const name = formName.trim() || '未命名空域';
    const now = new Date().toISOString().slice(0, 10);

    if (isEdit && editingItem) {
      setList((prev) =>
        prev.map((x) =>
          x.id === editId
            ? { ...x, name, type: formType }
            : x
        )
      );
    } else {
      let source: AirspaceSource = 'manual';
      let fileName: string | undefined;
      if (importFile) {
        const text = await parseFileAsText(importFile);
        const isGeo = tryParseGeoJson(text);
        const isKml = tryParseKml(text);
        if (importFile.name.toLowerCase().endsWith('.kml') && isKml) {
          source = 'kml';
          fileName = importFile.name;
        } else if ((importFile.name.toLowerCase().endsWith('.geojson') || importFile.name.toLowerCase().endsWith('.json')) && isGeo) {
          source = 'geojson';
          fileName = importFile.name;
        } else if (isKml) {
          source = 'kml';
          fileName = importFile.name;
        } else if (isGeo) {
          source = 'geojson';
          fileName = importFile.name;
        }
      }
      const newItem: AirspaceItem = {
        id: `AS-${Date.now()}`,
        name,
        type: formType,
        source,
        enabled: true,
        fileName,
        createdAt: now,
      };
      setList((prev) => [newItem, ...prev]);
    }
    setModalOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const remove = (id: string) => {
    if (window.confirm('确定删除该空域数据？')) setList((prev) => prev.filter((x) => x.id !== id));
  };

  const toggleEnabled = (id: string) => {
    setList((prev) => prev.map((x) => (x.id === id ? { ...x, enabled: !x.enabled } : x)));
  };

  const sourceLabel = (s: AirspaceSource) => (s === 'manual' ? '手动' : s === 'kml' ? 'KML' : 'GeoJSON');

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      <div className="flex-shrink-0 flex justify-between items-center px-4 py-3 border-b border-border">
        <h1 className="text-xl font-bold flex items-center gap-2 text-foreground">
          <Shield className="text-primary" /> 空域管理
        </h1>
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={openAdd}>
          <Plus size={16} className="mr-2" /> 新增空域
        </Button>
      </div>
      <div className="flex-1 flex gap-4 p-4 overflow-hidden min-h-0">
        <CyberPanel className="flex-1 flex flex-col min-h-0" title="空域列表" headerIcon={<Shield size={16} />}>
          <div className="flex-1 overflow-auto min-h-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left">
                  <th className="py-2 px-3 font-medium">名称</th>
                  <th className="py-2 px-3 font-medium">类型</th>
                  <th className="py-2 px-3 font-medium">数据来源</th>
                  <th className="py-2 px-3 font-medium">状态</th>
                  <th className="py-2 px-3 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => {
                  const meta = AIRSPACE_TYPE_MAP[item.type];
                  const Icon = meta.icon;
                  return (
                    <tr key={item.id} className="border-b border-border/60 hover:bg-muted/30">
                      <td className="py-2.5 px-3 font-medium text-foreground">{item.name}</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Icon size={14} className="text-primary" /> {meta.label}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">{sourceLabel(item.source)} {item.fileName && `(${item.fileName})`}</td>
                      <td className="py-2.5 px-3">
                        <Switch checked={item.enabled} onCheckedChange={() => toggleEnabled(item.id)} />
                        <span className={cn('ml-2 text-xs', item.enabled ? 'text-green-600' : 'text-muted-foreground')}>
                          {item.enabled ? '启用' : '禁用'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 mr-1"
                          title="编辑"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(item.id)}
                          className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="删除"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {list.length === 0 && (
              <div className="text-center text-muted-foreground py-8">暂无空域数据，点击「新增空域」或导入 KML/GeoJSON</div>
            )}
          </div>
        </CyberPanel>
        <CyberPanel className="flex flex-col w-[40%] min-w-[280px]" title="地图预览" headerIcon={<MapPin size={16} />}>
          <div className="flex-1 min-h-[200px] rounded border border-border bg-muted/20 flex items-center justify-center text-muted-foreground text-sm">
            空域范围地图占位（可接入地图 SDK 展示）
          </div>
        </CyberPanel>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle>{isEdit ? '编辑空域' : '新增空域'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>类型</Label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as AirspaceType)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                {(Object.entries(AIRSPACE_TYPE_MAP) as [AirspaceType, { label: string }][]).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label>名称</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="输入空域名称"
                className="bg-background"
              />
            </div>
            {!isEdit && (
              <div className="grid gap-2">
                <Label>导入 KML / GeoJSON（可选）</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".kml,.geojson,.json"
                  onChange={handleFileChange}
                  className="text-sm text-muted-foreground file:mr-2 file:rounded file:border-0 file:bg-primary/20 file:px-3 file:py-1 file:text-primary"
                />
                {importFile && <p className="text-xs text-muted-foreground">已选：{importFile.name}</p>}
                {importError && <p className="text-xs text-destructive">{importError}</p>}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>取消</Button>
            <Button onClick={submitForm}>{isEdit ? '保存' : '新增'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
