import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, Plus, Minus } from 'lucide-react';
import useTimer from '../hooks/useTimer';
import useNotification from '../hooks/useNotification';

const Timer = ({ onSessionComplete }) => {
  const [timerMode, setTimerMode] = useState('pomodoro');
  const [customMinutes, setCustomMinutes] = useState(50);
  const [completedDuration, setCompletedDuration] = useState(0);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showSessionTypeModal, setShowSessionTypeModal] = useState(false);
  const [sessionSubject, setSessionSubject] = useState('');
  const { notifySessionComplete, notifyBreak, notifyContinueWork, notifyTakeBreak, requestPermission } = useNotification();

  const modes = {
    pomodoro: { minutes: 25, label: 'Focus', color: 'bg-slate-900' },
    shortBreak: { minutes: 10, label: 'Pause courte', color: 'bg-slate-900' },
    longBreak: { minutes: 15, label: 'Pause longue', color: 'bg-slate-900' },
    custom: { minutes: customMinutes, label: 'Personnalisé', color: 'bg-slate-900' }
  };

  const currentMode = modes[timerMode];

  const handleComplete = (actualDuration) => {
    console.log('Timer completed with duration:', actualDuration, 'minutes');
    
    if (timerMode === 'pomodoro') {
      notifySessionComplete();
      if (onSessionComplete) {
        onSessionComplete(actualDuration, 'Session de travail');
      }
    } else if (timerMode === 'custom') {
      console.log('Setting completedDuration to:', actualDuration);
      setCompletedDuration(actualDuration);
      console.log('Opening subject modal');
      setShowSubjectModal(true);
    } else {
      notifyBreak();
    }
  };

  const handleSubjectSubmit = () => {
    if (sessionSubject.trim()) {
      if (onSessionComplete) {
        onSessionComplete(completedDuration, sessionSubject);
      }
      setShowSubjectModal(false);
      setSessionSubject('');
      setTimeout(() => {
        setShowSessionTypeModal(true);
      }, 100);
    }
  };

  const handleSessionTypeChoice = (isWorkSession) => {
    setShowSessionTypeModal(false);
    if (isWorkSession) {
      notifyContinueWork();
    } else {
      notifyTakeBreak();
      setTimerMode('shortBreak');
    }
  };

  const {
    timeLeft,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    reset,
    formatTime,
    getProgress
  } = useTimer(currentMode.minutes, handleComplete);

  const handleReset = () => {
    const minutesElapsed = reset(currentMode.minutes, true);
    
    if (minutesElapsed > 0 && (timerMode === 'pomodoro' || timerMode === 'custom')) {
      console.log('Reset timer - saving', minutesElapsed, 'minutes');
      if (onSessionComplete) {
        onSessionComplete(minutesElapsed, 'Session de travail');
      }
    }
  };

  const handleModeChange = (mode) => {
    if (isRunning || isPaused) {
      alert('Arrêtez le timer avant de changer de mode');
      return;
    }
    setTimerMode(mode);
    reset(modes[mode].minutes, false);
  };

  const adjustCustomTime = (delta) => {
    if (isRunning || isPaused) return;
    const newMinutes = Math.max(1, Math.min(120, customMinutes + delta));
    setCustomMinutes(newMinutes);
    if (timerMode === 'custom') {
      reset(newMinutes, false);
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  const progress = getProgress();
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <>
      <div className="card max-w-md mx-auto">
        <div className="text-center">
          <div className="flex gap-2 mb-8 bg-white p-2 rounded-xl">
            {Object.entries(modes).map(([key, mode]) => (
              <button
                key={key}
                onClick={() => handleModeChange(key)}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-300 ${
                  timerMode === key
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-transparent text-slate-900 hover:bg-slate-100'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {timerMode === 'custom' && !isRunning && (
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => adjustCustomTime(-1)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors"
              >
                <Minus className="w-5 h-5 text-slate-700 dark:text-white" />
              </button>
              <span className="text-lg font-semibold text-slate-700 dark:text-white">
                {customMinutes} min
              </span>
              <button
                onClick={() => adjustCustomTime(1)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors"
              >
                <Plus className="w-5 h-5 text-slate-700 dark:text-white" />
              </button>
            </div>
          )}

          <div className="relative inline-flex items-center justify-center mb-8">
            <svg className="transform -rotate-90 w-80 h-80">
              <circle
                cx="160"
                cy="160"
                r="140"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-slate-100 dark:text-slate-700"
              />
              <circle
                cx="160"
                cy="160"
                r="140"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Clock className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-2" />
              <div className="text-6xl font-bold font-display bg-gradient-to-r from-slate-700 to-slate-900 dark:from-white dark:to-slate-100 bg-clip-text text-transparent">
                {formatTime()}
              </div>
              <div className="text-slate-500 dark:text-white mt-2 text-sm font-medium">
                {isRunning ? 'En cours...' : isPaused ? 'En pause' : 'Prêt à commencer'}
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            {!isRunning && !isPaused && (
              <button
                onClick={start}
                className="btn-primary flex items-center gap-2 text-lg"
              >
                <Play className="w-5 h-5" />
                Démarrer
              </button>
            )}
            
            {isRunning && (
              <button
                onClick={pause}
                className="btn-secondary flex items-center gap-2 text-lg"
              >
                <Pause className="w-5 h-5" />
                Pause
              </button>
            )}
            
            {isPaused && (
              <button
                onClick={resume}
                className="btn-primary flex items-center gap-2 text-lg"
              >
                <Play className="w-5 h-5" />
                Reprendre
              </button>
            )}
            
            <button
              onClick={handleReset}
              className="btn-secondary flex items-center gap-2 text-lg"
            >
              <RotateCcw className="w-5 h-5" />
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Modal pour demander la matière (session personnalisée) */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card max-w-md w-full animate-slide-up">
            <h3 className="text-2xl font-bold font-display mb-4 text-slate-800 dark:text-white text-center">
              Session terminée !
            </h3>
            {completedDuration > 0 && (
              <p className="text-slate-600 dark:text-slate-300 mb-2 text-center">
                Durée : <span className="font-semibold">{completedDuration} minute{completedDuration > 1 ? 's' : ''}</span>
              </p>
            )}
            <p className="text-slate-600 dark:text-slate-300 mb-6 text-center">
              Quelle matière avez-vous étudiée ?
            </p>

            <div className="space-y-4">
              <input
                type="text"
                value={sessionSubject}
                onChange={(e) => setSessionSubject(e.target.value)}
                placeholder="Ex: Mathématiques, Programmation..."
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubjectSubmit();
                  }
                }}
              />

              <button
                onClick={handleSubjectSubmit}
                disabled={!sessionSubject.trim()}
                className="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour demander le type de prochaine session */}
      {showSessionTypeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card max-w-md w-full animate-slide-up">
            <h3 className="text-2xl font-bold font-display mb-4 text-slate-800 dark:text-white text-center">
              Que voulez-vous faire maintenant ?
            </h3>

            <div className="flex gap-4">
              <button
                onClick={() => handleSessionTypeChoice(true)}
                className="flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl"
              >
                Continuer à travailler
              </button>
              <button
                onClick={() => handleSessionTypeChoice(false)}
                className="flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl"
              >
                Prendre une pause
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Timer;