import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Search, RefreshCw } from "lucide-react";
import EventList from "../components/EventList";
import EventDetail from "../components/EventDetail";
import { createWorkOrderFromEvent } from "../data/urbanWorkOrders";

interface Event {
  id: string;
  thumbnail: string;
  algo: string;
  location: string;
  coords: string;
  time: string;
  taskId: string;
  desc: string;
  status: "pending" | "active" | "done" | "error";
  /** 审核状态：已驳回 | 已通过 */
  auditStatus?: "已驳回" | "已通过";
}

const allEvents: Event[] = [
  {
    id: "EV2025001",
    thumbnail: "https://picsum.photos/seed/ev1/400/240",
    algo: "违建识别v3.2",
    location: "解放路28号",
    coords: "31.2304°N, 121.4737°E",
    time: "2025-06-13 10:32:15",
    taskId: "T001",
    desc: "AI检测到疑似违规搭建，面积约15㎡，位于楼顶区域，需要人工审核确认。",
    status: "pending",
  },
  {
    id: "EV2025002",
    thumbnail: "https://picsum.photos/seed/ev2/400/240",
    algo: "垃圾识别v2.4",
    location: "人民广场东侧",
    coords: "31.2296°N, 121.4736°E",
    time: "2025-06-13 10:18:44",
    taskId: "T002",
    desc: "垃圾积存超过12小时，周边环境受到影响，需立即处置。",
    status: "pending",
  },
  {
    id: "EV2025003",
    thumbnail: "https://picsum.photos/seed/ev3/400/240",
    algo: "车流统计v4.0",
    location: "中山北路路口",
    coords: "31.2318°N, 121.4728°E",
    time: "2025-06-13 09:55:22",
    taskId: "T003",
    desc: "检测到车辆违规占道停车，影响正常通行秩序。",
    status: "done",
  },
  {
    id: "EV2025004",
    thumbnail: "https://picsum.photos/seed/ev4/400/240",
    algo: "水质分析v2.1",
    location: "苏州河段A-3",
    coords: "31.2258°N, 121.4810°E",
    time: "2025-06-13 09:30:08",
    taskId: "T004",
    desc: "水质检测异常，COD值超标，疑似上游存在污染源。",
    status: "error",
  },
  {
    id: "EV2025005",
    thumbnail: "https://picsum.photos/seed/ev5/400/240",
    algo: "违建识别v3.2",
    location: "北京东路112号",
    coords: "31.2335°N, 121.4762°E",
    time: "2025-06-13 09:12:33",
    taskId: "T001",
    desc: "屋顶新增临时建筑物，约8㎡，无相关审批手续。",
    status: "active",
  },
];

const EventReview: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>(allEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event>(allEvents[0]);
  const [filterAlgo, setFilterAlgo] = useState("全部");
  const [filterStatus, setFilterStatus] = useState("全部");
  const [search, setSearch] = useState("");

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    if (selectedEvent?.id === id) setSelectedEvent((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const handleApprove = () => {
    if (!selectedEvent) return;
    const order = createWorkOrderFromEvent({
      id: selectedEvent.id,
      location: selectedEvent.location,
      coords: selectedEvent.coords,
      time: selectedEvent.time,
      algo: selectedEvent.algo,
      taskId: selectedEvent.taskId,
      desc: selectedEvent.desc,
      thumbnail: selectedEvent.thumbnail,
    });
    updateEvent(selectedEvent.id, { auditStatus: "已通过" });
    navigate("/business/urban/work-order", { state: { highlightId: order.id } });
  };

  const handleReject = () => {
    if (!selectedEvent) return;
    updateEvent(selectedEvent.id, { auditStatus: "已驳回" });
  };

  console.log("EventReview page rendered, selected:", selectedEvent.id);

  const filteredEvents = events.filter((ev) => {
    const matchAlgo =
      filterAlgo === "全部" || ev.algo.includes(filterAlgo);
    const matchStatus =
      filterStatus === "全部" || ev.status === filterStatus;
    const matchSearch =
      search === "" ||
      ev.location.includes(search) ||
      ev.id.includes(search);
    return matchAlgo && matchStatus && matchSearch;
  });

  return (
    <div
      className="flex flex-col"
      style={{ height: "100%", background: "rgb(8,18,38)" }}
    >
      {/* Page Header */}
      <div
        className="flex items-center justify-between px-6 py-3"
        style={{
          borderBottom: "1px solid rgba(0,212,255,0.2)",
          background: "rgba(10,24,54,0.8)",
          flexShrink: 0,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-1 rounded-full"
            style={{
              height: "24px",
              background: "rgb(0,212,255)",
              boxShadow: "0 0 8px rgba(0,212,255,0.6)",
            }}
          />
          <div>
            <h1
              className="text-base font-bold"
              style={{ color: "rgb(0,212,255)" }}
            >
              事件审核
            </h1>
            <div className="text-xs" style={{ color: "rgb(80,130,160)" }}>
              Event Review &amp; Annotation
            </div>
          </div>
        </div>

        {/* Filter Area */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Search
              size={14}
              className="absolute left-2"
              style={{ color: "rgb(80,130,160)" }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索事件..."
              className="text-xs pl-7 pr-3 py-1.5 rounded outline-none"
              style={{
                background: "rgba(0,212,255,0.06)",
                border: "1px solid rgba(0,212,255,0.2)",
                color: "rgb(200,235,255)",
                width: "160px",
              }}
            />
          </div>
          <select
            value={filterAlgo}
            onChange={(e) => setFilterAlgo(e.target.value)}
            className="text-xs px-2 py-1.5 rounded outline-none"
            style={{
              background: "rgba(0,212,255,0.06)",
              border: "1px solid rgba(0,212,255,0.2)",
              color: "rgb(0,212,255)",
            }}
          >
            {["全部", "违建识别", "垃圾识别", "车流统计", "水质分析"].map(
              (a) => (
                <option key={a}>{a}</option>
              )
            )}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs px-2 py-1.5 rounded outline-none"
            style={{
              background: "rgba(0,212,255,0.06)",
              border: "1px solid rgba(0,212,255,0.2)",
              color: "rgb(0,212,255)",
            }}
          >
            {["全部", "pending", "active", "done", "error"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded"
            style={{
              background: "rgba(0,212,255,0.07)",
              border: "1px solid rgba(0,212,255,0.25)",
              color: "rgb(120,180,210)",
            }}
          >
            <RefreshCw size={12} />
            刷新
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Event List */}
        <div
          className="flex flex-col overflow-hidden"
          style={{
            width: "460px",
            minWidth: "460px",
            borderRight: "1px solid rgba(0,212,255,0.15)",
            background: "rgba(8,18,38,0.8)",
          }}
        >
          <div
            className="flex items-center gap-2 px-4 py-2"
            style={{
              borderBottom: "1px solid rgba(0,212,255,0.15)",
              flexShrink: 0,
            }}
          >
            <Filter size={13} style={{ color: "rgb(0,212,255)" }} />
            <span className="text-xs" style={{ color: "rgb(0,212,255)" }}>
              待审核事件 ({filteredEvents.length})
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <EventList
              events={filteredEvents}
              selectedId={selectedEvent.id}
              onSelect={(ev) => setSelectedEvent(ev as Event)}
            />
          </div>
        </div>

        {/* Right: Event Detail */}
        <div
          className="flex-1 overflow-hidden"
          style={{ background: "rgba(10,24,54,0.5)" }}
        >
          <EventDetail
            eventId={selectedEvent.id}
            location={selectedEvent.location}
            coords={selectedEvent.coords}
            time={selectedEvent.time}
            algo={selectedEvent.algo}
            taskId={selectedEvent.taskId}
            desc={selectedEvent.desc}
            status={selectedEvent.status}
            thumbnail={selectedEvent.thumbnail}
            auditStatus={selectedEvent.auditStatus}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </div>
    </div>
  );
};

export default EventReview;