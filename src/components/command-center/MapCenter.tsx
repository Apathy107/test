import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { Crosshair, Layers, Navigation, ZoomIn, ZoomOut, RotateCcw, Map } from "lucide-react";
import { MapContainer, TileLayer, Marker, Circle, Polyline, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { DeviceMapItem } from "@/data/command-center/deviceMapData";
import { useCommandCenter } from "./CommandCenterContext";
import { DeviceDetailPanel } from "./DeviceDetailPanel";
import { FlyToModal } from "./FlyToModal";

const CesiumMap = lazy(() => import("@/components/command-center/CesiumMap"));

const STATUS_COLOR: Record<string, string> = {
  执行任务: "rgba(0, 210, 255, 1)",
  待命: "rgba(0, 255, 180, 1)",
  返航: "rgba(255, 185, 0, 1)",
  充电: "rgba(150, 100, 255, 1)",
  异常: "rgba(255, 65, 80, 1)",
};

/** 底图切换时强制地图刷新 */
function MapRefreshOnBaseChange({ baseMapId }: { baseMapId: string }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    const m = map as L.Map & { _update?: () => void };
    if (typeof m._update === "function") m._update();
  }, [map, baseMapId]);
  return null;
}

/** 按设备类型生成地图图标：飞机 vs 机库 */
function deviceIcon(d: DeviceMapItem) {
  const color = STATUS_COLOR[d.taskStatus] ?? "rgba(0, 210, 255, 1)";
  if (d.deviceType === "dock") {
    return L.divIcon({
      className: "device-marker-icon",
      html: `<div style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;"><svg viewBox="0 0 24 24" width="24" height="24"><path fill="${color}" stroke="rgba(255,255,255,0.9)" stroke-width="1.2" d="M12 2L4 6v6l8 4 8-4V6L12 2zm0 2.5l5.5 2.75v4.5L12 14.5l-5.5-2.75v-4.5L12 4.5z"/></svg></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  }
  return L.divIcon({
    className: "device-marker-icon",
    html: `<div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;transform:rotate(${d.heading ?? 0}deg);"><svg viewBox="0 0 24 24" width="28" height="28"><path fill="${color}" stroke="rgba(255,255,255,0.9)" stroke-width="1" d="M12 2L2 12h4v8h12v-8h4L12 2z"/></svg></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

/** 飞行轨迹线图层 */
function TrajectoryLayer({ devices }: { devices: DeviceMapItem[] }) {
  return (
    <>
      {devices.map(
        (d) =>
          d.trajectory &&
          d.trajectory.length >= 2 && (
            <Polyline
              key={`traj-${d.id}`}
              positions={d.trajectory}
              pathOptions={{
                color: STATUS_COLOR[d.taskStatus] ?? "rgba(0, 210, 255, 0.9)",
                weight: 2,
                opacity: 0.9,
                dashArray: "4,6",
              }}
            />
          )
      )}
    </>
  );
}

/** 设备点位 + 覆盖圆 */
function DeviceMarkersLayer({
  devices,
  onDeviceClick,
}: {
  devices: DeviceMapItem[];
  onDeviceClick: (d: DeviceMapItem) => void;
}) {
  return (
    <>
      <TrajectoryLayer devices={devices} />
      {devices.map((d) => (
        <React.Fragment key={d.id}>
          <Circle
            center={[d.lat, d.lng]}
            pathOptions={{
              color: STATUS_COLOR[d.taskStatus] ?? "rgba(0, 180, 220, 0.8)",
              fillColor: STATUS_COLOR[d.taskStatus] ?? "rgba(0, 180, 220, 0.3)",
              weight: 1.5,
              opacity: 0.9,
              fillOpacity: 0.15,
            }}
            {...({ radius: d.coverageRadius } as unknown as React.ComponentProps<typeof Circle>)}
          />
          <Marker
            position={[d.lat, d.lng]}
            eventHandlers={{
              click: (e) => {
                L.DomEvent.stopPropagation(e);
                onDeviceClick(d);
              },
            }}
            {...({ icon: deviceIcon(d) } as Record<string, unknown>)}
          />
        </React.Fragment>
      ))}
    </>
  );
}

/** 设备列表点击后地图飞向该设备 */
function FlyToDeviceEffect({ flyToDeviceId, setFlyToDeviceId, devices }: { flyToDeviceId: string | null; setFlyToDeviceId: (id: string | null) => void; devices: DeviceMapItem[] }) {
  const map = useMap();
  useEffect(() => {
    if (!flyToDeviceId) return;
    const device = devices.find((d) => d.id === flyToDeviceId);
    if (device) {
      map.flyTo([device.lat, device.lng], 15, { duration: 0.8 });
      setFlyToDeviceId(null);
    }
  }, [flyToDeviceId, devices, map, setFlyToDeviceId]);
  return null;
}

/** 地图右键菜单：一键直飞 */
function MapContextMenuLayer({
  contextMenuPos,
  setContextMenuPos,
  onFlyToClick,
}: {
  contextMenuPos: { x: number; y: number; lat: number; lng: number } | null;
  setContextMenuPos: (v: typeof contextMenuPos) => void;
  onFlyToClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    contextmenu: (e) => {
      e.originalEvent.preventDefault();
      setContextMenuPos({ x: e.containerPoint.x, y: e.containerPoint.y, lat: e.latlng.lat, lng: e.latlng.lng });
    },
    click: () => setContextMenuPos(null),
  });
  if (!contextMenuPos) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: contextMenuPos.x,
        top: contextMenuPos.y,
        zIndex: 1000,
        background: "rgba(3, 18, 40, 0.98)",
        border: "1px solid rgba(0, 170, 220, 0.4)",
        borderRadius: "6px",
        padding: "4px 0",
        minWidth: "120px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      <button
        type="button"
        onClick={() => {
          onFlyToClick(contextMenuPos.lat, contextMenuPos.lng);
          setContextMenuPos(null);
        }}
        style={{
          width: "100%",
          padding: "8px 14px",
          textAlign: "left",
          fontSize: "12px",
          background: "none",
          border: "none",
          color: "rgba(0, 210, 255, 1)",
          cursor: "pointer",
        }}
      >
        一键直飞
      </button>
    </div>
  );
}

/** 高德地图 Key 与安全密钥（请勿提交到公开仓库，生产环境建议用环境变量） */
const AMAP_KEY = "f4cd70ba980171fa13009134b5ce0ef6";
const AMAP_SECURITY_KEY = "c8dac983f04f4afa1c1e07df99fc7e31";

/** 底图配置：支持天地图、高德、百度等第三方地图 */
const BASE_MAP_OPTIONS: { id: string; name: string; url?: string; attribution?: string; subdomains?: string }[] = [
  {
    id: "osm",
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap",
  },
  {
    id: "tianditu",
    name: "天地图",
    url: "https://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=YOUR_TIANDITU_KEY",
    attribution: "&copy; 天地图",
    subdomains: "01234567",
  },
  {
    id: "gaode",
    name: "高德地图（蓝黑）",
    url: `https://webrd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8&key=${AMAP_KEY}&jscode=${AMAP_SECURITY_KEY}`,
    attribution: "&copy; 高德地图",
    subdomains: "1234",
  },
  {
    id: "baidu",
    name: "百度地图",
    url: "https://api.map.baidu.com/customimage/tile?&x={x}&y={y}&z={z}&customid=light",
    attribution: "&copy; 百度地图",
  },
  { id: "cesium3d", name: "三维底图 (Cesium)" },
];

const taskStats = [
  { label: "执行中", value: 12, color: "rgba(0, 210, 255, 1)" },
  { label: "已完成", value: 47, color: "rgba(0, 255, 180, 1)" },
  { label: "待执行", value: 8, color: "rgba(255, 185, 0, 1)" },
  { label: "异常", value: 3, color: "rgba(255, 65, 80, 1)" },
];

const defaultCenter: L.LatLngExpression = [39.9042, 116.4074];
const defaultZoom = 10;

const getTileLayerUrl = (id: string) => {
  if (id === "tianditu") return `https://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=`;
  if (id === "gaode") return `https://webrd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8&key=${AMAP_KEY}&jscode=${AMAP_SECURITY_KEY}`;
  if (id === "baidu") return "https://api.map.baidu.com/customimage/tile?&x={x}&y={y}&z={z}&customid=light";
  return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
};

interface MapCenterProps {
  /** 小屏视角（右侧面板内） */
  compact?: boolean;
}

const MapCenter: React.FC<MapCenterProps> = ({ compact = false }) => {
  const [baseMapId, setBaseMapId] = useState<string>("gaode");
  const { devices, flyToDeviceId, setFlyToDeviceId, setLayoutMode } = useCommandCenter();
  const [selectedDevice, setSelectedDevice] = useState<DeviceMapItem | null>(null);
  const [panelPosition, setPanelPosition] = useState({ x: 80, y: 80 });
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number; lat: number; lng: number } | null>(null);
  const [showFlyToModal, setShowFlyToModal] = useState(false);
  const [flyToLatLng, setFlyToLatLng] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const DefaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  const handleDeviceClick = useCallback((d: DeviceMapItem) => {
    setSelectedDevice(d);
    setPanelPosition((prev) => (prev.x === 0 && prev.y === 0 ? { x: 80, y: 80 } : prev));
  }, []);

  const openFlyToModal = useCallback((lat: number, lng: number) => {
    setFlyToLatLng({ lat, lng });
    setShowFlyToModal(true);
  }, []);

  const tileUrl = getTileLayerUrl(baseMapId);
  const tileSubdomains = baseMapId === "gaode" ? "1234" : "abc";
  const aircraftOptions = devices.map((d) => ({ id: d.id, name: d.name }));

  if (compact) {
    return (
      <div data-cmp="MapCenter-compact" style={{ height: "100%", position: "relative", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(0, 170, 220, 0.35)" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          {baseMapId !== "cesium3d" ? (
            <>
              <MapContainer
                {...({
                  center: defaultCenter,
                  zoom: defaultZoom,
                  style: { height: "100%", width: "100%", background: "rgba(0, 25, 60, 1)" },
                  zoomControl: false,
                } as unknown as React.ComponentProps<typeof MapContainer>)}
              >
                <TileLayer key={baseMapId} url={tileUrl} {...({ attribution: "", subdomains: tileSubdomains } as Record<string, unknown>)} />
                <DeviceMarkersLayer devices={devices} onDeviceClick={handleDeviceClick} />
              </MapContainer>
            </>
          ) : (
            <Suspense fallback={<div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,25,60,1)", color: "rgba(0,210,255,0.8)", fontSize: 11 }}>三维…</div>}>
              <CesiumMap />
            </Suspense>
          )}
        </div>
        <button
          type="button"
          onClick={() => setLayoutMode("mapMain")}
          style={{
            position: "absolute",
            bottom: "6px",
            left: "6px",
            zIndex: 10,
            padding: "4px 8px",
            fontSize: "10px",
            background: "rgba(3, 12, 30, 0.9)",
            border: "1px solid rgba(0, 170, 220, 0.4)",
            borderRadius: "3px",
            color: "rgba(0, 210, 255, 1)",
            cursor: "pointer",
          }}
        >
          切换到主视角
        </button>
      </div>
    );
  }

  return (
    <div
      data-cmp="MapCenter"
      style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "6px" }}
    >
      <div
        className="fui-panel"
        style={{ borderRadius: "4px", padding: "6px 14px", display: "flex", alignItems: "center", flexShrink: 0 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginRight: "16px" }}>
          <Map size={12} style={{ color: "rgba(0, 210, 255, 1)" }} />
          <span className="fui-title">今日任务统计</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flex: 1 }}>
          {taskStats.map((stat, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: stat.color, boxShadow: `0 0 6px ${stat.color}` }} />
              <span style={{ fontSize: "11px", color: "rgba(100, 170, 210, 1)" }}>{stat.label}</span>
              <span style={{ fontSize: "16px", fontFamily: "monospace", fontWeight: 700, color: stat.color, textShadow: `0 0 8px ${stat.color}` }}>{stat.value}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* 底图切换 */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Layers size={14} style={{ color: "rgba(0, 210, 255, 0.9)" }} />
            <select
              value={baseMapId}
              onChange={(e) => setBaseMapId(e.target.value)}
              title="切换底图"
              style={{
                background: "rgba(3, 12, 30, 0.9)",
                border: "1px solid rgba(0, 170, 220, 0.35)",
                borderRadius: "4px",
                color: "rgba(0, 210, 255, 0.95)",
                fontSize: "12px",
                padding: "4px 10px",
                cursor: "pointer",
                minWidth: "120px",
              }}
            >
              {BASE_MAP_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
          {[
            { label: "总飞行时长", value: "126.5h" },
            { label: "覆盖面积", value: "2,840km²" },
            { label: "无人机在线", value: "28台" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span style={{ fontSize: "10px", color: "rgba(60, 130, 170, 1)" }}>{item.label}</span>
              <span style={{ fontSize: "13px", fontFamily: "monospace", fontWeight: 700, color: "rgba(0, 255, 180, 1)", textShadow: "0 0 6px rgba(0,255,180,0.5)" }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="fui-panel-bright" style={{ borderRadius: "4px", flex: 1, minHeight: 200, position: "relative", overflow: "hidden" }}>
        <style>{`.map-gaode-blueblack .leaflet-tile-pane img { filter: brightness(0.5) contrast(1.2) hue-rotate(198deg) saturate(0.4); }`}</style>
        <div
          className={baseMapId === "gaode" ? "map-gaode-blueblack" : undefined}
          style={{ position: "absolute", inset: 0, zIndex: 1, height: "100%", width: "100%" }}
        >
          {baseMapId === "cesium3d" ? (
            <Suspense fallback={<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,25,60,1)", color: "rgba(0,210,255,0.8)" }}>加载三维底图…</div>}>
              <CesiumMap />
            </Suspense>
          ) : (
          <>
          <MapContainer
            {...({
              center: defaultCenter,
              zoom: defaultZoom,
              style: { height: "100%", width: "100%", background: "rgba(0, 25, 60, 1)" },
              zoomControl: false,
            } as unknown as React.ComponentProps<typeof MapContainer>)}
          >
            <MapRefreshOnBaseChange baseMapId={baseMapId} />
            <TileLayer
              key={baseMapId}
              url={tileUrl}
              {...({
                attribution: baseMapId === "osm" ? "&copy; OSM" : baseMapId === "gaode" ? "&copy; 高德" : baseMapId === "tianditu" ? "&copy; 天地图" : "&copy; 百度",
                subdomains: tileSubdomains,
              } as Record<string, unknown>)}
            />
            <FlyToDeviceEffect flyToDeviceId={flyToDeviceId} setFlyToDeviceId={setFlyToDeviceId} devices={devices} />
            <DeviceMarkersLayer devices={devices} onDeviceClick={handleDeviceClick} />
            <MapContextMenuLayer
              contextMenuPos={contextMenuPos}
              setContextMenuPos={(v) => {
                setContextMenuPos(v);
                if (!v) setFlyToLatLng(null);
              }}
              onFlyToClick={openFlyToModal}
            />
          </MapContainer>
          {selectedDevice && (
            <DeviceDetailPanel
              device={selectedDevice}
              position={panelPosition}
              onClose={() => setSelectedDevice(null)}
              onPositionChange={setPanelPosition}
            />
          )}
          {showFlyToModal && flyToLatLng && (
            <FlyToModal
              lat={flyToLatLng.lat}
              lng={flyToLatLng.lng}
              onClose={() => {
                setShowFlyToModal(false);
                setFlyToLatLng(null);
              }}
              onExecute={(aircraftId, heightM) => {
                console.log("一键直飞", { aircraftId, heightM, target: flyToLatLng });
                setShowFlyToModal(false);
                setFlyToLatLng(null);
              }}
              aircraftOptions={aircraftOptions}
            />
          )}
          </>
          )}
        </div>

        <div style={{ position: "absolute", right: "10px", top: "10px", display: "flex", flexDirection: "column", gap: "3px", zIndex: 10 }}>
          {[{ icon: ZoomIn, title: "放大" }, { icon: ZoomOut, title: "缩小" }, { icon: Layers, title: "图层" }, { icon: RotateCcw, title: "重置" }, { icon: Crosshair, title: "定位" }].map(({ icon: Icon, title }) => (
            <button key={title} title={title} type="button" style={{ width: "26px", height: "26px", background: "rgba(3, 12, 30, 0.88)", border: "1px solid rgba(0,170,220,0.35)", borderRadius: "3px", color: "rgba(0,180,220,0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon size={12} />
            </button>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: "10px", right: "10px", width: "44px", height: "44px", borderRadius: "50%", border: "1px solid rgba(0,170,220,0.35)", background: "rgba(3,10,26,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
          <Navigation size={18} style={{ color: "rgba(0, 210, 255, 1)" }} />
          <span style={{ position: "absolute", top: "3px", fontSize: "8px", color: "rgba(0,210,255,0.9)", fontWeight: 700, fontFamily: "monospace" }}>N</span>
        </div>
        <div style={{ position: "absolute", bottom: "10px", left: "10px", fontFamily: "monospace", fontSize: "10px", color: "rgba(0, 160, 200, 0.8)", background: "rgba(3,8,22,0.85)", padding: "4px 8px", borderRadius: "3px", border: "1px solid rgba(0,160,200,0.18)", lineHeight: 1.5, zIndex: 10 }}>
          <div>N 39°54&apos;26&quot;</div>
          <div>E 116°23&apos;44&quot;</div>
          <div style={{ color: "rgba(0,110,160,0.8)", marginTop: "2px", fontSize: "9px" }}>三维地图引擎 · 支持天地图/高德/百度底图</div>
        </div>
        <div style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(3,10,26,0.88)", border: "1px solid rgba(0,160,200,0.22)", borderRadius: "4px", padding: "6px 10px", zIndex: 10 }}>
          <div style={{ fontSize: "9px", color: "rgba(0,160,200,0.7)", marginBottom: "5px", letterSpacing: "0.1em" }}>图例</div>
          {[{ color: "rgba(0,210,255,1)", label: "执行任务" }, { color: "rgba(0,255,180,1)", label: "待命" }, { color: "rgba(255,65,80,1)", label: "异常预警" }, { color: "rgba(180,100,255,1)", label: "系留设备" }].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.color, boxShadow: `0 0 5px ${item.color}` }} />
              <span style={{ fontSize: "10px", color: "rgba(110,180,210,1)" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapCenter;
