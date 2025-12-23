import { useState, useEffect } from 'react';
import { Clock, Flame, BookOpen, Target, TrendingUp } from 'lucide-react';
import Timer from '../components/Timer';
import StatCard from '../components/StatCard';
import TodoList from '../components/TodoList';
import StudySession from '../components/StudySession';
import useStudyData from '../hooks/useStudyData';
import { formatDuration } from '../utils/dateHelpers';

const Dashboard = () => {
  const {
    sessions,
    tasks,
    stats,
    addSession,
    addTask,
    toggleTaskComplete,
    removeTask,
    getTodaySessions,
    getWeekSessions
  } = useStudyData();

  const todaySessions = getTodaySessions();
  const weekSessions = getWeekSessions();
  const todayTotal = todaySessions.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold font-display mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Tableau de bord
          </h1>
          <p className="text-slate-600 dark:text-white">
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <StatCard
            title="Temps aujourd'hui"
            value={formatDuration(todayTotal)}
            icon={Clock}
            color="blue"
          />
          <StatCard
            title="Série de jours"
            value={`${stats.streak} jours`}
            icon={Flame}
            color="amber"
          />
          <StatCard
            title="Sessions totales"
            value={stats.sessionsCount}
            icon={BookOpen}
            color="purple"
          />
          <StatCard
            title="Cette semaine"
            value={formatDuration(weekSessions.reduce((sum, s) => sum + s.duration, 0))}
            icon={TrendingUp}
            color="green"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Timer />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Todo List */}
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <TodoList
                tasks={tasks}
                onAddTask={addTask}
                onToggleTask={toggleTaskComplete}
                onDeleteTask={removeTask}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;