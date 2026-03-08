import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Home, Plane, Route as RouteIcon, Network, Layers, Shield } from 'lucide-react';
import ModuleTopBar from '@/components/ModuleTopBar';

const BASE = '/fly';
const SIDEBAR_EXPANDED_W = 200;
const SIDEBAR_COLLAPSED_W = 64;

const navItems = [
  { path: '', icon: Plane, label: '飞行控制' },
  { path: 'routes', icon: RouteIcon, label: '航线规划' },
  { path: 'airspace', icon: Shield, label: '空域管理' },
  { path: 'workflows', icon: Network, label: '工作流管理' },
  { path: 'modeling', icon: Layers, label: '云端建模' },
];

const flyTitleMap: Record<string, string> = {
  [BASE]: '飞行控制',
  [`${BASE}/routes`]: '航线规划',
  [`${BASE}/airspace`]: '空域管理',
  [`${BASE}/workflows`]: '工作流管理',
  [`${BASE}/modeling`]: '云端建模',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const currentTitle = flyTitleMap[location.pathname] ?? navItems.find(n => location.pathname.startsWith(BASE + (n.path ? '/' + n.path : '')))?.label ?? '飞行控制中心';

  return (
    <div data-cmp="Layout" className="flex-1 flex flex-col h-screen overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* 侧栏：与人员资质管理统一样式，仅保留导航项 */}
        <aside
          className="flex-shrink-0 flex flex-col z-40 transition-[width] duration-200"
          style={{
            width: collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W,
            background: 'rgba(6, 14, 30, 1)',
            borderRight: '1px solid rgba(0, 150, 200, 0.3)',
          }}
        >
          <div
            role="button"
            tabIndex={0}
            onClick={() => setCollapsed(!collapsed)}
            onKeyDown={(e) => e.key === 'Enter' && setCollapsed(c => !c)}
            className="flex items-center border-b cursor-pointer"
            style={{
              padding: collapsed ? '16px 12px' : '16px 20px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 10,
              borderColor: 'rgba(0, 150, 200, 0.2)',
            }}
            title={collapsed ? '展开侧栏' : '收起侧栏'}
          >
            <Plane size={20} className="flex-shrink-0" style={{ color: 'rgba(0, 212, 255, 1)' }} />
            {!collapsed && (
              <div className="text-sm font-bold text-white whitespace-nowrap" title="UAV FCC 飞行控制中心">
                飞行控制中心
              </div>
            )}
          </div>

          <nav className="flex-1 py-3 overflow-y-auto">
            <Link
              to="/hub"
              className="flex items-center gap-3 py-2.5 rounded-md text-sm transition-all text-muted-foreground hover:text-white hover:bg-white/5"
              style={{
                justifyContent: collapsed ? 'center' : 'flex-start',
                paddingLeft: collapsed ? 12 : 16,
                marginLeft: 8,
                marginRight: 8,
                marginBottom: 2,
                borderLeft: location.pathname === '/hub' ? '2px solid rgba(0, 212, 255, 1)' : '2px solid transparent',
              }}
              title="导航主页"
            >
              <Home size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span>导航主页</span>}
            </Link>
            {navItems.map((item) => {
              const to = item.path ? `${BASE}/${item.path}` : BASE;
              const isActive = location.pathname === to || (item.path !== '' && location.pathname.startsWith(`${BASE}/${item.path}`));
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path || 'index'}
                  to={to}
                  className="flex items-center gap-3 py-2.5 rounded-md text-sm font-medium transition-all"
                  style={{
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    paddingLeft: collapsed ? 12 : 16,
                    marginLeft: 8,
                    marginRight: 8,
                    marginBottom: 2,
                    borderLeft: isActive ? '2px solid rgba(0, 212, 255, 1)' : '2px solid transparent',
                    background: isActive ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
                    color: isActive ? 'rgb(0, 229, 255)' : 'rgb(100, 116, 139)',
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={18} style={{ flexShrink: 0 }} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <ModuleTopBar title={currentTitle} subtitle="飞行控制中心" />
          <main className="flex-1 overflow-hidden relative">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
