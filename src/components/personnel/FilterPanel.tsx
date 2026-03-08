import React, { useState } from "react";
import { Upload, Download, RotateCcw, ChevronDown } from "lucide-react";

interface FilterPanelProps {
  onFilterChange?: (filters: Record<string, string>) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange = () => {} }) => {
  const [unit, setUnit] = useState("");
  const [certStatus, setCertStatus] = useState("");
  const [licenseLevel, setLicenseLevel] = useState("");
  const [timeRange, setTimeRange] = useState("");

  const handleReset = () => {
    setUnit("");
    setCertStatus("");
    setLicenseLevel("");
    setTimeRange("");
    onFilterChange({});
  };

  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 8,
    fontSize: 14,
    appearance: "none",
    outline: "none",
    background: "rgba(30, 36, 50, 1)",
    color: "rgba(180, 188, 204, 1)",
    border: "1px solid rgba(40, 48, 66, 1)",
  };

  return (
    <div
      data-cmp="FilterPanel"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: 200,
        flexShrink: 0,
        background: "rgba(18, 22, 30, 1)",
        borderRight: "1px solid rgba(40, 48, 66, 1)",
        padding: "20px 16px",
        minHeight: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(224, 228, 236, 1)" }}>筛选条件</span>
        <button onClick={handleReset} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(120, 130, 150, 1)", background: "none", border: "none", cursor: "pointer" }}>
          <RotateCcw size={11} />
          重置
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: "rgba(120, 130, 150, 1)" }}>所属单位</label>
        <div style={{ position: "relative" }}>
          <select style={selectStyle} value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="">全部单位</option>
            <option value="north">北方大队</option>
            <option value="south">南方大队</option>
            <option value="east">东部中队</option>
            <option value="west">西部中队</option>
            <option value="center">中央直属队</option>
          </select>
          <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "rgba(120, 130, 150, 1)", pointerEvents: "none" }} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: "rgba(120, 130, 150, 1)" }}>资质状态</label>
        <div style={{ position: "relative" }}>
          <select style={selectStyle} value={certStatus} onChange={(e) => setCertStatus(e.target.value)}>
            <option value="">全部状态</option>
            <option value="valid">持证</option>
            <option value="no_cert">无证</option>
            <option value="expired">已过期</option>
            <option value="expiring">即将过期</option>
          </select>
          <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "rgba(120, 130, 150, 1)", pointerEvents: "none" }} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: "rgba(120, 130, 150, 1)" }}>执照等级</label>
        <div style={{ position: "relative" }}>
          <select style={selectStyle} value={licenseLevel} onChange={(e) => setLicenseLevel(e.target.value)}>
            <option value="">全部等级</option>
            <option value="a">A级（超视距）</option>
            <option value="b">B级（视距内）</option>
            <option value="c">C级（娱乐级）</option>
            <option value="d">D级（培训级）</option>
          </select>
          <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "rgba(120, 130, 150, 1)", pointerEvents: "none" }} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: "rgba(120, 130, 150, 1)" }}>时间范围</label>
        <div style={{ position: "relative" }}>
          <select style={selectStyle} value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="">不限</option>
            <option value="7">近7天</option>
            <option value="30">近30天</option>
            <option value="90">近90天</option>
            <option value="365">近一年</option>
          </select>
          <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "rgba(120, 130, 150, 1)", pointerEvents: "none" }} />
        </div>
      </div>

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8, paddingTop: 16, borderTop: "1px solid rgba(40, 48, 66, 1)" }}>
        <button
          onClick={() => {}}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 12px", borderRadius: 8, fontSize: 14, fontWeight: 500, background: "rgba(24, 144, 255, 1)", color: "rgba(255, 255, 255, 1)", border: "none", cursor: "pointer" }}
        >
          <Upload size={15} />
          批量导入
        </button>
        <button
          onClick={() => {}}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 12px", borderRadius: 8, fontSize: 14, fontWeight: 500, background: "rgba(30, 36, 50, 1)", color: "rgba(180, 188, 204, 1)", border: "1px solid rgba(40, 48, 66, 1)", cursor: "pointer" }}
        >
          <Download size={15} />
          导出数据
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
