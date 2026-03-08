/**
 * 城市综合治理 - 工单管理 共享数据；事件审核「通过并建单」时写入，工单管理列表读取
 */
const STORAGE_KEY = "urban_work_orders";

export type WorkOrderSource = "AI识别" | "人工识别" | "第三方推送";
export type WorkOrderStatus = "pending" | "active" | "done" | "paused";

/** 工单类型：与事件类型区分，用于分类筛选 */
export type WorkOrderType = "日常巡查" | "专项处置" | "应急响应" | "其他";

export interface UrbanWorkOrder {
  id: string;
  name: string;
  /** 事件类型：违建、垃圾堆放等 */
  eventType: string;
  /** 工单类型：日常巡查、专项处置等 */
  orderType?: WorkOrderType;
  thumbnail: string;
  location: string;
  coords: string;
  status: WorkOrderStatus;
  statusLabel: string;
  createdAt: string;
  assignee: string;
  /** 工单来源 */
  source: WorkOrderSource;
  /** 上报人 */
  reporter: string;
  /** 处理人 */
  handler: string;
  /** 处理类型 */
  processType: string;
  /** 原始证据（图片/视频 URL 或占位） */
  evidenceImages?: string[];
  evidenceVideos?: string[];
  desc?: string;
}

function load(): UrbanWorkOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function save(list: UrbanWorkOrder[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn("urban_work_orders save failed", e);
  }
}

const DEFAULT_ORDER: Partial<UrbanWorkOrder> = {
  status: "pending",
  statusLabel: "未下发",
  assignee: "—",
  source: "AI识别",
  reporter: "—",
  handler: "—",
  processType: "—",
  orderType: "日常巡查",
};

/** 从事件审核「通过并建单」创建工单 */
export function createWorkOrderFromEvent(event: {
  id: string;
  location: string;
  coords: string;
  time: string;
  algo: string;
  taskId: string;
  desc?: string;
  thumbnail?: string;
  eventType?: string;
}): UrbanWorkOrder {
  const list = load();
  const id = `WO${event.time.replace(/\D/g, "").slice(0, 12)}${String(list.length + 1).padStart(4, "0")}`;
  const name = `${event.taskId}-${(event.algo || "").replace(/\s*v[\d.]+$/, "")}-${event.time.slice(0, 10).replace(/-/g, "")}`;
  const order: UrbanWorkOrder = {
    id,
    name,
    eventType: event.eventType || "违建",
    orderType: "日常巡查",
    thumbnail: event.thumbnail || "https://picsum.photos/seed/wo/400/240",
    location: event.location,
    coords: event.coords,
    status: "pending",
    statusLabel: "未下发",
    createdAt: event.time,
    assignee: "—",
    source: "AI识别",
    reporter: "—",
    handler: "—",
    processType: "—",
    desc: event.desc,
    evidenceImages: event.thumbnail ? [event.thumbnail] : [],
    ...DEFAULT_ORDER,
  };
  save([...list, order]);
  return order;
}

export function getUrbanWorkOrders(): UrbanWorkOrder[] {
  return load();
}

export function addWorkOrder(order: Omit<UrbanWorkOrder, "id" | "createdAt">): UrbanWorkOrder {
  const list = load();
  const now = new Date();
  const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const id = `WO${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(list.length + 1).padStart(4, "0")}`;
  const full: UrbanWorkOrder = {
    ...order,
    id,
    createdAt,
    orderType: order.orderType ?? "日常巡查",
    evidenceImages: order.evidenceImages ?? [],
    evidenceVideos: order.evidenceVideos ?? [],
  };
  save([...list, full]);
  return full;
}

export function updateWorkOrder(id: string, updates: Partial<UrbanWorkOrder>): UrbanWorkOrder[] {
  const list = load();
  const next = list.map((o) => (o.id === id ? { ...o, ...updates } : o));
  save(next);
  return next;
}
