const STORAGE_KEYS = {
  STUDY_SESSIONS: 'studySessions',
  TASKS: 'tasks',
  SETTINGS: 'settings',
  STATS: 'stats',
  BREAKS: 'breaks'
};

export const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    return false;
  }
};

export const loadData = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
    return defaultValue;
  }
};

export const saveStudySession = (session) => {
  const sessions = loadData(STORAGE_KEYS.STUDY_SESSIONS, []);
  const safeSessions = Array.isArray(sessions) ? sessions : [];

  const cleanSession = {
    id: session?.id || `session-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    date: session?.date || new Date().toISOString(),
    subject: String(session?.subject || 'Non spécifié'),
    description: session?.description || '',
    duration: Number(session?.duration || 0),
    startTime: typeof session?.startTime === 'string' ? session.startTime : undefined,
    isExam: !!session?.isExam,

    // ✅ persiste la couleur d’examen si fournie
    examColor: typeof session?.examColor === 'string' ? session.examColor : undefined
  };

  safeSessions.push(cleanSession);
  saveData(STORAGE_KEYS.STUDY_SESSIONS, safeSessions);
  return cleanSession;
};

export const getStudySessions = () => {
  const sessions = loadData(STORAGE_KEYS.STUDY_SESSIONS, []);
  return Array.isArray(sessions) ? sessions : [];
};

export const getSessionsByDateRange = (startDate, endDate) => {
  const sessions = getStudySessions();
  return sessions.filter((session) => {
    const sessionDate = new Date(session.date);
    return sessionDate >= startDate && sessionDate <= endDate;
  });
};

export const saveBreak = (breakSession) => {
  const breaks = loadData(STORAGE_KEYS.BREAKS, []);
  const safeBreaks = Array.isArray(breaks) ? breaks : [];

  const cleanBreak = {
    id: breakSession?.id || `break-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    date: breakSession?.date || new Date().toISOString(),
    type: String(breakSession?.type || 'break'),
    duration: Number(breakSession?.duration || 0)
  };

  safeBreaks.push(cleanBreak);
  saveData(STORAGE_KEYS.BREAKS, safeBreaks);
  return cleanBreak;
};

export const getBreaks = () => {
  const breaks = loadData(STORAGE_KEYS.BREAKS, []);
  return Array.isArray(breaks) ? breaks : [];
};

export const saveTask = (task) => {
  const tasks = loadData(STORAGE_KEYS.TASKS, []);
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  safeTasks.push({
    ...task,
    id: task?.id || Date.now(),
    createdAt: task?.createdAt || new Date().toISOString(),
    completed: !!task?.completed
  });

  saveData(STORAGE_KEYS.TASKS, safeTasks);
};

export const getTasks = () => {
  const tasks = loadData(STORAGE_KEYS.TASKS, []);
  return Array.isArray(tasks) ? tasks : [];
};

export const updateTask = (taskId, updates) => {
  const tasks = getTasks();
  const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task));
  saveData(STORAGE_KEYS.TASKS, updatedTasks);
};

export const deleteTask = (taskId) => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter((task) => task.id !== taskId);
  saveData(STORAGE_KEYS.TASKS, filteredTasks);
};

export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};

export const saveLink = (link) => {
  const links = loadData('links', []);
  const safeLinks = Array.isArray(links) ? links : [];

  const clean = {
    id: link?.id || Date.now(),
    name: String(link?.name || ''),
    url: String(link?.url || '')
  };

  safeLinks.push(clean);
  saveData('links', safeLinks);
  return clean;
};

export const getLinks = () => {
  const links = loadData('links', []);
  return Array.isArray(links) ? links : [];
};

export const deleteLink = (linkId) => {
  const links = getLinks();
  const filtered = links.filter((l) => l.id !== linkId);
  saveData('links', filtered);
};

export const getSettings = () => {
  return loadData(STORAGE_KEYS.SETTINGS, { askNextSessionPopup: true });
};

export const updateSettings = (updates) => {
  const current = getSettings();
  const next = { ...current, ...updates };
  saveData(STORAGE_KEYS.SETTINGS, next);
  return next;
};

export { STORAGE_KEYS };
