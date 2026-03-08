/**
 * 城市常态化巡查任务 - 来自【任务调度中心】创建的类型为「城市常态化巡查」的任务，与 PatrolNormal 同步
 */
const STORAGE_KEY = "urban_patrol_tasks";

export interface UrbanPatrolTask {
  id: string;
  name: string;
  area: string;
  device: string;
  status: "active" | "done" | "paused" | "pending";
  progress: number;
  startTime: string;
  duration: string;
  /** 来自任务中心的类型标签 */
  taskType?: string;
}

function load(): UrbanPatrolTask[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function save(list: UrbanPatrolTask[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn("urban_patrol_tasks save failed", e);
  }
}

/** 从任务中心同步一条任务到常态化巡查列表（仅当类型为 城市常态化巡查 时调用） */
export function syncTaskFromMission(payload: {
  id: string;
  name: string;
  date: string;
  priority: string;
  status: string;
  startTime: string;
  planStart: string;
  device?: string;
  pilot?: string;
}) {
  const list = load();
  if (list.some((t) => t.id === payload.id)) return;
  const task: UrbanPatrolTask = {
    id: payload.id,
    name: payload.name,
    area: "待分配",
    device: payload.device || "待分配设备",
    status: "pending",
    progress: 0,
    startTime: payload.startTime,
    duration: "待执行",
    taskType: "城市常态化巡查",
  };
  save([...list, task]);
}

export function getUrbanPatrolTasks(): UrbanPatrolTask[] {
  return load();
}

export function updateTaskStatus(
  id: string,
  updates: Partial<Pick<UrbanPatrolTask, "status" | "progress">>
) {
  const list = load();
  const next = list.map((t) =>
    t.id === id ? { ...t, ...updates } : t
  );
  save(next);
  return next;
}

export function startTask(id: string): UrbanPatrolTask[] {
  return updateTaskStatus(id, { status: "active", progress: 0 });
}
