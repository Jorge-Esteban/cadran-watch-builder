import { DEFAULT_CONFIG } from '../data/steps';
import type { WatchConfig } from '../types/watch';

// La configuración se comparte en el hash de la URL (#d=<base64url>), sin backend.

export function encodeConfig(config: WatchConfig): string {
  const json = JSON.stringify(config);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeConfig(token: string): WatchConfig | null {
  try {
    const b64 = token.replace(/-/g, '+').replace(/_/g, '/');
    const parsed = JSON.parse(decodeURIComponent(escape(atob(b64)))) as Partial<WatchConfig>;
    return mergeConfig(parsed);
  } catch {
    return null;
  }
}

/** Completa una configuración parcial (p. ej. de una versión antigua) con los valores por defecto. */
export function mergeConfig(partial: Partial<WatchConfig> | undefined): WatchConfig {
  const out = structuredClone(DEFAULT_CONFIG);
  if (!partial) return out;
  for (const key of Object.keys(out) as (keyof WatchConfig)[]) {
    Object.assign(out[key], partial[key] ?? {});
  }
  return out;
}

export function configFromLocation(): WatchConfig | null {
  const match = window.location.hash.match(/d=([\w-]+)/);
  return match ? decodeConfig(match[1]) : null;
}

export function shareUrl(config: WatchConfig): string {
  const url = new URL(window.location.href);
  url.hash = `d=${encodeConfig(config)}`;
  return url.toString();
}
