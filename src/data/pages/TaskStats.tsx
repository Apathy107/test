import React from 'react';
import Layout from '../components/layout/Layout';
import DataWorkspace from '../components/layout/DataWorkspace';
import TaskStatsTab from '../components/statistics/TaskStatsTab';
import { Download } from 'lucide-react';

const breadcrumbs = [{ label: '数据智能中心', path: '/data' }, { label: '统计分析中心' }, { label: '任务统计' }];

export default function TaskStats() {
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
        <TaskStatsTab />
      </DataWorkspace>
    </Layout>
  );
}
