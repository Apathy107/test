import React from "react";

/**
 * DroneOrbit - Left side decorative component with orbital rings and drone icons
 */
const DroneOrbit: React.FC = () => {
  return (
    <div
      data-cmp="DroneOrbit"
      className="relative flex items-center justify-center"
      style={{ width: "100%", height: "100%", minHeight: "500px" }}
    >
      {/* Central city glow effect */}
      <div
        className="absolute"
        style={{
          width: "360px",
          height: "360px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(0, 255, 180, 0.18) 0%, rgba(0, 150, 255, 0.12) 35%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      {/* Outer orbit ring - large */}
      <div
        className="absolute animate-orbit-rotate"
        style={{
          width: "520px",
          height: "180px",
          border: "1.5px solid rgba(0, 200, 255, 0.25)",
          borderRadius: "50%",
          transform: "rotateX(72deg)",
          boxShadow: "0 0 18px rgba(0, 180, 255, 0.1), inset 0 0 18px rgba(0, 180, 255, 0.05)",
        }}
      />

      {/* Middle orbit ring */}
      <div
        className="absolute"
        style={{
          width: "400px",
          height: "130px",
          border: "1px solid rgba(0, 220, 255, 0.2)",
          borderRadius: "50%",
          transform: "rotateX(72deg) rotateZ(15deg)",
          boxShadow: "0 0 12px rgba(0, 200, 255, 0.08)",
        }}
      />

      {/* Inner orbit ring */}
      <div
        className="absolute animate-orbit-rotate-reverse"
        style={{
          width: "280px",
          height: "90px",
          border: "1.5px solid rgba(255, 220, 0, 0.3)",
          borderRadius: "50%",
          transform: "rotateX(72deg)",
          boxShadow: "0 0 10px rgba(255, 200, 0, 0.15)",
        }}
      />

      {/* Platform base glow */}
      <div
        className="absolute"
        style={{
          bottom: "28%",
          width: "380px",
          height: "30px",
          background: "radial-gradient(ellipse, rgba(0, 200, 255, 0.22) 0%, transparent 70%)",
          filter: "blur(10px)",
        }}
      />

      {/* City hologram block group - center */}
      <div className="absolute flex items-end justify-center" style={{ bottom: "30%", gap: "4px" }}>
        {[28, 48, 62, 44, 70, 52, 38, 56, 42, 30, 66, 46].map((h, i) => (
          <div
            key={i}
            className="animate-city-pulse"
            style={{
              width: i % 3 === 0 ? "10px" : "7px",
              height: `${h}px`,
              background: `linear-gradient(180deg, rgba(0, 240, 180, 0.9) 0%, rgba(0, 180, 255, 0.6) 60%, rgba(0, 100, 200, 0.3) 100%)`,
              borderRadius: "1px 1px 0 0",
              boxShadow: `0 0 6px rgba(0, 220, 180, 0.6), 0 0 2px rgba(0, 200, 255, 0.8)`,
              animationDelay: `${i * 0.12}s`,
              opacity: 0.85,
            }}
          />
        ))}
      </div>

      {/* Drone icon - top left */}
      <div
        className="absolute animate-drone-float"
        style={{ top: "12%", left: "10%", animationDelay: "0s" }}
      >
        <DroneIcon size={52} glowColor="rgba(0, 200, 255, 0.9)" />
      </div>

      {/* Drone icon - top right */}
      <div
        className="absolute animate-drone-float"
        style={{ top: "8%", right: "8%", animationDelay: "1.2s" }}
      >
        <DroneIcon size={44} glowColor="rgba(100, 200, 255, 0.8)" />
      </div>

      {/* Drone icon - middle right */}
      <div
        className="absolute animate-drone-float"
        style={{ top: "38%", right: "6%", animationDelay: "0.6s" }}
      >
        <DroneIcon size={36} glowColor="rgba(0, 180, 255, 0.7)" />
      </div>

      {/* Signal beam from center */}
      <div
        className="absolute"
        style={{
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "3px",
          height: "200px",
          background: "linear-gradient(180deg, rgba(0, 200, 255, 0.7) 0%, rgba(0, 220, 180, 0.4) 50%, transparent 100%)",
          filter: "blur(1px)",
          boxShadow: "0 0 12px rgba(0, 200, 255, 0.6)",
        }}
      />
      <div
        className="absolute"
        style={{
          top: "15%",
          left: "calc(50% - 15px)",
          width: "33px",
          height: "200px",
          background: "linear-gradient(180deg, rgba(0, 200, 255, 0.15) 0%, transparent 100%)",
          filter: "blur(6px)",
        }}
      />

      {/* Scan ring animation */}
      <div
        className="absolute animate-scan-ring"
        style={{
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          border: "1px solid rgba(0, 212, 255, 0.12)",
        }}
      />
      <div
        className="absolute animate-scan-ring"
        style={{
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          border: "1px solid rgba(0, 200, 255, 0.1)",
          animationDelay: "1s",
          animationDuration: "4s",
        }}
      />

      {/* Data label floating near drones */}
      <div
        className="absolute animate-glow-pulse"
        style={{ top: "20%", left: "18%", animationDelay: "0.3s" }}
      >
        <div
          style={{
            fontSize: "10px",
            color: "rgba(0, 212, 255, 0.7)",
            fontFamily: "monospace",
            letterSpacing: "0.1em",
            background: "rgba(0, 20, 60, 0.7)",
            border: "1px solid rgba(0, 180, 255, 0.3)",
            borderRadius: "3px",
            padding: "2px 8px",
          }}
        >
          UAV-001 ▲ ACTIVE
        </div>
      </div>
      <div
        className="absolute animate-glow-pulse"
        style={{ top: "16%", right: "16%", animationDelay: "0.8s" }}
      >
        <div
          style={{
            fontSize: "10px",
            color: "rgba(0, 212, 255, 0.7)",
            fontFamily: "monospace",
            letterSpacing: "0.1em",
            background: "rgba(0, 20, 60, 0.7)",
            border: "1px solid rgba(0, 180, 255, 0.3)",
            borderRadius: "3px",
            padding: "2px 8px",
          }}
        >
          UAV-002 ▲ PATROL
        </div>
      </div>
    </div>
  );
};

/**
 * DroneIcon - SVG drone shape
 */
const DroneIcon: React.FC<{ size?: number; glowColor?: string }> = ({
  size = 48,
  glowColor = "rgba(0, 200, 255, 0.8)",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      filter: `drop-shadow(0 0 8px ${glowColor}) drop-shadow(0 0 16px ${glowColor})`,
    }}
  >
    {/* Arms */}
    <line x1="24" y1="24" x2="8" y2="10" stroke="rgba(0, 212, 255, 0.9)" strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="24" x2="40" y2="10" stroke="rgba(0, 212, 255, 0.9)" strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="24" x2="8" y2="38" stroke="rgba(0, 212, 255, 0.9)" strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="24" x2="40" y2="38" stroke="rgba(0, 212, 255, 0.9)" strokeWidth="2" strokeLinecap="round" />
    {/* Propellers */}
    <ellipse cx="8" cy="10" rx="7" ry="3" fill="rgba(0, 212, 255, 0.5)" stroke="rgba(0, 212, 255, 0.9)" strokeWidth="1" />
    <ellipse cx="40" cy="10" rx="7" ry="3" fill="rgba(0, 212, 255, 0.5)" stroke="rgba(0, 212, 255, 0.9)" strokeWidth="1" />
    <ellipse cx="8" cy="38" rx="7" ry="3" fill="rgba(0, 212, 255, 0.5)" stroke="rgba(0, 212, 255, 0.9)" strokeWidth="1" />
    <ellipse cx="40" cy="38" rx="7" ry="3" fill="rgba(0, 212, 255, 0.5)" stroke="rgba(0, 212, 255, 0.9)" strokeWidth="1" />
    {/* Body center */}
    <rect x="19" y="19" width="10" height="10" rx="2" fill="rgba(0, 80, 160, 0.9)" stroke="rgba(0, 212, 255, 1)" strokeWidth="1.5" />
    <circle cx="24" cy="24" r="2.5" fill="rgba(0, 212, 255, 1)" />
  </svg>
);

export default DroneOrbit;