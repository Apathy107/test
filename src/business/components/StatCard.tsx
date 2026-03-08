import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  color?: 'cyan' | 'blue' | 'red' | 'green';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title = "Statistics", 
  value = "0", 
  trend, 
  trendUp, 
  icon: Icon,
  color = 'cyan'
}) => {
  const colorMap = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20'
  };

  return (
    <div data-cmp="StatCard" className="bg-[#141b2d] border border-slate-800 rounded-xl p-5 relative overflow-hidden group hover:border-slate-600 transition-colors cursor-default">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity ${colorMap[color].split(' ')[0]}`}></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="text-slate-400 text-sm font-medium">{title}</div>
        <div className={`p-2 rounded-lg border ${colorMap[color]}`}>
          <Icon size={18} />
        </div>
      </div>
      
      <div className="flex items-baseline space-x-2 relative z-10">
        <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
        {trend && (
          <span className={`text-xs font-medium ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;

