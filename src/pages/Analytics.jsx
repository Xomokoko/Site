import { useState, useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Clock, BookOpen, Calendar, Award, TrendingUp } from 'lucide-react';
import useStudyData from '../hooks/useStudyData';
import StatCard from '../components/StatCard';
import { formatDuration } from '../utils/dateHelpers';
import { calculateTimeBySubject, getTopSubjects } from '../utils/calculations';

const Analytics = () => {
  const { sessions } = useStudyData();
  const [timeRange, setTimeRange] = useState('week');

  const filteredSessions = useMemo(() => {
    const now = new Date();
    const filterDate = new Date();
    
    if (timeRange === 'week') {
      filterDate.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      filterDate.setDate(now.getDate() - 30);
    } else {
      return sessions;
    }
    
    return sessions.filter(s => new Date(s.date) >= filterDate);
  }, [sessions, timeRange]);

  const totalTime = filteredSessions.reduce((sum, s) => sum + s.duration, 0);
  const avgTime = filteredSessions.length > 0 ? Math.round(totalTime / filteredSessions.length) : 0;
  
  const uniqueDays = new Set(filteredSessions.map(s => new Date(s.date).toDateString()));
  const streak = uniqueDays.size;

  const timeBySubject = useMemo(() => calculateTimeBySubject(filteredSessions), [filteredSessions]);
  const topSubjects = useMemo(() => getTopSubjects(filteredSessions, 3), [filteredSessions]);

  const pieData = Object.entries(timeBySubject).map(([subject, time]) => ({
    name: subject,
    value: time,
    percentage: ((time / totalTime) * 100).toFixed(1)
  }));

  const barData = Object.entries(timeBySubject).map(([subject, time]) => ({
    subject,
    temps: time
  }));

  const dayData = useMemo(() => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const timeByDay = Array(7).fill(0);
    
    filteredSessions.forEach(session => {
      const day = new Date(session.date).getDay();
      const adjustedDay = day === 0 ? 6 : day - 1;
      timeByDay[adjustedDay] += session.duration;
    });
    
    return days.map((day, index) => ({
      day,
      temps: timeByDay[index]
    }));
  }, [filteredSessions]);

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold font-display mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Analyses & Statistiques
          </h1>

        </div>

        <div className="flex justify-center mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex gap-3 bg-white dark:bg-white p-2 rounded-xl">
            {[
              { value: 'week', label: '7 derniers jours' },
              { value: 'month', label: '30 derniers jours' },
              { value: 'all', label: 'Tout le temps' }
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTimeRange(value)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  timeRange === value
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'bg-transparent text-slate-900 hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <StatCard
            title="Temps total"
            value={formatDuration(totalTime)}
            icon={Clock}
            color="blue"
          />
          <StatCard
            title="Nombre de sessions"
            value={filteredSessions.length}
            icon={BookOpen}
            color="purple"
          />
          <StatCard
            title="Durée moyenne"
            value={formatDuration(avgTime)}
            icon={Calendar}
            color="green"
          />
          <StatCard
            title="Record de série"
            value={`${streak} jours`}
            icon={Award}
            color="amber"
          />
        </div>

        {filteredSessions.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              Aucune donnée disponible pour cette période
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <h2 className="text-2xl font-bold font-display mb-6 text-slate-800 dark:text-white">
                Répartition par matière
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="card animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-2xl font-bold font-display mb-6 text-slate-800 dark:text-white">
                Temps par matière
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} min`} />
                  <Bar dataKey="temps" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <h2 className="text-2xl font-bold font-display mb-6 text-slate-800 dark:text-white">
                Temps par jour de la semaine
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dayData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} min`} />
                  <Bar dataKey="temps" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <h2 className="text-2xl font-bold font-display mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                Top 3 Matières
              </h2>
              <div className="space-y-4">
                {topSubjects.map((subject, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-white ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                      index === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-600' :
                      'bg-gradient-to-br from-amber-600 to-amber-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800 dark:text-white">{subject.subject}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        {formatDuration(subject.time)} • {subject.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;