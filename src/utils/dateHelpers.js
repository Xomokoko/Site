import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  return format(new Date(date), formatStr, { locale: fr });
};

export const getWeekStart = (date = new Date()) => {
  return startOfWeek(date, { weekStartsOn: 1 });
};

export const getWeekEnd = (date = new Date()) => {
  return endOfWeek(date, { weekStartsOn: 1 });
};

export const getWeekDays = (date = new Date()) => {
  const start = getWeekStart(date);
  const end = getWeekEnd(date);
  return eachDayOfInterval({ start, end });
};

export const isSameDayHelper = (date1, date2) => {
  return isSameDay(new Date(date1), new Date(date2));
};

export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
};

export const getCurrentTime = () => {
  return format(new Date(), 'HH:mm');
};

export const getTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInMinutes = Math.floor((now - past) / (1000 * 60));

  if (diffInMinutes < 1) return "À l'instant";
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Il y a ${diffInHours}h`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Hier';
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`;

  return formatDate(date, 'dd MMM');
};

export const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
export const FULL_DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const SETTINGS_KEY = 'etudes_settings';

const loadTimeUnitMode = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed?.timeUnitMode === 'minutes' ? 'minutes' : 'auto';
  } catch {
    return 'auto';
  }
};

export const formatStudyTime = (minutes) => {
  const mode = loadTimeUnitMode();
  const m = Math.max(0, Number(minutes || 0));

  if (mode === 'minutes') return `${m}min`;

  const h = Math.floor(m / 60);
  const mins = m % 60;

  if (h === 0) return `${mins}min`;
  if (mins === 0) return `${h}h`;
  return `${h}h${mins < 10 ? '0' : ''}${mins}`;
};
