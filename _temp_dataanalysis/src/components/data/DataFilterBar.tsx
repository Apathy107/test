import React from 'react';
import { Search, Filter, Calendar, MapPin } from 'lucide-react';

const DataFilterBar = () => {
  return (
    <div data-cmp="DataFilterBar" className="flex flex-col gap-4 p-4 bg-card border border-border rounded mb-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 w-full max-w-md relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input 
            type="text" 
            placeholder="输入任务名称 / 文件名 / 设备 SN 检索..."
            className="w-full bg-secondary border border-border text-sm text-foreground rounded pl-9 pr-4 py-2 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select className="bg-secondary border border-border text-sm text-foreground rounded px-3 py-2 focus:outline-none focus:border-primary/50 appearance-none min-w-[120px]">
            <option>所有数据类型</option>
            <option>原始素材</option>
            <option>正射影像 (DOM)</option>
            <option>三维实景模型</option>
            <option>非现业务成果</option>
          </select>
          
          <button className="flex items-center gap-2 px-3 py-2 bg-secondary border border-border hover:border-primary/50 text-sm text-foreground rounded transition-colors">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            时间范围
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 bg-secondary border border-border hover:border-primary/50 text-sm text-foreground rounded transition-colors text-primary border-primary/30">
            <MapPin className="w-4 h-4" />
            开启空间检索
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 bg-secondary border border-border hover:bg-secondary/80 text-sm text-foreground rounded transition-colors ml-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            更多筛选
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataFilterBar;