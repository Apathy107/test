import React, { useState, useCallback, useRef } from 'react';
import {
  Network, Plus, Save, Play, Settings, Bot, Camera, Radio, GripVertical,
  Trash2, Pencil, List, LayoutGrid, ArrowRight, Zap, Server, Database, ExternalLink,
} from 'lucide-react';
import CyberPanel from '../components/CyberPanel';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { cn } from '@fly/lib/utils';

// 节点类型
type NodeType = 'algorithm' | 'device' | 'data' | 'external';
interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  params: Record<string, string>;
}
interface WorkflowEdge {
  id: string;
  fromId: string;
  toId: string;
}
interface WorkflowDef {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
}

// 节点库配置：算法触发、设备控制、数据处理、外部调用
const NODE_LIBRARY: { type: NodeType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'algorithm', label: '算法触发', icon: <Bot size={14} />, color: 'text-amber-400 border-amber-500/50 bg-amber-500/10' },
  { type: 'device', label: '设备控制', icon: <Camera size={14} />, color: 'text-blue-400 border-blue-500/50 bg-blue-500/10' },
  { type: 'data', label: '数据处理', icon: <Database size={14} />, color: 'text-orange-400 border-orange-500/50 bg-orange-500/10' },
  { type: 'external', label: '外部调用', icon: <ExternalLink size={14} />, color: 'text-green-400 border-green-500/50 bg-green-500/10' },
];

// 预设模板：违停工作流等
const PRESET_WORKFLOWS: WorkflowDef[] = [
  {
    id: 'preset-illegal-parking',
    name: '违停工作流',
    createdAt: '',
    nodes: [
      { id: 'n1', type: 'algorithm', label: '机载算法触发', x: 80, y: 120, params: { condition: '检测对象: 违停车辆', algorithmId: 'algo-001' } },
      { id: 'n2', type: 'device', label: '变焦拍照', x: 320, y: 100, params: { action: '变焦至4x广角拍照，再9x车牌特写', deviceId: '' } },
      { id: 'n3', type: 'data', label: 'OCR与证据链', x: 560, y: 100, params: { processType: '车牌OCR', outputFormat: '时间戳+坐标+设备号' } },
      { id: 'n4', type: 'external', label: '电警推送', x: 800, y: 120, params: { pushUrl: 'https://api.example.com/violation', method: 'POST' } },
    ],
    edges: [
      { id: 'e1', fromId: 'n1', toId: 'n2' },
      { id: 'e2', fromId: 'n2', toId: 'n3' },
      { id: 'e3', fromId: 'n3', toId: 'n4' },
    ],
  },
  {
    id: 'preset-patrol',
    name: '巡检工作流',
    createdAt: '',
    nodes: [
      { id: 'n1', type: 'algorithm', label: '区域触发', x: 100, y: 140, params: { condition: '进入巡检区域', algorithmId: '' } },
      { id: 'n2', type: 'device', label: '录像与拍照', x: 340, y: 140, params: { action: '开始录像，关键点拍照', deviceId: '' } },
      { id: 'n3', type: 'external', label: '上报平台', x: 580, y: 140, params: { pushUrl: 'https://api.example.com/patrol', method: 'POST' } },
    ],
    edges: [
      { id: 'e1', fromId: 'n1', toId: 'n2' },
      { id: 'e2', fromId: 'n2', toId: 'n3' },
    ],
  },
];

function generateId() {
  return 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export default function Workflows() {
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [workflowList, setWorkflowList] = useState<WorkflowDef[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowDef>({
    id: '',
    name: '未命名工作流',
    nodes: [],
    edges: [],
    createdAt: new Date().toISOString(),
  });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectFromId, setConnectFromId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedNode = currentWorkflow.nodes.find((n) => n.id === selectedNodeId);

  const handleDragStart = useCallback((e: React.DragEvent, type: NodeType, label: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type, label }));
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        const lib = NODE_LIBRARY.find((l) => l.type === data.type);
        const id = generateId();
        const node: WorkflowNode = {
          id,
          type: data.type,
          label: data.label,
          x: e.clientX - rect.left - 80,
          y: e.clientY - rect.top - 24,
          params: data.type === 'algorithm' ? { condition: '', algorithmId: '' } : data.type === 'device' ? { action: '', deviceId: '' } : data.type === 'data' ? { processType: '', outputFormat: '' } : { pushUrl: '', method: 'POST' },
        };
        setCurrentWorkflow((w) => ({ ...w, nodes: [...w.nodes, node] }));
        setSelectedNodeId(id);
      } catch (_) {}
    },
    []
  );

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDeleteNode = useCallback((id: string) => {
    setCurrentWorkflow((w) => ({
      ...w,
      nodes: w.nodes.filter((n) => n.id !== id),
      edges: w.edges.filter((e) => e.fromId !== id && e.toId !== id),
    }));
    setSelectedNodeId(null);
    if (connectFromId === id) setConnectFromId(null);
  }, [connectFromId]);

  const handleUpdateNodeParams = useCallback((id: string, params: Record<string, string>) => {
    setCurrentWorkflow((w) => ({
      ...w,
      nodes: w.nodes.map((n) => (n.id === id ? { ...n, params } : n)),
    }));
  }, []);

  const handleStartConnect = useCallback((nodeId: string) => {
    if (connectFromId) {
      if (connectFromId !== nodeId) {
        const exists = currentWorkflow.edges.some((e) => (e.fromId === connectFromId && e.toId === nodeId) || (e.fromId === nodeId && e.toId === connectFromId));
        if (!exists)
          setCurrentWorkflow((w) => ({ ...w, edges: [...w.edges, { id: 'e' + generateId(), fromId: connectFromId, toId: nodeId }] }));
      }
      setConnectFromId(null);
    } else {
      setConnectFromId(nodeId);
    }
  }, [connectFromId, currentWorkflow.edges]);

  const handleSave = useCallback(() => {
    const id = currentWorkflow.id || 'wf-' + Date.now();
    const name = currentWorkflow.name || '未命名工作流';
    const saved: WorkflowDef = {
      ...currentWorkflow,
      id,
      name,
      createdAt: currentWorkflow.createdAt || new Date().toISOString(),
    };
    setWorkflowList((list) => {
      const idx = list.findIndex((w) => w.id === id);
      if (idx >= 0) {
        const next = [...list];
        next[idx] = saved;
        return next;
      }
      return [saved, ...list];
    });
    setCurrentWorkflow(saved);
    setViewMode('list');
  }, [currentWorkflow]);

  const handleApplyPreset = useCallback((preset: WorkflowDef) => {
    const cloned: WorkflowDef = {
      ...preset,
      id: '',
      name: preset.name + ' (副本)',
      nodes: preset.nodes.map((n) => ({ ...n, id: generateId(), params: { ...n.params } })),
      edges: [],
      createdAt: new Date().toISOString(),
    };
    const idMap: Record<string, string> = {};
    preset.nodes.forEach((n, i) => (idMap[n.id] = cloned.nodes[i].id));
    cloned.edges = preset.edges
      .filter((e) => idMap[e.fromId] && idMap[e.toId])
      .map((e, i) => ({ id: 'e' + i + generateId(), fromId: idMap[e.fromId], toId: idMap[e.toId] }));
    setCurrentWorkflow(cloned);
    setSelectedNodeId(null);
    setViewMode('editor');
  }, []);

  const handleOpenWorkflow = useCallback((w: WorkflowDef) => {
    setCurrentWorkflow({ ...w, nodes: [...w.nodes], edges: [...w.edges] });
    setSelectedNodeId(null);
    setViewMode('editor');
  }, []);

  const handleDeleteWorkflow = useCallback((id: string) => {
    if (!window.confirm('确定删除该工作流？')) return;
    setWorkflowList((list) => list.filter((w) => w.id !== id));
    if (currentWorkflow.id === id) setViewMode('list');
  }, [currentWorkflow.id]);

  const handleNewWorkflow = useCallback(() => {
    setCurrentWorkflow({
      id: '',
      name: '未命名工作流',
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString(),
    });
    setSelectedNodeId(null);
    setConnectFromId(null);
    setViewMode('editor');
  }, []);

  // 画布中节点位置（用于连线）
  const getNodeCenter = (node: WorkflowNode) => ({ x: node.x + 80, y: node.y + 24 });

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {viewMode === 'list' && (
        <>
          <div className="flex-shrink-0 flex justify-between items-center px-4 py-3 border-b border-border">
            <h1 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <Network className="text-primary" /> 工作流管理
            </h1>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleNewWorkflow}>
              <Plus size={16} className="mr-2" /> 新建工作流
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {/* 内置模板 */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Zap size={14} /> 内置工作流模板
              </h3>
              <div className="flex flex-wrap gap-3">
                {PRESET_WORKFLOWS.map((preset) => (
                  <div
                    key={preset.id}
                    className="w-[280px] rounded-lg border border-border bg-card/50 p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Server size={16} className="text-primary" />
                      <span className="font-medium text-foreground">{preset.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      {preset.nodes.length} 个节点，{preset.edges.length} 条连线
                    </p>
                    <Button size="sm" variant="outline" className="w-full border-primary/50 text-primary" onClick={() => handleApplyPreset(preset)}>
                      一键应用
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            {/* 已创建工作流列表 */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <List size={14} /> 已创建工作流
              </h3>
              {workflowList.length === 0 ? (
                <div className="text-sm text-muted-foreground py-8 text-center rounded-lg border border-dashed border-border">
                  暂无工作流，点击「新建工作流」或使用上方模板一键应用
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {workflowList.map((w) => (
                    <div
                      key={w.id}
                      className="rounded-lg border border-border bg-card/50 p-4 flex flex-col hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-medium text-foreground truncate">{w.name}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button type="button" onClick={() => handleOpenWorkflow(w)} className="p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/10" title="编辑"><Pencil size={14} /></button>
                          <button type="button" onClick={() => handleDeleteWorkflow(w.id)} className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10" title="删除"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {w.nodes.length} 节点 · {w.edges.length} 连线
                        {w.createdAt && ` · ${new Date(w.createdAt).toLocaleString()}`}
                      </p>
                      <Button size="sm" variant="outline" className="w-full border-border" onClick={() => handleOpenWorkflow(w)}>
                        打开编辑
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {viewMode === 'editor' && (
        <>
          <div className="flex-shrink-0 flex justify-between items-center px-4 py-2 border-b border-border">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setViewMode('list')}>返回列表</Button>
              <Input
                value={currentWorkflow.name}
                onChange={(e) => setCurrentWorkflow((w) => ({ ...w, name: e.target.value }))}
                className="w-48 h-8 text-sm bg-secondary/30 border-border"
                placeholder="工作流名称"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className={connectFromId ? 'text-xs text-primary' : 'text-xs text-muted-foreground'}>
                {connectFromId ? '点击目标节点完成连线' : '点击节点右侧圆点可连线'}
              </span>
              <Button size="sm" variant="outline" className="border-border" onClick={() => setConnectFromId(null)}>取消连线</Button>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSave}>
                <Save size={16} className="mr-2" /> 保存到列表
              </Button>
            </div>
          </div>
          <div className="flex-1 flex overflow-hidden min-h-0">
            {/* 左侧：节点库 */}
            <CyberPanel className="w-[240px] flex-shrink-0 flex flex-col" title="节点库" headerIcon={<LayoutGrid size={16} />}>
              <div className="space-y-3 overflow-y-auto">
                {NODE_LIBRARY.map((item) => (
                  <div
                    key={item.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.type, item.label)}
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-lg border cursor-grab active:cursor-grabbing transition-colors hover:border-primary/60',
                      item.color
                    )}
                  >
                    <GripVertical size={14} className="opacity-70" />
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">从左侧拖拽节点到画布</p>
            </CyberPanel>

            {/* 中间：画布 */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden border-x border-border">
              <div
                ref={canvasRef}
                className="flex-1 relative overflow-auto bg-muted/20"
                onDrop={handleCanvasDrop}
                onDragOver={handleCanvasDragOver}
              >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.08)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                {/* 连线 */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: 1200, minHeight: 600 }}>
                  {currentWorkflow.edges.map((edge) => {
                    const from = currentWorkflow.nodes.find((n) => n.id === edge.fromId);
                    const to = currentWorkflow.nodes.find((n) => n.id === edge.toId);
                    if (!from || !to) return null;
                    const a = getNodeCenter(from);
                    const b = getNodeCenter(to);
                    const path = `M ${a.x} ${a.y} C ${a.x + 80} ${a.y}, ${b.x - 80} ${b.y}, ${b.x} ${b.y}`;
                    return <path key={edge.id} d={path} fill="none" stroke="rgba(0,229,255,0.6)" strokeWidth="2" />;
                  })}
                </svg>
                {/* 节点 */}
                {currentWorkflow.nodes.map((node) => {
                  const lib = NODE_LIBRARY.find((l) => l.type === node.type);
                  const isSelected = selectedNodeId === node.id;
                  const isConnectFrom = connectFromId === node.id;
                  return (
                    <div
                      key={node.id}
                      className="absolute w-40 rounded-lg border-2 p-2 cursor-pointer transition-all border-transparent"
                      style={{ left: node.x, top: node.y }}
                      onClick={() => {
                        if (connectFromId && connectFromId !== node.id) {
                          const exists = currentWorkflow.edges.some((e) => (e.fromId === connectFromId && e.toId === node.id) || (e.fromId === node.id && e.toId === connectFromId));
                          if (!exists) setCurrentWorkflow((w) => ({ ...w, edges: [...w.edges, { id: 'e' + generateId(), fromId: connectFromId, toId: node.id }] }));
                          setConnectFromId(null);
                        }
                        setSelectedNodeId(node.id);
                      }}
                    >
                      <div className={cn('rounded border p-2 shadow-lg bg-background/95', lib?.color, isSelected && 'ring-2 ring-primary', isConnectFrom && 'ring-2 ring-amber-400')}>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-medium truncate flex items-center gap-1">
                            {lib?.icon}
                            {node.label}
                          </span>
                          <button
                            type="button"
                            className="w-3 h-3 rounded-full bg-primary/80 hover:bg-primary border border-primary shrink-0"
                            title="连接从此节点出发"
                            onClick={(e) => { e.stopPropagation(); handleStartConnect(node.id); }}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <button type="button" className="text-[10px] text-destructive hover:underline" onClick={(e) => { e.stopPropagation(); handleDeleteNode(node.id); }}>删除</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 右侧：属性面板 */}
            <CyberPanel className="w-[280px] flex-shrink-0 flex flex-col" title="节点属性" headerIcon={<Settings size={16} />}>
              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">节点类型</Label>
                    <p className="text-sm font-medium text-foreground mt-0.5">{NODE_LIBRARY.find((l) => l.type === selectedNode.type)?.label}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">节点名称</Label>
                    <Input
                      value={selectedNode.label}
                      onChange={(e) => setCurrentWorkflow((w) => ({ ...w, nodes: w.nodes.map((n) => (n.id === selectedNode.id ? { ...n, label: e.target.value } : n)) }))}
                      className="mt-1 h-8 text-sm bg-secondary/30 border-border"
                    />
                  </div>
                  {selectedNode.type === 'algorithm' && (
                    <>
                      <div>
                        <Label className="text-xs text-muted-foreground">算法启动条件</Label>
                        <Input
                          value={selectedNode.params.condition ?? ''}
                          onChange={(e) => handleUpdateNodeParams(selectedNode.id, { ...selectedNode.params, condition: e.target.value })}
                          className="mt-1 h-8 text-sm bg-secondary/30 border-border"
                          placeholder="如：检测对象: 违停车辆"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">算法 ID</Label>
                        <Input
                          value={selectedNode.params.algorithmId ?? ''}
                          onChange={(e) => handleUpdateNodeParams(selectedNode.id, { ...selectedNode.params, algorithmId: e.target.value })}
                          className="mt-1 h-8 text-sm bg-secondary/30 border-border"
                        />
                      </div>
                    </>
                  )}
                  {selectedNode.type === 'device' && (
                    <>
                      <div>
                        <Label className="text-xs text-muted-foreground">控制动作</Label>
                        <Input
                          value={selectedNode.params.action ?? ''}
                          onChange={(e) => handleUpdateNodeParams(selectedNode.id, { ...selectedNode.params, action: e.target.value })}
                          className="mt-1 h-8 text-sm bg-secondary/30 border-border"
                          placeholder="如：变焦4x拍照、9x特写"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">设备 ID</Label>
                        <Input
                          value={selectedNode.params.deviceId ?? ''}
                          onChange={(e) => handleUpdateNodeParams(selectedNode.id, { ...selectedNode.params, deviceId: e.target.value })}
                          className="mt-1 h-8 text-sm bg-secondary/30 border-border"
                        />
                      </div>
                    </>
                  )}
                  {selectedNode.type === 'data' && (
                    <>
                      <div>
                        <Label className="text-xs text-muted-foreground">处理类型</Label>
                        <Input
                          value={selectedNode.params.processType ?? ''}
                          onChange={(e) => handleUpdateNodeParams(selectedNode.id, { ...selectedNode.params, processType: e.target.value })}
                          className="mt-1 h-8 text-sm bg-secondary/30 border-border"
                          placeholder="如：车牌OCR"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">输出格式</Label>
                        <Input
                          value={selectedNode.params.outputFormat ?? ''}
                          onChange={(e) => handleUpdateNodeParams(selectedNode.id, { ...selectedNode.params, outputFormat: e.target.value })}
                          className="mt-1 h-8 text-sm bg-secondary/30 border-border"
                        />
                      </div>
                    </>
                  )}
                  {selectedNode.type === 'external' && (
                    <>
                      <div>
                        <Label className="text-xs text-muted-foreground">推送地址</Label>
                        <Input
                          value={selectedNode.params.pushUrl ?? ''}
                          onChange={(e) => handleUpdateNodeParams(selectedNode.id, { ...selectedNode.params, pushUrl: e.target.value })}
                          className="mt-1 h-8 text-sm bg-secondary/30 border-border"
                          placeholder="https://api.example.com/..."
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">请求方法</Label>
                        <select
                          value={selectedNode.params.method ?? 'POST'}
                          onChange={(e) => handleUpdateNodeParams(selectedNode.id, { ...selectedNode.params, method: e.target.value })}
                          className="mt-1 w-full h-8 rounded-md border border-border bg-secondary/30 text-foreground px-2 text-sm"
                        >
                          <option value="GET">GET</option>
                          <option value="POST">POST</option>
                          <option value="PUT">PUT</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">在画布中点击节点以配置参数</p>
              )}
            </CyberPanel>
          </div>
        </>
      )}
    </div>
  );
}
