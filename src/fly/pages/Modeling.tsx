import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Layers, CheckCircle, Clock, Plus, Pause, Play, FileText, Eye, Share2, Copy } from 'lucide-react';
import CyberPanel from '../components/CyberPanel';
import ModelingReportViewer from '../components/ModelingReportViewer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';

type TaskStatus = 'running' | 'paused' | 'completed';

interface ModelingTask {
  id: string;
  name: string;
  type: string;
  progress: number;
  status: TaskStatus;
  date: string;
}

const INITIAL_TASKS: ModelingTask[] = [
  { id: 'MOD-0912', name: '北部山区地灾前线三维建模', type: '面状+倾斜采集', progress: 100, status: 'completed', date: '2023-10-24 14:00' },
  { id: 'MOD-0913', name: '工业园二期施工进度建模', type: '倾斜采集', progress: 65, status: 'running', date: '今天 09:30' },
];

type ShareExpiry = '1d' | '7d' | '1m' | '3m' | 'permanent' | 'custom';

export default function Modeling() {
  const location = useLocation();
  const [tasks, setTasks] = useState<ModelingTask[]>(INITIAL_TASKS);
  const [previewTask, setPreviewTask] = useState<ModelingTask | null>(null);
  const [reportTask, setReportTask] = useState<ModelingTask | null>(null);
  const [shareTask, setShareTask] = useState<ModelingTask | null>(null);
  const [shareExpiry, setShareExpiry] = useState<ShareExpiry>('7d');
  const [shareCustomExpiry, setShareCustomExpiry] = useState('');
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  // 从数据分类管理勾选照片发起云端建模后跳转回来，新增一条任务（支持自定义任务名称）
  useEffect(() => {
    const state = location.state as { newTaskFromPhotos?: number; taskName?: string } | null;
    if (state?.newTaskFromPhotos && state.newTaskFromPhotos > 0) {
      const name = (state.taskName && state.taskName.trim()) || `新建建模任务（${state.newTaskFromPhotos} 张照片）`;
      const newTask: ModelingTask = {
        id: `MOD-${Date.now()}`,
        name,
        type: '倾斜采集',
        progress: 0,
        status: 'running',
        date: new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      };
      setTasks((prev) => [newTask, ...prev]);
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.state, location.pathname]);

  const handlePause = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'paused' as TaskStatus } : t)));
  };

  const handleResume = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'running' as TaskStatus } : t)));
  };

  const openReport = (task: ModelingTask) => {
    setReportTask(task);
  };

  const openShare = (task: ModelingTask) => {
    setShareTask(task);
    setShareLink(null);
    setShareCopied(false);
    setShareExpiry('7d');
    setShareCustomExpiry('');
  };

  const getShareExpiryDate = (): Date | null => {
    if (shareExpiry === 'permanent') return null;
    if (shareExpiry === 'custom') {
      if (!shareCustomExpiry.trim()) return null;
      const d = new Date(shareCustomExpiry);
      return isNaN(d.getTime()) ? null : d;
    }
    const now = new Date();
    if (shareExpiry === '1d') now.setDate(now.getDate() + 1);
    else if (shareExpiry === '7d') now.setDate(now.getDate() + 7);
    else if (shareExpiry === '1m') now.setMonth(now.getMonth() + 1);
    else if (shareExpiry === '3m') now.setMonth(now.getMonth() + 3);
    return now;
  };

  const generateShareLink = () => {
    if (!shareTask) return;
    const expires = getShareExpiryDate();
    const base = window.location.origin;
    const params = new URLSearchParams();
    params.set('task', shareTask.id);
    if (expires) params.set('expires', expires.toISOString());
    const link = `${base}/share/modeling?${params.toString()}`;
    setShareLink(link);
  };

  const copyShareLink = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      setShareLink(shareLink);
    }
  };

  const statusLabel = (s: TaskStatus) => (s === 'completed' ? '完成' : s === 'paused' ? '已暂停' : '处理中');

  return (
    <div className="h-full flex flex-col p-4 gap-4 bg-background">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-bold flex items-center gap-2 text-foreground">
          <Layers className="text-primary" /> 云端建模
        </h1>
        <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Link to="/data/raw" state={{ fromModeling: true }}>
            <Plus size={16} /> 新建
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6 h-full min-h-0">
        <CyberPanel className="col-span-2 flex flex-col min-h-0" title="建模任务列表" headerIcon={<Clock size={16} />}>
          <div className="flex-1 overflow-auto min-h-0 bg-card/30 rounded border border-border">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground border-b border-border sticky top-0 bg-card/95 z-10">
                <tr>
                  <th className="px-4 py-3 font-medium">任务ID / 名称</th>
                  <th className="px-4 py-3 font-medium">采集策略</th>
                  <th className="px-4 py-3 font-medium">节点时间</th>
                  <th className="px-4 py-3 font-medium">进度状况</th>
                  <th className="px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-foreground">{t.name}</div>
                      <div className="font-mono text-[10px] text-muted-foreground">{t.id}</div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{t.type}</td>
                    <td className="px-4 py-4 text-muted-foreground">{t.date}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {t.status === 'completed' ? (
                          <CheckCircle size={14} className="text-green-500" />
                        ) : (
                          <div
                            className={t.status === 'paused' ? 'w-3 h-3 rounded-full bg-amber-500' : 'w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin'}
                          />
                        )}
                        <span
                          className={
                            t.status === 'completed' ? 'text-green-500' : t.status === 'paused' ? 'text-amber-500' : 'text-primary'
                          }
                        >
                          {statusLabel(t.status)} ({t.progress}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted h-1 mt-1 rounded max-w-[100px]">
                        <div
                          className={`h-1 rounded ${t.progress === 100 ? 'bg-green-500' : t.status === 'paused' ? 'bg-amber-500' : 'bg-primary'}`}
                          style={{ width: `${t.progress}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {t.status === 'running' && (
                          <button
                            type="button"
                            className="text-amber-500 hover:underline text-xs flex items-center gap-1"
                            onClick={() => handlePause(t.id)}
                          >
                            <Pause size={14} /> 暂停
                          </button>
                        )}
                        {t.status === 'paused' && (
                          <button
                            type="button"
                            className="text-primary hover:underline text-xs flex items-center gap-1"
                            onClick={() => handleResume(t.id)}
                          >
                            <Play size={14} /> 继续
                          </button>
                        )}
                        {t.progress === 100 && (
                          <>
                            <button
                              type="button"
                              className="text-primary hover:underline text-xs flex items-center gap-1"
                              onClick={() => setPreviewTask(t)}
                            >
                              <Eye size={14} /> 预览成果
                            </button>
                            <button
                              type="button"
                              className="text-primary hover:underline text-xs flex items-center gap-1"
                              onClick={() => openReport(t)}
                            >
                              <FileText size={14} /> 建模报告
                            </button>
                            <button
                              type="button"
                              className="text-primary hover:underline text-xs flex items-center gap-1"
                              onClick={() => openShare(t)}
                            >
                              <Share2 size={14} /> 分享
                            </button>
                          </>
                        )}
                        {t.progress < 100 && t.status !== 'paused' && (
                          <span className="text-muted-foreground text-xs">在线浏览</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CyberPanel>

        <CyberPanel className="flex flex-col" title="说明" headerIcon={<CheckCircle size={16} />}>
          <div className="flex flex-col flex-1 items-center justify-center p-6 text-center border-2 border-dashed border-border rounded-lg bg-black/20">
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Layers size={48} className="text-primary opacity-50" />
            </div>
            <h3 className="text-lg font-bold mb-2">新建云端建模任务</h3>
            <p className="text-sm text-muted-foreground mb-4">
              点击「新建」跳转到【数据智能中心】-【数据分类管理】，勾选照片后点击「发起云端建模」即可创建任务。
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              支持查看任务进度、暂停/继续、预览成果及打开建模报告（预览与下载）。
            </p>
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link to="/data/raw" state={{ fromModeling: true }}>
                <Plus size={16} /> 去数据分类管理选图
              </Link>
            </Button>
          </div>
        </CyberPanel>
      </div>

      {/* 成果预览弹窗 */}
      <Dialog open={!!previewTask} onOpenChange={(open) => !open && setPreviewTask(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye size={18} /> 建模成果预览 - {previewTask?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-[400px] rounded border border-border bg-muted/20 flex items-center justify-center text-muted-foreground">
            [三维模型 / 正射影像 在线预览占位，可接入 Cesium 或 Three.js]
          </div>
        </DialogContent>
      </Dialog>

      {/* 建模报告：预览与下载 */}
      <ModelingReportViewer
        open={!!reportTask}
        onOpenChange={(open) => !open && setReportTask(null)}
        taskName={reportTask?.name}
      />

      {/* 分享：有效期 1天/7天/1个月/3个月/永久/自定义 */}
      <Dialog open={!!shareTask} onOpenChange={(open) => !open && setShareTask(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 size={18} /> 分享成果 - {shareTask?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">分享有效期</label>
              <select
                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm"
                value={shareExpiry}
                onChange={(e) => setShareExpiry(e.target.value as ShareExpiry)}
              >
                <option value="1d">1 天</option>
                <option value="7d">7 天</option>
                <option value="1m">1 个月</option>
                <option value="3m">3 个月</option>
                <option value="permanent">永久</option>
                <option value="custom">自定义时间</option>
              </select>
              {shareExpiry === 'custom' && (
                <input
                  type="datetime-local"
                  className="mt-2 w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm"
                  value={shareCustomExpiry}
                  onChange={(e) => setShareCustomExpiry(e.target.value)}
                />
              )}
            </div>
            {!shareLink ? (
              <Button
                className="w-full gap-2"
                onClick={generateShareLink}
                disabled={shareExpiry === 'custom' && !shareCustomExpiry.trim()}
              >
                生成分享链接
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">复制以下链接分享给他人：</p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    className="flex-1 px-3 py-2 rounded border border-border bg-muted/50 text-foreground text-xs font-mono"
                    value={shareLink}
                  />
                  <Button variant="outline" size="sm" className="gap-1 shrink-0" onClick={copyShareLink}>
                    <Copy size={14} /> {shareCopied ? '已复制' : '复制'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
