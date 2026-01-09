import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import useTimer from '../hooks/useTimer';
import { useModal } from './ModalContext';
import { saveStudySession, saveBreak } from '../utils/storage';

const TimerContext = createContext();

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimerContext must be used within TimerProvider');
  }
  return context;
};

const SETTINGS_KEY = 'etudes_settings';

const DEFAULT_SETTINGS = {
  askNextSessionPopup: true,
  focusMinutes: 25,
  soundsEnabled: true,
  soundVolume: 0.5,
  soundWork: '/BRUH.mp3',
  soundBreak: '/ding.wav',
  soundDone: '/notification.mp3'
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

const playBreakSound = () => {
  const s = loadSettings();
  if (!s.soundsEnabled) return;
  try {
    const audio = new Audio('/ding.wav');
    audio.volume = Number(s.soundVolume ?? 0.5);
    audio.play().catch(() => {});
  } catch {}
};

const pad2 = (n) => String(n).padStart(2, '0');

export const TimerProvider = ({ children }) => {
  const [timerMode, setTimerMode] = useState('pomodoro');
  const [customMinutes, setCustomMinutes] = useState(50);
  const [focusMinutes, setFocusMinutes] = useState(() => loadSettings().focusMinutes);

  const { openSubjectModal } = useModal();

  const modes = useMemo(
    () => ({
      pomodoro: { minutes: focusMinutes, label: 'Focus', color: 'bg-slate-900' },
      shortBreak: { minutes: 5, label: 'Pause courte', color: 'bg-slate-900' },
      longBreak: { minutes: 10, label: 'Pause longue', color: 'bg-slate-900' },
      custom: { minutes: customMinutes, label: 'Personnalisé', color: 'bg-slate-900' }
    }),
    [focusMinutes, customMinutes]
  );

  const currentMode = modes[timerMode];

  const handleSessionComplete = useCallback((durationMinutes, subject = 'Session de travail') => {
    const dur = Number(durationMinutes || 0);
    const end = new Date();
    const start = new Date(end.getTime() - dur * 60 * 1000);

    const startTime = `${pad2(start.getHours())}:${pad2(start.getMinutes())}`;

    const newSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: start.toISOString(),
      subject,
      description: '',
      duration: dur,
      startTime,
      isExam: false
    };

    saveStudySession(newSession);
    window.dispatchEvent(new Event('sessionAdded'));
  }, []);

  const handleComplete = useCallback(
    (actualDuration) => {
      if (timerMode === 'shortBreak' || timerMode === 'longBreak') {
        saveBreak({
          date: new Date().toISOString(),
          type: timerMode,
          duration: actualDuration
        });
        window.dispatchEvent(new Event('breakAdded'));
        playBreakSound();
        return;
      }

      openSubjectModal(actualDuration, handleSessionComplete);
    },
    [timerMode, openSubjectModal, handleSessionComplete]
  );

  const timer = useTimer(currentMode.minutes, handleComplete);

  useEffect(() => {
    const syncFromSettings = () => {
      const next = loadSettings();
      const nextFocus = Number(next.focusMinutes || 25);
      setFocusMinutes(nextFocus);

      if (timerMode === 'pomodoro' && !timer.isRunning && !timer.isPaused) {
        timer.reset(nextFocus, false);
      }
    };

    syncFromSettings();
    window.addEventListener('settingsUpdated', syncFromSettings);
    return () => window.removeEventListener('settingsUpdated', syncFromSettings);
  }, [timerMode, timer.isRunning, timer.isPaused, timer.reset]);

  const handleModeChange = useCallback(
    (mode) => {
      if (timer.isRunning || timer.isPaused) {
        alert('Arrêtez le timer avant de changer de mode');
        return;
      }
      setTimerMode(mode);
      timer.reset(modes[mode].minutes, false);
    },
    [timer.isRunning, timer.isPaused, timer.reset, modes]
  );

  const adjustCustomTime = useCallback(
    (delta) => {
      if (timer.isRunning || timer.isPaused) return;
      const newMinutes = Math.max(1, Math.min(120, customMinutes + delta));
      setCustomMinutes(newMinutes);
      if (timerMode === 'custom') {
        timer.reset(newMinutes, false);
      }
    },
    [timer.isRunning, timer.isPaused, customMinutes, timerMode, timer.reset]
  );

  const handleReset = useCallback(() => {
    const minutesElapsed = timer.reset(currentMode.minutes, true);

    if (minutesElapsed > 0 && (timerMode === 'shortBreak' || timerMode === 'longBreak')) {
      saveBreak({
        date: new Date().toISOString(),
        type: timerMode,
        duration: minutesElapsed
      });
      window.dispatchEvent(new Event('breakAdded'));
      return;
    }

    if (minutesElapsed > 0 && (timerMode === 'pomodoro' || timerMode === 'custom')) {
      openSubjectModal(minutesElapsed, handleSessionComplete);
    }
  }, [timer, currentMode.minutes, timerMode, openSubjectModal, handleSessionComplete]);

  return (
    <TimerContext.Provider
      value={{
        ...timer,
        timerMode,
        customMinutes,
        focusMinutes,
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
