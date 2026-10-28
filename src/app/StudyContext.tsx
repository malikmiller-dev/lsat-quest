import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { liveQuery } from 'dexie';
import { LearningStore } from '../data/learning-store';
import type { LearningState } from '../domain/learning';

interface Study {
  store: LearningStore;
  state: LearningState | null;
  error: string;
  retry: () => void;
}
const Context = createContext<Study | null>(null);
export function StudyProvider({
  children,
  store: supplied,
}: {
  children: ReactNode;
  store?: LearningStore;
}) {
  const [store] = useState(() => supplied ?? new LearningStore());
  const [state, setState] = useState<LearningState | null>(null);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let cancelled = false;
    let subscription: { unsubscribe: () => void } | undefined;
    const failed = () => {
      if (!cancelled) {
        setState(null);
        setError(
          'Study storage is unavailable. Allow browser storage, then retry. Your progress could not be loaded.',
        );
      }
    };
    // liveQuery deliberately stays idle without IndexedDB. Open explicitly so
    // unavailable storage produces a recoverable error instead of endless loading.
    void store.db.open().then(() => {
      if (!cancelled)
        subscription = liveQuery(() => store.snapshot()).subscribe({
          next: (value) => {
            if (!cancelled) {
              setState(value);
              setError('');
            }
          },
          error: failed,
        });
    }, failed);
    return () => {
      cancelled = true;
      subscription?.unsubscribe();
    };
  }, [store, revision]);
  return (
    <Context.Provider value={{ store, state, error, retry: () => setRevision((v) => v + 1) }}>
      {children}
    </Context.Provider>
  );
}
export function useStudy() {
  const context = useContext(Context);
  if (!context) throw new Error('StudyProvider is required.');
  return context;
}
export function StudyGate({ children }: { children: ReactNode }) {
  const { state, error, retry } = useStudy();
  if (error)
    return (
      <div className="notice" role="alert">
        <div>
          <p>{error}</p>
          <button className="button secondary" onClick={retry}>
            Retry storage
          </button>
        </div>
      </div>
    );
  if (!state) return <p>Loading saved study data…</p>;
  return children;
}
