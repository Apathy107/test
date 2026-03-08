import React, { useState, useMemo } from "react";
import { BarChart2, Shield, Filter, Download, Award, FileText } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { violationResultsCases } from "./ViolationResults";
import { captureRecordsForUpload as captureRecordsList } from "./CaptureRecords";

const weekData = [
  { day: "Mon", value: 110 },
  { day: "Tue", value: 168 },
  { day: "Wed", value: 248 },
  { day: "Thu", value: 210 },
  { day: "Fri", value: 292 },
  { day: "Sat", value: 145 },
  { day: "Sun", value: 88 },
];

const captureRecords = [
  { id: "ZP-001", device: "Drone-A01", gps: "113.9351° E, 22.5312° N", time: "2023-10-24 14:32:01", algo: "Vehicle Tracking v2", uploaded: true },
  { id: "ZP-002", device: "UAV-02",    gps: "113.9402° E, 22.5401° N", time: "14:28:15",             algo: "Parking Detect",      uploaded: true },
  { id: "ZP-003", device: "UAV-01",    gps: "113.9100° E, 22.5001° N", time: "14:15:00",             algo: "Speeding Cam",         uploaded: false },
  { id: "ZP-004", device: "Drone-A01", gps: "113.9351° E, 22.5312° N", time: "2023-10-24 14:32:01", algo: "Vehicle Tracking v2", uploaded: true },
];

const thumbColors = [
  "rgba(20, 45, 95, 1)",
  "rgba(40, 25, 55, 1)",
  "rgba(15, 48, 38, 1)",
  "rgba(45, 20, 20, 1)",
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(8, 24, 60, 1)",
          border: "1px solid rgba(0, 190, 230, 0.45)",
          borderRadius: "6px",
          padding: "8px 14px",
        }}
      >
        <p style={{ color: "rgba(0, 210, 240, 1)", fontSize: "12px", fontWeight: 600 }}>{label}</p>
        <p style={{ color: "rgba(180, 225, 255, 1)", fontSize: "12px" }}>{payload[0].value} 条</p>
      </div>
    );
  }
  return null;
};

const ViolationStats: React.FC = () => {
  const [activeRecordTab, setActiveRecordTab] = useState<"records" | "uploads">("records");
  const [resultFilterType, setResultFilterType] = useState("");
  const [recordSourceFilter, setRecordSourceFilter] = useState("");

  const violationResultsFiltered = useMemo(() => {
    let list = violationResultsCases;
    if (resultFilterType) list = list.filter((c) => c.type === resultFilterType);
    return list;
  }, [resultFilterType]);

  const captureRecordsFiltered = useMemo(() => {
    let list = captureRecordsList;
    if (recordSourceFilter) list = list.filter((r) => r.source === recordSourceFilter);
    return list;
  }, [recordSourceFilter]);

  const pieDataBySource = useMemo(() => {
    const m: Record<string, number> = {};
    captureRecordsList.forEach((r) => { m[r.source] = (m[r.source] || 0) + 1; });
    const colors: Record<string, string> = { "自动化抓拍": "rgba(0, 210, 240, 1)", "半自动化抓拍": "rgba(50, 90, 220, 1)", "人工抓拍": "rgba(0, 205, 135, 1)" };
    return Object.entries(m).map(([name, value]) => ({ name, value, color: colors[name] || "rgba(120, 120, 200, 1)" }));
  }, []);

  const summaryCards = [
    {
      label: "今日抓拍总数",
      labelEn: "Total Captures",
      value: "1,284",
      trend: "↑ 12%",
      trendUp: true,
      icon: BarChart2,
      iconBg: "rgba(0, 80, 160, 0.55)",
      iconColor: "rgba(0, 200, 240, 1)",
      borderColor: "rgba(0, 160, 220, 0.3)",
    },
    {
      label: "违法结果",
      labelEn: "Violation Results",
      value: String(violationResultsFiltered.length),
      trend: "",
      trendUp: true,
      icon: Award,
      iconBg: "rgba(20, 30, 100, 0.65)",
      iconColor: "rgba(100, 145, 245, 1)",
      borderColor: "rgba(80, 120, 230, 0.3)",
    },
    {
      label: "抓拍记录",
      labelEn: "Capture Records",
      value: String(captureRecordsFiltered.length),
      trend: "",
      trendUp: true,
      icon: FileText,
      iconBg: "rgba(80, 8, 8, 0.65)",
      iconColor: "rgba(255, 80, 80, 1)",
      borderColor: "rgba(255, 60, 60, 0.3)",
    },
    {
      label: "执法转化率",
      labelEn: "Enforcement Rate",
      value: "86.5%",
      trend: "",
      trendUp: true,
      icon: Filter,
      iconBg: "rgba(0, 75, 42, 0.65)",
      iconColor: "rgba(0, 205, 110, 1)",
      borderColor: "rgba(0, 190, 100, 0.3)",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Summary stat cards */}
      <div style={{ display: "flex", gap: "14px" }}>
        {summaryCards.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              style={{
                flex: 1,
                background: "rgba(8, 22, 58, 1)",
                border: `1px solid ${s.borderColor}`,
                borderRadius: "10px",
                padding: "18px 20px",
                boxShadow: `0 4px 20px ${s.iconColor.replace("1)", "0.07)")}`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "100px",
                  height: "100px",
                  background: `radial-gradient(circle, ${s.iconColor.replace("1)", "0.08)")} 0%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", color: "rgba(90, 155, 210, 1)", marginBottom: "1px" }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: "10px", color: "rgba(55, 110, 170, 1)", letterSpacing: "0.5px" }}>
                    {s.labelEn}
                  </div>
                </div>
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "8px",
                    background: s.iconBg,
                    border: `1px solid ${s.iconColor.replace("1)", "0.3)")}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={15} style={{ color: s.iconColor }} />
                </div>
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "rgba(220, 242, 255, 1)",
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: 1,
                  marginBottom: "6px",
                }}
              >
                {s.value}
              </div>
              {s.trend && (
                <div
                  style={{
                    fontSize: "11px",
                    color: s.trendUp ? "rgba(0, 210, 130, 1)" : "rgba(255, 100, 100, 1)",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  {s.trend}
                  <span style={{ fontSize: "10px", color: "rgba(60, 120, 180, 1)", fontWeight: 400 }}>
                    较昨日
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 筛选：与违法结果、抓拍记录同步 */}
      <div className="enf-card" style={{ padding: "10px 14px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <label style={{ fontSize: "10px", color: "rgba(65, 128, 190, 1)", display: "block", marginBottom: "3px" }}>违法结果-违法类型</label>
          <select style={{ padding: "4px 8px", border: "1px solid rgba(0, 110, 170, 0.38)", borderRadius: "4px", fontSize: "11px", background: "rgba(4, 16, 46, 1)", color: "rgba(155, 205, 245, 1)" }} value={resultFilterType} onChange={(e) => setResultFilterType(e.target.value)}>
            <option value="">全部</option>
            {Array.from(new Set(violationResultsCases.map((c) => c.type))).map((t: string) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: "10px", color: "rgba(65, 128, 190, 1)", display: "block", marginBottom: "3px" }}>抓拍记录-数据来源</label>
          <select style={{ padding: "4px 8px", border: "1px solid rgba(0, 110, 170, 0.38)", borderRadius: "4px", fontSize: "11px", background: "rgba(4, 16, 46, 1)", color: "rgba(155, 205, 245, 1)" }} value={recordSourceFilter} onChange={(e) => setRecordSourceFilter(e.target.value)}>
            <option value="">全部</option>
            <option value="自动化抓拍">自动化抓拍</option>
            <option value="半自动化抓拍">半自动化抓拍</option>
            <option value="人工抓拍">人工抓拍</option>
          </select>
        </div>
      </div>

      {/* Charts row */}
      <div style={{ display: "flex", gap: "14px" }}>
        <div
          className="enf-card"
          style={{ flex: 2, padding: "20px 22px" }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "rgba(200, 230, 255, 1)",
              marginBottom: "4px",
            }}
          >
            违法行为趋势统计
          </div>
          <div style={{ fontSize: "10px", color: "rgba(60, 120, 180, 1)", marginBottom: "16px", letterSpacing: "0.5px" }}>
            VIOLATION TRENDS — Weekly Statistics
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekData} barSize={32}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0, 110, 170, 0.15)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "rgba(80, 150, 210, 1)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(0, 110, 170, 0.2)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(80, 150, 210, 1)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 300]}
                ticks={[0, 75, 150, 225, 300]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 180, 220, 0.06)" }} />
              <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                {weekData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={
                      i === 4
                        ? "rgba(0, 230, 250, 1)"
                        : "rgba(0, 175, 225, 0.82)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          className="enf-card"
          style={{
            flex: 1,
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: 600, color: "rgba(200, 230, 255, 1)", marginBottom: "4px" }}>
            抓拍类型统计（按数据来源）
          </div>
          <div style={{ fontSize: "10px", color: "rgba(60, 120, 180, 1)", marginBottom: "12px", letterSpacing: "0.5px" }}>
            CAPTURE TYPES BY SOURCE
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie
                  data={pieDataBySource}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={76}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieDataBySource.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                pointerEvents: "none",
              }}
            >
              <div style={{ fontSize: "22px", fontWeight: 700, color: "rgba(220, 242, 255, 1)" }}>
                100%
              </div>
              <div style={{ fontSize: "9px", color: "rgba(80, 150, 210, 1)", letterSpacing: "1px" }}>
                TOTAL
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "18px", marginTop: "8px" }}>
            {pieDataBySource.map((d) => (
              <div
                key={d.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "11px",
                  color: "rgba(130, 180, 230, 1)",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: d.color,
                    boxShadow: `0 0 5px ${d.color}`,
                  }}
                />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Capture records section */}
      <div className="enf-card" style={{ overflow: "hidden" }}>
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid rgba(0, 110, 170, 0.22)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "0" }}>
            {[
              { key: "records" as const, label: "抓拍记录", labelEn: "Capture Records" },
              { key: "uploads" as const, label: "违法上传", labelEn: "Violation Uploads" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveRecordTab(t.key)}
                style={{
                  padding: "5px 18px",
                  fontSize: "12px",
                  fontWeight: activeRecordTab === t.key ? 700 : 400,
                  color:
                    activeRecordTab === t.key
                      ? "rgba(0, 215, 240, 1)"
                      : "rgba(90, 155, 210, 1)",
                  background: "transparent",
                  border: "none",
                  borderBottom:
                    activeRecordTab === t.key
                      ? "2px solid rgba(0, 215, 240, 1)"
                      : "2px solid transparent",
                  cursor: "pointer",
                  marginBottom: "-1px",
                }}
              >
                {t.label}
                <span
                  style={{
                    fontSize: "10px",
                    color:
                      activeRecordTab === t.key
                        ? "rgba(0, 160, 200, 0.7)"
                        : "rgba(60, 110, 170, 0.7)",
                    marginLeft: "4px",
                  }}
                >
                  ({t.labelEn})
                </span>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 13px",
                background: "rgba(6, 24, 64, 1)",
                color: "rgba(130, 185, 235, 1)",
                border: "1px solid rgba(0, 110, 170, 0.32)",
                borderRadius: "4px",
                fontSize: "11px",
                cursor: "pointer",
              }}
            >
              <Filter size={11} /> 筛选
            </button>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 14px",
                background: "rgba(6, 24, 64, 1)",
                color: "rgba(130, 185, 235, 1)",
                border: "1px solid rgba(0, 110, 170, 0.32)",
                borderRadius: "4px",
                fontSize: "11px",
                cursor: "pointer",
              }}
            >
              <Download size={11} /> 导出报告 (Export PDF)
            </button>
          </div>
        </div>

        <div
          style={{
            padding: "16px 20px",
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
          }}
        >
          {captureRecords.map((rec, idx) => (
            <div
              key={rec.id}
              style={{
                width: "calc(25% - 11px)",
                minWidth: "220px",
                background: "rgba(6, 20, 52, 1)",
                border: "1px solid rgba(0, 110, 170, 0.26)",
                borderRadius: "8px",
                overflow: "hidden",
                transition: "border-color 0.15s",
              }}
            >
              <div
                style={{
                  height: "128px",
                  background: thumbColors[idx] || "rgba(18, 42, 88, 1)",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "36px", opacity: 0.18 }}>🚗</span>
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    padding: "2px 8px",
                    background: rec.uploaded
                      ? "rgba(0, 170, 210, 0.92)"
                      : "rgba(255, 80, 80, 0.92)",
                    color: "rgba(255, 255, 255, 1)",
                    borderRadius: "3px",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                  }}
                >
                  {rec.uploaded ? "UPLOADED" : "PENDING"}
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "30px",
                    background:
                      "linear-gradient(to top, rgba(6, 20, 52, 0.8), transparent)",
                  }}
                />
              </div>

              <div style={{ padding: "10px 13px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    marginBottom: "8px",
                    fontSize: "11px",
                    color: "rgba(150, 195, 240, 1)",
                  }}
                >
                  <span style={{ fontSize: "13px" }}>🚁</span>
                  <span style={{ fontWeight: 600 }}>{rec.device}</span>
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "rgba(80, 148, 205, 1)",
                    marginBottom: "3px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span style={{ color: "rgba(0, 160, 210, 0.7)" }}>📍</span>
                  {rec.gps}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "rgba(80, 148, 205, 1)",
                    marginBottom: "3px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span style={{ color: "rgba(0, 160, 210, 0.7)" }}>🕐</span>
                  {rec.time}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "rgba(0, 190, 225, 1)",
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span>🔮</span>
                  {rec.algo}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1px solid rgba(0, 90, 140, 0.22)",
                    paddingTop: "8px",
                  }}
                >
                  <button
                    style={{
                      fontSize: "11px",
                      color: "rgba(90, 168, 228, 1)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    View Detail
                  </button>
                  <button
                    style={{
                      fontSize: "11px",
                      color: "rgba(90, 168, 228, 1)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViolationStats;
