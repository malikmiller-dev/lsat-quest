export type IconName =
  | 'compass'
  | 'home'
  | 'path'
  | 'layers'
  | 'settings'
  | 'arrow'
  | 'book'
  | 'shield'
  | 'sun'
  | 'moon'
  | 'check'
  | 'lock'
  | 'menu'
  | 'close'
  | 'spark';
const paths: Record<IconName, string> = {
  compass: 'M12 2 16 12 12 22 8 12Z M2 12 12 8 22 12 12 16Z',
  home: 'm3 10 9-7 9 7v10H3Z M9 20v-7h6v7',
  path: 'M6 20v-9a5 5 0 0 1 5-5h7 M15 3l3 3-3 3 M3 20h6',
  layers: 'm12 3 10 6-10 6L2 9Z m-10 9 10 6 10-6 M2 14l10 6 10-6',
  settings:
    'M12 3v3 M12 18v3 M3 12h3 M18 12h3 M5.6 5.6l2.1 2.1 M16.3 16.3l2.1 2.1 M5.6 18.4l2.1-2.1 M16.3 7.7l2.1-2.1 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  arrow: 'M4 12h16 M14 6l6 6-6 6',
  book: 'M12 5c-4-3-7-2-10-1v15c3-1 6-2 10 1 4-3 7-2 10-1V4c-3-1-6-2-10 1Z M12 5v15',
  shield: 'M12 3 3 6v6c0 5 9 9 9 9s9-4 9-9V6Z m-4 9 3 3 5-6',
  sun: 'M12 1v3 M12 20v3 M1 12h3 M20 12h3 M4 4l2 2 M18 18l2 2 M4 20l2-2 M18 6l2-2 M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
  moon: 'M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z',
  check: 'm5 12 4 4L19 6',
  lock: 'M7 10V7a5 5 0 0 1 10 0v3 M5 10h14v11H5Z M12 14v3',
  menu: 'M3 5h18 M3 12h18 M3 19h18',
  close: 'm5 5 14 14 M5 19 19 5',
  spark: 'm12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z',
};
export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
