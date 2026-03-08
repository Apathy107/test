import React, { useState } from "react";
import StatusBadge from "@personnel/components/StatusBadge";
import TechTable from "@personnel/components/TechTable";
import { Archive, UserX, Plus } from "lucide-react";

type ResignTab = "active" | "archive";

const resignApps = [
  { id: "RG001", name: "陈晨", unit: "北郊中队", type: "主动辞职", applyDate: "2025-07-10", expectedDate: "2025-08-10", stage: "直属领导面谈", stageKey: "info" as const, handover: "待启动", hasBlock: false },
  { id: "RG002", name: "王磊", unit: "南区分队", type: "合同到期", applyDate: "2025-07-05", expectedDate: "2025-07-31", stage: "人事审核中", stageKey: "pending" as const, handover: "进行中", hasBlock: false },
  { id: "RG003", name: "孙华", unit: "西城分队", type: "组织劝退", applyDate: "2025-06-20", expectedDate: "2025-07-15", stage: "交接阻塞", stageKey: "danger" as const, handover: "阻塞", hasBlock: true },
  { id: "RG004", name: "钱莉", unit: "东城分队", type: "主动辞职", applyDate: "2025-06-10", expectedDate: "2025-07-01", stage: "已完成离职", stageKey: "approved" as const, handover: "已完成", hasBlock: false },
];

const archiveRecords = [
  { id: "AR001", name: "刘芳", unit: "北郊中队 / 2024", type: "主动辞职", leaveDate: "2024-12-31", archiveYear: "2024", queryPermission: "人事 / 审计" },
  { id: "AR002", name: "赵明", unit: "东城分队 / 2024", type: "合同到期", leaveDate: "2024-09-30", archiveYear: "2024", queryPermission: "人事 / 审计" },
  { id: "AR003", name: "陈静", unit: "西城分队 / 2023", type: "主动辞职", leaveDate: "2023-06-15", archiveYear: "2023", queryPermission: "人事 / 审计" },
];

const appCols = [
  { key: "id", title: "申请编号" }, { key: "name", title: "飞手" }, { key: "unit", title: "所属单位" },
  { key: "type", title: "离职类型" }, { key: "apply", title: "申请日期" }, { key: "expected", title: "预计离职" },
  { key: "handover", title: "交接状态" }, { key: "stage", title: "审批阶段" }, { key: "action", title: "操作" },
];

const archiveCols = [
  { key: "id", title: "档案编号" }, { key: "name", title: "姓名" }, { key: "unit", title: "原单位/年份" },
  { key: "type", title: "离职类型" }, { key: "date", title: "离职日期" }, { key: "perm", title: "查阅权限" }, { key: "action", title: "操作" },
];

const PilotResignation: React.FC = () => {
  const [tab, setTab] = useState<ResignTab>("active");
  console.log("PilotResignation page rendered");

  return (
    <>
      {/* Summary */}
      <div className="flex gap-4 mb-5">
        {[
          { label: "本月离职申请", value: "4", icon: UserX, color: "rgba(255, 120, 80, 1)" },
          { label: "待审批", value: "2", icon: UserX, color: "rgba(255, 200, 0, 1)" },
          { label: "交接阻塞", value: "1", icon: UserX, color: "rgba(255, 80, 80, 1)" },
          { label: "已完成离职", value: "1", icon: Archive, color: "rgba(0, 220, 150, 1)" },
          { label: "历史档案", value: "32", icon: Archive, color: "rgba(180, 160, 255, 1)" },
        ].map((s) => {
          const Ic = s.icon;
          return (
            <div key={s.label} className="flex-1 tech-card rounded-lg p-4 flex items-center gap-3">
              <Ic size={20} style={{ color: s.color }} />
              <div>
                <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs" style={{ color: "rgba(100, 140, 180, 1)" }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs + add button */}
      <div className="flex items-center gap-2 mb-4">
        {([
          { key: "active", label: "离职申请" },
          { key: "archive", label: "历史档案" },
        ] as { key: ResignTab; label: string }[]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-2 rounded text-xs font-medium transition-colors"
            style={{
              background: tab === t.key ? "rgba(0, 80, 130, 0.3)" : "rgba(16, 38, 76, 0.5)",
              border: tab === t.key ? "1px solid rgba(0, 212, 255, 0.5)" : "1px solid rgba(0, 100, 150, 0.2)",
              color: tab === t.key ? "rgba(0, 212, 255, 1)" : "rgba(100, 140, 180, 1)",
            }}
          >
            {t.label}
          </button>
        ))}
        <div className="flex-1" />
        {tab === "active" && (
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded text-xs font-medium"
            style={{ background: "rgba(0, 100, 150, 0.2)", border: "1px solid rgba(0, 212, 255, 0.4)", color: "rgba(0, 212, 255, 1)" }}
            onClick={() => console.log("New resignation application")}
          >
            <Plus size={12} />
            提交离职申请
          </button>
        )}
      </div>

      {/* Active resignation applications */}
      <div style={{ display: tab === "active" ? "block" : "none" }}>
        <TechTable columns={appCols}>
          {resignApps.map((app) => (
            <tr key={app.id} className="table-row-hover" style={{ borderBottom: "1px solid rgba(0, 80, 120, 0.2)" }}>
              <td className="px-3 py-3 text-xs" style={{ color: "rgba(0, 212, 255, 0.7)", fontFamily: "monospace" }}>{app.id}</td>
              <td className="px-3 py-3 text-xs font-medium" style={{ color: "rgba(200, 220, 240, 1)" }}>{app.name}</td>
              <td className="px-3 py-3 text-xs" style={{ color: "rgba(140, 180, 210, 1)" }}>{app.unit}</td>
              <td className="px-3 py-3 text-xs">
                <span className="px-2 py-0.5 rounded" style={{
                  background: app.type === "主动辞职" ? "rgba(0, 80, 120, 0.2)" : app.type === "合同到期" ? "rgba(120, 60, 0, 0.2)" : "rgba(120, 30, 30, 0.2)",
                  color: app.type === "主动辞职" ? "rgba(0, 200, 255, 0.9)" : app.type === "合同到期" ? "rgba(255, 160, 50, 0.9)" : "rgba(255, 100, 80, 0.9)",
                  border: `1px solid ${app.type === "主动辞职" ? "rgba(0, 180, 220, 0.25)" : app.type === "合同到期" ? "rgba(220, 130, 30, 0.25)" : "rgba(220, 80, 60, 0.25)"}`,
                  fontSize: "11px",
                }}>
                  {app.type}
                </span>
              </td>
              <td className="px-3 py-3 text-xs" style={{ color: "rgba(140, 180, 210, 1)" }}>{app.applyDate}</td>
              <td className="px-3 py-3 text-xs" style={{ color: "rgba(255, 150, 80, 0.9)", fontFamily: "monospace" }}>{app.expectedDate}</td>
              <td className="px-3 py-3">
                <StatusBadge
                  status={app.handover === "已完成" ? "active" : app.handover === "阻塞" ? "danger" : app.handover === "进行中" ? "info" : "warning"}
                  label={app.handover}
                />
              </td>
              <td className="px-3 py-3">
                <StatusBadge status={app.stageKey} label={app.stage} />
              </td>
              <td className="px-3 py-3">
                <div className="flex gap-2">
                  <button className="px-2 py-1 rounded text-xs" style={{ background: "rgba(0, 80, 120, 0.2)", border: "1px solid rgba(0, 150, 200, 0.3)", color: "rgba(0, 212, 255, 0.9)" }}
                    onClick={() => console.log("View resignation:", app.id)}>
                    详情
                  </button>
                  {app.stageKey === "info" && (
                    <button className="px-2 py-1 rounded text-xs" style={{ background: "rgba(0, 100, 60, 0.2)", border: "1px solid rgba(0, 180, 100, 0.3)", color: "rgba(0, 200, 120, 0.9)" }}
                      onClick={() => console.log("Approve resignation:", app.id)}>
                      审批
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </TechTable>

        {/* Handover blocked notice */}
        <div
          className="mt-4 p-3 rounded flex items-center gap-3 text-xs"
          style={{ background: "rgba(180, 50, 50, 0.08)", border: "1px solid rgba(255, 80, 80, 0.2)" }}
        >
          <span className="w-2 h-2 rounded-full flex-shrink-0 pulse-dot" style={{ background: "rgba(255, 80, 80, 1)" }} />
          <span style={{ color: "rgba(255, 140, 120, 1)" }}>
            孙华（RG003）存在未完成的工作交接项，已标记"交接阻塞"，离职手续无法办结。请督促完成三方确认（交接人/接收人/监交人）。
          </span>
        </div>
      </div>

      {/* Archive records */}
      <div style={{ display: tab === "archive" ? "block" : "none" }}>
        <div
          className="mb-4 p-3 rounded text-xs flex items-center gap-2"
          style={{ background: "rgba(0, 60, 100, 0.15)", border: "1px solid rgba(0, 150, 200, 0.2)" }}
        >
          <Archive size={13} style={{ color: "rgba(0, 180, 220, 0.8)" }} />
          <span style={{ color: "rgba(100, 160, 200, 1)" }}>
            历史档案按"单位 + 离职年份"存储，仅人事/审计部门可调阅，普通管理员不可见在职以外的飞手信息。档案保留期限为离职后 6 个月查询权限。
          </span>
        </div>
        <TechTable columns={archiveCols}>
          {archiveRecords.map((r) => (
            <tr key={r.id} className="table-row-hover" style={{ borderBottom: "1px solid rgba(0, 80, 120, 0.2)" }}>
              <td className="px-3 py-3 text-xs" style={{ color: "rgba(0, 212, 255, 0.7)", fontFamily: "monospace" }}>{r.id}</td>
              <td className="px-3 py-3 text-xs font-medium" style={{ color: "rgba(160, 190, 220, 0.8)" }}>{r.name}</td>
              <td className="px-3 py-3 text-xs" style={{ color: "rgba(100, 140, 180, 1)" }}>{r.unit}</td>
              <td className="px-3 py-3 text-xs" style={{ color: "rgba(140, 170, 200, 1)" }}>{r.type}</td>
              <td className="px-3 py-3 text-xs" style={{ color: "rgba(120, 160, 200, 1)", fontFamily: "monospace" }}>{r.leaveDate}</td>
              <td className="px-3 py-3 text-xs">
                <span className="px-2 py-0.5 rounded" style={{ background: "rgba(60, 30, 100, 0.2)", color: "rgba(160, 130, 220, 0.9)", border: "1px solid rgba(140, 100, 200, 0.25)", fontSize: "11px" }}>
                  {r.queryPermission}
                </span>
              </td>
              <td className="px-3 py-3">
                <button className="px-2 py-1 rounded text-xs" style={{ background: "rgba(0, 80, 120, 0.15)", border: "1px solid rgba(0, 130, 170, 0.25)", color: "rgba(0, 180, 220, 0.7)" }}
                  onClick={() => console.log("View archive:", r.id)}>
                  调阅
                </button>
              </td>
            </tr>
          ))}
        </TechTable>
      </div>
    </>
  );
};

export default PilotResignation;