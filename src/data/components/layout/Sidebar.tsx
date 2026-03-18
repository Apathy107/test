import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BrainCircuit,
  FolderOpen,
  Image,
  LayoutGrid,
  Box,
  Layers,
  FileCheck,
  BarChart2,
  User,
  Cpu,
  ListTodo,
  Settings,
  Shield,
  Radar,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

const BASE = '/data';
const W_EXPANDED = 240;
const W_COLLAPSED = 64;
const sideBarBg = 'rgba(6, 14, 30, 1)';
const sideBarBorder = '1px solid rgba(0, 150, 200, 0.3)';

/** 数据资产库 */
const ASSET_TREE = [
  { name: '原始素材', path: `${BASE}/raw`, icon: Image },
  { name: '正射影像', path: `${BASE}/ortho`, icon: LayoutGrid },
  { name: '数字表面模型', path: `${BASE}/dsm`, icon: Box },
  { name: '三维模型', path: `${BASE}/model3d`, icon: Layers },
  { name: '非现业务成果', path: `${BASE}/business`, icon: FileCheck },
];

/** 统计分析中心 */
const STATS_TREE = [
  { name: '飞手统计', path: `${BASE}/pilot-stats`, icon: User },
  { name: '设备统计', path: `${BASE}/device-stats`, icon: Cpu },
  { name: '任务统计', path: `${BASE}/task-stats`, icon: ListTodo },
  { name: '黑飞统计', path: `${BASE}/black-fly-stats`, icon: Radar },
];

/** 系统管理 */
const SYSTEM_TREE = [{ name: '数据权限', path: `${BASE}/permission`, icon: Shield }];

type TreeGroup = {
  label: string;
  icon: typeof FolderOpen;
  children: { name: string; path: string; icon: React.ComponentType<{ size?: number; className?: string }> }[];
};

const TREE_GROUPS: TreeGroup[] = [
  { label: '数据资产库', icon: FolderOpen, children: ASSET_TREE },
  { label: '统计分析中心', icon: BarChart2, children: STATS_TREE },
  { label: '系统管理', icon: Settings, children: SYSTEM_TREE },
];

const isPathActive = (path: string, current: string) => current === path || (path !== BASE && current.startsWith(path));

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<string[]>(['数据资产库', '统计分析中心', '系统管理']);

  const isHub = location.pathname === '/hub';

  const toggleGroup = (label: string) => {
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    );
  };

  return (
    <div
      data-cmp="Sidebar"
      className="flex-shrink-0 min-h-screen flex flex-col relative z-10 transition-[width] duration-200"
      style={{ width: collapsed ? W_COLLAPSED : W_EXPANDED, background: sideBarBg, borderRight: sideBarBorder }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => setCollapsed(!collapsed)}
        onKeyDown={(e) => e.key === 'Enter' && setCollapsed((c) => !c)}
        className={`flex items-center cursor-pointer border-b ${collapsed ? 'justify-center py-4 px-2' : 'px-5 py-4'}`}
        style={{ borderColor: 'rgba(0, 150, 200, 0.2)' }}
        title={collapsed ? '展开侧栏' : '收起侧栏'}
      >
        <BrainCircuit className="text-primary w-6 h-6 flex-shrink-0" style={{ color: 'rgba(0, 212, 255, 1)' }} />
        {!collapsed && (
          <div className="ml-3">
            <h1 className="text-[16px] font-bold text-white tracking-wider">数据智能中心</h1>
            <p className="text-[10px] text-primary/70 tracking-[0.2em] uppercase mt-0.5">DATA INTELLIGENCE</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3">
        <Link
          to="/hub"
          className={`flex items-center gap-3 py-3 mx-2 my-0.5 rounded transition-all ${collapsed ? 'justify-center px-0' : 'px-3'}`}
          style={{
            background: isHub ? 'rgba(0, 150, 200, 0.18)' : 'transparent',
            borderLeft: isHub ? '2px solid rgba(0, 212, 255, 1)' : '2px solid transparent',
            color: isHub ? 'rgba(0, 212, 255, 1)' : 'rgba(140, 180, 210, 1)',
          }}
          title="导航主页"
        >
          <Home size={18} style={{ flexShrink: 0 }} />
          {!collapsed && <span className="text-sm font-medium">导航主页</span>}
        </Link>

        {!collapsed && (
          <div className="px-3 pt-4">
            <Link
              to={BASE}
              className={`flex items-center gap-2 py-2 rounded text-sm ${location.pathname === BASE ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}
            >
              <LayoutGrid size={18} />
              <span>智能中心总览</span>
            </Link>
          </div>
        )}

        {TREE_GROUPS.map((group) => {
          const isOpen = collapsed || expanded.includes(group.label);
          const GroupIcon = group.icon;
          return (
            <div key={group.label} className={collapsed ? 'px-2 mt-4' : 'mt-4 px-2'}>
              {collapsed ? (
                <div className="flex flex-col items-center gap-1">
                  <span title={group.label}><GroupIcon size={20} className="text-muted-foreground" /></span>
                  {group.children.map((child) => {
                    const active = isPathActive(child.path, location.pathname);
                    return (
                      <Link
                        key={child.path}
                        to={child.path}
                        title={child.name}
                        className={`flex items-center justify-center w-9 h-9 rounded ${active ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
                      >
                        <child.icon size={18} />
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.label)}
                    className="flex items-center gap-2 w-full py-2 rounded text-left text-xs font-semibold text-muted-foreground hover:text-white transition-colors"
                  >
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <GroupIcon size={16} />
                    <span>{group.label}</span>
                  </button>
                  {isOpen && (
                    <ul className="pl-6 space-y-0.5 mt-0.5">
                      {group.children.map((child) => {
                        const active = isPathActive(child.path, location.pathname);
                        return (
                          <li key={child.path}>
                            <Link
                              to={child.path}
                              className={`relative flex items-center gap-2 py-2 px-2 rounded text-sm transition-all ${
                                active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              {active && (
                                <span
                                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full"
                                  style={{ background: 'rgba(0, 212, 255, 1)' }}
                                />
                              )}
                              <child.icon size={16} className="flex-shrink-0" />
                              <span className="truncate">{child.name}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
