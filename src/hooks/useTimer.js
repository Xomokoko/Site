import { useState, useEffect, useRef, useCallback } from 'react';

const TIMER_STORAGE_KEY = 'studyTimerState';

const useTimer = (initialMinutes = 25, onComplete = null) => {
  const onCompleteRef = useRef(onComplete);
  const hasRestoredRef = useRef(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const hasCalledCompleteRef = useRef(false); // Pour éviter les doublons

  // Charger l'état sauvegardé une seule fois
  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem(TIMER_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading timer:', e);
    }
    return null;
  };

  const savedState = loadSavedState();

  // Initialiser avec l'état sauvegardé OU les valeurs par défaut
  const [timeLeft, setTimeLeft] = useState(
    savedState?.timeLeft ?? initialMinutes * 60
  );
  const [isRunning, setIsRunning] = useState(savedState?.isRunning ?? false);
  const [isPaused, setIsPaused] = useState(savedState?.isPaused ?? false);
  const [elapsedTime, setElapsedTime] = useState(savedState?.elapsedTime ?? 0);
  const [currentInitialMinutes, setCurrentInitialMinutes] = useState(
    savedState?.initialMinutes ?? initialMinutes
  );

  // Mettre à jour onCompleteRef
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Sauvegarder l'état
  const saveState = useCallback(() => {
    try {
      const state = {
        timeLeft,
        isRunning,
        isPaused,
        elapsedTime,
        startTimestamp: startTimeRef.current,
        initialMinutes: currentInitialMinutes
      };
      localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state));
      console.log('💾 Timer state saved:', state);
    } catch (e) {
      console.error('Error saving timer:', e);
    }
  }, [timeLeft, isRunning, isPaused, elapsedTime, currentInitialMinutes]);

  // Sauvegarder à chaque changement
  useEffect(() => {
    if (hasRestoredRef.current) {
      saveState();
    }
  }, [saveState]);

  // Restaurer le timer au montage
  useEffect(() => {
    if (hasRestoredRef.current) return;
    hasRestoredRef.current = true;

    if (savedState && savedState.isRunning && savedState.startTimestamp) {
      const now = Date.now();
      const elapsed = Math.floor((now - savedState.startTimestamp) / 1000);
      const newTimeLeft = Math.max(0, savedState.timeLeft - elapsed);

      console.log('🔄 Restoring timer:', {
        savedTimeLeft: savedState.timeLeft,
        elapsed,
        newTimeLeft
      });

      if (newTimeLeft === 0) {
        // Timer terminé pendant l'absence
        setIsRunning(false);
        setTimeLeft(0);
        const totalElapsed = savedState.elapsedTime + elapsed;
        
        if (onCompleteRef.current && !hasCalledCompleteRef.current) {
          hasCalledCompleteRef.current = true;
          setTimeout(() => {
            onCompleteRef.current(Math.ceil(totalElapsed / 60));
          }, 100);
        }
        localStorage.removeItem(TIMER_STORAGE_KEY);
      } else {
        // Continuer le timer
        setTimeLeft(newTimeLeft);
        setIsRunning(true);
        startTimeRef.current = now;
      }
    } else if (savedState && savedState.isPaused) {
      console.log('🔄 Restoring paused timer:', savedState.timeLeft);
      setTimeLeft(savedState.timeLeft);
      setIsPaused(true);
      setElapsedTime(savedState.elapsedTime);
    }
  }, []);

  const start = useCallback(() => {
    console.log('▶️ Starting timer');
    setIsRunning(true);
    setIsPaused(false);
    startTimeRef.current = Date.now();
    hasCalledCompleteRef.current = false; // Reset le flag au démarrage
  }, []);

  const pause = useCallback(() => {
    console.log('⏸️ Pausing timer');
    if (startTimeRef.current) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsedTime(prev => prev + elapsed);
    }
    setIsPaused(true);
    setIsRunning(false);
    startTimeRef.current = null;
  }, []);

  const resume = useCallback(() => {
    console.log('▶️ Resuming timer');
    setIsPaused(false);
    setIsRunning(true);
    startTimeRef.current = Date.now();
  }, []);

  const reset = useCallback((minutes = initialMinutes, saveProgress = false) => {
    console.log('🔄 Resetting timer to', minutes, 'min');
    
    let minutesElapsed = 0;
    if (saveProgress) {
      let totalElapsed = elapsedTime;
      if (startTimeRef.current) {
        totalElapsed += Math.floor((Date.now() - startTimeRef.current) / 1000);
      }
      minutesElapsed = Math.ceil(totalElapsed / 60);
    }

    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(minutes * 60);
    setElapsedTime(0);
    setCurrentInitialMinutes(minutes);
    startTimeRef.current = null;
    hasCalledCompleteRef.current = false; // Reset le flag

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    localStorage.removeItem(TIMER_STORAGE_KEY);
    return minutesElapsed;
  }, [elapsedTime, initialMinutes]);

  const addTime = useCallback((minutes) => {
    setTimeLeft(prev => prev + (minutes * 60));
  }, []);

  // Gérer le compte à rebours
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        // Calculer le temps réel écoulé depuis le début
        if (startTimeRef.current) {
          const now = Date.now();
          const elapsed = Math.floor((now - startTimeRef.current) / 1000);
          const newTimeLeft = Math.max(0, (currentInitialMinutes * 60) - elapsed - elapsedTime);
          
          setTimeLeft(newTimeLeft);
          
          // Timer terminé
          if (newTimeLeft === 0) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsRunning(false);

            // Calculer la durée totale
            const totalElapsed = elapsedTime + elapsed;
            const minutesWorked = Math.ceil(totalElapsed / 60);

            console.log('✅ Timer completed - reporting', minutesWorked, 'minutes');
            startTimeRef.current = null;

            if (onCompleteRef.current && !hasCalledCompleteRef.current) {
              hasCalledCompleteRef.current = true;
              setTimeout(() => {
                onCompleteRef.current(minutesWorked);
              }, 0);
            }

            localStorage.removeItem(TIMER_STORAGE_KEY);
          }
        }
      }, 100); // Vérifier toutes les 100ms pour plus de précision
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, elapsedTime, currentInitialMinutes]);

  const formatTime = useCallback(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  const getProgress = useCallback(() => {
    const total = currentInitialMinutes * 60;
    if (total === 0) return 0;
    return ((total - timeLeft) / total) * 100;
  }, [timeLeft, currentInitialMinutes]);

  const getElapsedMinutes = useCallback(() => {
    let total = elapsedTime;
    if (isRunning && startTimeRef.current) {
      total += Math.floor((Date.now() - startTimeRef.current) / 1000);
    }
    return Math.ceil(total / 60);
  }, [elapsedTime, isRunning]);

  return {
    timeLeft,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    reset,
    addTime,
    formatTime,
    getProgress,
    getElapsedMinutes,
    minutes: Math.floor(timeLeft / 60),
    seconds: timeLeft % 60
  };
};

export default useTimer;