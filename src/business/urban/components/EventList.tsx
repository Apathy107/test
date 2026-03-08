import React from "react";
import StatusBadge from "./StatusBadge";

interface EventItem {
  id: string;
  thumbnail: string;
  algo: string;
  location: string;
  coords: string;
  time: string;
  taskId: string;
  desc: string;
  status: "pending" | "active" | "done" | "error";
}

const defaultEvents: EventItem[] = [
  {
    id: "EV2025001",
    thumbnail: "https://picsum.photos/seed/ev1/80/60",
    algo: "违建识别v3.2",
    location: "解放路28号",
    coords: "31.2304°N, 121.4737°E",
    time: "10:32:15",
    taskId: "T001",
    desc: "发现疑似违规搭建，面积约15㎡",
    status: "pending",
  },
  {
    id: "EV2025002",
    thumbnail: "https://picsum.photos/seed/ev2/80/60",
    algo: "垃圾识别v2.4",
    location: "人民广场东侧",
    coords: "31.2296°N, 121.4736°E",
    time: "10:18:44",
    taskId: "T002",
    desc: "垃圾积存超过12小时，需立即清运",
    status: "pending",
  },
  {
    id: "EV2025003",
    thumbnail: "https://picsum.photos/seed/ev3/80/60",
    algo: "车流统计v4.0",
    location: "中山北路路口",
    coords: "31.2318°N, 121.4728°E",
    time: "09:55:22",
    taskId: "T003",
    desc: "检测到车辆违规占道停车",
    status: "done",
  },
  {
    id: "EV2025004",
    thumbnail: "https://picsum.photos/seed/ev4/80/60",
    algo: "水质分析v2.1",
    location: "苏州河段A-3",
    coords: "31.2258°N, 121.4810°E",
    time: "09:30:08",
    taskId: "T004",
    desc: "水质异常，疑似污染源",
    status: "error",
  },
  {
    id: "EV2025005",
    thumbnail: "https://picsum.photos/seed/ev5/80/60",
    algo: "违建识别v3.2",
    location: "北京东路112号",
    coords: "31.2335°N, 121.4762°E",
    time: "09:12:33",
    taskId: "T001",
    desc: "屋顶新增临时建筑，约8㎡",
    status: "active",
  },
];

interface EventListProps {
  events?: EventItem[];
  selectedId?: string;
  onSelect?: (event: EventItem) => void;
}

const EventList: React.FC<EventListProps> = ({
  events = defaultEvents,
  selectedId = "EV2025001",
  onSelect,
}) => {
  console.log("EventList rendered with", events.length, "events");

  return (
    <div data-cmp="EventList" className="flex flex-col h-full">
      {/* Stats bar */}
      <div
        className="flex items-center gap-4 px-4 py-2"
        style={{ borderBottom: "1px solid rgba(0,212,255,0.15)", background: "rgba(6,14,32,0.5)" }}
      >
        {[
          { label: "待审核", value: events.filter((e) => e.status === "pending").length, color: "rgb(255,180,0)" },
          { label: "审核中", value: events.filter((e) => e.status === "active").length, color: "rgb(0,212,255)" },
          { label: "已通过", value: events.filter((e) => e.status === "done").length, color: "rgb(80,230,180)" },
          { label: "异常", value: events.filter((e) => e.status === "error").length, color: "rgb(255,80,100)" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-1 text-xs">
            <span className="font-bold text-sm" style={{ color }}>{value}</span>
            <span style={{ color: "rgb(80,130,160)" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Event Cards */}
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {events.map((ev) => (
          <div
            key={ev.id}
            onClick={() => onSelect?.(ev)}
            className="flex gap-3 p-3 rounded-lg cursor-pointer transition-all"
            style={{
              background: selectedId === ev.id ? "rgba(0,212,255,0.1)" : "rgba(10,24,54,0.6)",
              border: selectedId === ev.id ? "1px solid rgba(0,212,255,0.35)" : "1px solid rgba(0,212,255,0.1)",
            }}
          >
            {/* Thumbnail */}
            <div
              className="flex-shrink-0 rounded overflow-hidden"
              style={{ width: "72px", height: "52px", background: "rgba(0,0,0,0.3)" }}
            >
              <img
                src={ev.thumbnail}
                alt="event thumbnail"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: "rgb(0,212,255)", fontSize: "10px" }}>
                  {ev.id}
                </span>
                <StatusBadge status={ev.status} size="sm" />
              </div>
              <div className="text-xs mb-1" style={{ color: "rgb(200,235,255)" }}>
                {ev.desc}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                <span className="text-xs" style={{ color: "rgb(80,130,160)", fontSize: "10px" }}>
                  📍 {ev.location}
                </span>
                <span className="text-xs" style={{ color: "rgb(80,130,160)", fontSize: "10px" }}>
                  🤖 {ev.algo}
                </span>
                <span className="text-xs" style={{ color: "rgb(80,130,160)", fontSize: "10px" }}>
                  ⏱ {ev.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;