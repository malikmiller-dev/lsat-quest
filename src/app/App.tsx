import { useEffect, useRef, useState } from 'react';
import { Icon, type IconName } from '../components/Icon';
import { pageNames, parseRoute, type Route } from '../domain/navigation';
import { roadmap } from '../domain/roadmap';
import { browserPreferences, readTheme, saveTheme, type Theme } from '../services/appearance';

const navigation: { route: Route; icon: IconName }[] = [
  { route: 'overview', icon: 'home' },
  { route: 'path', icon: 'path' },
  { route: 'roadmap', icon: 'layers' },
  { route: 'settings', icon: 'settings' },
];

function JourneyArt() {
  return (
    <div className="journey-art" aria-hidden="true">
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <span className="art-label label-one">CURIOSITY</span>
      <span className="art-label label-two">CLARITY</span>
      <div className="art-star star-one">✦</div>
      <div className="art-star star-two">✦</div>
      <div className="compass-face">
        <div className="compass-ring">
          <span className="north">N</span>
          <span className="south">S</span>
          <span className="west">W</span>
          <span className="east">E</span>
          <Icon name="compass" size={116} />
          <i />
        </div>
      </div>
      <div className="art-caption">
        <span /> A little clearer, every day.
      </div>
    </div>
  );
}

function Overview() {
  return (
    <>
      <div className="page-intro">
        <p className="eyebrow">YOUR NEXT CHAPTER</p>
        <h1>
          Great reasoning starts
          <br />
          with a little curiosity.
        </h1>
        <p className="lede">A place to build your LSAT skills, one thoughtful step at a time.</p>
      </div>
      <section className="hero-card" aria-labelledby="hero-title">
        <div className="hero-copy">
          <span className="badge accent">
            <span className="dot" /> THE JOURNEY STARTS HERE
          </span>
          <h2 id="hero-title">
            Small steps.
            <br />
            <em>Stronger thinking.</em>
          </h2>
          <p>
            Follow a learning path built around understanding the why. LSAT Quest is taking shape,
            starting with the foundations of Logical Reasoning.
          </p>
          <a className="button primary" href="#/path">
            Explore the learning path <Icon name="arrow" />
          </a>
          <span className="hero-footnote">Foundation preview · Lessons coming next</span>
        </div>
        <JourneyArt />
      </section>
      <div className="section-heading">
        <h2>Your study space</h2>
        <span>Built with intention</span>
      </div>
      <div className="feature-grid">
        <article className="feature-card">
          <div className="icon-tile sage">
            <Icon name="path" size={24} />
          </div>
          <h3>A path, not a pile</h3>
          <p>
            The planned curriculum connects concepts, practice, and reflection into a guided
            journey.
          </p>
          <a href="#/path" className="text-link">
            See the path <Icon name="arrow" size={16} />
          </a>
        </article>
        <article className="feature-card">
          <div className="icon-tile peach">
            <Icon name="book" size={24} />
          </div>
          <h3>Understand the why</h3>
          <p>
            The first lesson will explore necessary and sufficient conditions through original
            examples.
          </p>
          <span className="status-note">Coming with the first learning quest</span>
        </article>
        <article className="feature-card">
          <div className="icon-tile blue">
            <Icon name="shield" size={24} />
          </div>
          <h3>Your journey, your data</h3>
          <p>
            No account is needed for this preview. Study records and exportable backups are planned
            for the first quest.
          </p>
          <a href="#/settings" className="text-link">
            Make yourself at home <Icon name="arrow" size={16} />
          </a>
        </article>
      </div>
      <section className="next-card">
        <div className="next-number">01</div>
        <div>
          <p className="eyebrow">NEXT ON THE BUILD PATH</p>
          <h3>Necessary vs. sufficient conditions</h3>
          <p>Learn the distinction. Test your reasoning. Understand your answer.</p>
        </div>
        <span className="badge">In the next release</span>
      </section>
    </>
  );
}

function LearningPath() {
  return (
    <>
      <div className="page-intro">
        <p className="eyebrow">THE LEARNING PATH</p>
        <h1>Start with the foundations.</h1>
        <p className="lede">
          A preview of the journey ahead. Learning activities are not available yet.
        </p>
      </div>
      <section className="path-banner">
        <Icon name="book" size={28} />
        <div>
          <p className="eyebrow">CHAPTER 01</p>
          <h2>Logical Reasoning foundations</h2>
          <p>Build a language for thinking clearly.</p>
        </div>
        <span className="badge accent">Planned</span>
      </section>
      <ol className="learning-list">
        {[
          [
            'Necessary & sufficient conditions',
            'Explore what guarantees a result and what a result requires.',
            'First learning quest',
          ],
          [
            'Arguments, premises & conclusions',
            'Identify the role each statement plays in an argument.',
            'Future curriculum',
          ],
          [
            'Assumptions & logical gaps',
            'Examine the connections an argument depends on.',
            'Future curriculum',
          ],
          [
            'Strengthen, weaken & evaluate',
            'Explore how new information affects a line of reasoning.',
            'Future curriculum',
          ],
        ].map(([title, description, status], i) => (
          <li key={title}>
            <span className={`path-number ${i === 0 ? 'first' : ''}`}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <span className="eyebrow">{status}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
            <span className="unavailable">
              <Icon name="lock" size={16} /> Not available yet
            </span>
          </li>
        ))}
      </ol>
      <aside className="notice">
        <Icon name="spark" />
        <div>
          <strong>Progress should mean something.</strong>
          <p>
            Lessons, saved attempts, and earned XP arrive together in the first complete learning
            quest. There is no study progress to track in this preview.
          </p>
        </div>
      </aside>
    </>
  );
}

function Roadmap() {
  return (
    <>
      <div className="page-intro">
        <p className="eyebrow">BUILT ONE STEP AT A TIME</p>
        <h1>A thoughtful path forward.</h1>
        <p className="lede">The product roadmap. Planned features have no promised release date.</p>
      </div>
      <div className="roadmap-list">
        {roadmap.map(([title, detail], i) => (
          <article className={`roadmap-item ${i === 0 ? 'current' : ''}`} key={title}>
            <div className="roadmap-index">
              {i === 0 ? <Icon name="compass" /> : String(i).padStart(2, '0')}
            </div>
            <div>
              <span className="eyebrow">
                SLICE {i} · {i === 0 ? 'CURRENT PREVIEW' : i === 1 ? 'UP NEXT' : 'PLANNED'}
              </span>
              <h2>{title}</h2>
              <p>{detail}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function Settings({ theme, onTheme }: { theme: Theme; onTheme: (theme: Theme) => void }) {
  return (
    <>
      <div className="page-intro">
        <p className="eyebrow">MAKE YOURSELF AT HOME</p>
        <h1>Your space. Your preference.</h1>
        <p className="lede">Set the tone for your study space.</p>
      </div>
      <section className="settings-card">
        <div>
          <h2>Appearance</h2>
          <p>
            Choose a light or dark workspace. This preference is saved in this browser when storage
            is available.
          </p>
        </div>
        <div className="theme-options" role="group" aria-label="Appearance">
          {(['dark', 'light'] as const).map((value) => (
            <button
              key={value}
              className={theme === value ? 'selected' : ''}
              aria-pressed={theme === value}
              onClick={() => onTheme(value)}
            >
              <Icon name={value === 'dark' ? 'moon' : 'sun'} />
              {value === 'dark' ? 'Dark' : 'Light'}
              {theme === value && <Icon name="check" size={16} />}
            </button>
          ))}
        </div>
      </section>
      <section className="settings-card">
        <div>
          <h2>Study data & backups</h2>
          <p>
            This release stores your appearance preference only. Attempt history, progress, and
            backup controls will arrive with the first learning quest.
          </p>
        </div>
        <span className="badge">Coming next</span>
      </section>
      <section className="settings-card">
        <div>
          <h2>About LSAT Quest</h2>
          <p>
            An independently developed study companion. This foundation preview contains no official
            test questions, score predictions, or AI tutoring.
          </p>
          <p>
            LSAT Quest is not affiliated with or endorsed by LSAC. Future original practice will be
            labeled with its provenance and review status.
          </p>
        </div>
        <span className="version-label">FOUNDATION · v0.1.0</span>
      </section>
    </>
  );
}

export function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  const [initialPreference] = useState(() => readTheme(browserPreferences));
  const [theme, setTheme] = useState<Theme>(initialPreference.theme);
  const [saved, setSaved] = useState(initialPreference.saved);
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const navigate = () => {
      setRoute(parseRoute(window.location.hash));
      setMenuOpen(false);
      mainRef.current?.focus();
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#151b19' : '#f7f7f1');
  }, [theme]);
  useEffect(() => {
    document.title = `${route ? pageNames[route] : 'Page not found'} · LSAT Quest`;
  }, [route]);
  const changeTheme = (value: Theme) => {
    setTheme(value);
    setSaved(saveTheme(browserPreferences, value));
  };

  return (
    <div
      className="app-shell"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && menuOpen) {
          setMenuOpen(false);
          menuRef.current?.focus();
        }
      }}
    >
      <a
        href="#main"
        className="skip-link"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="mobile-header">
        <a href="#/overview" className="brand">
          <span className="brand-mark">
            <Icon name="compass" size={24} />
          </span>
          lsat<span>quest</span>
        </a>
        <button
          ref={menuRef}
          className="icon-button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-controls="sidebar"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} />
        </button>
      </header>
      <aside id="sidebar" className={`sidebar ${menuOpen ? 'is-open' : ''}`}>
        <a href="#/overview" className="brand desktop-brand" aria-label="LSAT Quest overview">
          <span className="brand-mark">
            <Icon name="compass" size={27} />
          </span>
          lsat<span>quest</span>
        </a>
        <div className="workspace-label">YOUR STUDY COMPANION</div>
        <nav aria-label="Main navigation">
          {navigation.map(({ route: item, icon }) => (
            <a
              href={`#/${item}`}
              key={item}
              aria-current={route === item ? 'page' : undefined}
              className={route === item ? 'active' : ''}
            >
              <Icon name={icon} />
              {pageNames[item]}
              {route === item && <span className="nav-dot" />}
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="preview-note">
            <span className="small-compass">
              <Icon name="spark" />
            </span>
            <strong>A beginning, with purpose.</strong>
            <p>You’re exploring the foundation of LSAT Quest.</p>
            <a href="#/roadmap">
              See what’s coming <Icon name="arrow" size={15} />
            </a>
          </div>
          <div className="sidebar-footer">
            <span>
              <span className="dot" /> FOUNDATION PREVIEW
            </span>
            <button
              className="icon-button"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              onClick={() => changeTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
            </button>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div>
            <span className="breadcrumb">Your workspace</span>
            <span className="crumb-separator">/</span>
            <span>{route ? pageNames[route] : 'Page not found'}</span>
          </div>
          <span className="topbar-note">
            <Icon name="shield" size={15} /> No account needed
          </span>
        </header>
        {!saved && (
          <div className="storage-warning" role="status">
            Your appearance preference applies to this visit, but browser storage is unavailable. It
            may reset after a reload.
          </div>
        )}
        <main id="main" ref={mainRef} tabIndex={-1}>
          {route === 'overview' ? (
            <Overview />
          ) : route === 'path' ? (
            <LearningPath />
          ) : route === 'roadmap' ? (
            <Roadmap />
          ) : route === 'settings' ? (
            <Settings theme={theme} onTheme={changeTheme} />
          ) : (
            <div className="page-intro">
              <p className="eyebrow">A SMALL DETOUR</p>
              <h1>That page isn’t here.</h1>
              <p className="lede">Return to your workspace to keep exploring.</p>
              <a href="#/overview" className="button primary">
                Back to overview <Icon name="arrow" />
              </a>
            </div>
          )}
        </main>
        <footer className="page-footer">
          <span>LSAT QUEST</span>
          <p>Independently built. One thoughtful step at a time.</p>
          <a href="#/roadmap">
            Foundation preview <Icon name="arrow" size={14} />
          </a>
        </footer>
      </div>
    </div>
  );
}
