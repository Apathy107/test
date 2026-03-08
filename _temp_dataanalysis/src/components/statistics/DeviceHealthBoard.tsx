import React, { useState } from 'react';
import TechCard from '../ui-custom/TechCard';
import { Activity, ChevronRight } from 'lucide-react';

const deviceRows = [
  { id: 'D041', name: 'M300-RTK 多旋翼', unit: '高新区分局', health: 92, utilization: 78, taskCost: 320, status: 'online', type: '多旋翼' },
  { id: 'D042', name: 'Mavic 3E 单兵', unit: '南山中队', health: 68, utilization: 55, taskCost: 180, status: 'warning', type: '单兵' },
  { id: 'D001', name: '机库无人机 A1', unit: '高新区分局', health: 95, utilization: 65, taskCost: 450, status: 'online', type: '机库' },
  { id: 'F09', name: '固定翼 VTOL', unit: '龙岗支队', health: 74, utilization: 42, taskCost: 620, status: 'offline', type: '固定翼' },
  { id: 'D112', name: 'Mini 3 Pro 消费级', unit: '东城大队', health: 81, utilization: 72, taskCost: 120, status: 'task', type: '单兵' },
];

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  online: { label: '在线', color: 'rgba(16,185,129,0.15)', dot: 'rgb(16,185,129)' },
  offline: { label: '离线', color: 'rgba(148,163,184,0.15)', dot: 'rgb(148,163,184)' },
  warning: { label: '告警', color: 'rgba(245,158,11,0.15)', dot: 'rgb(245,158,11)' },
  task: { label: '任务中', color: 'rgba(0,213,255,0.15)', dot: 'rgb(0,213,255)' },
};

const DeviceHealthBoard = () => {
  const [selected, setSelected] = useState<string | null>(null);

  console.log('DeviceHealthBoard rendered');

  return (
    <TechCard title="设备效能看板" icon={Activity} action={<span className="text-xs text-muted-foreground">点击行可下钻设备详情</span>}>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-muted-foreground border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <th className="text-left py-2 px-2 font-medium">设备名称</th>
              <th className="text-left py-2 px-2 font-medium">所属单位</th>
              <th className="text-center py-2 px-2 font-medium">健康度</th>
              <th className="text-center py-2 px-2 font-medium">利用率</th>
              <th className="text-center py-2 px-2 font-medium">任务成本</th>
              <th className="text-center py-2 px-2 font-medium">状态</th>
              <th className="text-center py-2 px-2 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
            {deviceRows.map((row) => {
              const sc = statusConfig[row.status];
              const isSelected = selected === row.id;
              return (
                <tr
                  key={row.id}
                  onClick={() => setSelected(isSelected ? null : row.id)}
                  className="cursor-pointer transition-colors"
                  style={{ background: isSelected ? 'rgba(0,213,255,0.05)' : 'transparent', borderColor: 'rgba(255,255,255,0.04)' }}
                >
                  <td className="py-3 px-2">
                    <div className="text-white font-medium">{row.name}</div>
                    <div className="text-muted-foreground text-[10px]">{row.id} · {row.type}</div>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground">{row.unit}</td>
                  <td className="py-3 px-2 text-center">
                    <div className="flex items-center gap-1.5 justify-center">
                      <div className="w-12 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${row.health}%`, background: row.health >= 90 ? 'rgb(16,185,129)' : row.health >= 80 ? 'rgb(0,213,255)' : row.health >= 70 ? 'rgb(245,158,11)' : 'rgb(239,68,68)' }} />
                      </div>
                      <span className="font-medium" style={{ color: row.health >= 80 ? 'rgb(0,213,255)' : 'rgb(245,158,11)' }}>{row.health}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center text-white">{row.utilization}%</td>
                  <td className="py-3 px-2 text-center text-white">¥{row.taskCost}/次</td>
                  <td className="py-3 px-2 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: sc.color, color: sc.dot }}>
                      <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ background: sc.dot, verticalAlign: 'middle' }} />
                      {sc.label}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <button className="flex items-center gap-0.5 mx-auto text-primary hover:text-primary/80">
                      详情 <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </TechCard>
  );
};

export default DeviceHealthBoard;