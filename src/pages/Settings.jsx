import { useEffect, useMemo, useState } from 'react';
import ToggleSwitch from '../components/ToggleSwitch';
import { formatStudyTime } from '../utils/dateHelpers';

const SETTINGS_KEY = 'etudes_settings';
const COURSES_KEY = 'etudes_courses';
const SESSIONS_KEY = 'studySessions';
const PLANNING_KEY = 'planningSessions';
const ANALYTICS_COLORS_KEY = 'etudes_analytics_colors';

const DEFAULT_SETTINGS = {
  askNextSessionPopup: true,
  focusMinutes: 25,
  soundsEnabled: true,
  soundVolume: 0.5,
  soundWork: '/BRUH.mp3',
  soundBreak: '/ding.wav',
  soundDone: '/notification.mp3',
  showBreakStats: true,
  timeUnitMode: 'auto'
};

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return { ...DEFAULT_SETTINGS, ...(parsed && typeof parsed === 'object' ? parsed : {}) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
};

const saveSettings = (updates) => {
  const current = loadSettings();
  const next = { ...current, ...updates };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('settingsUpdated'));
  return next;
};

const loadArray = (key) => {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveArray = (key, arr) => {
  localStorage.setItem(key, JSON.stringify(Array.isArray(arr) ? arr : []));
};

const loadAnalyticsColorMap = () => {
  try {
    const raw = localStorage.getItem(ANALYTICS_COLORS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const saveAnalyticsColorMap = (map) => {
  localStorage.setItem(ANALYTICS_COLORS_KEY, JSON.stringify(map || {}));
  window.dispatchEvent(new Event('analyticsColorsUpdated'));
};

const SOUND_OPTIONS = [
  { label: 'Ding (ding.wav)', value: '/ding.wav' },
  { label: 'Notification (notification.mp3)', value: '/notification.mp3' },
  { label: 'Bruh (BRUH.mp3)', value: '/BRUH.mp3' }
];

const Settings = () => {
  const [settings, setSettings] = useState(loadSettings);
  const [courses, setCourses] = useState(() => loadArray(COURSES_KEY));
  const [sessions, setSessions] = useState(() => loadArray(SESSIONS_KEY));
  const [analyticsColorMap, setAnalyticsColorMap] = useState(loadAnalyticsColorMap);

  const [renameFrom, setRenameFrom] = useState('');
  const [renameTo, setRenameTo] = useState('');
  const [renameMsg, setRenameMsg] = useState('');
  const [renameErr, setRenameErr] = useState('');

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('settingsUpdated'));
  }, [settings]);

  useEffect(() => {
    const onCourses = () => setCourses(loadArray(COURSES_KEY));
    const onSessions = () => setSessions(loadArray(SESSIONS_KEY));
    const onAnalyticsColors = () => setAnalyticsColorMap(loadAnalyticsColorMap());

    window.addEventListener('coursesUpdated', onCourses);
    window.addEventListener('sessionAdded', onSessions);
    window.addEventListener('analyticsColorsUpdated', onAnalyticsColors);

    return () => {
      window.removeEventListener('coursesUpdated', onCourses);
      window.removeEventListener('sessionAdded', onSessions);
      window.removeEventListener('analyticsColorsUpdated', onAnalyticsColors);
    };
  }, []);

  const volumePercent = Math.round((settings.soundVolume ?? 0.5) * 100);
  const hoursDisplayEnabled = settings.timeUnitMode !== 'minutes';

  const allSubjects = useMemo(() => {
    const set = new Set();

    (courses || []).forEach((c) => {
      const name = String(c?.name || '').trim();
      if (name) set.add(name);
    });

    (sessions || []).forEach((s) => {
      const name = typeof s?.subject === 'string' ? s.subject.trim() : '';
      if (name) set.add(name);
    });

    return Array.from(set).sort((a, b) => a.localeCompare(b, 'fr'));
  }, [courses, sessions]);

  const sessionSubjects = useMemo(() => {
    const map = new Map();
    (sessions || []).forEach((s) => {
      const name = typeof s?.subject === 'string' ? s.subject.trim() : '';
      if (!name) return;
      const dur = Number(s?.duration || 0);
      map.set(name, (map.get(name) || 0) + dur);
    });

    return Array.from(map.entries())
      .sort((a, b) => (b[1] || 0) - (a[1] || 0))
      .map(([name]) => name);
  }, [sessions]);

  useEffect(() => {
    if (!renameFrom && sessionSubjects.length > 0) setRenameFrom(sessionSubjects[0]);
    if (renameFrom && sessionSubjects.length > 0 && !sessionSubjects.includes(renameFrom)) {
      setRenameFrom(sessionSubjects[0]);
    }
    if (sessionSubjects.length === 0) setRenameFrom('');
  }, [sessionSubjects, renameFrom]);

  const courseColorMap = useMemo(() => {
    const map = {};
    (courses || []).forEach((c) => {
      const name = String(c?.name || '').trim();
      const color = typeof c?.color === 'string' ? c.color : null;
      if (name && color) map[name] = color;
    });
    return map;
  }, [courses]);

  const subjectTimeMap = useMemo(() => {
    const map = {};
    (sessions || []).forEach((s) => {
      const name = typeof s?.subject === 'string' ? s.subject.trim() : '';
      if (!name) return;
      map[name] = (map[name] || 0) + Number(s?.duration || 0);
    });
    return map;
  }, [sessions]);

  const getEffectiveColor = (subject) => {
    return analyticsColorMap?.[subject] || courseColorMap?.[subject] || '#64748b';
  };

  const setSubjectColor = (subject, color) => {
    const next = { ...(analyticsColorMap || {}) };
    next[subject] = color;
    setAnalyticsColorMap(next);
    saveAnalyticsColorMap(next);
  };

  const resetSubjectColor = (subject) => {
    const next = { ...(analyticsColorMap || {}) };
    delete next[subject];
    setAnalyticsColorMap(next);
    saveAnalyticsColorMap(next);
  };

  const resetAllColors = () => {
    setAnalyticsColorMap({});
    saveAnalyticsColorMap({});
  };

  const runRename = () => {
    setRenameErr('');
    setRenameMsg('');

    const from = String(renameFrom || '').trim();
    const to = String(renameTo || '').trim();

    if (!from) {
      setRenameErr('Choisis une matière à renommer.');
      return;
    }
    if (!sessionSubjects.includes(from)) {
      setRenameErr('Cette matière ne fait pas partie des données du diagramme.');
      return;
    }
    if (!to) {
      setRenameErr('Entre le nouveau nom.');
      return;
    }
    if (to === from) {
      setRenameErr('Le nouveau nom est identique.');
      return;
    }

    const allSessionsStored = loadArray(SESSIONS_KEY);
    const updatedSessions = allSessionsStored.map((s) => {
      const subj = typeof s?.subject === 'string' ? s.subject.trim() : s?.subject;
      if (subj === from) return { ...s, subject: to };
      return s;
    });
    saveArray(SESSIONS_KEY, updatedSessions);

    const allPlanning = loadArray(PLANNING_KEY);
    const updatedPlanning = allPlanning.map((p) => {
      const subj = typeof p?.subject === 'string' ? p.subject.trim() : p?.subject;
      if (subj === from) return { ...p, subject: to };
      return p;
    });
    saveArray(PLANNING_KEY, updatedPlanning);

    const allCoursesStored = loadArray(COURSES_KEY);
    const idxFrom = allCoursesStored.findIndex((c) => String(c?.name || '').trim() === from);
    const idxTo = allCoursesStored.findIndex((c) => String(c?.name || '').trim() === to);

    let updatedCourses = [...allCoursesStored];

    if (idxFrom !== -1 && idxTo !== -1) {
      const cFrom = updatedCourses[idxFrom];
      const cTo = updatedCourses[idxTo];

      const chaptersFrom = Array.isArray(cFrom?.chapters) ? cFrom.chapters : [];
      const chaptersTo = Array.isArray(cTo?.chapters) ? cTo.chapters : [];

      const mergedChapters = [...chaptersTo];
      const existingTitles = new Set(
        chaptersTo.map((ch) => String(ch?.title || '').trim()).filter(Boolean)
      );

      chaptersFrom.forEach((ch) => {
        const t = String(ch?.title || '').trim();
        if (!t) return;
        if (existingTitles.has(t)) return;
        mergedChapters.push(ch);
        existingTitles.add(t);
      });

      updatedCourses[idxTo] = {
        ...cTo,
        favorite: !!cTo.favorite || !!cFrom.favorite,
        chapters: mergedChapters
      };

      updatedCourses = updatedCourses.filter((_, i) => i !== idxFrom);
    } else if (idxFrom !== -1) {
      updatedCourses[idxFrom] = { ...updatedCourses[idxFrom], name: to };
    }

    saveArray(COURSES_KEY, updatedCourses);

    const colors = loadAnalyticsColorMap();
    const nextColors = { ...(colors || {}) };
    if (nextColors[from] && !nextColors[to]) nextColors[to] = nextColors[from];
    if (nextColors[from]) delete nextColors[from];
    setAnalyticsColorMap(nextColors);
    saveAnalyticsColorMap(nextColors);

    window.dispatchEvent(new Event('sessionAdded'));
    window.dispatchEvent(new Event('coursesUpdated'));
    window.dispatchEvent(new Event('planningUpdated'));

    setRenameTo('');
    setRenameMsg(`Renommé : "${from}" → "${to}"`);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold font-display mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Paramètres
        </h1>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-slate-800 dark:text-white">
                  Popup “Pause ou session ?”
                </div>

              </div>

              <ToggleSwitch
                checked={settings.askNextSessionPopup}
                onChange={() => {
                  const next = saveSettings({ askNextSessionPopup: !settings.askNextSessionPopup });
                  setSettings(next);
                }}
              />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <div className="text-lg font-semibold text-slate-800 dark:text-white">
                  Durée du Focus
                </div>
              </div>

              <div className="text-lg font-bold text-slate-800 dark:text-white">
                {settings.focusMinutes} min
              </div>
            </div>

            <input
              type="range"
              min={5}
              max={120}
              step={1}
              value={settings.focusMinutes}
              onChange={(e) => {
                const next = saveSettings({ focusMinutes: Number(e.target.value) });
                setSettings(next);
              }}
              className="w-full"
            />

            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-300 mt-2">
              <span>5 min</span>
              <span>120 min</span>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-slate-800 dark:text-white">
                  Sons
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Activer / désactiver les sons, volume, et sons par type
                </div>
              </div>

              <ToggleSwitch
                checked={settings.soundsEnabled}
                onChange={() => {
                  const next = saveSettings({ soundsEnabled: !settings.soundsEnabled });
                  setSettings(next);
                }}
              />
            </div>

            <div className={`mt-6 space-y-5 ${settings.soundsEnabled ? '' : 'opacity-50 pointer-events-none'}`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Volume
                  </div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white">
                    {volumePercent}%
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={volumePercent}
                  onChange={(e) => {
                    const v = Math.max(0, Math.min(100, Number(e.target.value)));
                    const next = saveSettings({ soundVolume: v / 100 });
                    setSettings(next);
                  }}
                  className="w-full"
                />

                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-300 mt-2">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    Son “Work”
                  </label>
                  <select
                    value={settings.soundWork}
                    onChange={(e) => {
                      const next = saveSettings({ soundWork: e.target.value });
                      setSettings(next);
                    }}
                    className="input-field"
                  >
                    {SOUND_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    Son “Break”
                  </label>
                  <select
                    value={settings.soundBreak}
                    onChange={(e) => {
                      const next = saveSettings({ soundBreak: e.target.value });
                      setSettings(next);
                    }}
                    className="input-field"
                  >
                    {SOUND_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    Son “Done”
                  </label>
                  <select
                    value={settings.soundDone}
                    onChange={(e) => {
                      const next = saveSettings({ soundDone: e.target.value });
                      setSettings(next);
                    }}
                    className="input-field"
                  >
                    {SOUND_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    try {
                      const audio = new Audio(settings.soundDone);
                      audio.volume = Number(settings.soundVolume ?? 0.5);
                      audio.play().catch(() => {});
                    } catch {}
                  }}
                >
                  Tester le son “Done”
                </button>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-slate-800 dark:text-white">
                  Statistiques des pauses
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Afficher le nombre de pauses et le temps de pause dans les statistiques
                </div>
              </div>

              <ToggleSwitch
                checked={settings.showBreakStats}
                onChange={() => {
                  const next = saveSettings({ showBreakStats: !settings.showBreakStats });
                  setSettings(next);
                }}
              />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-slate-800 dark:text-white">
                  Affichage du temps en heures
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Afficher automatiquement en heures
                </div>
              </div>

              <ToggleSwitch
                checked={hoursDisplayEnabled}
                onChange={() => {
                  const next = saveSettings({ timeUnitMode: hoursDisplayEnabled ? 'minutes' : 'auto' });
                  setSettings(next);
                }}
              />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <div className="text-lg font-semibold text-slate-800 dark:text-white">
                  Couleurs des graphiques (Analyses)
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Personnaliser les couleurs affichées dans la page Analyses
                </div>
              </div>

              <button type="button" className="btn-secondary" onClick={resetAllColors}>
                Réinitialiser
              </button>
            </div>

            {allSubjects.length === 0 ? (
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Aucune matière trouvée. Ajoute d’abord des cours ou des sessions.
              </div>
            ) : (
              <div className="space-y-3">
                {allSubjects.map((subject) => {
                  const effective = getEffectiveColor(subject);
                  const isCustom = !!analyticsColorMap?.[subject];
                  const time = subjectTimeMap?.[subject] || 0;

                  return (
                    <div key={subject} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: effective }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                          {subject}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300">
                          {formatStudyTime(time)}
                        </div>
                      </div>

                      <input
                        type="color"
                        value={effective}
                        onChange={(e) => setSubjectColor(subject, e.target.value)}
                        className="h-9 w-14 rounded border border-slate-200 dark:border-slate-700 bg-transparent cursor-pointer"
                        aria-label={`Couleur ${subject}`}
                        title={`Couleur ${subject}`}
                      />

                      <button
                        type="button"
                        onClick={() => resetSubjectColor(subject)}
                        disabled={!isCustom}
                        className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Reset
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <div className="text-lg font-semibold text-slate-800 dark:text-white">
                  Renommer une matière
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Liste basée sur les matières présentes dans les sessions (diagramme Analyses)
                </div>
              </div>
            </div>

            {sessionSubjects.length === 0 ? (
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Aucune matière dans l’historique pour le moment.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                      Nom
                    </label>
                    <select
                      className="input-field"
                      value={renameFrom}
                      onChange={(e) => {
                        setRenameFrom(e.target.value);
                        setRenameErr('');
                        setRenameMsg('');
                      }}
                    >
                      {sessionSubjects.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                      Nouveau nom
                    </label>
                    <input
                      className="input-field"
                      value={renameTo}
                      onChange={(e) => {
                        setRenameTo(e.target.value);
                        setRenameErr('');
                        setRenameMsg('');
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button type="button" className="btn-primary" onClick={runRename}>
                    Renommer
                  </button>

                  {renameErr ? (
                    <span className="text-sm text-red-600">{renameErr}</span>
                  ) : renameMsg ? (
                    <span className="text-sm text-emerald-600">{renameMsg}</span>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
