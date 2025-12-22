import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, Plus, Minus } from 'lucide-react';
import useTimer from '../hooks/useTimer';

const Timer = ({ onSessionComplete, onTimerComplete }) => {
  const [timerMode, setTimerMode] = useState('pomodoro');
  const [customMinutes, setCustomMinutes] = useState(1);

  const modes = {
    pomodoro: { minutes: 25, label: 'Focus', color: 'bg-slate-900' },
    shortBreak: { minutes: 10, label: 'Pause courte', color: 'bg-slate-900' },
    longBreak: { minutes: 15, label: 'Pause longue', color: 'bg-slate-900' },
    custom: { minutes: customMinutes, label: 'Personnalisé', color: 'bg-slate-900' }
  };

  const currentMode = modes[timerMode];

  const handleComplete = (actualDuration) => {
    console.log('Timer completed with duration:', actualDuration, 'minutes, mode:', timerMode);
    
    // Pour les pauses, on ne fait rien
    if (timerMode === 'shortBreak' || timerMode === 'longBreak') {
      console.log('Break timer completed');
      return;
    }
    
    // Pour tous les autres modes (pomodoro et custom), on affiche le modal
    console.log('Work timer completed - showing subject modal');
    if (onTimerComplete) {
      onTimerComplete(actualDuration);
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

  const progress = getProgress();
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
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
  );
};

export default Timer;