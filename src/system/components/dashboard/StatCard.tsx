import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  isUp?: boolean;
  icon: LucideIcon;
  colorClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, isUp, icon: Icon, colorClass }) => {
  return (
    <div className="bg-card tech-border p-6 rounded-xl relative overflow-hidden" data-cmp="StatCard">
      {/* 装饰性背景 */}
      <div className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full blur-3xl opacity-20 ${colorClass}`}></div>
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-widest font-mono">{value}</h3>
          
          {trend && (
             <div className="mt-3 flex items-center text-xs">
               <span className={`font-semibold px-2 py-0.5 rounded ${isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                 {trend}
               </span>
               <span className="text-muted-foreground ml-2">相比昨日</span>
             </div>
          )}
        </div>
        <div className={`p-4 rounded-lg bg-secondary border border-border flex items-center justify-center`}>
          <Icon size={24} className={`text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]`} />
        </div>
      </div>
    </div>
  );
}
