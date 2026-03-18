import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import ModuleTopBar from '@/components/ModuleTopBar';

const dataTitleMap: Record<string, string> = {
  '/data': '智能中心总览',
  '/data/management': '数据分类管理',
  '/data/statistics': '多维统计分析',
  '/data/raw': '原始素材',
  '/data/ortho': '正射影像',
  '/data/dsm': '数字表面模型',
  '/data/model3d': '三维模型',
  '/data/business': '非现业务成果',
  '/data/pilot-stats': '飞手统计',
  '/data/device-stats': '设备统计',
  '/data/task-stats': '任务统计',
  '/data/black-fly-stats': '黑飞统计',
  '/data/permission': '数据权限',
};

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const title = dataTitleMap[location.pathname] || '数据智能中心';
  return (
    <div data-cmp="Layout" className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/30">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <ModuleTopBar title={title} subtitle="数据智能中心" />
        {/* Glow Effects in background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto px-8 py-6 z-10 w-full xl:max-w-[1920px] xl:mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

