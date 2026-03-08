import React from 'react';
import Layout from '../components/layout/Layout';
import TechCard from '../components/ui-custom/TechCard';
import DistributionChart from '../components/dashboard/DistributionChart';
import {  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Statistics = () => {
  // Mock data for Line Chart
  const lineData = [
    { name: '一分队', TCO: 4000, 任务收益: 6400 },
    { name: '二分队', TCO: 3000, 任务收益: 3398 },
    { name: '三分队', TCO: 2000, 任务收益: 9800 },
    { name: '四分队', TCO: 2780, 任务收益: 3908 },
    { name: '五分队', TCO: 1890, 任务收益: 4800 },
    { name: '六分队', TCO: 3390, 任务收益: 3800 },
  ];

  // Mock data for Pie Chart
  const pieData = [
    { name: '动力系统', value: 400 },
    { name: '通信链路', value: 300 },
    { name: '云台相机', value: 300 },
    { name: '电池模组', value: 200 },
    { name: '飞控模块', value: 100 },
  ];
  const COLORS = ['rgb(0, 213, 255)', 'rgb(16, 185, 129)', 'rgb(245, 158, 11)', 'rgb(239, 68, 68)', 'rgb(139, 92, 246)'];

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white text-glow mb-1">多维效能与统计报表</h2>
        <p className="text-sm text-muted-foreground">汇聚飞手资质、设备健康度、任务效能 (7.4 - 7.6 规范数据)</p>
      </div>

      {/* Tabs / Filter logic mock */}
      <div className="flex gap-2 mb-6 border-b border-border/50 pb-2">
         <button className="px-4 py-2 bg-primary/10 border border-primary/50 text-primary rounded text-sm font-medium">设备综合效能分析 (7.5)</button>
         <button className="px-4 py-2 bg-transparent text-muted-foreground hover:text-white rounded text-sm transition-colors">飞手能力与预警 (7.4)</button>
         <button className="px-4 py-2 bg-transparent text-muted-foreground hover:text-white rounded text-sm transition-colors">业务任务看板 (7.6)</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Device Health Trend */}
        <TechCard title="网格化作业任务效能趋势" glow={true}>
          <DistributionChart />
        </TechCard>

        {/* Cost / ROI Line Chart */}
        <TechCard title="各单位设备成本效益 (TCO vs ROI)">
           <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgb(15, 23, 42)', border: '1px solid rgb(30, 58, 138)', borderRadius: '4px' }}
                  itemStyle={{ fontSize: '14px' }}
                />
                <Line type="monotone" dataKey="任务收益" stroke="rgb(0, 213, 255)" strokeWidth={3} dot={{ r: 4, fill: 'rgb(0, 213, 255)' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="TCO" stroke="rgb(245, 158, 11)" strokeWidth={2} dot={{ r: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TechCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fault Root Cause Distribution */}
        <TechCard title="故障根因分布分析 (近6个月)">
           <div className="h-[250px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgb(15, 23, 42)', border: '1px solid opacity-20' }} 
                  itemStyle={{ color: 'white' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
               <div className="text-2xl font-bold text-white">1,300</div>
               <div className="text-[10px] text-muted-foreground">总故障数</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center pb-2">
             {pieData.map((entry, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                   {entry.name}
                </div>
             ))}
          </div>
        </TechCard>

        {/* Top 3 List Cards */}
        <TechCard title="高频故障设备 TOP 3" className="lg:col-span-1">
          <div className="space-y-4 pt-2">
             {[
               { id: 'M300-RTK (D041)', count: 12, time: 'MTTR: 8.5h', color: 'text-destructive' },
               { id: 'Mavic 3E (D112)', count: 8, time: 'MTTR: 4.2h', color: 'text-warning' },
               { id: '固定翼 VTOL (F09)', count: 5, time: 'MTTR: 12h', color: 'text-primary' },
             ].map((item, i) => (
               <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] border border-border/50 rounded">
                 <div className="flex items-center gap-3">
                   <span className={`text-lg font-black opacity-50 italic ${item.color}`}>0{i+1}</span>
                   <div>
                     <p className="text-sm font-medium text-white">{item.id}</p>
                     <p className="text-xs text-muted-foreground">{item.time}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-lg font-bold text-white">{item.count}<span className="text-xs font-normal text-muted-foreground ml-1">次</span></p>
                 </div>
               </div>
             ))}
          </div>
        </TechCard>

         <TechCard title="飞手资质未处理预警 TOP 3">
          <div className="space-y-4 pt-2">
             {[
               { name: '高新区分局', count: 5, detail: '超视距执照过期', val: '24%' },
               { name: '南山中队', count: 3, detail: '未完成季度复审', val: '15%' },
               { name: '交通管理局特勤', count: 2, detail: '机型资质不符', val: '8%' },
             ].map((item, i) => (
               <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] border border-border/50 rounded">
                 <div>
                   <p className="text-sm font-medium text-white">{item.name}</p>
                   <p className="text-xs text-muted-foreground/70">{item.detail}</p>
                 </div>
                 <div className="text-right">
                   <div className="text-warning text-sm font-bold">{item.count} 人</div>
                   <div className="text-muted-foreground text-[10px]">占比 {item.val}</div>
                 </div>
               </div>
             ))}
          </div>
        </TechCard>
      </div>
    </Layout>
  );
};

export default Statistics;

