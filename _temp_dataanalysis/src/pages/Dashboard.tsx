import React from 'react';
import Layout from '../components/layout/Layout';
import TechCard from '../components/ui-custom/TechCard';
import StatCard from '../components/dashboard/StatCard';
import { 
  Database, Activity, AlertTriangle, CheckCircle, 
  Map, HardDrive, Clock, ArrowRight, Camera
} from 'lucide-react';

const Dashboard = () => {
  return (
    <Layout>
      {/* Header Section */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white text-glow mb-1">数据智能分析总览</h2>
          <p className="text-sm text-muted-foreground">统计范围：全市所有在册设备及历史产生数据 | 更新时间：2025-07-11 09:42:36</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-secondary text-white text-sm rounded hover:bg-secondary/80 border border-border transition-colors">
            导出报告
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90 font-medium shadow-[0_0_10px_rgba(0,213,255,0.4)] transition-colors">
            全图检索模式
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="资产数据总量" 
          value="1,248" 
          unit="TB" 
          trend={12.5} 
          subtitle="本月新增"
          subValue="45 TB"
          icon={Database}
        />
        <StatCard 
          title="活跃设备节点" 
          value="86" 
          unit="台" 
          trend={3.2} 
          subtitle="在线率"
          subValue="92%"
          icon={Activity}
          iconColor="text-success"
          bgColor="bg-success/10"
        />
        <StatCard 
          title="处理中计算任务" 
          value="14" 
          unit="个"
          trend={-5.0}
          subtitle="排队中"
          subValue="3 个"
          icon={HardDrive}
          iconColor="text-warning"
          bgColor="bg-warning/10"
        />
        <StatCard 
          title="异常告警预警" 
          value="3" 
          unit="条"
          subtitle="红色 1 / 黄色 2"
          subValue=""
          icon={AlertTriangle}
          iconColor="text-destructive"
          bgColor="bg-destructive/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Alerts */}
        <TechCard title="实时管控动态" icon={Clock} className="lg:col-span-1" action={<button className="text-xs text-primary hover:text-primary/80">查看全部 →</button>}>
          <div className="space-y-4">
            {[
              { id: 1, type: 'danger', msg: '云端影像三维重建任务失败', detail: '高发区建模任务 (T-098) 显存溢出', time: '3分钟前' },
              { id: 2, type: 'warning', msg: '飞手李明连续两月绩效评分下降', detail: '已触发辅导提醒体系，待处理', time: '1小时前' },
              { id: 3, type: 'warning', msg: '存储空间预警阈值警告', detail: '节点 A-01 剩余空间不足 10%', time: '2小时前' },
              { id: 4, type: 'normal', msg: '每日数据巡检完成', detail: '共扫描 14,209 个文件，未发现异常', time: '今天 08:00' },
            ].map((alert) => (
              <div key={alert.id} className="flex gap-3 items-start p-3 bg-white/[0.02] border border-white/5 rounded">
                <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                  alert.type === 'danger' ? 'bg-destructive shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 
                  alert.type === 'warning' ? 'bg-warning shadow-[0_0_5px_rgba(245,158,11,0.8)]' : 'bg-primary'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{alert.msg}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{alert.detail}</p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{alert.time}</span>
              </div>
            ))}
          </div>
        </TechCard>

        {/* Middle Column - Data Type Dist */}
        <TechCard title="数据资产分类分布" icon={Database} className="lg:col-span-1">
          <div className="space-y-6 pt-2">
            {[
              { name: '正射影像 (DOM)', count: '458 组', perc: 45, color: 'bg-primary' },
              { name: '原始倾斜素材', count: '12,450 张', perc: 30, color: 'bg-blue-400' },
              { name: '数字表面模型 (DSM)', count: '124 个', perc: 15, color: 'bg-emerald-400' },
              { name: '三维实景模型', count: '86 个', perc: 10, color: 'bg-amber-400' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-foreground">{item.name}</span>
                  <span className="text-muted-foreground">{item.count}</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.perc}%` }} />
                </div>
              </div>
            ))}
          </div>
        </TechCard>

        {/* Right Column - Tasks */}
        <TechCard title="近期智能处理任务" icon={ArrowRight} className="lg:col-span-1">
           <div className="space-y-4">
            {[
              { name: '东城分区违建巡查测绘', type: '云端建模', status: '进行中', progress: 45 },
              { name: '交通非现执法视频分析', type: 'AI 识别', status: '进行中', progress: 82 },
              { name: '南山植被覆盖率分析', type: '多光谱', status: '已完成', progress: 100 },
              { name: '历史数据归档 (2024Q1)', type: '数据迁移', status: '排队中', progress: 0 },
            ].map((task, i) => (
              <div key={i} className="p-3 border border-border rounded flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white truncate max-w-[150px]">{task.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded border ${
                    task.status === '已完成' ? 'text-success border-success/30 bg-success/10' :
                    task.status === '进行中' ? 'text-primary border-primary/30 bg-primary/10' :
                    'text-muted-foreground border-border bg-secondary'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{task.type}</span>
                  <span>{task.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </TechCard>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded p-4">
        <p className="text-xs text-muted-foreground mb-3 tracking-wider">快捷操作与检索分析入口</p>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "新建云端建模任务", icon: Box3D },
            { label: "空间地图范围框选", icon: Map },
            { label: "历史违规成果复查", icon: ShieldAlert },
            { label: "上传原始测绘素材", icon: Camera },
            { label: "飞手绩效深度查询", icon: Users },
          ].map((action, i) => (
            <button key={i} className="flex items-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary/80 border border-border hover:border-primary/50 text-sm text-foreground rounded transition-all group">
              <action.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
};

// Icons needed just for this file mock
const Box3D = (props:any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" {...props}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const ShieldAlert = (props:any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const Users = (props:any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;

export default Dashboard;