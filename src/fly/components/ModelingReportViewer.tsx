import React, { useState } from 'react';
import { X, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { cn } from '@fly/lib/utils';

const REPORT_TABS = [
  { id: 'quality', label: '建模质量报告' },
  { id: 'precision', label: '精度检查' },
  { id: 'photo', label: '照片总览' },
  { id: 'camera', label: '相机参数' },
  { id: 'overlap', label: '正射重叠率' },
  { id: 'dsm', label: 'DSM' },
] as const;

type ReportTabId = (typeof REPORT_TABS)[number]['id'];

const MODEL_NAME = '新建模型重建-2026-01-10 16:15:14 (UTC+08)';
const COLLECT_TIME = '2026-01-10 11:00:33 (UTC+08)';

interface ModelingReportViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskName?: string;
}

export default function ModelingReportViewer({ open, onOpenChange, taskName }: ModelingReportViewerProps) {
  const [activeTab, setActiveTab] = useState<ReportTabId>('quality');

  const handleDownload = () => {
    const name = `建模报告_${taskName || '任务'}_${activeTab}_${Date.now()}.pdf`;
    const blob = new Blob(['（建模报告 PDF 由服务端生成，此处为模拟下载）'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-white text-black">
        <DialogHeader className="flex-shrink-0 border-b pb-3">
          <div className="flex justify-between items-start">
            <DialogTitle className="text-lg font-bold">建模报告</DialogTitle>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            {REPORT_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-3 py-1.5 rounded text-xs font-medium transition-colors',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button size="sm" className="gap-1 bg-blue-600 text-white hover:bg-blue-700 border-0" onClick={handleDownload}>
              <Download size={14} /> 下载报告
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 py-4 report-paper bg-white">
          {activeTab === 'quality' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">建模质量报告</h2>
                <p className="text-sm text-gray-600">模型: {MODEL_NAME}</p>
                <p className="text-sm text-gray-600">采集时间: {COLLECT_TIME}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold mb-3 flex items-center gap-1">◇ 模型信息</h3>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="border-2 border-blue-500 rounded-lg px-6 py-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">3.850 cm/px</div>
                    <div className="text-xs text-gray-500 mt-1">模型 GSD</div>
                  </div>
                  <div className="border-2 border-blue-500 rounded-lg px-6 py-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">M4TD</div>
                    <div className="text-xs text-gray-500 mt-1">采集机型</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">9min 53s</div>
                    <div className="text-xs text-gray-600">
                      <div>空三时间: 2min 6s</div>
                      <div>二维重建时间: 7min 47s</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div><span className="text-gray-500">坐标系:</span> CGCS2000 / 3-degree Gauss-Kruger CM 120E (EPSG:4549)</div>
                  <div><span className="text-gray-500">平均飞行高度:</span> 114.27 m</div>
                  <div><span className="text-gray-500">2D:</span> TIFF: 661.1 MB</div>
                  <div><span className="text-gray-500">模型覆盖面积:</span> 0.289982 km²</div>
                  <div><span className="text-gray-500">重建场景:</span> 农田</div>
                  <div><span className="text-gray-500">模型分辨率:</span> 高</div>
                </div>
              </div>
              <div className="border border-gray-200 rounded overflow-hidden">
                <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  [正射影像/模型覆盖范围图]
                </div>
              </div>
            </div>
          )}

          {activeTab === 'precision' && (
            <div>
              <h3 className="text-sm font-bold mb-4 flex items-center gap-1">◇ 精度检查</h3>
              <div className="border-t border-b border-gray-200 divide-y divide-gray-200">
                {[
                  ['整体重投影误差 RMS', '1.176 px'],
                  ['地理配准均方根误差', '0.048 m'],
                  ['模型分辨率', '高'],
                  ['被摄地物距离', '100 m'],
                  ['影像POS约束', '是'],
                ].map(([label, value], i) => (
                  <div key={i} className="flex justify-between py-3 px-2">
                    <span className="text-gray-700">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'photo' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-1">照片总览</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-around items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">269</div>
                  <div className="text-xs text-gray-600 mt-1">照片总数</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">269 (100%)</div>
                  <div className="text-xs text-gray-600 mt-1">• RTK固定解</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">269 (100%)</div>
                  <div className="text-xs text-gray-600 mt-1">已校准影像</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">◆ RTK浮点解:</span> 0</div>
                <div><span className="text-gray-500">畸变矫正:</span> 开</div>
                <div><span className="text-gray-500">▲ RTK单点解:</span> 0</div>
                <div><span className="text-gray-500">机械快门:</span> 关</div>
                <div><span className="text-gray-500">带位姿影像:</span> 269</div>
                <div><span className="text-gray-500">影像POS约束:</span> 是</div>
              </div>
              <div className="border border-gray-200 rounded overflow-hidden">
                <div className="aspect-video bg-green-50 flex items-center justify-center text-gray-500 text-sm">
                  [照片点位分布图 - 绿色圆点]
                </div>
              </div>
            </div>
          )}

          {activeTab === 'camera' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold">相机参数</h3>
              <div className="flex gap-6">
                <div className="w-48 h-48 border border-gray-300 rounded flex items-center justify-center bg-gray-50 text-xs text-gray-500">
                  相机残差图
                </div>
                <div className="flex-1 text-sm space-y-1">
                  <div><span className="text-gray-500">相机型号:</span> M4TD</div>
                  <div><span className="text-gray-500">相机序列号:</span> 1581F8HGX257K00A0PBT</div>
                  <div><span className="text-gray-500">相机类型:</span> 标准</div>
                  <div><span className="text-gray-500">固定相机参数:</span> 不固定</div>
                  <div><span className="text-gray-500">照片分辨率:</span> 4032×3024</div>
                  <div><span className="text-gray-500">预标定:</span> 否</div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border-b border-r border-gray-200 px-2 py-2">参数</th>
                      <th className="border-b border-r border-gray-200 px-2 py-2">焦距</th>
                      <th className="border-b border-r border-gray-200 px-2 py-2">Cx</th>
                      <th className="border-b border-r border-gray-200 px-2 py-2">Cy</th>
                      <th className="border-b border-r border-gray-200 px-2 py-2">K1</th>
                      <th className="border-b border-r border-gray-200 px-2 py-2">K2</th>
                      <th className="border-b border-gray-200 px-2 py-2">K3</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border-b border-r border-gray-200 px-2 py-1">初始</td><td className="border-b border-r border-gray-200 px-2 py-1">3049.296</td><td className="border-b border-r border-gray-200 px-2 py-1">2016</td><td className="border-b border-r border-gray-200 px-2 py-1">1512</td><td className="border-b border-r border-gray-200 px-2 py-1">0.093</td><td className="border-b border-r border-gray-200 px-2 py-1">-0.169</td><td className="border-b border-gray-200 px-2 py-1">0.126</td></tr>
                    <tr><td className="border-b border-r border-gray-200 px-2 py-1">优化</td><td className="border-b border-r border-gray-200 px-2 py-1">2920.412</td><td className="border-b border-r border-gray-200 px-2 py-1">2023.37</td><td className="border-b border-r border-gray-200 px-2 py-1">1507.975</td><td className="border-b border-r border-gray-200 px-2 py-1">0.126</td><td className="border-b border-r border-gray-200 px-2 py-1">-0.235</td><td className="border-b border-gray-200 px-2 py-1">0.175</td></tr>
                    <tr><td className="border-r border-gray-200 px-2 py-1">差值</td><td className="border-r border-gray-200 px-2 py-1">-128.884</td><td className="border-r border-gray-200 px-2 py-1">7.37</td><td className="border-r border-gray-200 px-2 py-1">-4.025</td><td className="border-r border-gray-200 px-2 py-1">0.033</td><td className="border-r border-gray-200 px-2 py-1">-0.067</td><td className="border-gray-200 px-2 py-1">0.048</td></tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h4 className="text-xs font-bold mb-2">协方差矩阵</h4>
                <div className="border border-gray-200 rounded p-2 text-[10px] font-mono bg-gray-50 overflow-x-auto">
                  [误差列: 焦距 3.038, Cx 0.04, Cy 0.068, K1~P2 ... 相关系数矩阵]
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overlap' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <span>附件</span>
                <span className="border-t flex-1" />
              </div>
              <h3 className="text-sm font-bold">正射重叠率</h3>
              <div className="flex gap-4">
                <div className="flex-1 border border-gray-200 rounded overflow-hidden">
                  <div className="aspect-[4/3] bg-gradient-to-br from-purple-400 via-blue-400 via-green-300 to-yellow-400 to-red-400 flex items-center justify-center text-white/80 text-sm">
                    [重叠率热力图]
                  </div>
                </div>
                <div className="w-8 flex flex-col justify-between py-2">
                  <span className="text-xs">&gt;10</span>
                  <div className="flex-1 bg-gradient-to-b from-red-400 via-yellow-400 via-green-400 to-blue-400 rounded-full w-4 mx-auto" />
                  <span className="text-xs">1</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dsm' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold">DSM</h3>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 border border-gray-200 rounded overflow-hidden">
                  <div className="aspect-[4/3] bg-gradient-to-b from-blue-700 via-blue-400 via-cyan-300 to-yellow-400 flex items-center justify-center text-gray-500 text-sm">
                    [DSM 高程图]
                  </div>
                </div>
                <div className="w-8 flex flex-col justify-between py-2 text-xs">
                  <span>50 m</span>
                  <div className="flex-1 bg-gradient-to-b from-red-500 via-yellow-400 via-green-400 to-blue-700 rounded-full w-4 mx-auto" />
                  <span>7 m</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
