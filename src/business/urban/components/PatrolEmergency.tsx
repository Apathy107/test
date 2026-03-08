import React, { useState } from "react";
import { Radio, Users, Send, AlertCircle, PhoneCall } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface Resource {
  id: string;
  name: string;
  type: string;
  distance: string;
  status: "active" | "pending" | "paused";
}

const defaultResources: Resource[] = [
  { id: "rc1", name: "无人机-001", type: "无人机", distance: "1.2km", status: "active" },
  { id: "rc2", name: "无人机-005", type: "无人机", distance: "2.8km", status: "active" },
  { id: "rc3", name: "飞手-张伟", type: "飞手", distance: "800m", status: "active" },
  { id: "rc4", name: "飞手-李明", type: "飞手", distance: "3.1km", status: "pending" },
  { id: "rc5", name: "机器狗-003", type: "机器狗", distance: "1.6km", status: "paused" },
];

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  type: "text" | "alert";
}

const initMessages: Message[] = [
  { id: "m1", sender: "系统", content: "应急响应已启动，请各部门就位", time: "10:32", type: "alert" },
  { id: "m2", sender: "指挥中心", content: "无人机-001已派出，预计3分钟到达", time: "10:33", type: "text" },
  { id: "m3", sender: "张伟", content: "正在前往现场，已收到坐标", time: "10:34", type: "text" },
];

interface PatrolEmergencyProps {
  resources?: Resource[];
}

const PatrolEmergency: React.FC<PatrolEmergencyProps> = ({ resources = defaultResources }) => {
  const [messages, setMessages] = useState<Message[]>(initMessages);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      { id: `m${Date.now()}`, sender: "我", content: input, time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }), type: "text" },
    ]);
    setInput("");
  };

  console.log("PatrolEmergency rendered");

  return (
    <div data-cmp="PatrolEmergency" className="flex flex-col h-full">
      {/* Emergency Header */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          borderBottom: "1px solid rgba(255,60,80,0.3)",
          background: "rgba(255,60,80,0.06)",
        }}
      >
        <AlertCircle size={16} style={{ color: "rgb(255,80,100)" }} />
        <span className="text-sm font-medium" style={{ color: "rgb(255,80,100)" }}>
          应急协同指挥
        </span>
        <div
          className="ml-auto rounded-full"
          style={{ width: "8px", height: "8px", background: "rgb(255,80,100)", boxShadow: "0 0 6px rgba(255,80,100,0.8)" }}
        />
      </div>

      {/* Resources */}
      <div
        className="px-4 py-3"
        style={{ borderBottom: "1px solid rgba(0,212,255,0.15)" }}
      >
        <div className="text-xs mb-2 flex items-center gap-1.5" style={{ color: "rgb(120,180,210)" }}>
          <Users size={12} />
          周边可用资源
        </div>
        <div className="space-y-1.5">
          {resources.map((r) => (
            <div key={r.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="rounded text-xs px-1.5 py-0.5"
                  style={{
                    background: "rgba(0,212,255,0.1)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    color: "rgb(0,212,255)",
                    fontSize: "10px",
                  }}
                >
                  {r.type}
                </div>
                <span className="text-xs" style={{ color: "rgb(200,235,255)" }}>
                  {r.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: "rgb(80,130,160)", fontSize: "10px" }}>
                  {r.distance}
                </span>
                <StatusBadge status={r.status} size="sm" />
                <button
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    background: "rgba(0,212,255,0.1)",
                    border: "1px solid rgba(0,212,255,0.25)",
                    color: "rgb(0,212,255)",
                    fontSize: "10px",
                  }}
                >
                  调度
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Communication */}
      <div className="flex-1 flex flex-col min-h-0 px-4 py-3">
        <div className="text-xs mb-2 flex items-center gap-1.5" style={{ color: "rgb(120,180,210)" }}>
          <Radio size={12} />
          协同通信
        </div>
        <div className="flex-1 overflow-auto space-y-2 min-h-0">
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-2">
              <div className="flex-shrink-0">
                {msg.type === "alert" ? (
                  <AlertCircle size={14} style={{ color: "rgb(255,80,100)", marginTop: "2px" }} />
                ) : (
                  <div
                    className="rounded-full flex items-center justify-center text-xs"
                    style={{
                      width: "18px",
                      height: "18px",
                      background: "rgba(0,212,255,0.15)",
                      color: "rgb(0,212,255)",
                      fontSize: "9px",
                      marginTop: "1px",
                    }}
                  >
                    {msg.sender[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="text-xs font-medium"
                    style={{ color: msg.type === "alert" ? "rgb(255,80,100)" : "rgb(0,212,255)", fontSize: "10px" }}
                  >
                    {msg.sender}
                  </span>
                  <span className="text-xs" style={{ color: "rgba(120,180,210,0.4)", fontSize: "10px" }}>
                    {msg.time}
                  </span>
                </div>
                <div
                  className="text-xs rounded px-2 py-1"
                  style={{
                    color: msg.type === "alert" ? "rgb(255,130,140)" : "rgb(200,235,255)",
                    background: msg.type === "alert" ? "rgba(255,60,80,0.08)" : "rgba(10,24,54,0.8)",
                    border: `1px solid ${msg.type === "alert" ? "rgba(255,60,80,0.2)" : "rgba(0,212,255,0.1)"}`,
                  }}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="发送消息..."
            className="flex-1 text-xs px-3 py-2 rounded outline-none"
            style={{
              background: "rgba(0,212,255,0.06)",
              border: "1px solid rgba(0,212,255,0.2)",
              color: "rgb(200,235,255)",
            }}
          />
          <button
            onClick={sendMessage}
            className="px-3 py-2 rounded flex items-center gap-1"
            style={{
              background: "rgba(0,212,255,0.15)",
              border: "1px solid rgba(0,212,255,0.4)",
              color: "rgb(0,212,255)",
            }}
          >
            <Send size={13} />
          </button>
          <button
            className="px-3 py-2 rounded"
            style={{
              background: "rgba(80,230,180,0.1)",
              border: "1px solid rgba(80,230,180,0.3)",
              color: "rgb(80,230,180)",
            }}
          >
            <PhoneCall size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatrolEmergency;