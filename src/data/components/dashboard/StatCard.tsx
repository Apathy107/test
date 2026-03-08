import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title?: string;
  value?: string | number;
  unit?: string;
  trend?: number;
  subtitle?: string;
  subValue?: string;
  icon?: LucideIcon;
  iconColor?: string;
  bgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title = "数据量",
  value = "0",
  unit = "",
  trend,
  subtitle,
  subValue,
  icon: Icon,
  iconColor = "text-primary",
  bgColor = "bg-primary/10"
}) => {
  return (
    <div data-cmp="StatCard" className="bg-card border border-border p-5 rounded relative overflow-hidden group hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColor} border border-white/5`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs">
        {trend !== undefined && (
          <span className={`flex items-center ${trend >= 0 ? 'text-success' : 'text-destructive'}`}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {Math.abs(trend)}% 较上月
          </span>
        )}
        {subtitle && (
          <span className="text-muted-foreground flex items-center gap-1">
            {trend !== undefined && <span className="w-1 h-1 rounded-full bg-border inline-block mr-1" />}
            {subtitle}: <span className="text-foreground">{subValue}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;

