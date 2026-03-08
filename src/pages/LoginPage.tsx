import React from "react";
import { Cpu, Radio } from "lucide-react";
import GridBackground from "@/components/GridBackground";
import ParticleWave from "@/components/ParticleWave";
import DroneOrbit from "@/components/DroneOrbit";
import LoginForm from "@/components/LoginForm";

/**
 * LoginPage - Main login page for the UAV management platform
 */
const LoginPage: React.FC = () => {
  console.log("LoginPage rendered");

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: "100%",
        maxWidth: "1920px",
        height: "100vh",
        margin: "0 auto",
        background: "rgb(1, 5, 18)",
      }}
    >
      {/* Background */}
      <GridBackground />

      {/* Extra deep blue center glow for left area */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "10%",
          left: "5%",
          width: "720px",
          height: "80%",
          background:
            "radial-gradient(ellipse at 40% 55%, rgba(0, 60, 160, 0.18) 0%, rgba(0, 30, 100, 0.1) 40%, transparent 70%)",
        }}
      />

      {/* ===== TOP HEADER ===== */}
      <header
        className="absolute top-0 left-0 right-0 flex items-center"
        style={{
          height: "68px",
          padding: "0 40px",
          zIndex: 20,
          borderBottom: "1px solid rgba(0, 160, 210, 0.15)",
          background:
            "linear-gradient(180deg, rgba(0, 20, 60, 0.6) 0%, rgba(0, 10, 40, 0.3) 100%)",
        }}
      >
        {/* Left: Logo + Name */}
        <div className="flex items-center gap-4">
          {/* Logo icon */}
          <div
            className="flex items-center justify-center animate-glow-pulse"
            style={{
              width: "38px",
              height: "38px",
              border: "1px solid rgba(0, 212, 255, 0.45)",
              borderRadius: "6px",
              background: "rgba(0, 60, 130, 0.4)",
              boxShadow: "0 0 12px rgba(0, 180, 255, 0.2)",
            }}
          >
            {/* Drone propeller logo */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="2.5" fill="rgb(0, 212, 255)" />
              <ellipse cx="5" cy="5" rx="4.5" ry="1.8" fill="rgba(0, 212, 255, 0.6)" transform="rotate(-30 5 5)" />
              <ellipse cx="17" cy="5" rx="4.5" ry="1.8" fill="rgba(0, 212, 255, 0.6)" transform="rotate(30 17 5)" />
              <ellipse cx="5" cy="17" rx="4.5" ry="1.8" fill="rgba(0, 212, 255, 0.6)" transform="rotate(30 5 17)" />
              <ellipse cx="17" cy="17" rx="4.5" ry="1.8" fill="rgba(0, 212, 255, 0.6)" transform="rotate(-30 17 17)" />
              <line x1="11" y1="11" x2="5" y2="5" stroke="rgba(0, 212, 255, 0.8)" strokeWidth="1" />
              <line x1="11" y1="11" x2="17" y2="5" stroke="rgba(0, 212, 255, 0.8)" strokeWidth="1" />
              <line x1="11" y1="11" x2="5" y2="17" stroke="rgba(0, 212, 255, 0.8)" strokeWidth="1" />
              <line x1="11" y1="11" x2="17" y2="17" stroke="rgba(0, 212, 255, 0.8)" strokeWidth="1" />
            </svg>
          </div>

          {/* Vertical separator */}
          <div
            style={{
              width: "1px",
              height: "28px",
              background: "linear-gradient(180deg, transparent, rgba(0, 212, 255, 0.4), transparent)",
            }}
          />

          {/* Platform name */}
          <div>
            <h1
              style={{
                fontSize: "17px",
                fontWeight: "700",
                color: "rgb(200, 235, 255)",
                fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif",
                letterSpacing: "0.18em",
                textShadow: "0 0 12px rgba(0, 212, 255, 0.5)",
                margin: 0,
              }}
            >
              无人机综合管控平台
            </h1>
            <div
              style={{
                fontSize: "10px",
                color: "rgba(0, 180, 220, 0.45)",
                fontFamily: "monospace",
                letterSpacing: "0.2em",
                marginTop: "2px",
              }}
            >
              UAV DIGITAL OPERATION PLATFORM
            </div>
          </div>
        </div>

        {/* Right: Status indicators */}
        <div className="flex items-center gap-6 ml-auto">
          <div className="flex items-center gap-2">
            <div
              className="animate-glow-pulse"
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "rgb(0, 255, 140)",
                boxShadow: "0 0 6px rgb(0, 255, 140)",
              }}
            />
            <span style={{ fontSize: "11px", color: "rgba(0, 180, 220, 0.55)", fontFamily: "monospace", letterSpacing: "0.1em" }}>
              SYSTEM ONLINE
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu size={13} style={{ color: "rgba(0, 180, 220, 0.5)" }} />
            <span style={{ fontSize: "11px", color: "rgba(0, 180, 220, 0.45)", fontFamily: "monospace" }}>
              v2.4.1
            </span>
          </div>
          <div
            className="flex items-center justify-center animate-glow-pulse"
            style={{
              width: "28px",
              height: "28px",
              border: "1px solid rgba(0, 212, 255, 0.35)",
              borderRadius: "4px",
              background: "rgba(0, 60, 120, 0.3)",
              animationDelay: "0.5s",
            }}
          >
            <Radio size={13} style={{ color: "rgba(0, 212, 255, 0.7)" }} />
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <div
        className="absolute flex items-center"
        style={{
          top: "68px",
          left: 0,
          right: 0,
          bottom: 0,
          paddingBottom: "160px",
          zIndex: 10,
        }}
      >
        {/* Left: Drone orbit visualization */}
        <div
          className="flex items-center justify-center"
          style={{ flex: 1, height: "100%" }}
        >
          <DroneOrbit />
        </div>

        {/* Right: Login form */}
        <div
          className="flex items-center justify-center"
          style={{ width: "500px", height: "100%", paddingRight: "80px" }}
        >
          <LoginForm />
        </div>
      </div>

      {/* ===== BOTTOM PARTICLE WAVE ===== */}
      <ParticleWave />

      {/* Left & Right border accent lines */}
      <div
        className="absolute left-0 top-0 bottom-0 pointer-events-none"
        style={{
          width: "2px",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0, 212, 255, 0.3) 25%, rgba(0, 212, 255, 0.5) 50%, rgba(0, 212, 255, 0.3) 75%, transparent 100%)",
          zIndex: 15,
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 pointer-events-none"
        style={{
          width: "2px",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0, 212, 255, 0.3) 25%, rgba(0, 212, 255, 0.5) 50%, rgba(0, 212, 255, 0.3) 75%, transparent 100%)",
          zIndex: 15,
        }}
      />

      {/* Bottom center info bar */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6"
        style={{
          zIndex: 16,
          fontSize: "10px",
          color: "rgba(0, 150, 190, 0.4)",
          fontFamily: "monospace",
          letterSpacing: "0.15em",
        }}
      >
        <span>© 2025 锋则航空</span>
        <div style={{ width: "1px", height: "10px", background: "rgba(0, 150, 190, 0.3)" }} />
        <span>ALL RIGHTS RESERVED</span>
        <div style={{ width: "1px", height: "10px", background: "rgba(0, 150, 190, 0.3)" }} />
        <span>SECURE · RELIABLE · INTELLIGENT</span>
      </div>
    </div>
  );
};

export default LoginPage;