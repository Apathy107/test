import React from 'react';
import Layout from '../components/layout/Layout';
import DataWorkspace from '../components/layout/DataWorkspace';
import DeviceStatsTab from '../components/statistics/DeviceStatsTab';
import { Download } from 'lucide-react';

const breadcrumbs = [{ label: '数据智能中心', path: '/data' }, { label: '统计分析中心' }, { label: '设备统计' }];

export default function DeviceStats() {
  return (
    <Layout>
      <DataWorkspace
        breadcrumbs={breadcrumbs}
        actions={
          <button type="button" className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/50 text-sm text-primary rounded hover:bg-primary/20 transition-colors">
            <Download className="w-4 h-4" />
            导出统计报告
          </button>
        }
      >
        <DeviceStatsTab />
      </DataWorkspace>
    </Layout>
  );
}
