import { describe, expect, it } from 'vitest';
import { readTheme, saveTheme, THEME_KEY, type PreferenceStorage } from './appearance';

function memoryStorage(value: string | null = null): PreferenceStorage {
  return {
    getItem: () => value,
    setItem: (key, next) => {
      expect(key).toBe(THEME_KEY);
      value = next;
    },
  };
}
describe('appearance persistence', () => {
  it('starts dark without a stored preference', () => {
    expect(readTheme(memoryStorage())).toEqual({ theme: 'dark', saved: true });
  });
  it('restores light mode', () => {
    expect(readTheme(memoryStorage('light')).theme).toBe('light');
  });
  it('safely ignores corrupt preferences', () => {
    expect(readTheme(memoryStorage('{bad')).theme).toBe('dark');
  });
  it('persists both choices', () => {
    const storage = memoryStorage();
    expect(saveTheme(storage, 'light')).toBe(true);
    expect(readTheme(storage).theme).toBe('light');
    expect(saveTheme(storage, 'dark')).toBe(true);
    expect(readTheme(storage).theme).toBe('dark');
  });
  it('does not crash when storage access is blocked', () => {
    const storage: PreferenceStorage = {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('quota');
      },
    };
    expect(readTheme(storage)).toEqual({ theme: 'dark', saved: false });
    expect(saveTheme(storage, 'light')).toBe(false);
  });
});
