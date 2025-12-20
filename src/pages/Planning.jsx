import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import useStudyData from '../hooks/useStudyData';
import { formatDate, getWeekDays, FULL_DAYS } from '../utils/dateHelpers';
import PlanningWizard from '../components/PlanningWizard';
import { generatePlanning } from '../utils/planningGenerator';

const Planning = () => {
  const { sessions, addSession, deleteSession, addMultipleSessions } = useStudyData();
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [newSession, setNewSession] = useState({ subject: '', duration: 60, startTime: '09:00' });
  const [showWizard, setShowWizard] = useState(false);

  const weekDays = getWeekDays(currentWeekStart);
  const today = new Date();
  const hours = [6, 12, 18, 24];

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
      startTime: `${hour.toString().padStart(2, '0')}:00` 
    });
    setShowAddModal(true);
  };

  const handleSaveEvent = () => {
    if (newSession.subject.trim() && selectedDate) {
      const sessionDate = new Date(selectedDate);
      const [hours, minutes] = newSession.startTime.split(':');
      sessionDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      addSession({
        subject: newSession.subject,
        duration: parseInt(newSession.duration),
        date: sessionDate.toISOString(),
        startTime: newSession.startTime,
        description: 'Session planifiée'
      });
      setNewSession({ subject: '', duration: 60, startTime: '09:00' });
      setShowAddModal(false);
    }
  };

  const handleDeleteSession = (sessionId) => {
    deleteSession(sessionId);
  };

  const handleGeneratePlanning = (formData) => {
    const generatedSessions = generatePlanning(formData);
    
    if (generatedSessions.length === 0) {
      return;
    }
    
    addMultipleSessions(generatedSessions);
  };

  const getSessionsForDayAndHour = (day, hour) => {
    return sessions.filter(s => {
      const sessionDate = new Date(s.date);
      const sessionHour = sessionDate.getHours();
      return isSameDay(sessionDate, day) && sessionHour >= hour && sessionHour < (hour === 24 ? 24 : hours[hours.indexOf(hour) + 1] || 24);
    });
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
          <button
            onClick={() => setShowWizard(true)}
            className="btn-primary flex items-center gap-2"
          >
            Générer un planning
          </button>
        </div>

        <div className="card mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-6">
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
              <button
                onClick={goToToday}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1"
              >
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

          {/* Vue horaire */}
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* En-têtes des jours */}
              <div className="grid grid-cols-8 gap-2 mb-4">
                <div className="text-center font-semibold text-slate-600 dark:text-slate-300">
                  Heure
                </div>
                {weekDays.map((day, index) => {
                  const isToday = isSameDay(day, today);
                  return (
                    <div
                      key={index}
                      className={`text-center p-3 rounded-lg ${
                        isToday
                          ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                          : 'bg-slate-50 dark:bg-slate-800'
                      }`}
                    >
                      <div className={`text-sm font-semibold uppercase tracking-wider ${
                        isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-200'
                      }`}>
                        {FULL_DAYS[index].slice(0, 3)}
                      </div>
                      <div className={`text-2xl font-bold font-display mt-1 ${
                        isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-white'
                      }`}>
                        {day.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Grille horaire */}
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-8 gap-2 mb-2">
                  {/* Colonne heure */}
                  <div className="flex items-center justify-center font-semibold text-slate-600 dark:text-slate-300">
                    {hour}h
                  </div>

                  {/* Colonnes jours */}
                  {weekDays.map((day, dayIndex) => {
                    const daySessions = getSessionsForDayAndHour(day, hour);
                    const isToday = isSameDay(day, today);

                    return (
                      <div
                        key={dayIndex}
                        className={`min-h-[100px] p-2 rounded-lg border-2 transition-all ${
                          isToday
                            ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-slate-800'
                            : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800'
                        }`}
                      >
                        {/* Sessions pour ce créneau */}
                        <div className="space-y-2 mb-2">
                          {daySessions.map(session => (
                            <div
                              key={session.id}
                              className="group relative p-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-l-4 border-blue-500"
                            >
                              <div className="flex items-start justify-between gap-1">
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-xs text-slate-800 dark:text-blue-300 mb-1 truncate">
                                    {session.subject}
                                  </div>
                                  <div className="text-xs text-slate-600 dark:text-blue-400">
                                    {session.duration}min
                                  </div>
                                  {session.startTime && (
                                    <div className="text-xs text-slate-500 dark:text-blue-500">
                                      {session.startTime}
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleDeleteSession(session.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-all p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Bouton ajouter */}
                        <button
                          onClick={() => handleAddEvent(day, hour)}
                          className="w-full py-1.5 px-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-500 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-600 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-all text-xs flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          +
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
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
                    placeholder="Ex: Mathématiques"
                    className="input-field"
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
                    Durée (minutes) *
                  </label>
                  <select
                    value={newSession.duration}
                    onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
                    className="input-field"
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">1 heure</option>
                    <option value="90">1h30</option>
                    <option value="120">2 heures</option>
                    <option value="180">3 heures</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button onClick={handleSaveEvent} className="btn-primary flex-1">
                    Ajouter
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setNewSession({ subject: '', duration: 60, startTime: '09:00' });
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

        {showWizard && (
          <PlanningWizard
            onClose={() => setShowWizard(false)}
            onGenerate={handleGeneratePlanning}
          />
        )}
      </div>
    </div>
  );
};

export default Planning;