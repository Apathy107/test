import React from 'react';
import TechCard from '../ui-custom/TechCard';
import { Map } from 'lucide-react';

interface ResourceHeatmapProps {
  mode?: 'fault' | 'task' | 'device';
}

type HeatCell = {
  id: string;
  x: number;
  y: number;
  label: string;
  value: number;
  detail: string;
  status?: 'online' | 'offline' | 'task';
};

const faultCells: HeatCell[] = [
  { id: 'f1', x: 20, y: 25, label: '高新区派出所', value: 12, detail: 'M300-RTK 高频故障集中' },
  { id: 'f2', x: 60, y: 40, label: '交管中队', value: 8, detail: 'Mavic 3E 通信故障' },
  { id: 'f3', x: 40, y: 65, label: '东城大队', value: 5, detail: '固定翼 VTOL 动力故障' },
  { id: 'f4', x: 75, y: 20, label: '龙岗支队', value: 3, detail: '农业植保机告警' },
  { id: 'f5', x: 30, y: 50, label: '南山中队', value: 2, detail: '消费级设备异常' },
];

const taskCells: HeatCell[] = [
  { id: 't1', x: 25, y: 30, label: '中心商务区', value: 42, detail: '月均 42 次任务密集' },
  { id: 't2', x: 65, y: 45, label: '交通枢纽', value: 36, detail: '月均 36 次交通执法' },
  { id: 't3', x: 45, y: 70, label: '工业园区', value: 28, detail: '月均 28 次设施巡检' },
  { id: 't4', x: 80, y: 25, label: '生态保护区', value: 15, detail: '月均 15 次环境监测' },
  { id: 't5', x: 15, y: 60, label: '居民区', value: 10, detail: '月均 10 次应急响应' },
];

const deviceStatusCells: HeatCell[] = [
  { id: 'd1', x: 20, y: 25, label: 'D041', value: 1, detail: 'M300-RTK · 在线', status: 'online' },
  { id: 'd2', x: 55, y: 35, label: 'D042', value: 1, detail: 'Mavic 3E · 任务中', status: 'task' },
  { id: 'd3', x: 40, y: 60, label: 'F09', value: 1, detail: '固定翼 · 离线', status: 'offline' },
  { id: 'd4', x: 70, y: 55, label: 'D001', value: 1, detail: '机库 A1 · 在线', status: 'online' },
  { id: 'd5', x: 30, y: 75, label: 'D112', value: 1, detail: 'Mini 3 · 任务中', status: 'task' },
  { id: 'd6', x: 80, y: 20, label: 'D113', value: 1, detail: 'Mavic 3 · 在线', status: 'online' },
];

const getHeatStyle = (value: number, max: number) => {
  const ratio = value / max;
  if (ratio >= 0.8) return { bg: 'rgba(239,68,68,0.8)', border: 'rgb(239,68,68)', size: 32 };
  if (ratio >= 0.5) return { bg: 'rgba(245,158,11,0.7)', border: 'rgb(245,158,11)', size: 26 };
  if (ratio >= 0.3) return { bg: 'rgba(0,213,255,0.6)', border: 'rgb(0,213,255)', size: 22 };
  return { bg: 'rgba(16,185,129,0.5)', border: 'rgb(16,185,129)', size: 18 };
};

const getDeviceStyle = (status?: string) => {
  if (status === 'online') return { bg: 'rgba(16,185,129,0.7)', border: 'rgb(16,185,129)' };
  if (status === 'task') return { bg: 'rgba(0,213,255,0.7)', border: 'rgb(0,213,255)' };
  return { bg: 'rgba(148,163,184,0.5)', border: 'rgb(148,163,184)' };
};

const titles: Record<string, string> = {
  fault: '故障热力图（设备位置分布）',
  task: '任务密度热力图（密集区域）',
  device: '设备状态分布图',
};

const ResourceHeatmap: React.FC<ResourceHeatmapProps> = ({ mode = 'task' }) => {
  const cells = mode === 'fault' ? faultCells : mode === 'device' ? deviceStatusCells : taskCells;
  const maxVal = Math.max(...cells.map((c) => c.value));

  console.log('ResourceHeatmap rendered, mode:', mode);

  return (
    <TechCard title={titles[mode]} icon={Map}>
      {/* Map Simulation */}
      <div className="relative rounded overflow-hidden" style={{ height: '280px', background: 'rgba(5,11,20,0.8)', border: '1px solid rgba(0,213,255,0.1)' }}>
        {/* Grid background */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0,213,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,213,255,0.04) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />

        {/* Axis lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-px" style={{ background: 'rgba(0,213,255,0.08)' }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-full w-px" style={{ background: 'rgba(0,213,255,0.08)' }} />
        </div>

        {/* Map label */}
        <div className="absolute top-2 left-2 text-[10px] text-muted-foreground opacity-60 tracking-widest">MAP VIEW · SIMULATED</div>

        {/* Heat Points */}
        {cells.map((cell) => {
          const style = mode === 'device' ? getDeviceStyle(cell.status) : getHeatStyle(cell.value, maxVal);
          const size = mode === 'device' ? 16 : (style as any).size;
          return (
            <div
              key={cell.id}
              className="absolute group cursor-pointer"
              style={{ left: `${cell.x}%`, top: `${cell.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              {/* Pulse ring */}
              <div className="absolute rounded-full animate-ping" style={{ width: size + 8, height: size + 8, top: -(size + 8) / 2 + size / 2, left: -(size + 8) / 2 + size / 2, background: style.bg, opacity: 0.3 }} />
              {/* Main dot */}
              <div className="relative rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ width: size, height: size, background: style.bg, border: `1.5px solid ${style.border}`, boxShadow: `0 0 8px ${style.border}` }}>
                {mode !== 'device' && cell.value}
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
                <div className="bg-card border border-border px-3 py-2 rounded text-xs" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.7)' }}>
                  <p className="text-white font-medium">{cell.label}</p>
                  <p className="text-muted-foreground">{cell.detail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-between items-center mt-3">
        {mode === 'fault' && (
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{ background: 'rgba(239,68,68,0.8)' }} />≥10次 高频</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{ background: 'rgba(245,158,11,0.7)' }} />5-9次</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{ background: 'rgba(0,213,255,0.6)' }} />2-4次</span>
          </div>
        )}
        {mode === 'task' && (
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{ background: 'rgba(239,68,68,0.8)' }} />极高密度</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{ background: 'rgba(245,158,11,0.7)' }} />高密度</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{ background: 'rgba(0,213,255,0.6)' }} />中等</span>
          </div>
        )}
        {mode === 'device' && (
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: 'rgb(16,185,129)' }} />在线</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: 'rgb(0,213,255)' }} />任务中</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: 'rgb(148,163,184)' }} />离线</span>
          </div>
        )}
        <span className="text-[10px] text-muted-foreground">悬浮查看详情</span>
      </div>
    </TechCard>
  );
};

export default ResourceHeatmap;