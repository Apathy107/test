import React, { useState } from 'react';
import TechCard from '../ui-custom/TechCard';
import { ListChecks, ChevronRight } from 'lucide-react';

const taskRows = [
  { id: 'T-241201', name: '东城区违建专项巡查', unit: '高新区分局', type: '专项执法', completion: 96, duration: 42, abnormal: 2, status: 'done' },
  { id: 'T-241202', name: '春运交通态势监测', unit: '交管特勤', type: '常态巡检', completion: 100, duration: 38, abnormal: 0, status: 'done' },
  { id: 'T-241203', name: '南山河流污染应急排查', unit: '南山中队', type: '紧急响应', completion: 88, duration: 25, abnormal: 3, status: 'ongoing' },
  { id: 'T-241204', name: '高新区三维建模测绘', unit: '高新区分局', type: '测绘建模', completion: 72, duration: 95, abnormal: 1, status: 'ongoing' },
  { id: 'T-241205', name: '龙岗植保喷洒', unit: '龙岗支队', type: '农业植保', completion: 100, duration: 60, abnormal: 0, status: 'done' },
  { id: 'T-241206', name: '重大活动现场安保', unit: '东城大队', type: '紧急响应', completion: 45, duration: 0, abnormal: 0, status: 'plan' },
];

const typeColors: Record<string, string> = {
  '专项执法': 'rgb(139,92,246)',
  '常态巡检': 'rgb(0,213,255)',
  '紧急响应': 'rgb(239,68,68)',
  '测绘建模': 'rgb(245,158,11)',
  '农业植保': 'rgb(16,185,129)',
};

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  done: { label: '已完成', bg: 'rgba(16,185,129,0.15)', color: 'rgb(16,185,129)' },
  ongoing: { label: '进行中', bg: 'rgba(0,213,255,0.15)', color: 'rgb(0,213,255)' },
  plan: { label: '计划中', bg: 'rgba(148,163,184,0.15)', color: 'rgb(148,163,184)' },
};

const TaskEfficiencyBoard = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <TechCard title="任务效能看板" icon={ListChecks} action={<span className="text-xs text-muted-foreground">点击行可下钻单任务详情</span>}>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-muted-foreground" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <th className="text-left py-2 px-2 font-medium">任务名称</th>
              <th className="text-left py-2 px-2 font-medium">单位</th>
              <th className="text-left py-2 px-2 font-medium">类型</th>
              <th className="text-center py-2 px-2 font-medium">完成率</th>
              <th className="text-center py-2 px-2 font-medium">耗时</th>
              <th className="text-center py-2 px-2 font-medium">异常次</th>
              <th className="text-center py-2 px-2 font-medium">状态</th>
              <th className="text-center py-2 px-2 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {taskRows.map((row) => {
              const sc = statusConfig[row.status];
              const isSelected = selected === row.id;
              return (
                <tr
                  key={row.id}
                  onClick={() => setSelected(isSelected ? null : row.id)}
                  className="cursor-pointer transition-colors"
                  style={{ background: isSelected ? 'rgba(0,213,255,0.05)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                >
                  <td className="py-3 px-2">
                    <div className="text-white font-medium">{row.name}</div>
                    <div className="text-muted-foreground text-[10px]">{row.id}</div>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground">{row.unit}</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: `${typeColors[row.type]}22`, color: typeColors[row.type], border: `1px solid ${typeColors[row.type]}44` }}>
                      {row.type}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="flex items-center gap-1.5 justify-center">
                      <div className="w-12 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${row.completion}%`, background: row.completion >= 90 ? 'rgb(16,185,129)' : 'rgb(0,213,255)' }} />
                      </div>
                      <span className="text-white">{row.completion}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center text-white">{row.duration > 0 ? `${row.duration} 分钟` : '-'}</td>
                  <td className="py-3 px-2 text-center">
                    <span style={{ color: row.abnormal > 0 ? 'rgb(245,158,11)' : 'rgb(16,185,129)' }} className="font-medium">
                      {row.abnormal}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: sc.bg, color: sc.color }}>
                      {sc.label}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <button type="button" className="flex items-center gap-0.5 mx-auto text-primary hover:text-primary/80">
                      详情 <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </TechCard>
  );
};

export default TaskEfficiencyBoard;
