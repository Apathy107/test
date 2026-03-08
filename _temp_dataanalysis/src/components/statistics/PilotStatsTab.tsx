import React, { useState } from 'react';
import TechCard from '../ui-custom/TechCard';
import PilotPerformanceCard from './PilotPerformanceCard';
import TeamHeatmap from './TeamHeatmap';
import PerformanceWarning from './PerformanceWarning';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend
} from 'recharts';
import { ShieldCheck, TrendingUp, Award, BarChart2 } from 'lucide-react';

// --- Chart Data ---
const unitLicenseData = [
  { name: '高新区分局', 超视距: 78, 普通: 22 },
  { name: '南山中队', 超视距: 65, 普通: 35 },
  { name: '交管特勤', 超视距: 55, 普通: 45 },
  { name: '东城大队', 超视距: 82, 普通: 18 },
  { name: '龙岗支队', 超视距: 70, 普通: 30 },
];

const reviewTrendData = [
  { quarter: 'Q1 2024', 及时率: 76 },
  { quarter: 'Q2 2024', 及时率: 82 },
  { quarter: 'Q3 2024', 及时率: 88 },
  { quarter: 'Q4 2024', 及时率: 85 },
  { quarter: 'Q1 2025', 及时率: 91 },
  { quarter: 'Q2 2025', 及时率: 94 },
];

const scoreDistData = [
  { name: '90-100分', value: 28, color: 'rgb(16, 185, 129)' },
  { name: '75-90分', value: 45, color: 'rgb(0, 213, 255)' },
  { name: '60-75分', value: 18, color: 'rgb(245, 158, 11)' },
  { name: '60分以下', value: 9, color: 'rgb(239, 68, 68)' },
];

const radarData = [
  { subject: '飞行技术', A: 88, fullMark: 100 },
  { subject: '任务执行', A: 72, fullMark: 100 },
  { subject: '设备维护', A: 65, fullMark: 100 },
  { subject: '数据处理', A: 78, fullMark: 100 },
  { subject: '应急处置', A: 60, fullMark: 100 },
  { subject: '合规操作', A: 85, fullMark: 100 },
];

const expiredTop3 = [
  { rank: 1, unit: '高新区分局', count: 5, detail: '超视距执照逾期', level: 'danger' },
  { rank: 2, unit: '南山中队', count: 3, detail: '未完成季度复审', level: 'warning' },
  { rank: 3, unit: '交通管理局特勤', count: 2, detail: '机型资质不符', level: 'warning' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
        <p className="text-white font-medium mb-1 text-xs">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color }} className="text-xs">{entry.name}: {entry.value}{typeof entry.value === 'number' && entry.value <= 100 ? '%' : ''}</p>
        ))}
      </div>
    );
  }
  return null;
};

const PilotStatsTab = () => {
  const [selectedPilot, setSelectedPilot] = useState<string | null>(null);

  console.log('PilotStatsTab rendered');

  return (
    <div className="space-y-6">
      {/* Section Label */}
      <div className="flex items-center gap-3 mb-2">
        <ShieldCheck className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-white tracking-wider">资质合规报表</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(0,213,255,0.3), transparent)' }} />
      </div>

      {/* Row 1: Compliance Charts */}
      <div className="flex gap-4" style={{ height: '320px' }}>
        {/* Card1: Unit License Bar */}
        <div className="flex-1">
          <TechCard title="各单位超视距执照占比" icon={BarChart2} className="h-full">
            <div style={{ height: '230px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={unitLicenseData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgb(100,116,139)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgb(100,116,139)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,213,255,0.04)' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="超视距" fill="rgb(0, 213, 255)" radius={[3, 3, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="普通" fill="rgb(30, 58, 138)" radius={[3, 3, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TechCard>
        </div>

        {/* Card2: Expired TOP3 */}
        <div style={{ width: '280px' }}>
          <TechCard title="资质过期未处理 TOP3" icon={ShieldCheck} className="h-full">
            <div className="space-y-3 pt-1">
              {expiredTop3.map((item) => (
                <div key={item.rank} className="flex items-center gap-3 p-3 rounded border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                  <span className="text-xl font-black italic" style={{ color: item.level === 'danger' ? 'rgb(239,68,68)' : 'rgb(245,158,11)', opacity: 0.7 }}>0{item.rank}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{item.unit}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold" style={{ color: item.level === 'danger' ? 'rgb(239,68,68)' : 'rgb(245,158,11)' }}>{item.count} 人</span>
                  </div>
                </div>
              ))}
              <div className="pt-1 text-center">
                <button className="text-xs text-primary hover:underline">查看全部过期名单 →</button>
              </div>
            </div>
          </TechCard>
        </div>

        {/* Card3: Review Trend Line */}
        <div style={{ width: '340px' }}>
          <TechCard title="复审及时率季度趋势" icon={TrendingUp} className="h-full">
            <div style={{ height: '230px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reviewTrendData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="quarter" stroke="rgb(100,116,139)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgb(100,116,139)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[60, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="及时率" stroke="rgb(0, 213, 255)" strokeWidth={2.5} dot={{ r: 4, fill: 'rgb(0,213,255)', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TechCard>
        </div>
      </div>

      {/* Section Label 2 */}
      <div className="flex items-center gap-3 mt-2">
        <Award className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-white tracking-wider">绩效与能力报表</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(0,213,255,0.3), transparent)' }} />
      </div>

      {/* Row 2: Performance Charts */}
      <div className="flex gap-4" style={{ height: '300px' }}>
        {/* Pie: Score Distribution */}
        <div style={{ width: '320px' }}>
          <TechCard title="绩效得分区间占比" className="h-full">
            <div className="flex items-center gap-4" style={{ height: '220px' }}>
              <div style={{ flex: 1, height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={scoreDistData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                      {scoreDistData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgb(15,23,42)', border: '1px solid rgb(30,58,138)', borderRadius: '4px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 pr-2">
                {scoreDistData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="text-white font-semibold ml-auto pl-2">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </TechCard>
        </div>

        {/* Radar: Ability Analysis */}
        <div style={{ flex: 1 }}>
          <TechCard title="综合能力短板分析（全员平均）" className="h-full">
            <div style={{ height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgb(148,163,184)', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'rgb(100,116,139)', fontSize: 9 }} />
                  <Radar name="全员平均" dataKey="A" stroke="rgb(0,213,255)" fill="rgb(0,213,255)" fillOpacity={0.15} dot={{ fill: 'rgb(0,213,255)', r: 3 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgb(15,23,42)', border: '1px solid rgb(30,58,138)', fontSize: '12px', borderRadius: '4px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </TechCard>
        </div>

        {/* Shortboard Table */}
        <div style={{ width: '260px' }}>
          <TechCard title="能力短板排名" className="h-full">
            <div className="space-y-2 pt-1">
              {[
                { skill: '应急处置', score: 60, delta: -8 },
                { skill: '设备维护', score: 65, delta: -5 },
                { skill: '任务执行', score: 72, delta: -3 },
                { skill: '数据处理', score: 78, delta: +2 },
                { skill: '飞行技术', score: 88, delta: +5 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-2 py-2 rounded" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                  <span className="text-xs text-foreground flex-1">{item.skill}</span>
                  <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.score}%`, background: item.score < 70 ? 'rgb(239,68,68)' : item.score < 80 ? 'rgb(245,158,11)' : 'rgb(0,213,255)' }} />
                  </div>
                  <span className="text-xs font-medium w-7 text-right" style={{ color: item.score < 70 ? 'rgb(239,68,68)' : 'rgb(0,213,255)' }}>{item.score}</span>
                </div>
              ))}
            </div>
          </TechCard>
        </div>
      </div>

      {/* Section Label 3 */}
      <div className="flex items-center gap-3 mt-2">
        <Award className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-white tracking-wider">绩效看板 & 预警系统</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(0,213,255,0.3), transparent)' }} />
      </div>

      {/* Row 3: Performance Board + Warning */}
      <div className="flex gap-4">
        {/* Personal Performance Cards */}
        <div className="flex-1">
          <TechCard title="个人绩效卡片（TOP 飞手）" icon={Award} action={<button className="text-xs text-primary">查看全部 →</button>}>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {['王建国', '李明', '张伟', '刘洋'].map((name, i) => (
                <PilotPerformanceCard
                  key={name}
                  name={name}
                  score={[96, 88, 85, 79][i]}
                  flightHours={[312, 256, 198, 145][i]}
                  taskCount={[128, 96, 87, 63][i]}
                  violationCount={[0, 1, 0, 2][i]}
                  tags={[['精通建模', '夜航专家'], ['擅长巡检', '精准定位'], ['快速响应', '多旋翼'], ['数据处理', '固定翼']][i]}
                  isSelected={selectedPilot === name}
                  onClick={() => setSelectedPilot(selectedPilot === name ? null : name)}
                />
              ))}
            </div>
          </TechCard>
        </div>
      </div>

      {/* Row 4: Team Heatmap + Warning */}
      <div className="flex gap-4">
        <div style={{ flex: 2 }}>
          <TeamHeatmap />
        </div>
        <div style={{ flex: 1 }}>
          <PerformanceWarning />
        </div>
      </div>
    </div>
  );
};

export default PilotStatsTab;