import { describe, expect, it } from 'vitest';
import { parseRoute } from './navigation';

describe('static-host navigation', () => {
  it.each(['', '#', '#/', '#/overview', '#overview', '#/overview/'])(
    'opens overview for %s',
    (hash) => {
      expect(parseRoute(hash)).toBe('overview');
    },
  );
  it.each(['path', 'quest', 'history', 'roadmap', 'settings'])(
    'supports the %s deep link',
    (route) => {
      expect(parseRoute(`#/${route}`)).toBe(route);
    },
  );
  it.each(['#/missing', '#/path/other', '#/constructor', '#/Settings', '#/<script>'])(
    'rejects unknown route %s',
    (hash) => {
      expect(parseRoute(hash)).toBeNull();
    },
  );
});
