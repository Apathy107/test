import React from "react";
import { Bell, Search, Settings, User, RefreshCw } from "lucide-react";

interface TopBarProps {
  title?: string;
  subtitle?: string;
  updateTime?: string;
}

const TopBar: React.FC<TopBarProps> = ({
  title = "人员资质管理总览",
  subtitle = "统计范围：全市所有在册飞手",
  updateTime = "2025-07-14 09:42:36",
}) => {
  return (
    <div
      data-cmp="TopBar"
      className="h-14 flex items-center justify-between px-6 flex-shrink-0"
      style={{
        background: "rgba(8, 18, 38, 0.95)",
        borderBottom: "1px solid rgba(0, 150, 200, 0.3)",
      }}
    >
      {/* Left: title */}
      <div className="flex items-center gap-4">
        <div>
          <h1
            className="text-base font-bold leading-tight"
            style={{ color: "rgba(200, 220, 240, 1)" }}
          >
            {title}
          </h1>
          <div
            className="text-xs mt-0.5"
            style={{ color: "rgba(80, 120, 160, 1)" }}
          >
            数据更新时间：{updateTime} ｜ {subtitle}
          </div>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded text-xs"
          style={{
            background: "rgba(16, 38, 76, 1)",
            border: "1px solid rgba(0, 150, 200, 0.3)",
            color: "rgba(100, 140, 180, 1)",
          }}
        >
          <Search size={13} />
          <span>搜索飞手 / 证书...</span>
        </div>

        {/* Refresh */}
        <button
          className="p-1.5 rounded transition-colors"
          style={{
            border: "1px solid rgba(0, 150, 200, 0.3)",
            color: "rgba(0, 212, 255, 0.7)",
          }}
          onClick={() => console.log("Refresh data")}
        >
          <RefreshCw size={14} />
        </button>

        {/* Bell with badge */}
        <button
          className="relative p-1.5 rounded transition-colors"
          style={{
            border: "1px solid rgba(0, 150, 200, 0.3)",
            color: "rgba(0, 212, 255, 0.7)",
          }}
          onClick={() => console.log("Open notifications")}
        >
          <Bell size={14} />
          <span
            className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full"
            style={{
              background: "rgba(255, 80, 80, 1)",
              color: "rgba(255, 255, 255, 1)",
            }}
          >
            7
          </span>
        </button>

        {/* Settings */}
        <button
          className="p-1.5 rounded transition-colors"
          style={{
            border: "1px solid rgba(0, 150, 200, 0.3)",
            color: "rgba(0, 212, 255, 0.7)",
          }}
          onClick={() => console.log("Open settings")}
        >
          <Settings size={14} />
        </button>

        {/* User */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded text-xs cursor-pointer"
          style={{
            background: "rgba(16, 38, 76, 1)",
            border: "1px solid rgba(0, 150, 200, 0.3)",
            color: "rgba(0, 212, 255, 1)",
          }}
        >
          <User size={13} />
          <span>管理员</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;