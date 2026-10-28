import {
  LESSON_ID,
  LESSON_XP,
  MAX_REASONING,
  QUESTION_XP,
  questionFor,
  questionRewardId,
  questions,
  type Attempt,
  type ChoiceId,
  type LearningState,
  type Reward,
  type Session,
} from './learning';

export const MAX_BACKUP_BYTES = 5 * 1024 * 1024;
export const MAX_BACKUP_ATTEMPTS = 10000;
export class BackupCapacityError extends Error {
  constructor() {
    super(
      'This action exceeds the supported backup limit (5 MiB or 10,000 attempts). It was not saved. Existing history was kept.',
    );
    this.name = 'BackupCapacityError';
  }
}
export interface Backup {
  format: 'lsat-quest-backup';
  schemaVersion: 1;
  exportedAt: string;
  data: LearningState;
}
function fail(message: string): never {
  throw new Error(`Backup rejected: ${message} No study data was changed.`);
}
function object(value: unknown, keys: string[]): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    return fail('Expected a record.');
  if (Object.keys(value).some((key) => !keys.includes(key)))
    return fail('An unrecognized field was found.');
  return value as Record<string, unknown>;
}
function text(value: unknown, maximum = 120): string {
  if (typeof value !== 'string' || value.length > maximum) return fail('Invalid text field.');
  return value;
}
function date(value: unknown): string {
  const result = text(value, 30);
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(result) ||
    !Number.isFinite(Date.parse(result)) ||
    new Date(result).toISOString() !== result
  )
    return fail('Invalid timestamp.');
  return result;
}
function list(value: unknown, maximum: number): unknown[] {
  if (!Array.isArray(value) || value.length > maximum)
    return fail('Invalid or oversized record list.');
  return value;
}
function unique(records: { id: string }[]): void {
  if (new Set(records.map((row) => row.id)).size !== records.length)
    fail('Duplicate record IDs were found.');
}
export function validateState(value: unknown): LearningState {
  const data = object(value, ['attempts', 'sessions', 'rewards']);
  if (Array.isArray(data.attempts) && data.attempts.length > MAX_BACKUP_ATTEMPTS)
    throw new BackupCapacityError();
  const attempts = list(data.attempts, MAX_BACKUP_ATTEMPTS).map((entry): Attempt => {
    const row = object(entry, [
      'id',
      'questionId',
      'questionVersion',
      'choice',
      'reasoning',
      'correct',
      'submittedAt',
      'reviewStatus',
    ]);
    const id = text(row.id);
    if (!/^[A-Za-z0-9_-]{8,120}$/.test(id)) return fail('Invalid attempt ID.');
    if (!Number.isInteger(row.questionVersion)) return fail('Invalid question version.');
    const question = questionFor(text(row.questionId), row.questionVersion as number);
    const choice = text(row.choice) as ChoiceId;
    if (!question.choices.some((option) => option.id === choice))
      return fail('Unknown answer choice.');
    if (row.correct !== (choice === question.answer))
      return fail('An answer result does not match its versioned answer key.');
    if (row.reviewStatus !== 'provisional') return fail('Unsupported content review status.');
    return {
      id,
      questionId: question.id,
      questionVersion: question.version,
      choice,
      reasoning: text(row.reasoning, MAX_REASONING),
      correct: row.correct,
      submittedAt: date(row.submittedAt),
      reviewStatus: 'provisional',
    };
  });
  const sessions = list(data.sessions, 1).map((entry): Session => {
    const row = object(entry, ['id', 'startedAt', 'activeQuestionId', 'completedAt']);
    if (row.id !== LESSON_ID || !questions.some((q) => q.id === row.activeQuestionId))
      return fail('Unknown lesson or exercise.');
    const session: Session = {
      id: LESSON_ID,
      startedAt: date(row.startedAt),
      activeQuestionId: text(row.activeQuestionId),
    };
    if (row.completedAt !== undefined) session.completedAt = date(row.completedAt);
    return session;
  });
  const rewards = list(data.rewards, questions.length + 1).map((entry): Reward => {
    const row = object(entry, ['id', 'amount', 'sourceId', 'awardedAt']);
    if (!Number.isInteger(row.amount)) return fail('Invalid XP amount.');
    return {
      id: text(row.id),
      amount: row.amount as number,
      sourceId: text(row.sourceId),
      awardedAt: date(row.awardedAt),
    };
  });
  unique(attempts);
  unique(sessions);
  unique(rewards);
  const session = sessions[0];
  if (attempts.length && !session) return fail('Attempts are missing their lesson session.');
  if (session && attempts.some((a) => a.submittedAt < session.startedAt))
    return fail('An attempt precedes its lesson session.');
  const required = new Set(
    attempts
      .filter((a) => a.correct)
      .map((a) => questionRewardId(questionFor(a.questionId, a.questionVersion))),
  );
  if (session?.completedAt) {
    if (
      session.completedAt < session.startedAt ||
      !questions.every((q) =>
        attempts.some(
          (a) =>
            a.questionId === q.id &&
            a.questionVersion === q.version &&
            a.correct &&
            a.submittedAt <= session.completedAt!,
        ),
      )
    )
      return fail('Lesson completion lacks supporting attempts.');
    required.add(`lesson:${LESSON_ID}`);
  }
  for (const reward of rewards) {
    if (!required.delete(reward.id)) return fail('An XP award has no eligible educational event.');
    if (reward.id === `lesson:${LESSON_ID}`) {
      if (
        reward.amount !== LESSON_XP ||
        reward.sourceId !== LESSON_ID ||
        reward.awardedAt !== session?.completedAt
      )
        return fail('Invalid lesson reward.');
    } else {
      const attempt = attempts.find((a) => a.id === reward.sourceId);
      if (
        !attempt?.correct ||
        reward.amount !== QUESTION_XP ||
        reward.awardedAt !== attempt.submittedAt ||
        reward.id !== questionRewardId(questionFor(attempt.questionId, attempt.questionVersion))
      )
        return fail('Invalid exercise reward.');
    }
  }
  if (required.size) return fail('An earned XP record is missing.');
  return { attempts, sessions, rewards };
}
export function parseBackup(input: string): Backup {
  if (new TextEncoder().encode(input).length > MAX_BACKUP_BYTES)
    return fail('The file exceeds the 5 MiB limit.');
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch {
    return fail('The file is not valid JSON.');
  }
  const data = object(parsed, ['format', 'schemaVersion', 'exportedAt', 'data']);
  if (data.format !== 'lsat-quest-backup' || data.schemaVersion !== 1)
    return fail('Unsupported format or schema version.');
  return {
    format: 'lsat-quest-backup',
    schemaVersion: 1,
    exportedAt: date(data.exportedAt),
    data: validateState(data.data),
  };
}
export function serializeBackup(
  state: LearningState,
  exportedAt = new Date().toISOString(),
): string {
  const result = JSON.stringify(
    {
      format: 'lsat-quest-backup',
      schemaVersion: 1,
      exportedAt: date(exportedAt),
      data: validateState(state),
    },
    null,
    2,
  );
  if (new TextEncoder().encode(result).length > MAX_BACKUP_BYTES) throw new BackupCapacityError();
  return result;
}
export function mergeStates(current: LearningState, incoming: LearningState): LearningState {
  const attempts = new Map(current.attempts.map((a) => [a.id, a]));
  for (const attempt of incoming.attempts) {
    const previous = attempts.get(attempt.id);
    if (previous && JSON.stringify(previous) !== JSON.stringify(attempt))
      return fail('An attempt ID conflicts with existing history.');
    attempts.set(attempt.id, attempt);
  }
  const existing = current.sessions[0];
  const added = incoming.sessions[0];
  let session = existing ?? added;
  if (existing && added) {
    const completedAt = [existing.completedAt, added.completedAt]
      .filter((v): v is string => !!v)
      .sort()[0];
    session = {
      ...existing,
      startedAt: [existing.startedAt, added.startedAt].sort()[0],
      ...(completedAt ? { completedAt } : {}),
    };
  }
  const rewards = new Map(current.rewards.map((r) => [r.id, r]));
  for (const reward of incoming.rewards) {
    const previous = rewards.get(reward.id);
    if (!previous || reward.awardedAt < previous.awardedAt) rewards.set(reward.id, reward);
  }
  return validateState({
    attempts: [...attempts.values()],
    sessions: session ? [session] : [],
    rewards: [...rewards.values()],
  });
}
