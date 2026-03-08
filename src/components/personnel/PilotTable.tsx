import React, { useState } from "react";
import { Eye, Edit, MoreHorizontal, AlertTriangle } from "lucide-react";
import StatusBadge from "./StatusBadge";
import StarRating from "./StarRating";
import ExpiryBar from "./ExpiryBar";

export interface Pilot {
  id: string;
  avatar: string;
  name: string;
  unit: string;
  licenseType: string;
  licenseLevel: string;
  issueDate: string;
  expiryDate: string;
  certStatus: "valid" | "expired" | "expiring" | "no_cert";
  workStatus: "active" | "on_mission" | "resigned";
  performance: number;
}

interface PilotTableProps {
  pilots?: Pilot[];
}

const defaultPilots: Pilot[] = [
  { id: "1", avatar: "张", name: "张伟", unit: "北方大队", licenseType: "AOPA", licenseLevel: "A级（超视距）", issueDate: "2022-06-01", expiryDate: "2024-06-01", certStatus: "expired", workStatus: "active", performance: 4.2 },
  { id: "2", avatar: "李", name: "李明", unit: "南方大队", licenseType: "UTC", licenseLevel: "B级（视距内）", issueDate: "2023-03-15", expiryDate: "2025-06-20", certStatus: "expiring", workStatus: "on_mission", performance: 4.8 },
  { id: "3", avatar: "王", name: "王芳", unit: "东部中队", licenseType: "AOPA", licenseLevel: "A级（超视距）", issueDate: "2022-09-01", expiryDate: "2026-09-01", certStatus: "valid", workStatus: "active", performance: 3.9 },
  { id: "4", avatar: "刘", name: "刘洋", unit: "西部中队", licenseType: "AOPA", licenseLevel: "C级（娱乐级）", issueDate: "2021-12-01", expiryDate: "2024-05-10", certStatus: "expired", workStatus: "resigned", performance: 3.2 },
  { id: "5", avatar: "陈", name: "陈静", unit: "北方大队", licenseType: "UTC", licenseLevel: "B级（视距内）", issueDate: "2023-07-20", expiryDate: "2026-07-20", certStatus: "valid", workStatus: "active", performance: 4.5 },
  { id: "6", avatar: "赵", name: "赵磊", unit: "中央直属队", licenseType: "AOPA", licenseLevel: "A级（超视距）", issueDate: "2023-01-10", expiryDate: "2025-07-05", certStatus: "expiring", workStatus: "on_mission", performance: 4.0 },
  { id: "7", avatar: "孙", name: "孙鹏", unit: "南方大队", licenseType: "无", licenseLevel: "—", issueDate: "—", expiryDate: "—", certStatus: "no_cert", workStatus: "active", performance: 2.8 },
  { id: "8", avatar: "周", name: "周娜", unit: "东部中队", licenseType: "UTC", licenseLevel: "D级（培训级）", issueDate: "2024-01-05", expiryDate: "2027-01-05", certStatus: "valid", workStatus: "active", performance: 3.6 },
];

const PilotTable: React.FC<PilotTableProps> = ({ pilots = defaultPilots }) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const getRowStyle = (pilot: Pilot): React.CSSProperties => {
    if (pilot.certStatus === "expired") return { background: "rgba(255, 77, 79, 0.06)" };
    if (pilot.certStatus === "expiring") return { background: "rgba(250, 173, 20, 0.05)" };
    return {};
  };

  const avatarColors: Record<string, string> = {
    "张": "rgba(24, 144, 255, 1)", "李": "rgba(82, 196, 26, 1)", "王": "rgba(114, 46, 209, 1)", "刘": "rgba(120, 130, 150, 1)",
    "陈": "rgba(250, 173, 20, 1)", "赵": "rgba(24, 144, 255, 1)", "孙": "rgba(255, 77, 79, 1)", "周": "rgba(82, 196, 26, 1)",
  };

  const thStyle: React.CSSProperties = {
    padding: "12px 14px",
    textAlign: "left",
    fontSize: 12,
    fontWeight: 500,
    color: "rgba(120, 130, 150, 1)",
    borderBottom: "1px solid rgba(40, 48, 66, 1)",
    whiteSpace: "nowrap",
    background: "rgba(18, 22, 30, 1)",
  };

  return (
    <div data-cmp="PilotTable" style={{ flex: 1, minWidth: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ overflowX: "auto", overflowY: "auto", flex: 1 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 2 }}>
            <tr>
              <th style={thStyle}>飞手信息</th>
              <th style={thStyle}>所属单位</th>
              <th style={thStyle}>执照类型</th>
              <th style={thStyle}>有效期</th>
              <th style={thStyle}>资质状态</th>
              <th style={thStyle}>当前状态</th>
              <th style={thStyle}>绩效评分</th>
              <th style={{ ...thStyle, textAlign: "center" }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {pilots.map((pilot) => {
              const isHovered = hoveredRow === pilot.id;
              const rowBase = getRowStyle(pilot);
              return (
                <tr
                  key={pilot.id}
                  style={{
                    ...rowBase,
                    background: isHovered ? "rgba(24, 144, 255, 0.06)" : rowBase.background,
                    transition: "background 0.15s",
                    cursor: "default",
                  }}
                  onMouseEnter={() => setHoveredRow(pilot.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid rgba(40, 48, 66, 0.5)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0, background: avatarColors[pilot.avatar] ?? "rgba(24,144,255,1)", color: "rgba(255,255,255,1)" }}>
                        {pilot.avatar}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(224, 228, 236, 1)" }}>{pilot.name}</span>
                          {pilot.certStatus === "expiring" && <AlertTriangle size={13} style={{ color: "rgba(250, 173, 20, 1)" }} />}
                          {pilot.certStatus === "expired" && <AlertTriangle size={13} style={{ color: "rgba(255, 77, 79, 1)" }} />}
                        </div>
                        <span style={{ fontSize: 12, color: "rgba(120, 130, 150, 1)" }}>ID: {pilot.id.padStart(6, "0")}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid rgba(40, 48, 66, 0.5)" }}>
                    <span style={{ fontSize: 14, color: "rgba(180, 188, 204, 1)" }}>{pilot.unit}</span>
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid rgba(40, 48, 66, 0.5)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(224, 228, 236, 1)" }}>{pilot.licenseType}</span>
                      <span style={{ fontSize: 12, color: "rgba(120, 130, 150, 1)" }}>{pilot.licenseLevel}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid rgba(40, 48, 66, 0.5)" }}>
                    {pilot.certStatus === "no_cert" ? <span style={{ fontSize: 12, color: "rgba(120, 130, 150, 1)" }}>—</span> : <ExpiryBar expiryDate={pilot.expiryDate} issueDate={pilot.issueDate} />}
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid rgba(40, 48, 66, 0.5)" }}>
                    <StatusBadge status={pilot.certStatus} />
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid rgba(40, 48, 66, 0.5)" }}>
                    <StatusBadge status={pilot.workStatus} />
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid rgba(40, 48, 66, 0.5)" }}>
                    <StarRating score={pilot.performance} />
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid rgba(40, 48, 66, 0.5)", textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                      <button title="查看详情" onClick={() => {}} style={{ padding: 6, borderRadius: 6, background: "rgba(24, 144, 255, 0.12)", color: "rgba(24, 144, 255, 1)", border: "none", cursor: "pointer" }}><Eye size={14} /></button>
                      <button title="编辑" onClick={() => {}} style={{ padding: 6, borderRadius: 6, background: "rgba(82, 196, 26, 0.12)", color: "rgba(82, 196, 26, 1)", border: "none", cursor: "pointer" }}><Edit size={14} /></button>
                      <button title="更多" onClick={() => {}} style={{ padding: 6, borderRadius: 6, background: "rgba(40, 48, 66, 1)", color: "rgba(120, 130, 150, 1)", border: "none", cursor: "pointer" }}><MoreHorizontal size={14} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PilotTable;
