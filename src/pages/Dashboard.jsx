import { useEffect, useMemo, useState } from 'react';
import { Clock, Flame, BookOpen, Target, TrendingUp } from 'lucide-react';
import Timer from '../components/Timer';
import StatCard from '../components/StatCard';
import TodoList from '../components/TodoList';
import useStudyData from '../hooks/useStudyData';
import { formatStudyTime } from '../utils/dateHelpers';

const SETTINGS_KEY = 'etudes_settings';

const loadShowBreakStats = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed?.showBreakStats !== false;
  } catch {
    return true;
  }
};

const Dashboard = () => {
  const [settingsKey, setSettingsKey] = useState(0);

  const {
    tasks,
    stats,
    addTask,
    toggleTaskComplete,
    removeTask,
    getTodaySessions,
    getWeekSessions,
    getTodayBreaks,
    reloadData
  } = useStudyData();

  const showBreakStats = useMemo(() => loadShowBreakStats(), [settingsKey]);

  const todaySessions = getTodaySessions();
  const weekSessions = getWeekSessions();
  const todayBreaks = getTodayBreaks();

  const todayTotal = todaySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const weekTotal = weekSessions.reduce((sum, s) => sum + (s.duration || 0), 0);

  useEffect(() => {
    const handleSessionAdded = () => reloadData();
    const handleBreakAdded = () => reloadData();
    const handleSettings = () => setSettingsKey((k) => k + 1);

    window.addEventListener('sessionAdded', handleSessionAdded);
    window.addEventListener('breakAdded', handleBreakAdded);
    window.addEventListener('settingsUpdated', handleSettings);

    return () => {
      window.removeEventListener('sessionAdded', handleSessionAdded);
      window.removeEventListener('breakAdded', handleBreakAdded);
      window.removeEventListener('settingsUpdated', handleSettings);
    };
  }, [reloadData]);

  const cards = showBreakStats
    ? [
        { title: "Temps aujourd'hui", value: formatStudyTime(todayTotal), icon: Clock, color: 'blue' },
        { title: "Pauses (aujourd'hui)", value: todayBreaks.length, icon: Target, color: 'cyan' },
        { title: 'Série de jours', value: `${stats.streak} jours`, icon: Flame, color: 'amber' },
        { title: 'Sessions totales', value: stats.sessionsCount, icon: BookOpen, color: 'purple' },
        { title: 'Cette semaine', value: formatStudyTime(weekTotal), icon: TrendingUp, color: 'green' }
      ]
    : [
        { title: "Temps aujourd'hui", value: formatStudyTime(todayTotal), icon: Clock, color: 'blue' },
        { title: 'Série de jours', value: `${stats.streak} jours`, icon: Flame, color: 'amber' },
        { title: 'Sessions totales', value: stats.sessionsCount, icon: BookOpen, color: 'purple' },
        { title: 'Cette semaine', value: formatStudyTime(weekTotal), icon: TrendingUp, color: 'green' }
      ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold font-display mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Tableau de bord
          </h1>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${showBreakStats ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-6 mb-8 animate-slide-up`}
          style={{ animationDelay: '0.1s' }}
        >
          {cards.map((c) => (
            <StatCard key={c.title} title={c.title} value={c.value} icon={c.icon} color={c.color} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Timer />
            </div>
          </div>

          <div className="space-y-6">
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <TodoList tasks={tasks} onAddTask={addTask} onToggleTask={toggleTaskComplete} onDeleteTask={removeTask} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
