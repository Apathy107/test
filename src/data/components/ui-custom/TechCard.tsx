import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TechCardProps {
  title?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  glow?: boolean;
}

const TechCard: React.FC<TechCardProps> = ({ 
  title, 
  icon: Icon, 
  children, 
  className = "",
  action,
  glow = false
}) => {
  return (
    <div 
      data-cmp="TechCard" 
      className={`bg-card/80 backdrop-blur-sm border border-border relative overflow-hidden rounded ${glow ? 'shadow-glow' : ''} ${className}`}
    >
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary/50" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary/50" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary/50" />

      {title && (
        <div className="flex justify-between items-center px-5 py-4 border-b border-border/50 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-primary" />}
            <h3 className="font-semibold text-white tracking-wide">{title}</h3>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};

export default TechCard;

