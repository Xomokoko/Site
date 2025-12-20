// Fonctions de calcul pour les statistiques

// Calculer le temps total d'étude (en minutes)
export const calculateTotalStudyTime = (sessions) => {
  return sessions.reduce((total, session) => total + (session.duration || 0), 0);
};

// Calculer la moyenne du temps d'étude par jour
export const calculateAverageStudyTime = (sessions, days = 7) => {
  const total = calculateTotalStudyTime(sessions);
  return Math.round(total / days);
};

// Calculer le temps d'étude par matière
export const calculateTimeBySubject = (sessions) => {
  const subjects = {};
  
  sessions.forEach(session => {
    const subject = session.subject || 'Non spécifié';
    subjects[subject] = (subjects[subject] || 0) + (session.duration || 0);
  });
  
  return Object.entries(subjects).map(([name, time]) => ({
    name,
    time,
    percentage: 0 // Sera calculé après
  }));
};

// Calculer les pourcentages
export const calculatePercentages = (data) => {
  const total = data.reduce((sum, item) => sum + item.time, 0);
  return data.map(item => ({
    ...item,
    percentage: total > 0 ? Math.round((item.time / total) * 100) : 0
  }));
};

// Obtenir le top 3 des matières les plus étudiées
export const getTopSubjects = (sessions, limit = 3) => {
  const bySubject = calculateTimeBySubject(sessions);
  const withPercentages = calculatePercentages(bySubject);
  return withPercentages.sort((a, b) => b.time - a.time).slice(0, limit);
};

// Calculer les sessions par jour de la semaine
export const calculateSessionsByDay = (sessions) => {
  const dayStats = {
    0: { day: 'Dim', count: 0, time: 0 },
    1: { day: 'Lun', count: 0, time: 0 },
    2: { day: 'Mar', count: 0, time: 0 },
    3: { day: 'Mer', count: 0, time: 0 },
    4: { day: 'Jeu', count: 0, time: 0 },
    5: { day: 'Ven', count: 0, time: 0 },
    6: { day: 'Sam', count: 0, time: 0 }
  };
  
  sessions.forEach(session => {
    const dayOfWeek = new Date(session.date).getDay();
    dayStats[dayOfWeek].count++;
    dayStats[dayOfWeek].time += session.duration || 0;
  });
  
  return Object.values(dayStats);
};

// Calculer les tendances hebdomadaires
export const calculateWeeklyTrend = (sessions, currentWeek, previousWeek) => {
  const currentTotal = calculateTotalStudyTime(currentWeek);
  const previousTotal = calculateTotalStudyTime(previousWeek);
  
  if (previousTotal === 0) return { change: 0, direction: 'stable' };
  
  const percentChange = Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
  const direction = percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'stable';
  
  return {
    change: Math.abs(percentChange),
    direction,
    currentTotal,
    previousTotal
  };
};

// Calculer le nombre de jours consécutifs d'étude
export const calculateStreak = (sessions) => {
  if (sessions.length === 0) return 0;
  
  // Trier les sessions par date (plus récent d'abord)
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  // Grouper les sessions par jour
  const sessionsByDay = new Map();
  sortedSessions.forEach(session => {
    const date = new Date(session.date);
    date.setHours(0, 0, 0, 0);
    const dateKey = date.getTime();
    sessionsByDay.set(dateKey, true);
  });
  
  // Compter les jours consécutifs
  while (sessionsByDay.has(currentDate.getTime())) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return streak;
};

// Calculer des objectifs recommandés
export const calculateRecommendedGoals = (sessions) => {
  const avgDaily = calculateAverageStudyTime(sessions, 7);
  const recommended = Math.ceil(avgDaily * 1.2); // +20% de l'actuel
  
  return {
    current: avgDaily,
    recommended: Math.max(recommended, 60), // Minimum 60 min
    increase: Math.max(0, recommended - avgDaily)
  };
};

// Formater le temps pour l'affichage
export const formatMinutes = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h${mins < 10 ? '0' : ''}${mins}`;
};