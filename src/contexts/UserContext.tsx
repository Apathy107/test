import React, { createContext, useContext, useState } from "react";

export interface CurrentUser {
  /** 当前用户姓名/账号，用于与消息接收人匹配 */
  name: string;
  /** 角色列表，用于与消息接收人（角色名）匹配 */
  roles: string[];
}

const defaultUser: CurrentUser = {
  name: "管理员",
  roles: ["管理员"],
};

const UserContext = createContext<{ currentUser: CurrentUser; setCurrentUser: (u: CurrentUser) => void } | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(defaultUser);
  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useCurrentUser must be used within UserProvider");
  return ctx;
}

export function useCurrentUserOptional() {
  return useContext(UserContext);
}

/**
 * 判断当前用户是否有权查看该消息（接收人为空则所有人可见；否则接收人包含当前用户名或任一脚色即可）
 */
export function isNotificationVisibleToUser(
  receivers: string | undefined,
  currentUser: CurrentUser
): boolean {
  if (!receivers || receivers.trim() === "") return true;
  const parts = receivers.split(/[、,，\s]+/).map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return true;
  if (parts.some((p) => p === currentUser.name)) return true;
  if (currentUser.roles.some((r) => parts.some((p) => p === r))) return true;
  return false;
}
