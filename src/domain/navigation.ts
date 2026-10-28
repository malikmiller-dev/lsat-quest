export const routes = ['overview', 'path', 'roadmap', 'settings'] as const;
export type Route = (typeof routes)[number];
export function parseRoute(hash: string): Route | null {
  const value = hash.replace(/^#\/?/, '').replace(/\/$/, '');
  if (!value) return 'overview';
  return routes.includes(value as Route) ? (value as Route) : null;
}
export const pageNames: Record<Route, string> = {
  overview: 'Overview',
  path: 'Learning path',
  roadmap: 'What’s coming',
  settings: 'Settings',
};
