import React from "react";

/**
 * GridBackground - Deep blue tech grid background with multi-layer glow effects
 */
const GridBackground: React.FC = () => {
  return (
    <div data-cmp="GridBackground" className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base deep blue radial gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 20%, rgb(6, 28, 80) 0%, rgb(3, 14, 48) 35%, rgb(2, 8, 26) 70%, rgb(1, 5, 18) 100%)",
        }}
      />

      {/* Primary grid lines - large */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 200, 255, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 200, 255, 0.07) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Secondary grid lines - small */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 150, 220, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 150, 220, 0.03) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Center radial glow - main */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 35%, rgba(0, 100, 200, 0.18) 0%, rgba(0, 60, 150, 0.08) 40%, transparent 65%)",
        }}
      />

      {/* Top center light beam */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: "800px",
          height: "400px",
          background: "radial-gradient(ellipse at 50% 0%, rgba(0, 180, 255, 0.1) 0%, rgba(0, 120, 220, 0.05) 40%, transparent 70%)",
        }}
      />

      {/* Horizontal scan line - slow moving */}
      <div
        className="absolute left-0 right-0 animate-glow-pulse"
        style={{
          top: "28%",
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(0, 200, 255, 0.15) 15%, rgba(0, 212, 255, 0.5) 50%, rgba(0, 200, 255, 0.15) 85%, transparent 100%)",
        }}
      />

      {/* Second horizontal line */}
      <div
        className="absolute left-0 right-0 animate-glow-pulse"
        style={{
          top: "65%",
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(0, 180, 255, 0.1) 20%, rgba(0, 200, 255, 0.35) 50%, rgba(0, 180, 255, 0.1) 80%, transparent 100%)",
          animationDelay: "1.2s",
        }}
      />

      {/* Bottom fade overlay - to blend with particle wave */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "220px",
          background: "linear-gradient(to top, rgb(1, 5, 18) 0%, rgba(1, 5, 18, 0.6) 50%, transparent 100%)",
        }}
      />

      {/* Corner ambient glows */}
      <div
        className="absolute top-0 left-0"
        style={{
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle at 0% 0%, rgba(0, 100, 200, 0.08) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute top-0 right-0"
        style={{
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle at 100% 0%, rgba(0, 100, 200, 0.08) 0%, transparent 60%)",
        }}
      />
    </div>
  );
};

export default GridBackground;