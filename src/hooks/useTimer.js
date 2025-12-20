import { useState, useEffect, useRef, useCallback } from 'react';

const useTimer = (initialMinutes = 25, onComplete = null) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
    startTimeRef.current = Date.now();
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
    setIsRunning(true);
  }, []);

  const reset = useCallback((minutes = initialMinutes) => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(minutes * 60);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [initialMinutes]);

  const addTime = useCallback((minutes) => {
    setTimeLeft(prev => prev + (minutes * 60));
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            if (onComplete) {
              onComplete();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, onComplete]);

  // Formater le temps pour l'affichage
  const formatTime = useCallback(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  const getProgress = useCallback(() => {
    const total = initialMinutes * 60;
    return ((total - timeLeft) / total) * 100;
  }, [timeLeft, initialMinutes]);

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
    minutes: Math.floor(timeLeft / 60),
    seconds: timeLeft % 60
  };
};

export default useTimer;