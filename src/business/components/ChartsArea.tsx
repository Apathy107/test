import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const barData = [
  { name: 'Mon', count: 120 },
  { name: 'Tue', count: 180 },
  { name: 'Wed', count: 250 },
  { name: 'Thu', count: 210 },
  { name: 'Fri', count: 290 },
  { name: 'Sat', count: 140 },
  { name: 'Sun', count: 90 },
];

const pieData = [
  { name: 'Auto Capture', value: 75 },
  { name: 'Semi-auto', value: 25 },
];
const COLORS = ['#06b6d4', '#3b82f6']; // cyan-500, blue-500

const ChartsArea: React.FC = () => {
  return (
    <div data-cmp="ChartsArea" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 行违趋势统计 */}
      <div className="lg:col-span-2 bg-[#141b2d] border border-slate-800 rounded-xl p-5">
        <h3 className="text-slate-200 text-sm font-semibold mb-4">违法行为趋势统计 (Violation Trends)</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: '#1e293b' }}
                contentStyle={{ backgroundColor: '#0f1522', borderColor: '#1e293b', color: '#f1f5f9' }}
              />
              <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 抓拍类型统计 */}
      <div className="bg-[#141b2d] border border-slate-800 rounded-xl p-5">
        <h3 className="text-slate-200 text-sm font-semibold mb-4">抓拍类型统计 (Capture Types)</h3>
        <div className="h-[250px] w-full relative flex flex-col items-center justify-center">
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
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f1522', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col text-center mt-2 pointer-events-none">
            <span className="text-2xl font-bold text-white">100%</span>
            <span className="text-xs text-slate-500">Total</span>
          </div>
          
          <div className="flex justify-center space-x-6 mt-2 w-full">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsArea;

