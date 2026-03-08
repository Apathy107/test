import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Server,
  Building2,
  Users,
  ShieldCheck,
  Settings,
  Activity,
  MessageSquareWarning,
  Cpu,
  FileText,
  Plug,
  Shield,
  Gauge,
  Menu,
  BookOpen,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import ModuleTopBar from '@/components/ModuleTopBar';

interface LayoutProps {
  children: React.ReactNode;
}

const BASE = '/system';

/** 顶层导航（1～8） */
const topLevelItems = [
  { path: BASE, label: '运维中心', icon: Activity },
  { path: `${BASE}/organization`, label: '组织管理', icon: Building2 },
  { path: `${BASE}/users`, label: '用户管理', icon: Users },
  { path: `${BASE}/roles`, label: '角色管理', icon: ShieldCheck },
  { path: `${BASE}/messages`, label: '消息管理', icon: MessageSquareWarning },
  { path: `${BASE}/algorithms`, label: '算法管理', icon: Cpu },
  { path: `${BASE}/api-center`, label: '接口中心', icon: Plug },
  { path: `${BASE}/service-monitor`, label: '服务监控', icon: Gauge },
];

/** 系统管理（9）及其子菜单 */
const systemGroup = {
  label: '系统管理',
  icon: Settings,
  children: [
    { path: `${BASE}/menu-manage`, label: '菜单管理', icon: Menu },
    { path: `${BASE}/dict-manage`, label: '字典管理', icon: BookOpen },
    { path: `${BASE}/audit-log`, label: '审计日志', icon: FileText },
    { path: `${BASE}/ip-whitelist`, label: 'IP白名单', icon: Shield },
    { path: `${BASE}/settings`, label: '系统设置', icon: Settings },
  ],
};

const allPaths = [
  ...topLevelItems.map((i) => ({ path: i.path, label: i.label })),
  ...systemGroup.children.map((i) => ({ path: i.path, label: i.label })),
];

const SIDEBAR_EXPANDED_W = 210;
const SIDEBAR_COLLAPSED_W = 64;

export const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [userExpanded, setUserExpanded] = useState(false);
  const isSystemChildActive = systemGroup.children.some((c) => location.pathname === c.path);
  const systemExpanded = userExpanded || isSystemChildActive;
  const currentLabel =
    allPaths.find((i) => i.path === location.pathname)?.label || '系统支撑平台';

  return (
    <div className="flex h-screen w-full bg-[#050A14] justify-center system-support-theme" data-cmp="AdminLayout">
      <div className="flex w-full max-w-[1920px] h-full bg-background border-x border-[#121f3a] relative overflow-hidden">
        <aside
          className="flex-shrink-0 flex flex-col z-20 transition-[width] duration-200"
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
            onKeyDown={(e) => e.key === 'Enter' && setCollapsed((c) => !c)}
            className="flex items-center border-b border-[#1a2d52] cursor-pointer"
            style={{
              padding: collapsed ? '16px 12px' : '16px 20px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 10,
            }}
            title={collapsed ? '展开侧栏' : '收起侧栏'}
          >
            <Server size={20} className="text-primary flex-shrink-0" style={{ color: 'rgba(0, 212, 255, 1)' }} />
            {!collapsed && (
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">SYSTEM SUPPORT</div>
                <div className="text-sm font-bold text-white">系统支撑平台</div>
              </div>
            )}
          </div>

          <nav className="flex-1 py-3 overflow-y-auto">
            <Link
              to="/hub"
              className={`flex items-center gap-3 py-2.5 rounded-md text-sm transition-all ${
                location.pathname === '/hub' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`}
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

            {/* （1）～（8）顶层 */}
            {topLevelItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                    isActive ? 'bg-[var(--sidebar-active)] text-primary border-l-2 border-primary' : 'text-muted-foreground hover:text-white hover:bg-secondary'
                  }`}
                  style={{
                    paddingLeft: collapsed ? 12 : 16,
                    marginLeft: 8,
                    marginRight: 8,
                    marginBottom: 2,
                    borderLeft: isActive ? undefined : '2px solid transparent',
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={isActive ? 'text-primary' : 'text-slate-400'} size={18} style={{ flexShrink: 0 }} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}

            {/* （9）系统管理（折叠组） */}
            {collapsed ? (
              systemGroup.children.map((child) => {
                const isActive = location.pathname === child.path;
                return (
                  <Link
                    key={child.path}
                    to={child.path}
                    className={`flex items-center justify-center py-2.5 rounded-md text-sm font-medium transition-all ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-white hover:bg-secondary'
                    }`}
                    style={{ marginLeft: 8, marginRight: 8, marginBottom: 2 }}
                    title={child.label}
                  >
                    <child.icon size={18} style={{ flexShrink: 0 }} />
                  </Link>
                );
              })
            ) : (
              <div className="mt-1">
                <button
                  type="button"
                  onClick={() => setUserExpanded((e) => !e)}
                  className="flex items-center gap-3 w-full py-2.5 rounded-md text-sm font-medium transition-all text-muted-foreground hover:text-white hover:bg-secondary"
                  style={{ paddingLeft: 16, marginLeft: 8, marginRight: 8, marginBottom: 2 }}
                >
                  {systemExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <systemGroup.icon size={18} className={isSystemChildActive ? 'text-primary' : 'text-slate-400'} />
                  <span>{systemGroup.label}</span>
                </button>
                {systemExpanded &&
                  systemGroup.children.map((child) => {
                    const isActive = location.pathname === child.path;
                    return (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`flex items-center gap-3 py-2 rounded-md text-sm transition-all ${
                          isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-white hover:bg-secondary'
                        }`}
                        style={{
                          paddingLeft: 16 + 20,
                          marginLeft: 8,
                          marginRight: 8,
                          marginBottom: 2,
                          borderLeft: isActive ? '2px solid rgba(0, 212, 255, 1)' : '2px solid transparent',
                        }}
                      >
                        <child.icon size={16} style={{ flexShrink: 0 }} />
                        <span>{child.label}</span>
                      </Link>
                    );
                  })}
              </div>
            )}
          </nav>
        </aside>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background relative">
          <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMzAsIDU1LCA5MCwgMC4yKSIvPjwvc3ZnPg==')] z-0"></div>
          <ModuleTopBar title={currentLabel} subtitle="系统支撑平台" />
          <main className="flex-1 overflow-y-auto p-6 relative z-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
