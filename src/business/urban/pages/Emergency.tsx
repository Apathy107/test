import React, { useState } from "react";
import { Monitor, Users, FileText, Zap, Camera } from "lucide-react";
import MapView from "../components/MapView";
import EmergencyPanel from "../components/EmergencyPanel";
import StatusBadge from "../components/StatusBadge";

type EmergencyTab = "response" | "coordination" | "monitor" | "report";

const tabs: { key: EmergencyTab; label: string; icon: React.ElementType }[] = [
  { key: "response", label: "紧急响应", icon: Zap },
  { key: "coordination", label: "协同作业", icon: Users },
  { key: "monitor", label: "数据回传", icon: Monitor },
  { key: "report", label: "报告生成", icon: FileText },
];

const Emergency: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EmergencyTab>("response");

  console.log("Emergency page rendered, active tab:", activeTab);

  return (
    <div
      className="flex flex-col"
      style={{ height: "100%", background: "rgb(8,18,38)" }}
    >
      {/* Page Header */}
      <div
        className="flex items-center justify-between px-6 py-3"
        style={{
          borderBottom: "1px solid rgba(255,60,80,0.25)",
          background: "rgba(255,60,80,0.04)",
          flexShrink: 0,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-1 rounded-full"
            style={{
              height: "24px",
              background: "rgb(255,80,100)",
              boxShadow: "0 0 8px rgba(255,80,100,0.6)",
            }}
          />
          <div>
            <h1
              className="text-base font-bold"
              style={{ color: "rgb(255,80,100)" }}
            >
              通用应急应用
            </h1>
            <div className="text-xs" style={{ color: "rgb(160,100,110)" }}>
              Emergency Response System
            </div>
          </div>
        </div>

        {/* Alert Stats */}
        <div className="flex items-center gap-6 text-xs">
          {[
            { label: "当前警情", value: "3", color: "rgb(255,80,100)" },
            { label: "响应中", value: "2", color: "rgb(255,180,0)" },
            { label: "可用设备", value: "8", color: "rgb(0,212,255)" },
            { label: "在岗人员", value: "12", color: "rgb(80,230,180)" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-lg font-bold" style={{ color }}>
                {value}
              </span>
              <span style={{ color: "rgb(80,130,160)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sub Tabs */}
      <div
        className="flex"
        style={{
          borderBottom: "1px solid rgba(0,212,255,0.15)",
          background: "rgba(10,24,54,0.5)",
          flexShrink: 0,
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-6 py-3 text-sm transition-all"
              style={{
                background: isActive
                  ? "rgba(0,212,255,0.08)"
                  : "transparent",
                borderBottom: isActive
                  ? "2px solid rgb(0,212,255)"
                  : "2px solid transparent",
                color: isActive ? "rgb(0,212,255)" : "rgb(80,130,160)",
              }}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Map Area */}
        <div
          className="flex-1 min-w-0"
          style={{ borderRight: "1px solid rgba(0,212,255,0.15)" }}
        >
          <div
            style={{
              display: activeTab !== "report" ? "flex" : "none",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <MapView
              title="应急态势实时图"
              routes={[
                {
                  id: "r1",
                  name: "响应路线-01",
                  color: "rgb(255,80,100)",
                  status: "active",
                },
                {
                  id: "r2",
                  name: "警戒区域边界",
                  color: "rgb(255,180,0)",
                  status: "active",
                },
                {
                  id: "r3",
                  name: "疏散路线",
                  color: "rgb(80,230,180)",
                  status: "active",
                },
              ]}
            />
          </div>

          <div
            style={{
              display: activeTab === "report" ? "flex" : "none",
              flexDirection: "column",
              height: "100%",
              padding: "24px",
              overflow: "auto",
            }}
          >
            <div
              className="text-sm font-bold mb-4"
              style={{ color: "rgb(0,212,255)" }}
            >
              应急处置报告生成
            </div>
            <div className="space-y-4">
              <div
                className="rounded-lg p-4"
                style={{
                  background: "rgba(10,24,54,0.6)",
                  border: "1px solid rgba(0,212,255,0.15)",
                }}
              >
                <div
                  className="text-xs mb-3"
                  style={{ color: "rgb(120,180,210)" }}
                >
                  选择报告模板
                </div>
                <div className="flex gap-3 flex-wrap">
                  {[
                    "标准处置报告",
                    "交通事故报告",
                    "环境污染报告",
                    "安全事故报告",
                  ].map((t, i) => (
                    <button
                      key={t}
                      className="text-xs px-3 py-2 rounded"
                      style={{
                        background:
                          i === 0
                            ? "rgba(0,212,255,0.15)"
                            : "rgba(0,212,255,0.05)",
                        border: `1px solid ${
                          i === 0
                            ? "rgba(0,212,255,0.4)"
                            : "rgba(0,212,255,0.15)"
                        }`,
                        color:
                          i === 0 ? "rgb(0,212,255)" : "rgb(120,180,210)",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="rounded-lg p-4"
                style={{
                  background: "rgba(10,24,54,0.6)",
                  border: "1px solid rgba(0,212,255,0.15)",
                }}
              >
                <div
                  className="text-xs mb-3"
                  style={{ color: "rgb(120,180,210)" }}
                >
                  自动填充内容
                </div>
                <div className="space-y-2">
                  {[
                    ["事件名称", "外滩路段交通事故"],
                    ["发生时间", "2025-06-13 11:02:44"],
                    ["事件地点", "外滩中山东一路18号附近"],
                    ["处置时长", "约45分钟"],
                    ["调用设备", "无人机×2、机器狗×1"],
                    ["出警人员", "城管队第3组 (4人)"],
                    ["处置结果", "已处置完毕，秩序恢复正常"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center gap-3 text-xs"
                    >
                      <span
                        className="w-20 flex-shrink-0"
                        style={{ color: "rgb(80,130,160)" }}
                      >
                        {k}
                      </span>
                      <div
                        className="flex-1 px-2 py-1 rounded"
                        style={{
                          background: "rgba(0,212,255,0.04)",
                          border: "1px solid rgba(0,212,255,0.1)",
                          color: "rgb(200,235,255)",
                        }}
                      >
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                {["导出 PDF", "导出 Word", "发送邮件"].map((action) => (
                  <button
                    key={action}
                    className="flex items-center gap-2 px-4 py-2.5 rounded text-sm"
                    style={{
                      background: "rgba(0,212,255,0.1)",
                      border: "1px solid rgba(0,212,255,0.3)",
                      color: "rgb(0,212,255)",
                    }}
                  >
                    <FileText size={14} />
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div
          className="flex flex-col overflow-hidden"
          style={{
            width: "360px",
            minWidth: "360px",
            background: "rgba(10,24,54,0.5)",
          }}
        >
          <div
            style={{ display: activeTab === "monitor" ? "block" : "none" }}
          >
            <div
              className="p-3"
              style={{ borderBottom: "1px solid rgba(0,212,255,0.15)" }}
            >
              <div
                className="text-xs mb-2 flex items-center gap-1"
                style={{ color: "rgb(0,212,255)" }}
              >
                <Camera size={12} />
                多画面图传
              </div>
              <div
                className="gap-2"
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
              >
                {["无人机-001", "无人机-005", "机器狗-003", "地面摄像头"].map(
                  (cam, i) => (
                    <div
                      key={cam}
                      className="relative rounded overflow-hidden"
                      style={{
                        background: "rgb(5,15,35)",
                        border: "1px solid rgba(0,212,255,0.2)",
                        aspectRatio: "16/9",
                      }}
                    >
                      <img
                        src={`https://picsum.photos/seed/cam${i}/160/90`}
                        alt={cam}
                        className="w-full h-full object-cover"
                        style={{ opacity: 0.7 }}
                      />
                      <div
                        className="absolute bottom-0 left-0 right-0 px-1.5 py-1"
                        style={{ background: "rgba(5,15,35,0.85)" }}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="text-xs"
                            style={{
                              color: "rgb(0,212,255)",
                              fontSize: "9px",
                            }}
                          >
                            {cam}
                          </span>
                          <StatusBadge status="active" size="sm" />
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <EmergencyPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;