import React, { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../components/layout/Layout";
import DataWorkspace from "../components/layout/DataWorkspace";
import TechCard from "../components/ui-custom/TechCard";
import {
  Upload,
  Download,
  AlertTriangle,
  Map as MapIcon,
  ListOrdered,
  TrendingUp,
  ShieldCheck,
  Siren,
  BadgeCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

type XlsxModule = typeof import("xlsx");
let _xlsx: XlsxModule | null = null;
async function getXlsx() {
  if (_xlsx) return _xlsx;
  _xlsx = (await import("xlsx")) as XlsxModule;
  return _xlsx;
}

type BlackFlyRow = Record<string, unknown> & {
  __rowId: number;
  __time?: string;
  __district?: string;
  __type?: string;
};

const breadcrumbs = [
  { label: "数据智能中心", path: "/data" },
  { label: "统计分析中心" },
  { label: "黑飞统计" },
];

const COLOR = "rgb(0, 213, 255)";
const COLORS = [
  "rgb(0, 213, 255)",
  "rgb(16, 185, 129)",
  "rgb(245, 158, 11)",
  "rgb(239, 68, 68)",
  "rgb(139, 92, 246)",
  "rgb(20, 184, 166)",
  "rgb(236, 72, 153)",
];

const DEMO_EXCEL_ROWS: Record<string, unknown>[] = [
  { 发生时间: "2026-03-01 10:12:00", 区域: "浦东新区", 黑飞类型: "疑似黑飞", 地点: "陆家嘴", 经度: 121.51, 纬度: 31.24, 备注: "群众举报" },
  { 发生时间: "2026-03-01 18:40:00", 区域: "黄浦区", 黑飞类型: "禁飞区闯入", 地点: "外滩", 经度: 121.49, 纬度: 31.24, 备注: "系统告警" },
  { 发生时间: "2026-03-02 09:05:00", 区域: "虹桥区", 黑飞类型: "疑似黑飞", 地点: "虹桥枢纽", 经度: 121.33, 纬度: 31.20, 备注: "机场净空" },
  { 发生时间: "2026-03-02 21:15:00", 区域: "静安区", 黑飞类型: "夜间飞行", 地点: "南京西路", 经度: 121.47, 纬度: 31.23, 备注: "" },
  { 发生时间: "2026-03-03 14:22:00", 区域: "徐汇区", 黑飞类型: "超高飞行", 地点: "徐家汇", 经度: 121.44, 纬度: 31.20, 备注: "高度异常" },
  { 发生时间: "2026-03-04 08:33:00", 区域: "长宁区", 黑飞类型: "疑似黑飞", 地点: "中山公园", 经度: 121.42, 纬度: 31.22, 备注: "" },
  { 发生时间: "2026-03-05 12:10:00", 区域: "闵行区", 黑飞类型: "禁飞区闯入", 地点: "七宝", 经度: 121.35, 纬度: 31.16, 备注: "核心区" },
  { 发生时间: "2026-03-06 19:47:00", 区域: "普陀区", 黑飞类型: "夜间飞行", 地点: "长风公园", 经度: 121.40, 纬度: 31.23, 备注: "" },
  { 发生时间: "2026-03-07 16:05:00", 区域: "宝山区", 黑飞类型: "疑似黑飞", 地点: "吴淞口", 经度: 121.51, 纬度: 31.37, 备注: "" },
  { 发生时间: "2026-03-08 11:56:00", 区域: "嘉定区", 黑飞类型: "禁飞区闯入", 地点: "南翔", 经度: 121.31, 纬度: 31.30, 备注: "" },
  { 发生时间: "2026-03-09 22:18:00", 区域: "松江区", 黑飞类型: "夜间飞行", 地点: "大学城", 经度: 121.23, 纬度: 31.03, 备注: "" },
  { 发生时间: "2026-03-10 07:30:00", 区域: "青浦区", 黑飞类型: "疑似黑飞", 地点: "朱家角", 经度: 121.06, 纬度: 31.11, 备注: "" },
  { 发生时间: "2026-03-11 15:42:00", 区域: "奉贤区", 黑飞类型: "超高飞行", 地点: "海湾", 经度: 121.47, 纬度: 30.92, 备注: "高度>120m" },
  { 发生时间: "2026-03-12 13:08:00", 区域: "金山区", 黑飞类型: "疑似黑飞", 地点: "金山卫", 经度: 121.34, 纬度: 30.73, 备注: "" },
  { 发生时间: "2026-03-13 20:01:00", 区域: "崇明区", 黑飞类型: "禁飞区闯入", 地点: "城桥", 经度: 121.40, 纬度: 31.62, 备注: "" },
  { 发生时间: "2026-03-14 10:30:00", 区域: "浦东新区", 黑飞类型: "疑似黑飞", 地点: "张江", 经度: 121.60, 纬度: 31.20, 备注: "与任务冲突" },
];

function pickFirstString(row: Record<string, unknown>, keys: string[]) {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
    if (v instanceof Date && !Number.isNaN(v.valueOf())) return v.toISOString();
  }
  return undefined;
}

function normalizeRows(raw: Record<string, unknown>[]) {
  return raw
    .map((r, idx) => {
      const time =
        pickFirstString(r, ["发生时间", "时间", "日期", "date", "time", "datetime"]) ??
        undefined;
      const district =
        pickFirstString(r, ["区域", "区县", "辖区", "行政区", "地区", "district", "area"]) ??
        undefined;
      const type =
        pickFirstString(r, ["黑飞类型", "类型", "类别", "type", "category"]) ?? undefined;

      return {
        ...r,
        __rowId: idx + 1,
        __time: time,
        __district: district,
        __type: type,
      } satisfies BlackFlyRow;
    })
    .filter((r) => {
      // drop completely empty rows
      const keys = Object.keys(r).filter((k) => !k.startsWith("__"));
      return keys.some((k) => {
        const v = (r as Record<string, unknown>)[k];
        return v !== null && v !== undefined && String(v).trim() !== "";
      });
    });
}

function groupCount<T extends string>(arr: (T | undefined)[], topN = 6) {
  const counter: Record<string, number> = {};
  for (const v of arr) {
    const key = (v ?? "未填写").trim() || "未填写";
    counter[key] = (counter[key] ?? 0) + 1;
  }
  const entries = Object.entries(counter).sort((a, b) => b[1] - a[1]);
  const top = entries.slice(0, topN);
  const rest = entries.slice(topN);
  const restCount = rest.reduce((s, [, c]) => s + c, 0);
  const result = top.map(([name, value]) => ({ name, value }));
  if (restCount > 0) result.push({ name: "其他", value: restCount });
  return result;
}

function extractDayKey(time?: string) {
  if (!time) return "未知";
  // Accept: YYYY-MM-DD..., YYYY/MM/DD..., Excel serial already stringified, etc.
  const m = time.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  return time.slice(0, 10);
}

export default function BlackFlyStats() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [rows, setRows] = useState<BlackFlyRow[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Demo data for showcasing (overridden when importing Excel)
    if (rows.length) return;
    setRows(normalizeRows(DEMO_EXCEL_ROWS));
    setFileName("演示数据（内置）");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headerKeys = useMemo(() => {
    const first = rows[0];
    if (!first) return [];
    return Object.keys(first).filter((k) => !k.startsWith("__"));
  }, [rows]);

  const kpis = useMemo(() => {
    const total = rows.length;
    const districtFilled = rows.filter((r) => (r.__district ?? "").trim()).length;
    const typeFilled = rows.filter((r) => (r.__type ?? "").trim()).length;
    const timeFilled = rows.filter((r) => (r.__time ?? "").trim()).length;
    return { total, districtFilled, typeFilled, timeFilled };
  }, [rows]);

  const disposalByDay = useMemo(() => {
    // Demo: derive handled count from rowId to keep it deterministic
    const counter: Record<string, { warn: number; handle: number }> = {};
    for (const r of rows) {
      const day = extractDayKey(r.__time);
      const base = counter[day] ?? { warn: 0, handle: 0 };
      base.warn += 1;
      base.handle += r.__rowId % 3 === 0 ? 1 : 0; // ~33% handled
      counter[day] = base;
    }
    const entries = Object.entries(counter)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-30);
    return entries.map(([day, v]) => ({
      day,
      warn: v.warn,
      handle: v.handle,
    }));
  }, [rows]);

  const ratioPie = useMemo(() => {
    const warnFlights = rows.length;
    const compliantFlights = Math.max(0, Math.round(rows.length * 18)); // demo scale
    return [
      { name: "黑飞预警架次", value: warnFlights },
      { name: "合规飞行架次", value: compliantFlights },
    ];
  }, [rows]);

  const statCards = useMemo(() => {
    const warn = rows.length;
    const handle = rows.reduce((s, r) => s + (r.__rowId % 3 === 0 ? 1 : 0), 0);
    const highRisk = rows.reduce((s, r) => s + (String(r.__type ?? "").includes("禁飞") ? 1 : 0), 0);
    const night = rows.reduce((s, r) => s + (String(r.__type ?? "").includes("夜间") ? 1 : 0), 0);
    const avgPerDay = disposalByDay.length ? (warn / disposalByDay.length) : 0;
    return {
      warn,
      handle,
      highRisk,
      night,
      avgPerDay: Number.isFinite(avgPerDay) ? Number(avgPerDay.toFixed(1)) : 0,
    };
  }, [rows, disposalByDay.length]);

  const byDay = useMemo(() => {
    const counter: Record<string, number> = {};
    for (const r of rows) {
      const k = extractDayKey(r.__time);
      counter[k] = (counter[k] ?? 0) + 1;
    }
    const entries = Object.entries(counter)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-14);
    return entries.map(([day, count]) => ({ day, count }));
  }, [rows]);

  const districtPie = useMemo(
    () => groupCount(rows.map((r) => r.__district), 6),
    [rows]
  );
  const typePie = useMemo(() => groupCount(rows.map((r) => r.__type), 6), [rows]);

  const districtTop = useMemo(() => {
    const list = groupCount(rows.map((r) => r.__district), 999)
      .filter((x) => x.name !== "其他")
      .slice(0, 8);
    return list;
  }, [rows]);

  const handlePick = () => fileRef.current?.click();

  const handleFile = async (f: File) => {
    setError("");
    setFileName(f.name);
    try {
      const XLSX = await getXlsx();
      const buf = await f.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array", cellDates: true });
      const sheetName = wb.SheetNames[0];
      if (!sheetName) throw new Error("Excel 中未找到工作表");
      const ws = wb.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
        defval: "",
        raw: false,
      });
      const normalized = normalizeRows(json);
      setRows(normalized);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "解析 Excel 失败";
      setError(msg);
      setRows([]);
    }
  };

  const handleDownloadTemplate = async () => {
    const XLSX = await getXlsx();
    const headers = [
      "发生时间",
      "区域",
      "黑飞类型",
      "地点",
      "经度",
      "纬度",
      "备注",
    ];
    const aoa = [headers, ["2026-03-14 10:30:00", "南山区", "疑似黑飞", "科技园", "113.93", "22.54", "示例数据"]];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "黑飞统计");
    XLSX.writeFile(wb, "黑飞统计模板.xlsx");
  };

  return (
    <Layout>
      <DataWorkspace
        breadcrumbs={breadcrumbs}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-transparent border border-border/50 text-sm text-muted-foreground rounded hover:bg-white/[0.04] hover:text-white transition-colors"
              title="下载 Excel 模板"
            >
              <Download className="w-4 h-4" />
              下载模板
            </button>
            <button
              type="button"
              onClick={handlePick}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/50 text-sm text-primary rounded hover:bg-primary/20 transition-colors"
              title="导入 Excel"
            >
              <Upload className="w-4 h-4" />
              导入 Excel
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFile(f);
                e.currentTarget.value = "";
              }}
            />
          </div>
        }
      >
        {/* Top: heatmap + ranking */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7">
            <TechCard title="黑飞事件热力图" icon={MapIcon} glow={true}>
              <div
                className="relative rounded border border-border/50 overflow-hidden"
                style={{
                  height: 320,
                  background:
                    "radial-gradient(800px 320px at 60% 40%, rgba(0,213,255,0.12), transparent 65%), linear-gradient(180deg, rgba(2,10,24,0.2), rgba(2,10,24,0.65))",
                }}
              >
                <div className="absolute inset-0 opacity-[0.28]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div className="absolute left-3 top-3 text-[11px] text-muted-foreground">
                  演示：热力底图占位（后续可接入真实 GIS/热力图组件）
                </div>
                <div className="absolute left-3 bottom-3 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <div className="w-2 h-2 rounded-sm" style={{ background: "rgb(0,213,255)" }} />
                  低
                  <div className="w-28 h-2 rounded-sm overflow-hidden border border-border/40">
                    <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg, rgba(0,213,255,0.35), rgba(245,158,11,0.45), rgba(239,68,68,0.55))" }} />
                  </div>
                  高
                </div>
              </div>
            </TechCard>
          </div>

          <div className="xl:col-span-5">
            <TechCard title="黑飞事件排行" icon={ListOrdered} glow={true}>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={districtTop} margin={{ top: 18, right: 18, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: "rgb(15, 23, 42)", border: "1px solid rgb(30, 58, 138)", borderRadius: "4px" }}
                      itemStyle={{ fontSize: "14px" }}
                    />
                    <Bar dataKey="value" fill={COLOR} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TechCard>
          </div>
        </div>

        {/* Middle: KPI tiles */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {[
            { label: "当期黑飞预警数量", value: statCards.warn, icon: Siren, color: "rgba(0,213,255,1)" },
            { label: "当期黑飞处置数量", value: statCards.handle, icon: ShieldCheck, color: "rgba(16,185,129,1)" },
            { label: "禁飞区闯入数量", value: statCards.highRisk, icon: AlertTriangle, color: "rgba(239,68,68,1)" },
            { label: "夜间飞行数量", value: statCards.night, icon: TrendingUp, color: "rgba(245,158,11,1)" },
            { label: "日均预警数量", value: statCards.avgPerDay, icon: BadgeCheck, color: "rgba(139,92,246,1)" },
          ].map((x) => (
            <div
              key={x.label}
              className="bg-card/80 backdrop-blur-sm border border-border rounded px-4 py-3 flex items-center gap-3"
            >
              <div
                className="w-10 h-10 rounded flex items-center justify-center"
                style={{ background: `${x.color.replace("rgb", "rgba").replace(")", ", 0.10)")}`, border: `1px solid ${x.color.replace("rgb", "rgba").replace(")", ", 0.25)")}` }}
              >
                <x.icon size={18} style={{ color: x.color }} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-muted-foreground tracking-widest truncate">{x.label}</div>
                <div className="text-xl font-black text-white">{String(x.value)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom: trend + ratio + detail */}
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 space-y-6">
            <TechCard title="黑飞处置趋势" icon={TrendingUp} glow={true}>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={disposalByDay} margin={{ top: 20, right: 24, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: "rgb(15, 23, 42)", border: "1px solid rgb(30, 58, 138)", borderRadius: "4px" }}
                      itemStyle={{ fontSize: "14px" }}
                    />
                    <Line type="monotone" dataKey="warn" name="当日黑飞预警数量" stroke="rgb(0,213,255)" strokeWidth={3} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                    <Line type="monotone" dataKey="handle" name="当日黑飞处置数量" stroke="rgb(16,185,129)" strokeWidth={3} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-[10px] text-muted-foreground">
                数据口径：演示模式下“处置数量”为按记录行号生成的稳定模拟值；导入 Excel 后可按字段扩展真实处置逻辑。
              </div>
            </TechCard>

            <TechCard title="事件趋势（近14天）" glow={true}>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={byDay} margin={{ top: 20, right: 24, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: "rgb(15, 23, 42)", border: "1px solid rgb(30, 58, 138)", borderRadius: "4px" }}
                      itemStyle={{ fontSize: "14px" }}
                    />
                    <Line type="monotone" dataKey="count" stroke={COLOR} strokeWidth={3} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TechCard>
          </div>

          <div className="xl:col-span-4 space-y-6">
            <TechCard title="黑飞占比" glow={true}>
              <div className="h-[260px] w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ratioPie}
                      cx="50%"
                      cy="50%"
                      innerRadius={62}
                      outerRadius={86}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill="rgb(0,213,255)" />
                      <Cell fill="rgb(16,185,129)" />
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: "rgb(15, 23, 42)", border: "1px solid rgb(30, 58, 138)", borderRadius: "4px" }}
                      itemStyle={{ color: "white" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <div className="text-2xl font-black text-white">{rows.length}</div>
                  <div className="text-[10px] text-muted-foreground">黑飞预警架次</div>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-1 text-xs">
                {ratioPie.map((x, i) => (
                  <div key={x.name} className="flex items-center justify-between p-2 bg-white/[0.02] border border-border/50 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: i === 0 ? "rgb(0,213,255)" : "rgb(16,185,129)" }} />
                      <span className="text-muted-foreground">{x.name}</span>
                    </div>
                    <span className="text-white font-semibold">{x.value}</span>
                  </div>
                ))}
              </div>
            </TechCard>

            <TechCard title="黑飞记录明细（Top 20）" glow={true}>
              <div className="max-h-[420px] overflow-auto border border-border/50 rounded">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-background/95 backdrop-blur border-b border-border/50">
                    <tr>
                      <th className="text-left p-2 font-semibold text-muted-foreground">#</th>
                      <th className="text-left p-2 font-semibold text-muted-foreground">发生时间</th>
                      <th className="text-left p-2 font-semibold text-muted-foreground">区域</th>
                      <th className="text-left p-2 font-semibold text-muted-foreground">类型</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 20).map((r) => (
                      <tr key={r.__rowId} className="border-b border-border/30 hover:bg-white/[0.03]">
                        <td className="p-2 text-muted-foreground">{r.__rowId}</td>
                        <td className="p-2 text-white/90">{r.__time ?? "—"}</td>
                        <td className="p-2 text-white/90">{r.__district ?? "—"}</td>
                        <td className="p-2 text-white/90">{r.__type ?? "—"}</td>
                      </tr>
                    ))}
                    {!rows.length && (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-muted-foreground">
                          暂无数据
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {error && (
                <div className="mt-3 flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded text-destructive text-sm">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>{error}</div>
                </div>
              )}
              <div className="mt-2 text-[10px] text-muted-foreground">
                当前数据源：{fileName || "未导入"}（导入 Excel 后自动更新）
              </div>
            </TechCard>
          </div>
        </div>
      </DataWorkspace>
    </Layout>
  );
}

