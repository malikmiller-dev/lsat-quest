import { afterEach, describe, expect, it } from 'vitest';
import { indexedDB, IDBKeyRange } from 'fake-indexeddb';
import { LearningDatabase, LearningStore } from './learning-store';
import { MAX_BACKUP_BYTES, parseBackup, serializeBackup } from '../domain/backup';
import {
  LESSON_ID,
  MAX_REASONING,
  questions,
  questionRewardId,
  type LearningState,
} from '../domain/learning';

const now = () => '2026-10-28T12:00:00.000Z';
const databases: LearningDatabase[] = [];
function create(name: string = crypto.randomUUID()) {
  const db = new LearningDatabase(name, { indexedDB, IDBKeyRange });
  databases.push(db);
  return new LearningStore(db, now);
}
function history(
  prefix: string,
  count: number,
  reasoning = 'x'.repeat(MAX_REASONING),
): LearningState {
  return {
    attempts: Array.from({ length: count }, (_, i) => ({
      id: `${prefix}-${String(i).padStart(5, '0')}`,
      questionId: questions[0].id,
      questionVersion: 1,
      choice: 'B',
      reasoning,
      correct: false,
      submittedAt: now(),
      reviewStatus: 'provisional',
    })),
    sessions: [{ id: LESSON_ID, startedAt: now(), activeQuestionId: questions[0].id }],
    rewards: [],
  };
}
function nearlyFull(solved = false): LearningState {
  const state = history('boundary', 1400, '');
  if (solved)
    for (const [i, q] of questions.entries()) {
      const a = state.attempts[i];
      Object.assign(a, { questionId: q.id, choice: q.answer, correct: true });
      state.rewards.push({
        id: questionRewardId(q),
        amount: 10,
        sourceId: a.id,
        awardedAt: a.submittedAt,
      });
    }
  let remaining =
    MAX_BACKUP_BYTES - 32 - new TextEncoder().encode(serializeBackup(state, now())).length;
  for (const a of state.attempts) {
    const chars = Math.min(remaining, MAX_REASONING);
    a.reasoning = 'x'.repeat(chars);
    remaining -= chars;
  }
  expect(remaining).toBe(0);
  expect(new TextEncoder().encode(serializeBackup(state, now())).length).toBe(
    MAX_BACKUP_BYTES - 32,
  );
  return state;
}
afterEach(async () => {
  for (const db of databases) db.close();
  for (const db of databases) await db.delete();
  databases.length = 0;
});

describe('keep committed history exportable', () => {
  it('rejects two valid backups when their combined history exceeds the byte limit', async () => {
    const store = create();
    await store.importBackup(serializeBackup(history('first', 700), now()));
    const before = await store.exportBackup();
    const incoming = serializeBackup(history('second', 700), now());
    await expect(store.importBackup(incoming).then(() => undefined)).rejects.toThrow(
      /backup limit/i,
    );
    expect(await store.exportBackup()).toBe(before);
  });
  it('rolls back a new answer and XP if they would exceed the byte limit', async () => {
    const store = create();
    await store.importBackup(serializeBackup(nearlyFull(), now()));
    const before = await store.exportBackup();
    await expect(
      store.submit({
        id: crypto.randomUUID(),
        questionId: questions[0].id,
        questionVersion: 1,
        choice: 'A',
        reasoning: 'My draft stays in the form.',
      }),
    ).rejects.toThrow(/backup limit/i);
    expect(await store.exportBackup()).toBe(before);
  });
  it('rolls back completion and its reward if they would exceed the byte limit', async () => {
    const store = create();
    await store.importBackup(serializeBackup(nearlyFull(true), now()));
    const before = await store.exportBackup();
    await expect(store.complete()).rejects.toThrow(/backup limit/i);
    expect(await store.exportBackup()).toBe(before);
  });
  it('rejects an answer beyond the supported record count without damaging a valid backup', async () => {
    const store = create();
    await store.importBackup(serializeBackup(history('record-limit', 10000, ''), now()));
    const before = await store.exportBackup();
    await expect(
      store.submit({
        id: crypto.randomUUID(),
        questionId: questions[0].id,
        questionVersion: 1,
        choice: 'A',
        reasoning: '',
      }),
    ).rejects.toThrow(/backup limit/i);
    expect(parseBackup(await store.exportBackup()).data.attempts).toHaveLength(10000);
    expect(await store.exportBackup()).toBe(before);
  });
});
