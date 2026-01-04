import { useState, useEffect, useRef, useCallback } from 'react';

const TIMER_STORAGE_KEY = 'studyTimerState';

const useTimer = (initialMinutes = 25, onComplete = null) => {
  const onCompleteRef = useRef(onComplete);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const startFromRef = useRef(null);
  const hasRestoredRef = useRef(false);
  const hasCalledCompleteRef = useRef(false);

  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem(TIMER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const savedState = loadSavedState();

  const [currentInitialMinutes, setCurrentInitialMinutes] = useState(
    savedState?.initialMinutes ?? initialMinutes
  );
  const [timeLeft, setTimeLeft] = useState(
    savedState?.timeLeft ?? initialMinutes * 60
  );
  const [isRunning, setIsRunning] = useState(savedState?.isRunning ?? false);
  const [isPaused, setIsPaused] = useState(savedState?.isPaused ?? false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const saveState = useCallback(() => {
    try {
      localStorage.setItem(
        TIMER_STORAGE_KEY,
        JSON.stringify({
          timeLeft,
          isRunning,
          isPaused,
          startTimestamp: startTimeRef.current,
          startFrom: startFromRef.current,
          initialMinutes: currentInitialMinutes
        })
      );
    } catch {}
  }, [timeLeft, isRunning, isPaused, currentInitialMinutes]);

  useEffect(() => {
    if (hasRestoredRef.current) saveState();
  }, [saveState]);

  useEffect(() => {
    if (hasRestoredRef.current) return;
    hasRestoredRef.current = true;

    if (savedState?.isRunning && savedState.startTimestamp) {
      const elapsed = Math.floor((Date.now() - savedState.startTimestamp) / 1000);
      const base =
        typeof savedState.startFrom === 'number'
          ? savedState.startFrom
          : savedState.timeLeft;
      const newTimeLeft = Math.max(0, base - elapsed);

      if (newTimeLeft === 0) {
        setIsRunning(false);
        setIsPaused(false);
        setTimeLeft(currentInitialMinutes * 60);

        if (onCompleteRef.current && !hasCalledCompleteRef.current) {
          hasCalledCompleteRef.current = true;
          setTimeout(() => {
            onCompleteRef.current(currentInitialMinutes);
          }, 0);
        }

        startTimeRef.current = null;
        startFromRef.current = null;
        localStorage.removeItem(TIMER_STORAGE_KEY);
      } else {
        setTimeLeft(newTimeLeft);
        setIsRunning(true);
        setIsPaused(false);
        startFromRef.current = newTimeLeft;
        startTimeRef.current = Date.now();
      }
      return;
    }

    if (savedState?.isPaused) {
      setTimeLeft(savedState.timeLeft);
      setIsRunning(false);
      setIsPaused(true);
      startFromRef.current = savedState.timeLeft;
      startTimeRef.current = null;
    }
  }, [currentInitialMinutes, savedState]);

  const start = useCallback(() => {
    const base = timeLeft <= 0 ? currentInitialMinutes * 60 : timeLeft;
    setTimeLeft(base);
    setIsRunning(true);
    setIsPaused(false);
    startFromRef.current = base;
    startTimeRef.current = Date.now();
    hasCalledCompleteRef.current = false;
  }, [timeLeft, currentInitialMinutes]);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    startFromRef.current = timeLeft;
    startTimeRef.current = null;
    setIsRunning(false);
    setIsPaused(true);
  }, [timeLeft]);

  const resume = useCallback(() => {
    startFromRef.current = timeLeft;
    startTimeRef.current = Date.now();
    setIsPaused(false);
    setIsRunning(true);
  }, [timeLeft]);

  const reset = useCallback(
    (minutes = initialMinutes, saveProgress = false) => {
      let minutesElapsed = 0;

      if (saveProgress) {
        const studiedSeconds = currentInitialMinutes * 60 - timeLeft;
        minutesElapsed = Math.ceil(Math.max(0, studiedSeconds) / 60);
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setIsRunning(false);
      setIsPaused(false);
      setTimeLeft(minutes * 60);
      setCurrentInitialMinutes(minutes);

      startTimeRef.current = null;
      startFromRef.current = null;
      hasCalledCompleteRef.current = false;

      localStorage.removeItem(TIMER_STORAGE_KEY);
      return minutesElapsed;
    },
    [initialMinutes, currentInitialMinutes, timeLeft]
  );

  const addTime = useCallback(
    (minutes) => {
      setTimeLeft((prev) => prev + minutes * 60);
      if (isRunning) {
        startFromRef.current = (startFromRef.current ?? timeLeft) + minutes * 60;
      }
    },
    [isRunning, timeLeft]
  );

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    if (!startTimeRef.current) startTimeRef.current = Date.now();
    if (startFromRef.current == null) startFromRef.current = timeLeft;

    intervalRef.current = setInterval(() => {
      if (!startTimeRef.current) return;

      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const base = startFromRef.current ?? timeLeft;
      const newTimeLeft = Math.max(0, base - elapsed);

      setTimeLeft(newTimeLeft);

      if (newTimeLeft === 0) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;

        setIsRunning(false);
        setIsPaused(false);

        startTimeRef.current = null;
        startFromRef.current = null;

        setTimeLeft(currentInitialMinutes * 60);

        if (onCompleteRef.current && !hasCalledCompleteRef.current) {
          hasCalledCompleteRef.current = true;
          setTimeout(() => {
            onCompleteRef.current(currentInitialMinutes);
          }, 0);
        }

        localStorage.removeItem(TIMER_STORAGE_KEY);
      }
    }, 250);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeLeft, currentInitialMinutes]);

  const formatTime = useCallback(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }, [timeLeft]);

  const getProgress = useCallback(() => {
    const total = currentInitialMinutes * 60;
    return total === 0 ? 0 : ((total - timeLeft) / total) * 100;
  }, [timeLeft, currentInitialMinutes]);

  const getElapsedMinutes = useCallback(() => {
    const studiedSeconds = currentInitialMinutes * 60 - timeLeft;
    return Math.ceil(Math.max(0, studiedSeconds) / 60);
  }, [timeLeft, currentInitialMinutes]);

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
