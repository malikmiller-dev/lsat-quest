// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { indexedDB, IDBKeyRange } from 'fake-indexeddb';
import Dexie from 'dexie';
import { App } from './App';
import { LearningDatabase, LearningStore } from '../data/learning-store';
import { progress, questions } from '../domain/learning';
import { BackupCapacityError } from '../domain/backup';

let store: LearningStore;
beforeEach(() => {
  Dexie.dependencies.indexedDB = indexedDB;
  Dexie.dependencies.IDBKeyRange = IDBKeyRange;
  store = new LearningStore(new LearningDatabase(crypto.randomUUID(), { indexedDB, IDBKeyRange }));
  window.history.replaceState(null, '', '/lsat-quest/#/quest');
  window.localStorage.clear();
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});
afterEach(async () => {
  cleanup();
  await store.db.delete();
  vi.restoreAllMocks();
});
async function begin() {
  render(<App store={store} />);
  await userEvent.click(await screen.findByRole('button', { name: 'Start provisional exercises' }));
  await screen.findByRole('button', { name: 'Submit answer' });
}
async function solve(index: number) {
  const q = questions[index];
  await userEvent.click(
    screen.getByRole('radio', {
      name: `${q.answer}. ${q.choices.find((c) => c.id === q.answer)!.text}`,
    }),
  );
  await userEvent.click(screen.getByRole('button', { name: 'Submit answer' }));
  await screen.findByRole('heading', { name: `Correct. Answer ${q.answer} is supported.` });
}
function fileWithText(text: string) {
  const file = new File([text], 'backup.json', { type: 'application/json' });
  Object.defineProperty(file, 'text', { value: async () => text });
  return file;
}

describe('first quest interface with real database service', () => {
  it('keeps a local draft when another connection saves an answer to the same question', async () => {
    await begin();
    await userEvent.click(screen.getAllByRole('radio')[1]);
    await userEvent.type(screen.getByLabelText(/Your reasoning/), 'My independent reasoning');
    const other = new LearningStore(
      new LearningDatabase(store.db.name, { indexedDB, IDBKeyRange }),
    );
    try {
      await act(async () => {
        await other.submit({
          id: crypto.randomUUID(),
          questionId: questions[0].id,
          questionVersion: 1,
          choice: 'A',
          reasoning: 'Another tab',
        });
      });
      await screen.findByText('1/6 solved · 10 XP earned');
      expect(screen.getAllByRole('radio')[1]).toBeChecked();
      expect(screen.getByLabelText(/Your reasoning/)).toHaveValue('My independent reasoning');
      await userEvent.click(screen.getByRole('button', { name: 'Submit answer' }));
      await screen.findByRole('heading', { name: 'Not quite. Answer A is supported.' });
      expect((await store.snapshot()).attempts).toHaveLength(2);
    } finally {
      other.db.close();
    }
  });
  it('keeps the current exercise and draft when another connection changes the saved resume point', async () => {
    await begin();
    await userEvent.type(screen.getByLabelText(/Your reasoning/), 'Keep this unfinished thought');
    const other = new LearningStore(
      new LearningDatabase(store.db.name, { indexedDB, IDBKeyRange }),
    );
    try {
      await act(async () => {
        await other.submit({
          id: crypto.randomUUID(),
          questionId: questions[1].id,
          questionVersion: 1,
          choice: questions[1].answer,
          reasoning: 'Another tab changed the resume point',
        });
      });
      await screen.findByText('1/6 solved · 10 XP earned');
      expect(screen.getByRole('button', { name: 'Exercise 1' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(screen.getByLabelText(/Your reasoning/)).toHaveValue('Keep this unfinished thought');
      cleanup();
      render(<App store={store} />);
      expect(await screen.findByRole('button', { name: /^Exercise 2/ })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    } finally {
      other.db.close();
    }
  });
  it('moves keyboard focus to feedback after submission and to an answer after retry', async () => {
    await begin();
    await solve(0);
    expect(screen.getByRole('heading', { name: 'Correct. Answer A is supported.' })).toHaveFocus();
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(screen.getAllByRole('radio')[0]).toHaveFocus();
  });
  it('explains a backup capacity rejection while preserving the answer draft', async () => {
    await begin();
    vi.spyOn(store, 'submit').mockRejectedValueOnce(new BackupCapacityError());
    await userEvent.click(screen.getAllByRole('radio')[0]);
    await userEvent.type(screen.getByLabelText(/Your reasoning/), 'Keep my answer');
    await userEvent.click(screen.getByRole('button', { name: 'Submit answer' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('backup limit');
    expect(screen.getByRole('alert')).toHaveTextContent('Existing history was kept');
    expect(screen.getByLabelText(/Your reasoning/)).toHaveValue('Keep my answer');
    expect(screen.getAllByRole('radio')[0]).toBeChecked();
    expect((await store.snapshot()).attempts).toHaveLength(0);
  });
  it('checks all four combinations of the interactive conditional', async () => {
    render(<App store={store} />);
    const a = screen.getByRole('checkbox', { name: 'Gold border (A)' });
    const b = screen.getByRole('checkbox', { name: 'Number (B)' });
    expect(screen.getByText(/Consistent with the rule/)).toBeInTheDocument();
    await userEvent.click(a);
    expect(screen.getByText(/Violates the rule/)).toBeInTheDocument();
    await userEvent.click(b);
    expect(screen.getByText(/Consistent with the rule/)).toBeInTheDocument();
    await userEvent.click(a);
    expect(screen.getByText(/Consistent with the rule/)).toBeInTheDocument();
  });
  it('completes six exercises, preserves an incorrect attempt and notes, and resumes after remount', async () => {
    await begin();
    expect(screen.getByRole('button', { name: 'Submit answer' })).toBeDisabled();
    await userEvent.click(screen.getAllByRole('radio')[1]);
    await userEvent.type(
      screen.getByLabelText(/Your reasoning/),
      'I assumed <em>B</em> was sufficient.',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Submit answer' }));
    await screen.findByRole('heading', { name: 'Not quite. Answer A is supported.' });
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    for (let i = 0; i < 6; i++) {
      await solve(i);
      if (i < 5) {
        await userEvent.click(screen.getByRole('button', { name: 'Next exercise →' }));
        await screen.findByRole('button', { name: 'Submit answer' });
      }
    }
    await userEvent.click(await screen.findByRole('button', { name: 'Complete quest · +20 XP' }));
    expect(await screen.findByRole('heading', { name: 'Quest complete.' })).toBeInTheDocument();
    expect(progress(await store.snapshot())).toMatchObject({ solved: 6, xp: 80, complete: true });
    cleanup();
    render(<App store={store} />);
    expect(await screen.findByRole('heading', { name: 'Quest complete.' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('link', { name: 'Review attempt history →' }));
    expect(await screen.findByText('7 saved attempts. Most recent first.')).toBeInTheDocument();
    const note = screen.getByText('I assumed <em>B</em> was sufficient.');
    expect(note).toBeInTheDocument();
    expect(note.querySelector('em')).toBeNull();
    expect(screen.getByText('INCORRECT · VERSION 1')).toBeInTheDocument();
  });
  it('keeps an unsaved selection and notes after a failed write, then safely retries', async () => {
    await begin();
    const submit = vi.spyOn(store, 'submit').mockRejectedValueOnce(new Error('Quota exceeded'));
    await userEvent.click(screen.getAllByRole('radio')[0]);
    await userEvent.type(screen.getByLabelText(/Your reasoning/), 'The grant requires a budget.');
    await userEvent.click(screen.getByRole('button', { name: 'Submit answer' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('could not be saved');
    expect(screen.getAllByRole('radio')[0]).toBeChecked();
    expect(screen.getByLabelText(/Your reasoning/)).toHaveValue('The grant requires a budget.');
    expect((await store.snapshot()).attempts).toHaveLength(0);
    await userEvent.click(screen.getByRole('button', { name: 'Submit answer' }));
    await screen.findByRole('heading', { name: 'Correct. Answer A is supported.' });
    expect(submit.mock.calls[0][0].id).toBe(submit.mock.calls[1][0].id);
    expect(progress(await store.snapshot()).xp).toBe(10);
  });
  it('resumes the selected exercise with the saved answer after an interrupted session', async () => {
    await begin();
    await solve(0);
    await userEvent.click(screen.getByRole('button', { name: 'Next exercise →' }));
    await screen.findByRole('button', { name: 'Submit answer' });
    await solve(1);
    cleanup();
    render(<App store={store} />);
    expect(
      await screen.findByRole('heading', { name: 'Correct. Answer B is supported.' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Exercise 2 ✓' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
  it('shows storage failure without enabling an unsaved practice session', async () => {
    vi.spyOn(store, 'snapshot').mockRejectedValue(new Error('Storage denied'));
    render(<App store={store} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Study storage is unavailable');
    expect(
      screen.queryByRole('button', { name: 'Start provisional exercises' }),
    ).not.toBeInTheDocument();
    vi.mocked(store.snapshot).mockRestore();
    await userEvent.click(screen.getByRole('button', { name: 'Retry storage' }));
    expect(
      await screen.findByRole('button', { name: 'Start provisional exercises' }),
    ).toBeEnabled();
  });
  it('reports missing IndexedDB instead of remaining in the loading state', async () => {
    const unavailable = new LearningStore(
      new LearningDatabase(crypto.randomUUID(), { indexedDB: undefined, IDBKeyRange }),
    );
    render(<App store={unavailable} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Study storage is unavailable');
    expect(screen.queryByText('Loading saved study data…')).not.toBeInTheDocument();
    unavailable.db.close();
  });
  it('previews a backup, requires merge, and repeated imports preserve XP and existing history', async () => {
    await store.start();
    const q = questions[0];
    await store.submit({
      id: crypto.randomUUID(),
      questionId: q.id,
      questionVersion: 1,
      choice: q.answer,
      reasoning: 'Saved note',
    });
    const backup = await store.exportBackup();
    window.history.replaceState(null, '', '/lsat-quest/#/settings');
    render(<App store={store} />);
    const picker = await screen.findByLabelText('Choose a backup to restore');
    await userEvent.upload(picker, fileWithText(backup));
    expect(await screen.findByText(/Valid backup: 1 attempts/)).toBeInTheDocument();
    expect((await store.snapshot()).attempts).toHaveLength(1);
    await userEvent.click(screen.getByRole('button', { name: 'Merge backup' }));
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Backup merged. 1 total attempts saved.',
    );
    expect(progress(await store.snapshot()).xp).toBe(10);
    await userEvent.upload(picker, fileWithText('{broken'));
    expect(await screen.findByRole('alert')).toHaveTextContent('not valid JSON');
    expect(screen.queryByRole('button', { name: 'Merge backup' })).not.toBeInTheDocument();
    expect((await store.snapshot()).attempts).toHaveLength(1);
  });
  it('requests a real JSON backup download', async () => {
    window.history.replaceState(null, '', '/lsat-quest/#/settings');
    const create = vi.fn().mockReturnValue('blob:test');
    const revoke = vi.fn();
    Object.defineProperty(URL, 'createObjectURL', { value: create, configurable: true });
    Object.defineProperty(URL, 'revokeObjectURL', { value: revoke, configurable: true });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    render(<App store={store} />);
    await userEvent.click(await screen.findByRole('button', { name: 'Export study backup' }));
    await waitFor(() => expect(click).toHaveBeenCalledOnce());
    expect(create.mock.calls[0][0]).toBeInstanceOf(Blob);
    expect(create.mock.calls[0][0].type).toBe('application/json');
    expect(await screen.findByRole('status')).toHaveTextContent('Backup download requested');
  });
});
