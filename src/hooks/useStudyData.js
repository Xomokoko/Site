import { useState, useEffect, useCallback } from 'react';
import { saveStudySession, getStudySessions, saveTask, getTasks, updateTask as updateTaskStorage, deleteTask } from '../utils/storage';

const useStudyData = () => {
  const [sessions, setSessions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTime: 0,
    sessionsCount: 0,
    streak: 0,
    averageTime: 0
  });

  useEffect(() => {
    const loadedSessions = getStudySessions();
    const loadedTasks = getTasks();
    setSessions(loadedSessions);
    setTasks(loadedTasks);
    updateStats(loadedSessions);
  }, []);

  const updateStats = (sessionList) => {
    const totalTime = sessionList.reduce((sum, s) => sum + s.duration, 0);
    const sessionsCount = sessionList.length;
    const averageTime = sessionsCount > 0 ? Math.round(totalTime / sessionsCount) : 0;

    const uniqueDays = new Set(sessionList.map(s => new Date(s.date).toDateString()));
    const streak = uniqueDays.size;

    setStats({
      totalTime,
      sessionsCount,
      streak,
      averageTime
    });
  };

  const addSession = useCallback((sessionData) => {
    // S'assurer que subject est bien une string simple
    let subject = 'Session de travail'; // Valeur par défaut
    
    if (sessionData.subject) {
      if (typeof sessionData.subject === 'string') {
        subject = sessionData.subject;
      } else if (typeof sessionData.subject === 'object' && sessionData.subject.name) {
        subject = sessionData.subject.name;
      }
    }
    
    const newSession = {
      id: sessionData.id || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: sessionData.date || new Date().toISOString(),
      subject: subject,
      description: sessionData.description || '',
      duration: sessionData.duration || 0
    };
    
    console.log('📝 Saving session:', newSession);
    
    saveStudySession(newSession);
    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    updateStats(updatedSessions);
  }, [sessions]);

  const deleteSession = useCallback((sessionId) => {
    const allSessions = getStudySessions();
    const filtered = allSessions.filter(s => s.id !== sessionId);
    localStorage.setItem('studySessions', JSON.stringify(filtered));
    
    setSessions(filtered);
    updateStats(filtered);
  }, []);

  const addTask = useCallback((taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
      ...taskData
    };
    
    saveTask(newTask);
    setTasks([...tasks, newTask]);
  }, [tasks]);

  const toggleTaskComplete = useCallback((taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : null }
        : task
    );
    
    updatedTasks.forEach(task => updateTaskStorage(task));
    setTasks(updatedTasks);
  }, [tasks]);

  const removeTask = useCallback((taskId) => {
    deleteTask(taskId);
    setTasks(tasks.filter(task => task.id !== taskId));
  }, [tasks]);

  const getTodaySessions = () => {
    const today = new Date().toDateString();
    return sessions.filter(s => new Date(s.date).toDateString() === today);
  };

  const getWeekSessions = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessions.filter(s => new Date(s.date) >= weekAgo);
  };
  
  const addMultipleSessions = useCallback((sessionsArray) => {
    const allSessions = getStudySessions();
    const newSessions = sessionsArray.map(sessionData => {
      // S'assurer que subject est bien une string
      let subject = 'Session de travail';
      if (sessionData.subject) {
        if (typeof sessionData.subject === 'string') {
          subject = sessionData.subject;
        } else if (typeof sessionData.subject === 'object' && sessionData.subject.name) {
          subject = sessionData.subject.name;
        }
      }
      
      return {
        id: sessionData.id || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        date: sessionData.date,
        subject: subject,
        description: sessionData.description || '',
        duration: sessionData.duration || 0
      };
    });
    
    const updatedSessions = [...allSessions, ...newSessions];
    localStorage.setItem('studySessions', JSON.stringify(updatedSessions));
    
    setSessions(updatedSessions);
    updateStats(updatedSessions);
    
    return newSessions.length;
  }, []);

  return {
    sessions,
    tasks,
    stats,
    addSession,
    addMultipleSessions,
    addTask,
    toggleTaskComplete,
    removeTask,
    getTodaySessions,
    getWeekSessions,
    deleteSession
  };
};

export default useStudyData;