import React from 'react';

interface CyberPanelProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export default function CyberPanel({ title, children, className = "", headerIcon, rightAction }: CyberPanelProps) {
  return (
    <div data-cmp="CyberPanel" className={`bg-card tech-border rounded-sm flex flex-col ${className}`}>
      {title && (
        <div className="h-10 border-b border-border/80 flex items-center justify-between px-4 bg-gradient-to-r from-secondary/40 to-transparent">
          <div className="flex items-center gap-2">
            {headerIcon && <span className="text-primary">{headerIcon}</span>}
            <h2 className="text-sm font-medium text-primary tracking-wider">{title}</h2>
          </div>
          {rightAction && <div>{rightAction}</div>}
        </div>
      )}
      <div className="flex-1 p-4 overflow-hidden relative">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/50" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/50" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/50" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/50" />
        {children}
      </div>
    </div>
  );
}