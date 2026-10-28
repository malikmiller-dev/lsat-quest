import { useState } from 'react';
import { MAX_BACKUP_BYTES, parseBackup } from '../domain/backup';
import { StudyGate, useStudy } from './StudyContext';
function Controls() {
  const { store } = useStudy();
  const [candidate, setCandidate] = useState<{ text: string; count: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError('');
    setStatus('');
    try {
      await action();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Study data could not be saved.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="backup-controls">
      <div className="backup-actions">
        <button
          className="button secondary"
          disabled={busy}
          onClick={() =>
            void run(async () => {
              const text = await store.exportBackup();
              const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
              const a = document.createElement('a');
              a.href = url;
              a.download = `lsat-quest-backup-${new Date().toISOString().slice(0, 10)}.json`;
              document.body.append(a);
              a.click();
              a.remove();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
              setStatus('Backup download requested. Keep the JSON file somewhere you can find it.');
            })
          }
        >
          Export study backup
        </button>
        <label className="file-picker">
          Choose a backup to restore
          <input
            type="file"
            accept=".json,application/json"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              setCandidate(null);
              if (file)
                void run(async () => {
                  if (file.size > MAX_BACKUP_BYTES)
                    throw new Error('The backup exceeds the 5 MiB limit.');
                  const text = await file.text();
                  const parsed = parseBackup(text);
                  setCandidate({ text, count: parsed.data.attempts.length });
                });
            }}
          />
        </label>
      </div>
      {candidate && (
        <div className="backup-preview">
          <p>
            Valid backup: {candidate.count} attempts. Merge keeps existing history and awards each
            eligible XP event only once. Conflicting attempt IDs cancel the entire import.
          </p>
          <button
            disabled={busy}
            className="button primary"
            onClick={() =>
              void run(async () => {
                const state = await store.importBackup(candidate.text);
                setCandidate(null);
                setStatus(`Backup merged. ${state.attempts.length} total attempts saved.`);
              })
            }
          >
            Merge backup
          </button>
          <button disabled={busy} className="button secondary" onClick={() => setCandidate(null)}>
            Cancel
          </button>
        </div>
      )}
      {error && (
        <p role="alert" className="action-error">
          {error}
        </p>
      )}
      {status && <p role="status">{status}</p>}
    </div>
  );
}
export function Backups() {
  return (
    <section className="settings-card backup-card">
      <div>
        <h2>Study data & backups</h2>
        <p>
          Attempts, submitted notes, progress, and XP stay in this browser’s IndexedDB. Clearing
          site data or using another browser will not preserve them. Export a backup regularly.
          Appearance is a separate browser preference and is not included.
        </p>
        <p>
          Backups contain your study notes. Import accepts schema version 1 and known question
          versions only (up to 5 MiB and 10,000 attempts). Nothing is uploaded by these controls.
        </p>
        <StudyGate>
          <Controls />
        </StudyGate>
      </div>
    </section>
  );
}
