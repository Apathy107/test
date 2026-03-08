import React, { useState } from "react";
import { Settings, MapPin, Play, ChevronRight } from "lucide-react";

interface SpecialTemplate {
  id: string;
  name: string;
  icon: string;
  desc: string;
  height: number;
  freq: number;
  algo: string;
}

const templates: SpecialTemplate[] = [
  { id: "tp1", name: "违建巡查", icon: "🏗️", desc: "识别违规建筑及施工", height: 80, freq: 2, algo: "违建识别v3.2" },
  { id: "tp2", name: "河道监测", icon: "🌊", desc: "水质及河道环境监测", height: 60, freq: 1, algo: "水质分析v2.1" },
  { id: "tp3", name: "交通高峰", icon: "🚦", desc: "交通拥堵实时感知", height: 120, freq: 5, algo: "车流统计v4.0" },
  { id: "tp4", name: "垃圾清运", icon: "🗑️", desc: "垃圾积存及清运监测", height: 50, freq: 3, algo: "垃圾识别v2.4" },
  { id: "tp5", name: "绿化养护", icon: "🌳", desc: "绿化覆盖及养护状态", height: 70, freq: 1, algo: "植被分析v1.8" },
];

interface PatrolSpecialProps {
  onLaunch?: (template: SpecialTemplate) => void;
}

const PatrolSpecial: React.FC<PatrolSpecialProps> = ({ onLaunch }) => {
  const [selected, setSelected] = useState<SpecialTemplate>(templates[0]);
  const [height, setHeight] = useState(selected.height);
  const [freq, setFreq] = useState(selected.freq);
  const [step, setStep] = useState(1);

  console.log("PatrolSpecial rendered, step:", step);

  const handleSelect = (t: SpecialTemplate) => {
    setSelected(t);
    setHeight(t.height);
    setFreq(t.freq);
  };

  const steps = ["选择模板", "配置参数", "绘制范围", "生成任务"];

  return (
    <div data-cmp="PatrolSpecial" className="flex flex-col h-full">
      {/* Step indicator */}
      <div
        className="flex items-center px-4 py-3 gap-0"
        style={{ borderBottom: "1px solid rgba(0,212,255,0.15)" }}
      >
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div
              className="flex items-center gap-1.5 cursor-pointer"
              onClick={() => setStep(i + 1)}
            >
              <div
                className="rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  width: "20px",
                  height: "20px",
                  background: step > i ? "rgb(0,212,255)" : "rgba(0,212,255,0.15)",
                  color: step > i ? "rgb(8,18,38)" : "rgba(0,212,255,0.5)",
                  border: `1px solid ${step >= i + 1 ? "rgb(0,212,255)" : "rgba(0,212,255,0.2)"}`,
                }}
              >
                {i + 1}
              </div>
              <span
                className="text-xs"
                style={{ color: step === i + 1 ? "rgb(0,212,255)" : "rgb(80,130,160)" }}
              >
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight size={12} className="mx-1" style={{ color: "rgba(0,212,255,0.3)" }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-4 py-3">
        {/* Step 1: Template Selection */}
        <div style={{ display: step === 1 ? "block" : "none" }}>
          <div className="text-xs mb-3" style={{ color: "rgb(120,180,210)" }}>
            选择专项巡查模板
          </div>
          <div className="space-y-2">
            {templates.map((t) => (
              <div
                key={t.id}
                onClick={() => handleSelect(t)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer"
                style={{
                  background: selected.id === t.id ? "rgba(0,212,255,0.1)" : "rgba(10,24,54,0.6)",
                  border: selected.id === t.id ? "1px solid rgba(0,212,255,0.35)" : "1px solid rgba(0,212,255,0.1)",
                }}
              >
                <span className="text-xl">{t.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium" style={{ color: "rgb(200,235,255)" }}>
                    {t.name}
                  </div>
                  <div className="text-xs" style={{ color: "rgb(120,180,210)" }}>
                    {t.desc}
                  </div>
                </div>
                {selected.id === t.id && (
                  <div
                    className="rounded-full"
                    style={{ width: "8px", height: "8px", background: "rgb(0,212,255)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Parameter Configuration */}
        <div style={{ display: step === 2 ? "block" : "none" }}>
          <div className="text-xs mb-3" style={{ color: "rgb(120,180,210)" }}>
            配置任务参数 · {selected.name}
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs block mb-1" style={{ color: "rgb(120,180,210)" }}>
                飞行高度 (米)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={20}
                  max={200}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="flex-1"
                  style={{ accentColor: "rgb(0,212,255)" }}
                />
                <span
                  className="text-sm w-12 text-right"
                  style={{ color: "rgb(0,212,255)" }}
                >
                  {height}m
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: "rgb(120,180,210)" }}>
                拍摄频率 (次/分钟)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={freq}
                  onChange={(e) => setFreq(Number(e.target.value))}
                  className="flex-1"
                  style={{ accentColor: "rgb(0,212,255)" }}
                />
                <span
                  className="text-sm w-12 text-right"
                  style={{ color: "rgb(0,212,255)" }}
                >
                  {freq}次
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: "rgb(120,180,210)" }}>
                识别算法
              </label>
              <div
                className="flex items-center gap-2 px-3 py-2 rounded"
                style={{
                  background: "rgba(0,212,255,0.07)",
                  border: "1px solid rgba(0,212,255,0.25)",
                }}
              >
                <Settings size={14} style={{ color: "rgb(0,212,255)" }} />
                <span className="text-sm" style={{ color: "rgb(200,235,255)" }}>
                  {selected.algo}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Draw Range */}
        <div style={{ display: step === 3 ? "block" : "none" }}>
          <div className="text-xs mb-3" style={{ color: "rgb(120,180,210)" }}>
            在地图上绘制巡查范围
          </div>
          <div
            className="rounded-lg flex items-center justify-center"
            style={{
              height: "180px",
              background: "rgba(0,212,255,0.04)",
              border: "1px dashed rgba(0,212,255,0.3)",
            }}
          >
            <div className="text-center">
              <MapPin size={28} style={{ color: "rgba(0,212,255,0.4)", margin: "0 auto 8px" }} />
              <div className="text-xs" style={{ color: "rgba(0,212,255,0.5)" }}>
                点击左侧地图绘制巡查区域
              </div>
              <div className="text-xs mt-1" style={{ color: "rgba(0,212,255,0.3)" }}>
                支持多边形、矩形标注
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              className="text-xs px-3 py-1.5 rounded"
              style={{
                background: "rgba(0,212,255,0.1)",
                border: "1px solid rgba(0,212,255,0.3)",
                color: "rgb(0,212,255)",
              }}
            >
              绘制多边形
            </button>
            <button
              className="text-xs px-3 py-1.5 rounded"
              style={{
                background: "rgba(0,212,255,0.05)",
                border: "1px solid rgba(0,212,255,0.2)",
                color: "rgb(120,180,210)",
              }}
            >
              绘制矩形
            </button>
            <button
              className="text-xs px-3 py-1.5 rounded"
              style={{
                background: "rgba(0,212,255,0.05)",
                border: "1px solid rgba(0,212,255,0.2)",
                color: "rgb(120,180,210)",
              }}
            >
              清除
            </button>
          </div>
        </div>

        {/* Step 4: Generate Task */}
        <div style={{ display: step === 4 ? "block" : "none" }}>
          <div className="text-xs mb-3" style={{ color: "rgb(120,180,210)" }}>
            确认任务配置
          </div>
          <div
            className="rounded-lg p-3 space-y-2"
            style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)" }}
          >
            {[
              ["模板类型", `${selected.icon} ${selected.name}`],
              ["飞行高度", `${height}m`],
              ["拍摄频率", `${freq}次/分钟`],
              ["识别算法", selected.algo],
              ["巡查范围", "已标注区域"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-xs">
                <span style={{ color: "rgb(80,130,160)" }}>{k}</span>
                <span style={{ color: "rgb(200,235,255)" }}>{v}</span>
              </div>
            ))}
          </div>
          <button
            className="mt-4 w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium"
            style={{
              background: "rgba(0,212,255,0.18)",
              border: "1px solid rgba(0,212,255,0.45)",
              color: "rgb(0,212,255)",
            }}
            onClick={() => onLaunch?.(selected)}
          >
            <Play size={16} />
            生成并启动任务
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderTop: "1px solid rgba(0,212,255,0.15)" }}
      >
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          className="text-xs px-3 py-1.5 rounded"
          style={{
            background: "rgba(0,212,255,0.05)",
            border: "1px solid rgba(0,212,255,0.2)",
            color: "rgb(120,180,210)",
            opacity: step === 1 ? 0.4 : 1,
          }}
        >
          上一步
        </button>
        <span className="text-xs" style={{ color: "rgba(0,212,255,0.4)" }}>
          {step}/{steps.length}
        </span>
        <button
          onClick={() => setStep(Math.min(steps.length, step + 1))}
          className="text-xs px-3 py-1.5 rounded"
          style={{
            background: "rgba(0,212,255,0.15)",
            border: "1px solid rgba(0,212,255,0.4)",
            color: "rgb(0,212,255)",
            opacity: step === steps.length ? 0.4 : 1,
          }}
        >
          下一步
        </button>
      </div>
    </div>
  );
};

export default PatrolSpecial;