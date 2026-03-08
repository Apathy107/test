import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: '1月', 巡检完成率: 85, 异常率: 15 },
  { name: '2月', 巡检完成率: 88, 异常率: 10 },
  { name: '3月', 巡检完成率: 92, 异常率: 8 },
  { name: '4月', 巡检完成率: 90, 异常率: 6 },
  { name: '5月', 巡检完成率: 95, 异常率: 5 },
  { name: '6月', 巡检完成率: 98, 异常率: 2 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded shadow-custom">
        <p className="text-white font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DistributionChart = () => {
  return (
    <div data-cmp="DistributionChart" className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="name" stroke="rgb(148,163,184)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="rgb(148,163,184)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 213, 255, 0.05)' }} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Bar dataKey="巡检完成率" fill="rgb(0, 213, 255)" radius={[4, 4, 0, 0]} maxBarSize={40} />
          <Bar dataKey="异常率" fill="rgb(239, 68, 68)" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DistributionChart;