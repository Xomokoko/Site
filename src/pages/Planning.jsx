import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { addDays, isSameDay, startOfWeek } from 'date-fns';
import useStudyData from '../hooks/useStudyData';
import { formatDate, getWeekDays, FULL_DAYS } from '../utils/dateHelpers';
import PlanningWizard from '../components/PlanningWizard';
import { generatePlanning } from '../utils/planningGenerator';
import ToggleSwitch from '../components/ToggleSwitch';

const SETTINGS_KEY = 'etudes_settings';
const ANALYTICS_COLORS_KEY = 'etudes_analytics_colors';

const loadTimeUnitMode = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed?.timeUnitMode || 'auto';
  } catch {
    return 'auto';
  }
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

const formatMinutesSmart = (minutes, timeUnitMode) => {
  const m = Number(minutes || 0);
  if (!Number.isFinite(m)) return '0 min';
  if (timeUnitMode === 'minutes') return `${Math.round(m)}min`;
  if (m < 60) return `${Math.round(m)}min`;

  const total = Math.round(m);
  const h = Math.floor(total / 60);
  const mm = total % 60;
  return mm === 0 ? `${h}h` : `${h}h${String(mm).padStart(2, '0')}`;
};

const normalizeSubject = (v) => (typeof v === 'string' ? v.trim() : '');

const Planning = () => {
  const { sessions = [], addSession, deleteSession, addMultipleSessions } = useStudyData();

  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [newSession, setNewSession] = useState({ subject: '', duration: 60, startTime: '09:00', isExam: false });
  const [showWizard, setShowWizard] = useState(false);

  const [timeUnitMode, setTimeUnitMode] = useState(loadTimeUnitMode);
  const [analyticsColorMap, setAnalyticsColorMap] = useState(loadAnalyticsColorMap);

  useEffect(() => {
    const handler = () => setTimeUnitMode(loadTimeUnitMode());
    window.addEventListener('settingsUpdated', handler);
    return () => window.removeEventListener('settingsUpdated', handler);
  }, []);

  useEffect(() => {
    const handler = () => setAnalyticsColorMap(loadAnalyticsColorMap());
    window.addEventListener('analyticsColorsUpdated', handler);
    return () => window.removeEventListener('analyticsColorsUpdated', handler);
  }, []);

  const today = new Date();
  const weekDays = getWeekDays(currentWeekStart);
  const hours = useMemo(() => Array.from({ length: 19 }, (_, i) => i + 6), []);
  const HOUR_HEIGHT = 48;

  const navigateWeek = (direction) => {
    setCurrentWeekStart(addDays(currentWeekStart, direction * 7));
  };

  const goToToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const handleAddEvent = (date, hour) => {
    setSelectedDate(date);
    setSelectedHour(hour);
    setNewSession({
      subject: '',
      duration: 60,
      startTime: `${hour.toString().padStart(2, '0')}:00`,
      isExam: false
    });
    setShowAddModal(true);
  };

  const handleSaveEvent = () => {
    if (newSession.subject.trim() && selectedDate) {
      const sessionDate = new Date(selectedDate);
      const [h, m] = newSession.startTime.split(':');
      sessionDate.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);

      addSession({
        subject: newSession.subject,
        duration: parseInt(newSession.duration, 10),
        date: sessionDate.toISOString(),
        startTime: newSession.startTime,
        description: newSession.isExam ? 'Examen' : 'Session planifiée',
        isExam: !!newSession.isExam
      });

      setNewSession({ subject: '', duration: 60, startTime: '09:00', isExam: false });
      setShowAddModal(false);
    }
  };

  const handleGeneratePlanning = (formData) => {
    const generatedSessions = generatePlanning(formData);
    if (!generatedSessions || generatedSessions.length === 0) return;
    addMultipleSessions(generatedSessions);
  };

  const getSessionsForDay = (day) => {
    const daySessions = (sessions || [])
      .filter((s) => isSameDay(new Date(s.date), day))
      .map((session) => {
        const sessionDate = new Date(session.date);
        const sessionHour = sessionDate.getHours();
        const sessionMinute = sessionDate.getMinutes();
        const startMinutes = sessionHour * 60 + sessionMinute;
        const top = ((startMinutes - 6 * 60) / 60) * HOUR_HEIGHT;
        const height = (Number(session.duration || 0) / 60) * HOUR_HEIGHT;

        if (sessionHour < 6 || sessionHour >= 24) return null;

        return { 
          ...session, 
          top: Math.max(0, top), 
          height: Math.max(16, height),
          end: Math.max(0, top) + Math.max(16, height)
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.top - b.top);

    // Détection des chevauchements et ajustement de la position
    const positioned = [];
    daySessions.forEach((session) => {
      let column = 0;
      let overlapping = positioned.filter(
        (p) => !(session.top >= p.end || session.end <= p.top)
      );

      if (overlapping.length > 0) {
        const usedColumns = overlapping.map((p) => p.column);
        while (usedColumns.includes(column)) {
          column++;
        }
      }

      const maxColumns = Math.max(
        ...positioned
          .filter((p) => !(session.top >= p.end || session.end <= p.top))
          .map((p) => p.column + 1),
        column + 1
      );

      positioned.push({ ...session, column, maxColumns });
    });

    return positioned;
  };

  const getSubjectColor = (subject) => {
    const s = normalizeSubject(subject);
    if (!s) return null;
    return analyticsColorMap?.[s] || null;
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold font-display mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Planning hebdomadaire
          </h1>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setShowWizard(true)} className="btn-primary flex items-center gap-2">
            Générer un planning
          </button>
        </div>

        <div className="card mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => navigateWeek(-1)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-bold font-display text-slate-800 dark:text-white">
                {formatDate(weekDays[0], 'dd MMM')} - {formatDate(weekDays[6], 'dd MMM yyyy')}
              </h2>
              <button onClick={goToToday} className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1">
                Aujourd'hui
              </button>
            </div>

            <button
              onClick={() => navigateWeek(1)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="flex min-w-[1000px]">
              <div className="flex-shrink-0 w-14 pr-2">
                <div className="h-12"></div>
                {hours.map((hour) => (
                  <div
                    key={hour}
                    style={{ height: `${HOUR_HEIGHT}px` }}
                    className="text-xs text-slate-500 dark:text-slate-400 text-right pr-2 flex items-start"
                  >
                    <span className="mt-[-6px]">
                      {hour === 24 ? '00:00' : `${hour.toString().padStart(2, '0')}:00`}
                    </span>
                  </div>
                ))}
              </div>

              {weekDays.map((day, dayIndex) => {
                const isToday = isSameDay(day, today);
                const daySessions = getSessionsForDay(day);

                return (
                  <div key={dayIndex} className="flex-1 min-w-[120px]">
                    <div
                      className={`h-12 flex flex-col items-center justify-center border-l border-slate-200 dark:border-slate-600 ${
                        isToday ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-slate-50 dark:bg-slate-800'
                      }`}
                    >
                      <div
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-200'
                        }`}
                      >
                        {FULL_DAYS[dayIndex].slice(0, 3)}
                      </div>
                      <div
                        className={`text-lg font-bold font-display ${
                          isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-white'
                        }`}
                      >
                        {day.getDate()}
                      </div>
                    </div>

                    <div className="relative border-l border-slate-200 dark:border-slate-600">
                      {hours.map((hour) => (
                        <div
                          key={hour}
                          style={{ height: `${HOUR_HEIGHT}px` }}
                          className={`border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                            isToday ? 'bg-blue-50/20 dark:bg-slate-800/30' : ''
                          }`}
                          onClick={() => handleAddEvent(day, hour)}
                        >
                          <div
                            style={{ height: `${HOUR_HEIGHT / 2}px` }}
                            className="border-b border-slate-100 dark:border-slate-800"
                          />
                        </div>
                      ))}

                      {daySessions.map((session) => {
                        const customColor = !session.isExam ? getSubjectColor(session.subject) : null;

                        const boxTitle = `${normalizeSubject(session.subject) || 'Session'}\nDébut: ${
                          session.startTime || '—'
                        }\nDurée: ${session.duration || 0} min`;

                        const baseClass = session.isExam
                          ? 'bg-gradient-to-br from-red-500 to-rose-600 dark:from-red-600 dark:to-rose-700 border-l-4 border-red-700 dark:border-red-400'
                          : customColor
                          ? 'border-l-4'
                          : 'bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 border-l-4 border-blue-700 dark:border-blue-400';

                        const style = customColor
                          ? { backgroundColor: customColor, borderLeftColor: customColor }
                          : undefined;

                        return (
                          <div
                            key={session.id}
                            style={{ top: `${session.top}px`, height: `${session.height}px` }}
                            className="absolute left-1 right-1 group z-10"
                          >
                            <div
                              className={`h-full rounded p-1.5 shadow-md hover:shadow-lg transition-all overflow-hidden ${baseClass}`}
                              style={style}
                              title={boxTitle}
                            >
                              <div className="flex items-start justify-between gap-1 h-full">
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-xs text-white truncate">
                                    {normalizeSubject(session.subject) || 'Session'}
                                  </div>
                                  {session.height >= 32 && (
                                    <div className="text-xs text-white/80 mt-0.5">{session.startTime}</div>
                                  )}
                                  {session.height >= 48 && (
                                    <div className="text-xs text-white/80">
                                      {formatMinutesSmart(session.duration, timeUnitMode)}
                                    </div>
                                  )}
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteSession(session.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-all p-1 rounded hover:bg-black/20 text-white flex-shrink-0"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {isToday &&
                        (() => {
                          const now = new Date();
                          const currentMinutes = now.getHours() * 60 + now.getMinutes();
                          const currentTop = ((currentMinutes - 6 * 60) / 60) * HOUR_HEIGHT;

                          if (now.getHours() >= 6) {
                            return (
                              <div
                                style={{ top: `${currentTop}px` }}
                                className="absolute left-0 right-0 flex items-center pointer-events-none z-20"
                              >
                                <div className="w-2 h-2 bg-red-500 rounded-full -ml-1" />
                                <div className="flex-1 h-0.5 bg-red-500" />
                              </div>
                            );
                          }
                          return null;
                        })()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="card max-w-md w-full animate-slide-up">
              <h3 className="text-2xl font-bold font-display mb-4 text-slate-800 dark:text-white">
                Planifier une session
              </h3>
              <p className="text-slate-600 dark:text-slate-200 mb-6">
                {formatDate(selectedDate, 'EEEE dd MMMM yyyy')} à {selectedHour}h
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    Matière *
                  </label>
                  <input
                    type="text"
                    value={newSession.subject}
                    onChange={(e) => setNewSession({ ...newSession, subject: e.target.value })}
                    className="input-field"
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Examen</div>
                  </div>
                  <ToggleSwitch
                    checked={!!newSession.isExam}
                    onChange={() => setNewSession({ ...newSession, isExam: !newSession.isExam })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    Heure de début
                  </label>
                  <input
                    type="time"
                    value={newSession.startTime}
                    onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    Durée *
                  </label>
                  <select
                    value={newSession.duration}
                    onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
                    className="input-field"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 heure</option>
                    <option value="90">1h30</option>
                    <option value="120">2 heures</option>
                    <option value="180">3 heures</option>
                    <option value="240">4 heures</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button onClick={handleSaveEvent} className="btn-primary flex-1">
                    Ajouter
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setNewSession({ subject: '', duration: 60, startTime: '09:00', isExam: false });
                    }}
                    className="btn-secondary"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showWizard && <PlanningWizard onClose={() => setShowWizard(false)} onGenerate={handleGeneratePlanning} />}
      </div>
    </div>
  );
};

export default Planning;