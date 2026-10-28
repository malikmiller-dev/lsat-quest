// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { THEME_KEY } from '../services/appearance';
import { parseRoute } from '../domain/navigation';

beforeEach(() => {
  window.history.replaceState(null, '', '/lsat-quest/');
  window.localStorage.clear();
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('application integration', () => {
  it('renders a truthful foundation with valid navigation targets', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Great reasoning');
    expect(screen.getByText('Foundation preview · Lessons coming next')).toBeInTheDocument();
    for (const link of screen.getAllByRole('link')) {
      const href = link.getAttribute('href')!;
      if (href !== '#main') expect(parseRoute(href)).not.toBeNull();
    }
  });
  it('navigates through the primary action and moves focus to content', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('link', { name: 'Explore the learning path' }));
    expect(
      await screen.findByRole('heading', { name: 'Start with the foundations.' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveFocus();
    expect(screen.getAllByText('Not available yet')).toHaveLength(4);
    expect(within(screen.getByRole('main')).queryByRole('button')).not.toBeInTheDocument();
    expect(document.title).toBe('Learning path · LSAT Quest');
  });
  it('restores settings by direct fragment and persists appearance across remounts', async () => {
    window.history.replaceState(null, '', '#/settings');
    const view = render(<App />);
    await userEvent.click(screen.getByRole('button', { name: 'Light' }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(window.localStorage.getItem(THEME_KEY)).toBe('light');
    view.unmount();
    render(<App />);
    expect(screen.getByRole('button', { name: 'Light' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Dark' }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(window.localStorage.getItem(THEME_KEY)).toBe('dark');
  });
  it('shows save failure while keeping appearance controls usable', async () => {
    window.history.replaceState(null, '', '#/settings');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: 'Light' }));
    expect(screen.getByRole('status')).toHaveTextContent('browser storage is unavailable');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(window.localStorage.getItem(THEME_KEY)).toBeNull();
  });
  it('survives blocked preference reads', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Access denied');
    });
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Great reasoning');
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  it('recovers an unknown route without losing the saved appearance', async () => {
    window.localStorage.setItem(THEME_KEY, 'light');
    window.history.replaceState(null, '', '#/unknown');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('That page isn’t here.');
    await userEvent.click(screen.getByRole('link', { name: 'Back to overview' }));
    expect(await screen.findByRole('heading', { name: /Great reasoning/ })).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });
  it('opens the mobile menu and closes it with Escape, restoring focus', async () => {
    render(<App />);
    // CSS viewport visibility is verified by Playwright, not by this DOM test.
    const trigger = screen.getByRole('button', { name: 'Open navigation' });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });
  it('shows the full product roadmap without completion metrics', () => {
    window.history.replaceState(null, '', '#/roadmap');
    render(<App />);
    expect(screen.getAllByRole('article')).toHaveLength(16);
    expect(screen.getByText('SLICE 0 · CURRENT PREVIEW')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});
