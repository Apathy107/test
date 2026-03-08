import React from 'react';
import TechCard from '../ui-custom/TechCard';
import DeviceHealthBoard from './DeviceHealthBoard';
import ResourceHeatmap from './ResourceHeatmap';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Activity, Cpu, DollarSign, AlertOctagon } from 'lucide-react';

const healthRankData = [
  { type: '机库无人机', score: 92 },
  { type: '多旋翼单兵', score: 85 },
  { type: '固定翼 VTOL', score: 78 },
  { type: '农业植保机', score: 76 },
  { type: '消费级设备', score: 68 },
];

const healthTrendData = [
  { month: '2月', 机库: 90, 单兵: 82, 固定翼: 75 },
  { month: '3月', 机库: 91, 单兵: 80, 固定翼: 78 },
  { month: '4月', 机库: 88, 单兵: 84, 固定翼: 74 },
  { month: '5月', 机库: 93, 单兵: 83, 固定翼: 76 },
  { month: '6月', 机库: 91, 单兵: 85, 固定翼: 79 },
  { month: '7月', 机库: 92, 单兵: 85, 固定翼: 78 },
];

const utilizationData = [
  { name: '多旋翼单兵', 利用率: 78, 效率: 85, 承载量: 92, 闲置时长: 22 },
  { name: '机库无人机', 利用率: 65, 效率: 90, 承载量: 88, 闲置时长: 35 },
  { name: '固定翼 VTOL', 利用率: 55, 效率: 72, 承载量: 70, 闲置时长: 45 },
  { name: '农业植保', 利用率: 82, 效率: 88, 承载量: 95, 闲置时长: 18 },
];

const faultRootData = [
  { name: '动力系统', value: 35, color: 'rgb(239,68,68)' },
  { name: '通信链路', value: 25, color: 'rgb(245,158,11)' },
  { name: '云台相机', value: 20, color: 'rgb(0,213,255)' },
  { name: '电池模组', value: 15, color: 'rgb(139,92,246)' },
  { name: '飞控模块', value: 5, color: 'rgb(16,185,129)' },
];

const faultTop3 = [
  { id: 'M300-RTK (D041)', count: 12, mtbf: '320h', mttr: '8.5h', level: 'danger' },
  { id: 'Mavic 3E (D112)', count: 8, mtbf: '480h', mttr: '4.2h', level: 'warning' },
  { id: '固定翼 VTOL (F09)', count: 5, mtbf: '620h', mttr: '12h', level: 'warning' },
];

const costData = [
  { name: '一分队', tco: 42000, 任务成本: 320, roi: 2.8 },
  { name: '二分队', tco: 38000, 任务成本: 280, roi: 2.5 },
  { name: '三分队', tco: 55000, 任务成本: 410, roi: 3.2 },
  { name: '四分队', tco: 31000, 任务成本: 260, roi: 2.1 },
  { name: '五分队', tco: 47000, 任务成本: 350, roi: 3.0 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded text-xs" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
        <p className="text-white font-medium mb-1">{label}</p>
        {payload.map((e, i) => <p key={i} style={{ color: e.color }}>{e.name}: {e.value}</p>)}
      </div>
    );
  }
  return null;
};

const DeviceStatsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Activity className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-white tracking-wider">设备健康度报表</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(0,213,255,0.3), transparent)' }} />
        <span className="text-xs text-muted-foreground">评分 = 100 - 故障×10 - 逾期保养×5 - 未处理告警×3</span>
      </div>

      <div className="flex gap-4" style={{ height: '280px' }}>
        <div style={{ width: '280px' }}>
          <TechCard title="各类型设备健康度排名" className="h-full">
            <div className="space-y-3 pt-1">
              {healthRankData.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-3">{i + 1}</span>
                  <span className="text-xs text-foreground flex-1 truncate">{item.type}</span>
                  <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{
                      width: `${item.score}%`,
                      background: item.score >= 90 ? 'rgb(16,185,129)' : item.score >= 80 ? 'rgb(0,213,255)' : item.score >= 70 ? 'rgb(245,158,11)' : 'rgb(239,68,68)'
                    }} />
                  </div>
                  <span className="text-xs font-bold w-7 text-right" style={{ color: item.score >= 90 ? 'rgb(16,185,129)' : item.score >= 80 ? 'rgb(0,213,255)' : 'rgb(245,158,11)' }}>{item.score}</span>
                </div>
              ))}
            </div>
          </TechCard>
        </div>

        <div className="flex-1">
          <TechCard title="健康度趋势（近6个月）" className="h-full">
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthTrendData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgb(100,116,139)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgb(100,116,139)" fontSize={11} tickLine={false} axisLine={false} domain={[60, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="机库" stroke="rgb(16,185,129)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="单兵" stroke="rgb(0,213,255)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="固定翼" stroke="rgb(245,158,11)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TechCard>
        </div>

        <div style={{ width: '300px' }}>
          <TechCard title="利用率综合对比" className="h-full">
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={utilizationData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                  <XAxis type="number" stroke="rgb(100,116,139)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" stroke="rgb(100,116,139)" fontSize={10} tickLine={false} axisLine={false} width={60} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,213,255,0.04)' }} />
                  <Bar dataKey="利用率" fill="rgb(0,213,255)" radius={[0, 2, 2, 0]} maxBarSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TechCard>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <AlertOctagon className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-white tracking-wider">故障分析 & 成本效益报表</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(0,213,255,0.3), transparent)' }} />
      </div>

      <div className="flex gap-4" style={{ height: '280px' }}>
        <div style={{ width: '300px' }}>
          <TechCard title="故障根因分布" className="h-full">
            <div className="flex items-center" style={{ height: '210px' }}>
              <div style={{ flex: 1, height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={faultRootData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none">
                      {faultRootData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgb(15,23,42)', border: '1px solid rgb(30,58,138)', fontSize: '12px', borderRadius: '4px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 pr-2">
                {faultRootData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="text-white font-medium ml-auto pl-1">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </TechCard>
        </div>

        <div style={{ width: '320px' }}>
          <TechCard title="故障频次 TOP3 设备" className="h-full">
            <div className="space-y-3 pt-1">
              {faultTop3.map((item, i) => (
                <div key={i} className="p-3 rounded border" style={{ background: item.level === 'danger' ? 'rgba(239,68,68,0.05)' : 'rgba(245,158,11,0.05)', borderColor: item.level === 'danger' ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{item.id}</span>
                    <span className="text-sm font-bold" style={{ color: item.level === 'danger' ? 'rgb(239,68,68)' : 'rgb(245,158,11)' }}>{item.count} 次</span>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>MTBF: <span className="text-foreground">{item.mtbf}</span></span>
                    <span>MTTR: <span className="text-foreground">{item.mttr}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </TechCard>
        </div>

        <div className="flex-1">
          <TechCard title="各单位成本效益（TCO 元 / ROI）" icon={DollarSign} className="h-full">
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgb(100,116,139)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgb(100,116,139)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,213,255,0.04)' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="tco" name="TCO(元)" fill="rgb(0,213,255)" radius={[3, 3, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="任务成本" name="任务成本(元)" fill="rgb(245,158,11)" radius={[3, 3, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TechCard>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Cpu className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-white tracking-wider">设备效能看板 & 故障热力图</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(0,213,255,0.3), transparent)' }} />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <DeviceHealthBoard />
        </div>
        <div style={{ width: '420px' }}>
          <ResourceHeatmap mode="fault" />
        </div>
      </div>
    </div>
  );
};

export default DeviceStatsTab;
