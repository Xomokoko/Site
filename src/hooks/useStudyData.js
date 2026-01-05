import { useState, useEffect, useCallback } from 'react';
import {
  saveStudySession,
  getStudySessions,
  saveTask,
  getTasks,
  updateTask as updateTaskStorage,
  deleteTask,
  getBreaks
} from '../utils/storage';

const useStudyData = () => {
  const [sessions, setSessions] = useState([]);
  const [breaks, setBreaks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTime: 0,
    sessionsCount: 0,
    streak: 0,
    averageTime: 0,
    breaksCount: 0,
    breaksTime: 0
  });

  const updateStats = useCallback((sessionList, breakList) => {
    const totalTime = sessionList.reduce((sum, s) => sum + (s.duration || 0), 0);
    const sessionsCount = sessionList.length;
    const averageTime = sessionsCount > 0 ? Math.round(totalTime / sessionsCount) : 0;

    const uniqueDays = new Set(sessionList.map((s) => new Date(s.date).toDateString()));
    const streak = uniqueDays.size;

    const breaksCount = (breakList || []).length;
    const breaksTime = (breakList || []).reduce((sum, b) => sum + (b.duration || 0), 0);

    setStats({ totalTime, sessionsCount, streak, averageTime, breaksCount, breaksTime });
  }, []);

  useEffect(() => {
    const loadedSessions = getStudySessions();
    const loadedTasks = getTasks();
    const loadedBreaks = getBreaks();

    setSessions(loadedSessions);
    setTasks(loadedTasks);
    setBreaks(loadedBreaks);
    updateStats(loadedSessions, loadedBreaks);
  }, [updateStats]);

  const reloadData = useCallback(() => {
    const loadedSessions = getStudySessions();
    const loadedTasks = getTasks();
    const loadedBreaks = getBreaks();

    setSessions(loadedSessions);
    setTasks(loadedTasks);
    setBreaks(loadedBreaks);
    updateStats(loadedSessions, loadedBreaks);
  }, [updateStats]);

  const addSession = useCallback((sessionData) => {
    let subject = 'Session de travail';
    if (sessionData?.subject) {
      if (typeof sessionData.subject === 'string') subject = sessionData.subject;
      else if (typeof sessionData.subject === 'object' && sessionData.subject.name) subject = sessionData.subject.name;
    }

    const newSession = {
      id: sessionData.id || `session-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      date: sessionData.date || new Date().toISOString(),
      subject,
      description: sessionData.description || '',
      duration: Number(sessionData.duration || 0),
      startTime: sessionData.startTime
    };

    saveStudySession(newSession);
    const updated = [...sessions, newSession];
    setSessions(updated);

    const currentBreaks = getBreaks();
    setBreaks(currentBreaks);
    updateStats(updated, currentBreaks);
  }, [sessions, updateStats]);

  const addMultipleSessions = useCallback((sessionsArray) => {
    const all = getStudySessions();

    const newSessions = (sessionsArray || []).map((s) => {
      let subject = 'Session de travail';
      if (s?.subject) {
        if (typeof s.subject === 'string') subject = s.subject;
        else if (typeof s.subject === 'object' && s.subject.name) subject = s.subject.name;
      }

      return {
        id: s.id || `session-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        date: s.date || new Date().toISOString(),
        subject,
        description: s.description || '',
        duration: Number(s.duration || 0),
        startTime: s.startTime
      };
    });

    const updated = [...all, ...newSessions];
    localStorage.setItem('studySessions', JSON.stringify(updated));
    setSessions(updated);

    const currentBreaks = getBreaks();
    setBreaks(currentBreaks);
    updateStats(updated, currentBreaks);

    return newSessions.length;
  }, [updateStats]);

  const deleteSession = useCallback((sessionId) => {
    const all = getStudySessions();
    const filtered = all.filter((s) => s.id !== sessionId);
    localStorage.setItem('studySessions', JSON.stringify(filtered));
    setSessions(filtered);

    const currentBreaks = getBreaks();
    setBreaks(currentBreaks);
    updateStats(filtered, currentBreaks);
  }, [updateStats]);

  const addTask = useCallback((taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
      ...taskData
    };
    saveTask(newTask);
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const toggleTaskComplete = useCallback((taskId) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === taskId
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : null }
          : t
      );
      updated.forEach((t) => updateTaskStorage(t.id, t));
      return updated;
    });
  }, []);

  const removeTask = useCallback((taskId) => {
    deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const getTodaySessions = useCallback(() => {
    const today = new Date().toDateString();
    return sessions.filter((s) => new Date(s.date).toDateString() === today);
  }, [sessions]);

  const getWeekSessions = useCallback(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessions.filter((s) => new Date(s.date) >= weekAgo);
  }, [sessions]);

  const getTodayBreaks = useCallback(() => {
    const today = new Date().toDateString();
    return breaks.filter((b) => new Date(b.date).toDateString() === today);
  }, [breaks]);

  const getWeekBreaks = useCallback(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return breaks.filter((b) => new Date(b.date) >= weekAgo);
  }, [breaks]);

  return {
    sessions,
    breaks,
    tasks,
    stats,
    addSession,
    addMultipleSessions,
    deleteSession,
    addTask,
    toggleTaskComplete,
    removeTask,
    getTodaySessions,
    getWeekSessions,
    getTodayBreaks,
    getWeekBreaks,
    reloadData
  };
};

export default useStudyData;
