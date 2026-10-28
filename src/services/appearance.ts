export type Theme = 'dark' | 'light';
export const THEME_KEY = 'lsat-quest:appearance:v1';
export interface PreferenceStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export function readTheme(storage: PreferenceStorage): { theme: Theme; saved: boolean } {
  try {
    return { theme: storage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark', saved: true };
  } catch {
    return { theme: 'dark', saved: false };
  }
}
export function saveTheme(storage: PreferenceStorage, theme: Theme): boolean {
  try {
    storage.setItem(THEME_KEY, theme);
    return true;
  } catch {
    return false;
  }
}
// Access can itself throw when browser storage is disabled.
export const browserPreferences: PreferenceStorage = {
  getItem: (key) => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value),
};
