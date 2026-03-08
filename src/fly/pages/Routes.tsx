import React, { useState } from 'react';
import {
  Route as RouteIcon, Plus, Download, Upload, MapPin, Grid, AlertOctagon, Settings2,
  Play, Camera, Video, Home, Navigation, Layers, Square, ScanLine, Box, Focus,
  ChevronDown, SlidersHorizontal, Crosshair, MousePointer2,
  Minimize2, Maximize2, Pencil, Trash2,
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
import { Checkbox } from '../components/ui/checkbox';
import { cn } from '@fly/lib/utils';

type RouteItem = {
  id: string;
  name: string;
  type: string;
  length: string;
  time: string;
  status: string;
};

// 航线类型配置（参考图：巡逻巡检 / 测绘 / 精细化测绘）
const ROUTE_TYPES = {
  patrol: [
    { id: 'waypoint', label: '航点航线', icon: 'S', desc: 'Waypoint' },
    { id: 'patrol', label: '巡逻航线', icon: '□', desc: 'Patrol' },
  ],
  survey: [
    { id: 'area', label: '面状航线', icon: '▭', desc: 'Area' },
    { id: 'strip', label: '带状航线', icon: '〰', desc: 'Strip' },
    { id: 'oblique', label: '斜面航线', icon: '◇', desc: 'Oblique' },
  ],
  detail: [
    { id: 'geometry', label: '几何体航线', icon: '◇', desc: 'Geometry' },
    { id: 'closeup', label: '贴近摄影航线', icon: '📷', desc: 'Close-up' },
  ],
};

const AIRCRAFT_SERIES = [
  { id: 'm30', name: '经纬 M30 系列' },
  { id: 'mavic3', name: 'Mavic 3 行业系列' },
  { id: 'm3d', name: 'Matrice 3D 系列' },
  { id: 'm4', name: 'Matrice 4 行业系列' },
  { id: 'm4d', name: 'Matrice 4D 系列' },
  { id: 'm400', name: 'Matrice 400' },
];

const MODELS_BY_SERIES: Record<string, string[]> = {
  m30: ['经纬 M30', '经纬 M30 T'],
  mavic3: ['Mavic 3E', 'Mavic 3T'],
  m3d: ['Matrice 3D', 'Matrice 3TD'],
  m4: ['Matrice 4', 'Matrice 4T'],
  m4d: ['Matrice 4D', 'Matrice 4D T'],
  m400: ['Matrice 400'],
};

const WAYPOINT_COLS = ['0m', '2s', '1', '0'] as const;
const WAYPOINT_ROWS = 8;

const INITIAL_ROUTES: RouteItem[] = [
  { id: 'RT-2023-001', name: '高新区主干道日常巡检', type: '面状航线', length: '12.5km', time: '45m', status: '已优化' },
  { id: 'RT-2023-002', name: '工业园区化工厂特检', type: '航点飞行', length: '5.2km', time: '20m', status: '草稿' },
  { id: 'RT-2023-003', name: '河道沿线偷排监测', type: '带状航线', length: '18.0km', time: '60m', status: '需优化' },
];

export default function RoutesPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteItem | null>(null);
  const [viewMode, setViewMode] = useState<'library' | 'planning'>('library');
  const [routeType, setRouteType] = useState('waypoint');
  const [aircraftSeries, setAircraftSeries] = useState('m30');
  const [model, setModel] = useState('经纬 M30 T');
  const [routeName, setRouteName] = useState('新建航点航线(16)');
  const [zoomRatio, setZoomRatio] = useState(5);
  const [routes, setRoutes] = useState<RouteItem[]>(INITIAL_ROUTES);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const models = MODELS_BY_SERIES[aircraftSeries] || MODELS_BY_SERIES.m30;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === routes.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(routes.map((x) => x.id)));
  };

  const handleExport = () => {
    const toExport = selectedIds.size > 0 ? routes.filter((r) => selectedIds.has(r.id)) : routes;
    if (toExport.length === 0) return;
    console.log('Export routes:', toExport);
    alert(`已导出 ${toExport.length} 条航线`);
  };

  const handleConfirmCreate = () => {
    const newRoute: RouteItem = {
      id: `RT-${Date.now()}`,
      name: routeName || '未命名航线',
      type: routeType === 'waypoint' ? '航点航线' : routeType === 'patrol' ? '巡逻航线' : routeType,
      length: '0km',
      time: '0m',
      status: '草稿',
    };
    setRoutes((prev) => [newRoute, ...prev]);
    setCreateModalOpen(false);
    setViewMode('planning');
  };

  const handleEdit = (rt: RouteItem) => {
    setEditingRoute({ ...rt });
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingRoute) return;
    setRoutes((prev) => prev.map((r) => (r.id === editingRoute.id ? editingRoute : r)));
    setEditModalOpen(false);
    setEditingRoute(null);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('确定删除该航线？')) return;
    setRoutes((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`确定删除选中的 ${selectedIds.size} 条航线？`)) return;
    setRoutes((prev) => prev.filter((r) => !selectedIds.has(r.id)));
    setSelectedIds(new Set());
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* 创建新航线 - 步骤1&2：新建航线 + 录入名称与类型 */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent
          showCloseButton={true}
          className="max-w-2xl bg-[#0f1522] border-[#1e3a5f] text-foreground"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white border-b border-[#1e3a5f] pb-3">
              创建新航线
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {/* 巡逻巡检航线 */}
            <div>
              <div className="text-xs text-muted-foreground mb-2">巡逻巡检航线</div>
              <div className="flex gap-3 flex-wrap">
                {ROUTE_TYPES.patrol.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setRouteType(t.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all',
                      routeType === t.id
                        ? 'border-primary bg-primary/15 text-primary'
                        : 'border-[#1e3a5f] bg-secondary/50 text-muted-foreground hover:border-primary/50'
                    )}
                  >
                    <span className="w-6 h-6 rounded flex items-center justify-center bg-primary/20 text-primary text-xs font-bold">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            {/* 测绘航线 */}
            <div>
              <div className="text-xs text-muted-foreground mb-2">测绘航线</div>
              <div className="flex gap-3 flex-wrap">
                {ROUTE_TYPES.survey.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setRouteType(t.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all',
                      routeType === t.id
                        ? 'border-primary bg-primary/15 text-primary'
                        : 'border-[#1e3a5f] bg-secondary/50 text-muted-foreground hover:border-primary/50'
                    )}
                  >
                    <span className="w-6 h-6 rounded flex items-center justify-center bg-primary/20 text-primary text-xs">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            {/* 精细化测绘航线 */}
            <div>
              <div className="text-xs text-muted-foreground mb-2">精细化测绘航线</div>
              <div className="flex gap-3 flex-wrap">
                {ROUTE_TYPES.detail.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setRouteType(t.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all',
                      routeType === t.id
                        ? 'border-primary bg-primary/15 text-primary'
                        : 'border-[#1e3a5f] bg-secondary/50 text-muted-foreground hover:border-primary/50'
                    )}
                  >
                    <span className="w-6 h-6 rounded flex items-center justify-center bg-primary/20 text-primary text-xs">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 选择飞行器 */}
            <div>
              <Label className="text-sm text-muted-foreground">选择飞行器</Label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {AIRCRAFT_SERIES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setAircraftSeries(s.id);
                      setModel(MODELS_BY_SERIES[s.id]?.[0] || '');
                    }}
                    className={cn(
                      'px-3 py-2 rounded text-sm font-medium border transition-all',
                      aircraftSeries === s.id
                        ? 'border-primary bg-primary/15 text-primary'
                        : 'border-[#1e3a5f] bg-secondary/30 text-foreground hover:border-primary/40'
                    )}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 选择型号 */}
            <div>
              <Label className="text-sm text-muted-foreground">选择型号</Label>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                {models.map((mName) => (
                  <button
                    key={mName}
                    type="button"
                    onClick={() => setModel(mName)}
                    className={cn(
                      'px-4 py-2 rounded text-sm font-medium border transition-all',
                      model === mName
                        ? 'border-primary bg-primary/15 text-primary'
                        : 'border-[#1e3a5f] bg-secondary/30 text-foreground hover:border-primary/40'
                    )}
                  >
                    {mName}
                  </button>
                ))}
              </div>
            </div>

            {/* 航线名称 */}
            <div>
              <Label className="text-sm text-muted-foreground">航线名称</Label>
              <Input
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                className="mt-1.5 bg-secondary/30 border-[#1e3a5f] text-foreground"
                placeholder="输入航线名称"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-[#1e3a5f]">
            <Button variant="outline" onClick={() => setCreateModalOpen(false)} className="border-[#1e3a5f]">
              取消
            </Button>
            <Button onClick={handleConfirmCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑航线 */}
      <Dialog open={editModalOpen} onOpenChange={(open) => { setEditModalOpen(open); if (!open) setEditingRoute(null); }}>
        <DialogContent showCloseButton className="max-w-md bg-[#0f1522] border-[#1e3a5f] text-foreground">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">编辑航线</DialogTitle>
          </DialogHeader>
          {editingRoute && (
            <div className="space-y-4 py-2">
              <div>
                <Label className="text-sm text-muted-foreground">航线名称</Label>
                <Input
                  value={editingRoute.name}
                  onChange={(e) => setEditingRoute((r) => (r ? { ...r, name: e.target.value } : null))}
                  className="mt-1 bg-secondary/30 border-[#1e3a5f]"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">航线类型</Label>
                <Input
                  value={editingRoute.type}
                  onChange={(e) => setEditingRoute((r) => (r ? { ...r, type: e.target.value } : null))}
                  className="mt-1 bg-secondary/30 border-[#1e3a5f]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">长度</Label>
                  <Input
                    value={editingRoute.length}
                    onChange={(e) => setEditingRoute((r) => (r ? { ...r, length: e.target.value } : null))}
                    className="mt-1 bg-secondary/30 border-[#1e3a5f]"
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">预计时长</Label>
                  <Input
                    value={editingRoute.time}
                    onChange={(e) => setEditingRoute((r) => (r ? { ...r, time: e.target.value } : null))}
                    className="mt-1 bg-secondary/30 border-[#1e3a5f]"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">状态</Label>
                <select
                  value={editingRoute.status}
                  onChange={(e) => setEditingRoute((r) => (r ? { ...r, status: e.target.value } : null))}
                  className="mt-1 w-full h-9 rounded-md border border-[#1e3a5f] bg-secondary/30 text-foreground px-3 text-sm"
                >
                  <option value="草稿">草稿</option>
                  <option value="已优化">已优化</option>
                  <option value="需优化">需优化</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter className="pt-4 border-t border-[#1e3a5f]">
            <Button variant="outline" onClick={() => setEditModalOpen(false)} className="border-[#1e3a5f]">取消</Button>
            <Button onClick={handleSaveEdit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {viewMode === 'library' && (
        <>
          <div className="flex-shrink-0 flex justify-between items-center px-4 py-3 border-b border-border">
            <h1 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <RouteIcon className="text-primary" /> 航线规划
            </h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-border">
                <Upload size={16} className="mr-2" /> 导入 KML/GeoJSON
              </Button>
              <Button variant="outline" size="sm" className="border-border" onClick={handleExport} disabled={routes.length === 0}>
                <Download size={16} className="mr-2" /> 导出{selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
              </Button>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setCreateModalOpen(true)}>
                <Plus size={16} className="mr-2" /> 新建规划
              </Button>
            </div>
          </div>
          <div className="flex-1 flex gap-4 p-4 overflow-hidden min-h-0">
            <CyberPanel className="flex flex-col w-[28%] min-w-[260px]" title="航线库" headerIcon={<Grid size={16} />}>
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 min-h-0">
                {routes.length === 0 ? (
                  <div className="text-xs text-muted-foreground py-4 text-center">暂无航线，点击「新建规划」创建</div>
                ) : (
                  routes.map((rt) => (
                    <div key={rt.id} className="bg-card/50 border border-border p-3 rounded hover:border-primary/50 transition-colors group">
                      <div className="flex items-start gap-2 mb-2">
                        <Checkbox
                          checked={selectedIds.has(rt.id)}
                          onCheckedChange={() => toggleSelect(rt.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-0.5 border-gray-400 bg-gray-100 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-1">
                            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors break-words">{rt.name}</h3>
                            <span className={cn('text-[10px] px-1.5 py-0.5 rounded border flex-shrink-0', rt.status === '已优化' ? 'border-primary/50 text-primary bg-primary/10' : 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10')}>
                              {rt.status}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-2 mt-1">
                            <span className="font-mono truncate">{rt.id}</span>
                            <span className="flex-shrink-0">{rt.type}</span>
                          </div>
                          <div className="flex justify-between text-xs items-center">
                            <div className="flex gap-3">
                              <span className="flex items-center gap-1"><MapPin size={12} /> {rt.length}</span>
                              <span className="flex items-center gap-1"><Settings2 size={12} /> {rt.time}</span>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button type="button" onClick={(e) => { e.stopPropagation(); handleEdit(rt); }} className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-primary/10" title="编辑"><Pencil size={12} /></button>
                              <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(rt.id); }} className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10" title="删除"><Trash2 size={12} /></button>
                            </div>
                          </div>
                          <button className="text-primary hover:underline text-[10px] mt-0.5 block">一键优化(避障效能)</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {routes.length > 0 && (
                <div className="flex-shrink-0 flex items-center gap-2 pt-2 border-t border-border">
                  <Checkbox
                    checked={selectedIds.size === routes.length && routes.length > 0}
                    onCheckedChange={toggleSelectAll}
                    className="shrink-0 border-gray-400 bg-gray-100 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-xs text-muted-foreground">全选</span>
                  {selectedIds.size > 0 && (
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs h-7" onClick={handleDeleteSelected}>
                      删除选中
                    </Button>
                  )}
                </div>
              )}
            </CyberPanel>
            <CyberPanel className="flex-1 flex flex-col min-h-0" title="规划画布" headerIcon={<MapPin size={16} />}>
              <div className="flex-1 min-h-0 bg-muted/20 relative rounded border border-border overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 100 300 Q 300 200, 500 400 T 800 200" stroke="rgba(0, 229, 255, 0.8)" strokeWidth="3" fill="none" strokeDasharray="5,5" />
                  <circle cx="100" cy="300" r="6" fill="#00E5FF" />
                  <circle cx="500" cy="400" r="6" fill="#00E5FF" />
                  <circle cx="800" cy="200" r="6" fill="#00E5FF" />
                </svg>
                <div className="absolute top-20 left-[60%] w-64 h-64 bg-destructive/10 border-2 border-destructive/50 rounded-full flex items-center justify-center pointer-events-none">
                  <span className="text-destructive/80 font-bold bg-background/50 px-2 py-1 rounded text-sm backdrop-blur flex items-center gap-1">
                    <AlertOctagon size={14} /> 核心禁飞区
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-background/80 border border-border backdrop-blur rounded p-2 flex flex-col gap-2 shadow-lg">
                  <button className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-primary hover:bg-primary/20 transition-colors" title="绘制禁飞区"><AlertOctagon size={16} /></button>
                  <button className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-foreground hover:bg-primary/20 transition-colors" title="绘制网格航线"><Grid size={16} /></button>
                </div>
              </div>
            </CyberPanel>
          </div>
        </>
      )}

      {/* 步骤3：精细化调整和参数配置 - 规划工作台 */}
      {viewMode === 'planning' && (
        <div className="flex-1 flex overflow-hidden min-h-0 relative">
          {/* 左侧：航线设置 + 航点列表 + 任务动作 */}
          <div className="w-[280px] flex-shrink-0 flex flex-col border-r border-border bg-card/30 overflow-hidden">
            <div className="flex-shrink-0 p-2 border-b border-border">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ChevronDown size={16} className="text-primary" />
                航线设置
              </div>
              <div className="mt-2 text-xs text-muted-foreground">新建(16) {model.replace(/\s/g, '')}</div>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <div className="flex-shrink-0 px-2 py-1.5 text-xs font-medium text-muted-foreground border-b border-border">航点列表</div>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-[10px] text-muted-foreground">
                  <thead>
                    <tr className="border-b border-border/50">
                      {WAYPOINT_COLS.map((c) => (
                        <th key={c} className="text-left py-1.5 px-2 font-medium">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: WAYPOINT_ROWS }).map((_, i) => (
                      <tr key={i} className="border-b border-border/30 hover:bg-primary/5">
                        {WAYPOINT_COLS.map((c, j) => (
                          <td key={j} className="py-1 px-2">{j === 2 ? i + 1 : (c === '0m' ? `${(i + 1) * 15}m` : c === '2s' ? '2s' : '0')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex-shrink-0 p-2 border-t border-border flex flex-wrap gap-1.5">
              {[
                { icon: Play, label: '开始航线飞行', primary: true },
                { icon: Camera, label: '智能跟随拍照' },
                { icon: Camera, label: '航线拍照' },
                { icon: ScanLine, label: '航线巡检' },
                { icon: MousePointer2, label: '航点编辑' },
                { icon: Layers, label: '盘旋' },
                { icon: Camera, label: '拍照' },
                { icon: Video, label: '录像' },
                { icon: Home, label: '返航' },
                { icon: Box, label: '记录三维中心' },
              ].map((a, i) => (
                <button
                  key={i}
                  type="button"
                  title={a.label}
                  className={cn(
                    'w-8 h-8 rounded flex items-center justify-center border transition-colors',
                    a.primary ? 'border-primary bg-primary/15 text-primary' : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/50 hover:text-primary'
                  )}
                >
                  <a.icon size={14} />
                </button>
              ))}
              <button type="button" className="w-8 h-8 rounded flex items-center justify-center border border-border bg-secondary/30 text-muted-foreground hover:border-primary/50" title="更多">
                ...更多
              </button>
            </div>
          </div>

          {/* 中间：3D 地图与航线 */}
          <div className="flex-1 flex flex-col min-w-0 relative bg-muted/10">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.08)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 80 280 Q 250 180, 450 350 T 750 220 T 900 320" stroke="rgba(0, 229, 255, 0.75)" strokeWidth="2.5" fill="none" strokeDasharray="4,3" />
              <circle cx="80" cy="280" r="5" fill="#22c55e" />
              <circle cx="450" cy="350" r="4" fill="#00E5FF" />
              <circle cx="750" cy="220" r="4" fill="#00E5FF" />
              <circle cx="900" cy="320" r="4" fill="rgba(100,116,139,0.9)" />
            </svg>
            {/* 地图上的参数标签 */}
            <div className="absolute left-4 top-4 text-[10px] font-mono text-muted-foreground space-y-0.5 z-10">
              <div>ASL: 120 m</div>
              <div>HAE: 130.6 m</div>
            </div>
            <div className="absolute left-1/2 top-4 -translate-x-1/2 text-[10px] font-mono text-muted-foreground">123.2 m</div>
            <div className="absolute right-32 top-4 text-[10px] font-mono text-muted-foreground">110.4 m</div>
            <div className="absolute left-4 bottom-4 text-[10px] font-mono text-muted-foreground z-10">
              <div>经度: 121.294440646</div>
              <div>纬度: 30.996756212</div>
            </div>
            {/* 罗盘 */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border border-border flex items-center justify-center bg-background/80 text-[10px] font-medium text-foreground z-10">
              N 000°
            </div>
            {/* 速度/高度控制 */}
            <div className="absolute bottom-4 left-24 flex flex-col gap-2 z-10">
              <div className="flex items-center gap-1 bg-background/90 border border-border rounded px-2 py-1 text-[10px]">
                <span className="text-muted-foreground">SPD m/s</span>
                <span className="font-mono text-foreground">1.0</span>
                <button type="button" className="p-0.5 rounded hover:bg-primary/20 text-primary">▲</button>
                <button type="button" className="p-0.5 rounded hover:bg-primary/20 text-primary">▼</button>
              </div>
              <div className="flex items-center gap-1 bg-background/90 border border-border rounded px-2 py-1 text-[10px]">
                <span className="text-muted-foreground">ALT m</span>
                <span className="font-mono text-foreground">110.4</span>
                <button type="button" className="p-0.5 rounded hover:bg-primary/20 text-primary">C</button>
                <button type="button" className="p-0.5 rounded hover:bg-primary/20 text-primary">Z</button>
              </div>
            </div>
            {/* 地图工具 */}
            <div className="absolute top-4 right-4 flex flex-col gap-1 z-10">
              <button type="button" className="w-8 h-8 rounded bg-background/90 border border-border flex items-center justify-center text-muted-foreground hover:text-primary" title="放大"><Plus size={14} /></button>
              <button type="button" className="w-8 h-8 rounded bg-background/90 border border-border flex items-center justify-center text-muted-foreground hover:text-primary" title="缩小"><Minimize2 size={14} /></button>
              <button type="button" className="w-8 h-8 rounded bg-background/90 border border-border flex items-center justify-center text-muted-foreground hover:text-primary" title="2D/3D">2D/3D</button>
              <button type="button" className="w-8 h-8 rounded bg-background/90 border border-border flex items-center justify-center text-muted-foreground hover:text-primary" title="测量"><SlidersHorizontal size={14} /></button>
              <button type="button" className="w-8 h-8 rounded bg-background/90 border border-border flex items-center justify-center text-muted-foreground hover:text-primary" title="锁定"><Crosshair size={14} /></button>
            </div>
          </div>

          {/* 右侧：相机设置 */}
          <div className="w-[200px] flex-shrink-0 flex flex-col border-l border-border bg-card/30 p-3 overflow-hidden">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
              <Camera size={16} className="text-primary" />
              相机设置
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">相机变焦倍率</Label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setZoomRatio((z) => Math.max(1, z - 1))} className="w-8 h-8 rounded border border-border flex items-center justify-center text-foreground hover:bg-primary/20">−</button>
                <span className="flex-1 text-center font-mono text-sm text-primary">{zoomRatio}x</span>
                <button type="button" onClick={() => setZoomRatio((z) => Math.min(20, z + 1))} className="w-8 h-8 rounded border border-border flex items-center justify-center text-foreground hover:bg-primary/20">+</button>
              </div>
            </div>
          </div>

          {/* 右下角：画中画相机预览 */}
          <div className="absolute bottom-4 right-4 w-48 h-32 rounded-lg overflow-hidden border-2 border-primary/50 bg-black/90 shadow-xl z-20 flex flex-col">
            <div className="flex-shrink-0 px-2 py-1 bg-primary/20 text-[10px] font-medium text-primary flex items-center justify-between">
              <span>相机预览</span>
              <span>{zoomRatio}X</span>
            </div>
            <div className="flex-1 relative bg-muted/50 flex items-center justify-center">
              <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1473220464492-452bbe0fcddf?w=400&q=60")' }} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-8 border-2 border-red-500/80 rounded" />
                <div className="absolute w-8 h-8 border-2 border-green-500/80 rounded" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
              </div>
            </div>
          </div>

          {/* 返回航线库 */}
          <div className="absolute top-4 left-[296px] z-10">
            <Button variant="outline" size="sm" className="bg-background/90 border-border text-xs" onClick={() => setViewMode('library')}>
              <RouteIcon size={12} className="mr-1" /> 返回航线库
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
