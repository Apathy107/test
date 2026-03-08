import React, { useState, useEffect } from 'react';
import { Save, UploadCloud, MonitorSmartphone, Loader2 } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import { getAppearanceConfig, saveAppearanceConfig, defaultAppearance, type AppearanceConfig } from '../api/settingsApi';
import { useAudit } from '@/contexts/AuditContext';

const Settings: React.FC = () => {
  const { addLog } = useAudit();
  const [activeTab, setActiveTab] = useState('appearance');
  const [appearance, setAppearance] = useState<AppearanceConfig>(() => ({ ...defaultAppearance }));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAppearanceConfig()
      .then((data) => {
        if (!cancelled) setAppearance(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      await saveAppearanceConfig(appearance);
      addLog({ actionType: '修改', module: '系统设置', targetObject: '平台视觉面貌', detailSummary: `保存平台名称「${appearance.platformName}」、语言、标签页等配置` });
      setSaveMessage({ type: 'success', text: '配置已保存' });
    } catch (e) {
      setSaveMessage({ type: 'error', text: e instanceof Error ? e.message : '保存失败' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto bg-card tech-border rounded-xl min-h-[700px] flex flex-col mb-8 overflow-hidden">
        
        {/* Settings Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/40 relative">
           <div className="absolute right-0 top-0 w-48 h-full bg-[linear-gradient(to_left,rgba(0,195,255,0.05),transparent)] pointer-events-none"></div>
           <div className="relative z-10">
             <h2 className="text-2xl font-bold text-white tracking-wide">高级系统参数</h2>
             <p className="text-sm text-muted-foreground mt-1">重置管理平台标识门面、飞行环境底层阈值设定等全局枚举量。</p>
           </div>
           <div className="flex items-center gap-3 relative z-10">
             {saveMessage && (
               <span className={`text-xs ${saveMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                 {saveMessage.text}
               </span>
             )}
             <button
               className="bg-primary hover:bg-primary/90 text-background px-5 py-2 rounded-md font-medium text-sm flex items-center transition shadow-[0_0_15px_rgba(0,195,255,0.4)] disabled:opacity-60 disabled:pointer-events-none"
               onClick={handleSaveAll}
               disabled={saving || loading}
             >
               {saving ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
               固化存储配置
             </button>
           </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border px-6 pt-4 space-x-6 bg-background/50">
           <button 
             className={`pb-3 border-b-2 font-medium text-sm transition-colors tracking-wide ${activeTab === 'appearance' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-white'}`}
             onClick={() => setActiveTab('appearance')}
           >
             平台视觉面貌
           </button>
           <button 
             className={`pb-3 border-b-2 font-medium text-sm transition-colors tracking-wide ${activeTab === 'dict' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-white'}`}
             onClick={() => setActiveTab('dict')}
           >
             基准阈值校验与字典
           </button>
           <button 
             className={`pb-3 border-b-2 font-medium text-sm transition-colors tracking-wide ${activeTab === 'sys' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-white'}`}
             onClick={() => setActiveTab('sys')}
           >
             底层分发与授权信息
           </button>
        </div>

        {/* Tab Content */}
        <div className="p-8 flex-1 bg-background/20 relative z-0">
          {loading && (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 size={24} className="animate-spin mr-2" /> 加载配置中…
            </div>
          )}
          {!loading && activeTab === 'appearance' && (
            <div className="space-y-8 animate-in fade-in duration-300">
               <h4 className="text-sm font-semibold text-slate-300 border-l-2 border-primary pl-2">平台视觉面貌</h4>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                   <div>
                     <label className="block text-sm font-semibold text-slate-300 mb-2">平台名称</label>
                     <input
                       type="text"
                       value={appearance.platformName}
                       onChange={(e) => setAppearance((p) => ({ ...p, platformName: e.target.value }))}
                       className="w-full px-4 py-2 bg-background border border-border rounded-md text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                       placeholder="如：无人机综合管控平台"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-semibold text-slate-300 mb-2">语言</label>
                     <select
                       value={appearance.language}
                       onChange={(e) => setAppearance((p) => ({ ...p, language: e.target.value }))}
                       className="w-full px-4 py-2 bg-background border border-border rounded-md text-sm text-white focus:border-primary outline-none transition"
                     >
                       <option value="zh-CN">简体中文</option>
                       <option value="zh-TW">繁体中文</option>
                       <option value="en">English</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-semibold text-slate-300 mb-2">标签页名称</label>
                     <input
                       type="text"
                       value={appearance.tabTitle}
                       onChange={(e) => setAppearance((p) => ({ ...p, tabTitle: e.target.value }))}
                       className="w-full px-4 py-2 bg-background border border-border rounded-md text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                       placeholder="浏览器标签页显示的名称"
                     />
                   </div>
                 </div>

                 <div className="space-y-4">
                   <div>
                     <label className="block text-sm font-semibold text-slate-300 mb-2">平台网页 Logo</label>
                     <div
                       className="border border-dashed border-slate-600 bg-secondary/30 rounded-lg p-5 flex flex-col items-center justify-center text-center hover:bg-secondary/80 hover:border-primary transition cursor-pointer min-h-[100px]"
                       onClick={() => setAppearance((p) => ({ ...p, platformLogo: p.platformLogo ? '' : '/logo-platform.png' }))}
                     >
                       <UploadCloud size={22} className="text-primary mb-2" />
                       <p className="text-xs font-medium text-slate-300">点击上传平台网页 Logo</p>
                       <p className="text-[11px] text-slate-500 mt-0.5">SVG/PNG，建议 200×48</p>
                       {appearance.platformLogo && <p className="text-primary text-xs mt-1 font-mono">{appearance.platformLogo}</p>}
                     </div>
                   </div>
                   <div>
                     <label className="block text-sm font-semibold text-slate-300 mb-2">标签页 Logo（Favicon）</label>
                     <div
                       className="border border-dashed border-slate-600 bg-secondary/30 rounded-lg p-5 flex flex-col items-center justify-center text-center hover:bg-secondary/80 hover:border-primary transition cursor-pointer min-h-[80px]"
                       onClick={() => setAppearance((p) => ({ ...p, tabLogo: p.tabLogo ? '' : '/favicon.ico' }))}
                     >
                       <UploadCloud size={20} className="text-primary mb-1" />
                       <p className="text-xs font-medium text-slate-300">点击上传标签页小图标</p>
                       {appearance.tabLogo && <p className="text-primary text-[11px] mt-1 font-mono">{appearance.tabLogo}</p>}
                     </div>
                   </div>
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-semibold text-slate-300 mb-2">首页 Banner</label>
                 <div
                   className="border border-dashed border-slate-600 bg-secondary/30 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-secondary/80 hover:border-primary transition cursor-pointer min-h-[140px]"
                   onClick={() => setAppearance((p) => ({ ...p, homeBanner: p.homeBanner ? '' : '/banner-home.jpg' }))}
                 >
                   <UploadCloud size={28} className="text-primary mb-2" />
                   <p className="text-sm font-medium text-slate-300">点击上传首页 Banner 图</p>
                   <p className="text-xs text-slate-500 mt-1">建议 1920×400，JPG/PNG</p>
                   {appearance.homeBanner && <p className="text-primary text-xs mt-2 font-mono">{appearance.homeBanner}</p>}
                 </div>
               </div>

               <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center">
                    <MonitorSmartphone size={18} className="mr-2 text-primary" /> 上架预览
                  </h4>
                  <div className="w-full h-28 bg-background border border-border rounded flex items-center justify-center text-slate-500 font-medium tracking-widest uppercase text-xs">
                     {appearance.platformName || 'BANNER / HEADER PREVIEW'}
                  </div>
               </div>
            </div>
          )}

          {!loading && activeTab === 'dict' && (
            <div className="space-y-6 animate-in fade-in duration-300">
               <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg text-sm text-red-400 flex">
                 <MonitorSmartphone size={18} className="mr-3 flex-shrink-0" />
                 更改飞行基准阈值会即刻影响全局设备飞行预判流向，修改数值需审计确认，切勿越界突破无人机出厂保护锁定！
               </div>
               
               <div className="grid grid-cols-2 gap-6">
                  <div className="bg-secondary/20 border border-border rounded-lg p-5">
                    <h4 className="font-semibold text-white mb-4 text-sm border-b border-border pb-2 tracking-wide">飞行防陨阈值阀</h4>
                    <div className="space-y-4 text-sm mt-3">
                      <div className="flex items-center justify-between">
                         <span className="text-slate-400">电量强制迫降底线 (%)</span>
                         <input type="number" defaultValue="20" className="w-20 px-2 py-1 bg-background border border-border text-white rounded text-center focus:border-primary outline-none" />
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-slate-400">视频图传抽帧截断 (fps)</span>
                         <select className="w-24 px-2 py-1 bg-background border border-border text-white rounded focus:border-primary outline-none">
                           <option>30帧/秒</option>
                           <option selected>60帧/秒</option>
                         </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary/20 border border-border rounded-lg p-5">
                    <h4 className="font-semibold text-white mb-4 text-sm border-b border-border pb-2 tracking-wide">态势地图初始铆定</h4>
                    <div className="space-y-4 text-sm mt-3">
                      <div className="flex items-center justify-between">
                         <span className="text-slate-400">大屏经度聚焦 (Lng)</span>
                         <input type="text" defaultValue="116.4074" className="w-28 px-2 py-1 bg-background border border-border text-white rounded focus:border-primary outline-none font-mono" />
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-slate-400">大屏纬度聚焦 (Lat)</span>
                         <input type="text" defaultValue="39.9042" className="w-28 px-2 py-1 bg-background border border-border text-white rounded focus:border-primary outline-none font-mono" />
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {!loading && activeTab === 'sys' && (
            <div className="space-y-4 text-sm text-slate-300 animate-in fade-in duration-300">
              <div className="grid grid-cols-3 gap-4 border-b border-border pb-4 p-2">
                 <div className="font-semibold text-white">发布运行版本基线</div>
                 <div className="col-span-2 font-mono text-primary">v2.8.5-enterprise (Build 20231102)</div>
              </div>
              <div className="grid grid-cols-3 gap-4 border-b border-border pb-4 p-2">
                 <div className="font-semibold text-white">内网部署架构</div>
                 <div className="col-span-2">自建云混合边侧容器节点 (K8S 集群加持)</div>
              </div>
              <div className="grid grid-cols-3 gap-4 border-b border-border pb-4 p-2">
                 <div className="font-semibold text-white">商业许可证状态 (License)</div>
                 <div className="col-span-2 flex items-center">
                    <span className="px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs rounded tracking-widest mr-3">ACTIVE</span>
                    有效期至 2030-12-31，不限制图视频并发流。
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
