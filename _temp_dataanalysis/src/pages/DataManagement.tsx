import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import DataFilterBar from '../components/data/DataFilterBar';
import { Image, FileVideo, Box, Download, Trash2, Eye, PlayCircle } from 'lucide-react';

const DataManagement = () => {
  const [activeTab, setActiveTab] = useState('raw');

  const tabs = [
    { id: 'raw', label: '原始素材', count: 1420 },
    { id: 'dom', label: '正射影像', count: 85 },
    { id: '3d', label: '三维模型', count: 32 },
    { id: 'business', label: '业务成果', count: 512 },
  ];

  // Mock data for Raw Materials
  const mockRawData = [
    { id: 'TASK-20231012-001', sn: 'DJI-M300-001', type: 'image', name: 'DJI_0041.JPG', size: '12.4 MB', date: '2023-10-12 14:00' },
    { id: 'TASK-20231012-001', sn: 'DJI-M300-001', type: 'image', name: 'DJI_0042.JPG', size: '11.8 MB', date: '2023-10-12 14:01' },
    { id: 'TASK-20231012-002', sn: 'UAV-T01-042', type: 'video', name: 'VID_01.MP4', size: '450.2 MB', date: '2023-10-13 09:30' },
    { id: 'TASK-20231014-005', sn: 'DJI-M300-003', type: 'image', name: 'DJI_0102.JPG', size: '14.1 MB', date: '2023-10-14 11:20' },
    { id: 'TASK-20231014-005', sn: 'DJI-M300-003', type: 'image', name: 'DJI_0103.JPG', size: '13.9 MB', date: '2023-10-14 11:21' },
    { id: 'TASK-20231015-001', sn: 'UAV-T01-011', type: 'video', name: 'VID_HIGH_RES.MP4', size: '1.2 GB', date: '2023-10-15 16:45' },
  ];

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white text-glow mb-1">数据资产管理与检阅</h2>
          <p className="text-sm text-muted-foreground">分类管理历史作业产生的所有媒体与结果文件，支持在线预览与模型重建流转。</p>
        </div>
      </div>

      <DataFilterBar />

      <div className="flex mb-6 border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-white'
            }`}
          >
            {tab.label} ({tab.count})
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_10px_rgba(0,213,255,0.8)]" />
            )}
          </button>
        ))}
      </div>

      {/* Toolbox for list actions */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="form-checkbox h-4 w-4 text-primary bg-secondary border-border rounded" />
            <span className="text-sm text-muted-foreground">全选本页</span>
          </label>
          <span className="text-sm text-muted-foreground italic px-2">已选 0 项</span>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary hover:bg-secondary/80 border border-border text-xs text-foreground rounded transition-colors disabled:opacity-50">
            <Box className="w-3.5 h-3.5" /> 发起云端建模
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 border border-primary/50 text-xs text-primary rounded transition-colors">
            <Download className="w-3.5 h-3.5" /> 批量打包 (.zip)
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 text-xs text-destructive rounded transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> 批量删除
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {mockRawData.map((item, i) => (
          <div key={i} className="bg-card border border-border rounded overflow-hidden group hover:border-primary/50 transition-all relative">
             <div className="absolute top-2 left-2 z-10">
               <input type="checkbox" className="form-checkbox h-4 w-4 text-primary bg-black/50 border-white/30 rounded" />
             </div>
             <div className="aspect-[4/3] bg-muted relative flex items-center justify-center overflow-hidden">
                {item.type === 'video' ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                    <FileVideo className="w-8 h-8 text-white/50 mb-2" />
                    <PlayCircle className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity absolute cursor-pointer hover:scale-110 duration-200" />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image className="w-8 h-8 text-white/20" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button className="bg-black/60 p-2 rounded hover:bg-primary/80 transition-colors text-white" title="在线预览 (EXIF)">
                         <Eye className="w-4 h-4" />
                      </button>
                      <button className="bg-black/60 p-2 rounded hover:bg-primary/80 transition-colors text-white" title="下载原图">
                         <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                {/* Simulated image content for variety */}
                {i % 2 === 0 && <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-blue-500 to-green-500 blend-overlay" />}
                <div className="absolute bottom-1 right-2 bg-black/70 px-1.5 py-0.5 rounded text-[10px] text-white backdrop-blur-md">
                   {item.size}
                </div>
             </div>
             <div className="p-3 border-t border-border/50">
               <div className="text-xs font-medium text-white truncate mb-1" title={item.name}>{item.name}</div>
               <div className="text-[10px] text-muted-foreground flex justify-between">
                  <span className="truncate w-2/3">{item.id}</span>
               </div>
               <div className="text-[10px] text-muted-foreground/70 mt-1">
                 {item.date}
               </div>
             </div>
          </div>
        ))}
      </div>
      
      {/* Pagination Mock */}
      <div className="mt-6 flex justify-between items-center text-sm text-muted-foreground">
        <div>共 1,420 条数据</div>
        <div className="flex gap-1">
          <button className="px-3 py-1 bg-secondary border border-border rounded disabled:opacity-50">上一页</button>
          <button className="px-3 py-1 bg-primary text-black font-medium border border-primary rounded">1</button>
          <button className="px-3 py-1 bg-secondary border border-border hover:border-primary/50 rounded">2</button>
          <button className="px-3 py-1 bg-secondary border border-border hover:border-primary/50 rounded">3</button>
          <button className="px-3 py-1 bg-secondary border border-border rounded">...</button>
          <button className="px-3 py-1 bg-secondary border border-border hover:border-primary/50 rounded">下一页</button>
        </div>
      </div>
    </Layout>
  );
};

export default DataManagement;