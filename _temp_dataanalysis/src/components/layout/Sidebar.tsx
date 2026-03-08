import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  Search, 
  BarChart2, 
  Settings,
  BrainCircuit,
  Map as MapIcon,
  ShieldAlert
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      group: "核心中枢",
      items: [
        { name: '智能中心总览', path: '/', icon: LayoutDashboard },
        { name: '数据分类管理', path: '/data', icon: Database, badge: 12 },
        { name: '多维统计分析', path: '/statistics', icon: BarChart2 },
      ]
    },
    {
      group: "业务应用",
      items: [
        { name: '数据检索与浏览', path: '#', icon: Search },
        { name: '三维模型云渲染', path: '#', icon: MapIcon },
        { name: '飞手效能看板', path: '#', icon: BrainCircuit },
        { name: '权限与安全', path: '#', icon: ShieldAlert },
      ]
    }
  ];

  return (
    <div data-cmp="Sidebar" className="w-[240px] flex-shrink-0 bg-card border-r border-border min-h-screen flex flex-col relative z-10">
      {/* Logo Area */}
      <div className="h-[80px] flex items-center px-6 border-b border-border bg-gradient-to-r from-card to-background">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-primary/20 border border-primary rounded shadow-glow">
            <BrainCircuit className="text-primary w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[16px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-primary text-glow tracking-wider">
              数据智能中心
            </h1>
            <p className="text-[10px] text-primary/70 tracking-[0.2em] uppercase mt-0.5">DATA INTELLIGENCE</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6">
        {menuItems.map((group, idx) => (
          <div key={idx} className="mb-8">
            <h3 className="px-6 text-xs text-muted-foreground font-semibold mb-3 tracking-wider">
              {group.group}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item, i) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={i} className="px-3">
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-3 rounded text-sm transition-all duration-300 relative group
                        ${isActive 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                        }
                      `}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_8px_rgba(0,213,255,0.8)]" />
                      )}
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-primary drop-shadow-[0_0_5px_rgba(0,213,255,0.5)]' : 'group-hover:text-primary/70'}`} />
                      <span className="font-medium flex-1">{item.name}</span>
                      
                      {item.badge && (
                        <span className="bg-destructive/20 text-destructive text-[10px] px-2 py-0.5 rounded-full border border-destructive/50">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Area */}
      <div className="p-4 border-t border-border">
        <Link to="#" className="flex items-center gap-3 px-3 py-3 text-sm text-muted-foreground hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium">系统集成支撑</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;