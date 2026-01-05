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

  const cleanSession = {
    id: session.id || Date.now(),
    date: session.date || new Date().toISOString(),
    subject: String(session.subject || 'Non spécifié'),
    description: session.description || '',
    duration: Number(session.duration || 0)
  };

  sessions.push(cleanSession);
  saveData(STORAGE_KEYS.STUDY_SESSIONS, sessions);
  return cleanSession;
};

export const getStudySessions = () => {
  return loadData(STORAGE_KEYS.STUDY_SESSIONS, []);
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

  const cleanBreak = {
    id: breakSession.id || `break-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    date: breakSession.date || new Date().toISOString(),
    type: String(breakSession.type || 'break'),
    duration: Number(breakSession.duration || 0)
  };

  breaks.push(cleanBreak);
  saveData(STORAGE_KEYS.BREAKS, breaks);
  return cleanBreak;
};

export const getBreaks = () => {
  return loadData(STORAGE_KEYS.BREAKS, []);
};

export const saveTask = (task) => {
  const tasks = loadData(STORAGE_KEYS.TASKS, []);
  tasks.push({
    ...task,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    completed: false
  });
  saveData(STORAGE_KEYS.TASKS, tasks);
};

export const getTasks = () => {
  return loadData(STORAGE_KEYS.TASKS, []);
};

export const updateTask = (taskId, updates) => {
  const tasks = getTasks();
  const updatedTasks = tasks.map((task) =>
    task.id === taskId ? { ...task, ...updates } : task
  );
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
  const clean = {
    id: link.id || Date.now(),
    name: String(link.name || ''),
    url: String(link.url || '')
  };
  links.push(clean);
  saveData('links', links);
  return clean;
};

export const getLinks = () => {
  return loadData('links', []);
};

export const deleteLink = (linkId) => {
  const links = getLinks();
  const filtered = links.filter((l) => l.id !== linkId);
  saveData('links', filtered);
};

export const getSettings = () => {
  return loadData(STORAGE_KEYS.SETTINGS, {
    askNextSessionPopup: true
  });
};

export const updateSettings = (updates) => {
  const current = getSettings();
  const next = { ...current, ...updates };
  saveData(STORAGE_KEYS.SETTINGS, next);
  return next;
};

export { STORAGE_KEYS };
