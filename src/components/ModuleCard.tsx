import React, { useState } from "react";
import { LucideIcon } from "lucide-react";

interface ModuleCardProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  color?: string;
  glowColor?: string;
  onClick?: () => void;
  index?: number;
}

/**
 * ModuleCard - Tech-style module navigation card with 3D icon and glow border
 */
const ModuleCard: React.FC<ModuleCardProps> = ({
  title = "模块名称",
  subtitle = "MODULE",
  icon: Icon,
  color = "rgb(0, 212, 255)",
  glowColor = "rgba(0, 212, 255, 0.4)",
  onClick = () => console.log("Module card clicked"),
  index = 0,
}) => {
  const [hovered, setHovered] = useState(false);

  console.log("ModuleCard rendered:", title, "hovered:", hovered);

  return (
    <div
      data-cmp="ModuleCard"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-pointer"
      style={{
        width: "100%",
        height: "220px",
        transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease",
        transform: hovered ? "translateY(-10px) scale(1.03)" : "translateY(0) scale(1)",
        filter: hovered
          ? `drop-shadow(0 0 24px ${glowColor}) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5))`
          : `drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4))`,
      }}
    >
      {/* Main card background */}
      <div
        className="absolute inset-0"
        style={{
          background: hovered
            ? `linear-gradient(160deg, rgba(0, 50, 100, 0.98) 0%, rgba(0, 28, 72, 0.98) 60%, rgba(0, 15, 50, 0.98) 100%)`
            : `linear-gradient(160deg, rgba(0, 32, 78, 0.92) 0%, rgba(0, 18, 55, 0.92) 60%, rgba(0, 10, 38, 0.92) 100%)`,
          border: `1px solid ${hovered ? color : "rgba(0, 150, 210, 0.45)"}`,
          borderRadius: "4px",
          transition: "all 0.3s ease",
          overflow: "hidden",
        }}
      >
        {/* Inner grid texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 180, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 180, 255, 0.04) 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />
        {/* Top highlight line */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: "1px",
            background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
            opacity: hovered ? 1 : 0.5,
            transition: "opacity 0.3s ease",
          }}
        />
        {/* Inner glow overlay when hovered */}
        <div
          className="absolute inset-0"
          style={{
            background: hovered
              ? `radial-gradient(ellipse at 50% 30%, rgba(0, 150, 255, 0.12) 0%, transparent 70%)`
              : "none",
            transition: "all 0.3s ease",
          }}
        />
      </div>

      {/* Outer glow box shadow */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: "4px",
          boxShadow: hovered
            ? `0 0 0 1px ${color}, 0 0 30px ${glowColor}, inset 0 0 25px rgba(0, 100, 200, 0.15)`
            : `0 0 0 1px rgba(0, 130, 190, 0.25), 0 0 10px rgba(0, 130, 200, 0.12), inset 0 0 10px rgba(0, 60, 120, 0.08)`,
          transition: "all 0.3s ease",
          pointerEvents: "none",
        }}
      />

      {/* Corner accent - top left */}
      <div className="absolute top-0 left-0 pointer-events-none" style={{ zIndex: 10 }}>
        <div
          className="absolute animate-corner"
          style={{ width: "22px", height: "2px", background: color, top: 0, left: 0, boxShadow: `0 0 6px ${color}` }}
        />
        <div
          className="absolute animate-corner"
          style={{ width: "2px", height: "22px", background: color, top: 0, left: 0, boxShadow: `0 0 6px ${color}` }}
        />
      </div>
      {/* Corner accent - top right */}
      <div className="absolute top-0 right-0 pointer-events-none" style={{ zIndex: 10 }}>
        <div
          className="absolute animate-corner"
          style={{ width: "22px", height: "2px", background: color, top: 0, right: 0, animationDelay: "0.4s", boxShadow: `0 0 6px ${color}` }}
        />
        <div
          className="absolute animate-corner"
          style={{ width: "2px", height: "22px", background: color, top: 0, right: 0, animationDelay: "0.4s", boxShadow: `0 0 6px ${color}` }}
        />
      </div>
      {/* Corner accent - bottom left */}
      <div className="absolute bottom-0 left-0 pointer-events-none" style={{ zIndex: 10 }}>
        <div
          className="absolute animate-corner"
          style={{ width: "22px", height: "2px", background: color, bottom: 0, left: 0, animationDelay: "0.8s", boxShadow: `0 0 6px ${color}` }}
        />
        <div
          className="absolute animate-corner"
          style={{ width: "2px", height: "22px", background: color, bottom: 0, left: 0, animationDelay: "0.8s", boxShadow: `0 0 6px ${color}` }}
        />
      </div>
      {/* Corner accent - bottom right */}
      <div className="absolute bottom-0 right-0 pointer-events-none" style={{ zIndex: 10 }}>
        <div
          className="absolute animate-corner"
          style={{ width: "22px", height: "2px", background: color, bottom: 0, right: 0, animationDelay: "1.2s", boxShadow: `0 0 6px ${color}` }}
        />
        <div
          className="absolute animate-corner"
          style={{ width: "2px", height: "22px", background: color, bottom: 0, right: 0, animationDelay: "1.2s", boxShadow: `0 0 6px ${color}` }}
        />
      </div>

      {/* Scan line on hover */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          height: "2px",
          background: `linear-gradient(90deg, transparent 0%, rgba(0, 212, 255, 0.2) 20%, ${color} 50%, rgba(0, 212, 255, 0.2) 80%, transparent 100%)`,
          opacity: hovered ? 1 : 0,
          animation: hovered ? "scanLine 1.8s linear infinite" : "none",
          zIndex: 8,
          top: 0,
        }}
      />

      {/* Card content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ zIndex: 6, gap: "18px" }}
      >
        {/* 3D Icon platform area */}
        <div
          className="relative flex items-center justify-center animate-float"
          style={{
            width: "80px",
            height: "80px",
            animationDelay: `${index * 0.15}s`,
          }}
        >
          {/* Outer ring glow */}
          <div
            className="absolute inset-0 rounded-sm animate-glow-pulse"
            style={{
              background: `linear-gradient(135deg, rgba(0, 120, 200, 0.25) 0%, rgba(0, 60, 150, 0.25) 100%)`,
              border: `1px solid ${glowColor}`,
              boxShadow: `0 0 20px ${glowColor}, inset 0 0 12px rgba(0, 150, 255, 0.12)`,
              animationDelay: `${index * 0.2}s`,
            }}
          />

          {/* Diamond rotated accent */}
          <div
            className="absolute"
            style={{
              width: "60px",
              height: "60px",
              border: `1px solid ${glowColor}`,
              transform: "rotate(45deg)",
              opacity: 0.3,
              borderRadius: "4px",
            }}
          />

          {/* 3D platform base shadow */}
          <div
            className="absolute"
            style={{
              bottom: "-12px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "70px",
              height: "6px",
              background: `radial-gradient(ellipse, ${glowColor} 0%, transparent 70%)`,
              filter: "blur(4px)",
            }}
          />

          {/* Platform reflection line */}
          <div
            className="absolute"
            style={{
              bottom: "-6px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "50px",
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              opacity: 0.7,
            }}
          />

          {Icon && (
            <Icon
              size={36}
              className="animate-icon-glow relative"
              style={{
                color: color,
                zIndex: 2,
                filter: `drop-shadow(0 0 8px ${color}) drop-shadow(0 2px 4px rgba(0,0,0,0.5))`,
              }}
            />
          )}
        </div>

        {/* Title section */}
        <div className="text-center px-3" style={{ marginTop: "6px" }}>
          {/* Decorative dash before title */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <div
              style={{
                width: "20px",
                height: "1px",
                background: `linear-gradient(90deg, transparent, ${color})`,
                opacity: 0.7,
              }}
            />
            <span
              style={{
                fontSize: "15px",
                fontWeight: "700",
                color: hovered ? "rgb(230, 245, 255)" : "rgb(180, 230, 255)",
                textShadow: `0 0 12px ${glowColor}, 0 0 20px ${glowColor}`,
                letterSpacing: "0.18em",
                fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif",
                transition: "color 0.3s ease",
              }}
            >
              {title}
            </span>
            <div
              style={{
                width: "20px",
                height: "1px",
                background: `linear-gradient(90deg, ${color}, transparent)`,
                opacity: 0.7,
              }}
            />
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "10px",
              color: "rgba(0, 180, 220, 0.55)",
              fontFamily: "monospace",
              letterSpacing: "0.25em",
              marginTop: "2px",
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: hovered ? "75%" : "35%",
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: hovered ? `0 0 8px ${color}` : "none",
          transition: "width 0.4s ease, box-shadow 0.3s ease",
          zIndex: 9,
        }}
      />
    </div>
  );
};

export default ModuleCard;