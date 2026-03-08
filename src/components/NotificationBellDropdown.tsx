import React, { useRef, useState, useEffect, useMemo } from "react";
import { Bell, CheckSquare, Square } from "lucide-react";
import type { NotificationItem } from "@/contexts/NotificationContext";
import { useNotificationsOptional } from "@/contexts/NotificationContext";
import { useCurrentUserOptional, isNotificationVisibleToUser } from "@/contexts/UserContext";
import { NotificationDetailModal } from "@/components/NotificationDetailModal";

const MAIN_CATEGORIES = [
  "设备预警通知",
  "人员资质预警",
  "第三方数据通知",
  "任务异常通知",
  "业务处置通知",
];

const dropdownPanelStyle: React.CSSProperties = {
  position: "absolute",
  top: 40,
  right: 0,
  width: 380,
  maxHeight: 420,
  overflowY: "auto",
  background: "rgba(8, 18, 38, 0.98)",
  border: "1px solid rgba(0, 150, 200, 0.4)",
  borderRadius: 6,
  boxShadow: "0 8px 18px rgba(0,0,0,0.6)",
  padding: 8,
  zIndex: 200,
};

const iconBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  border: "1px solid rgba(0, 150, 200, 0.3)",
  borderRadius: 4,
  background: "transparent",
  color: "rgba(0, 212, 255, 0.85)",
  cursor: "pointer",
  fontFamily: "inherit",
};

interface NotificationBellDropdownProps {
  /** 按钮样式覆盖，如 width/height */
  buttonStyle?: React.CSSProperties;
  /** 未读数由外部传入时使用（当无 Provider 时） */
  fallbackUnreadCount?: number;
}

/**
 * 全局消息通知铃铛 + 下拉列表：点击消息即已读，支持多选批量已读/删除。
 * 依赖 NotificationProvider，未挂载时仅展示铃铛（可选 fallbackUnreadCount）。
 */
export const NotificationBellDropdown: React.FC<NotificationBellDropdownProps> = ({
  buttonStyle,
  fallbackUnreadCount = 0,
}) => {
  const ctx = useNotificationsOptional();
  const userContext = useCurrentUserOptional();
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailNotification, setDetailNotification] = useState<NotificationItem | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const allNotifications = ctx?.notifications ?? [];
  const notifications = useMemo(() => {
    if (!userContext?.currentUser) return allNotifications;
    return allNotifications.filter((n) => isNotificationVisibleToUser(n.receivers, userContext.currentUser));
  }, [allNotifications, userContext?.currentUser]);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayUnreadCount = ctx ? unreadCount : fallbackUnreadCount;

  const loadAndOpen = () => {
    ctx?.refresh();
    setOpen((v) => !v);
    setSelectedIds(new Set());
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllInList = (list: NotificationItem[]) => {
    const ids = list.map((n) => n.id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBatchRead = () => {
    if (selectedIds.size && ctx) {
      ctx.markRead(Array.from(selectedIds));
      clearSelection();
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.size && ctx) {
      ctx.deleteNotifications(Array.from(selectedIds));
      clearSelection();
    }
  };

  const handleSubmitFeedback = (id: string, _feedback: string) => {
    if (!ctx) return;
    ctx.markRead([id]);
    ctx.deleteNotifications([id]);
    setDetailNotification(null);
    ctx.refresh();
  };

  const byCategory = (cat: string) =>
    cat === "其他消息通知"
      ? notifications.filter((n) => !MAIN_CATEGORIES.includes(n.category))
      : notifications.filter((n) => n.category === cat);

  const allCategories = [...MAIN_CATEGORIES, "其他消息通知"];
  const hasUnread = notifications.some((n) => !n.read);

  if (!ctx) {
    return (
      <button type="button" style={{ ...iconBtnStyle, ...buttonStyle }} title="消息通知">
        <Bell size={16} />
        {fallbackUnreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              minWidth: 14,
              height: 14,
              borderRadius: 7,
              background: "rgba(255, 80, 80, 1)",
              color: "#fff",
              fontSize: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {fallbackUnreadCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div style={{ position: "relative" }} ref={panelRef}>
      <button
        type="button"
        style={{ ...iconBtnStyle, position: "relative", ...buttonStyle }}
        onClick={loadAndOpen}
        title="消息通知"
      >
        <Bell size={16} />
        {displayUnreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              minWidth: 14,
              height: 14,
              borderRadius: 7,
              background: "rgba(255, 80, 80, 1)",
              color: "#fff",
              fontSize: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {displayUnreadCount}
          </span>
        )}
      </button>
      {detailNotification && (
        <NotificationDetailModal
          notification={detailNotification}
          onClose={() => setDetailNotification(null)}
          onSubmitFeedback={handleSubmitFeedback}
        />
      )}
      {open && (
        <div style={dropdownPanelStyle}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(0, 212, 255, 1)" }}>消息通知</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {hasUnread && (
                <button
                  type="button"
                  style={{
                    padding: "4px 8px",
                    fontSize: 11,
                    color: "rgba(0, 212, 255, 0.9)",
                    background: "rgba(0, 150, 200, 0.15)",
                    border: "1px solid rgba(0, 180, 220, 0.4)",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                  onClick={() => ctx.markRead(notifications.filter((n) => !n.read).map((n) => n.id))}
                >
                  全部已读
                </button>
              )}
              {selectedIds.size > 0 && (
                <>
                  <button
                    type="button"
                    style={{
                      padding: "4px 8px",
                      fontSize: 11,
                      color: "rgba(0, 212, 255, 0.9)",
                      background: "rgba(0, 150, 200, 0.2)",
                      border: "1px solid rgba(0, 180, 220, 0.4)",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                    onClick={handleBatchRead}
                  >
                    批量已读
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: "4px 8px",
                      fontSize: 11,
                      color: "rgba(255, 120, 120, 0.95)",
                      background: "rgba(180, 60, 60, 0.2)",
                      border: "1px solid rgba(255, 100, 100, 0.4)",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                    onClick={handleBatchDelete}
                  >
                    批量删除
                  </button>
                </>
              )}
            </div>
          </div>
          {notifications.length === 0 ? (
            <div style={{ padding: "24px 12px", textAlign: "center", fontSize: 12, color: "rgba(120, 160, 200, 0.9)" }}>
              暂无消息
            </div>
          ) : (
            allCategories.map((cat) => {
              const list = byCategory(cat);
              if (!list.length) return null;
              return (
                <div key={cat} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: "rgba(120, 180, 230, 1)", marginBottom: 4 }}>{cat}</div>
                  {list.map((n) => (
                    <div
                      key={n.id}
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest("[data-noti-checkbox]")) {
                          toggleSelect(n.id);
                          return;
                        }
                        setDetailNotification(n);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          if ((e.target as HTMLElement).closest("[data-noti-checkbox]")) toggleSelect(n.id);
                          else setDetailNotification(n);
                        }
                      }}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        padding: "6px 8px",
                        borderRadius: 4,
                        border: "1px solid rgba(26, 53, 96, 0.8)",
                        background: n.read
                          ? "linear-gradient(90deg, rgba(7,16,32,0.9), rgba(9,28,58,0.9))"
                          : "linear-gradient(90deg, rgba(10,30,60,0.95), rgba(15,40,80,0.95))",
                        marginBottom: 4,
                        cursor: "pointer",
                        opacity: n.read ? 0.85 : 1,
                      }}
                    >
                      <div
                        data-noti-checkbox
                        style={{ flexShrink: 0, marginTop: 2, cursor: "pointer" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {selectedIds.has(n.id) ? (
                          <CheckSquare size={14} style={{ color: "rgba(0, 212, 255, 0.9)" }} />
                        ) : (
                          <Square size={14} style={{ color: "rgba(0, 180, 220, 0.5)" }} />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#e5f0ff",
                            marginBottom: 2,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {n.title}
                          {!n.read && (
                            <span style={{ marginLeft: 6, fontSize: 10, color: "rgba(255, 180, 80, 1)" }}>未读</span>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "rgba(120, 150, 190, 1)",
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 8,
                          }}
                        >
                          <span style={{ maxWidth: 220, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {n.summary}
                          </span>
                          <span style={{ flexShrink: 0 }}>{n.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBellDropdown;
