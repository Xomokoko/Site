// Gestion du stockage local des données d'étude

const STORAGE_KEYS = {
  STUDY_SESSIONS: 'studySessions',
  TASKS: 'tasks',
  SETTINGS: 'settings',
  STATS: 'stats'
};

// Sauvegarder des données
export const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    return false;
  }
};

// Récupérer des données
export const loadData = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
    return defaultValue;
  }
};

// Sauvegarder une session d'étude
export const saveStudySession = (session) => {
  const sessions = loadData(STORAGE_KEYS.STUDY_SESSIONS, []);
  sessions.push({
    ...session,
    id: Date.now(),
    date: new Date().toISOString()
  });
  saveData(STORAGE_KEYS.STUDY_SESSIONS, sessions);
};

// Récupérer toutes les sessions
export const getStudySessions = () => {
  return loadData(STORAGE_KEYS.STUDY_SESSIONS, []);
};

// Récupérer les sessions d'une période donnée
export const getSessionsByDateRange = (startDate, endDate) => {
  const sessions = getStudySessions();
  return sessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= startDate && sessionDate <= endDate;
  });
};

// Sauvegarder une tâche
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

// Récupérer toutes les tâches
export const getTasks = () => {
  return loadData(STORAGE_KEYS.TASKS, []);
};

// Mettre à jour une tâche
export const updateTask = (taskId, updates) => {
  const tasks = getTasks();
  const updatedTasks = tasks.map(task => 
    task.id === taskId ? { ...task, ...updates } : task
  );
  saveData(STORAGE_KEYS.TASKS, updatedTasks);
};

// Supprimer une tâche
export const deleteTask = (taskId) => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.id !== taskId);
  saveData(STORAGE_KEYS.TASKS, filteredTasks);
};

// Effacer toutes les données
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

export { STORAGE_KEYS };