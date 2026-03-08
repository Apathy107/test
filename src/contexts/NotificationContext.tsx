import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface NotificationItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  time: string;
  read?: boolean;
  receivers?: string;
  /** 来源：消息管理同步 | 综合指挥中心告警处置 */
  source?: "message_manager" | "disposal";
}

const STORAGE_KEY = "system_notifications";
const MAX_ITEMS = 500;

export const NOTIFICATION_READ_EVENT = "system_notification_read";
export const NOTIFICATION_DELETE_EVENT = "system_notification_delete";

function loadFromStorage(): NotificationItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as NotificationItem[];
    return Array.isArray(list) ? list.slice(0, MAX_ITEMS) : [];
  } catch {
    return [];
  }
}

function saveToStorage(list: NotificationItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_ITEMS)));
  } catch (_) {}
}

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (item: Omit<NotificationItem, "read"> & { read?: boolean }) => void;
  /** 替换来自消息管理的条目（按 id 更新/新增，其余来自消息管理的移除） */
  replaceFromMessageManager: (rows: { id: string; title: string; msgType: string; sendTime: string; read: boolean; receiver?: string }[]) => void;
  markRead: (ids: string[]) => void;
  deleteNotifications: (ids: string[]) => void;
  /** 供下拉列表刷新用 */
  refresh: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(loadFromStorage);

  const refresh = useCallback(() => {
    setNotifications(loadFromStorage());
  }, []);

  const persist = useCallback((next: NotificationItem[]) => {
    setNotifications(next);
    saveToStorage(next);
  }, []);

  const addNotification = useCallback(
    (item: Omit<NotificationItem, "read"> & { read?: boolean }) => {
      const full: NotificationItem = { ...item, read: item.read ?? false };
      persist([
        full,
        ...loadFromStorage().filter((n) => n.id !== full.id),
      ].slice(0, MAX_ITEMS));
    },
    [persist]
  );

  const replaceFromMessageManager = useCallback(
    (rows: { id: string; title: string; msgType: string; sendTime: string; read: boolean; receiver?: string }[]) => {
      const fromMsg: NotificationItem[] = rows.map((r) => ({
        id: r.id,
        title: r.title,
        summary: r.msgType,
        category: r.msgType,
        time: r.sendTime,
        read: r.read,
        receivers: r.receiver,
        source: "message_manager" as const,
      }));
      setNotifications((prev) => {
        const rest = prev.filter((n) => n.source !== "message_manager");
        const next = [...fromMsg, ...rest].slice(0, MAX_ITEMS);
        saveToStorage(next);
        return next;
      });
    },
    []
  );

  const markRead = useCallback(
    (ids: string[]) => {
      if (!ids.length) return;
      const set = new Set(ids);
      const next = loadFromStorage().map((n) => (set.has(n.id) ? { ...n, read: true } : n));
      setNotifications(next);
      saveToStorage(next);
      window.dispatchEvent(new CustomEvent(NOTIFICATION_READ_EVENT, { detail: { ids } }));
    },
    []
  );

  const deleteNotifications = useCallback(
    (ids: string[]) => {
      if (!ids.length) return;
      const set = new Set(ids);
      const next = loadFromStorage().filter((n) => !set.has(n.id));
      setNotifications(next);
      saveToStorage(next);
      window.dispatchEvent(new CustomEvent(NOTIFICATION_DELETE_EVENT, { detail: { ids } }));
    },
    []
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        replaceFromMessageManager,
        markRead,
        deleteNotifications,
        refresh,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}

/** 可选使用：不在 Provider 内时返回 null */
export function useNotificationsOptional(): NotificationContextValue | null {
  return useContext(NotificationContext);
}
