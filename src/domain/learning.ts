import content from '../content/conditional-v1.json';

export const LESSON_ID = 'necessary-sufficient:v1';
export const QUESTION_XP = 10;
export const LESSON_XP = 20;
export const MAX_REASONING = 4000;
export const provenance = {
  source: 'original',
  author: 'OpenAI assistant',
  created: '2026-10-28',
  reviewStatus: 'provisional',
  independentReview: false,
  rights: 'Project-original text; no official LSAT questions or third-party examples reproduced.',
} as const;
export type ChoiceId = 'A' | 'B' | 'C' | 'D';
export type Claim =
  | { kind: 'value'; variable: string; value: boolean }
  | { kind: 'undetermined'; variable: string }
  | { kind: 'implies'; from: string; to: string };
export interface Question {
  id: string;
  version: number;
  title: string;
  stimulus: string;
  prompt: string;
  choices: { id: ChoiceId; text: string; explanation: string }[];
  answer: ChoiceId;
  explanation: string;
  audit: {
    variables: string[];
    rules: [string, string][];
    facts: Record<string, boolean>;
    claims: Record<ChoiceId, Claim>;
  };
}
export const questions = content as Question[];
export function questionFor(id: string, version: number): Question {
  const question = questions.find((q) => q.id === id && q.version === version);
  if (!question)
    throw new Error('This question version is not available. Your data has not been changed.');
  return question;
}
export interface Attempt {
  id: string;
  questionId: string;
  questionVersion: number;
  choice: ChoiceId;
  reasoning: string;
  correct: boolean;
  submittedAt: string;
  reviewStatus: 'provisional';
}
export interface Session {
  id: typeof LESSON_ID;
  startedAt: string;
  activeQuestionId: string;
  completedAt?: string;
}
export interface Reward {
  id: string;
  amount: number;
  sourceId: string;
  awardedAt: string;
}
export interface LearningState {
  attempts: Attempt[];
  sessions: Session[];
  rewards: Reward[];
}
export const emptyLearningState = (): LearningState => ({
  attempts: [],
  sessions: [],
  rewards: [],
});
export function questionRewardId(question: Pick<Question, 'id' | 'version'>): string {
  return `question:${question.id}:v${question.version}`;
}
export function progress(state: LearningState) {
  const solved = new Set(
    state.attempts.filter((a) => a.correct).map((a) => `${a.questionId}:v${a.questionVersion}`),
  );
  const attempted = new Set(state.attempts.map((a) => `${a.questionId}:v${a.questionVersion}`));
  const next = questions.find((q) => !solved.has(`${q.id}:v${q.version}`)) ?? questions[0];
  return {
    solved: questions.filter((q) => solved.has(`${q.id}:v${q.version}`)).length,
    attempted: questions.filter((q) => attempted.has(`${q.id}:v${q.version}`)).length,
    total: questions.length,
    xp: state.rewards.reduce((sum, reward) => sum + reward.amount, 0),
    complete: state.sessions.some((s) => s.id === LESSON_ID && !!s.completedAt),
    next,
  };
}

// Enumerate this exercise's finite model to check its formal answer specification.
// This checks logical consistency, not whether prose is unambiguous or independently reviewed.
export function auditAnswers(question: Question): ChoiceId[] {
  const { variables, rules, facts, claims } = question.audit;
  const literal = (model: Record<string, boolean>, value: string) =>
    value.startsWith('!') ? !model[value.slice(1)] : model[value];
  const models = Array.from({ length: 2 ** variables.length }, (_, bits) =>
    Object.fromEntries(variables.map((variable, index) => [variable, !!(bits & (1 << index))])),
  ).filter(
    (model) =>
      rules.every(([a, b]) => !literal(model, a) || literal(model, b)) &&
      Object.entries(facts).every(([key, value]) => model[key] === value),
  );
  if (!models.length) throw new Error('Exercise premises are inconsistent.');
  return question.choices
    .filter((choice) => {
      const claim = claims[choice.id];
      if (claim.kind === 'undetermined')
        return (
          models.some((model) => model[claim.variable]) &&
          models.some((model) => !model[claim.variable])
        );
      return models.every((model) =>
        claim.kind === 'value'
          ? model[claim.variable] === claim.value
          : !literal(model, claim.from) || literal(model, claim.to),
      );
    })
    .map((choice) => choice.id);
}
