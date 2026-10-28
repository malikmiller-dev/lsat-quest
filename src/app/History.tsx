import { questionFor } from '../domain/learning';
import { StudyGate, useStudy } from './StudyContext';
import { ContentNotice, Feedback } from './Quest';
function Records() {
  const { state } = useStudy();
  const attempts = [...state!.attempts].sort(
    (a, b) => b.submittedAt.localeCompare(a.submittedAt) || b.id.localeCompare(a.id),
  );
  if (!attempts.length)
    return (
      <section className="lesson-card">
        <h2>A fresh page.</h2>
        <p>Your submitted answers and notes will appear here, including incorrect attempts.</p>
        <a href="#/quest" className="button primary">
          Start the first quest
        </a>
      </section>
    );
  return (
    <>
      <p>
        {attempts.length} saved {attempts.length === 1 ? 'attempt' : 'attempts'}. Most recent first.
      </p>
      <div className="history-list">
        {attempts.map((a) => {
          const q = questionFor(a.questionId, a.questionVersion);
          return (
            <article className="history-card" key={a.id}>
              <p className="eyebrow">
                {a.correct ? 'CORRECT' : 'INCORRECT'} · VERSION {a.questionVersion}
              </p>
              <h2>{q.title}</h2>
              <p>
                <time dateTime={a.submittedAt}>{new Date(a.submittedAt).toLocaleString()}</time> ·
                Answer {a.choice}
              </p>
              {a.reasoning && (
                <div className="saved-reasoning">
                  <strong>Your reasoning</strong>
                  <p>{a.reasoning}</p>
                </div>
              )}
              <details>
                <summary>Question & explanation</summary>
                <p>{q.stimulus}</p>
                <p>{q.prompt}</p>
                <Feedback question={q} attempt={a} />
              </details>
            </article>
          );
        })}
      </div>
    </>
  );
}
export function History() {
  return (
    <>
      <div className="page-intro">
        <p className="eyebrow">A RECORD OF YOUR THINKING</p>
        <h1>Attempt history</h1>
        <p className="lede">Revisit the reasoning, including the wrong turns.</p>
      </div>
      <ContentNotice />
      <StudyGate>
        <Records />
      </StudyGate>
    </>
  );
}
