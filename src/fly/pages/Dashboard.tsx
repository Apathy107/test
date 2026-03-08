import React, { useEffect, useMemo, useState } from 'react';
import {
  Video, Map, Crosshair, Play, Square, Pause,
  AlertTriangle, MoveUpRight, Zap, Sun, Mic, Siren,
  MousePointer2, ChevronRight, Eye, Bot, Camera,
  ZoomIn, ZoomOut, Maximize, Minimize2, RotateCcw, ArrowLeft,
  Layers, Settings, Radio, Activity, Navigation, Battery,
  Wifi, User, List, MapPin, Home, ArrowDown, ArrowUp, ArrowRight, LayoutGrid, Satellite
} from 'lucide-react';
import TransferControlModal from '../components/TransferControlModal';
import FlightTopBar from '../components/FlightTopBar';

// Waypoint data
const WAYPOINTS = [
  { id: 1, name: '航点 #1', h: 120, s: 5, ai: '人员识别', status: 'done' },
  { id: 2, name: '航点 #2', h: 120, s: 5, ai: '车速识别', status: 'active' },
  { id: 3, name: '航点 #3', h: 125, s: 5, ai: '无', status: 'pending' },
  { id: 4, name: '航点 #4', h: 118, s: 6, ai: '烟火检测', status: 'pending' },
  { id: 5, name: '航点 #5', h: 122, s: 5, ai: '无', status: 'pending' },
];

// Mission options (任务计划列表 + 轨迹预览路径)
const MISSIONS = [
  {
    id: 'route-a',
    label: '园区日常巡检 A路线',
    type: '巡检',
    miniPath: 'M 20 90 Q 60 60, 100 80 T 170 30',
  },
  {
    id: 'route-b',
    label: '夜间安防巡检 B路线',
    type: '夜巡',
    miniPath: 'M 20 80 Q 70 40, 120 60 T 175 35',
  },
  {
    id: 'route-c',
    label: '重点区域应急巡查 C路线',
    type: '应急',
    miniPath: 'M 20 85 Q 60 70, 110 50 T 170 25',
  },
];

// 左侧设备列表
const DEVICES = [
  { id: 'dock-a', name: 'DJI Dock 3 (A区)', status: '在线', desc: '园区东侧机场' },
  { id: 'dock-b', name: 'DJI Dock 3 (B区)', status: '在线', desc: '园区西侧机场' },
  { id: 'dock-c', name: '应急备份机场', status: '离线', desc: '城区应急备份点位' },
];

// AI algorithm options
const AI_ALGORITHMS = [
  { id: 'person', name: '人员识别', active: true, icon: '👤' },
  { id: 'vehicle', name: '车辆识别', active: false, icon: '🚗' },
  { id: 'fire', name: '烟火检测', active: true, icon: '🔥' },
  { id: 'defect', name: '缺陷检测', active: false, icon: '⚠️' },
];

const WORKFLOWS = [
  { id: 'parking', name: '违停工作流', active: false, desc: '车牌识别 + 违停判定 + 取证截图' },
  { id: 'intrusion', name: '入侵告警工作流', active: true, desc: '人员闯入检测 + 轨迹跟踪 + 告警推送' },
  { id: 'firewatch', name: '烟火巡查工作流', active: true, desc: '烟火检测 + 区域热力 + 联动喊话' },
];

type AiEvent = {
  id: string;
  time: string;
  type: string;
  confidence: number;
  thumb: string;
  color: 'danger' | 'warning' | 'info';
  position: { x: number; y: number };
};

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<'live' | 'ai'>('live');
  const [showAlgo, setShowAlgo] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [algorithms, setAlgorithms] = useState(AI_ALGORITHMS);
  const [spotlightOn, setSpotlightOn] = useState(false);
  const [strobeOn, setStrobeOn] = useState(true);
  const [workflows, setWorkflows] = useState(WORKFLOWS);
  const [routePaused, setRoutePaused] = useState(false);
  const [manualTakeover, setManualTakeover] = useState(false);
  const [emergencyOverride, setEmergencyOverride] = useState(false);
  const [irPalette, setIrPalette] = useState<'白热' | '黑热' | '彩虹' | '铁红'>('白热');
  const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('photo');
  const [zoom, setZoom] = useState(1.0);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedMissionId, setSelectedMissionId] = useState<string>(MISSIONS[0].id);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(DEVICES[0]?.id ?? null);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [rightTab, setRightTab] = useState<'device' | 'ai'>('device');
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [leftTab, setLeftTab] = useState<'device' | 'mission' | 'payload'>('device');
  const [activePayloadPanel, setActivePayloadPanel] = useState<'megaphone' | 'spotlight' | 'strobe'>('megaphone');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [trajectoryMenu, setTrajectoryMenu] = useState<{ x: number; y: number } | null>(null);
  const [showIrPalettePopover, setShowIrPalettePopover] = useState(false);
  const [trajectoryFullscreen, setTrajectoryFullscreen] = useState(false);
  const [aiEvents, setAiEvents] = useState<AiEvent[]>(() => [
    {
      id: 'ev-1',
      time: '16:24:32',
      type: '人员闯入',
      confidence: 95,
      thumb: 'https://images.unsplash.com/photo-1520975958225-9e1c3f0f1b0c?w=400&q=60',
      color: 'danger',
      position: { x: 0.35, y: 0.28 },
    },
    {
      id: 'ev-2',
      time: '16:25:05',
      type: '烟火检测',
      confidence: 76,
      thumb: 'https://images.unsplash.com/photo-1520975999917-25c7d43a3d36?w=400&q=60',
      color: 'warning',
      position: { x: 0.55, y: 0.5 },
    },
    {
      id: 'ev-3',
      time: '16:26:18',
      type: '车辆识别',
      confidence: 88,
      thumb: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=60',
      color: 'info',
      position: { x: 0.62, y: 0.4 },
    },
  ]);

  const toggleAlgo = (id: string) => {
    setAlgorithms(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const toggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w));
  };

  const activeAlgoCount = algorithms.filter(a => a.active).length;
  const activeWorkflowCount = workflows.filter(w => w.active).length;

  const currentMission = useMemo(
    () => MISSIONS.find((m) => m.id === selectedMissionId) ?? MISSIONS[0],
    [selectedMissionId]
  );

  const currentDevice = useMemo(
    () => (selectedDeviceId ? DEVICES.find((d) => d.id === selectedDeviceId) ?? null : null),
    [selectedDeviceId]
  );

  const [now, setNow] = useState(() => {
    const d = new Date();
    return d.toTimeString().slice(0, 8);
  });
  useEffect(() => {
    const t = window.setInterval(() => {
      const d = new Date();
      setNow(d.toTimeString().slice(0, 8));
    }, 1000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const t = window.setInterval(() => {
      setAiEvents((prev) => (prev.length > 1 ? [...prev.slice(1), prev[0]] : prev));
    }, 6000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (!trajectoryMenu) return;
    const close = () => setTrajectoryMenu(null);
    const t = setTimeout(() => window.addEventListener('click', close), 0);
    return () => {
      clearTimeout(t);
      window.removeEventListener('click', close);
    };
  }, [trajectoryMenu]);

  useEffect(() => {
    if (!showIrPalettePopover) return;
    const close = () => setShowIrPalettePopover(false);
    const t = setTimeout(() => window.addEventListener('click', close), 0);
    return () => {
      clearTimeout(t);
      window.removeEventListener('click', close);
    };
  }, [showIrPalettePopover]);

  return (
    <div className="flex flex-col bg-background overflow-y-auto" style={{ height: '1080px' }}>
      {/* Top telemetry bar */}
      <FlightTopBar
        battery={90}
        speed={12.5}
        altitude={120}
        coordinates="112.154894, 37.987457"
        distance="2223.14m"
        rtkStatus="RTK固定解"
        rtkSats={39}
        signal="4G"
        signalStrength={4}
        time={now}
        routePaused={routePaused}
        emergencyOverride={emergencyOverride}
        onTransfer={() => setShowTransfer(true)}
        onEmergencyStop={() => window.confirm('确认急停？（模拟）') && console.log('EMERGENCY STOP')}
        onRth={() => window.confirm('确认一键返航？（模拟）') && console.log('RTH')}
        onPauseRoute={() => setRoutePaused(true)}
        onResumeRoute={() => setRoutePaused(false)}
        onManualTakeover={() => {
          setManualTakeover(true);
          setLeftCollapsed(false);
          setLeftTab('payload');
        }}
      />

      {/* Main 3-column layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* ===== LEFT PANEL: Mission & Waypoints ===== */}
        <div
          className="flex-shrink-0 flex flex-col overflow-hidden"
          style={{ background: 'rgba(8,13,24,0.95)', borderRight: '1px solid rgba(30,58,138,0.5)' }}
        >
          {/* Left panel header + collapse */}
          <div className="p-2 border-b flex items-center justify-between" style={{ borderColor: 'rgba(30,58,138,0.4)' }}>
            {!leftCollapsed ? (
              <>
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 rounded text-[10px] font-bold"
                    style={{ background: leftTab === 'device' ? 'rgba(0,229,255,0.15)' : 'rgba(15,23,42,0.5)', border: '1px solid rgba(30,58,138,0.45)', color: leftTab === 'device' ? 'rgb(0,229,255)' : 'rgb(148,163,184)' }}
                    onClick={() => setLeftTab('device')}
                  >
                    设备
                  </button>
                  <button
                    className="px-2 py-1 rounded text-[10px] font-bold"
                    style={{ background: leftTab === 'mission' ? 'rgba(0,229,255,0.15)' : 'rgba(15,23,42,0.5)', border: '1px solid rgba(30,58,138,0.45)', color: leftTab === 'mission' ? 'rgb(0,229,255)' : 'rgb(148,163,184)' }}
                    onClick={() => setLeftTab('mission')}
                  >
                    任务
                  </button>
                  <button
                    className="px-2 py-1 rounded text-[10px] font-bold"
                    style={{ background: leftTab === 'payload' ? 'rgba(0,229,255,0.15)' : 'rgba(15,23,42,0.5)', border: '1px solid rgba(30,58,138,0.45)', color: leftTab === 'payload' ? 'rgb(0,229,255)' : 'rgb(148,163,184)' }}
                    onClick={() => setLeftTab('payload')}
                  >
                    负载
                  </button>
                </div>
                <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => setLeftCollapsed((v) => !v)} title="收起左侧面板">◀</button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1 w-full">
                <button
                  className="w-8 h-8 rounded flex items-center justify-center"
                  style={{ background: leftTab === 'device' ? 'rgba(0,229,255,0.18)' : 'rgba(15,23,42,0.5)', border: '1px solid rgba(30,58,138,0.45)' }}
                  onClick={() => { setLeftCollapsed(false); setLeftTab('device'); }}
                  title="设备"
                >
                  <Radio size={16} className={leftTab === 'device' ? 'text-primary' : 'text-muted-foreground'} />
                </button>
                <button
                  className="w-8 h-8 rounded flex items-center justify-center"
                  style={{ background: leftTab === 'mission' ? 'rgba(0,229,255,0.18)' : 'rgba(15,23,42,0.5)', border: '1px solid rgba(30,58,138,0.45)' }}
                  onClick={() => { setLeftCollapsed(false); setLeftTab('mission'); }}
                  title="任务"
                >
                  <List size={16} className={leftTab === 'mission' ? 'text-primary' : 'text-muted-foreground'} />
                </button>
                <button
                  className="w-8 h-8 rounded flex items-center justify-center"
                  style={{ background: leftTab === 'payload' ? 'rgba(0,229,255,0.18)' : 'rgba(15,23,42,0.5)', border: '1px solid rgba(30,58,138,0.45)' }}
                  onClick={() => { setLeftCollapsed(false); setLeftTab('payload'); }}
                  title="负载"
                >
                  <Mic size={16} className={leftTab === 'payload' ? 'text-primary' : 'text-muted-foreground'} />
                </button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:text-foreground" onClick={() => setLeftCollapsed((v) => !v)} title="展开左侧面板">▶</button>
              </div>
            )}
          </div>

          <div style={{ width: leftCollapsed ? 56 : 210 }} className="flex-1 flex flex-col overflow-hidden min-h-0">
          {!leftCollapsed && (
            <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
              <div className="w-full flex-1 overflow-y-auto">
          {leftTab === 'device' && (
            <div className="p-3 space-y-2">
              <div className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1">
                <Radio size={10} /> 设备列表
              </div>
              {DEVICES.map((dev) => {
                const isActive = dev.id === selectedDeviceId;
                const tone = dev.status === '在线' ? 'rgb(34,197,94)' : 'rgb(148,163,184)';
                return (
                  <button
                    key={dev.id}
                    className="w-full text-left rounded p-2 text-[10px] transition-all"
                    style={{
                      background: isActive ? 'rgba(0,229,255,0.08)' : 'rgba(15,23,42,0.5)',
                      border: `1px solid ${isActive ? 'rgba(0,229,255,0.45)' : 'rgba(30,58,138,0.5)'}`,
                    }}
                    onClick={() => {
                      setSelectedDeviceId(dev.id);
                      setLeftTab('mission');
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-foreground truncate">{dev.name}</span>
                      <span className="px-1.5 py-0.5 rounded-full" style={{ border: `1px solid ${tone}`, color: tone, background: 'rgba(15,23,42,0.8)' }}>
                        {dev.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate">{dev.desc}</div>
                  </button>
                );
              })}
              <div className="text-[10px] text-muted-foreground mt-1">
                选择设备后，将进入任务面板进行航线执行。
              </div>
            </div>
          )}
          {leftTab === 'mission' && (<>
          {/* Mission selector */}
          <div className="p-3 border-b" style={{ borderColor: 'rgba(30,58,138,0.4)' }}>
            <div className="text-[10px] text-muted-foreground mb-2 flex items-center gap-1">
              <List size={10} /> 选择任务计划
            </div>
            <div className="flex items-center px-2 py-1.5 rounded text-xs" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(30,58,138,0.5)' }}>
              <select
                className="flex-1 bg-transparent outline-none text-xs text-foreground"
                value={selectedMissionId}
                onChange={(e) => setSelectedMissionId(e.target.value)}
              >
                {MISSIONS.map((m) => (
                  <option key={m.id} value={m.id} className="bg-slate-900">
                    {m.label}
                  </option>
                ))}
              </select>
              <ChevronRight size={12} className="text-muted-foreground flex-shrink-0 ml-1" />
            </div>
          </div>

          {/* Mission info card */}
          <div className="p-3 border-b" style={{ borderColor: 'rgba(30,58,138,0.4)' }}>
            <div className="rounded p-2.5" style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(30,58,138,0.4)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-foreground truncate">{currentMission.label}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(234,179,8,0.15)', color: 'rgb(234,179,8)', border: '1px solid rgba(234,179,8,0.3)' }}>
                  {MISSIONS.find(m => m.id === currentMission.id)?.type ?? '任务'}
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-foreground font-mono text-xs">1h19m</span>
                  <span>预计时长</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-foreground font-mono text-xs">24</span>
                  <span>航点数量</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-foreground font-mono text-xs">3.2km</span>
                  <span>总航程</span>
                </div>
              </div>
            </div>
          </div>

          {/* Waypoint List */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="text-[10px] text-muted-foreground mb-2 flex items-center gap-1">
              <Eye size={10} /> 航点预览
            </div>
            <div className="flex flex-col gap-1.5">
              {WAYPOINTS.map(wp => (
                <div
                  key={wp.id}
                  className="p-2 rounded cursor-pointer transition-all"
                  style={{
                    background: wp.status === 'active' ? 'rgba(0,229,255,0.08)' : 'rgba(15,23,42,0.4)',
                    border: `1px solid ${wp.status === 'active' ? 'rgba(0,229,255,0.4)' : 'rgba(30,58,138,0.4)'}`,
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{
                      background: wp.status === 'done' ? 'rgb(34,197,94)' : wp.status === 'active' ? 'rgb(0,229,255)' : 'rgb(100,116,139)'
                    }}></div>
                    <span className="text-xs font-semibold" style={{ color: wp.status === 'active' ? 'rgb(0,229,255)' : 'rgb(238,242,255)' }}>{wp.name}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground pl-3">H: {wp.h}m | S: {wp.s}m/s | AI: {wp.ai}</p>
                </div>
              ))}
              <div className="text-center text-[10px] text-muted-foreground py-1">—— 剩余 21 个航点 ——</div>
            </div>
          </div>

          {/* Execute Mission Button */}
          <div className="p-3 border-t" style={{ borderColor: 'rgba(30,58,138,0.4)' }}>
            <button className="w-full py-3 rounded text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90" style={{ background: 'rgba(0,229,255,1)', color: 'rgb(9,14,23)' }}>
              <Play size={16} fill="currentColor" /> 执行任务
            </button>
          </div>
          </> )}
          {leftTab === 'payload' && (
            <div className="p-3 space-y-3">
              <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Settings size={10} /> 负载控制参数
              </div>

              {/* Payload tabs */}
              <div className="flex gap-1">
                {[
                  { id: 'megaphone', label: '喊话', icon: Mic },
                  { id: 'spotlight', label: '探照灯', icon: Sun },
                  { id: 'strobe', label: '警示灯', icon: Siren },
                ].map((p) => (
                  <button
                    key={p.id}
                    className="flex-1 py-2 text-[10px] rounded font-bold transition-all"
                    style={{
                      background: activePayloadPanel === (p.id as any) ? 'rgba(0,229,255,0.12)' : 'rgba(15,23,42,0.5)',
                      border: '1px solid rgba(30,58,138,0.45)',
                      color: activePayloadPanel === (p.id as any) ? 'rgb(0,229,255)' : 'rgb(148,163,184)',
                    }}
                    onClick={() => setActivePayloadPanel(p.id as any)}
                  >
                    <p.icon size={12} className="inline mr-1" />
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Megaphone */}
              {activePayloadPanel === 'megaphone' && (
                <div className="rounded p-3 space-y-2" style={{ background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(30,58,138,0.45)' }}>
                  <div className="text-[11px] text-foreground font-bold">远程喊话</div>
                  <input
                    className="w-full px-2 py-1.5 rounded text-xs text-foreground"
                    placeholder="输入喊话内容，例如：请注意安全，立即撤离"
                    style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(30,58,138,0.5)' }}
                  />
                  <button
                    className="w-full py-2 rounded text-xs font-bold transition-all hover:opacity-90"
                    style={{ background: 'rgba(0,229,255,1)', color: 'rgb(9,14,23)' }}
                    onClick={() => console.log('MEGAPHONE_SEND')}
                  >
                    发送播放
                  </button>
                </div>
              )}

              {/* Spotlight */}
              {activePayloadPanel === 'spotlight' && (
                <div className="rounded p-3 space-y-3" style={{ background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(30,58,138,0.45)' }}>
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] text-foreground font-bold">高亮探照灯</div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={spotlightOn} onChange={() => setSpotlightOn(!spotlightOn)} className="sr-only peer" />
                      <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground">亮度调节</span>
                    <input type="range" className="w-full accent-primary" min="0" max="100" defaultValue="100" />
                    <div className="flex justify-between text-[10px] text-muted-foreground"><span>0%</span><span>100%</span></div>
                  </div>
                </div>
              )}

              {/* Strobe */}
              {activePayloadPanel === 'strobe' && (
                <div className="rounded p-3 space-y-3" style={{ background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(30,58,138,0.45)' }}>
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] text-foreground font-bold">红蓝警示灯</div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={strobeOn} onChange={() => setStrobeOn(!strobeOn)} className="sr-only peer" />
                      <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-destructive"></div>
                    </label>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground">工作模式</span>
                    <div className="flex gap-1 mt-1.5">
                      {['交替爆闪', '警笛模式', '低频警示'].map((m, i) => (
                        <button
                          key={m}
                          className="flex-1 py-1 text-[10px] rounded transition-all"
                          style={{ background: i === 0 ? 'rgba(239,68,68,0.2)' : 'rgba(30,41,59,0.6)', border: `1px solid ${i === 0 ? 'rgba(239,68,68,0.5)' : 'rgba(30,58,138,0.4)'}`, color: i === 0 ? 'rgb(239,68,68)' : 'rgb(148,163,184)' }}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Manual control panel inside left payload tab */}
              <div
                className="rounded p-3 space-y-2"
                style={{
                  background: 'rgba(15,23,42,0.5)',
                  border: `1px solid ${manualTakeover ? 'rgba(0,229,255,0.6)' : 'rgba(30,58,138,0.5)'}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-foreground font-bold">飞行手动操控</span>
                  <span className="text-[10px]">
                    状态：
                    <span style={{ color: manualTakeover ? 'rgb(34,197,94)' : 'rgb(148,163,184)' }}>
                      {manualTakeover ? ' 已接管' : ' 未接管'}
                    </span>
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground space-y-1.5">
                  <p>键盘：W/S 前进后退，A/D 左右平移，Q/E 左右旋转，↑/↓ 上升下降。</p>
                  <p>鼠标：按住右键拖拽可调整机头方向与俯仰角。</p>
                  <p>遥控器：左杆控制油门与偏航，右杆控制前后/左右位移，实现精细姿态调整。</p>
                  {!manualTakeover && <p>提示：仅在点击顶部「接管」后，上述控制才会真正生效（当前为示意态）。</p>}
                </div>
              </div>
            </div>
          )}
              </div>
            </div>
          )}
          </div>
        </div>

        {/* ===== CENTER: Video Feed + Controls ===== */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* 异常提醒：直播界面上方单行滚动 */}
          <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 border-b overflow-x-auto" style={{ background: 'rgba(8,13,24,0.95)', borderColor: 'rgba(30,58,138,0.4)' }}>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1 flex-shrink-0">
              <AlertTriangle size={10} /> 异常提醒
            </span>
            <div className="flex-1 min-w-0 overflow-x-auto overflow-y-hidden flex gap-2 items-center py-0.5" style={{ scrollbarWidth: 'thin' }}>
              <div className="flex gap-2 items-center whitespace-nowrap">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] flex-shrink-0" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: 'rgb(239,68,68)' }}>AI算法检测到异常人员进入！</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] flex-shrink-0" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.3)', color: 'rgb(234,179,8)' }}>电量将在20分钟内低于20%</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] flex-shrink-0" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: 'rgb(239,68,68)' }}>AI算法检测到异常人员进入！</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] flex-shrink-0" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.3)', color: 'rgb(234,179,8)' }}>电量将在20分钟内低于20%</span>
              </div>
            </div>
          </div>
          {/* 直播画面占位：固定 16:9 */}
          <div
            className="w-full flex-shrink-0 relative overflow-hidden"
            style={{ aspectRatio: '16 / 9', background: 'rgb(0,0,0)' }}
          >
          {/* View mode tabs */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex rounded overflow-hidden" style={{ border: '1px solid rgba(30,58,138,0.6)', background: 'rgba(8,13,24,0.85)', backdropFilter: 'blur(8px)' }}>
            <button
              onClick={() => setViewMode('live')}
              className="px-5 py-1.5 text-xs font-medium transition-all"
              style={{ background: viewMode === 'live' ? 'rgba(0,229,255,0.15)' : 'transparent', color: viewMode === 'live' ? 'rgb(0,229,255)' : 'rgb(148,163,184)', borderRight: '1px solid rgba(30,58,138,0.5)' }}
            >
              直播画面
            </button>
            <button
              onClick={() => setViewMode('ai')}
              className="px-5 py-1.5 text-xs font-medium transition-all"
              style={{ background: viewMode === 'ai' ? 'rgba(0,229,255,0.15)' : 'transparent', color: viewMode === 'ai' ? 'rgb(0,229,255)' : 'rgb(148,163,184)' }}
            >
              AI画面
            </button>
          </div>

          {/* Video Background */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1473220464492-452bbe0fcddf?w=1400&q=80")',
                filter: viewMode === 'ai' ? 'hue-rotate(180deg) saturate(0.6)' : 'none',
                transition: 'filter 0.3s ease'
              }}
            ></div>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.25)' }}></div>
          </div>

          {/* HUD Corners */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2" style={{ borderColor: 'rgba(0,229,255,0.6)' }}></div>
            <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2" style={{ borderColor: 'rgba(0,229,255,0.6)' }}></div>
            <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2" style={{ borderColor: 'rgba(0,229,255,0.6)' }}></div>
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2" style={{ borderColor: 'rgba(0,229,255,0.6)' }}></div>
            {/* Center crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Crosshair size={40} strokeWidth={1} style={{ color: 'rgba(0,229,255,0.5)' }} />
            </div>
          </div>

          {/* Emergency override overlay */}
          {emergencyOverride && (
            <div className="absolute inset-0 z-40 pointer-events-none">
              {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos) => (
                <div
                  key={pos}
                  className={`absolute ${pos} px-3 py-1 rounded border text-xs font-bold tracking-widest`}
                  style={{ background: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.55)', color: 'rgb(239,68,68)' }}
                >
                  应急接管
                </div>
              ))}
            </div>
          )}

          {/* AI Bounding Boxes */}
          {aiEnabled && (
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute border-2 top-[28%] left-[35%] w-28 h-20" style={{ borderColor: 'rgb(239,68,68)', background: 'rgba(239,68,68,0.08)' }}>
                <span className="absolute -top-6 left-0 text-[10px] px-1 whitespace-nowrap font-mono" style={{ background: 'rgb(239,68,68)', color: 'rgb(255,255,255)' }}>人员闯入 98%</span>
              </div>
              <div className="absolute border-2 top-[50%] left-[55%] w-20 h-14" style={{ borderColor: 'rgb(234,179,8)', background: 'rgba(234,179,8,0.08)' }}>
                <span className="absolute -top-6 left-0 text-[10px] px-1 whitespace-nowrap font-mono" style={{ background: 'rgb(234,179,8)', color: 'rgb(9,14,23)' }}>烟雾/尘雾 76%</span>
              </div>
            </div>
          )}

          {/* AI Alert Panel */}
          {viewMode === 'ai' && (
            <div className="absolute top-14 right-4 w-52 z-20 rounded overflow-hidden" style={{ background: 'rgba(8,13,24,0.92)', border: '1px solid rgba(239,68,68,0.5)', backdropFilter: 'blur(8px)' }}>
              <div className="px-3 py-2 flex items-center gap-2" style={{ background: 'rgba(239,68,68,0.15)' }}>
                <span className="text-xs font-bold" style={{ color: 'rgb(239,68,68)' }}>AI 识别警告 (3)</span>
              </div>
              <div className="p-2 space-y-2">
                {[
                  { type: '人员闯入', time: '16:24:32', conf: 'Conf: 98%', color: 'rgb(239,68,68)' },
                  { type: '烟雾/尘雾', time: '16:25:05', conf: 'Conf: 76%', color: 'rgb(234,179,8)' },
                ].map((alert, i) => (
                  <div key={i} className="text-[11px] p-1.5 rounded" style={{ background: 'rgba(15,23,42,0.8)' }}>
                    <span className="font-bold" style={{ color: alert.color }}>{alert.type}</span>
                    <span className="text-muted-foreground ml-2">{alert.time} | {alert.conf}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Left quick payload buttons (open left panel payload tab) */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
            <button
              onClick={() => { setLeftCollapsed(false); setLeftTab('payload'); setActivePayloadPanel('megaphone'); }}
              className="w-9 h-9 rounded flex items-center justify-center transition-all"
              style={{ background: 'rgba(8,13,24,0.85)', border: '1px solid rgba(30,58,138,0.5)', backdropFilter: 'blur(8px)' }}
              title="负载：远程喊话（左侧面板）"
            >
              <Mic size={16} className="text-primary" />
            </button>
            <button
              onClick={() => { setLeftCollapsed(false); setLeftTab('payload'); setActivePayloadPanel('spotlight'); }}
              className="w-9 h-9 rounded flex items-center justify-center transition-all"
              style={{ background: 'rgba(8,13,24,0.85)', border: '1px solid rgba(30,58,138,0.5)', backdropFilter: 'blur(8px)' }}
              title="负载：探照灯（左侧面板）"
            >
              <Sun size={16} className="text-primary" />
            </button>
            <button
              onClick={() => { setLeftCollapsed(false); setLeftTab('payload'); setActivePayloadPanel('strobe'); }}
              className="w-9 h-9 rounded flex items-center justify-center transition-all"
              style={{ background: 'rgba(8,13,24,0.85)', border: '1px solid rgba(30,58,138,0.5)', backdropFilter: 'blur(8px)' }}
              title="负载：红蓝警示灯（左侧面板）"
            >
              <Siren size={16} className="text-primary" />
            </button>
          </div>

          {/* AI Algorithm Selector Popover */}
          {showAlgo && (
            <div className="absolute top-14 right-4 z-30 w-52 rounded overflow-hidden" style={{ background: 'rgba(8,13,24,0.96)', border: '1px solid rgba(0,229,255,0.4)', backdropFilter: 'blur(12px)', boxShadow: '0 0 20px rgba(0,229,255,0.1)' }}>
              <div className="px-3 py-2 border-b flex items-center gap-2" style={{ borderColor: 'rgba(30,58,138,0.5)' }}>
                <Bot size={13} className="text-primary" />
                <span className="text-xs font-bold text-primary">AI 算法选择</span>
                <button onClick={() => setShowAlgo(false)} className="ml-auto text-muted-foreground hover:text-foreground text-xs">✕</button>
              </div>
              <div className="p-2 space-y-1">
                <div className="text-[10px] text-muted-foreground px-1">工作流</div>
                {workflows.map(w => (
                  <div key={w.id} onClick={() => toggleWorkflow(w.id)} className="flex items-center justify-between px-3 py-2 rounded cursor-pointer transition-all" style={{ background: w.active ? 'rgba(0,229,255,0.06)' : 'rgba(15,23,42,0.4)', border: `1px solid ${w.active ? 'rgba(0,229,255,0.2)' : 'transparent'}` }}>
                    <span className="text-[11px] text-foreground">{w.name}</span>
                    {w.active && <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgb(0,229,255)' }}><div className="w-2 h-1 border-b-2 border-l-2 -rotate-45 -mt-0.5" style={{ borderColor: 'rgb(9,14,23)' }}></div></div>}
                  </div>
                ))}
                <div className="text-[10px] text-muted-foreground px-1 mt-2">算法</div>
                {algorithms.map(algo => (
                  <div key={algo.id} onClick={() => toggleAlgo(algo.id)} className="flex items-center justify-between px-3 py-2.5 rounded cursor-pointer transition-all" style={{ background: algo.active ? 'rgba(0,229,255,0.06)' : 'rgba(15,23,42,0.4)', border: `1px solid ${algo.active ? 'rgba(0,229,255,0.2)' : 'transparent'}` }}>
                    <span className="flex items-center gap-2 text-sm text-foreground">
                      <span>{algo.icon}</span> {algo.name}
                    </span>
                    {algo.active && <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgb(0,229,255)' }}><div className="w-2 h-1 border-b-2 border-l-2 -rotate-45 -mt-0.5" style={{ borderColor: 'rgb(9,14,23)' }}></div></div>}
                  </div>
                ))}
              </div>
              <div className="p-2 border-t" style={{ borderColor: 'rgba(30,58,138,0.4)' }}>
                <button
                  className="w-full py-2 rounded text-xs font-bold transition-all hover:opacity-95"
                  style={{ background: 'rgba(0,229,255,1)', color: 'rgb(9,14,23)' }}
                  onClick={() => setShowAlgo(false)}
                >
                  确认生效（工作流 {activeWorkflowCount} / 算法 {activeAlgoCount}）
                </button>
              </div>
            </div>
          )}

          {/* Right toolbar (拍摄模式 / 拍摄 / 红外 / AI / 缩放) */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
            {/* 拍摄模式切换 */}
            <button
              onClick={() => setCaptureMode(captureMode === 'photo' ? 'video' : 'photo')}
              className="w-9 h-9 rounded flex items-center justify-center transition-all relative"
              style={{ background: 'rgba(8,13,24,0.85)', border: '1px solid rgba(30,58,138,0.5)', backdropFilter: 'blur(8px)' }}
              title={`拍摄模式：${captureMode === 'photo' ? '拍照' : '录像'}`}
            >
              {captureMode === 'photo' ? <Camera size={16} className="text-primary" /> : <Video size={16} className="text-destructive" />}
            </button>
            {/* 拍摄触发 */}
            <button
              className="w-9 h-9 rounded flex items-center justify-center transition-all"
              style={{ background: captureMode === 'video' ? 'rgba(239,68,68,0.15)' : 'rgba(0,229,255,0.15)', border: `1px solid ${captureMode === 'video' ? 'rgba(239,68,68,0.6)' : 'rgba(0,229,255,0.6)'}`, backdropFilter: 'blur(8px)' }}
              onClick={() => {
                if (captureMode === 'video') {
                  setIsRecording((v) => !v);
                } else {
                  console.log('CAPTURE_PHOTO');
                }
              }}
              title={captureMode === 'video' ? (isRecording ? '停止录像' : '开始录像') : '拍照'}
            >
              <div
                className="rounded-full"
                style={{
                  width: 14,
                  height: 14,
                  background: captureMode === 'video' ? 'rgb(239,68,68)' : 'rgb(0,229,255)',
                  boxShadow: captureMode === 'video' && isRecording ? '0 0 8px rgba(239,68,68,0.9)' : 'none',
                }}
              ></div>
            </button>
            {/* 红外色带切换：点击弹出彩虹/铁红/黑热/白热 */}
            <div className="relative">
              <button
                className="w-9 h-9 rounded flex items-center justify-center transition-all relative"
                style={{ background: showIrPalettePopover ? 'rgba(0,229,255,0.2)' : 'rgba(8,13,24,0.85)', border: `1px solid ${showIrPalettePopover ? 'rgba(0,229,255,0.6)' : 'rgba(30,58,138,0.5)'}`, backdropFilter: 'blur(8px)' }}
                onClick={() => setShowIrPalettePopover((v) => !v)}
                title={`红外色带：${irPalette}`}
              >
                <Sun size={16} className="text-amber-400" />
                <span className="absolute -bottom-3 text-[9px] text-muted-foreground">{irPalette}</span>
              </button>
              {showIrPalettePopover && (
                <div
                  className="absolute right-0 top-full mt-1 z-50 py-2 px-2 rounded border shadow-lg min-w-[100px]"
                  style={{ background: 'rgba(15,23,42,0.98)', borderColor: 'rgba(30,58,138,0.6)' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-[10px] text-muted-foreground mb-1.5 px-1">色带</div>
                  {(['彩虹', '铁红', '黑热', '白热'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      className="w-full py-1.5 px-2 rounded text-left text-[11px] transition-all"
                      style={{
                        background: irPalette === mode ? 'rgba(0,229,255,0.15)' : 'transparent',
                        color: irPalette === mode ? 'rgb(0,229,255)' : 'rgb(203,213,225)',
                      }}
                      onClick={() => { setIrPalette(mode); setShowIrPalettePopover(false); }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* 全景拍照 */}
            <button
              className="w-9 h-9 rounded flex items-center justify-center transition-all"
              style={{ background: 'rgba(8,13,24,0.85)', border: '1px solid rgba(30,58,138,0.5)', backdropFilter: 'blur(8px)' }}
              title="全景拍照"
            >
              <LayoutGrid size={16} className="text-primary" />
            </button>
            {/* AI 算法 */}
            <button onClick={() => setShowAlgo(!showAlgo)} className="w-9 h-9 rounded flex items-center justify-center transition-all relative" style={{ background: showAlgo ? 'rgba(0,229,255,0.2)' : 'rgba(8,13,24,0.85)', border: `1px solid ${showAlgo ? 'rgba(0,229,255,0.6)' : 'rgba(30,58,138,0.5)'}`, backdropFilter: 'blur(8px)' }} title="AI算法">
              <Bot size={16} className="text-primary" />
              {activeAlgoCount > 0 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[8px] font-bold flex items-center justify-center" style={{ background: 'rgb(0,229,255)', color: 'rgb(9,14,23)' }}>{activeAlgoCount}</span>}
            </button>
            {/* 变焦 - 放大/缩小/全屏 */}
            <button className="w-9 h-9 rounded flex items-center justify-center transition-all" style={{ background: 'rgba(8,13,24,0.85)', border: '1px solid rgba(30,58,138,0.5)', backdropFilter: 'blur(8px)' }} title="放大">
              <ZoomIn size={16} className="text-primary" />
            </button>
            <button className="w-9 h-9 rounded flex items-center justify-center transition-all" style={{ background: 'rgba(8,13,24,0.85)', border: '1px solid rgba(30,58,138,0.5)', backdropFilter: 'blur(8px)' }} title="缩小">
              <ZoomOut size={16} className="text-foreground" />
            </button>
            <button className="w-9 h-9 rounded flex items-center justify-center transition-all" style={{ background: 'rgba(8,13,24,0.85)', border: '1px solid rgba(30,58,138,0.5)', backdropFilter: 'blur(8px)' }} title="全屏">
              <Maximize size={16} className="text-foreground" />
            </button>
          </div>

          {/* Point-to-fly hint */}
          <div className="absolute inset-0 cursor-crosshair group z-5 flex items-end justify-center pb-32 pointer-events-none">
          </div>
          {/* Bottom HUD: Flight data (inside video area) */}
          <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1" style={{ backdropFilter: 'blur(8px)' }}>
            <div className="px-3 py-1.5 rounded text-[10px] font-mono flex gap-4" style={{ background: 'rgba(8,13,24,0.85)', border: '1px solid rgba(30,58,138,0.5)' }}>
              <span style={{ color: 'rgb(0,229,255)' }}>H: 120m</span>
              <span style={{ color: 'rgb(0,229,255)' }}>V: 12.5m/s</span>
              <span style={{ color: 'rgb(0,229,255)' }}>P: 5°  R: -2°  Y: 45°</span>
            </div>
          </div>
          {/* Emergency takeover toggle (mock) - inside video area */}
          <div className="absolute top-14 left-4 z-30 rounded overflow-hidden" style={{ background: 'rgba(8,13,24,0.85)', border: '1px solid rgba(30,58,138,0.6)', backdropFilter: 'blur(8px)' }}>
            <button
              className="px-3 py-2 text-[11px] font-bold flex items-center gap-2"
              style={{ color: emergencyOverride ? 'rgb(239,68,68)' : 'rgb(148,163,184)' }}
              onClick={() => setEmergencyOverride((v) => !v)}
              title="模拟：指挥员强制接管"
            >
              <AlertTriangle size={14} />
              {emergencyOverride ? '应急接管：开启' : '应急接管：关闭'}
            </button>
          </div>
          </div>
          {/* 直播画面下方：飞行轨迹、手动控制、避障镜头 + 异常预警滚动 */}
          <div className="flex-shrink-0 flex flex-col border-t min-h-0" style={{ background: 'rgba(8,13,24,0.98)', borderColor: 'rgba(30,58,138,0.4)' }}>
          <div className="flex items-stretch justify-between gap-4 px-3 py-3">
          {/* 手动控制：罗盘 + 键盘 + 飞行设置/返航/急停，未接管时置灰禁用 */}
          <div
            className="order-2 flex-shrink-0 z-30 flex items-center gap-4 px-4 py-2 rounded-lg border transition-all"
            style={{
              background: 'rgba(8,13,24,0.92)',
              borderColor: manualTakeover ? 'rgba(0,229,255,0.5)' : 'rgba(30,58,138,0.5)',
              opacity: manualTakeover ? 1 : 0.65,
              pointerEvents: manualTakeover ? 'auto' : 'none',
              minHeight: 140,
            }}
          >
            {/* 罗盘与飞行数据 */}
            <div className="flex items-center gap-3 whitespace-nowrap">
              <div className="flex flex-col items-center gap-0.5">
                <div className="text-[10px] font-mono" style={{ color: manualTakeover ? 'rgb(34,197,94)' : 'rgb(100,116,139)' }}>131°</div>
                <div
                  className="relative rounded-full flex items-center justify-center"
                  style={{ width: 88, height: 88, background: 'rgba(30,41,59,0.9)', border: '1px solid rgba(71,85,105,0.8)' }}
                >
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                    <span
                      key={deg}
                      className="absolute text-[9px] font-medium"
                      style={{
                        color: 'rgb(203,213,225)',
                        transform: `rotate(${deg}deg) translateY(-36px)`,
                      }}
                    >
                      {deg === 0 ? 'N' : deg === 90 ? 'E' : deg === 180 ? 'S' : deg === 270 ? 'W' : deg}
                    </span>
                  ))}
                  <div
                    className="absolute w-0 h-0 border-l-[6px] border-r-[6px] border-b-[14px] border-l-transparent border-r-transparent border-b-[rgb(0,229,255)]"
                    style={{ transform: 'rotate(-131deg)' }}
                  />
                </div>
                <div className="flex gap-2 mt-1 text-[9px]">
                  <span style={{ color: manualTakeover ? 'rgb(34,197,94)' : 'rgb(100,116,139)' }}>-40°</span>
                  <span style={{ color: 'rgb(148,163,184)' }}>↔ 2.6 m/s</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5 text-[10px]">
                <div className="font-mono" style={{ color: manualTakeover ? 'rgb(34,197,94)' : 'rgb(100,116,139)' }}>SPD 0 m/s</div>
                <div className="text-white/80">0 VS</div>
                <div className="font-mono text-sm font-bold" style={{ color: manualTakeover ? 'rgb(34,197,94)' : 'rgb(100,116,139)' }}>47.8 ALT m</div>
                <div className="text-white/70 text-[9px]">77.8 ASL</div>
                <div className="text-white/70 text-[9px]">57.9 AGL</div>
                <div className="flex items-center gap-1 text-white/80 mt-0.5">
                  <Home size={10} /> 45 m
                </div>
              </div>
            </div>

            {/* 键盘 */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex gap-1">
                <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] bg-[rgba(51,65,85,0.9)] border border-[rgba(71,85,105,0.6)] text-white/90">W</div>
                <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] bg-[rgba(51,65,85,0.9)] border border-[rgba(71,85,105,0.6)] text-white/90">C</div>
              </div>
              <div className="flex gap-1">
                {['A', 'S', 'D', 'Z'].map((k) => (
                  <button key={k} type="button" disabled={!manualTakeover} className="w-8 h-8 rounded flex items-center justify-center text-xs font-medium bg-[rgba(51,65,85,0.9)] border border-[rgba(71,85,105,0.6)] text-white hover:bg-[rgba(71,85,105,0.9)] disabled:opacity-60 whitespace-nowrap" style={{ color: manualTakeover ? 'rgb(226,232,240)' : 'rgb(100,116,139)' }}>{k}</button>
                ))}
              </div>
              <div className="flex gap-0.5 items-center">
                <button type="button" disabled={!manualTakeover} className="w-7 h-7 rounded flex items-center justify-center bg-[rgba(51,65,85,0.9)] border border-[rgba(71,85,105,0.6)] text-white/90 disabled:opacity-60"><ArrowLeft size={12} /></button>
                <div className="flex flex-col gap-0.5">
                  <button type="button" disabled={!manualTakeover} className="w-7 h-6 rounded flex items-center justify-center bg-[rgba(51,65,85,0.9)] border border-[rgba(71,85,105,0.6)] text-white/90 disabled:opacity-60"><ArrowUp size={12} /></button>
                  <button type="button" disabled={!manualTakeover} className="w-7 h-6 rounded flex items-center justify-center bg-[rgba(51,65,85,0.9)] border border-[rgba(71,85,105,0.6)] text-white/90 disabled:opacity-60"><ArrowDown size={12} /></button>
                </div>
                <button type="button" disabled={!manualTakeover} className="w-7 h-7 rounded flex items-center justify-center bg-[rgba(51,65,85,0.9)] border border-[rgba(71,85,105,0.6)] text-white/90 disabled:opacity-60"><ArrowRight size={12} /></button>
              </div>
              <button type="button" disabled={!manualTakeover} className="w-full mt-1.5 py-1.5 rounded text-[10px] font-bold text-white disabled:opacity-60 whitespace-nowrap" style={{ background: manualTakeover ? 'rgba(0,150,255,0.9)' : 'rgba(71,85,105,0.8)' }}>高速</button>
            </div>

            {/* 飞行设置 / 返航 / 紧急降落 / 急停 */}
            <div className="flex flex-col gap-1.5">
              <button type="button" disabled={!manualTakeover} className="px-4 py-2 rounded text-[11px] font-medium bg-[rgba(51,65,85,0.9)] border border-[rgba(71,85,105,0.6)] text-white disabled:opacity-60 whitespace-nowrap" style={{ color: manualTakeover ? 'rgb(226,232,240)' : 'rgb(100,116,139)' }}>飞行设置</button>
              <button type="button" disabled={!manualTakeover} className="px-4 py-2 rounded text-[11px] font-medium bg-[rgba(51,65,85,0.9)] border border-[rgba(71,85,105,0.6)] text-white disabled:opacity-60 whitespace-nowrap" style={{ color: manualTakeover ? 'rgb(226,232,240)' : 'rgb(100,116,139)' }}>返航</button>
              <button type="button" disabled={!manualTakeover} className="px-4 py-2 rounded text-[11px] font-medium bg-[rgba(51,65,85,0.9)] border border-[rgba(71,85,105,0.6)] text-white disabled:opacity-60 whitespace-nowrap" style={{ color: manualTakeover ? 'rgb(226,232,240)' : 'rgb(100,116,139)' }}>紧急降落</button>
              <button type="button" disabled={!manualTakeover} className="px-4 py-2.5 rounded text-[11px] font-bold bg-destructive text-white border border-destructive/80 disabled:opacity-60 flex items-center gap-1 whitespace-nowrap">
                急停 <span className="text-[9px] opacity-80">Space</span>
              </button>
            </div>
          </div>
          {!manualTakeover && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-29 pointer-events-none text-[10px] text-muted-foreground whitespace-nowrap">
              请先点击顶部「接管」后，手动操控按钮才会激活
            </div>
          )}

          {/* 避障镜头：与飞行轨迹尺寸一致（w-48 + 内容区 h-28） */}
          <div className="order-3 flex-shrink-0 w-48 rounded overflow-hidden" style={{ background: 'rgba(8,13,24,0.92)', border: '1px solid rgba(30,58,138,0.6)', backdropFilter: 'blur(8px)' }}>
            <div className="flex items-center gap-1 px-2 py-1 border-b" style={{ borderColor: 'rgba(30,58,138,0.4)' }}>
              <Eye size={10} className="text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">避障镜头</span>
            </div>
            <div className="p-2 space-y-1.5">
              <div className="relative h-28 rounded overflow-hidden bg-black/80" style={{ border: '1px solid rgba(30,58,138,0.4)' }}>
                <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1473220464492-452bbe0fcddf?w=400&q=60")', filter: 'grayscale(1)' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[9px] text-muted-foreground">前向</span>
                </div>
              </div>
              <div className="flex gap-0.5">
                {['前向', '下向', '全景'].map((label, i) => (
                  <button key={label} type="button" className="flex-1 py-0.5 text-[9px] rounded transition-all" style={{ background: i === 0 ? 'rgba(0,229,255,0.15)' : 'rgba(30,41,59,0.6)', border: `1px solid ${i === 0 ? 'rgba(0,229,255,0.4)' : 'rgba(30,58,138,0.4)'}`, color: i === 0 ? 'rgb(0,229,255)' : 'rgb(148,163,184)' }}>{label}</button>
                ))}
              </div>
            </div>
          </div>

          {/* 飞行轨迹：支持全屏/还原 */}
          <div
            className="order-1 flex-shrink-0 w-48 rounded overflow-hidden"
            style={{ background: 'rgba(8,13,24,0.88)', border: '1px solid rgba(30,58,138,0.6)', backdropFilter: 'blur(8px)' }}
            onContextMenu={(e) => {
              e.preventDefault();
              setTrajectoryMenu({ x: e.clientX, y: e.clientY });
            }}
          >
            <div className="flex items-center justify-between px-2 py-1 border-b gap-1" style={{ borderColor: 'rgba(30,58,138,0.4)' }}>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Navigation size={9} /> 飞行轨迹</span>
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] text-muted-foreground">SCALE 1:500</span>
                <button type="button" className="p-0.5 rounded hover:bg-primary/20 text-muted-foreground hover:text-primary" onClick={() => setTrajectoryFullscreen(true)} title="全屏" aria-label="全屏"><Maximize size={12} /></button>
              </div>
            </div>
            <div className="relative h-28 bg-black/50">
              <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(30,58,138,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(30,58,138,0.12) 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
              <svg className="absolute inset-0 w-full h-full">
                <path d={currentMission.miniPath} stroke="rgba(0,229,255,0.7)" strokeWidth="1.5" fill="none" strokeDasharray="4,3" />
                <circle cx="20" cy="90" r="4" fill="rgb(34,197,94)" />
                <circle cx="100" cy="80" r="3" fill="rgb(0,229,255)" />
                <circle cx="170" cy="30" r="3" fill="rgba(100,116,139,0.8)" />
              </svg>
              <div className="absolute" style={{ left: '52%', top: '40%', transform: 'translate(-50%, -50%)' }}>
                <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,229,255,0.2)', border: '1px solid rgba(0,229,255,0.8)' }}>
                  <Navigation size={8} className="text-primary" />
                </div>
              </div>
            </div>
          </div>
          </div>
          </div>

          {/* 飞行轨迹全屏层 */}
          {trajectoryFullscreen && (
            <div
              className="fixed inset-0 z-[100] flex flex-col"
              style={{ background: 'rgba(8,13,24,0.98)', backdropFilter: 'blur(8px)' }}
              onContextMenu={(e) => { e.preventDefault(); setTrajectoryMenu({ x: e.clientX, y: e.clientY }); }}
            >
              <div className="flex items-center justify-between px-4 py-2 border-b flex-shrink-0" style={{ borderColor: 'rgba(30,58,138,0.5)' }}>
                <span className="text-sm font-bold text-primary flex items-center gap-2"><Navigation size={18} /> 飞行轨迹（全屏）</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">SCALE 1:500</span>
                  <button type="button" className="px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-all hover:bg-primary/20" style={{ background: 'rgba(0,229,255,0.15)', color: 'rgb(0,229,255)', border: '1px solid rgba(0,229,255,0.5)' }} onClick={() => setTrajectoryFullscreen(false)} title="还原">
                    <Minimize2 size={14} /> 还原
                  </button>
                </div>
              </div>
              <div className="flex-1 min-h-0 p-4 flex items-center justify-center">
                <div className="w-full h-full max-w-4xl max-h-[80vh] rounded overflow-hidden" style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(30,58,138,0.6)' }}>
                  <div className="relative w-full h-full min-h-[320px]" style={{ backgroundImage: 'linear-gradient(rgba(30,58,138,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(30,58,138,0.12) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 192 112" preserveAspectRatio="xMidYMid meet">
                      <path d={currentMission.miniPath} stroke="rgba(0,229,255,0.7)" strokeWidth="1.5" fill="none" strokeDasharray="4,3" />
                      <circle cx="20" cy="90" r="4" fill="rgb(34,197,94)" />
                      <circle cx="100" cy="80" r="3" fill="rgb(0,229,255)" />
                      <circle cx="170" cy="30" r="3" fill="rgba(100,116,139,0.8)" />
                    </svg>
                    <div className="absolute" style={{ left: '52%', top: '40%', transform: 'translate(-50%, -50%)' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,229,255,0.2)', border: '2px solid rgba(0,229,255,0.8)' }}>
                        <Navigation size={18} className="text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 飞行轨迹右键菜单：一键直飞 */}
          {trajectoryMenu && (
            <div
              className="fixed z-50 rounded py-1 min-w-[120px] shadow-lg"
              style={{
                left: trajectoryMenu.x,
                top: trajectoryMenu.y,
                background: 'rgba(15,23,42,0.98)',
                border: '1px solid rgba(30,58,138,0.6)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-[11px] flex items-center gap-2 hover:bg-primary/20 transition-colors"
                style={{ color: 'rgb(0,229,255)' }}
                onClick={() => {
                  setTrajectoryMenu(null);
                  // 一键直飞：可在此接入实际飞控指令
                  console.info('一键直飞');
                }}
              >
                <MoveUpRight size={12} /> 一键直飞
              </button>
            </div>
          )}
        </div>

        {/* ===== RIGHT PANEL: Device Status ===== */}
        <div
          className="flex-shrink-0 flex flex-col overflow-y-auto"
          style={{ background: 'rgba(8,13,24,0.95)', borderLeft: '1px solid rgba(30,58,138,0.5)', width: rightCollapsed ? 56 : 240 }}
        >
          {/* Tabs: 设备状态 / AI识别（带图标；折叠时仅竖向图标） */}
          <div className="p-2 border-b flex items-center justify-between gap-1" style={{ borderColor: 'rgba(30,58,138,0.4)' }}>
            {rightCollapsed ? (
              <div className="flex flex-col items-center gap-1 w-full">
                <button
                  className="w-8 h-8 rounded flex items-center justify-center"
                  style={{ background: rightTab === 'device' ? 'rgba(0,229,255,0.18)' : 'rgba(15,23,42,0.5)', border: '1px solid rgba(30,58,138,0.45)' }}
                  onClick={() => setRightTab('device')}
                  title="设备状态"
                >
                  <Radio size={16} className={rightTab === 'device' ? 'text-primary' : 'text-muted-foreground'} />
                </button>
                <button
                  className="w-8 h-8 rounded flex items-center justify-center"
                  style={{ background: rightTab === 'ai' ? 'rgba(0,229,255,0.18)' : 'rgba(15,23,42,0.5)', border: '1px solid rgba(30,58,138,0.45)' }}
                  onClick={() => setRightTab('ai')}
                  title="AI识别"
                >
                  <Eye size={16} className={rightTab === 'ai' ? 'text-primary' : 'text-muted-foreground'} />
                </button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:text-foreground" onClick={() => setRightCollapsed((v) => !v)} title="展开右侧面板">▶</button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1 flex-1">
                  <button
                    className="flex-1 py-2 rounded text-[10px] font-bold transition-all flex items-center justify-center gap-1.5"
                    style={{
                      background: rightTab === 'device' ? 'rgba(0,229,255,0.15)' : 'rgba(15,23,42,0.5)',
                      border: '1px solid rgba(30,58,138,0.45)',
                      color: rightTab === 'device' ? 'rgb(0,229,255)' : 'rgb(148,163,184)',
                    }}
                    onClick={() => setRightTab('device')}
                  >
                    <Radio size={14} /> 设备状态
                  </button>
                  <button
                    className="flex-1 py-2 rounded text-[10px] font-bold transition-all flex items-center justify-center gap-1.5"
                    style={{
                      background: rightTab === 'ai' ? 'rgba(0,229,255,0.15)' : 'rgba(15,23,42,0.5)',
                      border: '1px solid rgba(30,58,138,0.45)',
                      color: rightTab === 'ai' ? 'rgb(0,229,255)' : 'rgb(148,163,184)',
                    }}
                    onClick={() => setRightTab('ai')}
                  >
                    <Eye size={14} /> AI识别（{aiEvents.length}）
                  </button>
                </div>
                <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => setRightCollapsed((v) => !v)} title="收起右侧面板">◀</button>
              </>
            )}
          </div>

          {!rightCollapsed && (
          <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
            <div className="w-full flex-1 overflow-y-auto">
          {rightTab === 'device' ? (
            <>
              {/* Device Status (Dock) */}
              <div className="p-3 border-b" style={{ borderColor: 'rgba(30,58,138,0.4)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[11px] font-bold text-foreground flex items-center gap-2">
                    <Activity size={14} className="text-primary" /> 设备状态
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1" style={{ color: 'rgb(34,197,94)', border: '1px solid rgba(34,197,94,0.35)', background: 'rgba(34,197,94,0.10)' }}>
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'rgb(34,197,94)' }}></span> Online
                  </span>
                </div>

                <div className="rounded overflow-hidden" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(30,58,138,0.4)' }}>
                  <div className="h-24 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=60")', filter: 'grayscale(0.35)' }}></div>
                  <div className="px-2 py-2">
                    <p className="text-xs font-semibold text-foreground">DJI Dock 3 (A区)</p>
                    <p className="text-[10px] text-muted-foreground font-mono">SN: 34KDI9923LA</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2 text-[10px]">
                  {[
                    { icon: Radio, label: '舱盖状态', value: '关闭', tone: 'rgb(34,197,94)' },
                    { icon: Activity, label: '飞机在仓', value: '是', tone: 'rgb(0,229,255)' },
                    { icon: Navigation, label: '风速', value: '0.8m/s', tone: 'rgb(148,163,184)' },
                    { icon: Wifi, label: '网络速率', value: '336kb', tone: 'rgb(148,163,184)' },
                    { icon: Layers, label: '存储剩余', value: '38%', tone: 'rgb(148,163,184)' },
                    { icon: Activity, label: '舱内温度', value: '15.5°C', tone: 'rgb(148,163,184)' },
                    { icon: Activity, label: '舱内湿度', value: '42%', tone: 'rgb(148,163,184)' },
                    { icon: Activity, label: '机场状态', value: '作业中', tone: 'rgb(0,229,255)' },
                  ].map((it, i) => (
                    <div key={i} className="rounded p-2 flex items-start gap-2" style={{ background: 'rgba(15,23,42,0.55)', border: '1px solid rgba(30,58,138,0.35)' }}>
                      <it.icon size={14} className="text-primary flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="text-muted-foreground">{it.label}</div>
                        <div className="font-mono truncate" style={{ color: it.tone }}>{it.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aircraft Status */}
              <div className="p-3 border-b" style={{ borderColor: 'rgba(30,58,138,0.4)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[11px] font-bold text-foreground flex items-center gap-2">
                    <Navigation size={14} className="text-primary" /> 飞行器状态
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{ background: 'rgba(0,229,255,0.15)', color: 'rgb(0,229,255)', border: '1px solid rgba(0,229,255,0.3)' }}>飞行中</span>
                </div>

                <div className="rounded overflow-hidden" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(30,58,138,0.4)' }}>
                  <div className="h-24 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1473220464492-452bbe0fcddf?w=700&q=60")', filter: 'grayscale(0.25)' }}></div>
                  <div className="px-2 py-2">
                    <p className="text-xs font-semibold text-foreground">DJI M30T</p>
                    <p className="text-[10px] text-muted-foreground font-mono">SN: M30T-00A1B2</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2 text-[10px]">
                  {[
                    { icon: MapPin, label: '经度', value: '112.154894°' },
                    { icon: MapPin, label: '纬度', value: '37.987457°' },
                    { icon: Activity, label: '垂直速度', value: '3m/s' },
                    { icon: Activity, label: '水平速度', value: '2m/s' },
                    { icon: Battery, label: '电池电量', value: '90%' },
                    { icon: Satellite, label: 'GPS状态', value: 'RTK固定解' },
                    { icon: Navigation, label: '风速', value: '0.00m/s' },
                    { icon: ArrowUp, label: '高度', value: '相对起飞点 120m' },
                  ].map((it, i) => (
                    <div key={i} className="rounded p-2 flex items-start gap-2" style={{ background: 'rgba(15,23,42,0.55)', border: '1px solid rgba(30,58,138,0.35)' }}>
                      <it.icon size={14} className="text-primary flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="text-muted-foreground">{it.label}</div>
                        <div className="font-mono text-foreground truncate">{it.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-3">
              <div className="text-[10px] text-muted-foreground mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Bot size={10} /> AI识别结果
                </span>
                <span className="text-[10px] text-muted-foreground">滚动更新</span>
              </div>
              <div className="space-y-2 max-h-[calc(100vh-160px)] overflow-auto pr-1">
                {aiEvents.map((ev) => {
                  const tone = ev.color === 'danger' ? 'rgb(239,68,68)' : ev.color === 'warning' ? 'rgb(234,179,8)' : 'rgb(0,229,255)';
                  return (
                    <button
                      key={ev.id}
                      onClick={() => setSelectedEventId(ev.id)}
                      className="w-full text-left flex gap-2 p-2 rounded border transition-all hover:opacity-95"
                      style={{ background: 'rgba(15,23,42,0.6)', borderColor: 'rgba(30,58,138,0.45)' }}
                      title="点击联动定位与大图预览（模拟）"
                    >
                      <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(30,58,138,0.35)' }}>
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${ev.thumb}')`, filter: 'grayscale(0.2)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-white truncate">
                          {ev.time} | <span style={{ color: tone }}>{ev.type}</span> | 置信度 {ev.confidence}%
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">点击告警 → 地图定位 & 图传高亮（模拟）</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Transfer Control Modal */}
      <TransferControlModal isOpen={showTransfer} onClose={() => setShowTransfer(false)} />

      {/* Selected AI event preview (mock) */}
      {selectedEventId && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}>
          <div className="w-[720px] max-w-[92vw] rounded overflow-hidden tech-border" style={{ background: 'rgba(10,18,35,0.98)', border: '1px solid rgba(0,229,255,0.2)' }}>
            <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: 'rgba(30,58,138,0.4)' }}>
              <div className="text-sm font-bold text-primary">AI事件预览</div>
              <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => setSelectedEventId(null)}>关闭</button>
            </div>
            <div className="p-4">
              {(() => {
                const ev = aiEvents.find((e) => e.id === selectedEventId);
                if (!ev) return <div className="text-sm text-muted-foreground">事件不存在</div>;
                return (
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-8">
                      <div className="aspect-video rounded overflow-hidden" style={{ border: '1px solid rgba(30,58,138,0.4)' }}>
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${ev.thumb}')` }} />
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-4 text-xs text-muted-foreground space-y-2">
                      <div>
                        <div className="text-white font-bold">{ev.type}</div>
                        <div>{ev.time} | 置信度 {ev.confidence}%</div>
                      </div>
                      <div className="p-3 rounded" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(30,58,138,0.4)' }}>
                        <div className="text-[11px] text-muted-foreground mb-1">联动说明（模拟）</div>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>点击告警 → 地图缩放至目标位置</li>
                          <li>图传画面高亮目标框</li>
                          <li>支持下载截图（后续对接）</li>
                        </ul>
                      </div>
                      <button className="w-full py-2 rounded text-xs font-bold" style={{ background: 'rgba(0,229,255,1)', color: 'rgb(9,14,23)' }}>
                        下载截图
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}