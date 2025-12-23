import { createContext, useContext } from 'react';
import { useState, useEffect } from 'react';
import useTimer from '../hooks/useTimer';
import { useModal } from './ModalContext';
import { saveStudySession } from '../utils/storage';

const TimerContext = createContext();

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimerContext must be used within TimerProvider');
  }
  return context;
};

export const TimerProvider = ({ children }) => {
  const [timerMode, setTimerMode] = useState('pomodoro');
  const [customMinutes, setCustomMinutes] = useState(50);
  const { openSubjectModal } = useModal();

  const modes = {
    pomodoro: { minutes: 25, label: 'Focus', color: 'bg-slate-900' },
    shortBreak: { minutes: 5, label: 'Pause courte', color: 'bg-slate-900' },
    longBreak: { minutes: 1, label: 'Pause longue', color: 'bg-slate-900' },
    custom: { minutes: customMinutes, label: 'Personnalisé', color: 'bg-slate-900' }
  };

  const currentMode = modes[timerMode];

  const handleSessionComplete = (duration, subject = 'Session de travail') => {
    console.log('TimerContext: Saving session', duration, 'minutes, subject:', subject);
    const newSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
      subject: subject,
      description: '',
      duration: duration
    };
    saveStudySession(newSession);
    
    // Déclencher un événement pour que le Dashboard se mette à jour
    window.dispatchEvent(new Event('sessionAdded'));
    
    // Note: Le ModalContext ouvre automatiquement le deuxième modal dans handleSubjectSubmit
  };

  const handleComplete = (actualDuration) => {
    console.log('Timer completed with duration:', actualDuration, 'minutes, mode:', timerMode);
    
    // Pour les pauses, jouer le son ding.wav
    if (timerMode === 'shortBreak' || timerMode === 'longBreak') {
      console.log('Break timer completed - playing ding.wav');
      try {
        const audio = new Audio('/ding.wav');
        audio.play().catch(err => console.log('Erreur lecture audio:', err));
      } catch (err) {
        console.log('Erreur création audio:', err);
      }
      return;
    }
    
    // Pour tous les autres modes (pomodoro et custom), on affiche le modal
    console.log('Work timer completed - showing subject modal');
    openSubjectModal(actualDuration, handleSessionComplete);
  };

  const timer = useTimer(currentMode.minutes, handleComplete);

  const handleModeChange = (mode) => {
    if (timer.isRunning || timer.isPaused) {
      alert('Arrêtez le timer avant de changer de mode');
      return;
    }
    setTimerMode(mode);
    timer.reset(modes[mode].minutes, false);
  };

  const adjustCustomTime = (delta) => {
    if (timer.isRunning || timer.isPaused) return;
    const newMinutes = Math.max(1, Math.min(120, customMinutes + delta));
    setCustomMinutes(newMinutes);
    if (timerMode === 'custom') {
      timer.reset(newMinutes, false);
    }
  };

  const handleReset = () => {
    const minutesElapsed = timer.reset(currentMode.minutes, true);
    
    if (minutesElapsed > 0 && (timerMode === 'pomodoro' || timerMode === 'custom')) {
      console.log('Reset timer - saving', minutesElapsed, 'minutes');
      handleSessionComplete(minutesElapsed, 'Session de travail');
    }
  };

  return (
    <TimerContext.Provider 
      value={{
        ...timer,
        timerMode,
        customMinutes,
        modes,
        currentMode,
        handleModeChange,
        adjustCustomTime,
        handleReset
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};