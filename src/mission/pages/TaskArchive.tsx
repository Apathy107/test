import React, { useState } from "react";
import { Archive, Download, FileText, Image, Video, Map, BarChart2, FolderArchive, Maximize2, Play } from "lucide-react";

const archivedTasks = [
  { id: "RW-XJ-2025-0041", name: "南环快速路例行巡检",   type: "常态化巡检", device: "高空瞭望1号", pilot: "赵琳", date: "2025-07-11", duration: "62分钟",  anomalies: 2,  photos: 48 },
  { id: "RW-XJ-2025-0040", name: "港口码头周界检查",     type: "常态化巡检", device: "消费级机",   pilot: "孙斌", date: "2025-07-11", duration: "91分钟",  anomalies: 0,  photos: 72 },
  { id: "RW-AB-2025-0030", name: "开幕式广场安保巡逻",   type: "安保",       device: "巡逻一号",   pilot: "王磊", date: "2025-07-10", duration: "180分钟", anomalies: 1,  photos: 120 },
  { id: "RW-ZX-2025-0008", name: "污水处理厂专项检测",   type: "专项",       device: "侦察小蜂",   pilot: "刘洋", date: "2025-07-09", duration: "45分钟",  anomalies: 5,  photos: 36 },
];

const TaskArchive: React.FC = () => {
  const [selected, setSelected] = useState(archivedTasks[0].id);
  const task = archivedTasks.find((t) => t.id === selected)!;
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  console.log("TaskArchive rendered, selected:", selected);

  return (
    <div style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden" }}>
          {/* Left: archived list */}
          <div
            style={{
              width: "320px",
              flexShrink: 0,
              background: "rgba(4, 12, 30, 0.9)",
              borderRight: "1px solid rgba(0, 100, 160, 0.2)",
              overflowY: "auto",
            }}
          >
            <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(0,80,140,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: "rgba(0,212,255,1)", fontWeight: 600 }}>归档记录</span>
              <Archive size={14} style={{ color: "rgba(0,150,200,0.6)" }} />
            </div>
            {/* Filters */}
            <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(0,60,120,0.15)" }}>
              <input placeholder="搜索任务" style={{ width: "100%", padding: "6px 10px", background: "rgba(0,30,70,0.5)", border: "1px solid rgba(0,80,140,0.3)", borderRadius: "4px", color: "rgba(160,200,240,1)", fontSize: "12px", outline: "none" }} />
            </div>
            {archivedTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelected(t.id)}
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid rgba(0,60,120,0.12)",
                  cursor: "pointer",
                  background: selected === t.id ? "rgba(0,80,140,0.3)" : "transparent",
                  borderLeft: selected === t.id ? "3px solid rgba(0,212,255,1)" : "3px solid transparent",
                }}
              >
                <div style={{ fontSize: "13px", color: "rgba(180,215,250,1)", fontWeight: selected === t.id ? 600 : 400, marginBottom: "4px" }}>{t.name}</div>
                <div style={{ display: "flex", gap: "6px", marginBottom: "3px" }}>
                  <span style={{ fontSize: "11px", color: "rgba(80,120,170,1)" }}>{t.type}</span>
                  <span style={{ fontSize: "11px", color: "rgba(80,120,170,1)" }}>·</span>
                  <span style={{ fontSize: "11px", color: "rgba(80,120,170,1)" }}>{t.date}</span>
                </div>
                {t.anomalies > 0 && (
                  <span style={{ fontSize: "10px", color: "rgba(255,180,0,1)", background: "rgba(255,180,0,0.1)", padding: "1px 6px", borderRadius: "2px", border: "1px solid rgba(255,180,0,0.25)" }}>
                    {t.anomalies} 个异常
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Right: archive detail */}
          <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "17px", fontWeight: 700, color: "rgba(200,230,255,1)", marginBottom: "4px" }}>{task.name}</div>
                <span style={{ fontSize: "12px", color: "rgba(0,180,220,1)", fontFamily: "monospace" }}>{task.id}</span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", fontSize: "12px", background: "rgba(0,120,180,0.2)", color: "rgba(0,212,255,1)", border: "1px solid rgba(0,212,255,0.4)", borderRadius: "4px", cursor: "pointer" }}
                  onClick={() => {
                    const content = [
                      `任务编号: ${task.id}`,
                      `任务名称: ${task.name}`,
                      "包含文件:",
                      "- 执行信息 execute_info.txt",
                      "- 轨迹 KML trajectory.kml",
                      "- 轨迹 KMZ trajectory.kmz",
                      "- 图传视频 video.mp4",
                      "- 巡查照片集 photos.zip",
                      "- 传感器数据 sensor.csv",
                      "- AI识别结果 ai_results.zip",
                    ].join("\n");
                    const blob = new Blob([content], {
                      type: "application/zip",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${task.id}_archive.zip`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  <FolderArchive size={13} /> 下载数据
                </button>
                <button
                  style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", fontSize: "12px", background: "rgba(0,60,120,0.4)", color: "rgba(0,180,255,1)", border: "1px solid rgba(0,120,180,0.4)", borderRadius: "4px", cursor: "pointer" }}
                  onClick={() => {
                    const lines = [
                      `任务报告 PDF （示意）`,
                      `任务编号: ${task.id}`,
                      `任务名称: ${task.name}`,
                      "",
                      "一、执行信息",
                      `执行设备: ${task.device}`,
                      `飞手: ${task.pilot}`,
                      `执行日期: ${task.date}`,
                      `任务时长: ${task.duration}`,
                      "",
                      "二、飞行轨迹",
                      " - 轨迹文件: trajectory.kml / trajectory.kmz（示意）",
                      "",
                      "三、巡查照片和 AI 识别结果",
                      " - 巡查照片集：photos.zip（示意，仅列出关键样本）",
                      " - AI 识别结果：包含识别图片、AI 算法类型、事件名称、抓拍时间等信息（示意）",
                      "",
                      "四、飞手总结",
                      " - 此处展示飞手在任务归档时填写的总结内容",
                    ].join("\n");
                    const blob = new Blob([lines], {
                      type: "application/pdf",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${task.id}_report.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download size={13} /> 导出报告
                </button>
              </div>
            </div>

            {/* Execution info */}
            <div className="tech-card" style={{ borderRadius: "6px", padding: "18px", marginBottom: "16px" }}>
              <div style={{ fontSize: "13px", color: "rgba(0,212,255,1)", fontWeight: 600, marginBottom: "14px" }}>执行信息</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 40px" }}>
                {[
                  ["执行设备", task.device],
                  ["飞手", task.pilot],
                  ["执行日期", task.date],
                  ["任务时长", task.duration],
                  ["AI识别异常", `${task.anomalies} 处`],
                  ["采集照片", `${task.photos} 张`],
                  ["轨迹文件", "trajectory.kml"],
                  ["传感器数据", "sensor_data.csv"],
                ].map(([k, v]) => (
                  <div key={k} style={{ minWidth: "160px" }}>
                    <div style={{ fontSize: "11px", color: "rgba(80,120,170,1)", marginBottom: "2px" }}>{k}</div>
                    <div style={{ fontSize: "13px", color: "rgba(180,210,240,1)" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Flight path & video preview */}
            <div className="tech-card" style={{ borderRadius: "6px", padding: "18px", marginBottom: "16px" }}>
              <div style={{ fontSize: "13px", color: "rgba(0,212,255,1)", fontWeight: 600, marginBottom: "14px" }}>飞行轨迹与图传视频</div>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {/* Mini map */}
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ fontSize: "12px", color: "rgba(100,140,180,1)", marginBottom: 6 }}>飞行轨迹小地图</div>
                  <div
                    style={{
                      height: 160,
                      borderRadius: 6,
                      background: "radial-gradient(circle at 10% 20%, rgba(0,120,200,0.7), rgba(0,20,50,0.9))",
                      border: "1px solid rgba(0,120,200,0.6)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Map size={36} style={{ position: "absolute", left: 16, top: 14, color: "rgba(0,212,255,0.9)" }} />
                    <div style={{ position: "absolute", left: 16, bottom: 12, fontSize: 11, color: "rgba(180,210,240,0.9)" }}>
                      轨迹预览（示意）
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "6px 0", fontSize: 11, background: "rgba(0,80,130,0.35)", color: "rgba(0,212,255,1)", border: "1px solid rgba(0,150,200,0.5)", borderRadius: 4, cursor: "pointer" }}
                      onClick={() => console.log("Download trajectory KML", task.id)}
                    >
                      <Download size={11} /> 下载 KML
                    </button>
                    <button
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "6px 0", fontSize: 11, background: "rgba(0,60,100,0.5)", color: "rgba(0,200,255,1)", border: "1px solid rgba(0,140,190,0.5)", borderRadius: 4, cursor: "pointer" }}
                      onClick={() => console.log("Download trajectory KMZ", task.id)}
                    >
                      <Download size={11} /> 下载 KMZ
                    </button>
                  </div>
                </div>
                {/* Video preview */}
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ fontSize: "12px", color: "rgba(100,140,180,1)", marginBottom: 6 }}>图传视频</div>
                  <div
                    style={{
                      height: 160,
                      borderRadius: 6,
                      background: "linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,60,120,0.9))",
                      border: "1px solid rgba(0,120,200,0.6)",
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(200,230,255,0.9)",
                      fontSize: 12,
                    }}
                  >
                    <Play size={28} style={{ marginRight: 6, color: "rgba(0,212,255,1)" }} />
                    支持视频预览（示意）
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "6px 0", fontSize: 11, background: "rgba(0,80,130,0.35)", color: "rgba(0,212,255,1)", border: "1px solid rgba(0,150,200,0.5)", borderRadius: 4, cursor: "pointer" }}
                      onClick={() => console.log("Preview video mp4", task.id)}
                    >
                      <Video size={11} /> 预览
                    </button>
                    <button
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "6px 0", fontSize: 11, background: "rgba(0,60,100,0.5)", color: "rgba(0,200,255,1)", border: "1px solid rgba(0,140,190,0.5)", borderRadius: 4, cursor: "pointer" }}
                      onClick={() => console.log("Download video mp4", task.id)}
                    >
                      <Download size={11} /> 下载 MP4
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="tech-card" style={{ borderRadius: "6px", padding: "18px", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div style={{ fontSize: "13px", color: "rgba(0,212,255,1)", fontWeight: 600 }}>巡查照片</div>
                <button
                  style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", fontSize: 11, background: "rgba(0,80,140,0.35)", color: "rgba(0,212,255,1)", border: "1px solid rgba(0,150,200,0.5)", borderRadius: 4, cursor: "pointer" }}
                  onClick={() => console.log("Download photo album zip", task.id)}
                >
                  <Download size={11} /> 下载照片集
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["桥梁裂缝_01.jpg", "桥梁裂缝_02.jpg", "路面坑洼_01.jpg", "施工占道_01.jpg"].map((name, idx) => (
                  <div
                    key={name}
                    style={{
                      width: 120,
                      borderRadius: 6,
                      overflow: "hidden",
                      background: "rgba(0,30,70,0.9)",
                      border: "1px solid rgba(0,80,140,0.6)",
                      cursor: "pointer",
                    }}
                    onClick={() => setPhotoPreview(name)}
                  >
                    <div
                      style={{
                        height: 72,
                        backgroundImage:
                          idx % 2 === 0
                            ? "linear-gradient(135deg, rgba(0,120,200,0.8), rgba(0,20,50,0.9))"
                            : "linear-gradient(135deg, rgba(255,180,0,0.7), rgba(60,20,0,0.9))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "rgba(230,240,255,0.9)",
                        fontSize: 11,
                      }}
                    >
                      <Image size={16} style={{ marginRight: 4 }} /> 预览
                    </div>
                    <div style={{ padding: "6px 8px", fontSize: 10, color: "rgba(160,190,220,1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI recognition results */}
            <div className="tech-card" style={{ borderRadius: "6px", padding: "18px", marginBottom: "16px" }}>
              <div style={{ fontSize: "13px", color: "rgba(0,212,255,1)", fontWeight: 600, marginBottom: "10px" }}>AI 识别结果</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ background: "rgba(3,20,45,1)" }}>
                    {["缩略图", "事件名称", "AI算法类型", "抓拍时间", "置信度", "操作"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "6px 8px",
                          textAlign: "left",
                          color: "rgba(130,170,210,1)",
                          borderBottom: "1px solid rgba(0,80,130,0.6)",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      thumb: "桥面裂缝",
                      name: "桥面裂缝异常",
                      algo: "结构裂缝检测 v2.1",
                      time: "2025-07-11 09:18:23",
                      conf: 0.93,
                      file: "ai_crack_01.jpg",
                    },
                    {
                      thumb: "违停车辆",
                      name: "应急车道违停",
                      algo: "车辆检测 v3.0",
                      time: "2025-07-11 09:26:11",
                      conf: 0.88,
                      file: "ai_parking_01.jpg",
                    },
                  ].map((r) => (
                    <tr key={r.time} className="hover:bg-[rgba(4,40,80,0.6)]">
                      <td style={{ padding: "6px 8px" }}>
                        <button
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "3px 8px",
                            borderRadius: 4,
                            background: "rgba(0,40,80,0.7)",
                            border: "1px solid rgba(0,120,190,0.6)",
                            color: "rgba(180,210,245,1)",
                            cursor: "pointer",
                          }}
                          onClick={() => setPhotoPreview(r.file)}
                        >
                          <Image size={12} /> {r.thumb}
                        </button>
                      </td>
                      <td style={{ padding: "6px 8px", color: "rgba(200,220,240,1)" }}>{r.name}</td>
                      <td style={{ padding: "6px 8px", color: "rgba(160,190,230,1)" }}>{r.algo}</td>
                      <td style={{ padding: "6px 8px", color: "rgba(140,180,210,1)", fontFamily: "monospace" }}>{r.time}</td>
                      <td style={{ padding: "6px 8px" }}>
                        <span style={{ color: "rgba(0,220,150,1)", fontWeight: 600 }}>{Math.round(r.conf * 100)}%</span>
                      </td>
                      <td style={{ padding: "6px 8px" }}>
                        <button
                          style={{
                            padding: "3px 8px",
                            fontSize: 10,
                            borderRadius: 3,
                            background: "rgba(0,80,120,0.4)",
                            border: "1px solid rgba(0,150,200,0.5)",
                            color: "rgba(0,212,255,1)",
                            cursor: "pointer",
                          }}
                          onClick={() => console.log("Download AI image", r.file)}
                        >
                          下载图片
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 数据文件清单 */}
            <div className="tech-card" style={{ borderRadius: "6px", padding: "18px", marginBottom: "16px" }}>
              <div style={{ fontSize: "13px", color: "rgba(0,212,255,1)", fontWeight: 600, marginBottom: "14px" }}>数据文件清单</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {[
                  { label: "轨迹数据 KML/KMZ", icon: Map, ext: "trajectory.kml / trajectory.kmz", color: "rgba(0,200,120,1)" },
                  { label: "图传视频 MP4", icon: Video, ext: "video.mp4", color: "rgba(0,180,255,1)" },
                  { label: "巡查照片集 ZIP", icon: Image, ext: "photos.zip", color: "rgba(180,100,255,1)" },
                  { label: "传感器数据 CSV", icon: BarChart2, ext: "sensor_data.csv", color: "rgba(255,180,0,1)" },
                  { label: "AI识别结果 ZIP", icon: FileText, ext: "ai_results.zip", color: "rgba(255,120,0,1)" },
                  { label: "执行信息 TXT", icon: FileText, ext: "execute_info.txt", color: "rgba(140,190,230,1)" },
                ].map((f) => {
                  const Icon = f.icon;
                  return (
                    <button
                      key={f.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 14px",
                        background: `${f.color}10`,
                        border: `1px solid ${f.color}35`,
                        borderRadius: "6px",
                        cursor: "pointer",
                        color: f.color,
                        fontSize: "12px",
                      }}
                      onClick={() => console.log("Download file", f.ext, "for", task.id)}
                    >
                      <Icon size={16} />
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontWeight: 500 }}>{f.label}</div>
                        <div style={{ fontSize: "10px", opacity: 0.7 }}>{f.ext}</div>
                      </div>
                      <Download size={12} style={{ opacity: 0.7, marginLeft: "4px" }} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pilot summary */}
            <div className="tech-card" style={{ borderRadius: "6px", padding: "18px" }}>
              <div style={{ fontSize: "13px", color: "rgba(0,212,255,1)", fontWeight: 600, marginBottom: "12px" }}>飞手总结</div>
              <textarea
                rows={4}
                defaultValue="本次巡检任务顺利完成，共飞行62分钟，覆盖南环快速路全段约8.3公里。发现2处路面异常，已拍照记录并上传系统。设备状态良好，建议后续加强重点路段监测频率。"
                style={{ width: "100%", padding: "10px 12px", background: "rgba(0,30,70,0.4)", border: "1px solid rgba(0,80,140,0.3)", borderRadius: "4px", color: "rgba(160,200,240,1)", fontSize: "13px", outline: "none", resize: "vertical" }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                <button style={{ padding: "6px 16px", fontSize: "12px", background: "rgba(0,100,160,0.5)", color: "rgba(0,212,255,1)", border: "1px solid rgba(0,160,210,0.4)", borderRadius: "4px", cursor: "pointer" }}>
                  保存总结
                </button>
              </div>
            </div>
          </div>

          {/* 照片大图预览 */}
          {photoPreview && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
              onClick={(e) => e.target === e.currentTarget && setPhotoPreview(null)}
            >
              <div
                className="tech-card"
                style={{ padding: "16px 20px", maxWidth: "80%", maxHeight: "80%", display: "flex", flexDirection: "column", gap: 10 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 13, color: "rgba(200,230,255,1)", fontWeight: 600 }}>
                    照片预览 - {photoPreview}
                  </div>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: 11, padding: "4px 10px" }}
                    onClick={() => setPhotoPreview(null)}
                  >
                    关闭
                  </button>
                </div>
                <div
                  style={{
                    flex: 1,
                    minHeight: 260,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, rgba(0,120,200,0.9), rgba(0,10,30,0.95))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(230,240,255,0.95)",
                    fontSize: 14,
                  }}
                >
                  <Image size={28} style={{ marginRight: 6 }} /> 大图预览占位
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                  <button
                    className="btn-primary-blue"
                    style={{ fontSize: 12 }}
                    onClick={() => console.log("Download single photo", photoPreview, "for", task.id)}
                  >
                    下载该图片
                  </button>
                </div>
              </div>
            </div>
          )}
    </div>
  );
};

export default TaskArchive;
