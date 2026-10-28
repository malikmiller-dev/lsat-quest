import Dexie from 'dexie';
type Table<T, K> = Dexie.Table<T, K>;
type DexieOptions = NonNullable<ConstructorParameters<typeof Dexie>[1]>;
import {
  LESSON_ID,
  LESSON_XP,
  MAX_REASONING,
  QUESTION_XP,
  progress,
  questionFor,
  questionRewardId,
  questions,
  type Attempt,
  type ChoiceId,
  type LearningState,
  type Reward,
  type Session,
} from '../domain/learning';
import { mergeStates, parseBackup, serializeBackup, validateState } from '../domain/backup';

export class LearningDatabase extends Dexie {
  declare attempts: Table<Attempt, string>;
  declare sessions: Table<Session, string>;
  declare rewards: Table<Reward, string>;
  constructor(name = 'lsat-quest-learning', options?: DexieOptions) {
    super(name, options);
    this.version(1).stores({
      attempts: 'id,questionId,[questionId+questionVersion],submittedAt',
      sessions: 'id',
      rewards: 'id',
    });
  }
}
export interface Submission {
  id: string;
  questionId: string;
  questionVersion: number;
  choice: ChoiceId;
  reasoning: string;
}
export class LearningStore {
  constructor(
    readonly db = new LearningDatabase(),
    private readonly now = () => new Date().toISOString(),
  ) {}
  snapshot(): Promise<LearningState> {
    return this.db.transaction(
      'r',
      this.db.attempts,
      this.db.sessions,
      this.db.rewards,
      async () => ({
        attempts: await this.db.attempts.toArray(),
        sessions: await this.db.sessions.toArray(),
        rewards: await this.db.rewards.toArray(),
      }),
    );
  }
  async start(): Promise<void> {
    await this.db.transaction('rw', this.db.sessions, async () => {
      if (!(await this.db.sessions.get(LESSON_ID)))
        await this.db.sessions.add({
          id: LESSON_ID,
          startedAt: this.now(),
          activeQuestionId: questions[0].id,
        });
    });
  }
  async selectQuestion(id: string): Promise<void> {
    if (!questions.some((q) => q.id === id)) throw new Error('Unknown exercise.');
    const changed = await this.db.sessions.update(LESSON_ID, { activeQuestionId: id });
    if (!changed) throw new Error('Start the lesson before practicing.');
  }
  async submit(input: Submission): Promise<Attempt> {
    const question = questionFor(input.questionId, input.questionVersion);
    if (
      !/^[A-Za-z0-9_-]{8,120}$/.test(input.id) ||
      !question.choices.some((c) => c.id === input.choice) ||
      typeof input.reasoning !== 'string' ||
      input.reasoning.length > MAX_REASONING
    )
      throw new Error('Invalid answer submission.');
    return this.db.transaction(
      'rw',
      this.db.attempts,
      this.db.sessions,
      this.db.rewards,
      async () => {
        const previous = await this.db.attempts.get(input.id);
        if (previous) {
          if (
            previous.questionId !== input.questionId ||
            previous.questionVersion !== input.questionVersion ||
            previous.choice !== input.choice ||
            previous.reasoning !== input.reasoning.trim()
          )
            throw new Error('This submission ID is already in use.');
          return previous;
        }
        const session = await this.db.sessions.get(LESSON_ID);
        if (!session) throw new Error('Start the lesson before submitting an answer.');
        const last = await this.db.attempts.orderBy('submittedAt').last();
        const minimum = Math.max(
          Date.parse(session.startedAt),
          last ? Date.parse(last.submittedAt) + 1 : 0,
        );
        const submittedAt = new Date(Math.max(Date.parse(this.now()), minimum)).toISOString();
        const attempt: Attempt = {
          ...input,
          reasoning: input.reasoning.trim(),
          correct: input.choice === question.answer,
          submittedAt,
          reviewStatus: 'provisional',
        };
        await this.db.attempts.add(attempt);
        const rewardId = questionRewardId(question);
        if (attempt.correct && !(await this.db.rewards.get(rewardId)))
          await this.db.rewards.add({
            id: rewardId,
            amount: QUESTION_XP,
            sourceId: attempt.id,
            awardedAt: submittedAt,
          });
        await this.db.sessions.update(LESSON_ID, { activeQuestionId: question.id });
        return attempt;
      },
    );
  }
  async complete(): Promise<void> {
    await this.db.transaction(
      'rw',
      this.db.attempts,
      this.db.sessions,
      this.db.rewards,
      async () => {
        const state = await this.snapshot();
        const session = state.sessions[0];
        if (!session || progress(state).solved !== questions.length)
          throw new Error('Answer every exercise correctly before completing the quest.');
        if (session.completedAt) return;
        const completedAt = [
          this.now(),
          session.startedAt,
          ...state.attempts.map((a) => a.submittedAt),
        ]
          .sort()
          .at(-1)!;
        await this.db.sessions.put({ ...session, completedAt });
        await this.db.rewards.add({
          id: `lesson:${LESSON_ID}`,
          amount: LESSON_XP,
          sourceId: LESSON_ID,
          awardedAt: completedAt,
        });
      },
    );
  }
  async exportBackup(): Promise<string> {
    return serializeBackup(await this.snapshot(), this.now());
  }
  async importBackup(input: string): Promise<LearningState> {
    const incoming = parseBackup(input).data;
    return this.db.transaction(
      'rw',
      this.db.attempts,
      this.db.sessions,
      this.db.rewards,
      async () => {
        const current = validateState(await this.snapshot());
        const merged = mergeStates(current, incoming);
        await this.db.attempts.bulkPut(merged.attempts);
        await this.db.sessions.bulkPut(merged.sessions);
        await this.db.rewards.bulkPut(merged.rewards);
        return merged;
      },
    );
  }
}
