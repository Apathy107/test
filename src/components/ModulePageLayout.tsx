import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, LucideIcon } from "lucide-react";
import GridBackground from "@/components/GridBackground";
import ParticleWave from "@/components/ParticleWave";

interface ModulePageLayoutProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  color?: string;
  glowColor?: string;
  children?: React.ReactNode;
}

/**
 * ModulePageLayout - Shared layout wrapper for all 8 module sub-pages
 */
const ModulePageLayout: React.FC<ModulePageLayoutProps> = ({
  title = "模块名称",
  subtitle = "MODULE",
  icon: Icon,
  color = "rgb(0, 212, 255)",
  glowColor = "rgba(0, 212, 255, 0.4)",
  children,
}) => {
  const navigate = useNavigate();

  console.log("ModulePageLayout rendered:", title);

  return (
    <div
      data-cmp="ModulePageLayout"
      className="relative overflow-hidden"
      style={{
        width: "100%",
        maxWidth: "1920px",
        minHeight: "100vh",
        margin: "0 auto",
        background: "rgb(1, 5, 18)",
      }}
    >
      <GridBackground />

      {/* Colored top accent line */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "2px",
          background: `linear-gradient(90deg, transparent 0%, ${color} 30%, rgba(255,255,255,0.6) 50%, ${color} 70%, transparent 100%)`,
          boxShadow: `0 0 16px ${glowColor}`,
          zIndex: 30,
        }}
      />

      {/* ===== HEADER ===== */}
      <header
        className="relative flex items-center"
        style={{
          height: "68px",
          padding: "0 40px",
          zIndex: 20,
          borderBottom: `1px solid ${glowColor}`,
          background: "linear-gradient(180deg, rgba(0, 20, 60, 0.8) 0%, rgba(0, 10, 40, 0.5) 100%)",
        }}
      >
        {/* Back button */}
        <button
          onClick={() => navigate("/hub")}
          className="flex items-center gap-2 mr-8"
          style={{
            padding: "6px 16px",
            border: `1px solid ${glowColor}`,
            borderRadius: "3px",
            background: "rgba(0, 40, 80, 0.4)",
            color: color,
            fontSize: "13px",
            fontFamily: "'Microsoft YaHei', sans-serif",
            letterSpacing: "0.1em",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0, 80, 140, 0.5)";
            e.currentTarget.style.boxShadow = `0 0 12px ${glowColor}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0, 40, 80, 0.4)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <ArrowLeft size={14} />
          <span>返回</span>
        </button>

        {/* Separator */}
        <div
          style={{
            width: "1px",
            height: "28px",
            background: `linear-gradient(180deg, transparent, ${glowColor}, transparent)`,
            marginRight: "28px",
          }}
        />

        {/* Module icon + title */}
        <div className="flex items-center gap-4">
          {Icon && (
            <div
              className="flex items-center justify-center"
              style={{
                width: "36px",
                height: "36px",
                border: `1px solid ${glowColor}`,
                borderRadius: "4px",
                background: "rgba(0, 40, 100, 0.4)",
                boxShadow: `0 0 12px ${glowColor}`,
              }}
            >
              <Icon size={18} style={{ color: color }} />
            </div>
          )}
          <div>
            <h1
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "rgb(210, 240, 255)",
                fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif",
                letterSpacing: "0.2em",
                textShadow: `0 0 12px ${glowColor}`,
                margin: 0,
              }}
            >
              {title}
            </h1>
            <div
              style={{
                fontSize: "10px",
                color: "rgba(0, 180, 220, 0.45)",
                fontFamily: "monospace",
                letterSpacing: "0.25em",
                marginTop: "2px",
              }}
            >
              {subtitle}
            </div>
          </div>
        </div>

        {/* Right: breadcrumb */}
        <div
          className="ml-auto flex items-center gap-2"
          style={{
            fontSize: "11px",
            color: "rgba(0, 160, 200, 0.5)",
            fontFamily: "monospace",
            letterSpacing: "0.1em",
          }}
        >
          <button
            onClick={() => navigate("/hub")}
            style={{
              background: "none",
              border: "none",
              color: "rgba(0, 180, 220, 0.5)",
              cursor: "pointer",
              fontSize: "11px",
              fontFamily: "monospace",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Home size={11} />
            <span>导航主页</span>
          </button>
          <span style={{ color: "rgba(0, 150, 190, 0.35)" }}>/</span>
          <span style={{ color: color }}>{title}</span>
        </div>
      </header>

      {/* ===== MAIN CONTENT AREA ===== */}
      <main
        className="relative"
        style={{
          minHeight: "calc(100vh - 68px - 180px)",
          padding: "40px 48px",
          zIndex: 10,
        }}
      >
        {children}
      </main>

      <ParticleWave />

      {/* Left & Right border accent lines */}
      <div
        className="absolute left-0 top-0 bottom-0 pointer-events-none"
        style={{
          width: "2px",
          background: `linear-gradient(180deg, transparent 0%, ${glowColor} 25%, ${color.replace("rgb", "rgba").replace(")", ", 0.6)")} 50%, ${glowColor} 75%, transparent 100%)`,
          zIndex: 15,
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 pointer-events-none"
        style={{
          width: "2px",
          background: `linear-gradient(180deg, transparent 0%, ${glowColor} 25%, ${color.replace("rgb", "rgba").replace(")", ", 0.6)")} 50%, ${glowColor} 75%, transparent 100%)`,
          zIndex: 15,
        }}
      />
    </div>
  );
};

export default ModulePageLayout;