import React from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

interface BackToHubButtonProps {
  compact?: boolean;
}

const BackToHubButton: React.FC<BackToHubButtonProps> = ({ compact = false }) => {
  const navigate = useNavigate();

  const baseStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: compact ? "3px 10px" : "4px 12px",
    border: "1px solid rgba(0, 180, 220, 0.3)",
    borderRadius: "3px",
    background: "rgba(0, 40, 80, 0.4)",
    color: "rgba(0, 212, 255, 0.8)",
    fontSize: "12px",
    cursor: "pointer",
    fontFamily: "'Microsoft YaHei', sans-serif",
    letterSpacing: "0.08em",
    transition: "all 0.2s",
  };

  return (
    <button
      type="button"
      onClick={() => navigate("/hub")}
      style={baseStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(0, 80, 140, 0.5)";
        e.currentTarget.style.borderColor = "rgba(0, 212, 255, 0.6)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(0, 40, 80, 0.4)";
        e.currentTarget.style.borderColor = "rgba(0, 180, 220, 0.3)";
      }}
    >
      <Home size={12} />
      <span>导航主页</span>
    </button>
  );
};

export default BackToHubButton;

