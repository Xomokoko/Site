export const generatePlanning = (formData) => {
  const { courses, startDate, endDate, startTime, endTime, coursesPerDay, daysOfWeek } = formData;
  
  if (!startDate || !endDate) {
    console.error('Dates manquantes');
    return [];
  }
  
  const start = new Date(startDate + 'T12:00:00');
  const end = new Date(endDate + 'T12:00:00');
  
  const [startHour] = startTime.split(':').map(Number);
  const [endHour] = endTime.split(':').map(Number);
  
  console.log('Période:', start, 'à', end);
  console.log('Horaires:', startHour + 'h à', endHour + 'h');
  
  const availableDays = Object.entries(daysOfWeek)
    .filter(([_, selected]) => selected)
    .map(([day, _]) => getDayNumber(day));
  
  console.log('Jours disponibles:', availableDays);
  
  const coursesWithTime = courses.map(course => ({
    name: course.name,
    remainingMinutes: course.hours * 60,
    totalHours: course.hours
  }));
  
  const totalMinutes = coursesWithTime.reduce((sum, c) => sum + c.remainingMinutes, 0);
  console.log('Total à planifier:', Math.floor(totalMinutes / 60) + 'h' + (totalMinutes % 60) + 'min');
  
  const availableDates = [];
  let currentDate = new Date(start);
  
  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay();
    if (availableDays.includes(dayOfWeek)) {
      availableDates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  console.log('Dates disponibles:', availableDates.length, 'jours');
  
  const planning = [];
  let dateIndex = 0;
  let sessionCount = 0;
  
  while (dateIndex < availableDates.length) {
    const date = availableDates[dateIndex];
    let sessionsToday = 0;
    
    while (sessionsToday < coursesPerDay) {
      const courseToSchedule = coursesWithTime
        .filter(c => c.remainingMinutes > 0)
        .sort((a, b) => b.remainingMinutes - a.remainingMinutes)[0];
      
      if (!courseToSchedule) break;
      
      const sessionDuration = Math.min(
        courseToSchedule.remainingMinutes,
        120
      );
      
      const hourRange = endHour - startHour;
      const hourSlot = Math.floor((sessionsToday / coursesPerDay) * hourRange);
      const sessionHour = startHour + hourSlot;
      
      const sessionDate = new Date(date);
      sessionDate.setHours(sessionHour, 0, 0, 0);
      
      planning.push({
        id: `gen-${Date.now()}-${sessionCount}-${Math.random().toString(36).substr(2, 9)}`,
        subject: courseToSchedule.name,
        duration: sessionDuration,
        date: sessionDate.toISOString(),
        startTime: `${sessionHour.toString().padStart(2, '0')}:00`,
        description: 'Généré automatiquement'
      });
      
      courseToSchedule.remainingMinutes -= sessionDuration;
      
      console.log(courseToSchedule.name + ': ' + sessionDuration + 'min planifiées (reste ' + courseToSchedule.remainingMinutes + 'min)');
      
      sessionsToday++;
      sessionCount++;
    }
    
    dateIndex++;
    
    const allDone = coursesWithTime.every(c => c.remainingMinutes === 0);
    if (allDone) {
      console.log('Tous les cours sont planifiés');
      break;
    }
  }
  
  console.log('Planning créé:', planning.length, 'sessions');
  
  const remainingTime = coursesWithTime.reduce((sum, c) => sum + c.remainingMinutes, 0);
  if (remainingTime > 0) {
    const remainingHours = Math.floor(remainingTime / 60);
    const remainingMins = remainingTime % 60;
    console.warn(remainingHours + 'h' + remainingMins + 'min n\'ont pas pu être planifiées');
    alert('Attention: ' + remainingHours + 'h' + remainingMins + 'min d\'étude n\'ont pas pu être planifiées.\n\nSolutions:\n- Augmentez la période (plus de jours)\n- Augmentez le nombre de matières par jour\n- Les sessions sont limitées à 2h max');
  }
  
  const summary = planning.reduce((acc, session) => {
    if (!acc[session.subject]) {
      acc[session.subject] = { count: 0, totalTime: 0 };
    }
    acc[session.subject].count++;
    acc[session.subject].totalTime += session.duration;
    return acc;
  }, {});
  
  console.log('Résumé par matière:');
  Object.entries(summary).forEach(([subject, data]) => {
    const hours = Math.floor(data.totalTime / 60);
    const mins = data.totalTime % 60;
    console.log('  - ' + subject + ': ' + data.count + ' sessions, ' + hours + 'h' + mins + 'min');
  });
  
  return planning;
};

const getDayNumber = (dayName) => {
  const days = {
    'dimanche': 0,
    'lundi': 1,
    'mardi': 2,
    'mercredi': 3,
    'jeudi': 4,
    'vendredi': 5,
    'samedi': 6
  };
  return days[dayName.toLowerCase()];
};