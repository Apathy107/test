import React from "react";

/**
 * ParticleWave - Bottom decorative wave animation with dot particles
 */
const ParticleWave: React.FC = () => {
  return (
    <div data-cmp="ParticleWave" className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none" style={{ height: "180px" }}>
      {/* Wave gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(0, 30, 80, 0.8) 0%, transparent 100%)",
          zIndex: 2,
        }}
      />

      {/* Dot particle grid - layer 1 */}
      <div
        className="absolute animate-wave"
        style={{
          bottom: 0,
          left: 0,
          width: "200%",
          height: "100%",
          backgroundImage: "radial-gradient(circle, rgba(0, 212, 255, 0.6) 1px, transparent 1px)",
          backgroundSize: "24px 16px",
          backgroundPosition: "0 100%",
          maskImage: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 40%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 40%, transparent 80%)",
          transform: "perspective(200px) rotateX(30deg)",
          transformOrigin: "bottom center",
          zIndex: 1,
        }}
      />

      {/* Dot particle grid - layer 2 (offset) */}
      <div
        className="absolute animate-wave"
        style={{
          bottom: 0,
          left: "-12px",
          width: "200%",
          height: "80%",
          backgroundImage: "radial-gradient(circle, rgba(0, 150, 255, 0.3) 1px, transparent 1px)",
          backgroundSize: "24px 16px",
          backgroundPosition: "0 100%",
          maskImage: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
          transform: "perspective(200px) rotateX(35deg)",
          transformOrigin: "bottom center",
          animationDuration: "25s",
          animationDirection: "reverse",
          zIndex: 1,
        }}
      />

      {/* Bottom glow line */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "2px",
          background: "linear-gradient(90deg, transparent 0%, rgba(0, 212, 255, 0.5) 30%, rgba(80, 200, 255, 0.8) 50%, rgba(0, 212, 255, 0.5) 70%, transparent 100%)",
          zIndex: 3,
        }}
      />
    </div>
  );
};

export default ParticleWave;