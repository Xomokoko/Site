export const calculateTotalStudyTime = (sessions) => {
  return (sessions || []).filter((s) => !s?.isExam).reduce((total, session) => total + (session.duration || 0), 0);
};

export const calculateAverageStudyTime = (sessions, days = 7) => {
  const total = calculateTotalStudyTime(sessions);
  return Math.round(total / days);
};

export const calculateTimeBySubject = (sessions) => {
  const subjects = {};
  (sessions || []).forEach((session) => {
    if (session?.isExam) return;
    const subject = session.subject || 'Non spécifié';
    subjects[subject] = (subjects[subject] || 0) + (session.duration || 0);
  });
  return subjects;
};

export const getTopSubjects = (sessions, limit = 3) => {
  const timeBySubject = calculateTimeBySubject(sessions);
  const totalTime = Object.values(timeBySubject).reduce((sum, time) => sum + time, 0);

  return Object.entries(timeBySubject)
    .map(([subject, time]) => ({
      subject,
      time,
      percentage: totalTime > 0 ? ((time / totalTime) * 100).toFixed(1) : '0.0'
    }))
    .sort((a, b) => b.time - a.time)
    .slice(0, limit);
};

export const calculateWeeklyProgress = (sessions) => {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const weeklyData = days.map((day) => ({ day, minutes: 0 }));

  (sessions || []).forEach((session) => {
    if (session?.isExam) return;
    const date = new Date(session.date);
    const dayIndex = (date.getDay() + 6) % 7;
    weeklyData[dayIndex].minutes += session.duration || 0;
  });

  return weeklyData;
};

export const calculateStudyStreak = (sessions) => {
  const dates = (sessions || [])
    .filter((s) => !s?.isExam)
    .map((session) => new Date(session.date).toDateString());

  const uniqueDates = [...new Set(dates)];
  return uniqueDates.length;
};

export const calculateDailyGoal = (sessions, goalMinutes = 120) => {
  const today = new Date().toDateString();
  const todayTime = (sessions || [])
    .filter((s) => !s?.isExam)
    .filter((session) => new Date(session.date).toDateString() === today)
    .reduce((sum, session) => sum + (session.duration || 0), 0);

  return {
    current: todayTime,
    goal: goalMinutes,
    remaining: Math.max(0, goalMinutes - todayTime),
    percentage: goalMinutes > 0 ? Math.min(100, Math.round((todayTime / goalMinutes) * 100)) : 0
  };
};

export const calculateRecommendations = (sessions) => {
  const avgDaily = calculateAverageStudyTime(sessions, 7);
  let recommended = avgDaily;

  if (avgDaily < 60) recommended = 60;
  else if (avgDaily < 120) recommended = 120;
  else recommended = avgDaily + 30;

  return {
    current: avgDaily,
    recommended: Math.max(recommended, 60),
    increase: Math.max(0, recommended - avgDaily)
  };
};

export const formatMinutes = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h${mins < 10 ? '0' : ''}${mins}`;
};
