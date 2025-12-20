import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// Formater une date
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  return format(new Date(date), formatStr, { locale: fr });
};

// Obtenir le début de la semaine
export const getWeekStart = (date = new Date()) => {
  return startOfWeek(date, { weekStartsOn: 1 }); // Semaine commence le lundi
};

// Obtenir la fin de la semaine
export const getWeekEnd = (date = new Date()) => {
  return endOfWeek(date, { weekStartsOn: 1 });
};

// Obtenir tous les jours de la semaine
export const getWeekDays = (date = new Date()) => {
  const start = getWeekStart(date);
  const end = getWeekEnd(date);
  return eachDayOfInterval({ start, end });
};

// Vérifier si deux dates sont le même jour
export const isSameDayHelper = (date1, date2) => {
  return isSameDay(new Date(date1), new Date(date2));
};

// Convertir une durée en minutes en format lisible
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
};

// Obtenir l'heure actuelle formatée
export const getCurrentTime = () => {
  return format(new Date(), 'HH:mm');
};

// Calculer le temps écoulé depuis une date
export const getTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInMinutes = Math.floor((now - past) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'À l\'instant';
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Il y a ${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Hier';
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
  
  return formatDate(date, 'dd MMM');
};

// Noms des jours de la semaine
export const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// Noms complets des jours
export const FULL_DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];