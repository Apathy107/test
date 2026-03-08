import React, { useState } from 'react';
import TechCard from '../ui-custom/TechCard';
import { LayoutGrid } from 'lucide-react';

const teamData = [
  {
    unit: '高新区分局', avg: 88,
    members: [
      { name: '王建国', score: 96 }, { name: '赵红', score: 91 }, { name: '陈杰', score: 87 },
      { name: '李明', score: 88 }, { name: '周斌', score: 82 }, { name: '孙波', score: 79 },
    ]
  },
  {
    unit: '南山中队', avg: 82,
    members: [
      { name: '张伟', score: 85 }, { name: '黄磊', score: 83 }, { name: '徐丽', score: 80 },
      { name: '刘洋', score: 79 }, { name: '何军', score: 76 },
    ]
  },
  {
    unit: '东城大队', avg: 76,
    members: [
      { name: '林峰', score: 82 }, { name: '吴强', score: 78 }, { name: '郑超', score: 74 },
      { name: '谢磊', score: 70 },
    ]
  },
  {
    unit: '交管特勤', avg: 71,
    members: [
      { name: '冯刚', score: 75 }, { name: '蒋华', score: 72 }, { name: '范伟', score: 68 },
      { name: '彭飞', score: 65 }, { name: '卢明', score: 62 },
    ]
  },
  {
    unit: '龙岗支队', avg: 84,
    members: [
      { name: '韩冰', score: 90 }, { name: '魏东', score: 86 }, { name: '程明', score: 83 },
      { name: '宋伟', score: 80 }, { name: '傅勇', score: 81 },
    ]
  },
];

const getHeatColor = (score: number) => {
  if (score >= 90) return { bg: 'rgba(16,185,129,0.25)', border: 'rgba(16,185,129,0.5)', text: 'rgb(16,185,129)' };
  if (score >= 80) return { bg: 'rgba(0,213,255,0.15)', border: 'rgba(0,213,255,0.4)', text: 'rgb(0,213,255)' };
  if (score >= 70) return { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', text: 'rgb(245,158,11)' };
  return { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)', text: 'rgb(239,68,68)' };
};

const TeamHeatmap = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  console.log('TeamHeatmap rendered');

  return (
    <TechCard
      title="团队绩效热力图（按单位分组）"
      icon={LayoutGrid}
      action={<span className="text-xs text-muted-foreground">点击色块可钻取个人详情</span>}
    >
      <div className="space-y-3">
        {teamData.map((unit) => {
          const colors = getHeatColor(unit.avg);
          const isExpanded = expanded === unit.unit;
          return (
            <div key={unit.unit}>
              {/* Unit Row */}
              <button
                className="w-full flex items-center gap-3 p-2.5 rounded transition-colors"
                style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${colors.border}` }}
                onClick={() => setExpanded(isExpanded ? null : unit.unit)}
              >
                {/* Unit Color Block */}
                <div className="w-12 h-10 rounded flex items-center justify-center flex-shrink-0 text-sm font-bold" style={{ background: colors.bg, color: colors.text }}>
                  {unit.avg}
                </div>
                <span className="text-sm font-medium text-white flex-1 text-left">{unit.unit}</span>
                <span className="text-xs text-muted-foreground">{unit.members.length} 人</span>
                {/* Mini heatmap blocks */}
                <div className="flex gap-1">
                  {unit.members.map((m, i) => {
                    const mc = getHeatColor(m.score);
                    return <div key={i} className="w-4 h-5 rounded-sm" style={{ background: mc.bg, border: `1px solid ${mc.border}` }} title={`${m.name}: ${m.score}`} />;
                  })}
                </div>
                <span className="text-xs ml-2" style={{ color: colors.text }}>{isExpanded ? '▲' : '▼'}</span>
              </button>

              {/* Expanded Member List */}
              {isExpanded && (
                <div className="mt-1 ml-4 p-3 rounded border grid gap-2" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
                  {unit.members.map((member) => {
                    const mc = getHeatColor(member.score);
                    return (
                      <div key={member.name} className="flex items-center gap-2 px-2 py-1.5 rounded" style={{ background: mc.bg, border: `1px solid ${mc.border}` }}>
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: mc.text }} />
                        <span className="text-xs text-white">{member.name}</span>
                        <span className="ml-auto text-xs font-bold" style={{ color: mc.text }}>{member.score}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Legend */}
        <div className="flex gap-4 pt-2 justify-end">
          {[
            { label: '优秀 (90+)', color: 'rgb(16,185,129)' },
            { label: '良好 (80-89)', color: 'rgb(0,213,255)' },
            { label: '及格 (70-79)', color: 'rgb(245,158,11)' },
            { label: '待提升 (<70)', color: 'rgb(239,68,68)' },
          ].map((l, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded-sm" style={{ background: l.color, opacity: 0.7 }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>
    </TechCard>
  );
};

export default TeamHeatmap;