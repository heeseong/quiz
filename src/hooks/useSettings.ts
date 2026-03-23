import { useSyncExternalStore } from 'react';

export interface AppSettings {
  soundEnabled: boolean;
  fontSize: 'normal' | 'large';
}

const SETTINGS_KEY = 'quiz_settings';
const DEFAULT_SETTINGS: AppSettings = { soundEnabled: true, fontSize: 'normal' };

// Module-level singleton
const listeners = new Set<() => void>();
let cache: AppSettings = DEFAULT_SETTINGS;

// Load from localStorage on module init
try {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (raw) {
    cache = { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) };
  }
} catch {
  // private browsing or parse error
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): AppSettings {
  return cache;
}

function updateSettings(patch: Partial<AppSettings>): void {
  cache = { ...cache, ...patch };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(cache));
  } catch {
    // Silently ignore storage errors
  }
  listeners.forEach((l) => l());
}

export function useSettings(): { settings: AppSettings; update: (patch: Partial<AppSettings>) => void } {
  const settings = useSyncExternalStore(subscribe, getSnapshot);
  return { settings, update: updateSettings };
}
