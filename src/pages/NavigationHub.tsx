import React from "react";
import {
  Shield,
  Plane,
  Wrench,
  Users,
  CalendarClock,
  AppWindow,
  BrainCircuit,
  Server,
  LogOut,
  Radio,
  Cpu,
} from "lucide-react";
import ModuleCard from "@/components/ModuleCard";
import GridBackground from "@/components/GridBackground";
import ParticleWave from "@/components/ParticleWave";
import { useNavigate } from "react-router-dom";

/**
 * Module configuration for the eight main platform modules
 */
const modules = [
  {
    id: 1,
    title: "综合指挥中心",
    subtitle: "COMMAND CENTER",
    icon: Shield,
    color: "rgb(0, 218, 255)",
    glowColor: "rgba(0, 218, 255, 0.45)",
    path: "/command",
  },
  {
    id: 2,
    title: "飞行控制中心",
    subtitle: "FLIGHT CONTROL",
    icon: Plane,
    color: "rgb(60, 210, 255)",
    glowColor: "rgba(60, 210, 255, 0.45)",
    path: "/fly",
  },
  {
    id: 3,
    title: "设备运维管理",
    subtitle: "DEVICE OPERATIONS",
    icon: Wrench,
    color: "rgb(0, 195, 248)",
    glowColor: "rgba(0, 195, 248, 0.45)",
    path: "/device",
  },
  {
    id: 4,
    title: "人员资质管理",
    subtitle: "PERSONNEL MGMT",
    icon: Users,
    color: "rgb(80, 220, 255)",
    glowColor: "rgba(80, 220, 255, 0.45)",
    path: "/personnel",
  },
  {
    id: 5,
    title: "任务调度中心",
    subtitle: "TASK DISPATCH",
    icon: CalendarClock,
    color: "rgb(0, 210, 255)",
    glowColor: "rgba(0, 210, 255, 0.45)",
    path: "/mission",
  },
  {
    id: 6,
    title: "业务应用中心",
    subtitle: "BUSINESS CENTER",
    icon: AppWindow,
    color: "rgb(100, 215, 255)",
    glowColor: "rgba(100, 215, 255, 0.45)",
    path: "/business",
  },
  {
    id: 7,
    title: "数据智能中心",
    subtitle: "DATA INTELLIGENCE",
    icon: BrainCircuit,
    color: "rgb(20, 200, 255)",
    glowColor: "rgba(20, 200, 255, 0.45)",
    path: "/data",
  },
  {
    id: 8,
    title: "系统支撑平台",
    subtitle: "SYSTEM SUPPORT",
    icon: Server,
    color: "rgb(50, 218, 255)",
    glowColor: "rgba(50, 218, 255, 0.45)",
    path: "/system",
  },
];

/**
 * NavigationHub - Main navigation page for the UAV management platform
 */
const NavigationHub: React.FC = () => {
  console.log("NavigationHub page rendered");
  const navigate = useNavigate();

  const handleModuleClick = (moduleName: string, path: string) => {
    console.log("Navigating to module:", moduleName, "path:", path);
    navigate(path);
  };

  const handleExit = () => {
    console.log("Exit button clicked - returning to login");
    navigate("/");
  };

  return (
    <div
      className="relative overflow-hidden"
      style={{ width: "100%", maxWidth: "1920px", minHeight: "100vh", margin: "0 auto", background: "rgb(1, 5, 18)" }}
    >
      <GridBackground />

      {/* HEADER */}
      <header
        className="relative flex items-center justify-center"
        style={{
          height: "68px",
          zIndex: 20,
          borderBottom: "1px solid rgba(0, 160, 210, 0.2)",
          background: "linear-gradient(180deg, rgba(0, 25, 70, 0.7) 0%, rgba(0, 15, 50, 0.4) 100%)",
        }}
      >
        {/* Left decorative */}
        <div className="absolute left-0 top-0 bottom-0 flex items-center" style={{ paddingLeft: "32px" }}>
          <div className="flex items-center gap-3">
            <div style={{ width: "3px", height: "30px", background: "linear-gradient(180deg, transparent, rgb(0, 212, 255), transparent)", boxShadow: "0 0 8px rgba(0, 212, 255, 0.6)" }} />
            <div className="flex flex-col gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="animate-glow-pulse" style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgb(0, 212, 255)", boxShadow: "0 0 4px rgba(0, 212, 255, 0.8)", animationDelay: `${i * 0.3}s` }} />
              ))}
            </div>
            <div style={{ width: "580px", height: "1px", background: "linear-gradient(90deg, rgba(0, 212, 255, 0.5) 0%, rgba(0, 180, 255, 0.15) 70%, transparent 100%)" }} />
          </div>
        </div>

        {/* Center title */}
        <div className="relative flex items-center gap-4" style={{ zIndex: 2 }}>
          <div className="flex items-center justify-center animate-glow-pulse" style={{ width: "28px", height: "28px", border: "1px solid rgba(0, 212, 255, 0.5)", borderRadius: "4px", background: "rgba(0, 80, 150, 0.3)" }}>
            <Cpu size={16} style={{ color: "rgb(0, 212, 255)" }} />
          </div>
          <h1 className="animate-title-glow font-bold" style={{ fontSize: "20px", color: "rgb(210, 240, 255)", fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif", letterSpacing: "0.35em", textShadow: "0 0 15px rgba(0, 212, 255, 0.7), 0 0 30px rgba(0, 180, 255, 0.4)" }}>
            无人机综合管控平台
          </h1>
          <div className="flex items-center justify-center animate-glow-pulse" style={{ width: "28px", height: "28px", border: "1px solid rgba(0, 212, 255, 0.5)", borderRadius: "4px", background: "rgba(0, 80, 150, 0.3)", animationDelay: "0.6s" }}>
            <Radio size={14} style={{ color: "rgb(0, 212, 255)" }} />
          </div>
        </div>

        {/* Right decorative + exit */}
        <div className="absolute right-0 top-0 bottom-0 flex items-center" style={{ paddingRight: "32px" }}>
          <div className="flex items-center gap-3">
            <div style={{ width: "380px", height: "1px", background: "linear-gradient(90deg, transparent 0%, rgba(0, 180, 255, 0.15) 30%, rgba(0, 212, 255, 0.5) 100%)" }} />
            <div className="flex flex-col gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="animate-glow-pulse" style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgb(0, 212, 255)", boxShadow: "0 0 4px rgba(0, 212, 255, 0.8)", animationDelay: `${(2 - i) * 0.3}s` }} />
              ))}
            </div>
            <div style={{ width: "3px", height: "30px", background: "linear-gradient(180deg, transparent, rgb(0, 212, 255), transparent)", boxShadow: "0 0 8px rgba(0, 212, 255, 0.6)" }} />
            <button
              onClick={handleExit}
              className="flex items-center gap-2 cursor-pointer ml-4"
              style={{ padding: "6px 18px", border: "1px solid rgba(0, 180, 220, 0.45)", borderRadius: "3px", background: "rgba(0, 50, 90, 0.35)", color: "rgb(0, 212, 255)", fontSize: "13px", fontFamily: "'Microsoft YaHei', sans-serif", letterSpacing: "0.12em", transition: "all 0.3s ease", boxShadow: "inset 0 0 8px rgba(0, 100, 180, 0.15)" }}
              onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = "rgba(0, 90, 150, 0.55)"; el.style.borderColor = "rgba(0, 212, 255, 0.8)"; el.style.boxShadow = "0 0 14px rgba(0, 212, 255, 0.35), inset 0 0 10px rgba(0, 150, 255, 0.2)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = "rgba(0, 50, 90, 0.35)"; el.style.borderColor = "rgba(0, 180, 220, 0.45)"; el.style.boxShadow = "inset 0 0 8px rgba(0, 100, 180, 0.15)"; }}
            >
              <LogOut size={13} />
              <span>退出</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative flex flex-col items-center" style={{ paddingTop: "52px", paddingBottom: "190px", zIndex: 10 }}>
        <div className="mb-10 flex items-center gap-3" style={{ color: "rgba(0, 180, 220, 0.55)", fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.5em" }}>
          <div style={{ width: "40px", height: "1px", background: "rgba(0, 180, 220, 0.4)" }} />
          <span>UAV MANAGEMENT &amp; CONTROL SYSTEM</span>
          <div style={{ width: "40px", height: "1px", background: "rgba(0, 180, 220, 0.4)" }} />
        </div>

        {/* Row 1 */}
        <div className="flex" style={{ gap: "24px", marginBottom: "24px" }}>
          {modules.slice(0, 4).map((mod, index) => (
            <div key={mod.id} style={{ width: "308px" }}>
              <ModuleCard title={mod.title} subtitle={mod.subtitle} icon={mod.icon} color={mod.color} glowColor={mod.glowColor} onClick={() => handleModuleClick(mod.title, mod.path)} index={index} />
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex" style={{ gap: "24px" }}>
          {modules.slice(4, 8).map((mod, index) => (
            <div key={mod.id} style={{ width: "308px" }}>
              <ModuleCard title={mod.title} subtitle={mod.subtitle} icon={mod.icon} color={mod.color} glowColor={mod.glowColor} onClick={() => handleModuleClick(mod.title, mod.path)} index={index + 4} />
            </div>
          ))}
        </div>

        {/* Status bar */}
        <div className="mt-14 flex items-center gap-6" style={{ padding: "8px 24px", border: "1px solid rgba(0, 150, 200, 0.2)", borderRadius: "3px", background: "rgba(0, 20, 55, 0.5)", backdropFilter: "blur(4px)" }}>
          {[
            { label: "SYSTEM ONLINE", dot: true, dotColor: "rgb(0, 255, 140)" },
            { label: "MODULES: 8/8", dot: false },
            { label: "STATUS: OPERATIONAL", dot: false },
            { label: "● LIVE", dot: false, pulse: true },
          ].map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div style={{ width: "1px", height: "14px", background: "rgba(0, 150, 200, 0.3)" }} />}
              <div className={item.pulse ? "animate-glow-pulse" : ""} style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(0, 180, 220, 0.6)", fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.08em" }}>
                {item.dot && <span className="animate-glow-pulse" style={{ width: "6px", height: "6px", borderRadius: "50%", background: item.dotColor, display: "inline-block", boxShadow: `0 0 6px ${item.dotColor}` }} />}
                <span>{item.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </main>

      <ParticleWave />

      {/* Side accent lines */}
      <div className="absolute left-0 top-0 bottom-0 pointer-events-none" style={{ width: "2px", background: "linear-gradient(180deg, transparent 0%, rgba(0, 212, 255, 0.35) 25%, rgba(0, 212, 255, 0.55) 50%, rgba(0, 212, 255, 0.35) 75%, transparent 100%)", zIndex: 15 }} />
      <div className="absolute right-0 top-0 bottom-0 pointer-events-none" style={{ width: "2px", background: "linear-gradient(180deg, transparent 0%, rgba(0, 212, 255, 0.35) 25%, rgba(0, 212, 255, 0.55) 50%, rgba(0, 212, 255, 0.35) 75%, transparent 100%)", zIndex: 15 }} />
    </div>
  );
};

export default NavigationHub;