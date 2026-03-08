import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import PilotStatsTab from '../components/statistics/PilotStatsTab';
import DeviceStatsTab from '../components/statistics/DeviceStatsTab';
import TaskStatsTab from '../components/statistics/TaskStatsTab';
import { Users, Cpu, ListChecks, Download, RefreshCw } from 'lucide-react';

const tabs = [
  { id: 'pilot', label: '飞手统计', subLabel: 'PILOT ANALYTICS', icon: Users },
  { id: 'device', label: '设备统计', subLabel: 'DEVICE ANALYTICS', icon: Cpu },
  { id: 'task', label: '任务统计', subLabel: 'TASK ANALYTICS', icon: ListChecks },
];

const Statistics = () => {
  const [activeTab, setActiveTab] = useState<'pilot' | 'device' | 'task'>('pilot');

  console.log('Statistics page rendered, activeTab:', activeTab);

  return (
    <Layout>
      <div style={{ width: '100%', maxWidth: '1440px' }}>
        {/* Page Header */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1" style={{ textShadow: '0 0 10px rgba(0, 213, 255, 0.5)' }}>
              多维效能统计分析中心
            </h2>
            <p className="text-sm text-muted-foreground">
              数据统计范围：全市所有在册飞手 / 设备 / 任务 &nbsp;|&nbsp; 统计更新：2025-07-11 09:42:36
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border text-sm text-foreground rounded hover:border-primary/50 transition-colors">
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
              刷新数据
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/50 text-sm text-primary rounded hover:bg-primary/20 transition-colors" style={{ boxShadow: '0 0 10px rgba(0, 213, 255, 0.2)' }}>
              <Download className="w-4 h-4" />
              导出统计报告
            </button>
          </div>
        </div>

        {/* Module Tab Switcher */}
        <div className="flex gap-3 mb-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'pilot' | 'device' | 'task')}
                className="flex items-center gap-3 px-6 py-4 rounded border transition-all duration-300 relative overflow-hidden"
                style={{
                  background: isActive ? 'rgba(0, 213, 255, 0.08)' : 'rgba(15, 23, 42, 0.8)',
                  borderColor: isActive ? 'rgba(0, 213, 255, 0.6)' : 'rgba(30, 58, 138, 1)',
                  boxShadow: isActive ? '0 0 15px rgba(0, 213, 255, 0.15), inset 0 0 15px rgba(0, 213, 255, 0.03)' : 'none',
                  minWidth: '180px',
                }}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, rgb(0, 213, 255), transparent)' }} />
                )}
                <div className={`w-9 h-9 rounded flex items-center justify-center`} style={{ background: isActive ? 'rgba(0, 213, 255, 0.15)' : 'rgba(30, 41, 59, 1)' }}>
                  <tab.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="text-left">
                  <div className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>{tab.label}</div>
                  <div className="text-[10px] text-muted-foreground tracking-wider">{tab.subLabel}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'pilot' && <PilotStatsTab />}
          {activeTab === 'device' && <DeviceStatsTab />}
          {activeTab === 'task' && <TaskStatsTab />}
        </div>
      </div>
    </Layout>
  );
};

export default Statistics;