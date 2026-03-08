import React from 'react';
import { ShieldAlert, Server, HardDrive, Network, Cpu, MemoryStick, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import { StatCard } from '../components/dashboard/StatCard';

const Dashboard: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-8">
        
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">设备运维与监控中心</h2>
          <p className="text-sm text-muted-foreground mt-1.5 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            当前平台连接稳定，全域注册设备及微服务监控中
          </p>
        </div>

        {/* 顶部核心指标 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <StatCard 
             title="设备总数" 
             value="1,402" 
             trend="+2.1%" 
             isUp={true} 
             icon={HardDrive} 
             colorClass="bg-blue-500" 
           />
           <StatCard 
             title="在线设备" 
             value="875" 
             trend="-1.5%" 
             isUp={false} 
             icon={Network} 
             colorClass="bg-emerald-500" 
           />
           <StatCard 
             title="待处理告警" 
             value="3" 
             trend="-20%" 
             isUp={true} 
             icon={ShieldAlert} 
             colorClass="bg-red-500" 
           />
           <StatCard 
             title="微服务健康度" 
             value="99.9%" 
             trend="稳定" 
             isUp={true} 
             icon={Server} 
             colorClass="bg-primary" 
           />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 服务器状态监控（8.9 运维中心） */}
          <div className="col-span-2 bg-card tech-border rounded-xl p-6">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Cpu className="text-primary mr-2" size={20} /> 服务器集群监控
              </h3>
              <div className="flex space-x-2">
                <span className="px-2 py-1 text-xs rounded bg-secondary text-muted-foreground border border-border">最近1小时</span>
                <span className="px-2 py-1 text-xs rounded bg-primary/20 text-primary border border-primary/50">实时流</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 h-48">
              {/* CPU */}
              <div className="flex flex-col">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm text-muted-foreground">处理总核心负荷</span>
                  <span className="text-2xl font-bold font-mono text-white">42%</span>
                </div>
                <div className="flex-1 bg-secondary rounded border border-border flex items-center justify-center font-mono text-muted-foreground text-xs relative overflow-hidden group">
                  <div className="absolute bottom-0 left-0 w-full h-[42%] bg-gradient-to-t from-primary/10 to-primary/40"></div>
                  <Activity size={16} className="text-primary/50 absolute bottom-2 left-2" />
                  [ CPU 波形图预留锚点 ]
                </div>
              </div>
              
              {/* 内存 */}
              <div className="flex flex-col">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm text-muted-foreground">物理内存占用</span>
                  <span className="text-2xl font-bold font-mono text-white">28.5 <span className="text-sm font-normal text-muted-foreground">GB</span></span>
                </div>
                <div className="flex-1 bg-secondary rounded border border-border flex items-center justify-center font-mono text-muted-foreground text-xs relative overflow-hidden group">
                  <div className="absolute bottom-0 left-0 w-full h-[65%] bg-gradient-to-t from-emerald-500/10 to-emerald-500/40"></div>
                  <MemoryStick size={16} className="text-emerald-500/50 absolute bottom-2 left-2" />
                  [ 内存波形图预留锚点 ]
                </div>
              </div>
            </div>
          </div>

          {/* 实时告警动态 */}
          <div className="bg-card tech-border rounded-xl flex flex-col">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <AlertTriangle className="text-amber-500 mr-2" size={20} /> 实时预警动态
              </h3>
              <button className="text-xs text-primary hover:underline">查看全部</button>
            </div>
            <div className="p-2 flex-1 overflow-y-auto">
              <div className="space-y-1">
                {[
                  { text: '高空瞭望3号 电池电量低于20%，触发返航', time: '3分钟前', type: 'error' },
                  { text: '农业巡检1号 累计飞行超时，需保养', time: '1小时前', type: 'warn' },
                  { text: '南区基站 通信链路弱，网络丢包率超5%', time: '2小时前', type: 'warn' },
                  { text: '巡逻一号 下次例行保养预计15天后到期', time: '今日 09:00', type: 'info' }
                ].map((item, i) => (
                  <div key={i} className="flex p-3 rounded-lg hover:bg-secondary/50 transition border border-transparent hover:border-border cursor-pointer">
                    <div className="mt-1 mr-3">
                      {item.type === 'error' && <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]" />}
                      {item.type === 'warn' && <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.8)]" />}
                      {item.type === 'info' && <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_rgba(0,195,255,0.8)]" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground leading-snug">{item.text}</p>
                      <p className="text-xs text-muted-foreground mt-1.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 运维中心底部 (8.9) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card tech-border rounded-xl p-5">
             <h3 className="font-semibold text-white mb-4">微服务注册中心</h3>
             <div className="grid grid-cols-2 gap-3">
                {['设备控制链路 (MQTT)', '视频流分发网关', 'AI 算法推理前端', '航线规划求解器'].map(svc => (
                  <div key={svc} className="flex items-center justify-between bg-secondary p-3 border border-border rounded">
                    <span className="text-sm text-foreground truncate mr-2" title={svc}>{svc}</span>
                    <span className="flex items-center text-xs text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded">
                      <CheckCircle size={12} className="mr-1" /> RUNNING
                    </span>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="bg-card tech-border rounded-xl p-5">
             <h3 className="font-semibold text-white mb-4">接口与安全中心</h3>
             <div className="space-y-3">
                <button className="w-full flex items-center justify-between bg-secondary hover:bg-[#1a2d52] p-3 border border-border rounded transition">
                  <span className="text-sm text-white">系统审计与操作日志查询</span>
                  <Activity size={16} className="text-primary" />
                </button>
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center bg-secondary hover:bg-[#1a2d52] p-3 border border-border rounded transition text-sm text-white">
                    管理全域 IP 白名单
                  </button>
                  <button className="flex-1 flex items-center justify-center bg-secondary hover:bg-[#1a2d52] p-3 border border-border rounded transition text-sm text-white">
                    第三方 API 网关
                  </button>
                </div>
             </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default Dashboard;
