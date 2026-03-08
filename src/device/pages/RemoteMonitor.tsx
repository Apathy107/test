import React, { useState, useEffect } from "react";
import { Monitor, Zap, Power, RotateCcw, Home, RefreshCw, Cpu, Wifi, Battery, MapPin, LayoutGrid, List } from "lucide-react";
import StatusBadge from "@device/components/StatusBadge";
import { useLocation, useNavigate } from "react-router-dom";

type RemoteDevice = {
  id: string;
  name: string;
  model: string;
  type: "单兵飞机" | "机场";
  firmware: string;
  latestFirmware: string;
  status: "online" | "offline" | "fault" | "maintenance";
  battery: number;
  signal: number;
  lat: number;
  lng: number;
  flightHours: number;
  voltage: number;
  rtk: string;
  task: string;
  unit: string;
};

const RemoteMonitor: React.FC = () => {
  const location = useLocation() as { state?: { from?: string; deviceName?: string; sn?: string } };
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [showControl, setShowControl] = useState<string | null>(null);
  const [livePreview, setLivePreview] = useState<null | { deviceName: string; target: "airport" | "uav" }>(null);
  const [detailDevice, setDetailDevice] = useState<RemoteDevice | null>(null);
  const [reportSn, setReportSn] = useState<string | null>(null);
  const [remoteReport, setRemoteReport] = useState("");
  const green = "rgba(76,175,80,1)";
  const grey = "rgba(120,145,180,1)";
  const [airportDebug, setAirportDebug] = useState({
    coverOpen: false,
    acOn: false,
    silentOn: false,
    alarmOn: false,
    uavPowerOn: false,
    uavChargeOn: false,
    uav4gOn: false,
    airport4gOn: false,
    airport4gUrl: "https://4g.airport.example.com",
    airportUsed: 10.2,
    airportTotal: 50.6,
    uavUsed: 8.4,
    uavTotal: 64,
  });
  const [uavDebug, setUavDebug] = useState({
    powerOn: false,
    chargeOn: false,
    g4On: false,
    g4Url: "https://4g.uav.example.com",
    uavUsed: 6.1,
    uavTotal: 64,
  });

  const devices: RemoteDevice[] = [
    { id: "D001", name: "巡逻一号", model: "M300 RTK", type: "单兵飞机" as const, firmware: "v07.00.0120", latestFirmware: "v07.01.0050", status: "online" as const, battery: 82, signal: -65, lat: 39.9093, lng: 116.3974, flightHours: 342, voltage: 26.2, rtk: "已固定", task: "例行巡逻 78%", unit: "市局直属队" },
    { id: "D002", name: "应急响应2号", model: "M30T", type: "单兵飞机" as const, firmware: "v07.01.0050", latestFirmware: "v07.01.0050", status: "online" as const, battery: 61, signal: -72, lat: 39.9289, lng: 116.4074, flightHours: 156, voltage: 25.8, rtk: "浮点解", task: "待机", unit: "东城分局" },
    { id: "D003", name: "侦查小蜂", model: "Mini 4 Pro", type: "单兵飞机" as const, firmware: "v01.01.0200", latestFirmware: "v01.01.0220", status: "offline" as const, battery: 0, signal: 0, lat: 39.8893, lng: 116.3374, flightHours: 89, voltage: 0, rtk: "未连接", task: "离线", unit: "西城分局" },
    { id: "D004", name: "农业巡检1号", model: "P100", type: "单兵飞机" as const, firmware: "v3.2.1", latestFirmware: "v3.2.3", status: "maintenance" as const, battery: 40, signal: -80, lat: 39.7893, lng: 116.2374, flightHours: 1205, voltage: 24.9, rtk: "不适用", task: "维护暂停", unit: "郊区管理站" },
    { id: "D005", name: "高空瞭望3号", model: "M300 RTK", type: "单兵飞机" as const, firmware: "v06.01.0120", latestFirmware: "v07.01.0050", status: "fault" as const, battery: 8, signal: -90, lat: 39.8593, lng: 116.5074, flightHours: 768, voltage: 21.1, rtk: "失锁", task: "故障停机", unit: "南区分局" },
    { id: "D006", name: "机库A01", model: "DJI Dock 2", type: "机场" as const, firmware: "v10.01.0030", latestFirmware: "v10.01.0030", status: "online" as const, battery: 100, signal: -55, lat: 39.9193, lng: 116.4274, flightHours: 0, voltage: 220, rtk: "不适用", task: "就绪", unit: "市局直属队" },
  ];

  const batteryColor = (v: number) => v > 30 ? "rgba(76,175,80,1)" : v > 15 ? "rgba(255,167,38,1)" : "rgba(239,68,68,1)";

  const remoteReportKey = (sn: string) => `remote_diagnosis_${sn}`;

  useEffect(() => {
    const state = location.state;
    if (state && state.from === "fault-repair" && (state.deviceName || state.sn)) {
      const target =
        devices.find((d) => d.name === state.deviceName) ||
        devices.find((d) => d.id === state.sn);
      if (target) {
        setDetailDevice(target);
        setViewMode("card");
        if (state.sn) {
          setReportSn(state.sn);
          try {
            const stored = typeof window !== "undefined" ? window.localStorage.getItem(remoteReportKey(state.sn)) : null;
            if (stored) {
              const parsed = JSON.parse(stored) as { report?: string };
              setRemoteReport(parsed.report || "");
            } else {
              setRemoteReport("");
            }
          } catch {
            setRemoteReport("");
          }
        }
      }
    }
  }, [location.state]);

  console.log("RemoteMonitor page rendered");

  const renderDebugButtons = (items: { label: string; icon: React.ComponentType<{ size?: number }>; color?: string; onClick?: () => void }[]) => (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {items.map((ctrl) => {
        const Icon = ctrl.icon;
        const color = ctrl.color || "rgba(120,145,180,1)";
        return (
          <button
            key={ctrl.label}
            onClick={() => {
              ctrl.onClick?.();
              if (!ctrl.onClick) console.log("Remote debug:", ctrl.label);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              background: `${color}15`,
              border: `1px solid ${color}40`,
              color,
              borderRadius: 3,
              cursor: "pointer",
              fontSize: 11,
            }}
          >
            <Icon size={11} /> {ctrl.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div style={{ padding: "20px 24px", minHeight: "100%", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <button
            onClick={() => setViewMode("card")}
            style={{
              padding: "6px 8px",
              border: `1px solid ${viewMode === "card" ? "rgba(30,136,229,1)" : "rgba(40,58,90,1)"}`,
              borderRadius: 3,
              background: viewMode === "card" ? "rgba(30,136,229,0.2)" : "transparent",
              color: viewMode === "card" ? "rgba(100,181,246,1)" : "rgba(120,145,180,1)",
              cursor: "pointer",
            }}
            title="卡片"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            style={{
              padding: "6px 8px",
              border: `1px solid ${viewMode === "list" ? "rgba(30,136,229,1)" : "rgba(40,58,90,1)"}`,
              borderRadius: 3,
              background: viewMode === "list" ? "rgba(30,136,229,0.2)" : "transparent",
              color: viewMode === "list" ? "rgba(100,181,246,1)" : "rgba(120,145,180,1)",
              cursor: "pointer",
            }}
            title="列表"
          >
            <List size={16} />
          </button>
          <button className="btn-secondary" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
            <RefreshCw size={12} /> 刷新数据
          </button>
        </div>
      </div>

      {/* Card view */}
      {viewMode === "card" && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {devices.map((d) => (
            <div
              key={d.id}
              className="panel-card"
              style={{ width: "calc(33.33% - 11px)", padding: "16px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(220,228,240,1)" }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: "rgba(100,130,170,1)" }}>{d.model} · {d.unit}</div>
                </div>
                <StatusBadge status={d.status} />
              </div>

              {/* Battery bar */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "rgba(120,145,180,1)", display: "flex", alignItems: "center", gap: 4 }}>
                    <Battery size={11} /> 电量
                  </span>
                  <span style={{ fontSize: 11, color: batteryColor(d.battery), fontWeight: 600 }}>{d.battery}%</span>
                </div>
                <div style={{ background: "rgba(24,34,58,1)", borderRadius: 3, height: 5 }}>
                  <div style={{ width: `${d.battery}%`, height: "100%", background: batteryColor(d.battery), borderRadius: 3, transition: "width 0.3s" }} />
                </div>
              </div>

              {/* Params */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
                {[
                  { label: "信号强度", value: d.status === "online" ? `${d.signal} dBm` : "—", icon: Wifi },
                  { label: "位置", value: d.status === "online" ? `${d.lat}°N ${d.lng}°E` : "—", icon: MapPin },
                  { label: "RTK状态", value: d.rtk, icon: Zap },
                  { label: "当前任务", value: d.task, icon: Monitor },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon size={11} color="rgba(100,181,246,1)" />
                    <span style={{ fontSize: 11, color: "rgba(100,130,170,1)", width: 60 }}>{label}</span>
                    <span style={{ fontSize: 11, color: "rgba(180,200,230,1)" }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Firmware */}
              <div style={{ padding: "8px 10px", background: "rgba(18,26,44,1)", borderRadius: 4, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "rgba(120,145,180,1)" }}>固件 {d.firmware}</span>
                  {d.firmware !== d.latestFirmware ? (
                    <button
                      style={{ fontSize: 10, background: "rgba(255,167,38,0.15)", color: "rgba(255,202,40,1)", border: "1px solid rgba(255,167,38,0.3)", padding: "2px 8px", borderRadius: 3, cursor: "pointer" }}
                      onClick={() => console.log("Upgrade firmware:", d.id)}
                    >
                      升级至 {d.latestFirmware}
                    </button>
                  ) : (
                    <span style={{ fontSize: 10, color: "rgba(76,175,80,1)" }}>已是最新</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className="btn-primary-blue"
                  style={{ flex: 1, fontSize: 11, padding: "5px" }}
                  onClick={() => {
                    if (showControl === d.id) {
                      setShowControl(null);
                      setLivePreview(null);
                    } else {
                      setShowControl(d.id);
                    }
                  }}
                >
                  远程调试
                </button>
                <button
                  className="btn-secondary"
                  style={{ flex: 1, fontSize: 11, padding: "5px" }}
                  onClick={() => setDetailDevice(d)}
                >
                  查看详情
                </button>
              </div>

              {/* Control panel */}
              {showControl === d.id && (
                <div style={{ marginTop: 10, padding: "10px", background: "rgba(12,18,32,1)", borderRadius: 4, border: "1px solid rgba(30,136,229,0.3)" }}>
                  <div style={{ fontSize: 11, color: "rgba(100,181,246,1)", marginBottom: 8 }}>远程调试面板（{d.type}）</div>
                  {d.type === "机场" && (
                    <>
                      <div style={{ fontSize: 11, color: "rgba(120,145,180,1)", margin: "4px 0 6px" }}>机场控制</div>
                      {renderDebugButtons([
                        { label: "机场直播画面", icon: Monitor, color: green, onClick: () => setLivePreview({ deviceName: d.name, target: "airport" }) },
                        { label: `舱盖：${airportDebug.coverOpen ? "开" : "关"}`, icon: Home, color: airportDebug.coverOpen ? green : grey, onClick: () => setAirportDebug((s) => ({ ...s, coverOpen: !s.coverOpen })) },
                        { label: `空调：${airportDebug.acOn ? "开" : "关"}`, icon: Power, color: airportDebug.acOn ? green : grey, onClick: () => setAirportDebug((s) => ({ ...s, acOn: !s.acOn })) },
                        { label: `静音模式：${airportDebug.silentOn ? "开" : "关"}`, icon: Zap, color: airportDebug.silentOn ? green : grey, onClick: () => setAirportDebug((s) => ({ ...s, silentOn: !s.silentOn })) },
                        { label: `声光报警：${airportDebug.alarmOn ? "开" : "关"}`, icon: Zap, color: airportDebug.alarmOn ? green : grey, onClick: () => setAirportDebug((s) => ({ ...s, alarmOn: !s.alarmOn })) },
                        { label: "网络测速", icon: RefreshCw, color: "rgba(30,136,229,1)", onClick: () => console.log("Speed test:", d.id) },
                      ])}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, marginBottom: 6 }}>
                        <button
                          style={{
                            fontSize: 11,
                            padding: "4px 10px",
                            background: "rgba(30,136,229,0.15)",
                            border: "1px solid rgba(30,136,229,0.4)",
                            color: "rgba(100,181,246,1)",
                            borderRadius: 3,
                            cursor: "pointer",
                          }}
                        >
                          机场存储 {airportDebug.airportUsed.toFixed(1)}/{airportDebug.airportTotal.toFixed(1)} GB
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: 11, padding: "3px 8px" }}
                          onClick={() => setAirportDebug((s) => ({ ...s, airportUsed: 0 }))}
                        >
                          格式化
                        </button>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <button
                          style={{
                            fontSize: 11,
                            padding: "4px 10px",
                            background: airportDebug.airport4gOn ? "rgba(76,175,80,0.18)" : "rgba(24,34,58,1)",
                            border: `1px solid ${airportDebug.airport4gOn ? green : grey}`,
                            color: airportDebug.airport4gOn ? green : grey,
                            borderRadius: 3,
                            cursor: "pointer",
                          }}
                          onClick={() => setAirportDebug((s) => ({ ...s, airport4gOn: !s.airport4gOn }))}
                        >
                          机场增强图传：{airportDebug.airport4gOn ? "开" : "关"}
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: 11, padding: "3px 8px" }}
                          onClick={() => {
                            const v = window.prompt("设置机场 4G 服务地址", airportDebug.airport4gUrl);
                            if (v) setAirportDebug((s) => ({ ...s, airport4gUrl: v }));
                          }}
                        >
                          配置4G服务地址
                        </button>
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(120,145,180,1)", marginBottom: 4 }}>
                        当前4G服务地址：<span style={{ color: "rgba(180,200,230,1)" }}>{airportDebug.airport4gUrl}</span>
                      </div>

                      <div style={{ fontSize: 11, color: "rgba(120,145,180,1)", margin: "10px 0 6px" }}>飞行器控制</div>
                      {renderDebugButtons([
                        { label: "飞行器直播画面", icon: Monitor, color: green, onClick: () => setLivePreview({ deviceName: d.name, target: "uav" }) },
                        { label: `飞行器开关：${airportDebug.uavPowerOn ? "开" : "关"}`, icon: Power, color: airportDebug.uavPowerOn ? green : grey, onClick: () => setAirportDebug((s) => ({ ...s, uavPowerOn: !s.uavPowerOn })) },
                        { label: `飞行器充电：${airportDebug.uavChargeOn ? "开" : "关"}`, icon: Battery, color: airportDebug.uavChargeOn ? green : grey, onClick: () => setAirportDebug((s) => ({ ...s, uavChargeOn: !s.uavChargeOn })) },
                        { label: `4G增强图传：${airportDebug.uav4gOn ? "开" : "关"}`, icon: Wifi, color: airportDebug.uav4gOn ? green : grey, onClick: () => setAirportDebug((s) => ({ ...s, uav4gOn: !s.uav4gOn })) },
                      ])}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                        <button
                          style={{
                            fontSize: 11,
                            padding: "4px 10px",
                            background: "rgba(30,136,229,0.15)",
                            border: "1px solid rgba(30,136,229,0.4)",
                            color: "rgba(100,181,246,1)",
                            borderRadius: 3,
                            cursor: "pointer",
                          }}
                        >
                          飞行器存储 {airportDebug.uavUsed.toFixed(1)}/{airportDebug.uavTotal.toFixed(1)} GB
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: 11, padding: "3px 8px" }}
                          onClick={() => setAirportDebug((s) => ({ ...s, uavUsed: 0 }))}
                        >
                          格式化
                        </button>
                      </div>
                    </>
                  )}
                  {d.type === "单兵飞机" && (
                    <>
                      <div style={{ fontSize: 11, color: "rgba(120,145,180,1)", margin: "4px 0 6px" }}>飞行器控制</div>
                      {renderDebugButtons([
                        { label: "飞行器直播画面", icon: Monitor, color: green, onClick: () => setLivePreview({ deviceName: d.name, target: "uav" }) },
                        { label: `飞行器开关：${uavDebug.powerOn ? "开" : "关"}`, icon: Power, color: uavDebug.powerOn ? green : grey, onClick: () => setUavDebug((s) => ({ ...s, powerOn: !s.powerOn })) },
                        { label: `飞行器充电：${uavDebug.chargeOn ? "开" : "关"}`, icon: Battery, color: uavDebug.chargeOn ? green : grey, onClick: () => setUavDebug((s) => ({ ...s, chargeOn: !s.chargeOn })) },
                        { label: `4G增强图传：${uavDebug.g4On ? "开" : "关"}`, icon: Wifi, color: uavDebug.g4On ? green : grey, onClick: () => setUavDebug((s) => ({ ...s, g4On: !s.g4On })) },
                      ])}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: 11, padding: "3px 8px" }}
                          onClick={() => {
                            const v = window.prompt("设置飞行器 4G 服务地址", uavDebug.g4Url);
                            if (v) setUavDebug((s) => ({ ...s, g4Url: v }));
                          }}
                        >
                          配置4G服务地址
                        </button>
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(120,145,180,1)", marginTop: 2 }}>
                        当前4G服务地址：<span style={{ color: "rgba(180,200,230,1)" }}>{uavDebug.g4Url}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                        <button
                          style={{
                            fontSize: 11,
                            padding: "4px 10px",
                            background: "rgba(30,136,229,0.15)",
                            border: "1px solid rgba(30,136,229,0.4)",
                            color: "rgba(100,181,246,1)",
                            borderRadius: 3,
                            cursor: "pointer",
                          }}
                        >
                          飞行器存储 {uavDebug.uavUsed.toFixed(1)}/{uavDebug.uavTotal.toFixed(1)} GB
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: 11, padding: "3px 8px" }}
                          onClick={() => setUavDebug((s) => ({ ...s, uavUsed: 0 }))}
                        >
                          格式化
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {viewMode === "list" && (
        <div className="panel-card" style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr className="table-header">
                {["设备名称", "型号", "所属单位", "状态", "电量", "信号", "固件版本", "飞行时长", "RTK", "操作"].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", borderBottom: "1px solid rgba(30,50,80,1)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {devices.map((d) => (
                <tr key={d.id} className="table-row">
                  <td style={{ padding: "10px 12px", color: "rgba(220,228,240,1)", fontWeight: 500 }}>{d.name}</td>
                  <td style={{ padding: "10px 12px", color: "rgba(160,185,215,1)" }}>{d.model}</td>
                  <td style={{ padding: "10px 12px", color: "rgba(160,185,215,1)" }}>{d.unit}</td>
                  <td style={{ padding: "10px 12px" }}><StatusBadge status={d.status} /></td>
                  <td style={{ padding: "10px 12px", color: batteryColor(d.battery) }}>{d.battery}%</td>
                  <td style={{ padding: "10px 12px", color: "rgba(160,185,215,1)" }}>{d.status === "online" ? `${d.signal} dBm` : "—"}</td>
                  <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 11, color: d.firmware !== d.latestFirmware ? "rgba(255,202,40,1)" : "rgba(120,145,180,1)" }}>
                    {d.firmware}
                    {d.firmware !== d.latestFirmware && " ⚠"}
                  </td>
                  <td style={{ padding: "10px 12px", color: "rgba(160,185,215,1)" }}>{d.flightHours}h</td>
                  <td style={{ padding: "10px 12px", color: d.rtk === "已固定" ? "rgba(76,175,80,1)" : "rgba(120,145,180,1)" }}>{d.rtk}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn-primary-blue" style={{ fontSize: 10, padding: "3px 8px" }}>远程调试</button>
                      <button className="btn-secondary" style={{ fontSize: 10, padding: "3px 8px" }}>详情</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {livePreview && (
        <div
          className="panel-card"
          style={{
            position: "fixed",
            right: 24,
            bottom: 24,
            width: 480,
            maxWidth: "90%",
            padding: 16,
            zIndex: 50,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(220,228,240,1)" }}>
              {livePreview.deviceName} · {livePreview.target === "airport" ? "机场直播画面" : "飞行器直播画面"}
            </div>
            <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => setLivePreview(null)}>
              关闭
            </button>
          </div>
          <div
            style={{
              height: 360,
              background: "rgba(4,12,35,1)",
              borderRadius: 6,
              border: "1px solid rgba(40,58,90,1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(120,145,180,1)",
              fontSize: 12,
            }}
          >
            模拟直播画面占位（接入实际视频流时替换）
          </div>
        </div>
      )}

      {detailDevice && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 60,
          }}
          onClick={(e) => e.target === e.currentTarget && setDetailDevice(null)}
        >
          <div
            className="panel-card"
            style={{ width: 900, maxWidth: "95%", padding: "20px 24px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "rgba(220,228,240,1)" }}>
                  {detailDevice.name} 设备详情
                </div>
                <div style={{ fontSize: 12, color: "rgba(100,130,170,1)", marginTop: 2 }}>
                  型号：{detailDevice.model} · 所属单位：{detailDevice.unit}
                </div>
              </div>
              <button className="btn-secondary" style={{ fontSize: 11, padding: "4px 10px" }} onClick={() => setDetailDevice(null)}>
                关闭
              </button>
            </div>

            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1.2, display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="panel-card" style={{ padding: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(180,200,230,1)", marginBottom: 10 }}>
                    设备信息
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12, color: "rgba(160,185,215,1)" }}>
                    <span>设备名称：<span style={{ color: "rgba(220,228,240,1)" }}>{detailDevice.name}</span></span>
                    <span>设备类型：{detailDevice.type}</span>
                    <span>固件版本：{detailDevice.firmware}</span>
                    <span>最新固件：{detailDevice.latestFirmware}</span>
                    <span>所属单位：{detailDevice.unit}</span>
                    <span>飞行时长：{detailDevice.flightHours} h</span>
                    <span>电量：<span style={{ color: batteryColor(detailDevice.battery) }}>{detailDevice.battery}%</span></span>
                    <span>信号：{detailDevice.status === "online" ? `${detailDevice.signal} dBm` : "—"}</span>
                    <span>RTK 状态：{detailDevice.rtk}</span>
                    <span>最近任务：{detailDevice.task}</span>
                  </div>
                </div>

                <div className="panel-card" style={{ padding: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(180,200,230,1)", marginBottom: 10 }}>
                    异常预警
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      { id: "A001", level: "red", device: "高空瞭望3号", msg: "电池电量低于10%，须立即返航", time: "09:38" },
                      { id: "A002", level: "yellow", device: "农业巡检1号", msg: "累计飞行时长超1200小时，需执行大修保养", time: "08:15" },
                    ]
                      .filter((a) => a.device === detailDevice.name)
                      .map((a) => {
                        const color =
                          a.level === "red"
                            ? "rgba(239,68,68,1)"
                            : a.level === "yellow"
                            ? "rgba(255,202,40,1)"
                            : "rgba(41,182,246,1)";
                        const label =
                          a.level === "red"
                            ? "红色预警"
                            : a.level === "yellow"
                            ? "黄色预警"
                            : "蓝色预警";
                        return (
                          <div
                            key={a.id}
                            style={{
                              display: "flex",
                              gap: 8,
                              padding: "6px 8px",
                              borderRadius: 4,
                              border: `1px solid ${color}40`,
                              background: `${color}10`,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 10,
                                padding: "1px 6px",
                                borderRadius: 3,
                                background: `${color}20`,
                                color,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {label}
                            </span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 12, color: "rgba(220,228,240,1)" }}>{a.msg}</div>
                              <div style={{ fontSize: 11, color: "rgba(120,145,180,1)" }}>时间：{a.time}</div>
                            </div>
                          </div>
                        );
                      })}
                    {!["高空瞭望3号", "农业巡检1号"].includes(detailDevice.name) && (
                      <div style={{ fontSize: 12, color: "rgba(120,145,180,1)" }}>当前设备暂无异常预警记录。</div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="panel-card" style={{ padding: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(180,200,230,1)", marginBottom: 8 }}>
                    远程调试
                  </div>
                  {detailDevice.type === "机场" && (
                    <>
                      <div style={{ fontSize: 11, color: "rgba(120,145,180,1)", margin: "4px 0 6px" }}>机场控制</div>
                      {renderDebugButtons([
                        {
                          label: "机场直播画面",
                          icon: Monitor,
                          color: green,
                          onClick: () => setLivePreview({ deviceName: detailDevice.name, target: "airport" }),
                        },
                        {
                          label: `舱盖：${airportDebug.coverOpen ? "开" : "关"}`,
                          icon: Home,
                          color: airportDebug.coverOpen ? green : grey,
                          onClick: () => setAirportDebug((s) => ({ ...s, coverOpen: !s.coverOpen })),
                        },
                        {
                          label: `空调：${airportDebug.acOn ? "开" : "关"}`,
                          icon: Power,
                          color: airportDebug.acOn ? green : grey,
                          onClick: () => setAirportDebug((s) => ({ ...s, acOn: !s.acOn })),
                        },
                        {
                          label: `静音模式：${airportDebug.silentOn ? "开" : "关"}`,
                          icon: Zap,
                          color: airportDebug.silentOn ? green : grey,
                          onClick: () => setAirportDebug((s) => ({ ...s, silentOn: !s.silentOn })),
                        },
                        {
                          label: `声光报警：${airportDebug.alarmOn ? "开" : "关"}`,
                          icon: Zap,
                          color: airportDebug.alarmOn ? green : grey,
                          onClick: () => setAirportDebug((s) => ({ ...s, alarmOn: !s.alarmOn })),
                        },
                      ])}
                    </>
                  )}
                  {detailDevice.type === "单兵飞机" && (
                    <>
                      <div style={{ fontSize: 11, color: "rgba(120,145,180,1)", margin: "4px 0 6px" }}>飞行器控制</div>
                      {renderDebugButtons([
                        {
                          label: "飞行器直播画面",
                          icon: Monitor,
                          color: green,
                          onClick: () => setLivePreview({ deviceName: detailDevice.name, target: "uav" }),
                        },
                        {
                          label: `飞行器开关：${uavDebug.powerOn ? "开" : "关"}`,
                          icon: Power,
                          color: uavDebug.powerOn ? green : grey,
                          onClick: () => setUavDebug((s) => ({ ...s, powerOn: !s.powerOn })),
                        },
                        {
                          label: `飞行器充电：${uavDebug.chargeOn ? "开" : "关"}`,
                          icon: Battery,
                          color: uavDebug.chargeOn ? green : grey,
                          onClick: () => setUavDebug((s) => ({ ...s, chargeOn: !s.chargeOn })),
                        },
                        {
                          label: `4G增强图传：${uavDebug.g4On ? "开" : "关"}`,
                          icon: Wifi,
                          color: uavDebug.g4On ? green : grey,
                          onClick: () => setUavDebug((s) => ({ ...s, g4On: !s.g4On })),
                        },
                      ])}
                    </>
                  )}
                </div>
                {reportSn && (
                  <div className="panel-card" style={{ padding: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(180,200,230,1)", marginBottom: 6 }}>
                      远程诊断报告（初判）
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(130,155,190,1)", marginBottom: 6 }}>
                      设备名称：{detailDevice.name} · 设备编号：{reportSn}
                    </div>
                    <textarea
                      className="form-input"
                      rows={3}
                      style={{ resize: "vertical" }}
                      placeholder="结合告警信息，填写初步故障原因，例如：疑似电机轴承磨损导致振动异常"
                      value={remoteReport}
                      onChange={(e) => setRemoteReport(e.target.value)}
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
                      <button
                        className="btn-primary-blue"
                        style={{ fontSize: 11, padding: "4px 14px" }}
                        onClick={() => {
                          if (!reportSn || !detailDevice) return;
                          try {
                            const payload = {
                              deviceName: detailDevice.name,
                              sn: reportSn,
                              report: remoteReport,
                              createdAt: new Date().toISOString(),
                            };
                            if (typeof window !== "undefined") {
                              window.localStorage.setItem(remoteReportKey(reportSn), JSON.stringify(payload));
                            }
                            console.log("Remote diagnosis report saved", payload);
                          } catch (e) {
                            console.error("Failed to save remote diagnosis report", e);
                          }
                          if (location.state && location.state.from === "fault-repair") {
                            navigate("/device/fault-repair");
                          }
                        }}
                      >
                        提交远程诊断报告
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemoteMonitor;