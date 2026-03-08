import React, { useState } from 'react';
import TechCard from '../ui-custom/TechCard';
import TaskEfficiencyBoard from './TaskEfficiencyBoard';
import ResourceHeatmap from './ResourceHeatmap';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend
} from 'recharts';
import { ListChecks, Users, Clock, AlertCircle } from 'lucide-react';

const completionByTypeData = [
  { type: '常态巡检', 完成率: 96, 异常率: 4 },
  { type: '紧急响应', 完成率: 88, 异常率: 12 },
  { type: '专项执法', 完成率: 92, 异常率: 8 },
  { type: '测绘建模', 完成率: 85, 异常率: 15 },
  { type: '农业植保', 完成率: 98, 异常率: 2 },
];

const avgDurationData = [
  { month: '2月', 常态化: 45, 紧急任务: 28 },
  { month: '3月', 常态化: 48, 紧急任务: 25 },
  { month: '4月', 常态化: 42, 紧急任务: 30 },
  { month: '5月', 常态化: 46, 紧急任务: 27 },
  { month: '6月', 常态化: 44, 紧急任务: 26 },
  { month: '7月', 常态化: 43, 紧急任务: 24 },
];

const abnormalTop3 = [
  { type: '通信中断', count: 18, ratio: '6.2%', color: 'rgb(239,68,68)' },
  { type: '电量不足返航', count: 14, ratio: '4.8%', color: 'rgb(245,158,11)' },
  { type: '气象条件取消', count: 11, ratio: '3.8%', color: 'rgb(0,213,255)' },
];

const personnelLoadData = [
  { name: '一分队', 人均任务数: 28, 飞手人数: 8 },
  { name: '二分队', 人均任务数: 22, 飞手人数: 6 },
  { name: '三分队', 人均任务数: 35, 飞手人数: 10 },
  { name: '四分队', 人均任务数: 18, 飞手人数: 5 },
  { name: '五分队', 人均任务数: 30, 飞手人数: 9 },
];

const compareData = [
  { period: '1月', 常态化: 88, 紧急: 72 },
  { period: '2月', 常态化: 91, 紧急: 78 },
  { period: '3月', 常态化: 89, 紧急: 80 },
  { period: '4月', 常态化: 93, 紧急: 82 },
  { period: '5月', 常态化: 95, 紧急: 85 },
  { period: '6月', 常态化: 96, 紧急: 88 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded text-xs" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
        <p className="text-white font-medium mb-1">{label}</p>
        {payload.map((e: any, i: number) => <p key={i} style={{ color: e.color }}>{e.name}: {e.value}{typeof e.value === 'number' ? (e.name.includes('率') || e.value <= 100 ? '%' : '') : ''}</p>)}
      </div>
    );
  }
  return null;
};

const TaskStatsTab = () => {
  const [compareType, setCompareType] = useState<'completion' | 'duration'>('completion');
  console.log('TaskStatsTab rendered');

  return (
    <div className="space-y-6">
      {/* Section 1 */}
      <div className="flex items-center gap-3 mb-2">
        <ListChecks className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-white tracking-wider">任务效能报表</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(0,213,255,0.3), transparent)' }} />
      </div>

      <div className="flex gap-4" style={{ height: '280px' }}>
        {/* Completion by Type Bar */}
        <div className="flex-1">
          <TechCard title="各类型任务完成率 & 异常率" className="h-full">
            <div style={{ height: '210px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionByTypeData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="type" stroke="rgb(100,116,139)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgb(100,116,139)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,213,255,0.04)' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="完成率" fill="rgb(0,213,255)" radius={[3, 3, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="异常率" fill="rgb(239,68,68)" radius={[3, 3, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TechCard>
        </div>

        {/* Average Duration Trend */}
        <div style={{ width: '320px' }}>
          <TechCard title="平均耗时对比（分钟）" icon={Clock} className="h-full">
            <div style={{ height: '210px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={avgDurationData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgb(100,116,139)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgb(100,116,139)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="常态化" stroke="rgb(0,213,255)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="紧急任务" stroke="rgb(245,158,11)" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TechCard>
        </div>

        {/* Abnormal Top 3 */}
        <div style={{ width: '260px' }}>
          <TechCard title="异常类型 TOP3" icon={AlertCircle} className="h-full">
            <div className="space-y-3 pt-2">
              {abnormalTop3.map((item, i) => (
                <div key={i} className="p-3 rounded border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black italic opacity-50" style={{ color: item.color }}>0{i + 1}</span>
                      <span className="text-sm font-medium text-white">{item.type}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>发生次数: <span className="font-medium" style={{ color: item.color }}>{item.count}</span></span>
                    <span>占比: <span className="font-medium text-foreground">{item.ratio}</span></span>
                  </div>
                </div>
              ))}
              <div className="text-center pt-1">
                <button className="text-xs text-primary hover:underline">查看完整异常日志 →</button>
              </div>
            </div>
          </TechCard>
        </div>
      </div>

      {/* Personnel Load + Compare */}
      <div className="flex gap-4" style={{ height: '260px' }}>
        {/* Personnel Load */}
        <div style={{ width: '340px' }}>
          <TechCard title="人员任务负荷（各分队人均）" icon={Users} className="h-full">
            <div style={{ height: '195px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={personnelLoadData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgb(100,116,139)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgb(100,116,139)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,213,255,0.04)' }} />
                  <Bar dataKey="人均任务数" fill="rgb(139,92,246)" radius={[3, 3, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TechCard>
        </div>

        {/* Compare Analysis */}
        <div className="flex-1">
          <TechCard
            title="效能对比分析（常态化 vs 紧急任务）"
            action={
              <div className="flex gap-1">
                <button onClick={() => setCompareType('completion')} className="text-xs px-2 py-1 rounded transition-colors" style={{ background: compareType === 'completion' ? 'rgba(0,213,255,0.15)' : 'rgba(255,255,255,0.05)', color: compareType === 'completion' ? 'rgb(0,213,255)' : 'rgb(148,163,184)', border: `1px solid ${compareType === 'completion' ? 'rgba(0,213,255,0.5)' : 'rgba(255,255,255,0.1)'}` }}>完成率</button>
                <button onClick={() => setCompareType('duration')} className="text-xs px-2 py-1 rounded transition-colors" style={{ background: compareType === 'duration' ? 'rgba(0,213,255,0.15)' : 'rgba(255,255,255,0.05)', color: compareType === 'duration' ? 'rgb(0,213,255)' : 'rgb(148,163,184)', border: `1px solid ${compareType === 'duration' ? 'rgba(0,213,255,0.5)' : 'rgba(255,255,255,0.1)'}` }}>耗时</button>
              </div>
            }
            className="h-full"
          >
            <div style={{ height: '195px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={compareData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="period" stroke="rgb(100,116,139)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgb(100,116,139)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="常态化" stroke="rgb(0,213,255)" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="紧急" stroke="rgb(245,158,11)" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TechCard>
        </div>

        {/* Insight Card */}
        <div style={{ width: '220px' }}>
          <TechCard title="效能洞察" className="h-full">
            <div className="space-y-3 pt-1">
              {[
                { label: '紧急任务平均耗时较常态化', value: '缩短 30%', color: 'rgb(16,185,129)' },
                { label: '常态化任务完成率同比提升', value: '+8.5%', color: 'rgb(0,213,255)' },
                { label: '月度任务总量', value: '1,247 次', color: 'rgb(0,213,255)' },
                { label: '设备利用率综合', value: '68.5%', color: 'rgb(245,158,11)' },
              ].map((item, i) => (
                <div key={i} className="px-3 py-2 rounded" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="text-[10px] text-muted-foreground mb-0.5">{item.label}</p>
                  <p className="text-sm font-bold" style={{ color: item.color }}>{item.value}</p>
                </div>
              ))}
            </div>
          </TechCard>
        </div>
      </div>

      {/* Task Board + Heatmaps */}
      <div className="flex items-center gap-3">
        <ListChecks className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-white tracking-wider">任务效能看板 & 资源热力图</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(0,213,255,0.3), transparent)' }} />
      </div>

      <div className="flex gap-4">
        <div style={{ flex: 2 }}>
          <TaskEfficiencyBoard />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResourceHeatmap mode="task" />
          <ResourceHeatmap mode="device" />
        </div>
      </div>
    </div>
  );
};

export default TaskStatsTab;