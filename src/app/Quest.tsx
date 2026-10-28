import { useState } from 'react';
import {
  LESSON_ID,
  MAX_REASONING,
  progress,
  provenance,
  questions,
  type Attempt,
  type ChoiceId,
  type Question,
} from '../domain/learning';
import { StudyGate, useStudy } from './StudyContext';

export function ContentNotice() {
  return (
    <aside className="content-notice">
      <strong>Original · Provisional practice</strong>
      <p>
        AI-authored by {provenance.author}, {provenance.created}. These exercises have internal
        logic checks but no independent educational review. They are not official LSAT questions or
        a calibrated assessment.
      </p>
    </aside>
  );
}
function Lesson() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  return (
    <section className="lesson-card">
      <p className="eyebrow">CONCEPT 01 · ABOUT 5 MINUTES</p>
      <h2>A guarantee and a requirement</h2>
      <p>
        In “if A, then B,” A is <strong>sufficient</strong> for B: whenever A holds, B must hold. B
        is <strong>necessary</strong> for A: A cannot hold without B.
      </p>
      <p>
        Consider a fictional rule: <em>if a card has a gold border, it has a number.</em> A gold
        border guarantees a number. A number is required for a gold border, but numbered cards might
        have other borders.
      </p>
      <p>
        The equivalent <strong>contrapositive</strong> reverses and negates both parts: if not B,
        then not A. No number means no gold border. Reversing alone (B → A) or negating alone (not A
        → not B) is not justified.
      </p>
      <p>
        “A only if B” also means A → B. It identifies B as a requirement. These rules describe
        logical constraints; they do not by themselves establish causation.
      </p>
      <div className="logic-lab">
        <h3>Try the rule: gold border → number</h3>
        <p>Toggle the two facts. Which combination breaks the rule?</p>
        <div className="lab-controls">
          <label>
            <input type="checkbox" checked={a} onChange={(e) => setA(e.target.checked)} /> Gold
            border (A)
          </label>
          <label>
            <input type="checkbox" checked={b} onChange={(e) => setB(e.target.checked)} /> Number
            (B)
          </label>
        </div>
        <p className="lab-result" aria-live="polite">
          {a && !b
            ? 'Violates the rule: a gold border without a number.'
            : 'Consistent with the rule.'}{' '}
          {!a && 'Without a gold border, the rule does not determine whether there is a number.'}
        </p>
      </div>
      <details className="sources">
        <summary>Concept sources & content status</summary>
        <p>
          The logical definitions and equivalences are supported by OpenStax:{' '}
          <a
            href="https://openstax.org/books/introduction-philosophy/pages/5-2-logical-statements"
            target="_blank"
            rel="noreferrer"
          >
            Logical Statements
          </a>{' '}
          and{' '}
          <a
            href="https://openstax.org/books/contemporary-mathematics/pages/2-5-equivalent-statements"
            target="_blank"
            rel="noreferrer"
          >
            Equivalent Statements
          </a>
          . Lesson wording and fictional examples are original. Sources do not constitute
          independent review of these exercises.
        </p>
        <p>Lesson version 1 · {provenance.rights}</p>
      </details>
    </section>
  );
}
export function Feedback({ question, attempt }: { question: Question; attempt: Attempt }) {
  return (
    <section className="answer-feedback" aria-label="Answer explanation">
      <h3 aria-live="polite">
        {attempt.correct ? 'Correct.' : 'Not quite.'} Answer {question.answer} is supported.
      </h3>
      <p>{question.explanation}</p>
      <dl>
        {question.choices.map((c) => (
          <div key={c.id}>
            <dt>
              {c.id}. {c.text}
              {attempt.choice === c.id ? ' — Your choice' : ''}
            </dt>
            <dd>{c.explanation}</dd>
          </div>
        ))}
      </dl>
      <p className="status-note">
        Attempt saved · Question version {attempt.questionVersion} · Provisional content
      </p>
    </section>
  );
}
function Exercise({ question }: { question: Question }) {
  const { store, state } = useStudy();
  const latest = state!.attempts
    .filter((a) => a.questionId === question.id && a.questionVersion === question.version)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt) || b.id.localeCompare(a.id))[0];
  const [retrying, setRetrying] = useState(false);
  const [choice, setChoice] = useState<ChoiceId | ''>('');
  const [reasoning, setReasoning] = useState('');
  const [submissionId, setSubmissionId] = useState(() => crypto.randomUUID());
  const [saved, setSaved] = useState<Attempt | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const displayed = saved ?? (retrying ? undefined : latest);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!choice || busy) return;
    setBusy(true);
    setError('');
    try {
      setSaved(
        await store.submit({
          id: submissionId,
          questionId: question.id,
          questionVersion: question.version,
          choice,
          reasoning,
        }),
      );
      setRetrying(false);
    } catch {
      setError(
        'Your answer could not be saved. Your selection and notes are still here. Retry when browser storage is available.',
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <article className="exercise-card">
      <p className="eyebrow">
        EXERCISE {questions.indexOf(question) + 1} OF {questions.length} · ORIGINAL · v
        {question.version}
      </p>
      <h2>{question.title}</h2>
      <p className="stimulus">{question.stimulus}</p>
      {displayed ? (
        <>
          <p>
            Your answer: <strong>{displayed.choice}</strong>
          </p>
          {displayed.reasoning && (
            <div className="saved-reasoning">
              <strong>Your reasoning</strong>
              <p>{displayed.reasoning}</p>
            </div>
          )}
          <Feedback question={question} attempt={displayed} />
          <button
            className="button secondary"
            onClick={() => {
              setRetrying(true);
              setSaved(null);
              setChoice('');
              setReasoning('');
              setSubmissionId(crypto.randomUUID());
            }}
          >
            Try again
          </button>
          <p className="status-note">
            Retries stay in your history. Each exercise can award 10 XP only once.
          </p>
        </>
      ) : (
        <form onSubmit={submit}>
          <fieldset disabled={busy}>
            <legend>{question.prompt}</legend>
            <div className="answer-options">
              {question.choices.map((c) => (
                <label key={c.id} className={choice === c.id ? 'chosen' : ''}>
                  <input
                    type="radio"
                    name="answer"
                    value={c.id}
                    checked={choice === c.id}
                    onChange={() => setChoice(c.id)}
                  />
                  <span>
                    <strong>{c.id}.</strong> {c.text}
                  </span>
                </label>
              ))}
            </div>
            <label className="reasoning-label" htmlFor="reasoning">
              Your reasoning <span>(optional, {MAX_REASONING} characters maximum)</span>
            </label>
            <textarea
              id="reasoning"
              rows={3}
              maxLength={MAX_REASONING}
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="What does the rule guarantee?"
            />
          </fieldset>
          {error && (
            <p role="alert" className="action-error">
              {error}
            </p>
          )}
          <button className="button primary" disabled={!choice || busy}>
            {busy ? 'Saving answer…' : 'Submit answer'}
          </button>
        </form>
      )}
    </article>
  );
}
function Practice() {
  const { store, state } = useStudy();
  const session = state!.sessions.find((s) => s.id === LESSON_ID);
  const stats = progress(state!);
  const active = questions.find((q) => q.id === session?.activeQuestionId) ?? questions[0];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const run = async (action: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await action();
    } catch {
      setError('The change could not be saved. Please retry when browser storage is available.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <section aria-label="Practice exercises" className="practice-section">
      <div className="section-heading">
        <h2>Your practice</h2>
        <span aria-live="polite">
          {stats.solved}/{stats.total} solved · {stats.xp} XP earned
        </span>
      </div>
      <p className="status-note">
        10 XP for each first correct answer + 20 XP for completing all six. XP records activity, not
        mastery or an LSAT score.
      </p>
      {error && (
        <p className="action-error" role="alert">
          {error}
        </p>
      )}
      {!session ? (
        <>
          <p>
            By starting, you choose to practice with the provisional material described above.
            Answers and submitted notes are saved in this browser. Unsubmitted notes are not saved.
          </p>
          <button
            className="button primary"
            disabled={busy}
            onClick={() => void run(() => store.start())}
          >
            {busy ? 'Starting…' : 'Start provisional exercises'}
          </button>
        </>
      ) : (
        <>
          {stats.complete && (
            <div className="quest-complete" role="status">
              <h3>Quest complete.</h3>
              <p>
                All six exercises solved. Your completion and {stats.xp} earned XP are saved. You
                can revisit any explanation below.
              </p>
              <a href="#/history" className="text-link">
                Review attempt history →
              </a>
            </div>
          )}
          <div className="exercise-tabs" role="group" aria-label="Choose an exercise">
            {questions.map((q, i) => (
              <button
                key={q.id}
                className={q.id === active.id ? 'selected' : ''}
                aria-pressed={q.id === active.id}
                disabled={busy}
                onClick={() => void run(() => store.selectQuestion(q.id))}
              >
                Exercise {i + 1}
                {state!.attempts.some(
                  (a) => a.questionId === q.id && a.questionVersion === q.version && a.correct,
                )
                  ? ' ✓'
                  : ''}
              </button>
            ))}
          </div>
          <Exercise key={active.id} question={active} />
          <div className="practice-actions">
            {questions.indexOf(active) < questions.length - 1 && (
              <button
                className="button secondary"
                disabled={busy}
                onClick={() =>
                  void run(() => store.selectQuestion(questions[questions.indexOf(active) + 1].id))
                }
              >
                Next exercise →
              </button>
            )}
            {stats.solved === stats.total && !stats.complete && (
              <button
                className="button primary"
                disabled={busy}
                onClick={() => void run(() => store.complete())}
              >
                Complete quest · +20 XP
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
export function Quest() {
  return (
    <>
      <div className="page-intro">
        <p className="eyebrow">YOUR FIRST LEARNING QUEST</p>
        <h1>Necessary & sufficient conditions</h1>
        <p className="lede">See what a rule guarantees—and what it leaves open.</p>
      </div>
      <ContentNotice />
      <Lesson />
      <StudyGate>
        <Practice />
      </StudyGate>
    </>
  );
}
