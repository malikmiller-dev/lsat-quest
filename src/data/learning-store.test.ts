import { afterEach, describe, expect, it } from 'vitest';
import { indexedDB, IDBKeyRange } from 'fake-indexeddb';
import { LearningDatabase, LearningStore, type Submission } from './learning-store';
import {
  auditAnswers,
  emptyLearningState,
  progress,
  provenance,
  questions,
} from '../domain/learning';
import { parseBackup, serializeBackup } from '../domain/backup';

const databases: LearningDatabase[] = [];
const clock = () => '2026-10-28T12:00:00.000Z';
function create(name: string = crypto.randomUUID()) {
  const db = new LearningDatabase(name, { indexedDB, IDBKeyRange });
  databases.push(db);
  return new LearningStore(db, clock);
}
function answer(index = 0, correct = true, id = crypto.randomUUID()) {
  const q = questions[index];
  return {
    id,
    questionId: q.id,
    questionVersion: q.version,
    choice: correct ? q.answer : q.choices.find((c) => c.id !== q.answer)!.id,
    reasoning: correct
      ? 'A sufficient condition guarantees the consequence.'
      : 'I reversed the rule.',
  };
}
afterEach(async () => {
  for (const db of databases) db.close();
  for (const db of databases) await db.delete();
  databases.length = 0;
});

describe('versioned original content', () => {
  it.each(questions)(
    '$id has exactly one formally supported answer and complete explanations',
    (q) => {
      expect(auditAnswers(q)).toEqual([q.answer]);
      expect(new Set(q.choices.map((c) => c.id)).size).toBe(4);
      expect(q.choices.every((c) => c.text.trim() && c.explanation.trim())).toBe(true);
      expect(q.explanation.trim()).not.toBe('');
      expect(q.version).toBe(1);
    },
  );
  it('keeps provenance provisional and IDs unique', () => {
    expect(provenance.independentReview).toBe(false);
    expect(provenance.reviewStatus).toBe('provisional');
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
  });
});
describe('atomic attempts and one-time rewards', () => {
  it('awards each event once across simultaneous independent database connections', async () => {
    const first = create();
    const second = create(first.db.name);
    await Promise.all([first.start(), second.start()]);
    for (let i = 0; i < questions.length; i++)
      await Promise.all([first.submit(answer(i)), second.submit(answer(i))]);
    await Promise.all([first.complete(), second.complete()]);
    const state = await first.snapshot();
    expect(state.attempts).toHaveLength(12);
    expect(state.rewards).toHaveLength(7);
    expect(progress(state)).toMatchObject({ solved: 6, xp: 80, complete: true });
  });
  it('preserves a wrong attempt, orders retries, and gives 80 XP for the completed six-exercise quest', async () => {
    const store = create();
    await store.start();
    await store.submit(answer(0, false));
    expect(progress(await store.snapshot()).xp).toBe(0);
    await expect(store.complete()).rejects.toThrow('every exercise');
    for (let i = 0; i < questions.length; i++) await store.submit(answer(i));
    await Promise.all([store.complete(), store.complete()]);
    const state = await store.snapshot();
    expect(state.attempts).toHaveLength(7);
    expect(state.attempts.filter((a) => !a.correct)).toHaveLength(1);
    expect(new Set(state.attempts.map((a) => a.submittedAt)).size).toBe(7);
    expect(progress(state)).toMatchObject({ solved: 6, xp: 80, complete: true });
    expect(state.rewards).toHaveLength(7);
  });
  it('makes concurrent submission retries idempotent and separate correct retries earn only one reward', async () => {
    const store = create();
    await store.start();
    const first = answer();
    await Promise.all([store.submit(first), store.submit(first), store.submit(answer())]);
    const state = await store.snapshot();
    expect(state.attempts).toHaveLength(2);
    expect(progress(state).xp).toBe(10);
    await expect(store.submit({ ...first, reasoning: 'changed' })).rejects.toThrow('ID');
  });
  it('rolls back the answer when its XP write fails', async () => {
    const store = create();
    await store.start();
    const fail = () => {
      throw new Error('Quota test');
    };
    store.db.rewards.hook('creating', fail);
    await expect(store.submit(answer())).rejects.toThrow('Quota');
    expect((await store.snapshot()).attempts).toHaveLength(0);
    store.db.rewards.hook('creating').unsubscribe(fail);
    await store.submit(answer());
    expect(progress(await store.snapshot()).xp).toBe(10);
  });
  it('reopens the same IndexedDB with attempts, notes, active question, and rewards intact', async () => {
    const store = create();
    await store.start();
    await store.submit(answer(0, false));
    await store.submit(answer());
    await store.selectQuestion(questions[2].id);
    const before = await store.snapshot();
    store.db.close();
    const reopened = create(store.db.name);
    expect(await reopened.snapshot()).toEqual(before);
  });
  it('rejects invalid choices, versions, notes, and submissions before a lesson starts', async () => {
    const store = create();
    await expect(store.submit(answer())).rejects.toThrow('Start');
    await store.start();
    await expect(store.submit({ ...answer(), questionVersion: 99 })).rejects.toThrow('version');
    await expect(
      store.submit({ ...answer(), choice: 'Z' } as unknown as Submission),
    ).rejects.toThrow('Invalid');
    await expect(store.submit({ ...answer(), reasoning: 'x'.repeat(4001) })).rejects.toThrow(
      'Invalid',
    );
    expect((await store.snapshot()).attempts).toHaveLength(0);
  });
});
describe('validated backups and transactional merging', () => {
  it('round trips a complete quest and repeated imports never add XP', async () => {
    const original = create();
    await original.start();
    for (let i = 0; i < 6; i++) await original.submit(answer(i));
    await original.complete();
    const backup = await original.exportBackup();
    const restored = create();
    await restored.importBackup(backup);
    await restored.importBackup(backup);
    expect(await restored.snapshot()).toEqual(await original.snapshot());
    expect(progress(await restored.snapshot()).xp).toBe(80);
  });
  it('merges histories from two browsers without duplicate rewards or losing wrong answers', async () => {
    const first = create();
    const second = create();
    await first.start();
    await second.start();
    await first.submit(answer());
    await second.submit(answer(0, false));
    await second.submit(answer());
    await second.submit(answer(1));
    await first.importBackup(await second.exportBackup());
    const state = await first.snapshot();
    expect(state.attempts).toHaveLength(4);
    expect(progress(state).xp).toBe(20);
  });
  it.each([
    'correct',
    'amount',
    'questionVersion',
    'reviewStatus',
    'completion',
    'duplicate',
    'extra',
    'missing',
  ])('rejects tampered %s with no mutation', async (field) => {
    const source = create();
    await source.start();
    await source.submit(answer());
    const parsed = JSON.parse(await source.exportBackup());
    if (field === 'correct') parsed.data.attempts[0].correct = false;
    if (field === 'amount') parsed.data.rewards[0].amount = 999;
    if (field === 'questionVersion') parsed.data.attempts[0].questionVersion = 99;
    if (field === 'reviewStatus') parsed.data.attempts[0].reviewStatus = 'verified';
    if (field === 'completion') parsed.data.sessions[0].completedAt = clock();
    if (field === 'duplicate') parsed.data.attempts.push(parsed.data.attempts[0]);
    if (field === 'extra') parsed.data.hiddenField = true;
    if (field === 'missing') parsed.data.rewards = [];
    const target = create();
    await target.start();
    await target.submit(answer(1, false));
    const before = await target.snapshot();
    await expect(target.importBackup(JSON.stringify(parsed))).rejects.toThrow();
    expect(await target.snapshot()).toEqual(before);
  });
  it('rejects ID collisions without altering either answer', async () => {
    const first = create();
    const second = create();
    await first.start();
    await second.start();
    const row = answer();
    await first.submit(row);
    await second.submit({ ...row, reasoning: 'A different saved explanation' });
    const before = await first.snapshot();
    await expect(first.importBackup(await second.exportBackup())).rejects.toThrow('conflicts');
    expect(await first.snapshot()).toEqual(before);
  });
  it('rolls back the entire import on a database write failure', async () => {
    const source = create();
    await source.start();
    await source.submit(answer());
    const target = create();
    target.db.rewards.hook('creating', () => {
      throw new Error('Disk full');
    });
    await expect(target.importBackup(await source.exportBackup())).rejects.toThrow('Disk full');
    expect(await target.snapshot()).toEqual(emptyLearningState());
  });
  it('rejects malformed, oversized, and unsupported JSON, while empty backups are valid', () => {
    expect(() => parseBackup('{')).toThrow('valid JSON');
    expect(() => parseBackup('x'.repeat(5 * 1024 * 1024 + 1))).toThrow('5 MiB');
    const valid = serializeBackup(emptyLearningState(), clock());
    expect(parseBackup(valid).data).toEqual(emptyLearningState());
    expect(() => parseBackup(valid.replace('"schemaVersion": 1', '"schemaVersion": 2'))).toThrow(
      'schema',
    );
  });
});
