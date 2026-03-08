import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, List, LayoutGrid, Map } from 'lucide-react';
import { cn } from '@data/lib/utils';

export type ViewMode = 'list' | 'card' | 'map';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface DataWorkspaceProps {
  /** 面包屑：{ label, path? } */
  breadcrumbs: BreadcrumbItem[];
  /** 功能操作栏：导入/导出/新建等 */
  actions?: React.ReactNode;
  /** 视图切换：列表/卡片/地图；为 true 时隐藏「地图」按钮 */
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  /** 为 true 时不显示「地图」视图按钮（仅保留列表/卡片） */
  hideMapButton?: boolean;
  /** 筛选条件区 */
  filters?: React.ReactNode;
  /** 内容展示区 */
  children: React.ReactNode;
  /** 底部分页或加载更多 */
  pagination?: React.ReactNode;
  /** 选中项时显示的浮动操作栏（如批量下载、批量删除） */
  batchBar?: React.ReactNode;
  className?: string;
}

export default function DataWorkspace({
  breadcrumbs,
  actions,
  viewMode = 'list',
  onViewModeChange,
  hideMapButton = false,
  filters,
  children,
  pagination,
  batchBar,
  className,
}: DataWorkspaceProps) {
  return (
    <div className={cn('flex flex-col h-full min-h-0', className)}>
      {/* 面包屑 + 功能操作栏 */}
      <div className="flex-shrink-0 flex flex-wrap items-center justify-between gap-4 mb-4">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          {breadcrumbs.map((item, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={14} className="opacity-60" />}
              {item.path ? (
                <Link to={item.path} className="hover:text-primary transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
        <div className="flex items-center gap-2">{actions}</div>
      </div>

      {/* 视图切换 + 筛选区 */}
      <div className="flex-shrink-0 flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          {onViewModeChange && (
            <div className="flex rounded-lg border border-border overflow-hidden">
              {[
                { mode: 'list' as ViewMode, icon: List, label: '列表' },
                { mode: 'card' as ViewMode, icon: LayoutGrid, label: '卡片' },
                ...(hideMapButton ? [] : [{ mode: 'map' as ViewMode, icon: Map, label: '地图' }]),
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onViewModeChange(mode)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors',
                    viewMode === mode
                      ? 'bg-primary/20 text-primary border border-primary/40'
                      : 'bg-transparent text-muted-foreground hover:text-foreground border border-transparent'
                  )}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
        {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}
      </div>

      {/* 勾选后浮动操作栏 */}
      {batchBar && (
        <div className="flex-shrink-0 mb-3 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 flex items-center justify-between">
          {batchBar}
        </div>
      )}

      {/* 内容区 */}
      <div className="flex-1 min-h-0 overflow-auto">{children}</div>

      {/* 分页 */}
      {pagination && <div className="flex-shrink-0 mt-4 flex justify-end">{pagination}</div>}
    </div>
  );
}
