/**
 * 系统设置相关接口（平台视觉面貌等）
 *
 * 后端约定：
 * - GET  /api/system/appearance  返回 JSON: { platformName?, language?, tabTitle?, platformLogo?, tabLogo?, homeBanner? }
 * - PUT  /api/system/appearance  请求体 JSON 同上，保存后返回 2xx
 *
 * 未配置后端时可在 vite.config 中 proxy 到实际服务，或设置 .env 中 VITE_API_BASE_URL 指向后端根地址。
 */

const getBaseUrl = () => {
  const env = typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env as { VITE_API_BASE_URL?: string }).VITE_API_BASE_URL;
  return env ?? '';
};

export interface AppearanceConfig {
  platformName: string;
  language: string;
  tabTitle: string;
  platformLogo: string;
  tabLogo: string;
  homeBanner: string;
}

const APPEARANCE_KEY = 'system_appearance';

/** 默认视觉面貌配置 */
export const defaultAppearance: AppearanceConfig = {
  platformName: '无人机综合管控平台',
  language: 'zh-CN',
  tabTitle: '无人机综合管控平台',
  platformLogo: '',
  tabLogo: '',
  homeBanner: '',
};

/**
 * 获取平台视觉面貌配置（走接口）
 */
export async function getAppearanceConfig(): Promise<AppearanceConfig> {
  const base = getBaseUrl();
  const url = base ? `${base.replace(/\/$/, '')}/api/system/appearance` : '/api/system/appearance';
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      return { ...defaultAppearance, ...data };
    }
  } catch (_) {
    // 接口不可用时忽略，由调用方使用默认值或本地兜底
  }
  // 接口失败时从 localStorage 兜底读取（可选：若希望纯接口可去掉）
  try {
    const raw = localStorage.getItem(APPEARANCE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppearanceConfig>;
      return { ...defaultAppearance, ...parsed };
    }
  } catch (_) {
    // ignore
  }
  return { ...defaultAppearance };
}

/**
 * 保存平台视觉面貌配置（走接口，成功后可选择同步写 localStorage 做缓存）
 */
export async function saveAppearanceConfig(config: AppearanceConfig): Promise<void> {
  const base = getBaseUrl();
  const url = base ? `${base.replace(/\/$/, '')}/api/system/appearance` : '/api/system/appearance';
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(config),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `保存失败: ${res.status}`);
  }
  // 接口成功后写入 localStorage 作为前端缓存，下次接口失败时可读
  try {
    localStorage.setItem(APPEARANCE_KEY, JSON.stringify(config));
  } catch (_) {
    // ignore
  }
}
