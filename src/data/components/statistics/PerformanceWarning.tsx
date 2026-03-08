import React from 'react';
import TechCard from '../ui-custom/TechCard';
import { AlertTriangle, Star, FileText } from 'lucide-react';

const warningPilots = [
  { name: '彭飞', unit: '交管特勤', drop: 14, months: 2, lastScore: 62 },
  { name: '范伟', unit: '交管特勤', drop: 11, months: 2, lastScore: 68 },
  { name: '谢磊', unit: '东城大队', drop: 10, months: 2, lastScore: 70 },
];

const starPilots = [
  { rank: 1, name: '王建国', unit: '高新区分局', score: 96, hours: 312 },
  { rank: 2, name: '韩冰', unit: '龙岗支队', score: 90, hours: 287 },
  { rank: 3, name: '赵红', unit: '高新区分局', score: 91, hours: 275 },
];

const PerformanceWarning = () => {
  return (
    <div className="space-y-4 h-full">
      <TechCard
        title="绩效下滑预警"
        icon={AlertTriangle}
        action={<span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.15)', color: 'rgb(239,68,68)', border: '1px solid rgba(239,68,68,0.3)' }}>3 人预警</span>}
      >
        <div className="space-y-3">
          {warningPilots.map((pilot, i) => (
            <div key={i} className="p-3 rounded border" style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.25)' }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'rgb(239,68,68)', boxShadow: '0 0 5px rgba(239,68,68,0.8)' }} />
                  <span className="text-sm font-medium text-white">{pilot.name}</span>
                  <span className="text-xs text-muted-foreground">· {pilot.unit}</span>
                </div>
                <span className="text-xs font-bold" style={{ color: 'rgb(239,68,68)' }}>↓{pilot.drop}分</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                连续 {pilot.months} 个月绩效下降超10分，当前得分 <span style={{ color: 'rgb(239,68,68)' }}>{pilot.lastScore}</span>
              </p>
              <button type="button" className="flex items-center gap-1.5 text-xs hover:underline" style={{ color: 'rgb(239,68,68)' }}>
                <FileText className="w-3 h-3" />
                下载绩效分析报告
              </button>
            </div>
          ))}
        </div>
      </TechCard>

      <TechCard title="月度绩效之星榜单" icon={Star}>
        <div className="space-y-3">
          {starPilots.map((pilot) => (
            <div key={pilot.rank} className="flex items-center gap-3 p-2.5 rounded border" style={{ background: 'rgba(245,158,11,0.05)', borderColor: 'rgba(245,158,11,0.2)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-black" style={{ background: pilot.rank === 1 ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.05)', color: pilot.rank === 1 ? 'rgb(245,158,11)' : 'rgb(148,163,184)' }}>
                {pilot.rank === 1 ? '★' : `${pilot.rank}`}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{pilot.name}</p>
                <p className="text-xs text-muted-foreground">{pilot.unit} · {pilot.hours}h 飞行</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold" style={{ color: 'rgb(245,158,11)' }}>{pilot.score}</span>
                <span className="text-xs text-muted-foreground ml-1">分</span>
              </div>
            </div>
          ))}
          <p className="text-xs text-center text-muted-foreground pt-1">全平台公示榜单 · 月度更新</p>
        </div>
      </TechCard>
    </div>
  );
};

export default PerformanceWarning;
