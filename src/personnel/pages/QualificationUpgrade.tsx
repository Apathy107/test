import React, { useState } from "react";
import StatusBadge from "@personnel/components/StatusBadge";
import TechTable from "@personnel/components/TechTable";
import FilterBar from "@personnel/components/FilterBar";
import { ArrowRight, ChevronRight, Plus } from "lucide-react";

type TabKey = "upgrade" | "review";

const upgradeApps = [
  { id: "UA001", name: "李明", unit: "东城分队", fromLevel: "视距内 (VLOS)", toLevel: "超视距 (BVLOS)", submitDate: "2025-07-05", stage: "终审中", stageStatus: "pending" as const, score: 92 },
  { id: "UA002", name: "周强", unit: "北郊中队", fromLevel: "超视距 (BVLOS)", toLevel: "教员执照", submitDate: "2025-07-01", stage: "初审通过", stageStatus: "info" as const, score: 88 },
  { id: "UA003", name: "吴敏", unit: "西城分队", fromLevel: "视距内 (VLOS)", toLevel: "超视距 (BVLOS)", submitDate: "2025-06-28", stage: "已批准", stageStatus: "approved" as const, score: 95 },
  { id: "UA004", name: "林涛", unit: "南区分队", fromLevel: "视距内 (VLOS)", toLevel: "超视距 (BVLOS)", submitDate: "2025-06-20", stage: "材料退回", stageStatus: "rejected" as const, score: 76 },
];

const reviewApps = [
  { id: "RE001", name: "张三", unit: "东城分队", certType: "超视距执照", lastReview: "2023-03-15", nextReview: "2025-03-15", daysLeft: -120, stage: "逾期未处理", stageStatus: "danger" as const },
  { id: "RE002", name: "陈峰", unit: "应急响应", certType: "超视距执照", lastReview: "2023-06-10", nextReview: "2025-06-10", daysLeft: -34, stage: "逾期未处理", stageStatus: "danger" as const },
  { id: "RE003", name: "刘洋", unit: "北郊中队", certType: "CAAC视距内", lastReview: "2023-07-21", nextReview: "2025-07-21", daysLeft: 7, stage: "待提交", stageStatus: "warning" as const },
  { id: "RE004", name: "赵磊", unit: "东城分队", certType: "视距内执照", lastReview: "2023-08-14", nextReview: "2025-08-14", daysLeft: 31, stage: "已提醒", stageStatus: "info" as const },
];

const upgradeCols = [
  { key: "no", title: "序号", width: "60px", align: "center" as const },
  { key: "id", title: "申请编号" }, { key: "name", title: "飞手" }, { key: "unit", title: "所属单位" },
  { key: "from", title: "当前级别" }, { key: "to", title: "目标级别" }, { key: "date", title: "提交日期" },
  { key: "score", title: "考试成绩", align: "center" as const }, { key: "stage", title: "审批阶段" }, { key: "action", title: "操作" },
];

const reviewCols = [
  { key: "no", title: "序号", width: "60px", align: "center" as const },
  { key: "id", title: "复审编号" }, { key: "name", title: "飞手" }, { key: "unit", title: "所属单位" },
  { key: "cert", title: "证书类型" }, { key: "last", title: "上次复审" }, { key: "next", title: "下次复审" },
  { key: "days", title: "剩余天数", align: "center" as const }, { key: "stage", title: "处理状态" }, { key: "action", title: "操作" },
];

const QualificationUpgrade: React.FC = () => {
  const [tab, setTab] = useState<TabKey>("upgrade");
  const [upgradeList, setUpgradeList] = useState(upgradeApps);
  const [reviewList] = useState(reviewApps);
  const [selectedUpgradeIds, setSelectedUpgradeIds] = useState<string[]>([]);
  const [selectedReviewIds, setSelectedReviewIds] = useState<string[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showDetail, setShowDetail] = useState<typeof upgradeApps[0] | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState({
    keyword: "",
    unit: "",
    targetLevel: "",
    dateFrom: "",
    dateTo: "",
    stageStatus: "",
  });
  console.log("QualificationUpgrade page rendered");

  const filteredUpgrade = upgradeList.filter((app) => {
    if (filter.unit && app.unit !== filter.unit) return false;
    if (filter.targetLevel && app.toLevel.indexOf(filter.targetLevel) === -1) return false;
    if (filter.dateFrom && app.submitDate < filter.dateFrom) return false;
    if (filter.dateTo && app.submitDate > filter.dateTo) return false;
    if (filter.stageStatus && app.stageStatus !== filter.stageStatus) return false;
    if (filter.keyword) {
      const kw = filter.keyword.toLowerCase();
      if (
        !(
          app.id.toLowerCase().includes(kw) ||
          app.name.toLowerCase().includes(kw) ||
          app.unit.toLowerCase().includes(kw)
        )
      )
        return false;
    }
    return true;
  });

  const filteredReview = reviewList.filter((app) => {
    if (filter.unit && app.unit !== filter.unit) return false;
    if (filter.dateFrom && app.nextReview < filter.dateFrom) return false;
    if (filter.dateTo && app.nextReview > filter.dateTo) return false;
    if (filter.stageStatus && app.stageStatus !== filter.stageStatus) return false;
    return true;
  });

  const toggleSelectUpgrade = (id: string) => {
    setSelectedUpgradeIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectReview = (id: string) => {
    setSelectedReviewIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const allUpgradeChecked =
    filteredUpgrade.length > 0 &&
    filteredUpgrade.every((a) => selectedUpgradeIds.includes(a.id));

  const allReviewChecked =
    filteredReview.length > 0 &&
    filteredReview.every((a) => selectedReviewIds.includes(a.id));

  const toggleAllUpgrade = () => {
    if (allUpgradeChecked) {
      setSelectedUpgradeIds((prev) =>
        prev.filter((id) => !filteredUpgrade.some((a) => a.id === id))
      );
    } else {
      const ids = filteredUpgrade.map((a) => a.id);
      setSelectedUpgradeIds((prev) => Array.from(new Set([...prev, ...ids])));
    }
  };

  const toggleAllReview = () => {
    if (allReviewChecked) {
      setSelectedReviewIds((prev) =>
        prev.filter((id) => !filteredReview.some((a) => a.id === id))
      );
    } else {
      const ids = filteredReview.map((a) => a.id);
      setSelectedReviewIds((prev) => Array.from(new Set([...prev, ...ids])));
    }
  };

  const exportUpgrade = () => {
    const targets =
      selectedUpgradeIds.length > 0
        ? filteredUpgrade.filter((a) => selectedUpgradeIds.includes(a.id))
        : filteredUpgrade;
    if (!targets.length) return;
    const header = ["申请编号", "飞手", "所属单位", "当前级别", "目标级别", "提交日期", "考试成绩", "审批阶段"];
    const rows = targets.map((a) => [
      a.id,
      a.name,
      a.unit,
      a.fromLevel,
      a.toLevel,
      a.submitDate,
      a.score,
      a.stage,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "飞手资质升级复审记录.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Upgrade path illustration */}
      <div className="tech-card rounded-lg p-4 mb-5">
        <div className="text-xs font-semibold mb-3" style={{ color: "rgba(0, 212, 255, 0.8)", letterSpacing: "0.1em" }}>
          — 升级路径
        </div>
        <div className="flex items-center gap-3">
          {["视距内执照 (VLOS)", "超视距执照 (BVLOS)", "教员执照 (Instructor)"].map((level, i, arr) => (
            <React.Fragment key={level}>
              <div
                className="flex items-center justify-center px-5 py-3 rounded text-xs font-medium"
                style={{
                  background: i === 0 ? "rgba(0, 80, 130, 0.3)" : i === 1 ? "rgba(0, 100, 80, 0.3)" : "rgba(100, 60, 180, 0.3)",
                  border: `1px solid ${i === 0 ? "rgba(0, 180, 220, 0.4)" : i === 1 ? "rgba(0, 200, 150, 0.4)" : "rgba(180, 140, 255, 0.4)"}`,
                  color: i === 0 ? "rgba(0, 212, 255, 1)" : i === 1 ? "rgba(0, 220, 150, 1)" : "rgba(180, 160, 255, 1)",
                }}
              >
                {level}
              </div>
              {i < arr.length - 1 && (
                <ChevronRight size={16} style={{ color: "rgba(80, 120, 160, 1)", flexShrink: 0 }} />
              )}
            </React.Fragment>
          ))}
          <div className="flex-1" />
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded text-xs font-medium"
            style={{
              background: "rgba(0, 100, 150, 0.2)",
              border: "1px solid rgba(0, 212, 255, 0.4)",
              color: "rgba(0, 212, 255, 1)",
            }}
            onClick={() => setShowNewModal(true)}
          >
            <Plus size={13} />
            发起升级申请
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {([
          { key: "upgrade", label: "升级申请管理", count: upgradeApps.length },
          { key: "review", label: "复审与继续教育", count: reviewApps.length },
        ] as { key: TabKey; label: string; count: number }[]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex items-center gap-2 px-4 py-2 rounded text-xs font-medium transition-colors"
            style={{
              background: tab === t.key ? "rgba(0, 80, 130, 0.3)" : "rgba(16, 38, 76, 0.5)",
              border: tab === t.key ? "1px solid rgba(0, 212, 255, 0.5)" : "1px solid rgba(0, 100, 150, 0.2)",
              color: tab === t.key ? "rgba(0, 212, 255, 1)" : "rgba(100, 140, 180, 1)",
            }}
          >
            {t.label}
            <span className="px-1.5 rounded-full text-[10px]" style={{ background: "rgba(0, 60, 100, 0.5)", color: "rgba(120, 170, 210, 1)" }}>
              {t.count}
            </span>
          </button>
        ))}
        <div className="flex-1" />
        <FilterBar
          showAdd={false}
          showImport={false}
          placeholder="搜索申请..."
          onExport={exportUpgrade}
          onFilter={() => setFilterOpen((v) => !v)}
          onSearch={(v) => setFilter((f) => ({ ...f, keyword: v }))}
        />
      </div>

      {filterOpen && (
        <div className="tech-card rounded-lg p-3 mb-4 text-xs" style={{ color: "rgba(160,190,220,1)" }}>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <div className="form-label">提交日期起</div>
              <input
                type="date"
                className="form-input"
                value={filter.dateFrom}
                onChange={(e) => setFilter((f) => ({ ...f, dateFrom: e.target.value }))}
              />
            </div>
            <div>
              <div className="form-label">提交日期止</div>
              <input
                type="date"
                className="form-input"
                value={filter.dateTo}
                onChange={(e) => setFilter((f) => ({ ...f, dateTo: e.target.value }))}
              />
            </div>
            <div>
              <div className="form-label">所属单位</div>
              <select
                className="form-input"
                value={filter.unit}
                onChange={(e) => setFilter((f) => ({ ...f, unit: e.target.value }))}
              >
                <option value="">全部</option>
                <option>东城分队</option>
                <option>西城分队</option>
                <option>北郊中队</option>
                <option>南区分队</option>
              </select>
            </div>
            <div>
              <div className="form-label">目标级别</div>
              <select
                className="form-input"
                value={filter.targetLevel}
                onChange={(e) => setFilter((f) => ({ ...f, targetLevel: e.target.value }))}
              >
                <option value="">全部</option>
                <option>超视距</option>
                <option>教员执照</option>
              </select>
            </div>
            <div>
              <div className="form-label">审批状态</div>
              <select
                className="form-input"
                value={filter.stageStatus}
                onChange={(e) =>
                  setFilter((f) => ({ ...f, stageStatus: e.target.value }))
                }
              >
                <option value="">全部</option>
                <option value="pending">待审批/终审中</option>
                <option value="approved">已批准</option>
                <option value="rejected">已退回</option>
                <option value="info">其他状态</option>
              </select>
            </div>
            <div className="ml-auto flex gap-2">
              <button
                className="px-3 py-1.5 rounded"
                style={{ background: "rgba(16,38,76,1)", color: "rgba(140,180,210,1)" }}
                onClick={() =>
                  setFilter({
                    keyword: "",
                    unit: "",
                    targetLevel: "",
                    dateFrom: "",
                    dateTo: "",
                    stageStatus: "",
                  })
                }
              >
                重置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade applications table */}
      <div style={{ display: tab === "upgrade" ? "block" : "none" }}>
        <TechTable
          columns={upgradeCols}
          showIndexCheckbox
          allChecked={allUpgradeChecked}
          onToggleAll={toggleAllUpgrade}
        >
          {filteredUpgrade.map((app, index) => (
            <tr
              key={app.id}
              className="table-row-hover"
              style={{ borderBottom: "1px solid rgba(0, 80, 120, 0.2)" }}
            >
              <td className="px-3 py-3 text-xs text-center" style={{ color: "rgba(100,140,180,1)" }}>
                <input
                  type="checkbox"
                  checked={selectedUpgradeIds.includes(app.id)}
                  onChange={() => toggleSelectUpgrade(app.id)}
                  style={{ marginRight: 6, verticalAlign: "middle" }}
                />
                {index + 1}
              </td>
              <td className="px-3 py-3 text-xs" style={{ color: "rgba(0, 212, 255, 0.7)", fontFamily: "monospace" }}>{app.id}</td>
              <td className="px-3 py-3 text-xs font-medium" style={{ color: "rgba(200, 220, 240, 1)" }}>{app.name}</td>
              <td className="px-3 py-3 text-xs" style={{ color: "rgba(140, 180, 210, 1)" }}>{app.unit}</td>
              <td className="px-3 py-3 text-xs" style={{ color: "rgba(0, 212, 255, 0.8)" }}>{app.fromLevel}</td>
              <td className="px-3 py-3 text-xs">
                <div className="flex items-center gap-1">
                  <ArrowRight size={11} style={{ color: "rgba(0, 220, 150, 1)" }} />
                  <span style={{ color: "rgba(0, 220, 150, 1)" }}>{app.toLevel}</span>
                </div>
              </td>
              <td className="px-3 py-3 text-xs" style={{ color: "rgba(140, 180, 210, 1)" }}>{app.submitDate}</td>
              <td className="px-3 py-3 text-xs text-center">
                <span
                  className="font-bold"
                  style={{ color: app.score >= 90 ? "rgba(0, 220, 150, 1)" : app.score >= 80 ? "rgba(255, 200, 0, 1)" : "rgba(255, 80, 80, 1)" }}
                >
                  {app.score}
                </span>
              </td>
              <td className="px-3 py-3">
                <StatusBadge status={app.stageStatus} label={app.stage} />
              </td>
              <td className="px-3 py-3">
                <div className="flex gap-2">
                  <button className="px-2 py-1 rounded text-xs" style={{ background: "rgba(0, 80, 120, 0.2)", border: "1px solid rgba(0, 150, 200, 0.3)", color: "rgba(0, 212, 255, 0.9)" }}
                    onClick={() => setShowDetail(app)}
                  >
                    查看
                  </button>
                  {app.stageStatus === "pending" && (
                    <button className="px-2 py-1 rounded text-xs" style={{ background: "rgba(0, 100, 60, 0.2)", border: "1px solid rgba(0, 180, 100, 0.3)", color: "rgba(0, 200, 120, 0.9)" }}
                      onClick={() => {
                        setUpgradeList((list) =>
                          list.map((item) =>
                            item.id === app.id
                              ? { ...item, stage: "已批准", stageStatus: "approved" as const }
                              : item
                          )
                        );
                        console.log("Approved upgrade, sync pilot qualification:", app.id);
                      }}
                    >
                      审批
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </TechTable>
        <div
          className="flex justify-between items-center mt-2 text-xs"
          style={{ color: "rgba(100,140,180,1)" }}
        >
          <span>
            当前共 {filteredUpgrade.length} 条升级/复审申请，已选{" "}
            {selectedUpgradeIds.length} 条
          </span>
          <button
            className="px-3 py-1 rounded"
            style={{
              background: "rgba(0,100,90,0.35)",
              border: "1px solid rgba(0,200,150,0.6)",
              color: "rgba(0,230,180,1)",
              opacity: selectedUpgradeIds.length ? 1 : 0.5,
              cursor: selectedUpgradeIds.length ? "pointer" : "not-allowed",
            }}
            disabled={!selectedUpgradeIds.length}
            onClick={() => {
              if (!selectedUpgradeIds.length) return;
              setUpgradeList((list) =>
                list.map((item) =>
                  selectedUpgradeIds.includes(item.id)
                    ? {
                        ...item,
                        stage: "已批准",
                        stageStatus: "approved" as const,
                      }
                    : item
                )
              );
              setSelectedUpgradeIds([]);
              console.log("Batch approved upgrades:", selectedUpgradeIds);
            }}
          >
            批量审批通过
          </button>
        </div>
      </div>

      {/* Review table */}
      <div style={{ display: tab === "review" ? "block" : "none" }}>
        <TechTable
          columns={reviewCols}
          showIndexCheckbox
          allChecked={allReviewChecked}
          onToggleAll={toggleAllReview}
        >
          {filteredReview.map((app, index) => (
            <tr
              key={app.id}
              className="table-row-hover"
              style={{ borderBottom: "1px solid rgba(0, 80, 120, 0.2)" }}
            >
              <td className="px-3 py-3 text-xs text-center" style={{ color: "rgba(100,140,180,1)" }}>
                <input
                  type="checkbox"
                  checked={selectedReviewIds.includes(app.id)}
                  onChange={() => toggleSelectReview(app.id)}
                  style={{ marginRight: 6, verticalAlign: "middle" }}
                />
                {index + 1}
              </td>
              <td className="px-3 py-3 text-xs" style={{ color: "rgba(0, 212, 255, 0.7)", fontFamily: "monospace" }}>{app.id}</td>
              <td className="px-3 py-3 text-xs font-medium" style={{ color: "rgba(200, 220, 240, 1)" }}>{app.name}</td>
              <td className="px-3 py-3 text-xs" style={{ color: "rgba(140, 180, 210, 1)" }}>{app.unit}</td>
              <td className="px-3 py-3 text-xs" style={{ color: "rgba(180, 210, 240, 1)" }}>{app.certType}</td>
              <td className="px-3 py-3 text-xs" style={{ color: "rgba(140, 180, 210, 1)", fontFamily: "monospace" }}>{app.lastReview}</td>
              <td className="px-3 py-3 text-xs" style={{ color: "rgba(140, 180, 210, 1)", fontFamily: "monospace" }}>{app.nextReview}</td>
              <td className="px-3 py-3 text-xs text-center">
                <span style={{ color: app.daysLeft < 0 ? "rgba(255, 80, 80, 1)" : app.daysLeft <= 30 ? "rgba(255, 200, 0, 1)" : "rgba(0, 212, 255, 1)", fontWeight: 600 }}>
                  {app.daysLeft < 0 ? `逾期 ${Math.abs(app.daysLeft)}天` : `${app.daysLeft}天`}
                </span>
              </td>
              <td className="px-3 py-3">
                <StatusBadge status={app.stageStatus} label={app.stage} />
              </td>
              <td className="px-3 py-3">
                <button className="px-2 py-1 rounded text-xs" style={{ background: "rgba(0, 80, 120, 0.2)", border: "1px solid rgba(0, 150, 200, 0.3)", color: "rgba(0, 212, 255, 0.9)" }}
                  onClick={() => console.log("Arrange review:", app.id)}>
                  安排复审
                </button>
              </td>
            </tr>
          ))}
        </TechTable>
      </div>

      {showNewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(4,10,24,0.85)" }}
          onClick={() => setShowNewModal(false)}
        >
          <div
            className="tech-card rounded-lg p-5 w-[720px] max-h-[86vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="text-sm font-semibold" style={{ color: "rgba(210,230,250,1)" }}>发起资质升级申请</div>
                <div className="text-[11px]" style={{ color: "rgba(130,160,200,1)" }}>
                  录入飞手基础信息与证书信息，提交后进入审批流程。
                </div>
              </div>
              <button
                className="text-xs px-2 py-1 rounded"
                style={{ background: "rgba(10,30,60,1)", color: "rgba(140,180,210,1)" }}
                onClick={() => setShowNewModal(false)}
              >
                关闭
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs" style={{ color: "rgba(160,190,220,1)" }}>
              <div>
                <div className="form-label">姓名 *</div>
                <input className="form-input" placeholder="飞手姓名" />
              </div>
              <div>
                <div className="form-label">性别</div>
                <select className="form-input">
                  <option>男</option>
                  <option>女</option>
                </select>
              </div>
              <div>
                <div className="form-label">身份证号 *</div>
                <input className="form-input" placeholder="18位身份证号" />
              </div>
              <div>
                <div className="form-label">证书类型 *</div>
                <select className="form-input">
                  <option>警航培训合格证</option>
                  <option>CAAC视距内Ⅲ类</option>
                  <option>CAAC教员证</option>
                  <option>机长证</option>
                  <option>其他</option>
                </select>
              </div>
              <div>
                <div className="form-label">证书编号 *</div>
                <input className="form-input" />
              </div>
              <div>
                <div className="form-label">发证机关 *</div>
                <input className="form-input" />
              </div>
              <div>
                <div className="form-label">有效期起 *</div>
                <input type="date" className="form-input" />
              </div>
              <div>
                <div className="form-label">有效期止 *</div>
                <input type="date" className="form-input" />
              </div>
              <div>
                <div className="form-label">执照等级 *</div>
                <input className="form-input" />
              </div>
            </div>
            <div className="mt-3 text-xs" style={{ color: "rgba(160,190,220,1)" }}>
              <div className="form-label">上传证书附件（PDF/JPG/PNG）</div>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="form-input" />
            </div>
            <div className="mt-5 flex justify-end gap-3 text-xs">
              <button
                className="px-4 py-2 rounded"
                style={{ background: "rgba(16,38,76,1)", color: "rgba(140,180,210,1)" }}
                onClick={() => setShowNewModal(false)}
              >
                取消
              </button>
              <button
                className="px-5 py-2 rounded"
                style={{ background: "rgba(0,130,200,0.9)", color: "#fff" }}
                onClick={() => {
                  const newApp = {
                    id: `UA${(upgradeList.length + 1).toString().padStart(3, "0")}`,
                    name: "新飞手",
                    unit: "待分配单位",
                    fromLevel: "视距内 (VLOS)",
                    toLevel: "超视距 (BVLOS)",
                    submitDate: new Date().toISOString().slice(0, 10),
                    stage: "待审批",
                    stageStatus: "pending" as const,
                    score: 0,
                  };
                  setUpgradeList((list) => [newApp, ...list]);
                  console.log("Upgrade application submitted, entering approval flow", newApp);
                  setShowNewModal(false);
                }}
              >
                提交申请
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(4,10,24,0.85)" }}
          onClick={() => setShowDetail(null)}
        >
          <div
            className="tech-card rounded-lg p-5 w-[640px] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="text-sm font-semibold" style={{ color: "rgba(210,230,250,1)" }}>
                  升级申请详情 · {showDetail.name}（{showDetail.id}）
                </div>
                <div className="text-[11px]" style={{ color: "rgba(130,160,200,1)" }}>
                  单位：{showDetail.unit} · 当前级别：{showDetail.fromLevel} → 目标级别：{showDetail.toLevel}
                </div>
              </div>
              <button
                className="text-xs px-2 py-1 rounded"
                style={{ background: "rgba(10,30,60,1)", color: "rgba(140,180,210,1)" }}
                onClick={() => setShowDetail(null)}
              >
                关闭
              </button>
            </div>
            <div className="text-xs mb-4" style={{ color: "rgba(160,190,220,1)" }}>
              提交日期：{showDetail.submitDate} · 考试成绩：{showDetail.score} 分 · 当前审批阶段：{showDetail.stage}
            </div>
            <div className="flex justify-end gap-3 text-xs">
              {showDetail.stageStatus === "pending" && (
                <button
                  className="px-4 py-2 rounded"
                  style={{ background: "rgba(0,130,90,0.9)", color: "#fff" }}
                  onClick={() => {
                    setUpgradeList((list) =>
                      list.map((item) =>
                        item.id === showDetail.id
                          ? { ...item, stage: "已批准", stageStatus: "approved" as const }
                          : item
                      )
                    );
                    console.log("Approved in detail view, sync pilot qualification:", showDetail.id);
                    setShowDetail(null);
                  }}
                >
                  审批通过并更新资质
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QualificationUpgrade;