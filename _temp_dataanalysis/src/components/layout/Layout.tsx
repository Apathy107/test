import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div data-cmp="Layout" className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/30">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Glow Effects in background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto px-8 py-6 z-10 w-full xl:max-w-[1440px] xl:mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;