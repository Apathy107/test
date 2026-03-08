import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  Building2,
  Lightbulb,
  Plane,
  Home,
} from 'lucide-react';
import ModuleTopBar from '@/components/ModuleTopBar';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

const SIDEBAR_EXPANDED_W = 240;
const SIDEBAR_COLLAPSED_W = 72;

const menuItems = [
  { path: '/hub', icon: Home, cname: '导航主页' },
  { path: '/business', icon: LayoutDashboard, cname: '业务应用总览' },
  { path: '/business/traffic', icon: Video, cname: '交通非现执法' },
  { path: '/business/urban', icon: Building2, cname: '城市综合治理' },
  { path: '/business/emergency', icon: Lightbulb, cname: '通用应急应用' },
];

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div data-cmp="AppLayout" className="w-full bg-[#0a0e17] flex justify-center min-h-screen">
      <div className="w-full max-w-[1920px] flex shadow-2xl relative bg-[#0f1522] overflow-hidden min-h-screen">
        {/* 左侧导航栏 - DRONEOPS 风格 */}
        <aside
          className="flex-shrink-0 flex flex-col z-10 transition-[width] duration-200"
          style={{
            width: collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W,
            background: 'rgb(15, 23, 42)',
            borderRight: '1px solid rgba(30, 41, 59, 0.8)',
          }}
        >
          {/* Header: Logo + 业务应用中心 / Business Application Center */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setCollapsed(!collapsed)}
            onKeyDown={(e) => e.key === 'Enter' && setCollapsed(c => !c)}
            style={{
              padding: collapsed ? '20px 14px' : '20px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
              borderBottom: '1px solid rgba(51, 65, 85, 0.6)',
              minHeight: 64,
            }}
            title={collapsed ? '展开侧栏' : '收起侧栏'}
          >
            <Plane size={28} style={{ color: 'rgb(34, 211, 238)', flexShrink: 0 }} />
            {!collapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'rgb(34, 211, 238)' }}>
                  业务应用中心
                </span>
                <span style={{ fontSize: '10px', color: 'rgba(148, 163, 184, 1)', letterSpacing: '0.05em' }}>
                  Business Application Center
                </span>
              </div>
            )}
          </div>

          <nav className="flex-1 py-2 overflow-y-auto" style={{ paddingLeft: 12, paddingRight: 12 }}>
            {menuItems.map((item) => {
              const active = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: collapsed ? '14px 10px' : '12px 16px',
                    marginBottom: 4,
                    borderRadius: 8,
                    textDecoration: 'none',
                    background: active ? 'rgba(30, 58, 138, 0.5)' : 'transparent',
                    color: active ? 'rgb(34, 211, 238)' : 'rgba(148, 163, 184, 1)',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                  title={collapsed ? item.cname : undefined}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'rgba(51, 65, 85, 0.4)';
                      e.currentTarget.style.color = 'rgba(203, 213, 225, 1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(148, 163, 184, 1)';
                    }
                  }}
                >
                  <Icon size={20} style={{ flexShrink: 0, color: 'inherit' }} />
                  {!collapsed && <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.cname}</span>}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <ModuleTopBar title={title} subtitle="业务应用中心" />
          <main className="flex-1 flex flex-col min-h-0 overflow-auto bg-[#0f1522] p-6 custom-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
