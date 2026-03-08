import React from 'react';
import { Clock, ListChecks, AlertTriangle, User } from 'lucide-react';

interface PilotPerformanceCardProps {
  name?: string;
  score?: number;
  flightHours?: number;
  taskCount?: number;
  violationCount?: number;
  tags?: string[];
  isSelected?: boolean;
  onClick?: () => void;
}

const PilotPerformanceCard: React.FC<PilotPerformanceCardProps> = ({
  name = '张飞手',
  score = 85,
  flightHours = 200,
  taskCount = 80,
  violationCount = 1,
  tags = ['精通建模', '夜航'],
  isSelected = false,
  onClick = () => {},
}) => {
  const scoreColor = score >= 90 ? 'rgb(16,185,129)' : score >= 75 ? 'rgb(0,213,255)' : score >= 60 ? 'rgb(245,158,11)' : 'rgb(239,68,68)';

  return (
    <div
      data-cmp="PilotPerformanceCard"
      onClick={onClick}
      className="rounded border cursor-pointer transition-all duration-200 flex-shrink-0"
      style={{
        width: '180px',
        padding: '16px',
        background: isSelected ? 'rgba(0,213,255,0.08)' : 'rgba(255,255,255,0.02)',
        borderColor: isSelected ? 'rgba(0,213,255,0.6)' : 'rgba(255,255,255,0.07)',
        boxShadow: isSelected ? '0 0 12px rgba(0,213,255,0.15)' : 'none',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,213,255,0.15)', border: '1px solid rgba(0,213,255,0.3)' }}>
          <User className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-[10px] text-muted-foreground">飞手 · 一分队</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground">综合得分</span>
        <span className="text-xl font-bold" style={{ color: scoreColor }}>{score}</span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>飞行时长</span>
          <span className="ml-auto text-white font-medium">{flightHours}h</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ListChecks className="w-3 h-3" />
          <span>完成任务</span>
          <span className="ml-auto text-white font-medium">{taskCount} 次</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <AlertTriangle className="w-3 h-3" />
          <span>违规记录</span>
          <span className="ml-auto font-medium" style={{ color: violationCount > 0 ? 'rgb(245,158,11)' : 'rgb(16,185,129)' }}>{violationCount} 次</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {tags.map((tag, i) => (
          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,213,255,0.1)', color: 'rgb(0,213,255)', border: '1px solid rgba(0,213,255,0.2)' }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PilotPerformanceCard;
